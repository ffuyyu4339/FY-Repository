import re
from collections import OrderedDict

from app.schemas.analyzer import JDAnalyzeResponse

KEYWORDS_BY_TRACK = {
    "data_analyst": {
        "python",
        "sql",
        "excel",
        "tableau",
        "power bi",
        "pandas",
        "数据分析",
    },
    "ai_app_dev": {
        "llm",
        "rag",
        "prompt",
        "agent",
        "rest api",
        "deployment",
        "ai应用",
    },
    "android_client": {"android", "kotlin", "java"},
    "model_deployment": {
        "inference",
        "fine-tuning",
        "deployment",
        "docker",
        "linux",
        "模型部署",
    },
    "general_software": {"git", "docker", "linux", "api", "backend", "后端"},
}

SKILL_KEYWORDS = [
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
]
CITY_KEYWORDS = ["上海", "北京", "深圳", "杭州", "广州", "南京", "苏州", "成都", "远程"]
DEGREE_KEYWORDS = ["博士", "硕士", "本科", "大专"]
JOB_TITLE_KEYWORDS = ["工程师", "分析师", "开发", "算法", "产品", "架构师"]


def extract_ordered_keywords(text: str) -> list[str]:
    normalized = text.lower()
    matched: OrderedDict[str, None] = OrderedDict()
    for keyword in SKILL_KEYWORDS:
        if keyword.lower() in normalized:
            matched[keyword] = None
    return list(matched.keys())


def infer_track_from_text(text: str) -> str:
    normalized = text.lower()
    best_track = "other"
    best_score = 0

    for track, keywords in KEYWORDS_BY_TRACK.items():
        score = sum(1 for keyword in keywords if keyword in normalized)
        if score > best_score:
            best_track = track
            best_score = score

    return best_track


def extract_city(text: str) -> tuple[str | None, bool]:
    lowered = text.lower()
    remote_allowed = any(token in lowered for token in ["远程", "remote", "居家", "hybrid"])
    for city in CITY_KEYWORDS:
        if city in text:
            return city, remote_allowed or city == "远程"
    return None, remote_allowed


def extract_degree(text: str) -> str | None:
    for degree in DEGREE_KEYWORDS:
        if degree in text:
            return degree
    return None


def extract_experience(text: str) -> str | None:
    patterns = [
        r"(\d+\s*[-~至到]\s*\d+\s*年)",
        r"(\d+\+?\s*年)",
        r"(经验不限)",
        r"(应届)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).replace(" ", "")
    return None


def extract_salary(text: str) -> tuple[str | None, int | None, int | None]:
    monthly_match = re.search(
        r"(\d{1,2}(?:\.\d+)?)\s*(?:k|K|千)\s*[-~至到]\s*(\d{1,2}(?:\.\d+)?)\s*(?:k|K|千)",
        text,
    )
    if monthly_match:
        salary_min = int(float(monthly_match.group(1)))
        salary_max = int(float(monthly_match.group(2)))
        return monthly_match.group(0), salary_min, salary_max

    annual_match = re.search(
        r"(\d{1,2}(?:\.\d+)?)\s*[-~至到]\s*(\d{1,2}(?:\.\d+)?)\s*万/年", text
    )
    if annual_match:
        salary_min = int(float(annual_match.group(1)) * 10 / 12)
        salary_max = int(float(annual_match.group(2)) * 10 / 12)
        return annual_match.group(0), salary_min, salary_max

    return None, None, None


def extract_company_name(text: str) -> str | None:
    patterns = [
        r"(?:公司|企业|单位)[:：]\s*([^\n]+)",
        r"([^\n]{2,30}(?:有限公司|科技|智能|信息|软件|数据|网络))",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()
    return None


def extract_job_title(text: str) -> str | None:
    patterns = [
        r"(?:岗位|职位|招聘岗位)[:：]\s*([^\n]+)",
        r"([^\n]{2,40}(?:工程师|分析师|开发|算法|架构师))",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            title = match.group(1).strip()
            if any(keyword in title for keyword in JOB_TITLE_KEYWORDS):
                return title
    return None


def normalize_experience_score(experience_required: str | None) -> int:
    if not experience_required:
        return 12
    if "不限" in experience_required or "应届" in experience_required:
        return 20
    range_match = re.search(r"(\d+)\s*[-~至到]\s*(\d+)", experience_required)
    if range_match:
        max_years = int(range_match.group(2))
    else:
        years_match = re.search(r"(\d+)", experience_required)
        max_years = int(years_match.group(1)) if years_match else 3

    if max_years <= 2:
        return 20
    if max_years <= 5:
        return 12
    return 5


def normalize_city_score(city: str | None, remote_allowed: bool) -> int:
    if city == "上海":
        return 10
    if remote_allowed:
        return 8
    if city in {"北京", "深圳", "杭州"}:
        return 6
    if city:
        return 3
    return 5


def normalize_salary_score(salary_max: int | None) -> int:
    if salary_max is None:
        return 5
    if salary_max >= 35:
        return 10
    if salary_max >= 25:
        return 8
    if salary_max >= 18:
        return 6
    return 4


def normalize_clarity_score(text: str) -> int:
    score = 1
    if len(text) >= 150:
        score += 2
    if any(marker in text for marker in ["职责", "要求", "任职", "加分项"]):
        score += 2
    return min(score, 5)


def map_match_level(score: int) -> str:
    if score >= 80:
        return "priority_apply"
    if score >= 65:
        return "apply"
    if score >= 50:
        return "stretch"
    return "ignore"


def calculate_match_score(
    track: str,
    skills: list[str],
    experience_required: str | None,
    city: str | None,
    remote_allowed: bool,
    salary_max: int | None,
    jd_raw_text: str,
) -> int:
    track_score = {
        "data_analyst": 30,
        "ai_app_dev": 30,
        "android_client": 24,
        "model_deployment": 28,
        "general_software": 18,
        "other": 8,
    }.get(track, 8)
    tech_score = min(len(skills), 5) * 5
    experience_score = normalize_experience_score(experience_required)
    city_score = normalize_city_score(city, remote_allowed)
    salary_score = normalize_salary_score(salary_max)
    clarity_score = normalize_clarity_score(jd_raw_text)
    total_score = (
        track_score
        + tech_score
        + experience_score
        + city_score
        + salary_score
        + clarity_score
    )
    return min(total_score, 100)


def analyze_jd_text(text: str) -> JDAnalyzeResponse:
    normalized_text = text.strip()
    skills = extract_ordered_keywords(normalized_text)
    city, remote_allowed = extract_city(normalized_text)
    experience_required = extract_experience(normalized_text)
    degree_required = extract_degree(normalized_text)
    salary_text, salary_min, salary_max = extract_salary(normalized_text)
    track = infer_track_from_text(normalized_text)
    match_score = calculate_match_score(
        track=track,
        skills=skills,
        experience_required=experience_required,
        city=city,
        remote_allowed=remote_allowed,
        salary_max=salary_max,
        jd_raw_text=normalized_text,
    )

    return JDAnalyzeResponse(
        company_name=extract_company_name(normalized_text),
        job_title=extract_job_title(normalized_text),
        city=city,
        experience_required=experience_required,
        degree_required=degree_required,
        salary_text=salary_text,
        salary_min=salary_min,
        salary_max=salary_max,
        remote_allowed=remote_allowed,
        skills_extracted=skills,
        keywords=skills,
        track=track,
        match_score=match_score,
        match_level=map_match_level(match_score),
    )
