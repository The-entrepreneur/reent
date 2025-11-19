import { supabase } from "./supabase";

/**
 * Generate a unique referral code for a user
 */
export function generateReferralCode(): string {
  const prefix = "REENT";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

/**
 * Get referral link for a user
 */
export function getReferralLink(referralCode: string): string {
  if (typeof window === "undefined") {
    return `https://reent.com/ref/${referralCode}`;
  }
  return `${window.location.origin}/ref/${referralCode}`;
}

/**
 * Handle new user signup with referral tracking
 */
export async function handleUserSignup(
  userData: {
    fullName: string;
    email: string;
    phone: string;
    state: string;
    role: string;
  },
  referralCode?: string,
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Generate referral code for the new user
    const newUserReferralCode = generateReferralCode();

    // Check if this is a referral signup
    let referredBy = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from("waitlist")
        .select("id")
        .eq("referral_code", referralCode)
        .single();

      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Insert the new user
    const { data, error } = await supabase
      .from("waitlist")
      .insert([
        {
          full_name: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          state: userData.state,
          role: userData.role,
          referral_code: newUserReferralCode,
          referral_count: 0,
          referred_by: referredBy,
        },
      ])
      .select();

    if (error) {
      if (error.code === "23505") {
        return {
          success: false,
          error: "This email is already on our waitlist!",
        };
      }
      throw error;
    }

    // If this was a referral, increment the referrer's count
    if (referredBy) {
      try {
        await supabase.rpc("increment_referral_count", { user_id: referredBy });
      } catch (rpcError) {
        console.warn("RPC increment failed, using fallback:", rpcError);
        // Fallback: manually update the count
        const { data: currentUser } = await supabase
          .from("waitlist")
          .select("referral_count")
          .eq("id", referredBy)
          .single();

        if (currentUser) {
          const newCount = (currentUser.referral_count || 0) + 1;
          await supabase
            .from("waitlist")
            .update({ referral_count: newCount })
            .eq("id", referredBy);
        }
      }
    }

    return { success: true, userId: data[0].id };
  } catch (error: any) {
    console.error("Error in handleUserSignup:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get leaderboard data (top 10 referrers)
 */
export async function getLeaderboard(): Promise<
  Array<{
    full_name: string;
    role: string;
    referral_count: number;
    masked_name: string;
  }>
> {
  try {
    const { data, error } = await supabase
      .from("waitlist")
      .select("full_name, role, referral_count")
      .order("referral_count", { ascending: false })
      .limit(10);

    if (error) throw error;

    // Mask names for privacy (e.g., "Paul Gam****")
    return data.map((user) => ({
      ...user,
      masked_name: maskUserName(user.full_name),
      referral_count: user.referral_count || 0,
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

/**
 * Mask user name for privacy (e.g., "Paul Gam****")
 */
export function maskUserName(fullName: string): string {
  const names = fullName.trim().split(" ");
  if (names.length === 1) {
    // Single name - show first 3 characters, mask the rest
    const name = names[0];
    if (name.length <= 3) return name;
    return name.substring(0, 3) + "*".repeat(Math.max(1, name.length - 3));
  }

  // Multiple names - show first name fully, mask last name
  const firstName = names[0];
  const lastName = names[names.length - 1];

  if (lastName.length <= 2) {
    return `${firstName} ${lastName}`;
  }

  return `${firstName} ${lastName.substring(0, 3)}${"*".repeat(Math.max(1, lastName.length - 3))}`;
}

/**
 * Get user's referral stats
 */
export async function getUserReferralStats(userId: string): Promise<{
  referralCount: number;
  referralLink: string;
  rank?: number;
}> {
  try {
    const { data: user } = await supabase
      .from("waitlist")
      .select("referral_count, referral_code")
      .eq("id", userId)
      .single();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's rank
    const { data: leaderboard } = await supabase
      .from("waitlist")
      .select("id, referral_count")
      .order("referral_count", { ascending: false });

    const rank = leaderboard
      ? leaderboard.findIndex((u) => u.id === userId) + 1
      : undefined;

    return {
      referralCount: user.referral_count || 0,
      referralLink: getReferralLink(user.referral_code!),
      rank: rank && rank > 0 ? rank : undefined,
    };
  } catch (error) {
    console.error("Error getting user referral stats:", error);
    return {
      referralCount: 0,
      referralLink: "",
    };
  }
}

/**
 * Check if referral code is valid
 */
export async function isValidReferralCode(
  referralCode: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("waitlist")
      .select("id")
      .eq("referral_code", referralCode)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}
