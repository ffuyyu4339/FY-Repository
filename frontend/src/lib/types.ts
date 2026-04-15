export type TrackValue =
  | "data_analyst"
  | "ai_app_dev"
  | "android_client"
  | "model_deployment"
  | "general_software"
  | "other";

export type MatchLevelValue = "priority_apply" | "apply" | "stretch" | "ignore";

export type StatusValue =
  | "pending_analysis"
  | "ready_to_apply"
  | "applied"
  | "online_test"
  | "interview_1"
  | "interview_2"
  | "hr_interview"
  | "offer"
  | "rejected"
  | "archived";

export type Job = {
  id: number;
  company_name: string | null;
  job_title: string | null;
  city: string | null;
  platform: string | null;
  job_link: string | null;
  salary_text: string | null;
  salary_min: number | null;
  salary_max: number | null;
  experience_required: string | null;
  degree_required: string | null;
  remote_allowed: boolean;
  jd_raw_text: string | null;
  skills_extracted: string[];
  keywords: string[];
  track: TrackValue;
  match_score: number;
  match_level: MatchLevelValue;
  status: StatusValue;
  resume_version: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type JobPayload = {
  company_name?: string | null;
  job_title?: string | null;
  city?: string | null;
  platform?: string | null;
  job_link?: string | null;
  salary_text?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  experience_required?: string | null;
  degree_required?: string | null;
  remote_allowed?: boolean;
  jd_raw_text?: string | null;
  skills_extracted?: string[];
  keywords?: string[];
  track?: TrackValue;
  match_score?: number;
  match_level?: MatchLevelValue;
  status?: StatusValue;
  resume_version?: string | null;
  notes?: string | null;
};

export type JDAnalysisResult = {
  company_name: string | null;
  job_title: string | null;
  city: string | null;
  experience_required: string | null;
  degree_required: string | null;
  salary_text: string | null;
  salary_min: number | null;
  salary_max: number | null;
  remote_allowed: boolean;
  skills_extracted: string[];
  keywords: string[];
  track: TrackValue;
  match_score: number;
  match_level: MatchLevelValue;
};

export type DashboardCountItem = {
  count: number;
};

export type StatusCount = DashboardCountItem & { status: StatusValue };
export type TrackCount = DashboardCountItem & { track: TrackValue };
export type SkillFrequency = DashboardCountItem & { skill: string };

export type DashboardSummary = {
  total_jobs: number;
  status_counts: StatusCount[];
  track_counts: TrackCount[];
  shanghai_jobs: number;
  top_jobs: Job[];
  top_skills: SkillFrequency[];
};

export type JobListFilters = {
  q: string;
  city: string;
  track: string;
  match_level: string;
  status: string;
  sort_by: "updated_at" | "match_score";
  sort_order: "asc" | "desc";
};

export const trackOptions: { value: TrackValue; label: string }[] = [
  { value: "data_analyst", label: "数据分析" },
  { value: "ai_app_dev", label: "AI 应用开发" },
  { value: "android_client", label: "Android 客户端" },
  { value: "model_deployment", label: "模型部署" },
  { value: "general_software", label: "通用软件" },
  { value: "other", label: "其他" },
];

export const matchLevelOptions: { value: MatchLevelValue; label: string }[] = [
  { value: "priority_apply", label: "优先投递" },
  { value: "apply", label: "可投递" },
  { value: "stretch", label: "冲刺" },
  { value: "ignore", label: "忽略" },
];

export const statusOptions: { value: StatusValue; label: string }[] = [
  { value: "pending_analysis", label: "待分析" },
  { value: "ready_to_apply", label: "待投递" },
  { value: "applied", label: "已投递" },
  { value: "online_test", label: "在线测试" },
  { value: "interview_1", label: "一面" },
  { value: "interview_2", label: "二面" },
  { value: "hr_interview", label: "HR 面" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "已拒绝" },
  { value: "archived", label: "归档" },
];

export const trackLabelMap = Object.fromEntries(trackOptions.map((item) => [item.value, item.label]));
export const matchLevelLabelMap = Object.fromEntries(
  matchLevelOptions.map((item) => [item.value, item.label]),
);
export const statusLabelMap = Object.fromEntries(statusOptions.map((item) => [item.value, item.label]));

export function listToText(values: string[]): string {
  return values.join(", ");
}

export function textToList(value: string): string[] {
  return value
    .replaceAll("，", ",")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatTrackLabel(track: string): string {
  return trackLabelMap[track as TrackValue] ?? "未知方向";
}

export function formatMatchLevelLabel(level: string): string {
  return matchLevelLabelMap[level as MatchLevelValue] ?? "未知等级";
}

export function formatStatusLabel(status: string): string {
  return statusLabelMap[status as StatusValue] ?? "未知状态";
}
