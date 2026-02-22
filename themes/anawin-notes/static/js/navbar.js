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
        const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
        navbar.querySelectorAll('.nav-links a').forEach(link => {
            const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    });
})();
