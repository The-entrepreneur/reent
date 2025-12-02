# Models Package
# This package contains SQLAlchemy database models for the Reent SaaS platform

# Import all models to ensure they're properly registered
from app.models.base import Base, get_db
from app.models.engagement import (
    AgentPerformance,
    AgentReview,
    AgentVerificationAttempt,
    Notification,
    PlatformMetric,
    PropertyClip,
    PropertyFlick,
    PropertyReport,
    PropertyShare,
)
from app.models.inspection import Inspection, InspectionProof
from app.models.property import Property, PropertyView
from app.models.user import RefreshToken, User

# Export all models for easy import
__all__ = [
    "Base",
    "get_db",
    "User",
    "RefreshToken",
    "Property",
    "PropertyView",
    "PropertyFlick",
    "PropertyClip",
    "PropertyReport",
    "AgentReview",
    "Notification",
    "PlatformMetric",
    "AgentVerificationAttempt",
    "PropertyShare",
    "AgentPerformance",
    "Inspection",
    "InspectionProof",
]
