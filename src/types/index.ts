// ─── Domain Types ─────────────────────────────────────

export interface Horse {
  id: string
  name: string
  breed: string
  age: number
  gender: 'MALE' | 'FEMALE' | 'STALLION' | 'MARE' | 'GELDING'
  color: string
  description?: string
  image?: string
  available: boolean
  unavailableReason?: string
  suitableFor: ('BEGINNER' | 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED')[]
  maxWeight?: number
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  service: 'SAFARI' | 'ACADEMY' | 'PRIVATE' | 'EVENT'
  name: string
  email: string
  phone: string
  experienceLevel: string
  groupSize: number
  specialRequests?: string
  date: string
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  userId?: string
  user?: UserProfile
  horses: { horseId: string; horse: Horse }[]
  location?: BookingLocation
  appliedReward?: UserReward
  createdAt: string
  updatedAt: string
}

// ─── User & Auth Types ────────────────────────────────

export type UserRoleType = 'ADMIN' | 'STAFF' | 'USER'
export type PointActionType = 'SIGNUP_BONUS' | 'BOOKING_COMPLETED' | 'REFERRAL_BONUS' | 'REWARD_REDEEMED' | 'ADMIN_ADJUSTMENT'
export type RewardType = 'DISCOUNT' | 'FREE_SERVICE'

export interface UserProfile {
  id: string
  name?: string
  email: string
  phone?: string
  image?: string
  role: UserRoleType
  points: number
  referralCode?: string
  referredById?: string
  createdAt: string
  updatedAt: string
}

export interface PointTransaction {
  id: string
  userId: string
  amount: number
  type: PointActionType
  description?: string
  bookingId?: string
  rewardId?: string
  createdAt: string
}

export interface Reward {
  id: string
  title: string
  titleKu?: string
  titleAr?: string
  description?: string
  descriptionKu?: string
  descriptionAr?: string
  type: RewardType
  pointCost: number
  discountPercent?: number
  freeService?: 'SAFARI' | 'ACADEMY' | 'PRIVATE' | 'EVENT'
  active: boolean
  stock?: number
  image?: string
  createdAt: string
  updatedAt: string
}

export interface UserReward {
  id: string
  userId: string
  rewardId: string
  reward?: Reward
  redeemedAt: string
  used: boolean
  usedAt?: string
  bookingId?: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone?: string
  referralCode?: string
}

export interface OtpRequest {
  phone: string
}

export interface OtpVerifyRequest {
  phone: string
  code: string
}

export interface BookingLocation {
  id: string
  ip: string
  city?: string
  region?: string
  country?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  org?: string
}

export interface CalendarDay {
  id: string
  date: string
  blocked: boolean
  blockReason?: string
  availableSlots: string[]
  capacity?: number
}

export interface BookedSlot {
  id: string
  date: string
  time: string
  bookingId: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface Instructor {
  id: string
  name: string
  specialization: string[]
  experience: number
  imageUrl: string
  bio: string
}

export interface AcademyProgram {
  id: string
  title: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  price: number
  description: string
}

export interface SafariPackage {
  id: string
  title: string
  duration: string
  groupSize: number
  price: number
  highlights: string[]
  imageUrl: string
}

export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail: string
  category: 'academy' | 'safari' | 'lifestyle' | 'events'
  title: string
  date: string
}

// ─── UI Types ─────────────────────────────────────────

export type Language = 'en' | 'ar' | 'ku'
export type ThemeMode = 'light' | 'dark'

// ─── API Response Types ───────────────────────────────

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}

export interface BookingStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  today: number
}
