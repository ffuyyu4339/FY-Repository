# Job Tracker + JD Analyzer

个人求职管理系统 MVP。当前本机运行路线已调整为 **PostgreSQL 本机服务 + FastAPI 本机进程 + Next.js 本机进程**，不再依赖 Docker Desktop。

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
├─ .env.docker.example      # 历史 Docker Compose 环境变量模板
└─ docker-compose.yml       # 保留但不再作为当前本机主运行入口
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

### 2. 创建环境变量

```powershell
Copy-Item .env.example .env -Force
```

默认本机数据库地址：

```env
DATABASE_URL=postgresql+psycopg://jobtracker:jobtracker@localhost:5432/jobtracker
```

### 3. 初始化数据库

以 PostgreSQL 管理员用户执行：

```powershell
.\scripts\init-local-postgres.ps1
```

如果你的 PostgreSQL 管理员用户名不是 `postgres`：

```powershell
.\scripts\init-local-postgres.ps1 -AdminUser your_admin_user
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

## Docker 状态

当前机器 Docker Desktop / WSL 环境不可用，Docker Compose 不再作为本机主运行入口。仓库仍保留 Dockerfile、`docker-compose.yml` 和 `.env.docker.example`，用于未来在可用 Docker 环境中恢复容器化验收。
