CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    job_title VARCHAR(255),
    city VARCHAR(120),
    platform VARCHAR(120),
    job_link TEXT,
    salary_text VARCHAR(120),
    salary_min INTEGER,
    salary_max INTEGER,
    experience_required VARCHAR(120),
    degree_required VARCHAR(120),
    remote_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    jd_raw_text TEXT,
    skills_extracted TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    keywords TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    track VARCHAR(64) NOT NULL DEFAULT 'other',
    match_score INTEGER NOT NULL DEFAULT 0,
    match_level VARCHAR(64) NOT NULL DEFAULT 'ignore',
    status VARCHAR(64) NOT NULL DEFAULT 'pending_analysis',
    resume_version VARCHAR(120),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_preferences (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    target_cities TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    target_tracks TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    priority_skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    min_salary INTEGER,
    default_resume_version VARCHAR(120),
    llm_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_preferences (
    id,
    target_cities,
    target_tracks,
    priority_skills,
    min_salary,
    default_resume_version,
    llm_enabled
) VALUES (
    1,
    ARRAY['上海', '远程']::TEXT[],
    ARRAY['data_analyst', 'ai_app_dev', 'android_client', 'model_deployment']::TEXT[],
    ARRAY['Python', 'SQL', 'LLM', 'RAG', 'Agent', 'Docker', 'Linux']::TEXT[],
    18,
    'v1',
    FALSE
) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS source_links (
    id SERIAL PRIMARY KEY,
    source_key VARCHAR(80) NOT NULL UNIQUE,
    platform_name VARCHAR(120) NOT NULL,
    title VARCHAR(180) NOT NULL,
    url TEXT NOT NULL,
    city VARCHAR(120),
    track VARCHAR(64),
    keywords TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO source_links (
    source_key,
    platform_name,
    title,
    url,
    city,
    track,
    keywords,
    enabled,
    sort_order
) VALUES
    ('boss_zhipin', 'BOSS直聘', 'BOSS直聘职位搜索', 'https://www.zhipin.com/', NULL, NULL, ARRAY['AI', '数据分析', 'Python']::TEXT[], TRUE, 10),
    ('lagou', '拉勾', '拉勾互联网招聘', 'https://www.lagou.com/', NULL, NULL, ARRAY['互联网', 'AI', '数据']::TEXT[], TRUE, 20),
    ('liepin', '猎聘', '猎聘中高端职位', 'https://www.liepin.com/', NULL, NULL, ARRAY['中高端', 'AI', '技术']::TEXT[], TRUE, 30),
    ('zhaopin', '智联招聘', '智联招聘职位分类', 'https://www.zhaopin.com/jobs/', NULL, NULL, ARRAY['社招', '技术']::TEXT[], TRUE, 40),
    ('51job', '前程无忧', '前程无忧职位搜索', 'https://www.51job.com/', NULL, NULL, ARRAY['社招', '上海']::TEXT[], TRUE, 50),
    ('nowcoder', '牛客', '牛客求职职位', 'https://www.nowcoder.com/jobs/school/jobs', NULL, NULL, ARRAY['校招', '实习', '技术']::TEXT[], TRUE, 60),
    ('maimai', '脉脉', '脉脉职场机会', 'https://maimai.cn/', NULL, NULL, ARRAY['内推', '职场', 'AI']::TEXT[], TRUE, 70)
ON CONFLICT (source_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS job_events (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    notes TEXT,
    event_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_events_job_id_event_at
    ON job_events (job_id, event_at DESC);
