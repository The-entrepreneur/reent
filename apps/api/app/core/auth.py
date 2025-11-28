"""Authentication utilities for JWT and password hashing"""

import uuid
from datetime import datetime, timedelta
from typing import Optional

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.base import get_db
from app.models.user import User
from app.schemas.user import UserResponse

# JWT configuration
ALGORITHM = settings.JWT_ALGORITHM
SECRET_KEY = settings.JWT_SECRET
ACCESS_TOKEN_EXPIRE_MINUTES = settings.JWT_EXPIRATION_MINUTES


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash using bcrypt"""
    try:
        # Check if the hash is in bcrypt format
        if hashed_password.startswith("$2b$"):
            return bcrypt.checkpw(
                plain_password.encode("utf-8"), hashed_password.encode("utf-8")
            )
        else:
            # If not bcrypt format, cannot verify
            return False

    except Exception as e:
        print(f"Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt with proper error handling"""
    try:
        # Ensure password is not too long for bcrypt (72 bytes max)
        if len(password.encode("utf-8")) > 72:
            password = password[:72]

        # Generate salt and hash using bcrypt
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed.decode("utf-8")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password hashing failed: {str(e)}",
        )


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, return_jti: bool = False):
    """Create a JWT refresh token (30 days expiry) and include a JTI (JWT ID) claim.

    - By default this function remains backwards compatible and returns the encoded JWT string.
    - If `return_jti=True` it returns a tuple of (encoded_jwt, jti) so callers can persist the jti
      alongside the hashed token in storage for direct lookups and revocation.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)

    # Generate a unique JWT ID (jti) for token identification and rotation
    jti = str(uuid.uuid4())

    # Add standard claims including jti and token type
    to_encode.update({"exp": expire, "type": "refresh", "jti": jti})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    if return_jti:
        return encoded_jwt, jti

    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def generate_referral_code() -> str:
    """Generate a unique referral code for users"""
    return str(uuid.uuid4())[:8].upper()


def validate_email(email: str) -> bool:
    """Validate email format"""
    import re

    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """Validate Nigerian phone number format"""
    import re

    # Nigerian phone number pattern (supports +234, 234, 0 prefixes)
    pattern = r"^(\+234|234|0)[789][01]\d{8}$"
    return bool(re.match(pattern, phone.replace(" ", "")))


def get_user_id_from_token(token: str) -> uuid.UUID:
    """Extract user ID from JWT token"""
    payload = verify_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    return uuid.UUID(user_id)


def get_user_role_from_token(token: str) -> str:
    """Extract user role from JWT token"""
    payload = verify_token(token)
    role = payload.get("role")
    if not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Role not found in token",
        )
    return role


def validate_password_strength(password: str) -> bool:
    """Validate password meets security requirements"""
    if len(password) < 8:
        return False

    # Check for at least one uppercase, one lowercase, one digit
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)

    return has_upper and has_lower and has_digit


def is_bcrypt_hash(password_hash: str) -> bool:
    """Check if a password hash is in bcrypt format"""
    return password_hash.startswith("$2b$")


def get_current_user(
    token: str = Depends(HTTPBearer()), db: Session = Depends(get_db)
) -> UserResponse:
    """Get current authenticated user from JWT token"""
    try:
        user_id = get_user_id_from_token(token.credentials)
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is deactivated",
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
            detail="Failed to get current user",
        )
