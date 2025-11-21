"use client"; // Reent Success Page - Enhanced with brand design system

import Image from "next/image";

import {
  CheckCircle,
  ArrowRight,
  Home,
  Share2,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import {
  getReferralLink,
  getUserReferralStats,
  getLeaderboard,
  maskUserName,
} from "@/lib/referral";

export default function SuccessPage() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [referralStats, setReferralStats] = useState<{
    referralCount: number;
    referralLink: string;
    rank?: number;
  } | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    Array<{
      full_name: string;
      role: string;
      referral_count: number;
      masked_name: string;
    }>
  >([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    // Load user referral stats
    const loadReferralStats = async () => {
      // In a real app, you'd get the current user ID from session/auth
      // For now, we'll skip loading individual stats since we don't have user session
      // The leaderboard will still show overall referral activity
      setReferralStats(null);
    };

    const loadLeaderboard = async () => {
      const data = await getLeaderboard();
      setLeaderboard(data);
    };

    loadReferralStats();
    loadLeaderboard();
  }, []);

  const handleShare = async () => {
    setIsSharing(true);

    const shareText = referralStats
      ? `I just joined the Reent waitlist and have already referred ${referralStats.referralCount} people! Join me using my referral link and get exclusive rewards.`
      : "I just joined the Reent waitlist for the future of property rental in Nigeria! Join me and be among the first to experience this revolutionary platform.";

    const shareData = {
      title: "Join Reent Waitlist",
      text: shareText,
      url: referralStats?.referralLink || window.location.origin,
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
    <div className="min-h-screen bg-background-light">
      {/* Navigation */}
      <nav className="border-b border-foreground-muted bg-background-light/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/logo/nameOnly.svg"
                alt="Reent"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <Link
              href="/"
              className="text-sm text-foreground-secondary hover:text-accent-primary transition-colors"
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
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-12 h-12 text-foreground-light" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground-light mb-6 leading-tight">
            You&apos;re In!
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            We are pleased to welcome you to Reent. You will be instrumental in
            launching the future of home rentals within your city.
          </p>

          {/* Referral Stats Placeholder */}
          <div className="bg-background-light border-2 border-accent-primary rounded-xl p-6 max-w-md mx-auto mb-8 shadow-soft">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">0</div>
                <div className="text-sm text-foreground-secondary">
                  Referrals
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-secondary">
                  -
                </div>
                <div className="text-sm text-foreground-secondary">Rank</div>
              </div>
            </div>
            <p className="text-sm text-foreground-secondary">
              Share your referral link to move up the leaderboard and unlock
              exclusive rewards!
            </p>
          </div>

          {/* Confirmation Message */}
          <div className="bg-background-light border-2 border-success-500 rounded-xl p-8 max-w-md mx-auto mb-12 shadow-soft">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-success-600 font-medium">Confirmed</span>
            </div>
            <p className="text-foreground-secondary mb-4">
              We&apos;ve added you to our exclusive waitlist. Keep an eye on
              your inbox for launch updates and special offers.
            </p>
            <div className="bg-accent-muted border border-accent-primary rounded-lg p-3 mt-4">
              <p className="text-sm text-background-light font-medium">
                🎉 Your referral link is ready! Share it with friends to earn
                rewards.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl font-semibold text-foreground-light mb-6">
              What&apos;s Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background-light p-6 rounded-xl border-2 border-foreground-muted text-center shadow-soft hover:shadow-large transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-accent-muted rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-bold text-lg">
                    1
                  </span>
                </div>
                <h4 className="font-semibold text-foreground-light mb-2">
                  Early Access
                </h4>
                <p className="text-foreground-secondary text-sm">
                  Get first access to platform features before public launch
                </p>
              </div>
              <div className="bg-background-light p-6 rounded-xl border-2 border-foreground-muted text-center shadow-soft hover:shadow-large transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-accent-muted rounded-full flex items-center justify-center">
                  <span className="text-accent-secondary font-bold text-lg">
                    2
                  </span>
                </div>
                <h4 className="font-semibold text-foreground-light mb-2">
                  Exclusive Offers
                </h4>
                <p className="text-foreground-secondary text-sm">
                  Receive special launch discounts and referral bonuses
                </p>
              </div>
              <div className="bg-background-light p-6 rounded-xl border-2 border-foreground-muted text-center shadow-soft hover:shadow-large transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-accent-muted rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-bold text-lg">
                    3
                  </span>
                </div>
                <h4 className="font-semibold text-foreground-light mb-2">
                  Community Access
                </h4>
                <p className="text-foreground-secondary text-sm">
                  Join our founder community for insights and networking
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-foreground-light font-semibold rounded-xl transition-all duration-200 hover:from-accent-secondary hover:to-accent-dark shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Homepage
            </Link>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-foreground-light to-foreground-secondary text-background-light font-semibold rounded-xl transition-all duration-200 hover:from-foreground-secondary hover:to-foreground-light shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSharing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background-light border-t-transparent rounded-full animate-spin" />
                  Sharing...
                </div>
              ) : shareSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Link Copied!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share Referral Link
                </div>
              )}
            </button>
          </div>

          {/* Leaderboard Toggle */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-foreground-light to-foreground-secondary hover:from-foreground-secondary hover:to-foreground-light text-background-light font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Trophy className="w-5 h-5" />
              {showLeaderboard ? "Hide" : "Show"} Leaderboard
            </button>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      {showLeaderboard && leaderboard.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-accent-muted to-background-light border-t border-b border-accent-primary">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground-light mb-4">
                🏆 Top Referrers Leaderboard
              </h2>
              <p className="text-foreground-secondary">
                See who's leading the referral race
              </p>
            </div>

            <div className="bg-background-light rounded-2xl border-2 border-foreground-muted shadow-large overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-6 bg-foreground-muted border-b border-foreground-light font-semibold text-background-light">
                <div className="col-span-1">Rank</div>
                <div className="col-span-6">Name</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-2 text-right">Referrals</div>
              </div>

              {leaderboard.map((user, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-12 gap-4 p-6 border-b border-foreground-muted last:border-b-0 ${
                    index < 3
                      ? "bg-gradient-to-r from-accent-muted to-background-light"
                      : ""
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    {index === 0 && (
                      <Trophy className="w-5 h-5 text-accent-primary" />
                    )}
                    {index === 1 && (
                      <Trophy className="w-5 h-5 text-foreground-muted" />
                    )}
                    {index === 2 && (
                      <Trophy className="w-5 h-5 text-accent-secondary" />
                    )}
                    {index > 2 && (
                      <span className="text-foreground-muted font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="col-span-6 font-medium text-foreground-light">
                    {user.masked_name}
                  </div>
                  <div className="col-span-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "agent"
                          ? "bg-foreground-light text-background-light"
                          : "bg-accent-primary text-foreground-light"
                      }`}
                    >
                      {user.role === "agent" ? "🏢 Agent" : "🏠 Renter"}
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-bold text-accent-primary">
                    {user.referral_count}
                  </div>
                </div>
              ))}
            </div>

            {/* Rewards Info */}
            <div className="mt-8 text-center">
              <div className="bg-background-light border-2 border-accent-primary rounded-xl p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-foreground-light mb-4">
                  🎁 Exclusive Rewards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground-secondary">
                  <div className="text-left">
                    <p className="font-semibold text-foreground-light">
                      🏢 For Agents:
                    </p>
                    <p>• Top 10: Lifetime Zero Subscription + Brand Kit</p>
                    <p>• 4+ Referrals: Premium Feature Discounts</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-accent-primary">
                      🏠 For Renters:
                    </p>
                    <p>• Top 30: Brand Kit (T-Shirt, Key Holder & more)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof */}
      <section className="py-12 bg-background-light border-t border-foreground-muted">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-foreground-secondary mb-4">
            Join 147+ property enthusiasts already on the waitlist
          </p>
          <div className="flex justify-center space-x-8 text-foreground-secondary">
            <span className="text-sm">🏠 Verified Properties</span>
            <span className="text-sm">📍 3+ Cities</span>
            <span className="text-sm">⭐ 98% Satisfaction</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-foreground-muted">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-foreground-secondary text-sm">
            © 2025 Reent. All rights reserved. Powered by Dev Works Enterprise
          </p>
        </div>
      </footer>
    </div>
  );
}
