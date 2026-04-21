"use client";

import { useMemo, useState } from "react";
import { GripVertical, Layers3, Plus, Trash2 } from "lucide-react";
import { savePageBuilderAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { PageBlocksRenderer } from "@/components/page-builder/page-blocks-renderer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ActivityItem, GalleryItem, NewsItem, PageBlock, PageBlockType, PageSlug } from "@/lib/types";

const pageTabs: Array<{ slug: PageSlug; label: string }> = [
  { slug: "home", label: "Homepage" },
  { slug: "profile", label: "Profile" },
  { slug: "news", label: "News" },
  { slug: "gallery", label: "Gallery" },
  { slug: "contact", label: "Contact" }
];

const blockTypes: Array<{ type: PageBlockType; label: string }> = [
  { type: "hero", label: "Hero" },
  { type: "rich_text", label: "Rich Text" },
  { type: "feature_cards", label: "Feature Cards" },
  { type: "news_feed", label: "News Feed" },
  { type: "activities_feed", label: "Activities Feed" },
  { type: "gallery_feed", label: "Gallery Feed" },
  { type: "contact_cards", label: "Contact Cards" }
];

function createEmptyBlock(page: PageSlug, type: PageBlockType, position: number): PageBlock {
  return {
    id: `builder-${crypto.randomUUID()}`,
    school_id: "",
    page_slug: page,
    block_type: type,
    title: "",
    subtitle: "",
    image_url: "",
    button_label: "",
    button_url: "",
    position,
    is_visible: true,
    config: {
      body: "",
      cards: type === "feature_cards" || type === "contact_cards" ? [{ title: "", text: "" }] : [],
      itemCount: 6,
      layout: type === "activities_feed" ? "stack" : "grid"
    }
  };
}

function reorderBlocks(blocks: PageBlock[]) {
  return blocks.map((block, index) => ({ ...block, position: index }));
}

export function PageBuilderStudio({
  initialBlocks,
  news,
  activities,
  gallery
}: {
  initialBlocks: Record<PageSlug, PageBlock[]>;
  news: NewsItem[];
  activities: ActivityItem[];
  gallery: GalleryItem[];
}) {
  const [activePage, setActivePage] = useState<PageSlug>("home");
  const [blocksByPage, setBlocksByPage] = useState<Record<PageSlug, PageBlock[]>>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(initialBlocks.home[0]?.id ?? null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const activeBlocks = useMemo(() => blocksByPage[activePage] ?? [], [activePage, blocksByPage]);
  const selectedBlock =
    activeBlocks.find((block) => block.id === selectedBlockId) ?? activeBlocks[0] ?? null;

  const updateCurrentPage = (updater: (blocks: PageBlock[]) => PageBlock[]) => {
    setBlocksByPage((current) => {
      const next = updater(current[activePage] ?? []);
      return {
        ...current,
        [activePage]: reorderBlocks(next)
      };
    });
  };

  const updateSelectedBlock = (updater: (block: PageBlock) => PageBlock) => {
    if (!selectedBlock) return;
    updateCurrentPage((blocks) => blocks.map((block) => (block.id === selectedBlock.id ? updater(block) : block)));
  };

  const addBlock = (type: PageBlockType) => {
    updateCurrentPage((blocks) => {
      const next = [...blocks, createEmptyBlock(activePage, type, blocks.length)];
      return next;
    });
    setSelectedBlockId(`pending-${type}`);
  };

  const addBlockAndSelect = (type: PageBlockType) => {
    const id = `builder-${crypto.randomUUID()}`;
    const block = { ...createEmptyBlock(activePage, type, activeBlocks.length), id };
    setBlocksByPage((current) => ({
      ...current,
      [activePage]: reorderBlocks([...(current[activePage] ?? []), block])
    }));
    setSelectedBlockId(id);
  };

  const removeBlock = (id: string) => {
    updateCurrentPage((blocks) => blocks.filter((block) => block.id !== id));
    setSelectedBlockId((current) => (current === id ? activeBlocks.find((block) => block.id !== id)?.id ?? null : current));
  };

  const moveBlock = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    updateCurrentPage((blocks) => {
      const next = [...blocks];
      const from = next.findIndex((block) => block.id === draggedId);
      const to = next.findIndex((block) => block.id === targetId);
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  return (
    <Card className="rounded-[32px] bg-white p-0 overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Page Builder</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Elementor-style section builder</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Create reusable blocks, reorder them visually, and watch the page preview update in real time before publishing.
        </p>
      </div>

      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex flex-wrap gap-3">
          {pageTabs.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              onClick={() => {
                setActivePage(tab.slug);
                setSelectedBlockId(blocksByPage[tab.slug]?.[0]?.id ?? null);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activePage === tab.slug ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form action={savePageBuilderAction} className="grid gap-0 xl:grid-cols-[280px_360px_1fr]">
        <input type="hidden" name="page_slug" value={activePage} />
        <input type="hidden" name="blocks_json" value={JSON.stringify(activeBlocks)} />

        <aside className="border-r border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Blocks</p>
            <div className="relative">
              <select
                onChange={(event) => {
                  if (event.target.value) {
                    addBlockAndSelect(event.target.value as PageBlockType);
                    event.target.value = "";
                  }
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                defaultValue=""
              >
                <option value="" disabled>
                  Add block
                </option>
                {blockTypes.map((blockType) => (
                  <option key={blockType.type} value={blockType.type}>
                    {blockType.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {activeBlocks.map((block) => (
              <button
                key={block.id}
                type="button"
                draggable
                onDragStart={() => setDraggedId(block.id)}
                onDrop={() => moveBlock(block.id)}
                onDragOver={(event) => event.preventDefault()}
                onClick={() => setSelectedBlockId(block.id)}
                className={cn(
                  "w-full rounded-3xl border p-4 text-left transition",
                  selectedBlock?.id === block.id
                    ? "border-slate-950 bg-white shadow-sm"
                    : "border-slate-200 bg-white/70 hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-2 text-slate-500">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{block.title || block.block_type}</p>
                      <p className="text-xs text-slate-500">{block.block_type}</p>
                    </div>
                  </div>
                  {!block.is_visible ? <Layers3 className="h-4 w-4 text-slate-400" /> : null}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="border-r border-slate-200 p-5">
          {selectedBlock ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Block Editor</p>
                  <p className="text-xs text-slate-500">{selectedBlock.block_type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeBlock(selectedBlock.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Title
                <Input
                  value={selectedBlock.title ?? ""}
                  onChange={(event) => updateSelectedBlock((block) => ({ ...block, title: event.target.value }))}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Subtitle / Eyebrow
                <Input
                  value={selectedBlock.subtitle ?? ""}
                  onChange={(event) => updateSelectedBlock((block) => ({ ...block, subtitle: event.target.value }))}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Image URL
                <Input
                  value={selectedBlock.image_url ?? ""}
                  onChange={(event) => updateSelectedBlock((block) => ({ ...block, image_url: event.target.value }))}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Button Label
                <Input
                  value={selectedBlock.button_label ?? ""}
                  onChange={(event) => updateSelectedBlock((block) => ({ ...block, button_label: event.target.value }))}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Button URL
                <Input
                  value={selectedBlock.button_url ?? ""}
                  onChange={(event) => updateSelectedBlock((block) => ({ ...block, button_url: event.target.value }))}
                />
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedBlock.is_visible}
                  onChange={(event) => updateSelectedBlock((block) => ({ ...block, is_visible: event.target.checked }))}
                />
                Visible on page
              </label>

              {selectedBlock.block_type === "rich_text" ? (
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Body
                  <Textarea
                    value={selectedBlock.config.body ?? ""}
                    onChange={(event) =>
                      updateSelectedBlock((block) => ({
                        ...block,
                        config: { ...block.config, body: event.target.value }
                      }))
                    }
                  />
                </label>
              ) : null}

              {selectedBlock.block_type === "feature_cards" || selectedBlock.block_type === "contact_cards" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Cards</p>
                    <button
                      type="button"
                      onClick={() =>
                        updateSelectedBlock((block) => ({
                          ...block,
                          config: {
                            ...block.config,
                            cards: [...(block.config.cards ?? []), { title: "", text: "" }]
                          }
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Add card
                    </button>
                  </div>
                  {(selectedBlock.config.cards ?? []).map((card, index) => (
                    <Card key={`${selectedBlock.id}-card-${index}`} className="rounded-3xl bg-slate-50">
                      <div className="grid gap-3">
                        <Input
                          value={card.title}
                          placeholder="Card title"
                          onChange={(event) =>
                            updateSelectedBlock((block) => ({
                              ...block,
                              config: {
                                ...block.config,
                                cards: (block.config.cards ?? []).map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, title: event.target.value } : item
                                )
                              }
                            }))
                          }
                        />
                        <Textarea
                          value={card.text}
                          placeholder="Card description"
                          onChange={(event) =>
                            updateSelectedBlock((block) => ({
                              ...block,
                              config: {
                                ...block.config,
                                cards: (block.config.cards ?? []).map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, text: event.target.value } : item
                                )
                              }
                            }))
                          }
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : null}

              {selectedBlock.block_type === "news_feed" ||
              selectedBlock.block_type === "activities_feed" ||
              selectedBlock.block_type === "gallery_feed" ? (
                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Description
                    <Textarea
                      value={selectedBlock.config.body ?? ""}
                      onChange={(event) =>
                        updateSelectedBlock((block) => ({
                          ...block,
                          config: { ...block.config, body: event.target.value }
                        }))
                      }
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Item Count
                    <Input
                      type="number"
                      value={selectedBlock.config.itemCount ?? 6}
                      onChange={(event) =>
                        updateSelectedBlock((block) => ({
                          ...block,
                          config: {
                            ...block.config,
                            itemCount: Number(event.target.value || 6)
                          }
                        }))
                      }
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Layout
                    <select
                      value={selectedBlock.config.layout ?? "grid"}
                      onChange={(event) =>
                        updateSelectedBlock((block) => ({
                          ...block,
                          config: {
                            ...block.config,
                            layout: event.target.value as "grid" | "stack"
                          }
                        }))
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                    >
                      <option value="grid">Grid</option>
                      <option value="stack">Stack</option>
                    </select>
                  </label>
                </div>
              ) : null}

              {selectedBlock.block_type === "hero" ? (
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Body
                  <Textarea
                    value={selectedBlock.config.body ?? ""}
                    onChange={(event) =>
                      updateSelectedBlock((block) => ({
                        ...block,
                        config: { ...block.config, body: event.target.value }
                      }))
                    }
                  />
                </label>
              ) : null}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No block selected. Add a block to start building.
            </div>
          )}

          <div className="mt-8">
            <SubmitButton label="Publish Page Builder" pendingLabel="Publishing..." className="w-full sm:w-fit" />
          </div>
        </div>

        <div className="bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Real-time Preview</p>
          <div className="mt-4 rounded-[28px] border border-slate-200 bg-white py-4">
            <PageBlocksRenderer blocks={activeBlocks.filter((block) => block.is_visible)} news={news} activities={activities} gallery={gallery} />
          </div>
        </div>
      </form>
    </Card>
  );
}
