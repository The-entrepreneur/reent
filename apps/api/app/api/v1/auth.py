"""Authentication API endpoints"""

import uuid
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.auth import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    get_user_id_from_token,
    verify_password,
    verify_token,
)
from app.models.base import get_db
from app.models.user import RefreshToken, User
from app.schemas.user import (
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshTokenRequest,
    Token,
    UserCreate,
    UserLogin,
    UserResponse,
)

router = APIRouter()
security = HTTPBearer()


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register(user_data: UserCreate, db: Session = Depends(get_db)) -> Any:
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        password_hash=hashed_password,
        phone=user_data.phone,
        role=user_data.role,
        business_name=user_data.business_name,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        role=user.role,
        business_name=user.business_name,
        is_active=user.is_active,
        email_verified=user.email_verified,
        phone_verified=user.phone_verified,
        created_at=user.created_at,
        last_login=user.last_login,
    )


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)) -> Any:
    """
    Login user and return JWT tokens
    """
    # Find user by email
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated",
        )

    # Update last login
    user.last_login = func.now()
    db.commit()

    # Create tokens
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
    access_token = create_access_token(token_data)
    # create_refresh_token returns (token, jti) when asked; persist jti for efficient lookups
    refresh_token, refresh_jti = create_refresh_token(token_data, return_jti=True)

    # Store refresh token in database (persist jti for direct lookup / revocation)
    refresh_token_hash = get_password_hash(refresh_token)
    db_refresh_token = RefreshToken(
        user_id=user.id,
        jti=refresh_jti,
        token_hash=refresh_token_hash,
        expires_at=func.now() + timedelta(days=30),
    )
    db.add(db_refresh_token)
    db.commit()

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=24 * 60,  # 24 hours in minutes
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: RefreshTokenRequest, db: Session = Depends(get_db)
) -> Any:
    """
    Refresh access token using refresh token
    """
    try:
        # Verify refresh token
        payload = verify_token(request.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        # Verify refresh token exists in database
        # Prefer JTI-based lookup when available for O(1) DB lookup and clear revocation semantics.
        # Fall back to scanning the user's active refresh tokens and verifying via bcrypt.
        try:
            user_uuid = uuid.UUID(user_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        db_refresh_token = None
        token_jti = payload.get("jti")
        if token_jti:
            # Try a direct lookup by jti first
            db_rt = (
                db.query(RefreshToken)
                .filter(
                    RefreshToken.jti == token_jti,
                    RefreshToken.expires_at > func.now(),
                )
                .first()
            )
            if db_rt and verify_password(request.refresh_token, db_rt.token_hash):
                db_refresh_token = db_rt

        if not db_refresh_token:
            # Fallback: verify against all active refresh tokens for the user
            db_refresh_tokens = (
                db.query(RefreshToken)
                .filter(
                    RefreshToken.user_id == user_uuid,
                    RefreshToken.expires_at > func.now(),
                )
                .all()
            )
            for rt in db_refresh_tokens:
                if verify_password(request.refresh_token, rt.token_hash):
                    db_refresh_token = rt
                    break

        if not db_refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        # Get user
        user = db.query(User).filter(User.id == db_refresh_token.user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        # Create new tokens
        token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
        new_access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token(token_data)

        # Update refresh token in database
        new_refresh_token_hash = get_password_hash(new_refresh_token)
        db_refresh_token.token_hash = new_refresh_token_hash
        db_refresh_token.expires_at = func.now() + timedelta(days=30)
        db.commit()

        return Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=24 * 60,  # 24 hours in minutes
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed",
        )


@router.post("/logout")
async def logout(token: str = Depends(security), db: Session = Depends(get_db)) -> Any:
    """
    Logout user by invalidating refresh token
    """
    try:
        user_id = get_user_id_from_token(token.credentials)

        # Delete all refresh tokens for this user
        db.query(RefreshToken).filter(RefreshToken.user_id == user_id).delete()
        db.commit()

        return {"message": "Successfully logged out"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed",
        )


@router.post("/password-reset-request")
async def password_reset_request(
    request: PasswordResetRequest, db: Session = Depends(get_db)
) -> Any:
    """
    Request password reset (send email with reset token)
    """
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        # In a real implementation, you would:
        # 1. Generate a reset token
        # 2. Send email with reset link
        # 3. Store token in database with expiry
        pass

    # Always return success to prevent email enumeration
    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/password-reset-confirm")
async def password_reset_confirm(
    request: PasswordResetConfirm, db: Session = Depends(get_db)
) -> Any:
    """
    Confirm password reset with token
    """
    # In a real implementation, you would:
    # 1. Verify the reset token
    # 2. Update the user's password
    # 3. Invalidate the reset token

    # For now, return a placeholder response
    return {"message": "Password reset feature will be implemented with email service"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    token: str = Depends(security), db: Session = Depends(get_db)
) -> Any:
    """
    Get current user profile
    """
    try:
        user_id = get_user_id_from_token(token.credentials)
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return UserResponse(
            id=user.id,
            email=user.email,
            phone=user.phone,
            role=user.role,
            business_name=user.business_name,
            is_active=user.is_active,
            email_verified=user.email_verified,
            phone_verified=user.phone_verified,
            created_at=user.created_at,
            last_login=user.last_login,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user profile",
        )
