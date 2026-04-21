import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const newsSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(20)
});

export const websiteSettingsSchema = z.object({
  hero_badge: z.string(),
  hero_title: z.string().min(3),
  hero_subtitle: z.string().min(3),
  hero_primary_cta_label: z.string().min(1),
  hero_primary_cta_url: z.string().min(1),
  hero_secondary_cta_label: z.string().min(1),
  hero_secondary_cta_url: z.string().min(1),
  hero_panel_eyebrow: z.string(),
  hero_panel_title: z.string(),
  hero_panel_description: z.string(),
  hero_feature_1: z.string(),
  hero_feature_2: z.string(),
  hero_feature_3: z.string(),
  hero_background_image: z.string(),
  home_feature_eyebrow: z.string(),
  home_feature_title: z.string().min(3),
  home_feature_description: z.string().min(3),
  home_feature_card_1: z.string().min(3),
  home_feature_card_2: z.string().min(3),
  home_feature_card_3: z.string().min(3),
  home_news_eyebrow: z.string(),
  home_news_title: z.string().min(3),
  home_news_description: z.string().min(3),
  home_activities_eyebrow: z.string(),
  home_activities_title: z.string().min(3),
  home_activities_description: z.string().min(3),
  home_gallery_eyebrow: z.string(),
  home_gallery_title: z.string().min(3),
  home_gallery_description: z.string().min(3),
  home_section_order: z.string(),
  home_hidden_sections: z.string(),
  about_eyebrow: z.string(),
  about_title: z.string().min(3),
  about_text: z.string().min(10),
  profile_vision_title: z.string().min(1),
  profile_vision_text: z.string().min(3),
  profile_mission_title: z.string().min(1),
  profile_mission_text: z.string().min(3),
  profile_values_title: z.string().min(1),
  profile_values_text: z.string().min(3),
  contact_title: z.string().min(3),
  contact_description: z.string().min(3),
  contact_address: z.string().min(3),
  contact_phone: z.string().min(3),
  contact_email: z.string().email(),
  school_logo_url: z.string(),
  seo_default_title: z.string().min(3),
  seo_default_description: z.string().min(3),
  seo_default_keywords: z.string(),
  seo_default_og_image: z.string(),
  seo_home_title: z.string().min(3),
  seo_home_description: z.string().min(3),
  seo_home_keywords: z.string(),
  seo_profile_title: z.string().min(3),
  seo_profile_description: z.string().min(3),
  seo_profile_keywords: z.string(),
  seo_news_title: z.string().min(3),
  seo_news_description: z.string().min(3),
  seo_news_keywords: z.string(),
  seo_gallery_title: z.string().min(3),
  seo_gallery_description: z.string().min(3),
  seo_gallery_keywords: z.string(),
  seo_contact_title: z.string().min(3),
  seo_contact_description: z.string().min(3),
  seo_contact_keywords: z.string()
});

export const gallerySchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2)
});

export const pageBlocksPayloadSchema = z.array(
  z.object({
    id: z.string().min(1),
    page_slug: z.enum(["home", "profile", "news", "gallery", "contact"]),
    block_type: z.enum([
      "hero",
      "rich_text",
      "feature_cards",
      "news_feed",
      "activities_feed",
      "gallery_feed",
      "contact_cards"
    ]),
    title: z.string().nullable(),
    subtitle: z.string().nullable(),
    image_url: z.string().nullable(),
    button_label: z.string().nullable(),
    button_url: z.string().nullable(),
    position: z.number().int().min(0),
    is_visible: z.boolean(),
    config: z
      .object({
        body: z.string().optional(),
        itemCount: z.number().int().optional(),
        layout: z.enum(["grid", "stack"]).optional(),
        cards: z
          .array(
            z.object({
              title: z.string(),
              text: z.string()
            })
          )
          .optional()
      })
      .passthrough()
  })
);

export const studentSchema = z.object({
  nis: z.string().min(3),
  full_name: z.string().min(3),
  grade: z.string().min(1),
  class_name: z.string().min(1),
  guardian_name: z.string().min(3),
  guardian_phone: z.string().min(8)
});

export const ppdbSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8),
  previous_school: z.string().min(2)
});

export const paymentSchema = z.object({
  student_id: z.string().uuid().or(z.string().min(3)),
  bill_name: z.string().min(3),
  amount: z.coerce.number().min(10000),
  due_date: z.string().min(3)
});
