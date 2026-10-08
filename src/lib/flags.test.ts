import { describe, expect, it } from "vitest";
import { flagEmoji } from "./flags";

describe("flagEmoji", () => {
  it("returns the regional-indicator flag for a known country", () => {
    expect(flagEmoji("United States")).toBe("🇺🇸");
    expect(flagEmoji("United Kingdom")).toBe("🇬🇧");
    expect(flagEmoji("Japan")).toBe("🇯🇵");
  });

  it("returns null for thematic (non-country) groups", () => {
    expect(flagEmoji("CROSS-BORDER PAYMENTS, REMITTANCES & CRYPTO")).toBeNull();
    expect(flagEmoji("Unknown Land")).toBeNull();
  });
});
