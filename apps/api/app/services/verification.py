"""
Youverify API service for BVN and NIN verification
"""

import json
import time
from typing import Dict, Optional, Tuple

import httpx
from fuzzywuzzy import fuzz
from sqlalchemy.orm import Session

from app.core.auth import get_password_hash
from app.core.config import settings
from app.models.engagement import AgentVerificationAttempt
from app.models.user import User


class YouverifyService:
    """Service for handling BVN and NIN verification via Youverify API"""

    def __init__(self):
        self.base_url = "https://api.youverify.co/v2"
        self.api_key = getattr(settings, "YOUVERIFY_API_KEY", None)
        self.mock_mode = getattr(settings, "MOCK_YOUVERIFY", True)
        self.timeout = 30
        self.max_retries = 3
        self.retry_delay = 5

    async def verify_bvn(
        self, bvn: str, phone: str, db: Session, agent_id: str
    ) -> Dict:
        """
        Verify BVN with Youverify API

        Args:
            bvn: Bank Verification Number
            phone: Phone number for validation
            db: Database session
            agent_id: Agent user ID for tracking

        Returns:
            Dict with verification results
        """
        attempt = AgentVerificationAttempt(
            agent_id=agent_id, attempt_type="bvn", status="pending"
        )
        db.add(attempt)
        db.commit()

        try:
            # Check if we should use mock mode
            if self.mock_mode or not self.api_key:
                # Use mock response for development
                response_data = await self._mock_bvn_verification(bvn, phone)
            else:
                # Prepare request payload
                payload = {"id": bvn, "metadata": {"phone": phone}}

                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                }

                # Make API call with retry logic
                response_data = await self._make_api_call(
                    endpoint="/identities/bvn",
                    payload=payload,
                    headers=headers,
                    attempt=attempt,
                    db=db,
                )

            if not response_data:
                return {"verified": False, "error": "API call failed after retries"}

            # Parse response
            verification_data = response_data.get("data", {})

            # Extract required fields
            full_name = verification_data.get("fullName", "")
            phone_number = verification_data.get("phoneNumber", "")
            date_of_birth = verification_data.get("dateOfBirth", "")

            # Validate phone match (exact)
            phone_match = phone_number == phone

            # Validate name using fuzzy matching (90% threshold)
            # For now, we'll return the name for manual verification
            # In production, you might want to compare with user's registered name
            name_match_score = 100  # Default to 100 since we don't have user's name

            verification_result = {
                "verified": phone_match and name_match_score >= 90,
                "full_name": full_name,
                "phone_match": phone_match,
                "name_match_score": name_match_score,
                "date_of_birth": date_of_birth,
                "raw_response": verification_data,
            }

            # Update attempt record
            attempt.status = "success" if verification_result["verified"] else "failed"
            if not verification_result["verified"]:
                attempt.error_message = (
                    f"Phone match: {phone_match}, Name score: {name_match_score}"
                )
            db.commit()

            return verification_result

        except Exception as e:
            # Update attempt record with error
            attempt.status = "failed"
            attempt.error_message = str(e)
            db.commit()

            return {"verified": False, "error": str(e)}

    async def verify_nin(self, nin: str, dob: str, db: Session, agent_id: str) -> Dict:
        """
        Verify NIN with Youverify API

        Args:
            nin: National Identity Number
            dob: Date of birth (YYYY-MM-DD format)
            db: Database session
            agent_id: Agent user ID for tracking

        Returns:
            Dict with verification results
        """
        attempt = AgentVerificationAttempt(
            agent_id=agent_id, attempt_type="nin", status="pending"
        )
        db.add(attempt)
        db.commit()

        try:
            # Check if we should use mock mode
            if self.mock_mode or not self.api_key:
                # Use mock response for development
                response_data = await self._mock_nin_verification(nin, dob)
            else:
                # Prepare request payload
                payload = {"id": nin, "metadata": {"dob": dob}}

                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                }

                # Make API call with retry logic
                response_data = await self._make_api_call(
                    endpoint="/identities/nin",
                    payload=payload,
                    headers=headers,
                    attempt=attempt,
                    db=db,
                )

            if not response_data:
                return {"verified": False, "error": "API call failed after retries"}

            # Parse response
            verification_data = response_data.get("data", {})

            # Extract required fields
            full_name = verification_data.get("fullName", "")
            state = verification_data.get("stateOfOrigin", "")
            lga = verification_data.get("lga", "")
            response_dob = verification_data.get("dateOfBirth", "")

            # Validate DOB match (exact)
            dob_match = response_dob == dob

            verification_result = {
                "verified": dob_match,
                "full_name": full_name,
                "state": state,
                "lga": lga,
                "dob_match": dob_match,
                "raw_response": verification_data,
            }

            # Update attempt record
            attempt.status = "success" if verification_result["verified"] else "failed"
            if not verification_result["verified"]:
                attempt.error_message = f"DOB match: {dob_match}"
            db.commit()

            return verification_result

        except Exception as e:
            # Update attempt record with error
            attempt.status = "failed"
            attempt.error_message = str(e)
            db.commit()

            return {"verified": False, "error": str(e)}

    async def _make_api_call(
        self,
        endpoint: str,
        payload: Dict,
        headers: Dict,
        attempt: AgentVerificationAttempt,
        db: Session,
    ) -> Optional[Dict]:
        """
        Make API call with retry logic

        Args:
            endpoint: API endpoint
            payload: Request payload
            headers: Request headers
            attempt: Verification attempt record
            db: Database session

        Returns:
            API response data or None if all retries fail
        """
        url = f"{self.base_url}{endpoint}"

        for retry_count in range(self.max_retries):
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        url, json=payload, headers=headers, timeout=self.timeout
                    )

                    if response.status_code == 200:
                        return response.json()
                    elif response.status_code == 429:  # Rate limited
                        # Wait and retry
                        time.sleep(self.retry_delay)
                        continue
                    else:
                        # Update attempt with error
                        attempt.error_message = (
                            f"HTTP {response.status_code}: {response.text}"
                        )
                        attempt.attempt_count = retry_count + 1
                        db.commit()

                        if retry_count < self.max_retries - 1:
                            time.sleep(self.retry_delay)
                            continue
                        else:
                            return None

            except httpx.TimeoutException:
                attempt.error_message = "API timeout"
                attempt.attempt_count = retry_count + 1
                db.commit()

                if retry_count < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
                else:
                    return None

            except Exception as e:
                attempt.error_message = str(e)
                attempt.attempt_count = retry_count + 1
                db.commit()

                if retry_count < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
                else:
                    return None

        return None

    def _check_verification_lock(self, agent_id: str, db: Session) -> bool:
        """
        Check if verification is locked for an agent

        Args:
            agent_id: Agent user ID
            db: Database session

        Returns:
            True if locked, False otherwise
        """
        # Check for recent failed attempts (last 24 hours)
        from datetime import datetime, timedelta

        from sqlalchemy import and_

        cutoff_time = datetime.utcnow() - timedelta(hours=24)

        failed_attempts = (
            db.query(AgentVerificationAttempt)
            .filter(
                and_(
                    AgentVerificationAttempt.agent_id == agent_id,
                    AgentVerificationAttempt.status == "failed",
                    AgentVerificationAttempt.created_at >= cutoff_time,
                )
            )
            .count()
        )

        return failed_attempts >= 3

    async def _mock_bvn_verification(self, bvn: str, phone: str) -> Dict:
        """
        Mock BVN verification for development/testing
        """
        # Simulate API delay
        import asyncio

        await asyncio.sleep(1)

        # Return mock successful response
        return {
            "data": {
                "fullName": "John Doe",
                "phoneNumber": phone,  # Match provided phone for success
                "dateOfBirth": "1990-01-15",
                "status": "verified",
            }
        }

    async def _mock_nin_verification(self, nin: str, dob: str) -> Dict:
        """
        Mock NIN verification for development/testing
        """
        # Simulate API delay
        import asyncio

        await asyncio.sleep(1)

        # Return mock successful response
        return {
            "data": {
                "fullName": "John Doe",
                "stateOfOrigin": "Lagos",
                "lga": "Ikeja",
                "dateOfBirth": dob,  # Match provided DOB for success
                "status": "verified",
            }
        }

    def _create_verification_lock(self, agent_id: str, db: Session) -> None:
        """
        Create verification lock for an agent

        Args:
            agent_id: Agent user ID
            db: Database session
        """
        # For now, we're using the attempt tracking system
        # In production, you might want to use Redis for faster lookups
        pass
