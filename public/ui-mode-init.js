(() => {
  try {
    const stored = localStorage.getItem("ui-mode");
    const uiMode = stored === "boring" || stored === "standard" ? stored : "standard";
    document.documentElement.setAttribute("data-ui-mode", uiMode);
  } catch {
    // Storage access is best-effort before hydration.
  }
})();
