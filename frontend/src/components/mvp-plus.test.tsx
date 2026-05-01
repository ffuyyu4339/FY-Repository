// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsClient } from "./settings-client";
import { SourcesClient } from "./sources-client";

const {
  createSourceLinkMock,
  deleteSourceLinkMock,
  fetchPreferencesMock,
  fetchSourceLinksMock,
  updatePreferencesMock,
  updateSourceLinkMock,
} = vi.hoisted(() => ({
  createSourceLinkMock: vi.fn(),
  deleteSourceLinkMock: vi.fn(),
  fetchPreferencesMock: vi.fn(),
  fetchSourceLinksMock: vi.fn(),
  updatePreferencesMock: vi.fn(),
  updateSourceLinkMock: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  createSourceLink: createSourceLinkMock,
  deleteSourceLink: deleteSourceLinkMock,
  fetchPreferences: fetchPreferencesMock,
  fetchSourceLinks: fetchSourceLinksMock,
  updatePreferences: updatePreferencesMock,
  updateSourceLink: updateSourceLinkMock,
}));

describe("MVP+ pages", () => {
  beforeEach(() => {
    createSourceLinkMock.mockReset();
    deleteSourceLinkMock.mockReset();
    fetchPreferencesMock.mockReset();
    fetchSourceLinksMock.mockReset();
    updatePreferencesMock.mockReset();
    updateSourceLinkMock.mockReset();
  });

  it("renders source links", async () => {
    fetchSourceLinksMock.mockResolvedValue([
      {
        id: 1,
        source_key: "boss_zhipin",
        platform_name: "BOSS直聘",
        title: "BOSS直聘职位搜索",
        url: "https://www.zhipin.com/",
        city: null,
        track: null,
        keywords: ["AI", "Python"],
        enabled: true,
        sort_order: 10,
        created_at: "2026-05-02T00:00:00",
        updated_at: "2026-05-02T00:00:00",
      },
    ]);

    render(<SourcesClient />);

    await waitFor(() => {
      expect(screen.getByText("BOSS直聘职位搜索")).toBeInTheDocument();
      expect(screen.getByText("打开平台")).toBeInTheDocument();
    });
  });

  it("renders preference settings", async () => {
    fetchPreferencesMock.mockResolvedValue({
      id: 1,
      target_cities: ["上海", "远程"],
      target_tracks: ["ai_app_dev"],
      priority_skills: ["Python", "LLM"],
      min_salary: 20,
      default_resume_version: "v2",
      llm_enabled: false,
      created_at: "2026-05-02T00:00:00",
      updated_at: "2026-05-02T00:00:00",
    });

    render(<SettingsClient />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("上海, 远程")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Python, LLM")).toBeInTheDocument();
      expect(screen.getByDisplayValue("v2")).toBeInTheDocument();
    });
  });
});
