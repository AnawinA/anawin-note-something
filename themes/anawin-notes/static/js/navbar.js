/* ============================================================
   ANAWIN NOTES – Navbar (scroll-compact + mobile hamburger)
   ============================================================ */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const hamburger = navbar.querySelector('.nav-hamburger');
        const COMPACT_THRESHOLD = 60;
        let isCompact = false;

        // --- Scroll-based compact ---
        function onScroll() {
            const scrolled = window.scrollY > COMPACT_THRESHOLD;
            if (scrolled !== isCompact) {
                isCompact = scrolled;
                navbar.classList.toggle('compact', scrolled);
                document.body.classList.toggle('nav-compact', scrolled);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run on load

        // --- Mobile hamburger ---
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('open');
                navbar.classList.toggle('nav-open');
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target)) {
                    hamburger.classList.remove('open');
                    navbar.classList.remove('nav-open');
                }
            });
        }

        // --- Active link highlight ---
        // Links with ?mode= (Search, History) must match path + mode exactly.
        // Plain links (Notes, Tags) match on pathname alone.
        const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
        const currentMode = new URLSearchParams(window.location.search).get('mode') || '';

        navbar.querySelectorAll('.nav-links a').forEach(link => {
            const linkUrl = new URL(link.href);
            const linkPath = linkUrl.pathname.replace(/\/$/, '') || '/';
            const linkMode = linkUrl.searchParams.get('mode') || '';

            if (linkPath === currentPath && linkMode === currentMode) {
                link.classList.add('active');
            }
        });
    });
})();
