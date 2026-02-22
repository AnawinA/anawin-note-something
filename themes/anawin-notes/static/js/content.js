/* ============================================================
   ANAWIN NOTES – Content Page (record visit + code copy)
   ============================================================ */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        // --- Record visit ---
        const metaUrl = document.querySelector('meta[name="note-url"]')?.content;
        const metaTitle = document.querySelector('meta[name="note-title"]')?.content;
        const metaDate = document.querySelector('meta[name="note-date"]')?.content;

        if (metaUrl && metaTitle && window.AnawinHistory) {
            window.AnawinHistory.recordVisit(metaUrl, metaTitle, metaDate || '');
        }

        // --- Copy buttons on code blocks ---
        document.querySelectorAll('.prose pre').forEach(pre => {
            // Detect language
            const code = pre.querySelector('code');
            const langClass = code?.className?.match(/language-(\w+)/)?.[1];
            if (langClass) pre.setAttribute('data-lang', langClass);

            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.textContent = 'Copy';
            btn.setAttribute('aria-label', 'Copy code');
            pre.appendChild(btn);

            btn.addEventListener('click', () => {
                const text = code?.textContent || pre.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                }).catch(() => {
                    btn.textContent = 'Failed';
                    setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
                });
            });
        });
    });
})();
