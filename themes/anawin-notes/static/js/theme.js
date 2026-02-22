/* ============================================================
   ANAWIN NOTES – Theme Toggle
   ============================================================ */
(function () {
    const KEY = 'anawin-theme';

    function getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(KEY, theme);
        updateBtns(theme);
    }

    function updateBtns(theme) {
        document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
            btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        });
    }

    function toggle() {
        setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateBtns(getTheme());
        document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
            btn.addEventListener('click', toggle);
        });
    });
})();
