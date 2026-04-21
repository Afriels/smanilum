export type UserRole = "super_admin" | "admin" | "teacher" | "student";

export type SubmissionStatus = "pending" | "accepted" | "rejected";

export type PaymentStatus = "pending" | "paid" | "failed";

export type SubscriptionPlan = "Basic" | "Pro" | "Premium";

export interface School {
  id: string;
  school_id: string | null;
  slug: string;
  domain: string | null;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  primary_color: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  created_at?: string;
}

export interface Profile {
  id: string;
  school_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export interface NewsItem {
  id: string;
  school_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  published_at: string | null;
}

export interface ActivityItem {
  id: string;
  school_id: string;
  title: string;
  description: string | null;
  activity_date: string | null;
  location: string | null;
}

export interface GalleryItem {
  id: string;
  school_id: string;
  title: string;
  image_url: string;
  category: string | null;
}

export interface StudentItem {
  id: string;
  school_id: string;
  nis: string;
  full_name: string;
  grade: string | null;
  class_name: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  status: string | null;
}

export interface PPDBItem {
  id: string;
  school_id: string;
  registration_no: string;
  full_name: string;
  email: string;
  phone: string;
  previous_school: string | null;
  status: SubmissionStatus;
  document_url: string | null;
}

export interface PaymentItem {
  id: string;
  school_id: string;
  student_id: string;
  bill_name: string;
  amount: number;
  due_date: string | null;
  status: PaymentStatus;
  payment_method: string | null;
  paid_at: string | null;
}

export interface SubscriptionItem {
  id: string;
  school_id: string;
  plan: SubscriptionPlan;
  starts_at: string;
  ends_at: string;
  status: "active" | "expired" | "trial";
}

export interface DashboardStats {
  totalStudents: number;
  totalNews: number;
  pendingPPDB: number;
  pendingPayments: number;
  activeSubscription: SubscriptionItem | null;
}
