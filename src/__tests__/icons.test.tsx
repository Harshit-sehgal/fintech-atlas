import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  IconBook,
  IconBolt,
  IconChart,
  IconCheckCircle,
  IconErrorCircle,
  IconInfoCircle,
  IconLink,
  IconShield,
  IconSliders,
  IconStar,
} from "@/components/ui/icons";

const ALL_ICONS = [
  ["IconLink", IconLink],
  ["IconCheckCircle", IconCheckCircle],
  ["IconInfoCircle", IconInfoCircle],
  ["IconErrorCircle", IconErrorCircle],
  ["IconBook", IconBook],
  ["IconSliders", IconSliders],
  ["IconShield", IconShield],
  ["IconChart", IconChart],
  ["IconBolt", IconBolt],
  ["IconStar", IconStar],
] as const;

describe("ui icons (T103 SVG system)", () => {
  it.each(ALL_ICONS)("%s renders a decorative stroke svg by default", (_name, Icon) => {
    const html = renderToString(<Icon />);
    expect(html).toContain("<svg");
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain("aria-hidden=\"true\"");
    // Decorative glyphs must never be announced as images.
    expect(html).not.toContain("aria-label");
  });

  it.each(ALL_ICONS)("%s becomes semantic when given a label", (_name, Icon) => {
    const html = renderToString(<Icon label="Open share sheet" size={20} className="extra" />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Open share sheet"');
    expect(html).toContain('width="20"');
    expect(html).toContain("extra");
  });
});
