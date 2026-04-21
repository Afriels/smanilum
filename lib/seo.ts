import type { Metadata } from "next";
import { env } from "@/lib/env";
import { getWebsiteSettings } from "@/lib/data";

type PageKey = "home" | "profile" | "news" | "gallery" | "contact";

function getAbsoluteUrl(path: string) {
  return new URL(path, env.appUrl).toString();
}

export async function buildPageMetadata(page: PageKey, path: string): Promise<Metadata> {
  const { tenant, content } = await getWebsiteSettings();

  const titleByPage = {
    home: content.seoHomeTitle,
    profile: content.seoProfileTitle,
    news: content.seoNewsTitle,
    gallery: content.seoGalleryTitle,
    contact: content.seoContactTitle
  };

  const descriptionByPage = {
    home: content.seoHomeDescription,
    profile: content.seoProfileDescription,
    news: content.seoNewsDescription,
    gallery: content.seoGalleryDescription,
    contact: content.seoContactDescription
  };

  const keywordsByPage = {
    home: content.seoHomeKeywords,
    profile: content.seoProfileKeywords,
    news: content.seoNewsKeywords,
    gallery: content.seoGalleryKeywords,
    contact: content.seoContactKeywords
  };

  const title = titleByPage[page] || content.seoDefaultTitle || tenant.name;
  const description = descriptionByPage[page] || content.seoDefaultDescription || tenant.description || "";
  const keywords = (keywordsByPage[page] || content.seoDefaultKeywords)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const images = content.seoDefaultOgImage ? [content.seoDefaultOgImage] : [];
  const url = getAbsoluteUrl(path);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: tenant.name,
      images,
      type: "website"
    },
    twitter: {
      card: images.length > 0 ? "summary_large_image" : "summary",
      title,
      description,
      images
    },
    alternates: {
      canonical: url
    }
  };
}
