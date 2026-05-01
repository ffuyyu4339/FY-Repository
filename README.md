# Job Tracker + JD Analyzer

个人求职管理系统 MVP。当前提供两条运行路线：

- 本机开发：PostgreSQL 本机服务 + FastAPI 本机进程 + Next.js 本机进程。
- 容器联调：保留 Dockerfile 与 `docker-compose.yml`，用于 Docker daemon 可用的 Linux / Docker Desktop 环境。

当前 MVP+ 已加入合规辅助自动化能力：平台入口与搜索链接管理、浏览器本地登录态打开外部平台、投递事件时间线、偏好配置和 OpenAI-compatible 国内大模型 JD 解析。系统不保存招聘平台账号、密码、Cookie、验证码或登录令牌，也不自动爬取或自动投递。

## 技术栈

- 前端：Next.js + React + TypeScript + Tailwind CSS
- 后端：FastAPI + Python 3.12
- 数据库：PostgreSQL
- 测试：Vitest、pytest
- 代码规范：ESLint、Prettier、ruff、black

## 目录结构

```text
job-tracker-ai/
├─ backend/                 # FastAPI 后端
├─ db/init.sql              # PostgreSQL schema
├─ docs/job-tracker/        # PRD / 任务卡 / 操作日志 / 验收回执
├─ frontend/                # Next.js 前端
├─ scripts/                 # 本机运行脚本
├─ .env.example             # 本机运行环境变量模板
├─ .env.docker.example      # Docker Compose 环境变量模板
└─ docker-compose.yml       # Docker Compose 联调入口
```

## 本机运行

### 1. 安装 PostgreSQL

安装 PostgreSQL 16 或兼容版本，并确保以下命令在 PowerShell 中可用：

```powershell
psql --version
createdb --version
```

如果命令不可用，把 PostgreSQL 的 `bin` 目录加入 `PATH`，常见路径类似：

```text
C:\Program Files\PostgreSQL\16\bin
```

项目脚本也会自动查找 `C:\Program Files\PostgreSQL\*\bin` 下的 PostgreSQL 命令。

### 2. 创建环境变量

```powershell
Copy-Item .env.example .env -Force
```

默认本机数据库地址：

```env
DATABASE_URL=postgresql+psycopg://jobtracker:jobtracker@localhost:5432/jobtracker
```

如需启用国内大模型 JD 解析，配置 OpenAI-compatible API：

```env
LLM_ENABLED=true
LLM_PROVIDER=openai_compatible
LLM_API_BASE_URL=https://api.deepseek.com
LLM_API_KEY=your_api_key
LLM_MODEL=deepseek-v4-flash
```

未配置或接口失败时，后端会自动回退到规则引擎。

### 3. 初始化数据库

以 PostgreSQL 管理员用户执行：

```powershell
.\scripts\init-local-postgres.ps1
```

如果你的 PostgreSQL 管理员用户名不是 `postgres`：

```powershell
.\scripts\init-local-postgres.ps1 -AdminUser your_admin_user
```

如果管理员用户需要密码，可临时传入：

```powershell
.\scripts\init-local-postgres.ps1 -AdminPassword your_admin_password
```

该脚本会：

- 创建或更新 `jobtracker` 数据库用户
- 创建 `jobtracker` 数据库
- 执行 `db/init.sql`

### 4. 启动后端

```powershell
.\scripts\start-backend.ps1
```

默认地址：

- API 文档：`http://localhost:8000/docs`
- 健康检查：`http://localhost:8000/api/health`

### 5. 启动前端

新开一个 PowerShell：

```powershell
.\scripts\start-frontend.ps1
```

默认地址：

```text
http://localhost:3000
```

主要页面：

- `/jobs`：岗位列表、筛选、排序
- `/jobs/new`：粘贴 JD、解析、保存岗位
- `/sources`：招聘平台入口与搜索链接
- `/settings`：求职偏好与 LLM 开关
- `/guide`：新人使用指南
- `/dashboard`：求职统计复盘

### 6. 一键拉起前后端

数据库已安装并初始化后，也可以执行：

```powershell
.\scripts\start-local.ps1
```

该脚本会打开两个 PowerShell 窗口，分别启动后端和前端。

## 环境检查

```powershell
.\scripts\check-local-env.ps1
```

它会检查 Node.js、npm、Python、psql、PostgreSQL 服务，以及 `3000` / `8000` / `5432` 端口状态。

## 质量检查

后端：

```powershell
cd backend
.\.venv\Scripts\ruff.exe check .
.\.venv\Scripts\black.exe --check .
.\.venv\Scripts\python.exe -m pytest -q
```

前端：

```powershell
cd frontend
npm run lint
npm run test
npm run build
```

## Docker Compose

当前仓库保留 Docker Compose 联调入口：

```powershell
Copy-Item .env.docker.example .env.docker -Force
docker compose --env-file .env.docker up -d --build
```

如果当前目录存在本机开发用 `.env`，Compose 仍会自动读取其中的通用端口变量。容器内部连接已使用 `DOCKER_DATABASE_URL` 和 `DOCKER_BACKEND_INTERNAL_URL` 隔离，避免本机 `localhost` 数据库地址污染容器网络。

当前这台机器的 Docker Desktop / WSL daemon 仍不可用，`docker info` 无法连接 `npipe:////./pipe/dockerDesktopLinuxEngine`。因此本机可完成本机路线验收，但 Docker Compose 启动项需要在 Docker daemon 正常的环境中复验。
