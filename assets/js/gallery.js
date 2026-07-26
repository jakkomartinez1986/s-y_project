/* ============================================
   S&Y TREE SERVICES - GALLERY + LIGHTBOX
   ============================================ */

const GalleryManager = (() => {
  const ITEMS_PER_PAGE = 8;
  let currentPage = 1;
  let filteredItems = [];
  let lightboxIndex = 0;

  function init() {
    setupFilters();
    setupLightbox();
    filterGallery('all');
  }

  function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        currentPage = 1;
        filterGallery(filter);
      });
    });
  }

  function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    filteredItems = [];

    items.forEach(item => {
      const cat = item.getAttribute('data-category');
      if (category === 'all' || cat === category) {
        item.style.display = '';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        filteredItems.push(item);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });

    setTimeout(() => renderPagination(), 310);
  }

  function renderPagination() {
    const container = document.getElementById('galleryPagination');
    if (!container) return;

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    container.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = i === currentPage ? 'active' : '';
      btn.setAttribute('aria-label', `Page ${i}`);
      btn.addEventListener('click', () => {
        currentPage = i;
        paginate();
      });
      container.appendChild(btn);
    }

    paginate();
  }

  function paginate() {
    filteredItems.forEach((item, index) => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      item.style.display = (index >= start && index < end) ? '' : 'none';
    });

    document.querySelectorAll('.gallery-pagination button').forEach((btn, i) => {
      btn.classList.toggle('active', i + 1 === currentPage);
    });
  }

  function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox(-1));
    document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  function openLightbox(item) {
    const lightbox = document.getElementById('lightbox');
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span');

    lightboxIndex = parseInt(item.getAttribute('data-index'), 10);
    updateLightboxContent(img.src, img.alt, caption ? caption.textContent : '');

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  function navigateLightbox(direction) {
    const items = document.querySelectorAll('.gallery-item');
    lightboxIndex = (lightboxIndex + direction + items.length) % items.length;
    const item = items[lightboxIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span');
    updateLightboxContent(img.src, img.alt, caption ? caption.textContent : '');
  }

  function updateLightboxContent(src, alt, text) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxImg').alt = alt;
    document.getElementById('lightboxCaption').textContent = text;
    document.getElementById('lightboxCounter').textContent = `${lightboxIndex + 1} / ${document.querySelectorAll('.gallery-item').length}`;
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => GalleryManager.init());
