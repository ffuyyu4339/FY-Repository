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

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20";

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
      <div className="grid gap-5 border-b border-slate-200 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            作战台 / 设置
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            偏好设置
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            设置目标城市、方向、重点技能和 LLM 开关，影响后续 JD 解析评分。
          </p>
        </div>
        <Link
          href="/sources"
          className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
        >
          管理平台入口
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

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-5 lg:grid-cols-[1fr_320px]"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
                      className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm"
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
                  <label className="flex h-10 items-center justify-between self-end rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
                    启用 LLM 解析
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

        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-base font-semibold text-slate-950">运行边界</h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-500">
            <p>系统不保存招聘平台账号、密码、Cookie 或验证码。</p>
            <p>LLM 只解析用户主动粘贴的 JD，不抓取外部页面。</p>
            <p>未配置后端 LLM 环境变量时，即使打开开关也会回退规则引擎。</p>
          </div>
          <button
            type="submit"
            disabled={saving || loading}
            className="mt-4 h-10 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] disabled:translate-y-0 disabled:opacity-60"
          >
            {saving ? "保存中..." : "保存偏好"}
          </button>
        </aside>
      </form>
    </section>
  );
}
