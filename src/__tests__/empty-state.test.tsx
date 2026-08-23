import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState (shared recovery panel)", () => {
  it("renders title alone when nothing else is given", () => {
    const html = renderToString(<EmptyState title="No results" />);
    expect(html).toContain("No results");
    expect(html).not.toContain("mt-4 flex justify-center");
  });

  it("renders the optional description", () => {
    const html = renderToString(
      <EmptyState title="No results" description="Try a broader query." />,
    );
    expect(html).toContain("Try a broader query.");
  });

  it("renders the mandatory recovery action", () => {
    const html = renderToString(
      <EmptyState
        title="No results"
        action={<button type="button">Clear filters</button>}
      />,
    );
    expect(html).toContain("Clear filters");
    expect(html).toContain("mt-4 flex justify-center");
  });
});
