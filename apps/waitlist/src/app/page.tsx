"use client"; // Reent Waitlist - Enhanced with referral system and brand design

import Image from "next/image";

import React from "react";
import { useState, useEffect, Suspense } from "react";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Calendar,
  Trophy,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { handleUserSignup, getLeaderboard, maskUserName } from "@/lib/referral";

function WaitlistContent() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    Array<{
      full_name: string;
      role: string;
      referral_count: number;
      masked_name: string;
    }>
  >([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams?.get("ref");

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const data = await getLeaderboard();
    setLeaderboard(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate required fields
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.state ||
        !formData.role
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Use referral system for signup
      const result = await handleUserSignup(
        formData,
        referralCode || undefined,
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to join waitlist");
      }

      setIsSubmitted(true);

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push("/success");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting to waitlist:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "There was an error submitting your information. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const features = [
    {
      title: "Verified+ Listings",
      description:
        "Every agent, listing and property tour is thoroughly vetted for authenticity and fraud proof.",
    },
    {
      title: "Localized Solutions",
      description:
        "Tailored to address the specific challenges and nuances of the Nigerian real estate market.",
    },
    {
      title: "Trust-Centric Design",
      description:
        "Prioritizing verification, accountability, and dispute resolution to build user confidence",
    },
  ];

  const benefits = [
    "Early access to all platform features",
    "Exclusive launch discounts and offers",
    "Priority customer support access",
    "Founder community membership+",
  ];

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT (Abuja)",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  return (
    <>
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
              <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground-muted hidden sm:block">
                  Coming Soon
                </span>
                <div className="flex items-center space-x-1 px-3 py-1 bg-accent-muted rounded-full border border-accent-primary">
                  <Star className="w-3 h-3 text-background-light fill-current" />
                  <span className="text-sm font-medium text-background-light">
                    Beta
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            {/* Launch Date */}
            <div className="inline-flex items-center px-4 py-2 bg-accent-muted rounded-full text-background-light text-sm font-medium mb-8 border border-accent-primary">
              <Calendar className="w-4 h-4 mr-2" />
              Launching Q1 2026
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground-light mb-6 leading-tight">
              From Searching
              <span className="block text-foreground-light">
                to Settling In—
              </span>
              Stress-Free
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-foreground-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience Reent 2.0 - A cutting-edge hybrid marketplace for
              property rentals built on Modern Security, Verified+ Market
              Dealers, Reliability and Inter-Connectivity.
            </p>

            {/* Enhanced Waitlist Form */}
            <div className="max-w-2xl mx-auto mb-16">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form Fields - Side by Side Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="px-4 py-3 border-2 border-foreground-muted rounded-xl placeholder-foreground-light focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary bg-background-light text-sm transition-all duration-200 shadow-soft hover:shadow-medium"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="px-4 py-3 border-2 border-foreground-muted rounded-xl placeholder-foreground-light focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary bg-background-light text-sm transition-all duration-200 shadow-soft hover:shadow-medium"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="px-4 py-3 border-2 border-foreground-muted rounded-xl placeholder-foreground-light focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary bg-background-light text-sm transition-all duration-200 shadow-soft hover:shadow-medium"
                      required
                    />
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="px-4 py-3 border-2 border-foreground-muted rounded-xl text-foreground-light focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary bg-background-light text-sm transition-all duration-200 shadow-soft hover:shadow-medium"
                      required
                    >
                      <option value="">Select State</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Selection */}
                  <div className="flex justify-center gap-8 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="role"
                        value="agent"
                        checked={formData.role === "agent"}
                        onChange={() => handleRoleChange("agent")}
                        className="w-4 h-4 text-accent-primary focus:ring-accent-primary cursor-pointer"
                        required
                      />
                      <span className="text-sm font-medium text-foreground-secondary group-hover:text-accent-primary transition-colors">
                        Agent 🏢
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="role"
                        value="renter"
                        checked={formData.role === "renter"}
                        onChange={() => handleRoleChange("renter")}
                        className="w-4 h-4 text-accent-primary focus:ring-accent-primary cursor-pointer"
                        required
                      />
                      <span className="text-sm font-medium text-foreground-secondary group-hover:text-accent-primary transition-colors">
                        Renter 🏠
                      </span>
                    </label>
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="bg-error-50 border-2 border-error-500 rounded-xl p-4 text-center">
                      <p className="text-error-600 text-sm font-medium">
                        {submitError}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-secondary hover:to-accent-dark text-foreground-light font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-foreground-light border-t-transparent rounded-full animate-spin" />
                        Joining Waitlist...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Join Waitlist
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                  <p className="text-xs text-foreground-light text-center">
                    No spam, ever. Unsubscribe at any time.
                  </p>
                </form>
              ) : (
                <div className="bg-success-50 border-2 border-success-500 rounded-xl p-6 text-center shadow-soft">
                  <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-success-600 mb-2">
                    Welcome to the Waitlist!
                  </h3>
                  <p className="text-success-600">
                    We&apos;ll notify you when Reent launches with exclusive
                    early access.
                  </p>
                  <p className="text-sm text-success-500 mt-2">
                    Redirecting to confirmation page...
                  </p>
                </div>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-4 text-foreground-secondary mb-8">
              <Users className="w-5 h-5" />
              <span className="text-lg font-medium">147+ Early adopters</span>
            </div>

            {/* Leaderboard Toggle */}
            <div className="text-center">
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-foreground-light to-foreground-secondary hover:from-foreground-secondary hover:to-foreground-light text-background-light font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Trophy className="w-5 h-5" />
                {showLeaderboard ? "Hide" : "Show"} Top Referrers
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
                  Our most active community members helping grow Reent
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

        {/* Features Section */}
        <section className="py-20 bg-background-subtle">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground-light mb-4">
                Why Choose Reent?
              </h2>
              <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
                Reent is redefining property rental in Nigeria — a trusted,
                innovative platform that makes renting and managing homes
                simple, secure, and smart.
              </p>
              <p className="text-xs text-foreground-light text-center">
                Rent smarter. Live better. Manage effortlessly — all in one
                trusted platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-background-light p-8 rounded-2xl border-2 border-foreground-muted text-center shadow-soft hover:shadow-large transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-foreground-light mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-foreground-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground-light mb-4">
                Waitlist Exclusive Benefits
              </h2>
              <p className="text-xl text-foreground-secondary">
                Join now and get exclusive perks when we launch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="flex items-center gap-4 p-4 bg-background-light rounded-xl border-2 border-foreground-muted shadow-soft hover:shadow-medium transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-foreground-light" />
                  </div>
                  <span className="text-foreground-secondary font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WaitlistContent />
    </Suspense>
  );
}
