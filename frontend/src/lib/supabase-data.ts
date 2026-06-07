import type {
  DashboardSummary,
  Job,
  JobEvent,
  JobEventPayload,
  JobListFilters,
  JobPayload,
  Preference,
  PreferencePayload,
  SourceLink,
  SourceLinkPayload,
} from "@/lib/types";
import { analyzeJdText } from "@/lib/analyzer";
import { getSupabaseClient } from "@/lib/supabase";

const INTERVIEWING_STATUSES = new Set([
  "interview_1",
  "interview_2",
  "hr_interview",
]);

const INACTIVE_TOP_JOB_STATUSES = new Set(["rejected", "archived"]);

const DEFAULT_PREFERENCES: PreferencePayload = {
  target_cities: ["上海", "远程"],
  target_tracks: [
    "data_analyst",
    "ai_app_dev",
    "android_client",
    "model_deployment",
  ],
  priority_skills: ["Python", "SQL", "LLM", "RAG", "Agent", "Docker", "Linux"],
  min_salary: 18,
  default_resume_version: "v1",
  llm_enabled: false,
};

const DEFAULT_SOURCE_LINKS: SourceLinkPayload[] = [
  {
    source_key: "boss_zhipin",
    platform_name: "BOSS直聘",
    title: "BOSS直聘职位搜索",
    url: "https://www.zhipin.com/",
    keywords: ["AI", "数据分析", "Python"],
    enabled: true,
    sort_order: 10,
  },
  {
    source_key: "lagou",
    platform_name: "拉勾",
    title: "拉勾互联网招聘",
    url: "https://www.lagou.com/",
    keywords: ["互联网", "AI", "数据"],
    enabled: true,
    sort_order: 20,
  },
  {
    source_key: "liepin",
    platform_name: "猎聘",
    title: "猎聘中高端职位",
    url: "https://www.liepin.com/",
    keywords: ["中高端", "AI", "技术"],
    enabled: true,
    sort_order: 30,
  },
  {
    source_key: "zhaopin",
    platform_name: "智联招聘",
    title: "智联招聘职位分类",
    url: "https://www.zhaopin.com/jobs/",
    keywords: ["社招", "技术"],
    enabled: true,
    sort_order: 40,
  },
  {
    source_key: "51job",
    platform_name: "前程无忧",
    title: "前程无忧职位搜索",
    url: "https://www.51job.com/",
    keywords: ["社招", "上海"],
    enabled: true,
    sort_order: 50,
  },
  {
    source_key: "nowcoder",
    platform_name: "牛客",
    title: "牛客求职职位",
    url: "https://www.nowcoder.com/jobs/school/jobs",
    keywords: ["校招", "实习", "技术"],
    enabled: true,
    sort_order: 60,
  },
  {
    source_key: "maimai",
    platform_name: "脉脉",
    title: "脉脉职场机会",
    url: "https://maimai.cn/",
    keywords: ["内推", "职场", "AI"],
    enabled: true,
    sort_order: 70,
  },
];

const INITIAL_PREFERENCES_ROW: Preference = {
  id: 1,
  target_cities: [...DEFAULT_PREFERENCES.target_cities],
  target_tracks: [...DEFAULT_PREFERENCES.target_tracks],
  priority_skills: [...DEFAULT_PREFERENCES.priority_skills],
  min_salary: DEFAULT_PREFERENCES.min_salary,
  default_resume_version: DEFAULT_PREFERENCES.default_resume_version,
  llm_enabled: DEFAULT_PREFERENCES.llm_enabled,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const FALLBACK_TIMESTAMP = "2026-06-07T00:00:00.000Z";

const FALLBACK_SOURCE_LINKS: SourceLink[] = DEFAULT_SOURCE_LINKS.map(
  (sourceLink, index) => ({
    id: index + 1,
    source_key: sourceLink.source_key || `default_${index + 1}`,
    platform_name: sourceLink.platform_name || "招聘平台",
    title: sourceLink.title || "招聘入口",
    url: sourceLink.url || "https://example.com",
    city: sourceLink.city ?? null,
    track: sourceLink.track ?? null,
    keywords: normalizeList(sourceLink.keywords),
    enabled: sourceLink.enabled ?? true,
    sort_order: sourceLink.sort_order ?? (index + 1) * 10,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
  }),
);

const FALLBACK_JOBS: Job[] = [
  {
    id: 1,
    company_name: "星图智能",
    job_title: "AI 应用开发工程师",
    city: "上海 / 远程",
    platform: "BOSS直聘",
    job_link: "https://www.zhipin.com/",
    salary_text: "25k-40k",
    salary_min: 25,
    salary_max: 40,
    experience_required: "3年",
    degree_required: "本科",
    remote_allowed: true,
    jd_raw_text:
      "负责 AI 应用、RAG 检索增强和前后端工程化落地，熟悉 Python、React、FastAPI。",
    skills_extracted: ["Python", "React", "RAG", "FastAPI"],
    keywords: ["AI 应用", "LLM", "Docker"],
    track: "ai_app_dev",
    match_score: 92,
    match_level: "priority_apply",
    status: "ready_to_apply",
    resume_version: "v1",
    notes: "Supabase 网络不可达时的演示岗位，可继续验证看板与筛选体验。",
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
  },
  {
    id: 2,
    company_name: "海澜数据",
    job_title: "数据分析师",
    city: "上海",
    platform: "拉勾",
    job_link: "https://www.lagou.com/",
    salary_text: "18k-28k",
    salary_min: 18,
    salary_max: 28,
    experience_required: "1-3年",
    degree_required: "本科",
    remote_allowed: false,
    jd_raw_text:
      "负责业务指标分析、Dashboard 建设和 SQL 数据建模，熟悉 Python、SQL、BI。",
    skills_extracted: ["SQL", "Python", "BI"],
    keywords: ["指标体系", "Dashboard", "数据建模"],
    track: "data_analyst",
    match_score: 86,
    match_level: "priority_apply",
    status: "applied",
    resume_version: "v1",
    notes: "用于展示状态分布、方向分布和高频技能词。",
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
  },
  {
    id: 3,
    company_name: "云栈科技",
    job_title: "模型部署工程师",
    city: "杭州",
    platform: "猎聘",
    job_link: "https://www.liepin.com/",
    salary_text: "22k-35k",
    salary_min: 22,
    salary_max: 35,
    experience_required: "3-5年",
    degree_required: "本科",
    remote_allowed: false,
    jd_raw_text:
      "负责模型服务部署、容器化和 Linux 运维，熟悉 Docker、Kubernetes、Python。",
    skills_extracted: ["Docker", "Linux", "Python"],
    keywords: ["模型部署", "容器化", "服务稳定性"],
    track: "model_deployment",
    match_score: 78,
    match_level: "apply",
    status: "pending_analysis",
    resume_version: "v1",
    notes: "用于展示待分析和模型部署方向样本。",
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
  },
];

function isNetworkFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /Failed to fetch|ERR_CONNECTION|NetworkError|fetch failed/i.test(
    error.message,
  );
}

async function withNetworkFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isNetworkFetchError(error)) {
      return fallback();
    }

    throw error;
  }
}

function assertSupabaseError(error: unknown, fallbackMessage: string): never {
  if (error && typeof error === "object" && "message" in error) {
    throw new Error(
      String((error as { message?: string }).message || fallbackMessage),
    );
  }

  throw new Error(fallbackMessage);
}

function normalizeText(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeList(values: string[] | undefined | null): string[] {
  return (values || [])
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);
}

function buildJobSearchText(job: Job): string {
  return [
    job.company_name,
    job.job_title,
    job.city,
    job.platform,
    job.notes,
    job.jd_raw_text,
    ...(job.skills_extracted || []),
    ...(job.keywords || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function filterJobsByQuery(jobs: Job[], filters: JobListFilters): Job[] {
  const keyword = filters.q.trim().toLowerCase();
  const filtered = jobs.filter((job) => {
    if (keyword && !buildJobSearchText(job).includes(keyword)) {
      return false;
    }

    if (filters.city && !(job.city || "").includes(filters.city)) {
      return false;
    }
    if (filters.track && job.track !== filters.track) {
      return false;
    }
    if (filters.match_level && job.match_level !== filters.match_level) {
      return false;
    }
    if (filters.status && job.status !== filters.status) {
      return false;
    }
    if (filters.status_group === "interviewing" && !INTERVIEWING_STATUSES.has(job.status)) {
      return false;
    }

    return true;
  });

  const direction = filters.sort_order === "asc" ? 1 : -1;
  const sortByMatchScore = filters.sort_by === "match_score";

  return filtered.sort((left, right) => {
    if (sortByMatchScore) {
      const scoreDelta = left.match_score - right.match_score;
      if (scoreDelta !== 0) {
        return scoreDelta * direction;
      }
    } else {
      const leftUpdated = new Date(left.updated_at).getTime();
      const rightUpdated = new Date(right.updated_at).getTime();
      const updatedDelta = leftUpdated - rightUpdated;
      if (updatedDelta !== 0) {
        return updatedDelta * direction;
      }
    }

    return (left.id - right.id) * direction;
  });
}

function countBy<T extends string>(
  items: Job[],
  getter: (job: Job) => T,
): Array<{ count: number; value: T }> {
  const counts = new Map<T, number>();
  for (const item of items) {
    const key = getter(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((left, right) => right.count - left.count);
}

async function ensurePreferenceRow(client = getSupabaseClient()): Promise<Preference> {
  const { data, error } = await client
    .from("app_preferences")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    assertSupabaseError(error, "偏好配置读取失败");
  }

  if (data) {
    return data as Preference;
  }

  const now = new Date().toISOString();
  const payload: Preference = {
    ...INITIAL_PREFERENCES_ROW,
    created_at: now,
    updated_at: now,
  };

  const { data: inserted, error: insertError } = await client
    .from("app_preferences")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (insertError) {
    assertSupabaseError(insertError, "默认偏好配置初始化失败");
  }

  return inserted as Preference;
}

async function ensureSourceLinkSeeds(
  client = getSupabaseClient(),
): Promise<void> {
  const { data, error } = await client
    .from("source_links")
    .select("id")
    .limit(1);

  if (error) {
    assertSupabaseError(error, "来源链接读取失败");
  }

  if ((data || []).length > 0) {
    return;
  }

  const now = new Date().toISOString();
  const payload = DEFAULT_SOURCE_LINKS.map((item) => ({
    ...item,
    city: item.city ?? null,
    track: item.track ?? null,
    keywords: normalizeList(item.keywords),
    created_at: now,
    updated_at: now,
  }));

  const { error: seedError } = await client
    .from("source_links")
    .upsert(payload, { onConflict: "source_key" });

  if (seedError) {
    assertSupabaseError(seedError, "默认来源链接初始化失败");
  }
}

async function loadJobs(): Promise<Job[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("jobs").select("*");

  if (error) {
    assertSupabaseError(error, "岗位列表读取失败");
  }

  return (data || []) as Job[];
}

async function loadJob(jobId: string): Promise<Job | null> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("jobs").select("*").eq("id", Number(jobId)).maybeSingle();

  if (error) {
    assertSupabaseError(error, "岗位读取失败");
  }

  return (data as Job | null) ?? null;
}

async function persistJobEvent(
  jobId: number,
  payload: JobEventPayload,
): Promise<JobEvent> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("job_events")
    .insert({
      job_id: jobId,
      event_type: payload.event_type,
      notes: normalizeText(payload.notes),
      event_at: payload.event_at || new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    assertSupabaseError(error, "投递事件保存失败");
  }

  return data as JobEvent;
}

async function persistJob(payload: JobPayload): Promise<Job> {
  const client = getSupabaseClient();
  const row = {
    company_name: normalizeText(payload.company_name),
    job_title: normalizeText(payload.job_title),
    city: normalizeText(payload.city),
    platform: normalizeText(payload.platform),
    job_link: normalizeText(payload.job_link),
    salary_text: normalizeText(payload.salary_text),
    salary_min: payload.salary_min ?? null,
    salary_max: payload.salary_max ?? null,
    experience_required: normalizeText(payload.experience_required),
    degree_required: normalizeText(payload.degree_required),
    remote_allowed: payload.remote_allowed ?? false,
    jd_raw_text: normalizeText(payload.jd_raw_text),
    skills_extracted: normalizeList(payload.skills_extracted),
    keywords: normalizeList(payload.keywords),
    track: payload.track ?? "other",
    match_score: payload.match_score ?? 0,
    match_level: payload.match_level ?? "ignore",
    status: payload.status ?? "pending_analysis",
    resume_version: normalizeText(payload.resume_version),
    notes: normalizeText(payload.notes),
  };

  const { data, error } = await client.from("jobs").insert(row).select("*").single();

  if (error) {
    assertSupabaseError(error, "岗位创建失败");
  }

  const job = data as Job;
  await persistJobEvent(job.id, {
    event_type: "created",
    notes: "创建岗位记录。",
  });
  return job;
}

async function modifyJob(jobId: string, payload: JobPayload): Promise<Job> {
  const currentJob = await loadJob(jobId);
  if (!currentJob) {
    throw new Error("岗位不存在");
  }

  const client = getSupabaseClient();
  const row = {
    company_name: normalizeText(payload.company_name),
    job_title: normalizeText(payload.job_title),
    city: normalizeText(payload.city),
    platform: normalizeText(payload.platform),
    job_link: normalizeText(payload.job_link),
    salary_text: normalizeText(payload.salary_text),
    salary_min: payload.salary_min ?? null,
    salary_max: payload.salary_max ?? null,
    experience_required: normalizeText(payload.experience_required),
    degree_required: normalizeText(payload.degree_required),
    remote_allowed: payload.remote_allowed ?? false,
    jd_raw_text: normalizeText(payload.jd_raw_text),
    skills_extracted: normalizeList(payload.skills_extracted),
    keywords: normalizeList(payload.keywords),
    track: payload.track ?? "other",
    match_score: payload.match_score ?? 0,
    match_level: payload.match_level ?? "ignore",
    status: payload.status ?? "pending_analysis",
    resume_version: normalizeText(payload.resume_version),
    notes: normalizeText(payload.notes),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from("jobs")
    .update(row)
    .eq("id", Number(jobId))
    .select("*")
    .single();

  if (error) {
    assertSupabaseError(error, "岗位更新失败");
  }

  const updatedJob = data as Job;
  if (currentJob.status !== updatedJob.status) {
    await persistJobEvent(updatedJob.id, {
      event_type: updatedJob.status as JobEventPayload["event_type"],
      notes: `状态从 ${currentJob.status} 更新为 ${updatedJob.status}。`,
    });
  }

  return updatedJob;
}

function buildDashboardSummary(jobs: Job[], topN: number): DashboardSummary {
  const statusCounts = countBy(jobs, (job) => job.status).map((item) => ({
    status: item.value,
    count: item.count,
  }));
  const trackCounts = countBy(jobs, (job) => job.track).map((item) => ({
    track: item.value,
    count: item.count,
  }));
  const topJobs = jobs
    .filter((job) => job.match_level !== "ignore")
    .filter((job) => !INACTIVE_TOP_JOB_STATUSES.has(job.status))
    .sort((left, right) => {
      const scoreDelta = right.match_score - left.match_score;
      if (scoreDelta !== 0) {
        return scoreDelta;
      }
      return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
    })
    .slice(0, topN);

  const skillCounter = new Map<string, number>();
  for (const job of jobs) {
    for (const skill of job.skills_extracted || []) {
      const normalized = skill.trim();
      if (!normalized) {
        continue;
      }
      skillCounter.set(normalized, (skillCounter.get(normalized) || 0) + 1);
    }
  }

  const topSkills = Array.from(skillCounter.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, topN);

  return {
    total_jobs: jobs.length,
    status_counts: statusCounts,
    track_counts: trackCounts,
    shanghai_jobs: jobs.filter((job) => (job.city || "").includes("上海")).length,
    top_jobs: topJobs,
    top_skills: topSkills,
  };
}

export async function fetchJobsSupabase(filters: JobListFilters): Promise<Job[]> {
  return withNetworkFallback(
    async () => filterJobsByQuery(await loadJobs(), filters),
    () => filterJobsByQuery([...FALLBACK_JOBS], filters),
  );
}

export async function fetchJobSupabase(jobId: string): Promise<Job> {
  const job = await loadJob(jobId);
  if (!job) {
    throw new Error("岗位不存在");
  }
  return job;
}

export async function createJobSupabase(payload: JobPayload): Promise<Job> {
  return persistJob(payload);
}

export async function updateJobSupabase(jobId: string, payload: JobPayload): Promise<Job> {
  return modifyJob(jobId, payload);
}

export async function deleteJobSupabase(jobId: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from("jobs").delete().eq("id", Number(jobId));

  if (error) {
    assertSupabaseError(error, "岗位删除失败");
  }
}

export async function analyzeJdSupabase(
  jdRawText: string,
  preferences: Preference | null = null,
): Promise<ReturnType<typeof analyzeJdText>> {
  return analyzeJdText(jdRawText, preferences);
}

export async function fetchDashboardSummarySupabase(
  topN = 5,
): Promise<DashboardSummary> {
  return withNetworkFallback(
    async () => buildDashboardSummary(await loadJobs(), topN),
    () => buildDashboardSummary([...FALLBACK_JOBS], topN),
  );
}

export async function fetchPreferencesSupabase(): Promise<Preference> {
  return withNetworkFallback(
    () => ensurePreferenceRow(),
    () => ({ ...INITIAL_PREFERENCES_ROW }),
  );
}

export async function updatePreferencesSupabase(
  payload: PreferencePayload,
): Promise<Preference> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  const row = {
    id: 1,
    target_cities: normalizeList(payload.target_cities),
    target_tracks: (payload.target_tracks || []) as Preference["target_tracks"],
    priority_skills: normalizeList(payload.priority_skills),
    min_salary: payload.min_salary ?? null,
    default_resume_version: normalizeText(payload.default_resume_version),
    llm_enabled: payload.llm_enabled ?? false,
    created_at: INITIAL_PREFERENCES_ROW.created_at,
    updated_at: now,
  };

  const { data, error } = await client
    .from("app_preferences")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    assertSupabaseError(error, "偏好配置保存失败");
  }

  return data as Preference;
}

export async function fetchSourceLinksSupabase(
  includeDisabled = false,
): Promise<SourceLink[]> {
  return withNetworkFallback(
    async () => {
      await ensureSourceLinkSeeds();
      const client = getSupabaseClient();
      let query = client.from("source_links").select("*");
      if (!includeDisabled) {
        query = query.eq("enabled", true);
      }

      const { data, error } = await query
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        assertSupabaseError(error, "来源链接读取失败");
      }

      return (data || []) as SourceLink[];
    },
    () =>
      FALLBACK_SOURCE_LINKS.filter(
        (sourceLink) => includeDisabled || sourceLink.enabled,
      ),
  );
}

export async function createSourceLinkSupabase(
  payload: SourceLinkPayload,
): Promise<SourceLink> {
  const client = getSupabaseClient();
  const sourceKey =
    normalizeText(payload.source_key) ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `custom_${crypto.randomUUID().slice(0, 12)}`
      : `custom_${Math.random().toString(36).slice(2, 14)}`);

  const { data, error } = await client
    .from("source_links")
    .insert({
      source_key: sourceKey,
      platform_name: normalizeText(payload.platform_name),
      title: normalizeText(payload.title),
      url: normalizeText(payload.url),
      city: normalizeText(payload.city),
      track: payload.track ?? null,
      keywords: normalizeList(payload.keywords),
      enabled: payload.enabled ?? true,
      sort_order: payload.sort_order ?? 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    assertSupabaseError(error, "来源链接创建失败");
  }

  return data as SourceLink;
}

export async function updateSourceLinkSupabase(
  sourceLinkId: number,
  payload: SourceLinkPayload,
): Promise<SourceLink> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("source_links")
    .update({
      platform_name: normalizeText(payload.platform_name),
      title: normalizeText(payload.title),
      url: normalizeText(payload.url),
      city: normalizeText(payload.city),
      track: payload.track ?? null,
      keywords: normalizeList(payload.keywords),
      enabled: payload.enabled ?? true,
      sort_order: payload.sort_order ?? 100,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sourceLinkId)
    .select("*")
    .single();

  if (error) {
    assertSupabaseError(error, "来源链接更新失败");
  }

  return data as SourceLink;
}

export async function deleteSourceLinkSupabase(
  sourceLinkId: number,
): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from("source_links").delete().eq("id", sourceLinkId);

  if (error) {
    assertSupabaseError(error, "来源链接删除失败");
  }
}

export async function fetchJobEventsSupabase(jobId: string): Promise<JobEvent[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("job_events")
    .select("*")
    .eq("job_id", Number(jobId))
    .order("event_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    assertSupabaseError(error, "投递事件读取失败");
  }

  return (data || []) as JobEvent[];
}

export async function createJobEventSupabase(
  jobId: string,
  payload: JobEventPayload,
): Promise<JobEvent> {
  return persistJobEvent(Number(jobId), payload);
}
