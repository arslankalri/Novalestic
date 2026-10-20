import { describe, expect, it } from "vitest";
import { isAdminSection, parseAdminSection } from "./sections";

describe("admin section navigation", () => {
  it("accepts the dashboard's supported sections", () => {
    expect(parseAdminSection("overview")).toBe("overview");
    expect(parseAdminSection("products")).toBe("products");
    expect(parseAdminSection("editor")).toBe("editor");
  });

  it("rejects invalid query values and falls back to overview at the route", () => {
    expect(isAdminSection("settings")).toBe(false);
    expect(parseAdminSection("settings")).toBeUndefined();
    expect(parseAdminSection(undefined)).toBeUndefined();
    expect(parseAdminSection(null)).toBeUndefined();
  });
});
