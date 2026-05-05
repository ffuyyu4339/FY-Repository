import type { JDAnalysisResult, Preference, TrackValue } from "@/lib/types";

const KEYWORDS_BY_TRACK: Record<TrackValue, Set<string>> = {
  data_analyst: new Set([
    "python",
    "sql",
    "excel",
    "tableau",
    "power bi",
    "pandas",
    "数据分析",
  ]),
  ai_app_dev: new Set([
    "llm",
    "rag",
    "prompt",
    "agent",
    "rest api",
    "deployment",
    "ai应用",
  ]),
  android_client: new Set(["android", "kotlin", "java"]),
  model_deployment: new Set([
    "inference",
    "fine-tuning",
    "deployment",
    "docker",
    "linux",
    "模型部署",
  ]),
  general_software: new Set(["git", "docker", "linux", "api", "backend", "后端"]),
  other: new Set([]),
};

const SKILL_KEYWORDS = [
  "Python",
  "SQL",
  "Excel",
  "Tableau",
  "Power BI",
  "Pandas",
  "数据分析",
  "LLM",
  "RAG",
  "Prompt",
  "Agent",
  "Fine-tuning",
  "Inference",
  "Deployment",
  "Android",
  "Kotlin",
  "Java",
  "Git",
  "Docker",
  "Linux",
  "REST API",
];

const CITY_KEYWORDS = ["上海", "北京", "深圳", "杭州", "广州", "南京", "苏州", "成都", "远程"];
const DEGREE_KEYWORDS = ["博士", "硕士", "本科", "大专"];
const JOB_TITLE_KEYWORDS = ["工程师", "分析师", "开发", "算法", "产品", "架构师"];
const DEFAULT_TRACK_SCORES: Record<TrackValue, number> = {
  data_analyst: 30,
  ai_app_dev: 30,
  android_client: 24,
  model_deployment: 28,
  general_software: 18,
  other: 8,
};

function getPreferenceList(preferences: Preference | null | undefined, key: keyof Preference) {
  if (!preferences) {
    return [] as string[];
  }

  const value = preferences[key];
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);
}

function getPreferenceInt(preferences: Preference | null | undefined, key: keyof Preference) {
  if (!preferences) {
    return null;
  }

  const value = preferences[key];
  return typeof value === "number" ? value : null;
}

export function extractOrderedKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  const matched = new Set<string>();

  for (const keyword of SKILL_KEYWORDS) {
    if (normalized.includes(keyword.toLowerCase())) {
      matched.add(keyword);
    }
  }

  return Array.from(matched);
}

export function inferTrackFromText(text: string): TrackValue {
  const normalized = text.toLowerCase();
  let bestTrack: TrackValue = "other";
  let bestScore = 0;

  for (const [track, keywords] of Object.entries(KEYWORDS_BY_TRACK) as Array<
    [TrackValue, Set<string>]
  >) {
    const score = Array.from(keywords).reduce(
      (count, keyword) => count + (normalized.includes(keyword) ? 1 : 0),
      0,
    );

    if (score > bestScore) {
      bestTrack = track;
      bestScore = score;
    }
  }

  return bestTrack;
}

export function extractCity(text: string): {
  city: string | null;
  remote_allowed: boolean;
} {
  const lowered = text.toLowerCase();
  const remoteAllowed = ["远程", "remote", "居家", "hybrid"].some((token) =>
    lowered.includes(token),
  );

  for (const city of CITY_KEYWORDS) {
    if (text.includes(city)) {
      return {
        city,
        remote_allowed: remoteAllowed || city === "远程",
      };
    }
  }

  return { city: null, remote_allowed: remoteAllowed };
}

export function extractDegree(text: string): string | null {
  for (const degree of DEGREE_KEYWORDS) {
    if (text.includes(degree)) {
      return degree;
    }
  }
  return null;
}

export function extractExperience(text: string): string | null {
  const patterns = [
    /(\d+\s*[-~至到]\s*\d+\s*年)/,
    /(\d+\+?\s*年)/,
    /(经验不限)/,
    /(应届)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].replace(/\s+/g, "");
    }
  }

  return null;
}

export function extractSalary(text: string): {
  salary_text: string | null;
  salary_min: number | null;
  salary_max: number | null;
} {
  const monthlyMatch = text.match(
    /(\d{1,2}(?:\.\d+)?)\s*(?:k|K|千)\s*[-~至到]\s*(\d{1,2}(?:\.\d+)?)\s*(?:k|K|千)/,
  );
  if (monthlyMatch) {
    return {
      salary_text: monthlyMatch[0],
      salary_min: Number.parseInt(String(Number(monthlyMatch[1])), 10),
      salary_max: Number.parseInt(String(Number(monthlyMatch[2])), 10),
    };
  }

  const annualMatch = text.match(
    /(\d{1,2}(?:\.\d+)?)\s*[-~至到]\s*(\d{1,2}(?:\.\d+)?)\s*万\/年/,
  );
  if (annualMatch) {
    return {
      salary_text: annualMatch[0],
      salary_min: Math.floor((Number(annualMatch[1]) * 10) / 12),
      salary_max: Math.floor((Number(annualMatch[2]) * 10) / 12),
    };
  }

  return {
    salary_text: null,
    salary_min: null,
    salary_max: null,
  };
}

export function extractCompanyName(text: string): string | null {
  const patterns = [
    /(?:公司|企业|单位)[:：]\s*([^\n]+)/,
    /([^\n]{2,30}(?:有限公司|科技|智能|信息|软件|数据|网络))/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

export function extractJobTitle(text: string): string | null {
  const patterns = [
    /(?:岗位|职位|招聘岗位)[:：]\s*([^\n]+)/,
    /([^\n]{2,40}(?:工程师|分析师|开发|算法|架构师))/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const title = match[1].trim();
      if (JOB_TITLE_KEYWORDS.some((keyword) => title.includes(keyword))) {
        return title;
      }
    }
  }

  return null;
}

function normalizeExperienceScore(experienceRequired: string | null): number {
  if (!experienceRequired) {
    return 12;
  }

  if (experienceRequired.includes("不限") || experienceRequired.includes("应届")) {
    return 20;
  }

  const rangeMatch = experienceRequired.match(/(\d+)\s*[-~至到]\s*(\d+)/);
  const maxYears = rangeMatch
    ? Number(rangeMatch[2])
    : Number(experienceRequired.match(/(\d+)/)?.[1] ?? "3");

  if (maxYears <= 2) {
    return 20;
  }
  if (maxYears <= 5) {
    return 12;
  }
  return 5;
}

function normalizeCityScore(
  city: string | null,
  remoteAllowed: boolean,
  preferences: Preference | null | undefined,
): number {
  const targetCities = getPreferenceList(preferences, "target_cities");
  if (targetCities.length > 0) {
    if (city && targetCities.some((targetCity) => city.includes(targetCity))) {
      return 10;
    }

    const remoteIsTarget = targetCities.includes("远程");
    if (remoteAllowed && remoteIsTarget) {
      return 9;
    }

    if (city) {
      return 4;
    }

    return 5;
  }

  if (city === "上海") {
    return 10;
  }
  if (remoteAllowed) {
    return 8;
  }
  if (city && ["北京", "深圳", "杭州"].includes(city)) {
    return 6;
  }
  if (city) {
    return 3;
  }
  return 5;
}

function normalizeSalaryScore(
  salaryMax: number | null,
  preferences: Preference | null | undefined,
): number {
  const minSalary = getPreferenceInt(preferences, "min_salary");
  if (minSalary !== null) {
    if (salaryMax === null) {
      return 5;
    }
    if (salaryMax >= minSalary) {
      return 10;
    }
    if (salaryMax >= Math.max(Math.floor(minSalary * 0.8), 1)) {
      return 7;
    }
    return 4;
  }

  if (salaryMax === null) {
    return 5;
  }
  if (salaryMax >= 35) {
    return 10;
  }
  if (salaryMax >= 25) {
    return 8;
  }
  if (salaryMax >= 18) {
    return 6;
  }
  return 4;
}

function normalizeClarityScore(text: string): number {
  let score = 1;
  if (text.length >= 150) {
    score += 2;
  }
  if (["职责", "要求", "任职", "加分项"].some((marker) => text.includes(marker))) {
    score += 2;
  }
  return Math.min(score, 5);
}

function mapMatchLevel(score: number): JDAnalysisResult["match_level"] {
  if (score >= 80) {
    return "priority_apply";
  }
  if (score >= 65) {
    return "apply";
  }
  if (score >= 50) {
    return "stretch";
  }
  return "ignore";
}

function calculateMatchScore(
  track: TrackValue,
  skills: string[],
  experienceRequired: string | null,
  city: string | null,
  remoteAllowed: boolean,
  salaryMax: number | null,
  jdRawText: string,
  preferences: Preference | null | undefined,
): number {
  const targetTracks = getPreferenceList(preferences, "target_tracks") as TrackValue[];
  const baseTrackScore = DEFAULT_TRACK_SCORES[track] ?? 8;
  const trackScore = targetTracks.length > 0
    ? targetTracks.includes(track)
      ? 30
      : Math.min(baseTrackScore, 18)
    : baseTrackScore;

  const prioritySkills = new Set(
    getPreferenceList(preferences, "priority_skills").map((skill) =>
      skill.toLowerCase(),
    ),
  );

  const techScore = prioritySkills.size > 0
    ? Math.min(
        skills.filter((skill) => prioritySkills.has(skill.toLowerCase())).length * 6 +
          skills.length * 3,
        25,
      )
    : Math.min(skills.length, 5) * 5;

  const experienceScore = normalizeExperienceScore(experienceRequired);
  const cityScore = normalizeCityScore(city, remoteAllowed, preferences);
  const salaryScore = normalizeSalaryScore(salaryMax, preferences);
  const clarityScore = normalizeClarityScore(jdRawText);

  return Math.min(
    trackScore + techScore + experienceScore + cityScore + salaryScore + clarityScore,
    100,
  );
}

function normalizeAnalysisScore(
  result: JDAnalysisResult,
  jdRawText: string,
  preferences: Preference | null | undefined,
): JDAnalysisResult {
  const matchScore = calculateMatchScore(
    result.track as TrackValue,
    result.skills_extracted,
    result.experience_required,
    result.city,
    result.remote_allowed,
    result.salary_max,
    jdRawText,
    preferences,
  );

  return {
    ...result,
    match_score: matchScore,
    match_level: mapMatchLevel(matchScore),
    keywords: result.keywords.length > 0 ? result.keywords : result.skills_extracted,
  };
}

export function analyzeJdText(
  text: string,
  preferences: Preference | null | undefined = null,
): JDAnalysisResult {
  const normalizedText = text.trim();
  const skills = extractOrderedKeywords(normalizedText);
  const { city, remote_allowed: remoteAllowed } = extractCity(normalizedText);
  const experienceRequired = extractExperience(normalizedText);
  const degreeRequired = extractDegree(normalizedText);
  const salary = extractSalary(normalizedText);
  const track = inferTrackFromText(normalizedText);
  const matchScore = calculateMatchScore(
    track,
    skills,
    experienceRequired,
    city,
    remoteAllowed,
    salary.salary_max,
    normalizedText,
    preferences,
  );

  return normalizeAnalysisScore(
    {
      company_name: extractCompanyName(normalizedText),
      job_title: extractJobTitle(normalizedText),
      city,
      experience_required: experienceRequired,
      degree_required: degreeRequired,
      salary_text: salary.salary_text,
      salary_min: salary.salary_min,
      salary_max: salary.salary_max,
      remote_allowed: remoteAllowed,
      skills_extracted: skills,
      keywords: skills,
      track,
      match_score: matchScore,
      match_level: mapMatchLevel(matchScore),
      analysis_source: "rules",
    },
    normalizedText,
    preferences,
  );
}
