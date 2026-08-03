import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  copyText,
  downloadCsv,
  encodeToolParams,
  loadToolState,
  readNumericParams,
  saveToolState,
} from "./share";

describe("encodeToolParams / readNumericParams", () => {
  it("round-trips numeric tool state via query params", () => {
    const params = encodeToolParams("sip_", { amount: 5000, years: 10, rate: 12 });
    const parsed = readNumericParams(`?${params.toString()}`, "sip_", [
      "amount",
      "years",
      "rate",
    ]);
    expect(parsed).toEqual({ amount: 5000, years: 10, rate: 12 });
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

  it("returns null for missing keys", () => {
    expect(loadToolState("missing")).toBeNull();
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

    downloadCsv("out.csv", [
      ["a", "b"],
      ["1", "2,3"],
    ]);
    expect(click).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledWith("blob:csv");
  });
});
