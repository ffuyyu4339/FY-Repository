"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchPreferences, updatePreferences } from "@/lib/api";
import {
  listToText,
  textToList,
  trackOptions,
  type PreferencePayload,
  type TrackValue,
} from "@/lib/types";
import {
  PageHero,
  cn,
  controlClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui";

type SettingsFormState = {
  target_cities: string;
  target_tracks: TrackValue[];
  priority_skills: string;
  min_salary: string;
  default_resume_version: string;
  llm_enabled: boolean;
};

const defaultFormState: SettingsFormState = {
  target_cities: "",
  target_tracks: [],
  priority_skills: "",
  min_salary: "",
  default_resume_version: "",
  llm_enabled: false,
};

const inputClass = controlClass;

function toPayload(formState: SettingsFormState): PreferencePayload {
  return {
    target_cities: textToList(formState.target_cities),
    target_tracks: formState.target_tracks,
    priority_skills: textToList(formState.priority_skills),
    min_salary: formState.min_salary ? Number(formState.min_salary) : null,
    default_resume_version: formState.default_resume_version || null,
    llm_enabled: formState.llm_enabled,
  };
}

export function SettingsClient() {
  const [formState, setFormState] =
    useState<SettingsFormState>(defaultFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPreferences() {
      try {
        setLoading(true);
        const preferences = await fetchPreferences();
        if (!cancelled) {
          setFormState({
            target_cities: listToText(preferences.target_cities),
            target_tracks: preferences.target_tracks,
            priority_skills: listToText(preferences.priority_skills),
            min_salary: preferences.min_salary
              ? String(preferences.min_salary)
              : "",
            default_resume_version: preferences.default_resume_version || "",
            llm_enabled: preferences.llm_enabled,
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "偏好配置加载失败",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateTrack(track: TrackValue, checked: boolean) {
    setFormState((current) => ({
      ...current,
      target_tracks: checked
        ? [...current.target_tracks, track]
        : current.target_tracks.filter((item) => item !== track),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      const preferences = await updatePreferences(toPayload(formState));
      setFormState({
        target_cities: listToText(preferences.target_cities),
        target_tracks: preferences.target_tracks,
        priority_skills: listToText(preferences.priority_skills),
        min_salary: preferences.min_salary
          ? String(preferences.min_salary)
          : "",
        default_resume_version: preferences.default_resume_version || "",
        llm_enabled: preferences.llm_enabled,
      });
      setSuccessMessage("偏好配置已保存。");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <PageHero
        breadcrumb="作战台 / 设置"
        title="系统设置"
        description="配置匹配偏好、本地存储和可选 JD 解析增强；排序建议基于 JD 解析字段、偏好配置和状态流。"
        variant="mission"
        actions={
          <Link href="/sources" className={secondaryButtonClass}>
            管理入口库
          </Link>
        }
      />

      {error ? (
        <div className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-orange-200 bg-[var(--color-accent-soft)] px-4 py-3 text-sm text-[var(--color-accent)] shadow-sm">
          {successMessage}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-5 lg:grid-cols-[1fr_340px]"
      >
        <div className="rounded-lg border border-white/70 bg-white p-4 shadow-[var(--shadow-soft)]">
          {loading ? (
            <p className="text-sm text-slate-500">正在加载偏好配置...</p>
          ) : (
            <div className="space-y-5">
              <section className="space-y-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    匹配偏好
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    偏好越明确，匹配分越贴近当前求职方向。
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-medium text-slate-600">
                      目标城市
                    </span>
                    <input
                      value={formState.target_cities}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          target_cities: event.target.value,
                        }))
                      }
                      placeholder="上海, 远程"
                      className={inputClass}
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-medium text-slate-600">
                      最低期望薪资 K/月
                    </span>
                    <input
                      value={formState.min_salary}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          min_salary: event.target.value,
                        }))
                      }
                      type="number"
                      placeholder="18"
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-3 border-t border-slate-100 pt-5">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    目标方向
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    被选中的方向会获得更高方向匹配权重。
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {trackOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-[0_1px_0_rgba(16,21,34,0.03)]"
                    >
                      {option.label}
                      <input
                        type="checkbox"
                        checked={formState.target_tracks.includes(option.value)}
                        onChange={(event) =>
                          updateTrack(option.value, event.target.checked)
                        }
                        className="h-4 w-4 accent-[var(--color-accent)]"
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="space-y-3 border-t border-slate-100 pt-5">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    技能与简历
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    技能用于技术栈匹配，默认简历版本用于投递记录。
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 sm:col-span-2">
                    <span className="text-xs font-medium text-slate-600">
                      重点技能
                    </span>
                    <input
                      value={formState.priority_skills}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          priority_skills: event.target.value,
                        }))
                      }
                      placeholder="Python, SQL, LLM, RAG"
                      className={inputClass}
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-medium text-slate-600">
                      默认简历版本
                    </span>
                    <input
                      value={formState.default_resume_version}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          default_resume_version: event.target.value,
                        }))
                      }
                      placeholder="v1"
                      className={inputClass}
                    />
                  </label>
                  <label className="flex h-10 items-center justify-between self-end rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-[0_1px_0_rgba(16,21,34,0.03)]">
                    启用 LLM 解析增强
                    <input
                      type="checkbox"
                      checked={formState.llm_enabled}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          llm_enabled: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                  </label>
                </div>
              </section>
            </div>
          )}
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24">
          <section className="rounded-lg border border-black/20 bg-[var(--color-ink)] p-4 text-white shadow-[var(--shadow-soft)]">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-orange-200">
              安全边界
            </p>
            <h2 className="mt-1 text-base font-semibold">
              手动流程，不接管账号
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-6 text-white/62">
              <p>不保存招聘平台账号、密码、Cookie 或验证码。</p>
              <p>不自动投递；不抓取招聘网站；不模拟平台登录态。</p>
              <p>用户手动打开网页、复制 JD、手动投递，并在系统内记录状态。</p>
            </div>
          </section>

          <section className="rounded-lg border border-white/70 bg-white p-4 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-slate-950">
              本地存储 (PostgreSQL)
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              岗位、偏好、入口链接和投递事件写入本地数据库，用于个人求职档案和数据看板。
            </p>
          </section>

          <section className="rounded-lg border border-white/70 bg-white p-4 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-slate-950">
              JD 解析增强
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              LLM 开关只影响用户主动粘贴 JD
              后的字段提取增强；未配置后端环境变量时会回退规则引擎。
            </p>
          </section>

          <button
            type="submit"
            disabled={saving || loading}
            className={cn("w-full", primaryButtonClass)}
          >
            {saving ? "保存中..." : "保存偏好"}
          </button>
        </aside>
      </form>
    </section>
  );
}
