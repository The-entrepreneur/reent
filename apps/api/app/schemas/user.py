"""Pydantic schemas for user authentication and management"""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, validator


class UserBase(BaseModel):
    """Base user schema"""

    email: EmailStr
    phone: Optional[str] = None
    role: str


class UserCreate(UserBase):
    """Schema for user registration"""

    password: str
    business_name: Optional[str] = None

    @validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v

    @validator("role")
    def validate_role(cls, v):
        if v not in ["tenant", "agent", "admin"]:
            raise ValueError("Role must be tenant, agent, or admin")
        return v

    @validator("phone")
    def validate_phone(cls, v):
        if v:
            # Basic Nigerian phone validation
            import re

            pattern = r"^(\+234|234|0)[789][01]\d{8}$"
            if not re.match(pattern, v.replace(" ", "")):
                raise ValueError("Invalid Nigerian phone number format")
        return v


class UserLogin(BaseModel):
    """Schema for user login"""

    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response (without sensitive data)"""

    id: uuid.UUID
    business_name: Optional[str]
    is_active: bool
    email_verified: bool
    phone_verified: bool
    created_at: datetime
    last_login: Optional[datetime]

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response"""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Schema for token payload data"""

    user_id: Optional[uuid.UUID] = None
    email: Optional[str] = None
    role: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request"""

    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Schema for password reset request"""

    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation"""

    token: str
    new_password: str

    @validator("new_password")
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserUpdate(BaseModel):
    """Schema for user profile update"""

    phone: Optional[str] = None
    business_name: Optional[str] = None

    @validator("phone")
    def validate_phone(cls, v):
        if v:
            import re

            pattern = r"^(\+234|234|0)[789][01]\d{8}$"
            if not re.match(pattern, v.replace(" ", "")):
                raise ValueError("Invalid Nigerian phone number format")
        return v
