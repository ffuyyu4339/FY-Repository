"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  createSourceLink,
  deleteSourceLink,
  fetchSourceLinks,
  updateSourceLink,
} from "@/lib/api";
import {
  formatTrackLabel,
  listToText,
  textToList,
  trackOptions,
  type SourceLink,
  type SourceLinkPayload,
  type TrackValue,
} from "@/lib/types";
import {
  PageHero,
  accentButtonClass,
  cn,
  controlClass,
  secondaryButtonClass,
  selectControlClass,
} from "@/components/ui";

type SourceFormState = {
  platform_name: string;
  title: string;
  url: string;
  city: string;
  track: TrackValue | "";
  keywords: string;
  enabled: boolean;
  sort_order: string;
};

const emptyFormState: SourceFormState = {
  platform_name: "",
  title: "",
  url: "",
  city: "",
  track: "",
  keywords: "",
  enabled: true,
  sort_order: "100",
};

const intakeSteps = ["打开网页", "复制 JD", "录入岗位", "解析确认"];

function toFormState(sourceLink: SourceLink): SourceFormState {
  return {
    platform_name: sourceLink.platform_name,
    title: sourceLink.title,
    url: sourceLink.url,
    city: sourceLink.city || "",
    track: sourceLink.track || "",
    keywords: listToText(sourceLink.keywords),
    enabled: sourceLink.enabled,
    sort_order: String(sourceLink.sort_order),
  };
}

function toPayload(formState: SourceFormState): SourceLinkPayload {
  return {
    platform_name: formState.platform_name,
    title: formState.title,
    url: formState.url,
    city: formState.city || null,
    track: formState.track || null,
    keywords: textToList(formState.keywords),
    enabled: formState.enabled,
    sort_order: Number(formState.sort_order || 100),
  };
}

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
      {children}
    </span>
  );
}

export function SourcesClient() {
  const [sourceLinks, setSourceLinks] = useState<SourceLink[]>([]);
  const [formState, setFormState] = useState<SourceFormState>(emptyFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadSourceLinks() {
    try {
      setLoading(true);
      setError(null);
      setSourceLinks(await fetchSourceLinks(true));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "来源链接加载失败",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSourceLinks();
  }, []);

  function updateField<Key extends keyof SourceFormState>(
    key: Key,
    value: SourceFormState[Key],
  ) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setFormState(emptyFormState);
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      if (editingId) {
        await updateSourceLink(editingId, toPayload(formState));
        setSuccessMessage("来源链接已更新。");
      } else {
        await createSourceLink(toPayload(formState));
        setSuccessMessage("来源链接已创建。");
      }
      resetForm();
      await loadSourceLinks();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(sourceLinkId: number) {
    const confirmed = window.confirm("确认删除这个来源链接吗？");
    if (!confirmed) {
      return;
    }
    try {
      setError(null);
      await deleteSourceLink(sourceLinkId);
      await loadSourceLinks();
      if (editingId === sourceLinkId) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "删除失败");
    }
  }

  function openSource(sourceLink: SourceLink) {
    window.open(sourceLink.url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="space-y-5">
      <PageHero
        breadcrumb="作战台 / 入口"
        title="招聘入口库"
        description="集中保存招聘平台和搜索链接，打开后用浏览器本地登录态查看岗位，再手动复制 JD 回系统解析。"
        actions={
          <>
            <Link href="/jobs/new" className={accentButtonClass}>
              录入岗位
            </Link>
            <Link href="/guide" className={secondaryButtonClass}>
              查看流程
            </Link>
          </>
        }
      />

      <div className="grid gap-2 rounded-lg border border-[var(--color-border)] bg-white p-3 sm:grid-cols-4">
        {intakeSteps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-slate-700"
          >
            <span className="font-mono text-xs font-semibold text-[var(--color-accent)]">
              0{index + 1}
            </span>
            <span className="font-medium">{step}</span>
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
                来源列表
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
                平台入口
              </h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {loading ? "正在同步..." : `${sourceLinks.length} 个入口`}
            </p>
          </div>

          {loading ? (
            <div className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-6 text-sm text-[var(--color-text-secondary)]">
              正在加载平台入口...
            </div>
          ) : null}

          {!loading && sourceLinks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-[var(--color-text-secondary)]">
              还没有平台入口，右侧添加第一个搜索链接。
            </div>
          ) : null}

          <div className="grid gap-2">
            {sourceLinks.map((sourceLink) => (
              <article
                key={sourceLink.id}
                className={cn(
                  "grid gap-4 rounded-lg border bg-white p-4 transition hover:border-orange-200 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
                  sourceLink.enabled
                    ? "border-[var(--color-border)]"
                    : "border-slate-200 opacity-70",
                )}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-[var(--color-text-primary)]">
                      {sourceLink.title}
                    </h3>
                    <span className="rounded-full bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs text-slate-600">
                      {sourceLink.platform_name}
                    </span>
                    {!sourceLink.enabled ? (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
                        已停用
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 truncate font-mono text-xs text-[var(--color-text-secondary)]">
                    {sourceLink.url}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sourceLink.city ? (
                      <span className="rounded-md bg-[var(--color-surface-muted)] px-2 py-1 text-xs text-slate-600">
                        {sourceLink.city}
                      </span>
                    ) : null}
                    {sourceLink.track ? (
                      <span className="rounded-md bg-[var(--color-accent-soft)] px-2 py-1 text-xs text-[var(--color-accent)]">
                        {formatTrackLabel(sourceLink.track)}
                      </span>
                    ) : null}
                    {sourceLink.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-md bg-[var(--color-surface-muted)] px-2 py-1 text-xs text-slate-600"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:w-36 lg:flex-col">
                  <button
                    type="button"
                    onClick={() => openSource(sourceLink)}
                    className={accentButtonClass}
                  >
                    打开平台
                  </button>
                  <Link
                    href={`/jobs/new?platform=${encodeURIComponent(
                      sourceLink.platform_name,
                    )}&job_link=${encodeURIComponent(sourceLink.url)}`}
                    className={secondaryButtonClass}
                  >
                    录入岗位
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(sourceLink.id);
                      setFormState(toFormState(sourceLink));
                    }}
                    className={secondaryButtonClass}
                  >
                    编辑
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[var(--color-border)] bg-white p-4 lg:sticky lg:top-24"
        >
          <div className="border-b border-[var(--color-border)] pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                  {editingId ? "配置来源" : "新增来源"}
                </h2>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                  只保存平台名、搜索链接和筛选条件；不保存平台账号、密码、Cookie
                  或登录令牌。
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="shrink-0 rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-slate-300 hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                清空
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <label className="grid gap-1.5">
              <FieldLabel>平台名称</FieldLabel>
              <input
                value={formState.platform_name}
                onChange={(event) =>
                  updateField("platform_name", event.target.value)
                }
                placeholder="平台名称"
                className={controlClass}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <FieldLabel>入口标题</FieldLabel>
              <input
                value={formState.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="入口标题"
                className={controlClass}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <FieldLabel>外部链接</FieldLabel>
              <input
                value={formState.url}
                onChange={(event) => updateField("url", event.target.value)}
                placeholder="外部链接"
                className={controlClass}
                required
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <FieldLabel>城市</FieldLabel>
                <input
                  value={formState.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="城市"
                  className={controlClass}
                />
              </label>
              <label className="grid gap-1.5">
                <FieldLabel>方向</FieldLabel>
                <select
                  value={formState.track}
                  onChange={(event) =>
                    updateField("track", event.target.value as TrackValue | "")
                  }
                  className={selectControlClass}
                >
                  <option value="">不限方向</option>
                  {trackOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-1.5">
              <FieldLabel>关键词</FieldLabel>
              <input
                value={formState.keywords}
                onChange={(event) =>
                  updateField("keywords", event.target.value)
                }
                placeholder="关键词，逗号分隔"
                className={controlClass}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <FieldLabel>排序</FieldLabel>
                <input
                  value={formState.sort_order}
                  onChange={(event) =>
                    updateField("sort_order", event.target.value)
                  }
                  type="number"
                  placeholder="排序"
                  className={controlClass}
                />
              </label>
              <label className="mt-5 flex h-11 items-center justify-between rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-slate-700">
                启用
                <input
                  type="checkbox"
                  checked={formState.enabled}
                  onChange={(event) =>
                    updateField("enabled", event.target.checked)
                  }
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-[var(--color-border)] pt-4">
            <button
              type="submit"
              disabled={saving}
              className={accentButtonClass}
            >
              {saving ? "保存中..." : editingId ? "保存修改" : "创建入口"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => handleDelete(editingId)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                删除
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
