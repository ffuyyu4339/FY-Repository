# Job Tracker + JD Analyzer - PRD

## 1. 项目概述

### 1.1 项目名称
Job Tracker + JD Analyzer

### 1.2 项目目标
构建一个面向个人求职场景的轻量 Web App，用于：
1. 统一记录岗位信息；
2. 粘贴岗位 JD 后自动解析为结构化数据；
3. 基于用户目标方向计算岗位匹配分；
4. 管理岗位投递流程；
5. 通过 Dashboard 辅助求职决策。

### 1.3 产品定位
这是一个 **单用户个人求职管理系统**，不是招聘平台，不是企业 ATS，不做自动海投，不做招聘爬虫平台。

---

## 2. 问题定义

当前求职过程存在以下问题：
1. 岗位信息散落于多个招聘平台；
2. JD 为自然语言，难以横向比较；
3. 投递进度管理混乱；
4. 缺少可量化的岗位适配度判断；
5. 缺少长期数据沉淀，无法总结求职方向与技能缺口。

本项目目标是：
- 将岗位收集、JD 分析、投递追踪、数据统计整合为单一系统；
- 形成可长期复用的岗位数据库和决策辅助工具。

---

## 3. 目标用户

### 3.1 核心用户
单个求职者本人。

### 3.2 用户特征
- 需要跨平台收集岗位；
- 需要批量比较岗位 JD；
- 需要长期跟踪投递状态；
- 需要根据数据优化投递策略。

---

## 4. MVP 范围

## 4.1 本期必须实现

### A. 岗位管理
1. 新增岗位
2. 编辑岗位
3. 删除岗位
4. 查看岗位详情
5. 岗位列表筛选与排序

### B. JD Analyzer
1. 支持粘贴 JD 原文
2. 自动提取：
   - 公司名称
   - 岗位名称
   - 城市
   - 经验要求
   - 学历要求
   - 薪资区间
   - 技能关键词
   - 岗位方向
3. 自动计算匹配分
4. 自动生成匹配等级
5. 支持人工修正分析结果

### C. 投递流程
1. 支持岗位状态流转
2. 记录简历版本
3. 记录备注信息

### D. Dashboard
1. 总岗位数
2. 各状态岗位数量
3. 各方向岗位数量
4. 上海岗位数
5. 高分岗位 Top N
6. 高频技能词

### E. 工程能力
1. 前后端分离结构
2. Docker Compose 一键启动
3. Linux 环境可运行
4. lint / test / build 可通过
5. README 可指导本地运行和部署

---

## 4.2 本期不做
1. 多用户系统
2. 角色权限管理
3. 自动爬取招聘网站
4. 自动投递
5. 邮件集成
6. 浏览器插件
7. 对话式 AI 求职顾问
8. 外部企业画像接口
9. 消息通知系统
10. 微服务架构拆分

---

## 5. 技术方案

## 5.1 强制技术栈
- 前端：React + Next.js + TypeScript + Tailwind CSS
- 后端：Python + FastAPI
- 数据库：PostgreSQL
- 容器化：Docker + Docker Compose
- 运行环境：Linux

## 5.2 架构要求
采用前后端分离：

- `frontend/`：Next.js 前端应用
- `backend/`：FastAPI 后端服务
- `db/`：PostgreSQL 初始化脚本
- `docker-compose.yml`：统一本地开发与联调入口

## 5.3 不允许替代
本项目不使用以下方案替代核心架构：
- Supabase
- Firebase
- SQLite 作为正式数据库
- 纯单体 Next.js API Route 代替 FastAPI 主后端
- 无容器本地脚本作为唯一运行方式

---

## 6. 功能需求

## 6.1 数据模型：jobs
建议主表：`jobs`

字段如下：

- id
- company_name
- job_title
- city
- platform
- job_link
- salary_text
- salary_min
- salary_max
- experience_required
- degree_required
- remote_allowed
- jd_raw_text
- skills_extracted
- keywords
- track
- match_score
- match_level
- status
- resume_version
- notes
- created_at
- updated_at

---

## 6.2 岗位方向枚举
`track`：
- data_analyst
- ai_app_dev
- android_client
- model_deployment
- general_software
- other

---

## 6.3 匹配等级枚举
`match_level`：
- priority_apply
- apply
- stretch
- ignore

建议映射：
- 80~100：priority_apply
- 65~79：apply
- 50~64：stretch
- 0~49：ignore

---

## 6.4 投递状态枚举
`status`：
- pending_analysis
- ready_to_apply
- applied
- online_test
- interview_1
- interview_2
- hr_interview
- offer
- rejected
- archived

---

## 6.5 JD 分析规则
当用户粘贴 JD 文本后，系统执行以下逻辑：
1. 提取技能关键词；
2. 提取经验要求；
3. 提取学历要求；
4. 提取城市信息；
5. 提取薪资文本与可解析区间；
6. 识别远程属性；
7. 按关键词映射岗位方向；
8. 生成匹配分与匹配等级。

---

## 6.6 匹配分规则
总分 100 分，MVP 使用规则引擎而非复杂模型。

权重如下：
- 方向匹配：30%
- 技术栈匹配：25%
- 经验门槛合理性：20%
- 城市匹配：10%
- 薪资吸引力：10%
- JD 清晰度：5%

### 方向匹配
优先方向：
- 数据分析
- AI 应用开发
- Android 客户端
- 模型部署 / LLM 应用工程

### 技术栈关键词
重点识别：
- Python
- SQL
- Excel
- Tableau
- Power BI
- Pandas
- 数据分析
- LLM
- RAG
- Prompt
- Agent
- Fine-tuning
- Inference
- Deployment
- Android
- Kotlin
- Java
- Git
- Docker
- Linux
- REST API

### 经验门槛合理性
- 0~2 年：高分
- 3~5 年：中分
- 5 年以上：低分

### 城市匹配
- 上海：高分
- 远程：中高分
- 北京 / 深圳 / 杭州：中分
- 其他：低分

---

## 7. 页面需求

## 7.1 页面清单
1. `/jobs`：岗位列表页
2. `/jobs/new`：新增岗位页
3. `/jobs/[id]`：岗位详情页
4. `/dashboard`：统计面板页

---

## 7.2 列表页功能
必须支持：
- 关键词搜索
- 城市筛选
- 方向筛选
- 匹配等级筛选
- 状态筛选
- 按匹配分排序
- 按更新时间排序

---

## 7.3 详情页功能
必须支持：
- 查看原始 JD
- 查看分析结果
- 手动修正字段
- 修改状态
- 更新备注
- 记录简历版本

---

## 8. API 需求

## 8.1 Jobs API
FastAPI 至少提供：
- `GET /api/jobs`
- `POST /api/jobs`
- `GET /api/jobs/{id}`
- `PUT /api/jobs/{id}`
- `DELETE /api/jobs/{id}`

## 8.2 Analyzer API
FastAPI 至少提供：
- `POST /api/analyze-jd`

输入：
- jd_raw_text

输出：
- company_name
- job_title
- city
- experience_required
- degree_required
- salary_text
- salary_min
- salary_max
- skills_extracted
- keywords
- track
- match_score
- match_level

## 8.3 Dashboard API
FastAPI 至少提供：
- `GET /api/dashboard/summary`

---

## 9. 非功能需求

1. Docker Compose 可一键启动；
2. Linux 环境可运行；
3. 前后端服务可独立开发；
4. build 必须通过；
5. lint 必须通过；
6. 核心逻辑必须具备基础测试；
7. README 必须说明：
   - 本地运行
   - 环境变量
   - Docker 启动
   - 数据库初始化
   - Linux 部署思路

---

## 10. 验收标准

满足以下条件视为 MVP 验收通过：
1. Next.js 前端可运行；
2. FastAPI 后端可运行；
3. PostgreSQL 数据库联通正常；
4. Docker Compose 可启动全套服务；
5. 可新增、编辑、删除岗位；
6. 可粘贴 JD 并得到结构化分析结果；
7. 可得到匹配分和匹配等级；
8. 可更新岗位状态；
9. Dashboard 可展示核心统计；
10. lint / test / build 通过；
11. 文档完整；
12. Linux 部署方案明确。

---

## 11. 里程碑

### M1 - 项目初始化
- 前后端脚手架
- Docker Compose
- 基础目录结构
- README 初版

### M2 - 数据层
- PostgreSQL schema
- FastAPI 数据访问层
- jobs CRUD API

### M3 - 前端核心页面
- 列表页
- 新增页
- 详情页
- 筛选与排序

### M4 - JD Analyzer
- 分析接口
- 规则引擎
- 前端接入分析结果

### M5 - Dashboard 与验收
- 统计接口
- Dashboard 页面
- 测试
- 文档
- 最终验收

---

## 12. 风险与约束
1. JD 文本格式不统一，必须允许人工修正；
2. 薪资、城市、经验字段提取会有误差；
3. MVP 不追求复杂 NLP，只追求稳定可用；
4. 不引入不必要基础设施，避免过度工程化。

---

## 13. Codex 执行要求
1. 严格按本 PRD 的 MVP 范围执行；
2. 严格使用 React + Next.js + Python + FastAPI + PostgreSQL + Docker + Linux；
3. 不使用 Supabase / Firebase；
4. 不实现多用户、爬虫、自动投递、聊天助手；
5. 每完成一项任务，必须同步更新：
   - `docs/job-tracker/TASK_CARD.md`
   - `docs/job-tracker/OPERATION_LOG.md`
   - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
6. 每个子任务完成后执行小粒度提交；
7. commit message 使用 Conventional Commits。
