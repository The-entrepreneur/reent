"""Inspection model for property inspection requests and tracking"""

import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class Inspection(Base):
    """Inspection model for property inspection requests and tracking"""

    __tablename__ = "inspections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(
        UUID(as_uuid=True),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    tenant_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    agent_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    status = Column(
        String(20),
        default="pending",
        nullable=False,
    )
    inspection_fee = Column(Integer, nullable=False)  # in kobo
    scheduled_date = Column(DateTime(timezone=True))
    payment_status = Column(
        String(20),
        default="pending",
        nullable=False,
    )
    gateway_reference = Column(String(255))
    confidence_score = Column(Numeric(3, 2), default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    property = relationship("Property", back_populates="inspections")
    tenant = relationship(
        "User", foreign_keys=[tenant_id], back_populates="inspections_as_tenant"
    )
    agent = relationship(
        "User", foreign_keys=[agent_id], back_populates="inspections_as_agent"
    )
    review = relationship("AgentReview", back_populates="inspection", uselist=False)
    proofs = relationship(
        "InspectionProof", back_populates="inspection", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Inspection(id={self.id}, property_id={self.property_id}, status={self.status})>"


class InspectionProof(Base):
    """Inspection proof for geolocation and photo validation"""

    __tablename__ = "inspection_proofs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inspection_id = Column(
        UUID(as_uuid=True),
        ForeignKey("inspections.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    proof_type = Column(String(20), nullable=False)
    photo_url = Column(String(500))
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(10, 8))
    distance_meters = Column(Numeric(8, 2))
    validation_status = Column(
        String(20),
        default="pending",
        nullable=False,
    )
    exif_data = Column(String)  # JSON string of EXIF metadata
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    inspection = relationship("Inspection", back_populates="proofs")
    user = relationship("User", back_populates="inspection_proofs")

    def __repr__(self):
        return f"<InspectionProof(inspection_id={self.inspection_id}, proof_type={self.proof_type}, status={self.validation_status})>"
