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


def test_dashboard_summary_endpoint(client) -> None:
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    payload = response.json()
    assert payload["total_jobs"] == 1
    assert payload["shanghai_jobs"] == 1
    assert payload["top_jobs"][0]["company_name"] == "星图智能"
