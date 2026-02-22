/* ============================================================
   ANAWIN NOTES – Landing Page Count-Up Animation
   ============================================================ */
(function () {
    /**
     * cubic-bezier(0.25, 1, 0.5, 1) easing for ease-out
     */
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    /**
     * Animate a number from 0 to target over `duration` ms
     */
    function countUp(el, target, duration) {
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOutQuart(progress) * target);
            el.textContent = value.toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const counters = document.querySelectorAll('[data-count-up]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.countUp, 10) || 0;
                    countUp(el, target, 1000);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(el => observer.observe(el));
    });
})();
