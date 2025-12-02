"""
Simple test to verify YouverifyService mock mode works
Run this to test the verification system without Youverify API key
"""

import asyncio
import sys
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))

from app.core.config import settings
from app.services.verification import YouverifyService
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


async def test_mock_verification():
    """Test YouverifyService in mock mode"""
    print("🧪 Testing YouverifyService Mock Mode...")
    print("=" * 50)

    # Create service instance
    service = YouverifyService()

    print(f"🔧 Service Configuration:")
    print(f"   Mock Mode: {service.mock_mode}")
    print(f"   API Key Available: {service.api_key is not None}")
    print(f"   Base URL: {service.base_url}")

    # Test BVN verification
    print("\n📞 Testing BVN Verification...")
    bvn_result = await service.verify_bvn(
        bvn="12345678901",
        phone="08012345678",
        db=None,  # No DB for simple test
        agent_id="test-agent-123",
    )

    print(f"   Verified: {bvn_result.get('verified', False)}")
    print(f"   Full Name: {bvn_result.get('full_name', 'N/A')}")
    print(f"   Phone Match: {bvn_result.get('phone_match', False)}")

    # Test NIN verification
    print("\n🆔 Testing NIN Verification...")
    nin_result = await service.verify_nin(
        nin="98765432109",
        dob="1990-01-15",
        db=None,  # No DB for simple test
        agent_id="test-agent-123",
    )

    print(f"   Verified: {nin_result.get('verified', False)}")
    print(f"   Full Name: {nin_result.get('full_name', 'N/A')}")
    print(f"   State: {nin_result.get('state', 'N/A')}")
    print(f"   LGA: {nin_result.get('lga', 'N/A')}")

    # Summary
    print("\n" + "=" * 50)
    print("📋 TEST RESULTS:")
    print(f"✅ BVN Mock: {'PASS' if bvn_result.get('verified') else 'FAIL'}")
    print(f"✅ NIN Mock: {'PASS' if nin_result.get('verified') else 'FAIL'}")

    if bvn_result.get("verified") and nin_result.get("verified"):
        print("🎉 Mock verification system is working correctly!")
    else:
        print("⚠️ Some mock tests failed. Check the implementation.")


if __name__ == "__main__":
    print("🚀 Starting Verification Mock Test...")
    asyncio.run(test_mock_verification())
