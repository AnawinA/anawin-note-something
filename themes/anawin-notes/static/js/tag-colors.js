/* ============================================================
   TAG COLORS – hue-based coloring from first letter
   A(0) = red (hue 0°)  →  Z(25) = deep pink (hue 330°)
   Non-English first character = no color
   ============================================================ */
(function () {
    function colorTagPills() {
        document.querySelectorAll('.tag-pill, .tag-badge, .tag-cloud-item').forEach(el => {
            // For tag-cloud-item get text from first child span, otherwise direct text
            const text = (el.querySelector('span')?.textContent ?? el.textContent).trim()
                .replace(/^#/, ''); // strip leading # if present
            if (!text) return;
            const ch = text[0].toLowerCase();
            if (ch < 'a' || ch > 'z') return; // non-English → default style
            const idx = ch.charCodeAt(0) - 97; // 0 (a) … 25 (z)
            const hue = Math.round((idx / 25) * 330);
            el.style.setProperty('--tag-hue', hue);
            el.classList.add('tag-colored');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', colorTagPills);
    } else {
        colorTagPills();
    }

    // Expose so tags.js / notes.js can re-run after dynamic DOM updates
    window.colorTagPills = colorTagPills;
})();
