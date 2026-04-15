import type {
  DashboardSummary,
  JDAnalysisResult,
  Job,
  JobListFilters,
  JobPayload,
} from "@/lib/types";

const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);
const LOCALHOST_API_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const CODESPACES_PORT_SUFFIX_PATTERN = /-\d+(?=\.)/;

export function deriveCodespacesApiBaseUrl(browserOrigin: string): string {
  try {
    const url = new URL(browserOrigin);

    if (LOCALHOST_HOSTNAMES.has(url.hostname)) {
      return "";
    }

    if (!CODESPACES_PORT_SUFFIX_PATTERN.test(url.hostname)) {
      return "";
    }

    url.hostname = url.hostname.replace(CODESPACES_PORT_SUFFIX_PATTERN, "-8000");
    return url.origin;
  } catch {
    return "";
  }
}

export function resolveApiBaseUrl(
  configuredBaseUrl?: string,
  browserOrigin?: string,
): string {
  const trimmedBaseUrl = configuredBaseUrl?.trim();

  if (!trimmedBaseUrl) {
    return "";
  }

  if (!browserOrigin) {
    return trimmedBaseUrl.replace(/\/$/, "");
  }

  try {
    const browserUrl = new URL(browserOrigin);
    const isCodespacesLikeBrowser = !LOCALHOST_HOSTNAMES.has(browserUrl.hostname);

    if (isCodespacesLikeBrowser && LOCALHOST_API_PATTERN.test(trimmedBaseUrl)) {
      return deriveCodespacesApiBaseUrl(browserOrigin) || "";
    }
  } catch {
    return trimmedBaseUrl.replace(/\/$/, "");
  }

  return trimmedBaseUrl.replace(/\/$/, "");
}

function getApiBaseUrl(): string {
  return resolveApiBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    typeof window !== "undefined" ? window.location.origin : undefined,
  );
}

type RequestOptions = RequestInit & {
  parseJson?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { parseJson = true, headers, ...init } = options;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
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
