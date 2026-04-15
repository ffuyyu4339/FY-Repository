"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { analyzeJD, createJob, deleteJob, fetchJob, updateJob } from "@/lib/api";
import {
  formatMatchLevelLabel,
  formatStatusLabel,
  formatTrackLabel,
  listToText,
  matchLevelOptions,
  statusOptions,
  textToList,
  trackOptions,
  type JobPayload,
  type MatchLevelValue,
  type StatusValue,
  type TrackValue,
} from "@/lib/types";

type JobEditorProps = {
  mode: "create" | "edit";
  jobId?: string;
};

type JobFormState = {
  company_name: string;
  job_title: string;
  city: string;
  platform: string;
  job_link: string;
  salary_text: string;
  salary_min: string;
  salary_max: string;
  experience_required: string;
  degree_required: string;
  remote_allowed: boolean;
  jd_raw_text: string;
  skills_extracted: string;
  keywords: string;
  track: TrackValue;
  match_score: string;
  match_level: MatchLevelValue;
  status: StatusValue;
  resume_version: string;
  notes: string;
};

const defaultFormState: JobFormState = {
  company_name: "",
  job_title: "",
  city: "",
  platform: "",
  job_link: "",
  salary_text: "",
  salary_min: "",
  salary_max: "",
  experience_required: "",
  degree_required: "",
  remote_allowed: false,
  jd_raw_text: "",
  skills_extracted: "",
  keywords: "",
  track: "other",
  match_score: "0",
  match_level: "ignore",
  status: "pending_analysis",
  resume_version: "",
  notes: "",
};

function toFormState(payload: JobPayload): JobFormState {
  return {
    company_name: payload.company_name || "",
    job_title: payload.job_title || "",
    city: payload.city || "",
    platform: payload.platform || "",
    job_link: payload.job_link || "",
    salary_text: payload.salary_text || "",
    salary_min: payload.salary_min ? String(payload.salary_min) : "",
    salary_max: payload.salary_max ? String(payload.salary_max) : "",
    experience_required: payload.experience_required || "",
    degree_required: payload.degree_required || "",
    remote_allowed: payload.remote_allowed || false,
    jd_raw_text: payload.jd_raw_text || "",
    skills_extracted: listToText(payload.skills_extracted || []),
    keywords: listToText(payload.keywords || []),
    track: payload.track || "other",
    match_score: String(payload.match_score ?? 0),
    match_level: payload.match_level || "ignore",
    status: payload.status || "pending_analysis",
    resume_version: payload.resume_version || "",
    notes: payload.notes || "",
  };
}

function toPayload(formState: JobFormState): JobPayload {
  return {
    company_name: formState.company_name || null,
    job_title: formState.job_title || null,
    city: formState.city || null,
    platform: formState.platform || null,
    job_link: formState.job_link || null,
    salary_text: formState.salary_text || null,
    salary_min: formState.salary_min ? Number(formState.salary_min) : null,
    salary_max: formState.salary_max ? Number(formState.salary_max) : null,
    experience_required: formState.experience_required || null,
    degree_required: formState.degree_required || null,
    remote_allowed: formState.remote_allowed,
    jd_raw_text: formState.jd_raw_text || null,
    skills_extracted: textToList(formState.skills_extracted),
    keywords: textToList(formState.keywords),
    track: formState.track,
    match_score: Number(formState.match_score || 0),
    match_level: formState.match_level,
    status: formState.status,
    resume_version: formState.resume_version || null,
    notes: formState.notes || null,
  };
}

export function JobEditor({ mode, jobId }: JobEditorProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<JobFormState>(defaultFormState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !jobId) {
      return;
    }

    const currentJobId = jobId;
    let cancelled = false;

    async function loadJob() {
      try {
        setLoading(true);
        const job = await fetchJob(currentJobId);
        if (!cancelled) {
          setFormState(toFormState(job));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "岗位详情加载失败");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJob();

    return () => {
      cancelled = true;
    };
  }, [jobId, mode]);

  async function handleAnalyze() {
    if (!formState.jd_raw_text.trim()) {
      setError("请先粘贴 JD 原文，再执行解析。");
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      const analysis = await analyzeJD(formState.jd_raw_text);
      setFormState((current) => ({
        ...current,
        company_name: analysis.company_name || current.company_name,
        job_title: analysis.job_title || current.job_title,
        city: analysis.city || current.city,
        experience_required: analysis.experience_required || current.experience_required,
        degree_required: analysis.degree_required || current.degree_required,
        salary_text: analysis.salary_text || current.salary_text,
        salary_min: analysis.salary_min ? String(analysis.salary_min) : current.salary_min,
        salary_max: analysis.salary_max ? String(analysis.salary_max) : current.salary_max,
        remote_allowed: analysis.remote_allowed,
        skills_extracted: listToText(analysis.skills_extracted),
        keywords: listToText(analysis.keywords),
        track: analysis.track,
        match_score: String(analysis.match_score),
        match_level: analysis.match_level,
      }));
      setSuccessMessage("JD 解析完成，结果已写入表单，你可以继续人工修正。");
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "JD 解析失败");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "edit" && !jobId) {
      setError("缺少岗位 ID，无法保存修改。");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      const payload = toPayload(formState);
      let job;

      if (mode === "create") {
        job = await createJob(payload);
      } else {
        if (!jobId) {
          throw new Error("缺少岗位 ID，无法保存修改。");
        }

        const currentJobId = jobId;
        job = await updateJob(currentJobId, payload);
      }

      setFormState(toFormState(job));
      setSuccessMessage(mode === "create" ? "岗位已创建。" : "岗位已更新。");

      if (mode === "create") {
        router.push(`/jobs/${job.id}`);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "岗位保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!jobId) {
      return;
    }
    const confirmed = window.confirm("确认删除这个岗位吗？删除后不可恢复。");
    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await deleteJob(jobId);
      router.push("/jobs");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "岗位删除失败");
    } finally {
      setDeleting(false);
    }
  }

  function updateField<Key extends keyof JobFormState>(key: Key, value: JobFormState[Key]) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-6 text-sm text-[var(--color-muted)]">
        正在加载岗位详情...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-6">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {mode === "create" ? "/jobs/new" : `/jobs/${jobId}`}
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          {mode === "create" ? "新增岗位" : "岗位详情与编辑"}
        </h1>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          支持录入原始 JD、执行规则解析、人工修正分析结果，并维护投递状态、简历版本和备注。
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
            <h2 className="text-xl font-semibold">岗位基础信息</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                value={formState.company_name}
                onChange={(event) => updateField("company_name", event.target.value)}
                placeholder="公司名称"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <input
                value={formState.job_title}
                onChange={(event) => updateField("job_title", event.target.value)}
                placeholder="岗位名称"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <input
                value={formState.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="城市"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <input
                value={formState.platform}
                onChange={(event) => updateField("platform", event.target.value)}
                placeholder="招聘平台"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <input
                value={formState.job_link}
                onChange={(event) => updateField("job_link", event.target.value)}
                placeholder="岗位链接"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none md:col-span-2"
              />
              <input
                value={formState.salary_text}
                onChange={(event) => updateField("salary_text", event.target.value)}
                placeholder="薪资文本"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={formState.salary_min}
                  onChange={(event) => updateField("salary_min", event.target.value)}
                  placeholder="薪资下限"
                  type="number"
                  className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
                />
                <input
                  value={formState.salary_max}
                  onChange={(event) => updateField("salary_max", event.target.value)}
                  placeholder="薪资上限"
                  type="number"
                  className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">JD 原文与解析</h2>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {analyzing ? "解析中..." : "解析 JD"}
              </button>
            </div>
            <textarea
              value={formState.jd_raw_text}
              onChange={(event) => updateField("jd_raw_text", event.target.value)}
              placeholder="粘贴岗位 JD 原文"
              rows={12}
              className="mt-4 w-full rounded-3xl border border-[var(--color-line)] px-4 py-4 outline-none"
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
            <h2 className="text-xl font-semibold">分析结果与投递流程</h2>
            <div className="mt-4 grid gap-4">
              <input
                value={formState.experience_required}
                onChange={(event) => updateField("experience_required", event.target.value)}
                placeholder="经验要求"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <input
                value={formState.degree_required}
                onChange={(event) => updateField("degree_required", event.target.value)}
                placeholder="学历要求"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <textarea
                value={formState.skills_extracted}
                onChange={(event) => updateField("skills_extracted", event.target.value)}
                placeholder="技能关键词，逗号分隔"
                rows={3}
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <textarea
                value={formState.keywords}
                onChange={(event) => updateField("keywords", event.target.value)}
                placeholder="关键词，逗号分隔"
                rows={3}
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <select
                value={formState.track}
                onChange={(event) => updateField("track", event.target.value as TrackValue)}
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              >
                {trackOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={formState.match_score}
                  onChange={(event) => updateField("match_score", event.target.value)}
                  type="number"
                  min={0}
                  max={100}
                  placeholder="匹配分"
                  className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
                />
                <select
                  value={formState.match_level}
                  onChange={(event) =>
                    updateField("match_level", event.target.value as MatchLevelValue)
                  }
                  className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
                >
                  {matchLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={formState.status}
                onChange={(event) => updateField("status", event.target.value as StatusValue)}
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] px-4 py-3">
                <input
                  type="checkbox"
                  checked={formState.remote_allowed}
                  onChange={(event) => updateField("remote_allowed", event.target.checked)}
                />
                <span className="text-sm">支持远程</span>
              </label>
              <input
                value={formState.resume_version}
                onChange={(event) => updateField("resume_version", event.target.value)}
                placeholder="简历版本"
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
              <textarea
                value={formState.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="备注"
                rows={5}
                className="rounded-2xl border border-[var(--color-line)] px-4 py-3 outline-none"
              />
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-panel-strong)] p-6">
            <h2 className="text-xl font-semibold">当前摘要</h2>
            <div className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
              <p>岗位方向：{formatTrackLabel(formState.track)}</p>
              <p>匹配等级：{formatMatchLevelLabel(formState.match_level)}</p>
              <p>投递状态：{formatStatusLabel(formState.status)}</p>
              <p>技能：{formState.skills_extracted || "未填写"}</p>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[var(--color-accent)] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {saving ? "保存中..." : mode === "create" ? "创建岗位" : "保存修改"}
            </button>
            {mode === "edit" ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full border border-red-200 bg-white px-5 py-3 font-medium text-red-600 disabled:opacity-60"
              >
                {deleting ? "删除中..." : "删除岗位"}
              </button>
            ) : null}
          </div>
        </div>
      </form>
    </section>
  );
}
