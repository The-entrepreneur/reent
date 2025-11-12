import { PropertyFilters } from "./property";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export type UserRole = "tenant" | "landlord" | "admin" | "agent";

export type UserStatus = "active" | "inactive" | "pending" | "suspended";

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  communication: {
    language: string;
    currency: string;
  };
  search: {
    savedSearches: SavedSearch[];
    favoriteLocations: string[];
  };
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: PropertyFilters;
  createdAt: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  occupation?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  socialLinks?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  verification?: UserVerification;
}

export interface UserVerification {
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  identityDocuments?: IdentityDocument[];
  verifiedAt?: string;
}

export interface IdentityDocument {
  type: "nin" | "drivers_license" | "passport" | "voters_card";
  number: string;
  frontImage: string;
  backImage?: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  device: {
    type: string;
    os: string;
    browser: string;
  };
  ipAddress: string;
  location?: {
    city: string;
    country: string;
  };
  lastActive: string;
  expiresAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: UserActivityType;
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export type UserActivityType =
  | "login"
  | "logout"
  | "property_view"
  | "property_save"
  | "property_contact"
  | "search"
  | "profile_update"
  | "preferences_update"
  | "verification_submit";

export interface UserStats {
  userId: string;
  propertiesViewed: number;
  propertiesSaved: number;
  searchesPerformed: number;
  contactsMade: number;
  lastActivity: string;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserLoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserPasswordResetRequest {
  email: string;
}

export interface UserPasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

export interface UserEmailVerificationRequest {
  email: string;
}

export interface UserEmailVerificationConfirmRequest {
  token: string;
}
