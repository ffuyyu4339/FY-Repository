import { describe, expect, it } from "vitest";
import { buildJobsQuery } from "./api";
import { formatTrackLabel, textToList } from "./types";

describe("frontend helpers", () => {
  it("formats known tracks", () => {
    expect(formatTrackLabel("ai_app_dev")).toBe("AI 应用开发");
  });

  it("falls back for unknown tracks", () => {
    expect(formatTrackLabel("unknown")).toBe("未知方向");
  });

  it("normalizes comma separated keyword input", () => {
    expect(textToList("Python，SQL, Docker")).toEqual(["Python", "SQL", "Docker"]);
  });

  it("builds jobs query string", () => {
    expect(
      buildJobsQuery({
        q: "AI",
        city: "上海",
        track: "",
        match_level: "",
        status: "ready_to_apply",
        sort_by: "match_score",
        sort_order: "desc",
      }),
    ).toBe("?q=AI&city=%E4%B8%8A%E6%B5%B7&status=ready_to_apply&sort_by=match_score&sort_order=desc");
  });
});
