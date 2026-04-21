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

export interface WebsiteSettingRow {
  id: string;
  school_id: string;
  key: string;
  value: string | null;
  created_at?: string;
}

export interface WebsiteSettingsMap {
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_primary_cta_label: string;
  hero_primary_cta_url: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_url: string;
  hero_panel_eyebrow: string;
  hero_panel_title: string;
  hero_panel_description: string;
  hero_feature_1: string;
  hero_feature_2: string;
  hero_feature_3: string;
  hero_background_image: string;
  home_feature_eyebrow: string;
  home_feature_title: string;
  home_feature_description: string;
  home_feature_card_1: string;
  home_feature_card_2: string;
  home_feature_card_3: string;
  home_news_eyebrow: string;
  home_news_title: string;
  home_news_description: string;
  home_activities_eyebrow: string;
  home_activities_title: string;
  home_activities_description: string;
  home_gallery_eyebrow: string;
  home_gallery_title: string;
  home_gallery_description: string;
  home_section_order: string;
  home_hidden_sections: string;
  about_eyebrow: string;
  about_title: string;
  about_text: string;
  profile_vision_title: string;
  profile_vision_text: string;
  profile_mission_title: string;
  profile_mission_text: string;
  profile_values_title: string;
  profile_values_text: string;
  contact_title: string;
  contact_description: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  school_logo_url: string;
  seo_default_title: string;
  seo_default_description: string;
  seo_default_keywords: string;
  seo_default_og_image: string;
  seo_home_title: string;
  seo_home_description: string;
  seo_home_keywords: string;
  seo_profile_title: string;
  seo_profile_description: string;
  seo_profile_keywords: string;
  seo_news_title: string;
  seo_news_description: string;
  seo_news_keywords: string;
  seo_gallery_title: string;
  seo_gallery_description: string;
  seo_gallery_keywords: string;
  seo_contact_title: string;
  seo_contact_description: string;
  seo_contact_keywords: string;
}

export interface WebsiteContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryLabel: string;
  heroPrimaryUrl: string;
  heroSecondaryLabel: string;
  heroSecondaryUrl: string;
  heroPanelEyebrow: string;
  heroPanelTitle: string;
  heroPanelDescription: string;
  heroFeatures: string[];
  heroBackgroundImage: string;
  homeFeatureEyebrow: string;
  homeFeatureTitle: string;
  homeFeatureDescription: string;
  homeFeatureCards: string[];
  homeNewsEyebrow: string;
  homeNewsTitle: string;
  homeNewsDescription: string;
  homeActivitiesEyebrow: string;
  homeActivitiesTitle: string;
  homeActivitiesDescription: string;
  homeGalleryEyebrow: string;
  homeGalleryTitle: string;
  homeGalleryDescription: string;
  homeSectionOrder: string[];
  homeHiddenSections: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  profileVisionTitle: string;
  profileVisionText: string;
  profileMissionTitle: string;
  profileMissionText: string;
  profileValuesTitle: string;
  profileValuesText: string;
  contactTitle: string;
  contactDescription: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  schoolLogoUrl: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoDefaultKeywords: string;
  seoDefaultOgImage: string;
  seoHomeTitle: string;
  seoHomeDescription: string;
  seoHomeKeywords: string;
  seoProfileTitle: string;
  seoProfileDescription: string;
  seoProfileKeywords: string;
  seoNewsTitle: string;
  seoNewsDescription: string;
  seoNewsKeywords: string;
  seoGalleryTitle: string;
  seoGalleryDescription: string;
  seoGalleryKeywords: string;
  seoContactTitle: string;
  seoContactDescription: string;
  seoContactKeywords: string;
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
