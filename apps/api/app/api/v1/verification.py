"""Verification API endpoints for BVN and NIN verification"""

from datetime import datetime, timedelta
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.security import get_password_hash
from app.models.base import get_db
from app.models.engagement import AgentVerificationAttempt
from app.models.user import User
from app.schemas.user import UserResponse
from app.schemas.verification import (
    VerificationInitiate,
    VerificationResponse,
    VerificationStatusResponse,
)
from app.services.verification import YouverifyService

router = APIRouter()
security = HTTPBearer()
youverify_service = YouverifyService()


@router.post(
    "/initiate", response_model=VerificationResponse, status_code=status.HTTP_200_OK
)
async def initiate_verification(
    verification_data: VerificationInitiate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Initiate BVN and NIN verification for agent

    Requires:
    - Agent role
    - Not locked out due to failed attempts
    - Valid BVN and NIN data
    """
    # Check if user is an agent
    if current_user.role != "agent":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agents can initiate verification",
        )

    # Check if verification is locked
    if youverify_service._check_verification_lock(current_user.id, db):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Verification locked for 24 hours due to multiple failed attempts",
        )

    try:
        # Verify BVN first
        bvn_result = await youverify_service.verify_bvn(
            bvn=verification_data.bvn,
            phone=verification_data.phone,
            db=db,
            agent_id=current_user.id,
        )

        if not bvn_result.get("verified", False):
            return VerificationResponse(
                success=False,
                message="BVN verification failed",
                bvn_verified=False,
                nin_verified=False,
                overall_status="failed",
                details={
                    "bvn_error": bvn_result.get(
                        "error", "Unknown BVN verification error"
                    ),
                    "phone_match": bvn_result.get("phone_match", False),
                    "name_match_score": bvn_result.get("name_match_score", 0),
                },
            )

        # If BVN succeeds, verify NIN
        nin_result = await youverify_service.verify_nin(
            nin=verification_data.nin,
            dob=verification_data.dob,
            db=db,
            agent_id=current_user.id,
        )

        if not nin_result.get("verified", False):
            return VerificationResponse(
                success=False,
                message="NIN verification failed",
                bvn_verified=True,
                nin_verified=False,
                overall_status="failed",
                details={
                    "nin_error": nin_result.get(
                        "error", "Unknown NIN verification error"
                    ),
                    "dob_match": nin_result.get("dob_match", False),
                },
            )

        # Both verifications successful - update agent verification status
        user = db.query(User).filter(User.id == current_user.id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        # Update agent verification status
        # Note: We need to import and use the agent_verifications table
        # For now, we'll store the hashed values and update the status

        # Hash BVN and NIN for storage (bcrypt)
        bvn_hash = get_password_hash(verification_data.bvn)
        nin_hash = get_password_hash(verification_data.nin)

        # Get verified state and LGA from NIN response
        verified_state = nin_result.get("state", "")
        verified_lga = nin_result.get("lga", "")

        # TODO: Update agent_verifications table with the new status
        # This requires importing the AgentVerification model
        # For now, we'll return success with the verification data

        return VerificationResponse(
            success=True,
            message="Verification completed successfully",
            bvn_verified=True,
            nin_verified=True,
            overall_status="verified",
            details={
                "verified_state": verified_state,
                "verified_lga": verified_lga,
                "bvn_full_name": bvn_result.get("full_name", ""),
                "nin_full_name": nin_result.get("full_name", ""),
                "credibility_score": 50,  # Default score after verification
                "verification_badge_visible": True,
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification process failed: {str(e)}",
        )


@router.get(
    "/status", response_model=VerificationStatusResponse, status_code=status.HTTP_200_OK
)
async def get_verification_status(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get current verification status for agent

    Returns:
    - Verification status
    - Credibility score
    - Badge visibility
    - Recent attempts
    """
    # Check if user is an agent
    if current_user.role != "agent":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agents can check verification status",
        )

    try:
        # Get recent verification attempts (last 7 days)
        cutoff_time = datetime.utcnow() - timedelta(days=7)

        recent_attempts = (
            db.query(AgentVerificationAttempt)
            .filter(
                AgentVerificationAttempt.agent_id == current_user.id,
                AgentVerificationAttempt.created_at >= cutoff_time,
            )
            .order_by(AgentVerificationAttempt.created_at.desc())
            .limit(10)
            .all()
        )

        # Format recent attempts for response
        attempts_data = []
        for attempt in recent_attempts:
            attempts_data.append(
                {
                    "attempt_type": attempt.attempt_type,
                    "status": attempt.status,
                    "error_message": attempt.error_message,
                    "created_at": attempt.created_at.isoformat()
                    if attempt.created_at
                    else None,
                }
            )

        # TODO: Get actual verification status from agent_verifications table
        # For now, return default status
        return VerificationStatusResponse(
            verification_status="pending",  # Default - should come from database
            credibility_score=0,  # Default - should come from database
            verification_badge_visible=False,  # Default - should come from database
            recent_attempts=attempts_data,
            is_locked=youverify_service._check_verification_lock(current_user.id, db),
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get verification status: {str(e)}",
        )


@router.get("/attempts", response_model=Dict, status_code=status.HTTP_200_OK)
async def get_verification_attempts(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get detailed verification attempt history for agent

    Returns comprehensive history of all verification attempts
    """
    # Check if user is an agent
    if current_user.role != "agent":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agents can view verification attempts",
        )

    try:
        # Get all verification attempts for this agent
        attempts = (
            db.query(AgentVerificationAttempt)
            .filter(AgentVerificationAttempt.agent_id == current_user.id)
            .order_by(AgentVerificationAttempt.created_at.desc())
            .all()
        )

        # Format attempts for response
        attempts_data = []
        for attempt in attempts:
            attempts_data.append(
                {
                    "id": str(attempt.id),
                    "attempt_type": attempt.attempt_type,
                    "status": attempt.status,
                    "error_message": attempt.error_message,
                    "attempt_count": attempt.attempt_count,
                    "created_at": attempt.created_at.isoformat()
                    if attempt.created_at
                    else None,
                    "last_attempt_at": attempt.last_attempt_at.isoformat()
                    if attempt.last_attempt_at
                    else None,
                }
            )

        return {
            "agent_id": current_user.id,
            "total_attempts": len(attempts),
            "attempts": attempts_data,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get verification attempts: {str(e)}",
        )
