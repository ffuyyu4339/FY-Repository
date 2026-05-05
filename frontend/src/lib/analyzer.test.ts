import { describe, expect, it } from "vitest";

import { analyzeJdText } from "./analyzer";

describe("analyzer", () => {
  it("extracts structured fields from jd text", () => {
    const result = analyzeJdText(
      "公司：星图智能\n岗位：AI 应用开发工程师\n地点：上海\n要求：1-3年，本科，熟悉 Python、LLM、RAG，支持远程。",
    );

    expect(result.company_name).toBe("星图智能");
    expect(result.job_title).toBe("AI 应用开发工程师");
    expect(result.city).toBe("上海");
    expect(result.degree_required).toBe("本科");
    expect(result.remote_allowed).toBe(true);
    expect(result.skills_extracted).toEqual(["Python", "LLM", "RAG"]);
    expect(result.track).toBe("ai_app_dev");
    expect(result.analysis_source).toBe("rules");
  });
});

