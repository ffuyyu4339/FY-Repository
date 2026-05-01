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

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20";

const selectClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20";

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
      <div className="grid gap-5 border-b border-slate-200 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            workspace / sources
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            平台入口
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            保存常用招聘平台和筛选链接，使用浏览器本地登录态打开，复制 JD
            后回到系统解析。
          </p>
        </div>
        <Link
          href="/settings"
          className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
        >
          偏好设置
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
          {successMessage}
        </div>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 shadow-sm">
              正在加载平台入口...
            </div>
          ) : null}

          {!loading && sourceLinks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500 shadow-sm">
              还没有平台入口，右侧添加第一个搜索链接。
            </div>
          ) : null}

          {sourceLinks.map((sourceLink) => (
            <div
              key={sourceLink.id}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-950">
                    {sourceLink.title}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {sourceLink.platform_name}
                  </span>
                  {!sourceLink.enabled ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
                      已停用
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {sourceLink.url}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sourceLink.city ? (
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {sourceLink.city}
                    </span>
                  ) : null}
                  {sourceLink.track ? (
                    <span className="rounded-md bg-orange-50 px-2 py-1 text-xs text-[var(--color-accent)]">
                      {formatTrackLabel(sourceLink.track)}
                    </span>
                  ) : null}
                  {sourceLink.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={() => openSource(sourceLink)}
                  className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
                >
                  打开平台
                </button>
                <Link
                  href={`/jobs/new?platform=${encodeURIComponent(
                    sourceLink.platform_name,
                  )}&job_link=${encodeURIComponent(sourceLink.url)}`}
                  className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
                >
                  录入岗位
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(sourceLink.id);
                    setFormState(toFormState(sourceLink));
                  }}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
                >
                  编辑
                </button>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-950">
              {editingId ? "编辑来源" : "新增来源"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              只保存外部链接和筛选条件，不保存平台账号或登录令牌。
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            <input
              value={formState.platform_name}
              onChange={(event) =>
                updateField("platform_name", event.target.value)
              }
              placeholder="平台名称"
              className={inputClass}
              required
            />
            <input
              value={formState.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="入口标题"
              className={inputClass}
              required
            />
            <input
              value={formState.url}
              onChange={(event) => updateField("url", event.target.value)}
              placeholder="外部链接"
              className={inputClass}
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={formState.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="城市"
                className={inputClass}
              />
              <select
                value={formState.track}
                onChange={(event) =>
                  updateField("track", event.target.value as TrackValue | "")
                }
                className={selectClass}
              >
                <option value="">不限方向</option>
                {trackOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              value={formState.keywords}
              onChange={(event) => updateField("keywords", event.target.value)}
              placeholder="关键词，逗号分隔"
              className={inputClass}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={formState.sort_order}
                onChange={(event) =>
                  updateField("sort_order", event.target.value)
                }
                type="number"
                placeholder="排序"
                className={inputClass}
              />
              <label className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
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
          <div className="mt-4 flex flex-wrap justify-between gap-2">
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] disabled:translate-y-0 disabled:opacity-60"
              >
                {saving ? "保存中..." : editingId ? "保存修改" : "创建入口"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:text-slate-950"
              >
                重置
              </button>
            </div>
            {editingId ? (
              <button
                type="button"
                onClick={() => handleDelete(editingId)}
                className="h-10 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50"
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
