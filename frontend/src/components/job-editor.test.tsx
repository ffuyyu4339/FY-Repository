// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { JobEditor } from "./job-editor";

const {
  analyzeJDMock,
  createJobEventMock,
  createJobMock,
  deleteJobMock,
  fetchJobEventsMock,
  fetchJobMock,
  fetchPreferencesMock,
  updateJobMock,
  pushMock,
} = vi.hoisted(() => ({
  analyzeJDMock: vi.fn(),
  createJobEventMock: vi.fn(),
  createJobMock: vi.fn(),
  deleteJobMock: vi.fn(),
  fetchJobEventsMock: vi.fn(),
  fetchJobMock: vi.fn(),
  fetchPreferencesMock: vi.fn(),
  updateJobMock: vi.fn(),
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/lib/api", () => ({
  analyzeJD: analyzeJDMock,
  createJobEvent: createJobEventMock,
  createJob: createJobMock,
  deleteJob: deleteJobMock,
  fetchJobEvents: fetchJobEventsMock,
  fetchJob: fetchJobMock,
  fetchPreferences: fetchPreferencesMock,
  updateJob: updateJobMock,
}));

describe("JobEditor", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    analyzeJDMock.mockReset();
    createJobEventMock.mockReset();
    createJobMock.mockReset();
    deleteJobMock.mockReset();
    fetchJobEventsMock.mockReset();
    fetchJobMock.mockReset();
    fetchPreferencesMock.mockReset();
    updateJobMock.mockReset();
    pushMock.mockReset();
    fetchPreferencesMock.mockResolvedValue({
      default_resume_version: "v-default",
    });
  });

  it("fills form fields after clicking analyze JD", async () => {
    analyzeJDMock.mockResolvedValue({
      company_name: "星图智能",
      job_title: "AI 应用开发工程师",
      city: "上海",
      experience_required: "1-3年",
      degree_required: "本科",
      salary_text: "25K-35K",
      salary_min: 25,
      salary_max: 35,
      remote_allowed: false,
      skills_extracted: ["Python", "LLM", "RAG"],
      keywords: ["Python", "LLM", "RAG"],
      track: "ai_app_dev",
      match_score: 88,
      match_level: "priority_apply",
      analysis_source: "rules",
    });

    render(<JobEditor mode="create" />);

    fireEvent.change(screen.getByPlaceholderText("粘贴岗位 JD 原文"), {
      target: {
        value:
          "公司：星图智能\n岗位：AI 应用开发工程师\n地点：上海\n要求：1-3年，本科，熟悉 Python、LLM、RAG。",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "一键解析 JD" }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("公司名称")).toHaveValue("星图智能");
      expect(screen.getByPlaceholderText("岗位名称")).toHaveValue(
        "AI 应用开发工程师",
      );
      expect(screen.getByPlaceholderText("城市")).toHaveValue("上海");
      expect(screen.getByPlaceholderText("经验要求")).toHaveValue("1-3年");
      expect(screen.getByPlaceholderText("学历要求")).toHaveValue("本科");
      expect(screen.getByPlaceholderText("薪资文本")).toHaveValue("25K-35K");
      expect(screen.getByPlaceholderText("技能关键词，逗号分隔")).toHaveValue(
        "Python, LLM, RAG",
      );
      expect(screen.getByLabelText("投递状态")).toHaveValue("ready_to_apply");
    });

    expect(analyzeJDMock).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(
        "JD 解析完成（规则引擎），结果已写入表单，你可以继续人工修正。",
      ),
    ).toBeInTheDocument();
  });

  it("prefills default resume version from preferences", async () => {
    render(<JobEditor mode="create" />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("简历版本")).toHaveValue("v-default");
    });

    expect(fetchPreferencesMock).toHaveBeenCalledTimes(1);
  });
});
