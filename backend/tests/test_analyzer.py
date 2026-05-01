from app.schemas.analyzer import JDAnalyzeResponse
from app.services import analyzer
from app.services.analyzer import analyze_jd_text, map_match_level


def test_analyze_jd_extracts_core_fields() -> None:
    jd_text = """
    公司：星图智能科技
    岗位：AI 应用开发工程师
    工作地点：上海
    薪资：25K-35K
    任职要求：本科，1-3年经验，熟悉 Python、LLM、RAG、Agent、Docker、Linux。
    """

    result = analyze_jd_text(jd_text)

    assert result.company_name == "星图智能科技"
    assert result.job_title == "AI 应用开发工程师"
    assert result.city == "上海"
    assert result.salary_min == 25
    assert result.salary_max == 35
    assert result.track == "ai_app_dev"
    assert "Python" in result.skills_extracted
    assert result.match_level in {"priority_apply", "apply"}


def test_match_level_mapping() -> None:
    assert map_match_level(85) == "priority_apply"
    assert map_match_level(70) == "apply"
    assert map_match_level(58) == "stretch"
    assert map_match_level(20) == "ignore"


def test_analyze_jd_uses_llm_when_available(monkeypatch) -> None:
    def fake_llm_result(jd_raw_text: str, *, enabled: bool = True):
        assert enabled is True
        return JDAnalyzeResponse(
            company_name="深度智能",
            job_title="LLM 应用工程师",
            city="上海",
            experience_required="1-3年",
            degree_required="本科",
            salary_text="25K-35K",
            salary_min=25,
            salary_max=35,
            remote_allowed=False,
            skills_extracted=["Python", "LLM", "RAG"],
            keywords=["Python", "LLM", "RAG"],
            track="ai_app_dev",
        )

    monkeypatch.setattr(analyzer.settings, "llm_enabled", True)
    monkeypatch.setattr(analyzer, "analyze_jd_with_llm", fake_llm_result)

    result = analyze_jd_text(
        "岗位：LLM 应用工程师\n地点：上海\n要求：Python、LLM、RAG，本科，1-3年。",
        preferences={"llm_enabled": True, "target_tracks": ["ai_app_dev"]},
    )

    assert result.analysis_source == "llm"
    assert result.company_name == "深度智能"
    assert result.match_level in {"priority_apply", "apply"}


def test_analyze_jd_falls_back_when_llm_fails(monkeypatch) -> None:
    monkeypatch.setattr(analyzer.settings, "llm_enabled", True)
    monkeypatch.setattr(analyzer, "analyze_jd_with_llm", lambda *args, **kwargs: None)

    result = analyze_jd_text(
        "公司：星图智能\n岗位：AI 应用开发工程师\n地点：上海\n"
        "要求：1-3年，本科，熟悉Python、LLM、RAG、Agent。",
        preferences={"llm_enabled": True},
    )

    assert result.analysis_source == "fallback"
    assert result.track == "ai_app_dev"
