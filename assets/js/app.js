/* ============================================
   S&Y TREE SERVICES - MAIN APPLICATION
   ============================================ */

const App = (() => {
  function init() {
    setupLoadingScreen();
    setupHeader();
    setupMobileNav();
    setupBackToTop();
    setupStickyCTA();
    setupCookieBanner();
    setupScrollReveal();
    setupBeforeAfter();
    setupThemeToggle();
    setupSmoothScroll();
    setYear();
  }

  // ---- Loading Screen ----
  function setupLoadingScreen() {
    const loader = document.getElementById('loadingScreen');
    if (loader) loader.classList.add('hidden');
  }

  // ---- Sticky Header ----
  function setupHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      header.classList.toggle('scrolled', scrollY > 50);
      lastScroll = scrollY;
    }, { passive: true });
  }

  // ---- Mobile Navigation ----
  function setupMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.getElementById('mobileNav');
    const close = document.querySelector('.mobile-nav-close');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.add('active');
      document.body.classList.add('no-scroll');
    });

    if (close) {
      close.addEventListener('click', closeMobileNav);
    }

    nav.addEventListener('click', (e) => {
      if (e.target === nav) closeMobileNav();
    });

    nav.querySelectorAll('.mobile-nav-links a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) closeMobileNav();
    });

    function closeMobileNav() {
      nav.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  // ---- Back to Top ----
  function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Sticky CTA (Mobile) ----
  function setupStickyCTA() {
    const sticky = document.querySelector('.sticky-cta');
    const close = document.getElementById('stickyClose');
    if (!sticky) return;

    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 768) {
        sticky.classList.toggle('visible', window.scrollY > 600);
      }
    }, { passive: true });

    if (close) {
      close.addEventListener('click', () => {
        sticky.style.display = 'none';
      });
    }
  }

  // ---- Cookie Banner ----
  function setupCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const accepts = document.querySelectorAll('.cookie-accept-btn');
    if (!banner || !accepts.length) return;

    if (!localStorage.getItem('sy-cookies-accepted')) {
      setTimeout(() => banner.classList.add('visible'), 2000);
    }

    accepts.forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('sy-cookies-accepted', 'true');
        banner.classList.remove('visible');
      });
    });
  }

  // ---- Scroll Reveal (IntersectionObserver) ----
  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ---- Before & After Slider ----
  function setupBeforeAfter() {
    const container = document.getElementById('beforeAfter');
    const handle = document.getElementById('sliderHandle');
    if (!container || !handle) return;

    let isDragging = false;

    function updateSlider(x) {
      const rect = container.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      container.querySelector('.before-after-overlay').style.width = pos + '%';
      handle.style.left = pos + '%';
      handle.setAttribute('aria-valuenow', Math.round(pos));
    }

    handle.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    document.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
    document.addEventListener('mouseup', () => { isDragging = false; });

    handle.addEventListener('touchstart', (e) => { isDragging = true; }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (isDragging) updateSlider(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', () => { isDragging = false; });

    // Keyboard
    handle.addEventListener('keydown', (e) => {
      const current = parseFloat(handle.style.left) || 50;
      if (e.key === 'ArrowLeft') updateSlider(container.getBoundingClientRect().left + (current - 5) / 100 * container.offsetWidth);
      if (e.key === 'ArrowRight') updateSlider(container.getBoundingClientRect().left + (current + 5) / 100 * container.offsetWidth);
    });

    // Click on container
    container.addEventListener('click', (e) => {
      if (e.target !== handle) updateSlider(e.clientX);
    });
  }

  // ---- Theme Toggle ----
  function setupThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const savedTheme = localStorage.getItem('sy-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    updateLogos(savedTheme);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sy-theme', next);
      updateThemeIcon(next);
      updateLogos(next);
    });

    function updateThemeIcon(theme) {
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    function updateLogos(theme) {
      const logoPath = theme === 'dark' ? 'assets/images/logo/logo-white.svg' : 'assets/images/logo/logo-full.svg'; 
      document.querySelectorAll('.header-logo img, .mobile-nav-header img').forEach(img => {
        img.src = logoPath;
      });
    }
  }

  // ---- Smooth Scroll ----
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Year ----
  function setYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
