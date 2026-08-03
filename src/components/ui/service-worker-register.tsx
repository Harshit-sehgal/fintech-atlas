"use client";

import { useEffect } from "react";
import { assetPath } from "@/lib/site-config";

/** Register only in production browsers; local dev should not retain stale caches. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register(assetPath("/sw.js")).catch(() => {
      // Offline support is an enhancement and must never break the app.
    });
  }, []);

  return null;
}
