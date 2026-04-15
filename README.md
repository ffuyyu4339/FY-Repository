# Job Tracker + JD Analyzer

个人求职管理系统 MVP 的初始化仓库，当前已按前后端分离结构完成基础重组，便于后续按任务卡继续推进。

## 目录结构

```text
job-tracker-ai/
├─ AGENTS.md
├─ README.md
├─ docker-compose.yml
├─ .env.example
├─ docs/
│  └─ job-tracker/
│     ├─ PRD.md
│     ├─ TASK_CARD.md
│     ├─ OPERATION_LOG.md
│     └─ ACCEPTANCE_RECEIPT.md
├─ frontend/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ ...
├─ backend/
│  ├─ Dockerfile
│  ├─ requirements.txt
│  └─ ...
└─ db/
   └─ init.sql
```

## 技术栈

- 前端：Next.js + React + TypeScript + Tailwind CSS
- 后端：FastAPI + Python
- 数据库：PostgreSQL
- 容器化：Docker + Docker Compose
- 测试：Vitest、pytest
- 代码规范：ESLint、Prettier、ruff、black

## 当前初始化状态

- 已完成治理文档落地
- 已将原有 Next.js 代码迁移至 `frontend/`
- 已创建 FastAPI 基础骨架至 `backend/`
- 已创建 PostgreSQL 初始化脚本 `db/init.sql`
- 已补齐前后端 Dockerfile 与根级 `docker-compose.yml`
- 已加入前后端基础测试与代码规范配置

## 本地开发

### 1. 环境变量

复制环境变量模板并按需调整：

```bash
cp .env.example .env
```

### 2. 前端开发

```bash
cd frontend
npm install
npm run dev
```

默认地址：`http://localhost:3000`

### 3. 后端开发

建议使用 Python 3.12 虚拟环境：

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

默认地址：`http://localhost:8000/docs`

### 4. 数据库初始化

本地 PostgreSQL 可执行：

```bash
psql "$DATABASE_URL" -f db/init.sql
```

## Docker Compose 启动

推荐优先使用 Docker Compose：

```bash
docker compose --env-file .env up --build
```

服务默认端口：

- 前端：`3000`
- 后端：`8000`
- PostgreSQL：`5432`

初始化脚本会通过 `db/init.sql` 自动创建 `jobs` 表。

## Linux 部署思路

默认部署目标为 Linux 服务器，建议使用以下方式：

1. 在服务器安装 Docker Engine 与 Docker Compose Plugin。
2. 克隆仓库后创建 `.env`。
3. 使用 `docker compose --env-file .env up -d --build` 启动服务。
4. 通过 Nginx 或 Caddy 反向代理 `frontend:3000`。
5. PostgreSQL 数据卷独立持久化，并定期备份。

## 下一步

后续应按 `docs/job-tracker/TASK_CARD.md` 顺序继续实现：

1. 数据层联通验证
2. Jobs CRUD API
3. JD Analyzer 规则引擎
4. Dashboard 页面与统计接口
