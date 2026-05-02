"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import {
  analyzeJD,
  createJobEvent,
  createJob,
  deleteJob,
  fetchPreferences,
  fetchJobEvents,
  fetchJob,
  updateJob,
} from "@/lib/api";
import {
  formatMatchLevelLabel,
  formatJobEventLabel,
  formatStatusLabel,
  formatTrackLabel,
  listToText,
  matchLevelOptions,
  statusOptions,
  textToList,
  trackOptions,
  type JobPayload,
  type JobEvent,
  type JobEventType,
  type JobEventPayload,
  type MatchLevelValue,
  type JDAnalysisResult,
  type StatusValue,
  type TrackValue,
} from "@/lib/types";
import {
  MatchBadge,
  PageHero,
  ScoreRing,
  StatusBadge,
  accentButtonClass,
  cn,
  controlClass,
  primaryButtonClass,
  secondaryButtonClass,
  selectControlClass,
  textareaControlClass,
} from "@/components/ui";

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

const fieldClass = controlClass;
const selectClass = selectControlClass;
const textareaClass = cn(textareaControlClass, "resize-y");

const paneClass = "rounded-lg border border-[var(--color-border)] bg-white";

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

const manualEventOptions: { value: JobEventType; label: string }[] = [
  { value: "opened_source", label: "打开来源" },
  { value: "copied_jd", label: "复制 JD" },
  { value: "applied", label: "已投递" },
  { value: "online_test", label: "在线测试" },
  { value: "interview_1", label: "一面" },
  { value: "interview_2", label: "二面" },
  { value: "hr_interview", label: "HR 面" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "已拒绝" },
  { value: "archived", label: "归档" },
  { value: "note", label: "备注" },
];

const editorFlowSteps = ["来源", "JD 原文", "解析", "确认"];

const analysisSourceLabelMap: Record<
  NonNullable<JDAnalysisResult["analysis_source"]>,
  string
> = {
  rules: "规则引擎",
  llm: "LLM 解析",
  fallback: "LLM 回退规则",
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
    <span className="rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
      {label}
      <span className="ml-1 font-semibold text-[var(--color-text-primary)]">
        {value}
      </span>
    </span>
  );
}

function StickyActionBar({
  deleting,
  formState,
  mode,
  onDelete,
  onReset,
  saving,
  submitLabel,
}: {
  deleting: boolean;
  formState: JobFormState;
  mode: "create" | "edit";
  onDelete: () => void;
  onReset: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-[var(--color-border)] bg-[rgba(246,242,234,0.92)] py-3 backdrop-blur lg:col-span-2">
      <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 text-xs leading-5 text-[var(--color-text-secondary)]">
          <ScoreRing score={Number(formState.match_score || 0)} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[var(--color-text-primary)]">
              {formState.job_title || "未填写岗位名称"}
            </p>
            <p className="truncate">
              {formatTrackLabel(formState.track)} ·{" "}
              {formatMatchLevelLabel(formState.match_level)} ·{" "}
              {formatStatusLabel(formState.status)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "create" ? (
            <button
              type="button"
              onClick={onReset}
              className={secondaryButtonClass}
            >
              重置
            </button>
          ) : null}
          {mode === "edit" ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "删除中..." : "删除岗位"}
            </button>
          ) : null}
          <button
            type="submit"
            name="intent"
            value="return"
            disabled={saving}
            className={secondaryButtonClass}
          >
            保存并返回
          </button>
          <button
            type="submit"
            name="intent"
            value="stay"
            disabled={saving}
            className={primaryButtonClass}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
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
  const [jobEvents, setJobEvents] = useState<JobEvent[]>([]);
  const [eventType, setEventType] = useState<JobEventType>("applied");
  const [eventNotes, setEventNotes] = useState("");
  const [addingEvent, setAddingEvent] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<
    JDAnalysisResult["analysis_source"] | null
  >(null);

  useEffect(() => {
    if (mode !== "create" || typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const platform = params.get("platform");
    const jobLink = params.get("job_link");

    setFormState((current) => ({
      ...current,
      platform: platform || current.platform,
      job_link: jobLink || current.job_link,
    }));

    let cancelled = false;

    async function loadDefaultPreferences() {
      try {
        const preferences = await fetchPreferences();
        if (!cancelled && preferences.default_resume_version) {
          setFormState((current) => ({
            ...current,
            resume_version:
              current.resume_version ||
              preferences.default_resume_version ||
              "",
          }));
        }
      } catch {
        // 偏好加载失败不阻塞岗位录入。
      }
    }

    loadDefaultPreferences();

    return () => {
      cancelled = true;
    };
  }, [mode]);

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
          setJobEvents(await fetchJobEvents(currentJobId));
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
      setAnalysisSource(analysis.analysis_source || "rules");
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
      const sourceLabel =
        analysisSourceLabelMap[analysis.analysis_source || "rules"];
      setSuccessMessage(
        `JD 解析完成（${sourceLabel}），结果已写入表单，你可以继续人工修正。`,
      );
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
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const intent = submitter?.value === "return" ? "return" : "stay";

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

      if (intent === "return") {
        router.push("/jobs");
        return;
      }

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

  async function reloadJobEvents(currentJobId: string) {
    setJobEvents(await fetchJobEvents(currentJobId));
  }

  async function handleAddEvent() {
    if (!jobId) {
      setError("请先保存岗位，再记录投递事件。");
      return;
    }

    try {
      setAddingEvent(true);
      setError(null);
      const payload: JobEventPayload = {
        event_type: eventType,
        notes: eventNotes || null,
      };
      await createJobEvent(jobId, payload);
      setEventNotes("");
      await reloadJobEvents(jobId);
      setSuccessMessage("投递事件已记录。");
    } catch (eventError) {
      setError(
        eventError instanceof Error ? eventError.message : "事件记录失败",
      );
    } finally {
      setAddingEvent(false);
    }
  }

  function updateField<Key extends keyof JobFormState>(
    key: Key,
    value: JobFormState[Key],
  ) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  function handleResetForm() {
    setFormState(defaultFormState);
    setAnalysisSource(null);
    setError(null);
    setSuccessMessage(null);
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-6 text-sm text-[var(--color-text-secondary)]">
        正在加载岗位详情...
      </div>
    );
  }

  const pageLabel =
    mode === "create"
      ? "workspace / jobs / new"
      : `workspace / jobs / ${jobId}`;
  const title = mode === "create" ? "JD Intake Studio" : "岗位详情与编辑";
  const submitLabel = saving
    ? "保存中..."
    : mode === "create"
      ? "保存岗位"
      : "保存修改";
  const sourceUrlLabel =
    formState.job_link || "从平台入口进入时会自动带入岗位链接";

  return (
    <section className="space-y-5 pb-4">
      <PageHero
        breadcrumb={pageLabel}
        title={title}
        description="左侧完成来源链接、平台信息和 JD 原文录入，右侧检查解析字段、匹配结果和投递流程。"
        actions={
          <>
            <Link href="/jobs" className={secondaryButtonClass}>
              返回列表
            </Link>
            {metricBadge("方向", formatTrackLabel(formState.track))}
            {metricBadge("等级", formatMatchLevelLabel(formState.match_level))}
            {metricBadge("分数", `${formState.match_score || 0}`)}
            {analysisSource
              ? metricBadge("解析", analysisSourceLabelMap[analysisSource])
              : null}
          </>
        }
      />

      <div className="grid gap-2 rounded-lg border border-[var(--color-border)] bg-white p-3 sm:grid-cols-4">
        {editorFlowSteps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-slate-700"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-mono text-xs font-semibold text-[var(--color-accent)] ring-1 ring-slate-200">
              {index + 1}
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

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <section className={`${paneClass} lg:sticky lg:top-24`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                JD Studio
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                保留来源链接、平台信息和原始 JD，解析结果会自动写入右侧
                Inspector。
              </p>
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className={cn(accentButtonClass, "shrink-0")}
            >
              {analyzing ? "解析中..." : "一键解析 JD"}
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
              <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <p className="ml-2 min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1.5 font-mono text-[11px] text-slate-500 ring-1 ring-slate-200">
                  {sourceUrlLabel}
                </p>
              </div>
              <div className="grid gap-3 px-3 py-3 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] text-slate-400">平台</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                    {formState.platform || "未填写"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">岗位</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                    {formState.job_title || "等待解析"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">状态</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                    {formatStatusLabel(formState.status)}
                  </p>
                </div>
              </div>
            </div>
            <textarea
              value={formState.jd_raw_text}
              onChange={(event) =>
                updateField("jd_raw_text", event.target.value)
              }
              placeholder="粘贴岗位 JD 原文"
              className={cn(textareaClass, "min-h-[320px] max-h-[420px]")}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{formState.jd_raw_text.trim().length} 字</span>
              <span>建议先解析，再检查薪资、技能和匹配等级。</span>
            </div>
          </div>
        </section>

        <aside className={paneClass}>
          <div className="border-b border-slate-100 bg-white px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                  Analysis Inspector
                </h2>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                  基础信息、分析结果和投递流程合并维护。
                </p>
              </div>
              <StatusBadge status={formState.status} />
            </div>
          </div>

          <div className="space-y-5 px-4 py-4">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2">
                <p className="text-[11px] text-slate-400">方向</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-950">
                  {formatTrackLabel(formState.track)}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2">
                <p className="mb-1 text-[11px] text-slate-400">匹配等级</p>
                <MatchBadge level={formState.match_level} />
              </div>
              <div className="rounded-lg border border-orange-100 bg-[var(--color-accent-soft)] px-3 py-2">
                <p className="text-[11px] text-orange-700">匹配分</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-950">
                  {formState.match_score || 0}
                </p>
              </div>
            </div>

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
                <label className="flex h-11 items-center justify-between rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm sm:col-span-2">
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
              description="选择当前生命周期状态，后续可在详情页继续追加事件。"
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
              </div>
            </SectionBlock>

            <SectionBlock
              title="备注与简历版本"
              description="保留本次投递使用的简历版本、人工判断和后续提醒。"
            >
              <div className="grid gap-3">
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

            {mode === "edit" ? (
              <SectionBlock
                title="投递时间线"
                description="记录外部平台上的手动动作和后续反馈，不接管平台账号。"
              >
                <div className="grid gap-3">
                  <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
                    <select
                      value={eventType}
                      onChange={(event) =>
                        setEventType(event.target.value as JobEventType)
                      }
                      className={selectClass}
                    >
                      {manualEventOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={eventNotes}
                      onChange={(event) => setEventNotes(event.target.value)}
                      placeholder="事件备注，例如：已在 BOSS 手动投递"
                      className={fieldClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    disabled={addingEvent}
                    className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingEvent ? "记录中..." : "记录事件"}
                  </button>

                  <div className="space-y-2">
                    {jobEvents.length === 0 ? (
                      <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        暂无投递事件。
                      </p>
                    ) : null}
                    {jobEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {formatJobEventLabel(event.event_type)}
                          </span>
                          <time className="text-xs text-slate-400">
                            {new Date(event.event_at).toLocaleString("zh-CN")}
                          </time>
                        </div>
                        {event.notes ? (
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {event.notes}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </SectionBlock>
            ) : null}
          </div>
        </aside>

        <StickyActionBar
          deleting={deleting}
          formState={formState}
          mode={mode}
          onDelete={handleDelete}
          onReset={handleResetForm}
          saving={saving}
          submitLabel={submitLabel}
        />
      </form>
    </section>
  );
}
