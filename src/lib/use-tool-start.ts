"use client";

import { useEffect, type RefObject } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires a single `tool_start` analytics event on the first interaction with
 * the tool (any pointer/key/touch event originating inside `ref`), so a
 * *started* session is distinguished from a *completed* calculation (T043).
 * One-shot per mount — scroll, hover, and events outside the ref never count.
 * Best-effort: analytics failures never throw and the tool UX is unaffected.
 */
export function useToolStart(tool: string, ref?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let fired = false;

    const fire = () => {
      if (fired) return;
      fired = true;
      trackEvent("tool_start", { tool });
      window.removeEventListener("pointerdown", fire);
      window.removeEventListener("keydown", fire);
      window.removeEventListener("touchstart", fire);
    };

    const matchesSource = (target: EventTarget | null) =>
      target instanceof Node && ref?.current
        ? ref.current.contains(target)
        : false;

    const handle = (e: Event) => {
      if (matchesSource(e.target) || !ref) fire();
    };

    window.addEventListener("pointerdown", handle);
    window.addEventListener("keydown", handle);
    window.addEventListener("touchstart", handle);
    return () => {
      window.removeEventListener("pointerdown", handle);
      window.removeEventListener("keydown", handle);
      window.removeEventListener("touchstart", handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool]);
}