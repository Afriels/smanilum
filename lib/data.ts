import { createClient } from "@/lib/supabase/server";
import { requireTenant } from "@/lib/tenant";
import type {
  ActivityItem,
  DashboardStats,
  GalleryItem,
  NewsItem,
  PaymentItem,
  PageBlock,
  PageSlug,
  PPDBItem,
  School,
  StudentItem,
  SubscriptionItem,
  WebsiteContent,
  WebsiteSettingRow,
  WebsiteSettingsMap
} from "@/lib/types";

const WEBSITE_SETTING_DEFAULTS: WebsiteSettingsMap = {
  hero_badge: "",
  hero_title: "",
  hero_subtitle: "",
  hero_primary_cta_label: "",
  hero_primary_cta_url: "",
  hero_secondary_cta_label: "",
  hero_secondary_cta_url: "",
  hero_panel_eyebrow: "",
  hero_panel_title: "",
  hero_panel_description: "",
  hero_feature_1: "",
  hero_feature_2: "",
  hero_feature_3: "",
  hero_background_image: "",
  home_feature_eyebrow: "",
  home_feature_title: "",
  home_feature_description: "",
  home_feature_card_1: "",
  home_feature_card_2: "",
  home_feature_card_3: "",
  home_news_eyebrow: "",
  home_news_title: "",
  home_news_description: "",
  home_activities_eyebrow: "",
  home_activities_title: "",
  home_activities_description: "",
  home_gallery_eyebrow: "",
  home_gallery_title: "",
  home_gallery_description: "",
  home_section_order: "",
  home_hidden_sections: "",
  about_eyebrow: "",
  about_title: "",
  about_text: "",
  profile_vision_title: "",
  profile_vision_text: "",
  profile_mission_title: "",
  profile_mission_text: "",
  profile_values_title: "",
  profile_values_text: "",
  contact_title: "",
  contact_description: "",
  contact_address: "",
  contact_phone: "",
  contact_email: "",
  school_logo_url: "",
  seo_default_title: "",
  seo_default_description: "",
  seo_default_keywords: "",
  seo_default_og_image: "",
  seo_home_title: "",
  seo_home_description: "",
  seo_home_keywords: "",
  seo_profile_title: "",
  seo_profile_description: "",
  seo_profile_keywords: "",
  seo_news_title: "",
  seo_news_description: "",
  seo_news_keywords: "",
  seo_gallery_title: "",
  seo_gallery_description: "",
  seo_gallery_keywords: "",
  seo_contact_title: "",
  seo_contact_description: "",
  seo_contact_keywords: ""
};

export const WEBSITE_SETTING_FIELDS = Object.keys(WEBSITE_SETTING_DEFAULTS) as Array<keyof WebsiteSettingsMap>;

const PAGE_SLUGS: PageSlug[] = ["home", "profile", "news", "gallery", "contact"];

function normalizeSettings(rows: WebsiteSettingRow[] | null) {
  const settings: WebsiteSettingsMap = { ...WEBSITE_SETTING_DEFAULTS };

  for (const row of rows ?? []) {
    if (row.key in settings) {
      settings[row.key as keyof WebsiteSettingsMap] = row.value ?? "";
    }
  }

  return settings;
}

function pickContent(school: School, settings: WebsiteSettingsMap): WebsiteContent {
  const homeSectionOrder = settings.home_section_order
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const homeHiddenSections = settings.home_hidden_sections
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    heroBadge: settings.hero_badge,
    heroTitle: settings.hero_title || school.name,
    heroSubtitle: settings.hero_subtitle || school.tagline || school.description || "",
    heroPrimaryLabel: settings.hero_primary_cta_label || "Daftar PPDB",
    heroPrimaryUrl: settings.hero_primary_cta_url || "/ppdb",
    heroSecondaryLabel: settings.hero_secondary_cta_label || "Masuk Dashboard",
    heroSecondaryUrl: settings.hero_secondary_cta_url || "/login",
    heroPanelEyebrow: settings.hero_panel_eyebrow,
    heroPanelTitle: settings.hero_panel_title,
    heroPanelDescription: settings.hero_panel_description,
    heroFeatures: [settings.hero_feature_1, settings.hero_feature_2, settings.hero_feature_3].filter(Boolean),
    heroBackgroundImage: settings.hero_background_image,
    homeFeatureEyebrow: settings.home_feature_eyebrow,
    homeFeatureTitle: settings.home_feature_title,
    homeFeatureDescription: settings.home_feature_description,
    homeFeatureCards: [
      settings.home_feature_card_1,
      settings.home_feature_card_2,
      settings.home_feature_card_3
    ].filter(Boolean),
    homeNewsEyebrow: settings.home_news_eyebrow,
    homeNewsTitle: settings.home_news_title,
    homeNewsDescription: settings.home_news_description,
    homeActivitiesEyebrow: settings.home_activities_eyebrow,
    homeActivitiesTitle: settings.home_activities_title,
    homeActivitiesDescription: settings.home_activities_description,
    homeGalleryEyebrow: settings.home_gallery_eyebrow,
    homeGalleryTitle: settings.home_gallery_title,
    homeGalleryDescription: settings.home_gallery_description,
    homeSectionOrder,
    homeHiddenSections,
    aboutEyebrow: settings.about_eyebrow,
    aboutTitle: settings.about_title || school.name,
    aboutText: settings.about_text || school.description || "",
    profileVisionTitle: settings.profile_vision_title || "Visi",
    profileVisionText: settings.profile_vision_text,
    profileMissionTitle: settings.profile_mission_title || "Misi",
    profileMissionText: settings.profile_mission_text,
    profileValuesTitle: settings.profile_values_title || "Nilai",
    profileValuesText: settings.profile_values_text,
    contactTitle: settings.contact_title || "Hubungi tim sekolah",
    contactDescription: settings.contact_description,
    contactAddress: settings.contact_address || school.address || "",
    contactPhone: settings.contact_phone || school.contact_phone || "",
    contactEmail: settings.contact_email || school.contact_email || "",
    schoolLogoUrl: settings.school_logo_url || school.logo_url || "",
    seoDefaultTitle: settings.seo_default_title || school.name,
    seoDefaultDescription: settings.seo_default_description || school.description || "",
    seoDefaultKeywords: settings.seo_default_keywords,
    seoDefaultOgImage: settings.seo_default_og_image || settings.hero_background_image || school.logo_url || "",
    seoHomeTitle: settings.seo_home_title,
    seoHomeDescription: settings.seo_home_description,
    seoHomeKeywords: settings.seo_home_keywords,
    seoProfileTitle: settings.seo_profile_title,
    seoProfileDescription: settings.seo_profile_description,
    seoProfileKeywords: settings.seo_profile_keywords,
    seoNewsTitle: settings.seo_news_title,
    seoNewsDescription: settings.seo_news_description,
    seoNewsKeywords: settings.seo_news_keywords,
    seoGalleryTitle: settings.seo_gallery_title,
    seoGalleryDescription: settings.seo_gallery_description,
    seoGalleryKeywords: settings.seo_gallery_keywords,
    seoContactTitle: settings.seo_contact_title,
    seoContactDescription: settings.seo_contact_description,
    seoContactKeywords: settings.seo_contact_keywords
  };
}

export async function getWebsiteSettings() {
  const supabase = createClient();
  const tenant = await requireTenant();
  const { data, error } = await supabase
    .from("website_settings")
    .select("*")
    .eq("school_id", tenant.id)
    .order("key", { ascending: true });

  if (error) {
    console.error("Failed to fetch website settings", error);
  }

  const settings = normalizeSettings((data as WebsiteSettingRow[] | null) ?? null);

  return {
    tenant,
    settings,
    content: pickContent(tenant, settings)
  };
}

export async function getPublicData() {
  const supabase = createClient();
  const { tenant, settings, content } = await getWebsiteSettings();

  const [news, activities, gallery] = await Promise.all([
    supabase
      .from("news")
      .select("*")
      .eq("school_id", tenant.id)
      .order("published_at", { ascending: false })
      .limit(6),
    supabase
      .from("activities")
      .select("*")
      .eq("school_id", tenant.id)
      .order("activity_date", { ascending: false })
      .limit(6),
    supabase.from("gallery").select("*").eq("school_id", tenant.id).order("created_at", { ascending: false }).limit(12)
  ]);

  return {
    tenant,
    settings,
    content,
    news: (news.data as NewsItem[] | null) ?? [],
    activities: (activities.data as ActivityItem[] | null) ?? [],
    gallery: (gallery.data as GalleryItem[] | null) ?? []
  };
}

function coercePageBlocks(data: any[] | null): PageBlock[] {
  return (data ?? []).map((block) => ({
    ...block,
    config:
      block.config && typeof block.config === "object" && !Array.isArray(block.config)
        ? block.config
        : {}
  })) as PageBlock[];
}

function getDefaultPageBlocks(
  page: PageSlug,
  school: School,
  content: WebsiteContent
): PageBlock[] {
  const schoolId = school.id;

  const defaults: Record<PageSlug, PageBlock[]> = {
    home: [
      {
        id: "default-home-hero",
        school_id: schoolId,
        page_slug: "home",
        block_type: "hero",
        title: content.heroTitle,
        subtitle: content.heroSubtitle,
        image_url: content.heroBackgroundImage || null,
        button_label: content.heroPrimaryLabel,
        button_url: content.heroPrimaryUrl,
        config: {},
        position: 0,
        is_visible: true
      },
      {
        id: "default-home-features",
        school_id: schoolId,
        page_slug: "home",
        block_type: "feature_cards",
        title: content.homeFeatureTitle,
        subtitle: content.homeFeatureDescription,
        image_url: null,
        button_label: null,
        button_url: null,
        config: {
          cards: content.homeFeatureCards.map((text, index) => ({
            title: `Feature ${index + 1}`,
            text
          }))
        },
        position: 1,
        is_visible: !content.homeHiddenSections.includes("features")
      },
      {
        id: "default-home-news",
        school_id: schoolId,
        page_slug: "home",
        block_type: "news_feed",
        title: content.homeNewsTitle,
        subtitle: content.homeNewsDescription,
        image_url: null,
        button_label: null,
        button_url: null,
        config: { itemCount: 6, layout: "grid" },
        position: 2,
        is_visible: !content.homeHiddenSections.includes("news")
      },
      {
        id: "default-home-activities",
        school_id: schoolId,
        page_slug: "home",
        block_type: "activities_feed",
        title: content.homeActivitiesTitle,
        subtitle: content.homeActivitiesDescription,
        image_url: null,
        button_label: null,
        button_url: null,
        config: { itemCount: 6, layout: "stack" },
        position: 3,
        is_visible: !content.homeHiddenSections.includes("activities")
      },
      {
        id: "default-home-gallery",
        school_id: schoolId,
        page_slug: "home",
        block_type: "gallery_feed",
        title: content.homeGalleryTitle,
        subtitle: content.homeGalleryDescription,
        image_url: null,
        button_label: null,
        button_url: null,
        config: { itemCount: 6, layout: "grid" },
        position: 4,
        is_visible: !content.homeHiddenSections.includes("gallery")
      }
    ],
    profile: [
      {
        id: "default-profile-about",
        school_id: schoolId,
        page_slug: "profile",
        block_type: "rich_text",
        title: content.aboutTitle,
        subtitle: content.aboutEyebrow,
        image_url: null,
        button_label: null,
        button_url: null,
        config: { body: content.aboutText },
        position: 0,
        is_visible: true
      },
      {
        id: "default-profile-values",
        school_id: schoolId,
        page_slug: "profile",
        block_type: "feature_cards",
        title: school.name,
        subtitle: "Visi, misi, dan nilai sekolah",
        image_url: null,
        button_label: null,
        button_url: null,
        config: {
          cards: [
            { title: content.profileVisionTitle, text: content.profileVisionText },
            { title: content.profileMissionTitle, text: content.profileMissionText },
            { title: content.profileValuesTitle, text: content.profileValuesText }
          ]
        },
        position: 1,
        is_visible: true
      }
    ],
    news: [
      {
        id: "default-news-feed",
        school_id: schoolId,
        page_slug: "news",
        block_type: "news_feed",
        title: content.homeNewsTitle,
        subtitle: content.homeNewsDescription,
        image_url: null,
        button_label: null,
        button_url: null,
        config: { itemCount: 12, layout: "grid" },
        position: 0,
        is_visible: true
      }
    ],
    gallery: [
      {
        id: "default-gallery-feed",
        school_id: schoolId,
        page_slug: "gallery",
        block_type: "gallery_feed",
        title: content.homeGalleryTitle,
        subtitle: content.homeGalleryDescription,
        image_url: null,
        button_label: null,
        button_url: null,
        config: { itemCount: 12, layout: "grid" },
        position: 0,
        is_visible: true
      }
    ],
    contact: [
      {
        id: "default-contact-text",
        school_id: schoolId,
        page_slug: "contact",
        block_type: "rich_text",
        title: content.contactTitle,
        subtitle: "Kontak",
        image_url: null,
        button_label: null,
        button_url: null,
        config: { body: content.contactDescription },
        position: 0,
        is_visible: true
      },
      {
        id: "default-contact-cards",
        school_id: schoolId,
        page_slug: "contact",
        block_type: "contact_cards",
        title: "Informasi Kontak",
        subtitle: "",
        image_url: null,
        button_label: null,
        button_url: null,
        config: {
          cards: [
            { title: "Email", text: content.contactEmail || school.contact_email || "-" },
            { title: "Telepon", text: content.contactPhone || school.contact_phone || "-" },
            { title: "Alamat", text: content.contactAddress || school.address || "-" }
          ]
        },
        position: 1,
        is_visible: true
      }
    ]
  };

  return defaults[page];
}

export async function getPageBuilderData() {
  const supabase = createClient();
  const { tenant, settings, content } = await getWebsiteSettings();
  const { data, error } = await supabase
    .from("page_blocks")
    .select("*")
    .eq("school_id", tenant.id)
    .order("page_slug", { ascending: true })
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to fetch page blocks", error);
  }

  const storedBlocks = coercePageBlocks(data as any[] | null);
  const pageBlocks = Object.fromEntries(
    PAGE_SLUGS.map((page) => {
      const blocks = storedBlocks.filter((block) => block.page_slug === page);
      return [page, blocks.length > 0 ? blocks : getDefaultPageBlocks(page, tenant, content)];
    })
  ) as Record<PageSlug, PageBlock[]>;

  return {
    tenant,
    settings,
    content,
    pageBlocks
  };
}

export async function getPageBlocks(page: PageSlug) {
  const { tenant, content, pageBlocks } = await getPageBuilderData();
  return {
    tenant,
    content,
    blocks: pageBlocks[page].filter((block) => block.is_visible)
  };
}

export async function getDashboardData() {
  const supabase = createClient();
  const tenant = await requireTenant();

  const [students, news, ppdb, payments, subscriptions] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("school_id", tenant.id),
    supabase.from("news").select("id", { count: "exact", head: true }).eq("school_id", tenant.id),
    supabase
      .from("ppdb")
      .select("id", { count: "exact", head: true })
      .eq("school_id", tenant.id)
      .eq("status", "pending"),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("school_id", tenant.id)
      .eq("status", "pending"),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("school_id", tenant.id)
      .order("ends_at", { ascending: false })
      .limit(1)
      .maybeSingle<SubscriptionItem>()
  ]);

  return {
    tenant,
    stats: {
      totalStudents: students.count ?? 0,
      totalNews: news.count ?? 0,
      pendingPPDB: ppdb.count ?? 0,
      pendingPayments: payments.count ?? 0,
      activeSubscription: subscriptions.data ?? null
    } satisfies DashboardStats
  };
}

export async function getDashboardCollections() {
  const supabase = createClient();
  const tenant = await requireTenant();
  const { settings, content } = await getWebsiteSettings();

  const [news, students, ppdb, payments, gallery, activities] = await Promise.all([
    supabase.from("news").select("*").eq("school_id", tenant.id).order("published_at", { ascending: false }),
    supabase.from("students").select("*").eq("school_id", tenant.id).order("created_at", { ascending: false }),
    supabase.from("ppdb").select("*").eq("school_id", tenant.id).order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("school_id", tenant.id).order("due_date", { ascending: true }),
    supabase.from("gallery").select("*").eq("school_id", tenant.id).order("created_at", { ascending: false }),
    supabase.from("activities").select("*").eq("school_id", tenant.id).order("activity_date", { ascending: false })
  ]);

  return {
    tenant,
    settings,
    content,
    news: (news.data as NewsItem[] | null) ?? [],
    students: (students.data as StudentItem[] | null) ?? [],
    ppdb: (ppdb.data as PPDBItem[] | null) ?? [],
    payments: (payments.data as PaymentItem[] | null) ?? [],
    gallery: (gallery.data as GalleryItem[] | null) ?? [],
    activities: (activities.data as ActivityItem[] | null) ?? []
  };
}
