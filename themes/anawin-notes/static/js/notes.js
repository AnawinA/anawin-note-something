/* ============================================================
   ANAWIN NOTES – Notes List Controller
   All view, sort, label group, search, and chunk loading logic
   ============================================================ */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('notes-list-container');
        if (!container) return;

        // --- Config ---
        const CHUNK_SIZE = 30;
        const SECTION_KEY = 'anawin-notes-settings-' + (container.dataset.sectionKey || 'all');

        // --- State ---
        let state = loadSettings();
        let allCards = []; // All note card elements (data-rich)
        let displayedCards = []; // Cards after filter/sort
        let chunkOffset = 0;
        // MUST be declared before applySettings() → filterCards() uses it (TDZ guard)
        let searchText = state.searchText || '';
        let searchActive = false;

        // --- Elements ---
        const grid = container.querySelector('.notes-grid');
        const viewGalleryBtn = container.querySelector('[data-view="gallery"]');
        const viewListBtn = container.querySelector('[data-view="list"]');
        const sortBtns = container.querySelectorAll('[data-sort]');
        const ascBtn = container.querySelector('[data-asc-toggle]');
        const labelToggle = container.querySelector('[data-label-toggle]');
        const sizeRange = container.querySelector('[data-size-range]');
        const searchToggleWrap = container.querySelector('.search-toggle-wrap');
        const searchBtn = searchToggleWrap?.querySelector('.search-btn');
        const searchInputWrap = searchToggleWrap?.querySelector('.search-input-wrap');
        const searchInput = searchInputWrap?.querySelector('input');
        const wholeWordBtn = searchInputWrap?.querySelector('[data-whole-word]');
        const matchCaseBtn = searchInputWrap?.querySelector('[data-match-case]');
        const sentinel = container.querySelector('.load-sentinel');
        const countEl = container.querySelector('.notes-count');

        // --- Collect cards ---
        allCards = Array.from(grid?.querySelectorAll('.note-card') || []);

        // --- Init ---
        applySettings();

        // --- Event Listeners ---

        // View toggle
        viewGalleryBtn?.addEventListener('click', () => {
            state.view = 'gallery';
            applyView();
            saveSettings();
        });
        viewListBtn?.addEventListener('click', () => {
            state.view = 'list';
            applyView();
            saveSettings();
        });

        // Sort
        sortBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                state.sort = btn.dataset.sort;
                applySortButtons();
                renderCards();
                saveSettings();
            });
        });

        // Asc/Desc
        ascBtn?.addEventListener('click', () => {
            state.asc = !state.asc;
            applyAscBtn();
            renderCards();
            saveSettings();
        });

        // Label toggle
        labelToggle?.addEventListener('click', () => {
            state.label = !state.label;
            applyLabelToggle();
            renderCards();
            saveSettings();
        });

        // Size range
        sizeRange?.addEventListener('input', () => {
            const val = parseInt(sizeRange.value, 10);
            if (state.view === 'gallery') {
                grid.style.setProperty('--card-size', val + 'px');
            } else {
                grid.style.setProperty('--card-list-img', val + 'px');
            }
            state.size = val;
            saveSettings();
        });

        // Search toggle / input behavior

        function openSearch() {
            searchActive = true;
            searchBtn.style.display = 'none';
            searchInputWrap.classList.add('active');
            searchInput.value = searchText;
            searchInput.focus();
            filterCards();
        }

        function closeSearch() {
            searchActive = false;
            searchInputWrap.classList.remove('active');
            searchBtn.style.display = '';
            if (searchText) {
                searchBtn.classList.add('has-text');
                searchBtn.innerHTML = `🔍 <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(searchText)}</span>`;
            } else {
                searchBtn.classList.remove('has-text');
                searchBtn.innerHTML = '🔍 Search';
            }
        }

        searchBtn?.addEventListener('click', openSearch);

        searchInput?.addEventListener('blur', () => {
            // Small delay so click on options doesn't instantly close
            setTimeout(closeSearch, 150);
        });

        searchInput?.addEventListener('input', () => {
            searchText = searchInput.value;
            state.searchText = searchText;
            filterAndRender();
        });

        // Whole word / match case toggles
        function toggleSearchOpt(btn, key) {
            state[key] = !state[key];
            btn.classList.toggle('active', state[key]);
            filterAndRender();
            saveSettings();
        }

        wholeWordBtn?.addEventListener('click', () => toggleSearchOpt(wholeWordBtn, 'wholeWord'));
        matchCaseBtn?.addEventListener('click', () => toggleSearchOpt(matchCaseBtn, 'matchCase'));

        // Clear search
        const clearBtn = searchInputWrap?.querySelector('.search-clear');
        clearBtn?.addEventListener('click', () => {
            searchText = '';
            state.searchText = '';
            if (searchInput) searchInput.value = '';
            filterAndRender();
            saveSettings();
            closeSearch();
        });

        // Auto-open search if ?q= in URL
        const urlQ = new URLSearchParams(location.search).get('q');
        if (urlQ) {
            searchText = urlQ;
            state.searchText = urlQ;
            openSearch();
        }

        // Chunk loading via IntersectionObserver
        if (sentinel) {
            const io = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) loadChunk();
            }, { rootMargin: '200px' });
            io.observe(sentinel);
        }

        // --- Core Functions ---

        function applySettings() {
            applyView();
            applySortButtons();
            applyAscBtn();
            applyLabelToggle();
            if (sizeRange) {
                sizeRange.value = state.size;
                const val = parseInt(state.size, 10);
                if (state.view === 'gallery') grid?.style.setProperty('--card-size', val + 'px');
                else grid?.style.setProperty('--card-list-img', val + 'px');
            }
            if (wholeWordBtn) wholeWordBtn.classList.toggle('active', state.wholeWord);
            if (matchCaseBtn) matchCaseBtn.classList.toggle('active', state.matchCase);
            if (state.searchText) {
                searchText = state.searchText;
                searchBtn?.classList.add('has-text');
                if (searchBtn) searchBtn.innerHTML = `🔍 <span>${escapeHtml(searchText)}</span>`;
            }
            filterAndRender();
        }

        function applyView() {
            const isGallery = state.view === 'gallery';
            grid?.classList.toggle('view-list', !isGallery);
            allCards.forEach(c => c.classList.toggle('list-card', !isGallery));
            viewGalleryBtn?.classList.toggle('active', isGallery);
            viewListBtn?.classList.toggle('active', !isGallery);
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

        // Filter then render
        function filterAndRender() {
            filterCards();
            renderCards();
        }

        function filterCards() {
            const query = searchText.trim();
            if (!query) {
                displayedCards = [...allCards];
                return;
            }

            let pattern;
            try {
                if (state.wholeWord) {
                    pattern = new RegExp(`\\b${escapeRegex(query)}\\b`, state.matchCase ? '' : 'i');
                } else {
                    pattern = new RegExp(escapeRegex(query), state.matchCase ? '' : 'i');
                }
            } catch {
                displayedCards = [...allCards];
                return;
            }

            displayedCards = allCards.filter(card => {
                const haystack = [
                    card.dataset.title || '',
                    card.dataset.desc || '',
                    card.dataset.tags || '',
                ].join(' ');
                return pattern.test(haystack);
            });
        }

        function sortCards(cards) {
            const sorted = [...cards];
            sorted.sort((a, b) => {
                let va, vb;
                if (state.sort === 'name') {
                    va = (a.dataset.title || '').toLowerCase();
                    vb = (b.dataset.title || '').toLowerCase();
                } else if (state.sort === 'watched') {
                    // Watched date from localStorage history
                    const hist = window.AnawinHistory?.getHistory() || [];
                    const idx = url => hist.findIndex(h => url.endsWith(h.url.replace(/\/$/, '')));
                    const ai = idx(a.dataset.url || '');
                    const bi = idx(b.dataset.url || '');
                    // Not in history = rank last
                    va = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
                    vb = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
                    return state.asc ? va - vb : vb - va;
                } else {
                    // 'created' (default)
                    va = new Date(a.dataset.date || 0).getTime();
                    vb = new Date(b.dataset.date || 0).getTime();
                    return state.asc ? va - vb : vb - va;
                }
                if (va < vb) return state.asc ? -1 : 1;
                if (va > vb) return state.asc ? 1 : -1;
                return 0;
            });
            return sorted;
        }

        function renderCards() {
            if (!grid) return;

            const sorted = sortCards(displayedCards);
            chunkOffset = 0;

            // Update count
            if (countEl) {
                countEl.textContent = `${sorted.length} note${sorted.length !== 1 ? 's' : ''}`;
            }

            // Clear grid (keep sentinel)
            grid.innerHTML = '';
            if (sentinel) grid.appendChild(sentinel);

            if (sorted.length === 0) {
                renderEmpty();
                return;
            }

            if (state.label) {
                renderWithLabels(sorted);
            } else {
                renderFlat(sorted);
            }
        }

        function renderFlat(cards) {
            const chunk = cards.slice(0, CHUNK_SIZE);
            chunk.forEach(c => {
                c.classList.remove('hidden-note');
                grid.insertBefore(c, sentinel);
            });
            // Hide rest
            cards.slice(CHUNK_SIZE).forEach(c => {
                c.classList.add('hidden-note');
                grid.appendChild(c);
            });
            chunkOffset = CHUNK_SIZE;
            if (sentinel) sentinel.textContent = cards.length > CHUNK_SIZE ? 'Loading more…' : '';
        }

        function renderWithLabels(cards) {
            // Group
            const groups = {};
            cards.forEach(card => {
                let key;
                if (state.sort === 'name') {
                    key = (card.dataset.title || '?')[0].toUpperCase();
                    if (!/[A-Z]/.test(key)) key = '#';
                } else {
                    // Date-based grouping
                    const d = new Date(card.dataset.date || 0);
                    key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                }
                if (!groups[key]) groups[key] = [];
                groups[key].push(card);
            });

            // Render groups
            Object.entries(groups).forEach(([key, groupCards]) => {
                const details = document.createElement('details');
                details.className = 'label-group';
                details.open = true;

                const summary = document.createElement('summary');
                summary.innerHTML = `${key} <span class="group-count">${groupCards.length}</span>`;
                details.appendChild(summary);

                const inner = document.createElement('div');
                inner.className = 'label-group-content notes-grid' + (state.view === 'list' ? ' view-list' : '');
                groupCards.forEach(c => {
                    c.classList.remove('hidden-note');
                    inner.appendChild(c);
                });
                details.appendChild(inner);

                grid.insertBefore(details, sentinel);
            });

            if (sentinel) sentinel.textContent = '';
            chunkOffset = cards.length;
        }

        function loadChunk() {
            if (state.label) return; // label mode renders all at once
            const sorted = sortCards(displayedCards);
            const next = sorted.slice(chunkOffset, chunkOffset + CHUNK_SIZE);
            if (!next.length) {
                if (sentinel) sentinel.textContent = '';
                return;
            }
            next.forEach(c => {
                c.classList.remove('hidden-note');
                // Move visible card before sentinel
                grid.insertBefore(c, sentinel);
            });
            chunkOffset += next.length;
            const remaining = sorted.length - chunkOffset;
            if (sentinel) sentinel.textContent = remaining > 0 ? `Loading more… (${remaining} left)` : '';
        }

        function renderEmpty() {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.innerHTML = `
        <div class="empty-icon">🗒️</div>
        <div class="empty-title">${searchText ? 'No results found' : 'No notes yet'}</div>
        <div class="empty-desc">${searchText ? `No notes match "${escapeHtml(searchText)}"` : 'Start by creating your first note.'}</div>
      `;
            grid.insertBefore(empty, sentinel);
        }

        // --- Persistence ---
        function defaultSettings() {
            return {
                view: 'gallery',
                sort: 'created',
                asc: false,
                label: false,
                size: 220,
                searchText: '',
                wholeWord: false,
                matchCase: false,
            };
        }

        function loadSettings() {
            try {
                return Object.assign(defaultSettings(), JSON.parse(localStorage.getItem(SECTION_KEY)) || {});
            } catch {
                return defaultSettings();
            }
        }

        function saveSettings() {
            localStorage.setItem(SECTION_KEY, JSON.stringify(state));
        }

        // --- Utils ---
        function escapeHtml(str) {
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
        function escapeRegex(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    });
})();
