/* ============================================================
   ANAWIN NOTES – Visit History (localStorage)
   ============================================================ */
(function () {
    const HISTORY_KEY = 'anawin-history';
    const MAX_HISTORY = 20;

    /**
     * Read history array from localStorage
     * @returns {Array<{url, title, date, visitedAt}>}
     */
    function readHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        } catch {
            return [];
        }
    }

    /**
     * Write history array to localStorage
     */
    function writeHistory(arr) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
    }

    /**
     * Record a page visit. De-duplicates by URL.
     * @param {string} url - Page URL
     * @param {string} title - Page title
     * @param {string} date - Note's creation date (ISO string)
     */
    function recordVisit(url, title, date) {
        let history = readHistory();

        // Remove existing entry for this URL
        history = history.filter(h => h.url !== url);

        // Add to front
        history.unshift({
            url,
            title,
            date,
            visitedAt: new Date().toISOString(),
        });

        // Trim to max
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }

        writeHistory(history);
    }

    /**
     * Get the history array (sorted newest first)
     */
    function getHistory() {
        return readHistory();
    }

    /**
     * Clear all history
     */
    function clearHistory() {
        localStorage.removeItem(HISTORY_KEY);
    }

    // Expose on window for use by content.js and history page
    window.AnawinHistory = { recordVisit, getHistory, clearHistory };
})();
