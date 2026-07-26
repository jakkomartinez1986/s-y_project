/* ============================================
   S&Y TREE SERVICES - LANGUAGE SYSTEM
   EN/ES Bilingual via data-lang attribute
   ============================================ */

const LanguageManager = (() => {
  let currentLang = 'en';

  function init() {
    const saved = localStorage.getItem('sy-lang');
    if (saved && ['en', 'es'].includes(saved)) {
      currentLang = saved;
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'es') currentLang = 'es';
    }
    applyLanguage(currentLang);
    setupToggle();
  }

  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('sy-lang', lang);

    // Show/hide elements based on data-lang
    document.querySelectorAll('[data-lang]').forEach(el => {
      if (el.getAttribute('data-lang') === lang) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    // Update toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang-value') === lang);
    });
  }

  function setupToggle() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang-value');
        if (lang && lang !== currentLang) {
          applyLanguage(lang);
          // Dispatch event for other modules
          window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        }
      });
    });
  }

  function getLang() {
    return currentLang;
  }

  function t(enText, esText) {
    return currentLang === 'es' ? esText : enText;
  }

  return { init, getLang, t, applyLanguage };
})();

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => LanguageManager.init());
