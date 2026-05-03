def test_list_jobs(client) -> None:
    response = client.get("/api/jobs")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["company_name"] == "星图智能"


def test_create_and_update_job(client) -> None:
    create_response = client.post(
        "/api/jobs",
        json={
            "company_name": "数衡科技",
            "job_title": "数据分析师",
            "city": "上海",
            "track": "data_analyst",
            "match_level": "apply",
            "status": "pending_analysis",
            "skills_extracted": ["Python", "SQL"],
            "keywords": ["Python", "SQL"],
        },
    )
    assert create_response.status_code == 201
    created_job = create_response.json()
    assert created_job["id"] == 2

    update_response = client.put(
        f"/api/jobs/{created_job['id']}",
        json={"status": "applied", "resume_version": "v2"},
    )
    assert update_response.status_code == 200
    updated_job = update_response.json()
    assert updated_job["status"] == "applied"
    assert updated_job["resume_version"] == "v2"


def test_delete_job(client) -> None:
    response = client.delete("/api/jobs/1")
    assert response.status_code == 204

    missing_response = client.get("/api/jobs/1")
    assert missing_response.status_code == 404


def test_analyzer_endpoint(client) -> None:
    response = client.post(
        "/api/analyze-jd",
        json={
            "jd_raw_text": (
                "公司：星图智能\n岗位：AI 应用开发工程师\n地点：上海\n"
                "要求：1-3年，本科，熟悉Python、LLM、RAG、Agent。"
            )
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["track"] == "ai_app_dev"
    assert payload["city"] == "上海"
    assert payload["analysis_source"] == "rules"


def test_dashboard_summary_endpoint(client) -> None:
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    payload = response.json()
    assert payload["total_jobs"] == 1
    assert payload["shanghai_jobs"] == 1
    assert payload["top_jobs"][0]["company_name"] == "星图智能"


def test_preferences_endpoint(client) -> None:
    response = client.get("/api/preferences")
    assert response.status_code == 200
    payload = response.json()
    assert "上海" in payload["target_cities"]

    update_response = client.put(
        "/api/preferences",
        json={
            "target_cities": ["上海", "远程"],
            "target_tracks": ["ai_app_dev"],
            "priority_skills": ["Python", "LLM"],
            "min_salary": 20,
            "default_resume_version": "ai-v2",
            "llm_enabled": True,
        },
    )
    assert update_response.status_code == 200
    assert update_response.json()["default_resume_version"] == "ai-v2"


def test_source_links_crud(client) -> None:
    list_response = client.get("/api/source-links")
    assert list_response.status_code == 200
    assert list_response.json()[0]["platform_name"] == "BOSS直聘"

    create_response = client.post(
        "/api/source-links",
        json={
            "platform_name": "测试平台",
            "title": "AI 搜索",
            "url": "https://example.com/search",
            "city": "上海",
            "track": "ai_app_dev",
            "keywords": ["LLM"],
            "sort_order": 5,
        },
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["platform_name"] == "测试平台"

    update_response = client.put(
        f"/api/source-links/{created['id']}",
        json={"enabled": False},
    )
    assert update_response.status_code == 200
    assert update_response.json()["enabled"] is False

    delete_response = client.delete(f"/api/source-links/{created['id']}")
    assert delete_response.status_code == 204


def test_job_events_endpoint(client) -> None:
    response = client.get("/api/jobs/1/events")
    assert response.status_code == 200
    assert response.json()[0]["event_type"] == "created"

    create_response = client.post(
        "/api/jobs/1/events",
        json={"event_type": "applied", "notes": "用户已在平台手动投递。"},
    )
    assert create_response.status_code == 201
    assert create_response.json()["event_type"] == "applied"


def test_search_matches_skills(client) -> None:
    response = client.get("/api/jobs?q=RAG")
    assert response.status_code == 200
    assert response.json()[0]["job_title"] == "AI 应用开发工程师"
