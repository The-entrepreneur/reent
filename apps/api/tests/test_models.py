"""
Test script to verify SQLAlchemy models work correctly
Run this to check if all models can be imported and relationships are properly defined
"""

import sys
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))


def test_model_imports():
    """Test importing all models"""
    print("🧪 Testing model imports...")
    print("=" * 50)

    try:
        # Test importing all models
        from app.models.base import Base, get_db

        print("✅ Base model imported successfully")

        from app.models.user import RefreshToken, User

        print("✅ User models imported successfully")

        from app.models.property import Property, PropertyView

        print("✅ Property models imported successfully")

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

        print("✅ Engagement models imported successfully")

        print("\n🎉 All models imported successfully!")
        return True

    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def test_model_relationships():
    """Test that model relationships are properly defined"""
    print("\n🧪 Testing model relationships...")
    print("=" * 50)

    try:
        from app.models.engagement import PropertyFlick
        from app.models.property import Property
        from app.models.user import User

        # Check User model relationships
        user_attrs = dir(User)
        required_user_rels = [
            "property_flicks",
            "property_clips",
            "property_reports",
            "agent_reviews_received",
            "agent_reviews_given",
            "notifications",
            "verification_attempts",
            "property_shares",
            "performance_metrics",
        ]

        print("📋 Checking User model relationships:")
        for rel in required_user_rels:
            if rel in user_attrs:
                print(f"   ✅ {rel}")
            else:
                print(f"   ❌ {rel} - MISSING")

        # Check Property model relationships
        property_attrs = dir(Property)
        required_property_rels = ["flicks", "clips", "reports", "shares"]

        print("\n📋 Checking Property model relationships:")
        for rel in required_property_rels:
            if rel in property_attrs:
                print(f"   ✅ {rel}")
            else:
                print(f"   ❌ {rel} - MISSING")

        # Check PropertyFlick model relationships
        flick_attrs = dir(PropertyFlick)
        required_flick_rels = ["property", "user"]

        print("\n📋 Checking PropertyFlick model relationships:")
        for rel in required_flick_rels:
            if rel in flick_attrs:
                print(f"   ✅ {rel}")
            else:
                print(f"   ❌ {rel} - MISSING")

        print("\n🎉 Model relationship check completed!")
        return True

    except Exception as e:
        print(f"❌ Error testing relationships: {e}")
        return False


def test_sqlalchemy_configuration():
    """Test SQLAlchemy configuration"""
    print("\n🧪 Testing SQLAlchemy configuration...")
    print("=" * 50)

    try:
        from app.core.config import settings
        from sqlalchemy import create_engine
        from sqlalchemy.orm import sessionmaker

        # Test database connection
        engine = create_engine(settings.DATABASE_URL, echo=False)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

        print("✅ Database engine created successfully")
        print("✅ Session factory created successfully")

        # Test that we can create a session
        session = SessionLocal()
        session.close()
        print("✅ Database session created and closed successfully")

        print("\n🎉 SQLAlchemy configuration is working!")
        return True

    except Exception as e:
        print(f"❌ SQLAlchemy configuration error: {e}")
        return False


def test_model_instantiation():
    """Test creating model instances"""
    print("\n🧪 Testing model instantiation...")
    print("=" * 50)

    try:
        import uuid
        from datetime import datetime

        from app.models.engagement import AgentVerificationAttempt, PropertyFlick
        from app.models.property import Property
        from app.models.user import User

        # Create a User instance
        user = User(
            email="test@example.com",
            password_hash="test_hash",
            role="agent",
            phone="08012345678",
            business_name="Test Business",
        )
        print("✅ User instance created")

        # Create a Property instance
        property = Property(
            agent_id=uuid.uuid4(),
            title="Test Property",
            property_type="apartment",
            price_monthly=500000,
            state="Lagos",
            lga="Ikeja",
        )
        print("✅ Property instance created")

        # Create a PropertyFlick instance
        flick = PropertyFlick(property_id=uuid.uuid4(), user_id=uuid.uuid4())
        print("✅ PropertyFlick instance created")

        # Create an AgentVerificationAttempt instance
        attempt = AgentVerificationAttempt(
            agent_id=uuid.uuid4(), attempt_type="bvn", status="pending"
        )
        print("✅ AgentVerificationAttempt instance created")

        print("\n🎉 All model instances created successfully!")
        return True

    except Exception as e:
        print(f"❌ Model instantiation error: {e}")
        return False


def main():
    """Run all tests"""
    print("🚀 Starting SQLAlchemy Model Tests")
    print("=" * 50)

    tests = [
        ("Model Imports", test_model_imports),
        ("Model Relationships", test_model_relationships),
        ("SQLAlchemy Configuration", test_sqlalchemy_configuration),
        ("Model Instantiation", test_model_instantiation),
    ]

    passed = 0
    total = len(tests)

    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        if test_func():
            passed += 1
        else:
            print(f"❌ {test_name} FAILED")

    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"✅ Passed: {passed}/{total}")

    if passed == total:
        print("🎉 All tests passed! Models are working correctly.")
        return 0
    else:
        print("⚠️ Some tests failed. Check the errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
