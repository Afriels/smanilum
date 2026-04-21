import type { Metadata } from "next";
import { PageBlocksRenderer } from "@/components/page-builder/page-blocks-renderer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPageBlocks, getPublicData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact", "/contact");
}

export default async function ContactPage() {
  const [{ tenant, content, news, activities, gallery }, { blocks }] = await Promise.all([
    getPublicData(),
    getPageBlocks("contact")
  ]);

  return (
    <main>
      <SiteHeader school={tenant} content={content} />
      <PageBlocksRenderer blocks={blocks} news={news} activities={activities} gallery={gallery} />
      <SiteFooter school={tenant} content={content} />
    </main>
  );
}
