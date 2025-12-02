"""Pydantic schemas for verification API"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class VerificationInitiate(BaseModel):
    """Schema for initiating BVN and NIN verification"""

    bvn: str = Field(..., min_length=11, max_length=11, description="11-digit BVN")
    phone: str = Field(..., min_length=10, max_length=15, description="Phone number")
    nin: str = Field(..., min_length=11, max_length=11, description="11-digit NIN")
    dob: str = Field(..., description="Date of birth (YYYY-MM-DD format)")

    class Config:
        json_schema_extra = {
            "example": {
                "bvn": "12345678901",
                "phone": "08012345678",
                "nin": "98765432109",
                "dob": "1990-01-15",
            }
        }


class VerificationResponse(BaseModel):
    """Schema for verification response"""

    success: bool = Field(..., description="Overall verification success")
    message: str = Field(..., description="Verification result message")
    bvn_verified: bool = Field(..., description="BVN verification status")
    nin_verified: bool = Field(..., description="NIN verification status")
    overall_status: str = Field(
        ..., description="Overall status (pending, verified, failed, locked)"
    )
    details: Dict[str, Any] = Field(
        default_factory=dict, description="Additional verification details"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Verification completed successfully",
                "bvn_verified": True,
                "nin_verified": True,
                "overall_status": "verified",
                "details": {
                    "verified_state": "Lagos",
                    "verified_lga": "Ikeja",
                    "bvn_full_name": "John Doe",
                    "nin_full_name": "John Doe",
                    "credibility_score": 50,
                    "verification_badge_visible": True,
                },
            }
        }


class VerificationStatusResponse(BaseModel):
    """Schema for verification status response"""

    verification_status: str = Field(..., description="Current verification status")
    credibility_score: int = Field(..., description="Agent credibility score (0-100)")
    verification_badge_visible: bool = Field(
        ..., description="Whether verification badge is visible"
    )
    recent_attempts: List[Dict[str, Any]] = Field(
        default_factory=list, description="Recent verification attempts"
    )
    is_locked: bool = Field(..., description="Whether verification is currently locked")

    class Config:
        json_schema_extra = {
            "example": {
                "verification_status": "verified",
                "credibility_score": 50,
                "verification_badge_visible": True,
                "recent_attempts": [
                    {
                        "attempt_type": "bvn",
                        "status": "success",
                        "error_message": None,
                        "created_at": "2024-01-15T10:30:00Z",
                    }
                ],
                "is_locked": False,
            }
        }


class VerificationAttempt(BaseModel):
    """Schema for individual verification attempt"""

    id: str = Field(..., description="Attempt ID")
    attempt_type: str = Field(..., description="Type of attempt (bvn, nin)")
    status: str = Field(..., description="Attempt status")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    attempt_count: int = Field(..., description="Number of attempts")
    created_at: Optional[str] = Field(None, description="Creation timestamp")
    last_attempt_at: Optional[str] = Field(None, description="Last attempt timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "attempt_type": "bvn",
                "status": "success",
                "error_message": None,
                "attempt_count": 1,
                "created_at": "2024-01-15T10:30:00Z",
                "last_attempt_at": "2024-01-15T10:30:00Z",
            }
        }


class VerificationLockStatus(BaseModel):
    """Schema for verification lock status"""

    is_locked: bool = Field(..., description="Whether verification is locked")
    locked_until: Optional[str] = Field(None, description="Lock expiry timestamp")
    failed_attempts: int = Field(..., description="Number of failed attempts")
    max_attempts: int = Field(..., description="Maximum allowed attempts")

    class Config:
        json_schema_extra = {
            "example": {
                "is_locked": False,
                "locked_until": None,
                "failed_attempts": 0,
                "max_attempts": 3,
            }
        }
