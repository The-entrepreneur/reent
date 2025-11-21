"use client";

import Image from "next/image";

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
    <div className="min-h-screen bg-background-light flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/assets/logo/nameOnly.svg"
          alt="Reent"
          width={150}
          height={45}
          className="h-12 w-auto mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-foreground-light mb-2">
          Processing Referral...
        </h1>
        <p className="text-foreground-secondary">
          Redirecting you to the waitlist page
        </p>
        <div className="mt-6">
          <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
