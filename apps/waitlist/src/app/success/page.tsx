"use client";

import { CheckCircle, ArrowRight, Home, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SuccessPage() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    const shareData = {
      title: "Join Reent Waitlist",
      text: "I just joined the Reent waitlist for the future of property rental in Nigeria! Join me and be among the first to experience this revolutionary platform.",
      url: window.location.origin,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareSuccess(true);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.origin);
        setShareSuccess(true);
      }
    } catch (error) {
      console.log("Sharing failed", error);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin);
        setShareSuccess(true);
      } catch (clipboardError) {
        console.log("Clipboard failed", clipboardError);
      }
    } finally {
      setIsSharing(false);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF5F1F] to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Reent</span>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Success Content */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#FF5F1F] to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            You&apos;re In!
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Welcome On-board the Reent ship. You&apos;ll be among the first to
            experience the future of property rental in Nigeria.
          </p>

          {/* Confirmation Message */}
          <div className="bg-white border-2 border-green-200 rounded-xl p-8 max-w-md mx-auto mb-12 shadow-sm">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Confirmed</span>
            </div>
            <p className="text-gray-700">
              We&apos;ve added you to our exclusive waitlist. Keep an eye on
              your inbox for launch updates and special offers.
            </p>
          </div>

          {/* Next Steps */}
          <div className="max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              What&apos;s Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-[#FF5F1F] font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Early Access
                </h4>
                <p className="text-gray-600 text-sm">
                  Get first access to platform features before public launch
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Exclusive Offers
                </h4>
                <p className="text-gray-600 text-sm">
                  Receive special launch discounts and referral bonuses
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-[#FF5F1F] font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Community Access
                </h4>
                <p className="text-gray-600 text-sm">
                  Join our founder community for insights and networking
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#FF5F1F] to-orange-600 text-white font-semibold rounded-xl transition-all duration-200 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Homepage
            </Link>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSharing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                  Sharing...
                </div>
              ) : shareSuccess ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Link Copied!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share with Friends
                </div>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-4">
            Join 147+ property enthusiasts already on the waitlist
          </p>
          <div className="flex justify-center space-x-8 text-gray-500">
            <span className="text-sm">🏠 Verified Properties</span>
            <span className="text-sm">📍 3+ Cities</span>
            <span className="text-sm">⭐ 98% Satisfaction</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Reent. All rights reserved. Powered by Dev Work's Enterprise
          </p>
        </div>
      </footer>
    </div>
  );
}
