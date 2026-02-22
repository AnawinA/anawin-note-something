/* ============================================================
   EARLY DARK MODE SCRIPT – inline in <head> to prevent flash
   This MUST run before the page paints.
   ============================================================ */
(function () {
  const saved = localStorage.getItem('anawin-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();
