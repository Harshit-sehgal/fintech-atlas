import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  copyText,
  downloadCsv,
  encodeToolParams,
  loadToolState,
  printToPdf,
  readNumericParams,
  saveToolState,
  shareOrCopy,
} from "./share";

describe("encodeToolParams / readNumericParams", () => {
  it("round-trips numeric tool state via query params", () => {
    const params = encodeToolParams("sip_", { amount: 5000, years: 10, rate: 12, enabled: true, omitted: undefined });
    const parsed = readNumericParams(`?${params.toString()}`, "sip_", ["amount", "years", "rate", "missing"]);
    expect(parsed).toEqual({ amount: 5000, years: 10, rate: 12 });
  });

  it("ignores missing, empty, and non-finite numeric params", () => {
    expect(readNumericParams("?sip_amount=&sip_years=nope&sip_rate=Infinity", "sip_", ["amount", "years", "rate"])).toEqual({});
  });
});

describe("saveToolState / loadToolState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists and restores state", () => {
    expect(saveToolState("demo", { a: 1 })).toBe(true);
    expect(loadToolState<{ a: number }>("demo")).toEqual({ a: 1 });
  });

  it("returns null for missing or malformed state", () => {
    expect(loadToolState("missing")).toBeNull();
    localStorage.setItem("fintech_atlas_tool_bad", "not-json");
    expect(loadToolState("bad")).toBeNull();
  });
});

describe("copyText", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses navigator.clipboard when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(copyText("hello")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("returns false when clipboard is unavailable or rejects", async () => {
    vi.stubGlobal("navigator", {});
    await expect(copyText("hello")).resolves.toBe(false);
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("blocked")) } });
    await expect(copyText("hello")).resolves.toBe(false);
  });
});

describe("shareOrCopy", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses native sharing when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share, clipboard: { writeText: vi.fn() } });
    await expect(shareOrCopy({ title: "Title", text: "Text", url: "https://example.test" })).resolves.toBe("shared");
    expect(share).toHaveBeenCalledWith({ title: "Title", text: "Text", url: "https://example.test" });
  });

  it("falls back to copying when sharing is unavailable or rejects", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(shareOrCopy({ title: "Title", url: "https://example.test" })).resolves.toBe("copied");

    vi.stubGlobal("navigator", { share: vi.fn().mockRejectedValue(new Error("unsupported")), clipboard: { writeText } });
    await expect(shareOrCopy({ title: "Title", url: "https://example.test" })).resolves.toBe("copied");
  });

  it("reports a cancelled share as failed without throwing", async () => {
    const share = vi.fn().mockRejectedValue(new DOMException("cancelled", "AbortError"));
    vi.stubGlobal("navigator", { share, clipboard: { writeText: vi.fn() } });
    await expect(shareOrCopy({ title: "Title", url: "https://example.test" })).resolves.toBe("failed");
  });
});

describe("printToPdf", () => {
  it("opens the native browser print dialog", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    expect(printToPdf()).toBe(true);
    expect(print).toHaveBeenCalledOnce();
    print.mockRestore();
  });
});

describe("downloadCsv", () => {
  it("creates an object URL and clicks a temporary anchor", () => {
    const click = vi.fn();
    const revoke = vi.fn();
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:csv");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(revoke);
    vi.spyOn(document, "createElement").mockReturnValue({
      click,
      remove: vi.fn(),
      set href(_v: string) {},
      set download(_v: string) {},
      set rel(_v: string) {},
    } as unknown as HTMLAnchorElement);
    vi.spyOn(document.body, "appendChild").mockImplementation((n) => n);

    downloadCsv("out.csv", [["a", "b"], ["1", "2,3"], ["line\nvalue", "quote\"value"]]);
    expect(click).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledWith("blob:csv");
  });
});
