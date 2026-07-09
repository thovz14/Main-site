/* ========================================
   SOCIAL MEDIA PAGE — Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // STATE
    // =============================================
    // Auto-assign IDs so the user doesn't have to
    const videos = ((typeof VIDEOS !== 'undefined') ? VIDEOS : []).map((v, i) => ({
        ...v,
        _id: i
    }));
    let activeFilter = 'all';

    // =============================================
    // DOM REFERENCES
    // =============================================
    const grid = document.getElementById('video-grid');
    const emptyState = document.getElementById('empty-state');
    const detailModal = document.getElementById('detail-modal');
    const detailModalClose = document.getElementById('detail-modal-close');
    const filterTabs = document.querySelectorAll('.filter-tab');

    // =============================================
    // RENDER VIDEO GRID
    // =============================================
    function renderGrid() {
        const filtered = activeFilter === 'all'
            ? videos
            : videos.filter(v => v.platform === activeFilter);

        grid.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        filtered.forEach((video, index) => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.style.animationDelay = `${index * 0.08}s`;
            card.dataset.id = video._id;

            const thumbHTML = video.thumbnail
                ? `<img class="video-card-thumb" src="${escapeHTML(video.thumbnail)}" alt="${escapeHTML(video.title)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="video-card-no-img" style="display:none;">${video.platform === 'youtube' ? '🎬' : '📱'}</div>`
                : `<div class="video-card-no-img">${video.platform === 'youtube' ? '🎬' : '📱'}</div>`;

            card.innerHTML = `
                ${thumbHTML}
                <div class="video-card-overlay">
                    <div class="video-card-title">${escapeHTML(video.title)}</div>
                    <div class="video-card-platform ${video.platform}">${video.platform === 'tiktok' ? 'TikTok' : 'YouTube'}</div>
                </div>
            `;

            card.addEventListener('click', () => openDetail(video._id));
            grid.appendChild(card);
        });
    }

    // =============================================
    // FILTER TABS
    // =============================================
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderGrid();
        });
    });

    // =============================================
    // MODAL LOGIC
    // =============================================
    function openModal(modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    detailModalClose.addEventListener('click', () => closeModal(detailModal));

    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) closeModal(detailModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal(detailModal);
    });

    // =============================================
    // OPEN DETAIL POPUP
    // =============================================
    function openDetail(id) {
        const video = videos.find(v => v._id === id);
        if (!video) return;

        document.getElementById('detail-title').textContent = video.title;
        document.getElementById('detail-img').src = video.thumbnail || '';
        document.getElementById('detail-img').alt = video.title;

        // Hide thumbnail area if no image
        const thumbContainer = document.getElementById('detail-thumbnail');
        thumbContainer.style.display = video.thumbnail ? 'flex' : 'none';

        // Platform badge
        const badge = document.getElementById('detail-platform');
        badge.textContent = video.platform === 'tiktok' ? 'TikTok' : 'YouTube';
        badge.className = 'detail-badge ' + video.platform;

        // Link
        const linkEl = document.getElementById('detail-link');
        linkEl.href = video.link;
        linkEl.textContent = 'Bekijk video →';

        // Code blocks — toon alleen als er code is ingevuld
        const codeFields = [
            { key: 'html', sectionId: 'detail-html-section', codeId: 'detail-html-code' },
            { key: 'css',  sectionId: 'detail-css-section',  codeId: 'detail-css-code' },
            { key: 'js',   sectionId: 'detail-js-section',   codeId: 'detail-js-code' },
        ];

        codeFields.forEach(({ key, sectionId, codeId }) => {
            const section = document.getElementById(sectionId);
            const codeEl = document.getElementById(codeId);
            if (video[key]) {
                section.style.display = 'block';
                codeEl.textContent = video[key];
            } else {
                section.style.display = 'none';
                codeEl.textContent = '';
            }
        });

        openModal(detailModal);
    }

    // =============================================
    // COPY CODE BUTTONS
    // =============================================
    document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
        btn.addEventListener('click', () => {
            const codeId = btn.getAttribute('data-copy');
            const code = document.getElementById(codeId).textContent;
            const label = btn.querySelector('.copy-label');

            navigator.clipboard.writeText(code).then(() => {
                btn.classList.add('copied');
                if (label) label.textContent = 'Gekopieerd!';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    if (label) label.textContent = 'Kopiëren';
                }, 2000);
            });
        });
    });

    // =============================================
    // UTILITY
    // =============================================
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // =============================================
    // HEADER & MOBILE MENU
    // =============================================
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    window.toggleMenu = function() {
        const nav = document.getElementById('main-nav');
        const hamburger = document.getElementById('hamburger');
        nav.classList.toggle('open');
        hamburger.classList.toggle('active');
    };

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.getElementById('main-nav');
            const hamburger = document.getElementById('hamburger');
            nav.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });

    // =============================================
    // INIT
    // =============================================
    renderGrid();

});
