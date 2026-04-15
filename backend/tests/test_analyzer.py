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
