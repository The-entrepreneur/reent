"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isValidReferralCode } from "@/lib/referral";

export default function ReferralPage() {
  const params = useParams();
  const router = useRouter();
  const referralCode = params.code as string;

  useEffect(() => {
    const handleReferral = async () => {
      if (!referralCode) {
        router.push("/");
        return;
      }

      try {
        // Check if referral code is valid
        const isValid = await isValidReferralCode(referralCode);

        if (isValid) {
          // Redirect to main page with referral parameter
          router.push(`/?ref=${referralCode}`);
        } else {
          // Invalid referral code, redirect to main page
          router.push("/");
        }
      } catch (error) {
        console.error("Error validating referral code:", error);
        router.push("/");
      }
    };

    handleReferral();
  }, [referralCode, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FF5F1F] to-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Processing Referral...
        </h1>
        <p className="text-gray-600">
          Redirecting you to the waitlist page
        </p>
        <div className="mt-6">
          <div className="w-8 h-8 border-4 border-[#FF5F1F] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
