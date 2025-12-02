"""Engagement models for property interactions, reviews, and analytics"""

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import (
    JSON,
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class PropertyFlick(Base):
    """Property flick (like) system for user engagement"""

    __tablename__ = "property_flicks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(
        UUID(as_uuid=True),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships - use string references to avoid circular imports
    property = relationship("Property", back_populates="flicks")
    user = relationship("User", back_populates="property_flicks")

    __table_args__ = (
        UniqueConstraint("property_id", "user_id", name="uq_property_flick"),
    )

    def __repr__(self):
        return (
            f"<PropertyFlick(property_id={self.property_id}, user_id={self.user_id})>"
        )


class PropertyClip(Base):
    """Property clip (save) system for user engagement"""

    __tablename__ = "property_clips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(
        UUID(as_uuid=True),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships - use string references to avoid circular imports
    property = relationship("Property", back_populates="clips")
    user = relationship("User", back_populates="property_clips")

    __table_args__ = (
        UniqueConstraint("property_id", "user_id", name="uq_property_clip"),
    )

    def __repr__(self):
        return f"<PropertyClip(property_id={self.property_id}, user_id={self.user_id})>"


class PropertyReport(Base):
    """Property reporting system for content moderation"""

    __tablename__ = "property_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(
        UUID(as_uuid=True),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    reported_by = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    reason = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="pending")
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    reviewed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships - use string references to avoid circular imports
    property = relationship("Property", back_populates="reports")
    reporter = relationship(
        "User", foreign_keys=[reported_by], back_populates="property_reports"
    )
    reviewer = relationship("User", foreign_keys=[reviewed_by])

    __table_args__ = (
        CheckConstraint(
            "reason IN ('spam', 'fake', 'duplicate', 'wrong_info', 'inappropriate', 'other')",
            name="check_property_report_reason",
        ),
        CheckConstraint(
            "status IN ('pending', 'reviewed', 'resolved', 'dismissed')",
            name="check_property_report_status",
        ),
    )

    def __repr__(self):
        return f"<PropertyReport(property_id={self.property_id}, reason={self.reason}, status={self.status})>"


class AgentReview(Base):
    """Agent review and rating system"""

    __tablename__ = "agent_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    tenant_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    inspection_id = Column(
        UUID(as_uuid=True), ForeignKey("inspections.id", ondelete="SET NULL")
    )
    rating = Column(Integer, nullable=False)
    title = Column(String(200))
    comment = Column(Text)
    response = Column(Text)
    responded_at = Column(DateTime(timezone=True))
    is_verified = Column(Boolean, default=False)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships - use string references to avoid circular imports
    agent = relationship(
        "User", foreign_keys=[agent_id], back_populates="agent_reviews_received"
    )
    tenant = relationship(
        "User", foreign_keys=[tenant_id], back_populates="agent_reviews_given"
    )
    inspection = relationship("Inspection", back_populates="review")

    __table_args__ = (
        UniqueConstraint(
            "agent_id", "tenant_id", "inspection_id", name="uq_agent_review"
        ),
        CheckConstraint(
            "rating >= 1 AND rating <= 5", name="check_agent_review_rating"
        ),
    )

    def __repr__(self):
        return f"<AgentReview(agent_id={self.agent_id}, tenant_id={self.tenant_id}, rating={self.rating})>"


class Notification(Base):
    """User notification system"""

    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(JSON, default={})
    is_read = Column(Boolean, default=False)
    action_url = Column(String(500))
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships - use string references to avoid circular imports
    user = relationship("User", back_populates="notifications")

    __table_args__ = (
        CheckConstraint(
            "type IN ("
            "'property_expired', 'inspection_requested', 'inspection_confirmed', "
            "'payment_released', 'new_message', 'verification_approved', "
            "'verification_rejected', 'subscription_expiring', 'new_review', "
            "'property_featured', 'promo_code_used', 'system_announcement'"
            ")",
            name="check_notification_type",
        ),
    )

    def __repr__(self):
        return f"<Notification(user_id={self.user_id}, type={self.type}, is_read={self.is_read})>"


class PlatformMetric(Base):
    """Platform analytics and metrics tracking"""

    __tablename__ = "platform_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_date = Column(DateTime, nullable=False)
    metric_type = Column(String(50), nullable=False)
    metric_value = Column(Numeric(15, 4), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("metric_date", "metric_type", name="uq_platform_metric"),
        CheckConstraint(
            "metric_type IN ("
            "'daily_active_users', 'monthly_active_users', 'new_registrations', "
            "'property_listings', 'completed_inspections', 'total_revenue', "
            "'agent_verifications', 'user_engagement', 'property_views'"
            ")",
            name="check_platform_metric_type",
        ),
    )

    def __repr__(self):
        return f"<PlatformMetric(date={self.metric_date}, type={self.metric_type}, value={self.metric_value})>"


class AgentVerificationAttempt(Base):
    """Enhanced agent verification attempt tracking"""

    __tablename__ = "agent_verification_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    attempt_type = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False)
    error_message = Column(Text)
    attempt_count = Column(Integer, default=1)
    last_attempt_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships - use string references to avoid circular imports
    agent = relationship("User", back_populates="verification_attempts")

    __table_args__ = (
        CheckConstraint(
            "attempt_type IN ('bvn', 'nin')", name="check_verification_attempt_type"
        ),
        CheckConstraint(
            "status IN ('success', 'failed', 'pending')",
            name="check_verification_attempt_status",
        ),
    )

    def __repr__(self):
        return f"<AgentVerificationAttempt(agent_id={self.agent_id}, type={self.attempt_type}, status={self.status})>"


class PropertyShare(Base):
    """Property sharing and referral tracking"""

    __tablename__ = "property_shares"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(
        UUID(as_uuid=True),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    shared_by = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    shared_with_email = Column(String(255))
    shared_with_phone = Column(String(20))
    share_method = Column(String(20))
    share_token = Column(String(100), unique=True)
    clicked_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships - use string references to avoid circular imports
    property = relationship("Property", back_populates="shares")
    sharer = relationship("User", back_populates="property_shares")

    __table_args__ = (
        CheckConstraint(
            "share_method IN ('link', 'whatsapp', 'email', 'sms')",
            name="check_property_share_method",
        ),
    )

    def __repr__(self):
        return f"<PropertyShare(property_id={self.property_id}, shared_by={self.shared_by}, method={self.share_method})>"


class AgentPerformance(Base):
    """Agent performance metrics and analytics"""

    __tablename__ = "agent_performance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    total_listings = Column(Integer, default=0)
    active_listings = Column(Integer, default=0)
    expired_listings = Column(Integer, default=0)
    total_views = Column(Integer, default=0)
    total_flicks = Column(Integer, default=0)
    total_clips = Column(Integer, default=0)
    inspection_requests = Column(Integer, default=0)
    completed_inspections = Column(Integer, default=0)
    conversion_rate = Column(Numeric(5, 4), default=0.0)
    avg_response_time_minutes = Column(Numeric(8, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships - use string references to avoid circular imports
    agent = relationship("User", back_populates="performance_metrics")

    __table_args__ = (
        UniqueConstraint(
            "agent_id", "period_start", "period_end", name="uq_agent_performance"
        ),
    )

    def __repr__(self):
        return f"<AgentPerformance(agent_id={self.agent_id}, period={self.period_start} to {self.period_end})>"
