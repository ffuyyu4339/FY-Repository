import type {
  DashboardSummary,
  JDAnalysisResult,
  Job,
  JobListFilters,
  JobPayload,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type RequestOptions = RequestInit & {
  parseJson?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { parseJson = true, headers, ...init } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "请求失败";
    try {
      const payload = (await response.json()) as { detail?: string };
      message = payload.detail || message;
    } catch {}
    throw new Error(message);
  }

  if (!parseJson || response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function buildJobsQuery(filters: JobListFilters): string {
  const searchParams = new URLSearchParams();
  if (filters.q) searchParams.set("q", filters.q);
  if (filters.city) searchParams.set("city", filters.city);
  if (filters.track) searchParams.set("track", filters.track);
  if (filters.match_level) searchParams.set("match_level", filters.match_level);
  if (filters.status) searchParams.set("status", filters.status);
  searchParams.set("sort_by", filters.sort_by);
  searchParams.set("sort_order", filters.sort_order);
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetchJobs(filters: JobListFilters): Promise<Job[]> {
  return request<Job[]>(`/api/jobs${buildJobsQuery(filters)}`);
}

export async function fetchJob(jobId: string): Promise<Job> {
  return request<Job>(`/api/jobs/${jobId}`);
}

export async function createJob(payload: JobPayload): Promise<Job> {
  return request<Job>("/api/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateJob(jobId: string, payload: JobPayload): Promise<Job> {
  return request<Job>(`/api/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteJob(jobId: string): Promise<void> {
  return request<void>(`/api/jobs/${jobId}`, {
    method: "DELETE",
    parseJson: false,
  });
}

export async function analyzeJD(jdRawText: string): Promise<JDAnalysisResult> {
  return request<JDAnalysisResult>("/api/analyze-jd", {
    method: "POST",
    body: JSON.stringify({ jd_raw_text: jdRawText }),
  });
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>("/api/dashboard/summary");
}
