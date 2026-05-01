"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import {
  analyzeJD,
  createJob,
  deleteJob,
  fetchJob,
  updateJob,
} from "@/lib/api";
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

type FieldProps = {
  children: ReactNode;
  className?: string;
  label: string;
};

type SectionBlockProps = {
  children: ReactNode;
  description?: string;
  title: string;
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

const fieldClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20";

const selectClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20";

const textareaClass =
  "w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20";

const paneClass = "rounded-2xl border border-slate-200 bg-white shadow-sm";

const statusHintMap: Record<StatusValue, string> = {
  pending_analysis: "待补 JD 或待解析",
  ready_to_apply: "已分析，准备投递",
  applied: "已投递，等待反馈",
  online_test: "笔试或测评进行中",
  interview_1: "一面阶段",
  interview_2: "二面阶段",
  hr_interview: "HR 沟通阶段",
  offer: "已进入 Offer",
  rejected: "已拒绝，待复盘",
  archived: "已归档",
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

function Field({ children, className = "", label }: FieldProps) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function SectionBlock({ children, description, title }: SectionBlockProps) {
  return (
    <section className="space-y-4 border-t border-slate-100 pt-5 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function metricBadge(label: string, value: string) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
      {label}
      <span className="ml-1 font-semibold text-slate-950">{value}</span>
    </span>
  );
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
          setError(
            loadError instanceof Error ? loadError.message : "岗位详情加载失败",
          );
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
        experience_required:
          analysis.experience_required || current.experience_required,
        degree_required: analysis.degree_required || current.degree_required,
        salary_text: analysis.salary_text || current.salary_text,
        salary_min: analysis.salary_min
          ? String(analysis.salary_min)
          : current.salary_min,
        salary_max: analysis.salary_max
          ? String(analysis.salary_max)
          : current.salary_max,
        remote_allowed: analysis.remote_allowed,
        skills_extracted: listToText(analysis.skills_extracted),
        keywords: listToText(analysis.keywords),
        track: analysis.track,
        match_score: String(analysis.match_score),
        match_level: analysis.match_level,
        status:
          current.status === "pending_analysis" &&
          analysis.match_level !== "ignore"
            ? "ready_to_apply"
            : current.status,
      }));
      setSuccessMessage("JD 解析完成，结果已写入表单，你可以继续人工修正。");
    } catch (analysisError) {
      setError(
        analysisError instanceof Error ? analysisError.message : "JD 解析失败",
      );
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
      setError(
        deleteError instanceof Error ? deleteError.message : "岗位删除失败",
      );
    } finally {
      setDeleting(false);
    }
  }

  function updateField<Key extends keyof JobFormState>(
    key: Key,
    value: JobFormState[Key],
  ) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 shadow-sm">
        正在加载岗位详情...
      </div>
    );
  }

  const pageLabel =
    mode === "create"
      ? "workspace / jobs / new"
      : `workspace / jobs / ${jobId}`;
  const title = mode === "create" ? "新增岗位" : "岗位详情与编辑";
  const submitLabel = saving
    ? "保存中..."
    : mode === "create"
      ? "保存岗位"
      : "保存修改";

  return (
    <section className="space-y-5 pb-4">
      <div className="grid gap-5 border-b border-slate-200 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            {pageLabel}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            左侧粘贴和解析 JD，右侧集中修正结构化字段、匹配结果和投递流程。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/jobs"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-950"
          >
            返回列表
          </Link>
          {metricBadge("方向", formatTrackLabel(formState.track))}
          {metricBadge("等级", formatMatchLevelLabel(formState.match_level))}
          {metricBadge("分数", `${formState.match_score || 0}`)}
        </div>
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
        className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <section className={`${paneClass} lg:sticky lg:top-24`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                JD 原文与解析
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                保留原始描述，解析结果会自动写入右侧表单，仍可人工修正。
              </p>
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f350c] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {analyzing ? "解析中..." : "一键解析 JD"}
            </button>
          </div>
          <div className="p-4">
            <textarea
              value={formState.jd_raw_text}
              onChange={(event) =>
                updateField("jd_raw_text", event.target.value)
              }
              placeholder="粘贴岗位 JD 原文"
              className={`${textareaClass} min-h-[500px] lg:min-h-[calc(100vh-18rem)]`}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{formState.jd_raw_text.trim().length} 字</span>
              <span>建议先解析，再检查薪资、技能和匹配等级。</span>
            </div>
          </div>
        </section>

        <aside
          className={`${paneClass} lg:max-h-[calc(100vh-6.75rem)] lg:overflow-y-auto`}
        >
          <div className="border-b border-slate-100 bg-white/95 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:z-10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  岗位表单
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  基础信息、分析结果和投递流程合并维护。
                </p>
              </div>
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent)]">
                {formatStatusLabel(formState.status)}
              </span>
            </div>
          </div>

          <div className="space-y-5 px-4 py-4">
            <SectionBlock
              title="岗位基础信息"
              description="解析后自动回填，也可以直接手动录入。"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="公司名称">
                  <input
                    value={formState.company_name}
                    onChange={(event) =>
                      updateField("company_name", event.target.value)
                    }
                    placeholder="公司名称"
                    className={fieldClass}
                  />
                </Field>
                <Field label="岗位名称">
                  <input
                    value={formState.job_title}
                    onChange={(event) =>
                      updateField("job_title", event.target.value)
                    }
                    placeholder="岗位名称"
                    className={fieldClass}
                  />
                </Field>
                <Field label="城市">
                  <input
                    value={formState.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                    placeholder="城市"
                    className={fieldClass}
                  />
                </Field>
                <Field label="招聘平台">
                  <input
                    value={formState.platform}
                    onChange={(event) =>
                      updateField("platform", event.target.value)
                    }
                    placeholder="招聘平台"
                    className={fieldClass}
                  />
                </Field>
                <Field label="岗位链接" className="sm:col-span-2">
                  <input
                    value={formState.job_link}
                    onChange={(event) =>
                      updateField("job_link", event.target.value)
                    }
                    placeholder="岗位链接"
                    className={fieldClass}
                  />
                </Field>
                <Field label="薪资文本" className="sm:col-span-2">
                  <input
                    value={formState.salary_text}
                    onChange={(event) =>
                      updateField("salary_text", event.target.value)
                    }
                    placeholder="薪资文本"
                    className={fieldClass}
                  />
                </Field>
                <Field label="薪资下限">
                  <input
                    value={formState.salary_min}
                    onChange={(event) =>
                      updateField("salary_min", event.target.value)
                    }
                    placeholder="薪资下限"
                    type="number"
                    className={fieldClass}
                  />
                </Field>
                <Field label="薪资上限">
                  <input
                    value={formState.salary_max}
                    onChange={(event) =>
                      updateField("salary_max", event.target.value)
                    }
                    placeholder="薪资上限"
                    type="number"
                    className={fieldClass}
                  />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock
              title="分析结果"
              description="匹配分、方向和关键词会影响后续筛选与 Dashboard。"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="经验要求">
                  <input
                    value={formState.experience_required}
                    onChange={(event) =>
                      updateField("experience_required", event.target.value)
                    }
                    placeholder="经验要求"
                    className={fieldClass}
                  />
                </Field>
                <Field label="学历要求">
                  <input
                    value={formState.degree_required}
                    onChange={(event) =>
                      updateField("degree_required", event.target.value)
                    }
                    placeholder="学历要求"
                    className={fieldClass}
                  />
                </Field>
                <Field label="岗位方向">
                  <select
                    value={formState.track}
                    onChange={(event) =>
                      updateField("track", event.target.value as TrackValue)
                    }
                    className={selectClass}
                  >
                    {trackOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="匹配分">
                  <input
                    value={formState.match_score}
                    onChange={(event) =>
                      updateField("match_score", event.target.value)
                    }
                    type="number"
                    min={0}
                    max={100}
                    placeholder="匹配分"
                    className={fieldClass}
                  />
                </Field>
                <Field label="匹配等级">
                  <select
                    value={formState.match_level}
                    onChange={(event) =>
                      updateField(
                        "match_level",
                        event.target.value as MatchLevelValue,
                      )
                    }
                    className={selectClass}
                  >
                    {matchLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="投递状态">
                  <select
                    value={formState.status}
                    onChange={(event) =>
                      updateField("status", event.target.value as StatusValue)
                    }
                    className={selectClass}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <label className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm sm:col-span-2">
                  <span>
                    <span className="font-medium text-slate-700">支持远程</span>
                    <span className="ml-2 text-xs text-slate-400">
                      用于城市匹配分参考
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={formState.remote_allowed}
                    onChange={(event) =>
                      updateField("remote_allowed", event.target.checked)
                    }
                    className="h-4 w-4 accent-[var(--color-accent)]"
                  />
                </label>
                <Field label="技能关键词" className="sm:col-span-2">
                  <textarea
                    value={formState.skills_extracted}
                    onChange={(event) =>
                      updateField("skills_extracted", event.target.value)
                    }
                    placeholder="技能关键词，逗号分隔"
                    rows={3}
                    className={textareaClass}
                  />
                </Field>
                <Field label="关键词" className="sm:col-span-2">
                  <textarea
                    value={formState.keywords}
                    onChange={(event) =>
                      updateField("keywords", event.target.value)
                    }
                    placeholder="关键词，逗号分隔"
                    rows={3}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock
              title="投递流程"
              description="记录简历版本和人工备注，便于详情页继续维护。"
            >
              <div className="grid gap-3">
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-600">
                    快捷状态流
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {statusOptions.map((option) => {
                      const active = formState.status === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            updateField("status", option.value as StatusValue)
                          }
                          className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                            active
                              ? "border-orange-200 bg-orange-50 text-[var(--color-accent)]"
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          <span className="block font-semibold">
                            {option.label}
                          </span>
                          <span className="mt-0.5 block leading-5">
                            {statusHintMap[option.value]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Field label="简历版本">
                  <input
                    value={formState.resume_version}
                    onChange={(event) =>
                      updateField("resume_version", event.target.value)
                    }
                    placeholder="简历版本"
                    className={fieldClass}
                  />
                </Field>
                <Field label="备注">
                  <textarea
                    value={formState.notes}
                    onChange={(event) =>
                      updateField("notes", event.target.value)
                    }
                    placeholder="备注"
                    rows={5}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </SectionBlock>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-white/95 p-4 backdrop-blur">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs leading-5 text-slate-500">
                <p className="font-semibold text-slate-900">
                  {formState.job_title || "未填写岗位名称"}
                </p>
                <p>
                  {formatTrackLabel(formState.track)} ·{" "}
                  {formatMatchLevelLabel(formState.match_level)} ·{" "}
                  {formState.match_score || 0} 分
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {mode === "edit" ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="h-10 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting ? "删除中..." : "删除岗位"}
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitLabel}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}
