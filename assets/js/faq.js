/* ============================================
   S&Y TREE SERVICES - FAQ ACCORDION
   ============================================ */

const FAQManager = (() => {
  function init() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => toggleFAQ(btn));
    });
  }

  function toggleFAQ(btn) {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all others
    document.querySelectorAll('.faq-item.active').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('active');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        const answer = openItem.querySelector('.faq-answer');
        if (answer) answer.setAttribute('aria-hidden', 'true');
      }
    });

    // Toggle current
    item.classList.toggle('active', !isActive);
    btn.setAttribute('aria-expanded', !isActive);
    const answer = item.querySelector('.faq-answer');
    if (answer) answer.setAttribute('aria-hidden', isActive);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => FAQManager.init());
