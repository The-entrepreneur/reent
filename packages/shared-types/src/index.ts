// Shared TypeScript types for Reent applications
// Export all types from individual modules

export * from "./property";
export * from "./user";
export * from "./api";

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Common enums
export enum PropertyTypeEnum {
  APARTMENT = "apartment",
  HOUSE = "house",
  COMMERCIAL = "commercial",
  STUDIO = "studio",
  DUPLEX = "duplex",
}

export enum UserRoleEnum {
  TENANT = "tenant",
  LANDLORD = "landlord",
  ADMIN = "admin",
  AGENT = "agent",
}

export enum PropertyStatusEnum {
  AVAILABLE = "available",
  RENTED = "rented",
  UNDER_MAINTENANCE = "under_maintenance",
  COMING_SOON = "coming_soon",
}

export enum NotificationTypeEnum {
  PROPERTY_MATCH = "property_match",
  BOOKING_CONFIRMED = "booking_confirmed",
  BOOKING_CANCELLED = "booking_cancelled",
  PAYMENT_RECEIVED = "payment_received",
  MESSAGE_RECEIVED = "message_received",
  SYSTEM_ALERT = "system_alert",
  VERIFICATION_APPROVED = "verification_approved",
  VERIFICATION_REJECTED = "verification_rejected",
}

// Common constants
export const SUPPORTED_CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Benin City",
  "Enugu",
  "Aba",
  "Onitsha",
  "Warri",
] as const;

export const SUPPORTED_STATES = [
  "Lagos",
  "Abuja FCT",
  "Rivers",
  "Oyo",
  "Kano",
  "Edo",
  "Enugu",
  "Abia",
  "Anambra",
  "Delta",
  "Kaduna",
  "Ogun",
  "Osun",
  "Plateau",
  "Cross River",
  "Akwa Ibom",
  "Imo",
  "Bayelsa",
  "Niger",
  "Sokoto",
] as const;

export const PROPERTY_AMENITIES = [
  "Swimming Pool",
  "Gym",
  "24/7 Security",
  "Parking Space",
  "Water Supply",
  "Power Backup",
  "CCTV",
  "Elevator",
  "Garden",
  "Playground",
  "Pet Friendly",
  "Furnished",
  "Air Conditioning",
  "WiFi",
  "Balcony",
  "Laundry",
  "Concierge",
  "Clubhouse",
] as const;

export const PROPERTY_FEATURES = [
  "Fully Furnished",
  "Air Conditioning",
  "Balcony",
  "Modern Kitchen",
  "Ensuite Bathrooms",
  "Walk-in Closet",
  "Hardwood Floors",
  "Granite Countertops",
  "Stainless Steel Appliances",
  "Smart Home Features",
  "Energy Efficient",
  "Water Heater",
  "Ceiling Fans",
  "Fireplace",
  "Patio",
] as const;

// Type guards
export function isPropertyType(value: any): value is PropertyTypeEnum {
  return Object.values(PropertyTypeEnum).includes(value);
}

export function isUserRole(value: any): value is UserRoleEnum {
  return Object.values(UserRoleEnum).includes(value);
}

export function isPropertyStatus(value: any): value is PropertyStatusEnum {
  return Object.values(PropertyStatusEnum).includes(value);
}

// Validation schemas (for runtime type checking)
export const PropertyTypeSchema = Object.values(PropertyTypeEnum);
export const UserRoleSchema = Object.values(UserRoleEnum);
export const PropertyStatusSchema = Object.values(PropertyStatusEnum);
export const NotificationTypeSchema = Object.values(NotificationTypeEnum);
