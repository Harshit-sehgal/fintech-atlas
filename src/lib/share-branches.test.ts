import { afterEach, describe, expect, it, vi } from "vitest";
import {
  copyText,
  encodeToolParams,
  loadToolState,
  printToPdf,
  readNumericParams,
  saveToolState,
  shareOrCopy,
} from "./share";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("share / copy branches", () => {
  it("reports failed on an aborted share and falls back to copying otherwise", async () => {
    const share = vi.fn().mockRejectedValue(new DOMException("cancel", "AbortError"));
    vi.stubGlobal("navigator", { share });
    expect(await shareOrCopy({ title: "t", url: "https://x.test" })).toBe("failed");

    const shareOther = vi.fn().mockRejectedValue(new Error("boom"));
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share: shareOther, clipboard: { writeText } });
    expect(await shareOrCopy({ title: "t", url: "https://x.test" })).toBe("copied");
  });

  it("copyText returns false without a clipboard", async () => {
    vi.stubGlobal("navigator", {});
    expect(await copyText("hello")).toBe(false);
  });
});

describe("printToPdf / params branches", () => {
  it("returns false when print is unavailable", () => {
    vi.stubGlobal("window", {});
    expect(printToPdf()).toBe(false);
  });

  it("skips undefined values and parses numeric params with and without a leading ?", () => {
    const params = encodeToolParams("x_", { a: 1, b: undefined, c: true });
    expect(params.toString()).toBe("x_a=1&x_c=true");

    expect(readNumericParams("?x_a=2&x_b=notnum", "x_", ["a", "b", "c"])).toEqual({ a: 2 });
    expect(readNumericParams("x_a=3", "x_", ["a"])).toEqual({ a: 3 });
  });
});

describe("tool state branches", () => {
  it("round-trips state and tolerates malformed JSON", () => {
    expect(saveToolState("t1", { a: 1 })).toBe(true);
    expect(loadToolState<{ a: number }>("t1")).toEqual({ a: 1 });
    localStorage.setItem("fintech_atlas_tool_bad", "{not json");
    expect(loadToolState("bad")).toBeNull();
    expect(loadToolState("missing")).toBeNull();
  });
});
