import json
import re
from typing import Any

import httpx

from app.core.config import settings
from app.schemas.analyzer import JDAnalyzeResponse


def extract_json_object(raw_content: str) -> dict[str, Any]:
    content = raw_content.strip()
    fenced_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.S)
    if fenced_match:
        content = fenced_match.group(1)
    else:
        object_match = re.search(r"\{.*\}", content, re.S)
        if object_match:
            content = object_match.group(0)

    parsed = json.loads(content)
    if not isinstance(parsed, dict):
        raise ValueError("LLM response is not a JSON object")
    return parsed


def analyze_jd_with_llm(
    jd_raw_text: str, *, enabled: bool = True
) -> JDAnalyzeResponse | None:
    if not enabled or not settings.llm_enabled:
        return None
    if settings.llm_provider != "openai_compatible":
        return None
    if not settings.llm_api_base_url or not settings.llm_model:
        return None

    api_base_url = settings.llm_api_base_url.rstrip("/")
    endpoint = f"{api_base_url}/chat/completions"
    headers = {"Content-Type": "application/json"}
    if settings.llm_api_key:
        headers["Authorization"] = f"Bearer {settings.llm_api_key}"

    system_prompt = (
        "你是 JD 结构化解析器，只输出 JSON。"
        "不要解释，不要编造未出现的信息。"
        "字段包括 company_name, job_title, city, experience_required, "
        "degree_required, salary_text, salary_min, salary_max, remote_allowed, "
        "skills_extracted, keywords, track。"
        "track 只能是 data_analyst, ai_app_dev, android_client, "
        "model_deployment, general_software, other。"
    )
    user_prompt = f"请解析以下岗位 JD：\n\n{jd_raw_text}"
    payload: dict[str, Any] = {
        "model": settings.llm_model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.1,
        "stream": False,
    }

    try:
        with httpx.Client(timeout=25) as client:
            response = client.post(endpoint, headers=headers, json=payload)
            response.raise_for_status()
        response_payload = response.json()
        content = response_payload["choices"][0]["message"]["content"]
        parsed = extract_json_object(content)
        return JDAnalyzeResponse.model_validate(parsed)
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError):
        return None
