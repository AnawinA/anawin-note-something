/* ============================================================
   ANAWIN NOTES – Tags List Controller
   Sort (Name / Count), Asc/Desc, Label groups, Search, Count toggle
   ============================================================ */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('tags-list-container');
        if (!container) return;

        const SECTION_KEY = 'anawin-tags-settings';

        // --- State (MUST be before applySettings call) ---
        let state = loadSettings();
        let allTags = [];
        let displayedTags = [];
        let searchText = state.searchText || '';
        let searchActive = false;

        // --- Elements ---
        const grid = container.querySelector('#tags-grid');
        const sortBtns = container.querySelectorAll('[data-sort]');
        const ascBtn = container.querySelector('[data-asc-toggle]');
        const labelToggle = container.querySelector('[data-label-toggle]');
        const countToggle = container.querySelector('[data-count-toggle]');
        const searchWrap = container.querySelector('.search-toggle-wrap');
        const searchBtn = searchWrap?.querySelector('.search-btn');
        const searchInWrap = searchWrap?.querySelector('.search-input-wrap');
        const searchInput = searchInWrap?.querySelector('input');
        const clearBtn = searchInWrap?.querySelector('.search-clear');
        const countEl = container.querySelector('.notes-count');

        // --- Collect tags ---
        allTags = Array.from(grid?.querySelectorAll('.tag-item') || []);

        // --- Init ---
        applySettings();

        // --- Event Listeners ---
        sortBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                state.sort = btn.dataset.sort;
                applySortButtons();
                renderTags();
                saveSettings();
            });
        });

        ascBtn?.addEventListener('click', () => {
            state.asc = !state.asc;
            applyAscBtn();
            renderTags();
            saveSettings();
        });

        labelToggle?.addEventListener('click', () => {
            state.label = !state.label;
            applyLabelToggle();
            renderTags();
            saveSettings();
        });

        countToggle?.addEventListener('click', () => {
            state.showCount = !state.showCount;
            applyCountToggle();
            saveSettings();
        });

        // Search
        function openSearch() {
            searchActive = true;
            if (searchBtn) searchBtn.style.display = 'none';
            searchInWrap?.classList.add('active');
            if (searchInput) { searchInput.value = searchText; searchInput.focus(); }
            filterAndRender();
        }
        function closeSearch() {
            searchActive = false;
            searchInWrap?.classList.remove('active');
            if (searchBtn) {
                searchBtn.style.display = '';
                searchBtn.classList.toggle('has-text', !!searchText);
                searchBtn.innerHTML = searchText
                    ? `🔍 <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(searchText)}</span>`
                    : '🔍 Search';
            }
        }

        searchBtn?.addEventListener('click', openSearch);
        searchInput?.addEventListener('blur', () => setTimeout(closeSearch, 150));
        searchInput?.addEventListener('input', () => {
            searchText = searchInput.value;
            state.searchText = searchText;
            filterAndRender();
        });
        clearBtn?.addEventListener('click', () => {
            searchText = ''; state.searchText = '';
            if (searchInput) searchInput.value = '';
            filterAndRender(); saveSettings(); closeSearch();
        });

        // --- Core ---
        function applySettings() {
            applySortButtons();
            applyAscBtn();
            applyLabelToggle();
            applyCountToggle();
            if (state.searchText) {
                searchText = state.searchText;
                searchBtn?.classList.add('has-text');
                if (searchBtn) searchBtn.innerHTML = `🔍 <span>${escapeHtml(searchText)}</span>`;
            }
            filterAndRender();
        }

        function applySortButtons() {
            sortBtns.forEach(b => b.classList.toggle('active', b.dataset.sort === state.sort));
        }
        function applyAscBtn() {
            if (!ascBtn) return;
            ascBtn.classList.toggle('desc', !state.asc);
            ascBtn.setAttribute('aria-label', state.asc ? 'Ascending' : 'Descending');
        }
        function applyLabelToggle() {
            if (!labelToggle) return;
            labelToggle.classList.toggle('on', state.label);
            labelToggle.querySelector('.toggle')?.classList.toggle('on', state.label);
        }
        function applyCountToggle() {
            if (!countToggle) return;
            countToggle.classList.toggle('on', state.showCount);
            countToggle.querySelector('.toggle')?.classList.toggle('on', state.showCount);
            allTags.forEach(tag => {
                const cs = tag.querySelector('.tag-count');
                if (cs) cs.style.display = state.showCount ? '' : 'none';
            });
        }

        function filterAndRender() { filterTags(); renderTags(); }

        function filterTags() {
            const q = searchText.trim();
            if (!q) { displayedTags = [...allTags]; return; }
            const re = new RegExp(escapeRegex(q), 'i');
            displayedTags = allTags.filter(t => re.test(t.dataset.name || ''));
        }

        function sortTagItems(tags) {
            return [...tags].sort((a, b) => {
                let va, vb;
                if (state.sort === 'count') {
                    va = parseInt(a.dataset.count || '0', 10);
                    vb = parseInt(b.dataset.count || '0', 10);
                } else {
                    va = (a.dataset.name || '').toLowerCase();
                    vb = (b.dataset.name || '').toLowerCase();
                }
                if (va < vb) return state.asc ? -1 : 1;
                if (va > vb) return state.asc ? 1 : -1;
                return 0;
            });
        }

        function renderTags() {
            if (!grid) return;
            const sorted = sortTagItems(displayedTags);

            if (countEl) countEl.textContent = `${sorted.length} tag${sorted.length !== 1 ? 's' : ''}`;

            grid.innerHTML = '';

            if (sorted.length === 0) {
                grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🏷️</div><div class="empty-title">No tags found</div></div>`;
                return;
            }

            if (state.label) {
                // Group by first letter
                const groups = {};
                sorted.forEach(tag => {
                    const ch = (tag.dataset.name || '')[0]?.toUpperCase() || '#';
                    const key = /[A-Z]/.test(ch) ? ch : '#';
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(tag);
                });
                Object.entries(groups).forEach(([key, items]) => {
                    const details = document.createElement('details');
                    details.className = 'label-group';
                    details.open = true;
                    const summary = document.createElement('summary');
                    summary.innerHTML = `${key} <span class="group-count">${items.length}</span>`;
                    details.appendChild(summary);
                    const inner = document.createElement('div');
                    inner.className = 'label-group-content tags-grid-inner';
                    items.forEach(t => inner.appendChild(t));
                    details.appendChild(inner);
                    grid.appendChild(details);
                });
            } else {
                sorted.forEach(tag => grid.appendChild(tag));
            }

            // Re-apply count visibility and re-color after DOM shuffle
            applyCountToggle();
            window.colorTagPills?.();
        }

        // --- Persistence ---
        function defaultSettings() {
            return { sort: 'name', asc: true, label: false, showCount: true, searchText: '' };
        }
        function loadSettings() {
            try { return Object.assign(defaultSettings(), JSON.parse(localStorage.getItem(SECTION_KEY)) || {}); }
            catch { return defaultSettings(); }
        }
        function saveSettings() { localStorage.setItem(SECTION_KEY, JSON.stringify(state)); }

        // --- Utils ---
        function escapeHtml(s) { return s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
        function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    });
})();
