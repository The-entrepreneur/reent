"""Property model for property listings with auto-expiry"""

import uuid
from datetime import datetime, timedelta

from sqlalchemy import Boolean, Column, DateTime, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class Property(Base):
    """Property model for property listings with auto-expiry"""

    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    property_type = Column(
        String(50), nullable=False
    )  # apartment, house, studio, commercial, land
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    price_monthly = Column(Integer, nullable=False)  # in kobo (Nigerian currency)
    state = Column(String(100), nullable=False, index=True)
    lga = Column(String(100), nullable=False)
    address = Column(Text)
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(10, 8))
    media_urls = Column(ARRAY(Text))  # Array of media URLs
    is_active = Column(Boolean, default=True, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
    view_count_7d = Column(Integer, default=0)
    view_count_total = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    flicks = relationship(
        "PropertyFlick", back_populates="property", cascade="all, delete-orphan"
    )
    clips = relationship(
        "PropertyClip", back_populates="property", cascade="all, delete-orphan"
    )
    reports = relationship(
        "PropertyReport", back_populates="property", cascade="all, delete-orphan"
    )
    shares = relationship(
        "PropertyShare", back_populates="property", cascade="all, delete-orphan"
    )
    inspections = relationship(
        "Inspection", back_populates="property", cascade="all, delete-orphan"
    )

    def __init__(self, *args, **kwargs):
        """Initialize property with default 14-day expiry"""
        super().__init__(*args, **kwargs)
        if not self.expires_at:
            self.expires_at = datetime.utcnow() + timedelta(days=14)

    def __repr__(self):
        return f"<Property(id={self.id}, title={self.title}, state={self.state})>"

    @property
    def is_expired(self):
        """Check if property listing has expired"""
        return datetime.utcnow() > self.expires_at

    @property
    def should_auto_extend(self):
        """Check if property should auto-extend based on views"""
        return self.view_count_7d > 20 and not self.is_expired


class PropertyView(Base):
    """Property views tracking for feed performance"""

    __tablename__ = "property_views"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), index=True)
    viewed_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    def __repr__(self):
        return f"<PropertyView(property_id={self.property_id}, user_id={self.user_id})>"
