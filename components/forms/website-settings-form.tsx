"use client";

import type { ComponentType, DragEvent } from "react";
import { useMemo, useState } from "react";
import { GripVertical, Eye, EyeOff, LayoutPanelTop, UserSquare2, Mail, Search, ImageIcon } from "lucide-react";
import { updateWebsiteSettingsAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { WebsiteSettingsMap } from "@/lib/types";

type TabId = "homepage" | "profile" | "contact" | "seo" | "media";
type SectionId = "features" | "news" | "activities" | "gallery";

const tabs: Array<{ id: TabId; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: "homepage", label: "Homepage", icon: LayoutPanelTop },
  { id: "profile", label: "Profile", icon: UserSquare2 },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "seo", label: "SEO", icon: Search },
  { id: "media", label: "Media", icon: ImageIcon }
];

const sectionLabels: Record<SectionId, string> = {
  features: "Feature Cards",
  news: "Latest News",
  activities: "Activities",
  gallery: "Gallery"
};

function Field({
  label,
  name,
  defaultValue,
  multiline = false,
  type = "text"
}: {
  label: string;
  name: keyof WebsiteSettingsMap;
  defaultValue: string;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {multiline ? (
        <Textarea name={name} defaultValue={defaultValue} />
      ) : (
        <Input name={name} type={type} defaultValue={defaultValue} />
      )}
    </label>
  );
}

function BuilderCard({
  section,
  hidden,
  onToggle,
  onDragStart,
  onDrop,
  onDragOver
}: {
  section: SectionId;
  hidden: boolean;
  onToggle: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={cn(
        "flex items-center justify-between rounded-3xl border px-4 py-4 transition",
        hidden ? "border-slate-200 bg-slate-50" : "border-brand-200 bg-brand-50/60"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white p-2 text-slate-500 shadow-sm">
          <GripVertical className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-slate-950">{sectionLabels[section]}</p>
          <p className="text-xs text-slate-500">Drag to reorder homepage sections</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
          hidden ? "bg-white text-slate-600" : "bg-slate-950 text-white"
        )}
      >
        {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {hidden ? "Hidden" : "Visible"}
      </button>
    </div>
  );
}

export function WebsiteSettingsForm({ settings }: { settings: WebsiteSettingsMap }) {
  const initialOrder = useMemo<SectionId[]>(() => {
    const parsed = settings.home_section_order
      .split(",")
      .map((item) => item.trim())
      .filter((item): item is SectionId => item in sectionLabels);
    const fallback: SectionId[] = ["features", "news", "activities", "gallery"];

    return parsed.length > 0
      ? [...parsed, ...fallback.filter((item) => !parsed.includes(item))]
      : fallback;
  }, [settings.home_section_order]);

  const [activeTab, setActiveTab] = useState<TabId>("homepage");
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(initialOrder);
  const [hiddenSections, setHiddenSections] = useState<SectionId[]>(
    settings.home_hidden_sections
      .split(",")
      .map((item) => item.trim())
      .filter((item): item is SectionId => item in sectionLabels)
  );
  const [draggedSection, setDraggedSection] = useState<SectionId | null>(null);

  const toggleSection = (section: SectionId) => {
    setHiddenSections((current) =>
      current.includes(section) ? current.filter((item) => item !== section) : [...current, section]
    );
  };

  const moveSection = (target: SectionId) => {
    if (!draggedSection || draggedSection === target) return;

    setSectionOrder((current) => {
      const next = [...current];
      const draggedIndex = next.indexOf(draggedSection);
      const targetIndex = next.indexOf(target);
      next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, draggedSection);
      return next;
    });
  };

  return (
    <Card className="rounded-[32px] bg-white p-0 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">CMS Studio</p>
        <h2 className="mt-2 text-2xl font-bold">WordPress-style editor for your school website</h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Edit copy, images, SEO, and homepage structure from one place. Drag sections to reorder, hide blocks, and publish changes to the live site.
        </p>
      </div>

      <form action={updateWebsiteSettingsAction} className="grid gap-0 xl:grid-cols-[240px_1fr_320px]">
        <aside className="border-r border-slate-200 bg-slate-50 p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                    activeTab === tab.id
                      ? "bg-slate-950 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Homepage Builder</p>
            <div className="mt-4 space-y-3">
              {sectionOrder.map((section) => (
                <BuilderCard
                  key={section}
                  section={section}
                  hidden={hiddenSections.includes(section)}
                  onToggle={() => toggleSection(section)}
                  onDragStart={() => setDraggedSection(section)}
                  onDrop={() => moveSection(section)}
                  onDragOver={(event) => event.preventDefault()}
                />
              ))}
            </div>
            <input type="hidden" name="home_section_order" value={sectionOrder.join(",")} />
            <input type="hidden" name="home_hidden_sections" value={hiddenSections.join(",")} />
          </div>
        </aside>

        <div className="p-6">
          <input type="hidden" name="hero_background_image" value={settings.hero_background_image} />
          <input type="hidden" name="school_logo_url" value={settings.school_logo_url} />
          <input type="hidden" name="seo_default_og_image" value={settings.seo_default_og_image} />

          <div className={cn("grid gap-8", activeTab !== "homepage" && "hidden")}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Hero Badge" name="hero_badge" defaultValue={settings.hero_badge} />
                <Field label="Hero Title" name="hero_title" defaultValue={settings.hero_title} />
                <Field label="Hero Subtitle" name="hero_subtitle" defaultValue={settings.hero_subtitle} multiline />
                <Field label="Primary CTA Label" name="hero_primary_cta_label" defaultValue={settings.hero_primary_cta_label} />
                <Field label="Primary CTA URL" name="hero_primary_cta_url" defaultValue={settings.hero_primary_cta_url} />
                <Field label="Secondary CTA Label" name="hero_secondary_cta_label" defaultValue={settings.hero_secondary_cta_label} />
                <Field label="Secondary CTA URL" name="hero_secondary_cta_url" defaultValue={settings.hero_secondary_cta_url} />
                <Field label="Hero Panel Eyebrow" name="hero_panel_eyebrow" defaultValue={settings.hero_panel_eyebrow} />
                <Field label="Hero Panel Title" name="hero_panel_title" defaultValue={settings.hero_panel_title} />
                <Field label="Hero Panel Description" name="hero_panel_description" defaultValue={settings.hero_panel_description} multiline />
                <Field label="Hero Feature 1" name="hero_feature_1" defaultValue={settings.hero_feature_1} />
                <Field label="Hero Feature 2" name="hero_feature_2" defaultValue={settings.hero_feature_2} />
                <Field label="Hero Feature 3" name="hero_feature_3" defaultValue={settings.hero_feature_3} />
                <Field label="Feature Eyebrow" name="home_feature_eyebrow" defaultValue={settings.home_feature_eyebrow} />
                <Field label="Feature Title" name="home_feature_title" defaultValue={settings.home_feature_title} />
                <Field label="Feature Description" name="home_feature_description" defaultValue={settings.home_feature_description} multiline />
                <Field label="Feature Card 1" name="home_feature_card_1" defaultValue={settings.home_feature_card_1} />
                <Field label="Feature Card 2" name="home_feature_card_2" defaultValue={settings.home_feature_card_2} />
                <Field label="Feature Card 3" name="home_feature_card_3" defaultValue={settings.home_feature_card_3} />
                <Field label="News Eyebrow" name="home_news_eyebrow" defaultValue={settings.home_news_eyebrow} />
                <Field label="News Title" name="home_news_title" defaultValue={settings.home_news_title} />
                <Field label="News Description" name="home_news_description" defaultValue={settings.home_news_description} multiline />
                <Field label="Activities Eyebrow" name="home_activities_eyebrow" defaultValue={settings.home_activities_eyebrow} />
                <Field label="Activities Title" name="home_activities_title" defaultValue={settings.home_activities_title} />
                <Field label="Activities Description" name="home_activities_description" defaultValue={settings.home_activities_description} multiline />
                <Field label="Gallery Eyebrow" name="home_gallery_eyebrow" defaultValue={settings.home_gallery_eyebrow} />
                <Field label="Gallery Title" name="home_gallery_title" defaultValue={settings.home_gallery_title} />
                <Field label="Gallery Description" name="home_gallery_description" defaultValue={settings.home_gallery_description} multiline />
              </div>
            </div>

          <div className={cn("grid gap-4 md:grid-cols-2", activeTab !== "profile" && "hidden")}>
              <Field label="About Eyebrow" name="about_eyebrow" defaultValue={settings.about_eyebrow} />
              <Field label="About Title" name="about_title" defaultValue={settings.about_title} />
              <Field label="About Text" name="about_text" defaultValue={settings.about_text} multiline />
              <Field label="Vision Title" name="profile_vision_title" defaultValue={settings.profile_vision_title} />
              <Field label="Vision Text" name="profile_vision_text" defaultValue={settings.profile_vision_text} multiline />
              <Field label="Mission Title" name="profile_mission_title" defaultValue={settings.profile_mission_title} />
              <Field label="Mission Text" name="profile_mission_text" defaultValue={settings.profile_mission_text} multiline />
              <Field label="Values Title" name="profile_values_title" defaultValue={settings.profile_values_title} />
              <Field label="Values Text" name="profile_values_text" defaultValue={settings.profile_values_text} multiline />
            </div>

          <div className={cn("grid gap-4 md:grid-cols-2", activeTab !== "contact" && "hidden")}>
              <Field label="Contact Title" name="contact_title" defaultValue={settings.contact_title} />
              <Field label="Contact Description" name="contact_description" defaultValue={settings.contact_description} multiline />
              <Field label="Contact Address" name="contact_address" defaultValue={settings.contact_address} multiline />
              <Field label="Contact Phone" name="contact_phone" defaultValue={settings.contact_phone} />
              <Field label="Contact Email" name="contact_email" defaultValue={settings.contact_email} type="email" />
            </div>

          <div className={cn("grid gap-4 md:grid-cols-2", activeTab !== "seo" && "hidden")}>
              <Field label="Default SEO Title" name="seo_default_title" defaultValue={settings.seo_default_title} />
              <Field label="Default SEO Keywords" name="seo_default_keywords" defaultValue={settings.seo_default_keywords} />
              <Field label="Default SEO Description" name="seo_default_description" defaultValue={settings.seo_default_description} multiline />
              <Field label="Home SEO Title" name="seo_home_title" defaultValue={settings.seo_home_title} />
              <Field label="Home SEO Keywords" name="seo_home_keywords" defaultValue={settings.seo_home_keywords} />
              <Field label="Home SEO Description" name="seo_home_description" defaultValue={settings.seo_home_description} multiline />
              <Field label="Profile SEO Title" name="seo_profile_title" defaultValue={settings.seo_profile_title} />
              <Field label="Profile SEO Keywords" name="seo_profile_keywords" defaultValue={settings.seo_profile_keywords} />
              <Field label="Profile SEO Description" name="seo_profile_description" defaultValue={settings.seo_profile_description} multiline />
              <Field label="News SEO Title" name="seo_news_title" defaultValue={settings.seo_news_title} />
              <Field label="News SEO Keywords" name="seo_news_keywords" defaultValue={settings.seo_news_keywords} />
              <Field label="News SEO Description" name="seo_news_description" defaultValue={settings.seo_news_description} multiline />
              <Field label="Gallery SEO Title" name="seo_gallery_title" defaultValue={settings.seo_gallery_title} />
              <Field label="Gallery SEO Keywords" name="seo_gallery_keywords" defaultValue={settings.seo_gallery_keywords} />
              <Field label="Gallery SEO Description" name="seo_gallery_description" defaultValue={settings.seo_gallery_description} multiline />
              <Field label="Contact SEO Title" name="seo_contact_title" defaultValue={settings.seo_contact_title} />
              <Field label="Contact SEO Keywords" name="seo_contact_keywords" defaultValue={settings.seo_contact_keywords} />
              <Field label="Contact SEO Description" name="seo_contact_description" defaultValue={settings.seo_contact_description} multiline />
            </div>

          <div className={cn("grid gap-4 md:grid-cols-2", activeTab !== "media" && "hidden")}>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Hero Background Image</span>
                <Input name="hero_background_image_file" type="file" accept="image/png,image/jpeg,image/webp" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>School Logo</span>
                <Input name="school_logo_file" type="file" accept="image/png,image/jpeg,image/webp" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Default OG Image</span>
                <Input name="seo_default_og_image_file" type="file" accept="image/png,image/jpeg,image/webp" />
              </label>
            </div>

          <div className="mt-8">
            <SubmitButton label="Publish Website Changes" pendingLabel="Publishing..." className="w-full sm:w-fit" />
          </div>
        </div>

        <aside className="border-l border-slate-200 bg-slate-50 p-6">
          <div className="sticky top-6 space-y-4">
            <Card className="rounded-[28px] bg-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Live Structure</p>
              <div className="mt-4 space-y-3">
                {sectionOrder.map((section, index) => (
                  <div key={section} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {index + 1}. {sectionLabels[section]}
                      </p>
                      <p className="text-xs text-slate-500">
                        {hiddenSections.includes(section) ? "Hidden from homepage" : "Visible on homepage"}
                      </p>
                    </div>
                    {hiddenSections.includes(section) ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-brand-600" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] bg-slate-950 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Preview Summary</p>
              <h3 className="mt-4 text-2xl font-bold text-balance">
                {settings.hero_title || "Homepage title will appear here"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {settings.hero_subtitle || "Hero subtitle, section descriptions, and CTA copy are managed from this studio."}
              </p>
              <div className="mt-6 space-y-2 text-sm text-white/70">
                <p>About: {settings.about_title || "Profile section title not set"}</p>
                <p>Contact: {settings.contact_email || "No contact email set"}</p>
                <p>SEO: {settings.seo_default_title || "No SEO title set"}</p>
              </div>
            </Card>
          </div>
        </aside>
      </form>
    </Card>
  );
}
