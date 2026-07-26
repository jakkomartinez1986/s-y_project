/* ============================================
   S&Y TREE SERVICES - CONTACT FORM + FILE UPLOAD
   ============================================ */

const ContactManager = (() => {
  function init() {
    setupContactForm();
    setupModalForm();
    setupHeroEstimateForm();
    setupFileUpload();
  }

  function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        sendByEmail(form, 'formSuccess');
      }
    });

    // Live validation clear
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errorEl = document.getElementById(field.name + 'Error') || field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  function setupModalForm() {
    const form = document.getElementById('modalForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        sendByEmail(form, null, 'estimateModal');
      }
    });
  }

  function validateForm(form) {
    let valid = true;
    const lang = typeof LanguageManager !== 'undefined' ? LanguageManager.getLang() : 'en';

    const messages = {
      en: { required: 'This field is required', invalid: 'Please enter a valid value', phone: 'Please enter a valid phone number' },
      es: { required: 'Este campo es obligatorio', invalid: 'Por favor ingresa un valor valido', phone: 'Por favor ingresa un numero de telefono valido' }
    };

    const fields = form.querySelectorAll('[required]');
    fields.forEach(field => {
      const value = field.value.trim();
      let error = '';

      if (!value) {
        error = messages[lang].required;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = messages[lang].invalid;
      } else if (field.type === 'tel' && value.replace(/\D/g, '').length < 10) {
        error = messages[lang].phone;
      }

      if (error) {
        valid = false;
        field.classList.add('error');
        const errorEl = document.getElementById(field.name + 'Error') || field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = error;
      }
    });

    return valid;
  }

  function sendByEmail(form, successId, modalId) {
    const lang = typeof LanguageManager !== 'undefined' ? LanguageManager.getLang() : 'en';
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    const labels = {
      en: { name: 'Name', phone: 'Phone', email: 'Email', city: 'City', service: 'Service', message: 'Message', subject: 'New Estimate Request - S&Y Tree Services', sending: 'Sending...', thankYou: 'Thank you! Your email client will open to send the request.', error: 'Could not open email client. Please call us at (651) 286-9103.' },
      es: { name: 'Nombre', phone: 'Telefono', email: 'Correo', city: 'Ciudad', service: 'Servicio', message: 'Mensaje', subject: 'Nueva Solicitud de Presupuesto - S&Y Tree Services', sending: 'Enviando...', thankYou: 'Gracias! Tu cliente de correo se abrira para enviar la solicitud.', error: 'No se pudo abrir el cliente de correo. Por favor llamanos al (651) 286-9103.' }
    };
    const t = labels[lang];

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ' + t.sending;

    setTimeout(() => {
      const formData = new FormData(form);
      let body = '';
      body += t.name + ': ' + (formData.get('name') || '') + '\n';
      body += t.phone + ': ' + (formData.get('phone') || '') + '\n';
      body += t.email + ': ' + (formData.get('email') || '') + '\n';
      body += t.city + ': ' + (formData.get('city') || 'N/A') + '\n';
      body += t.service + ': ' + (formData.get('service') || '') + '\n';
      body += t.message + ':\n' + (formData.get('message') || '') + '\n';

      const subject = encodeURIComponent(t.subject);
      const bodyEncoded = encodeURIComponent(body);
      const mailtoUrl = 'mailto:info@sytreeservices.com?subject=' + subject + '&body=' + bodyEncoded;

      try {
        window.location.href = mailtoUrl;

        if (successId) {
          form.style.display = 'none';
          document.getElementById(successId).classList.add('active');
        }
        if (modalId) {
          closeModal(modalId);
        }
        form.reset();
      } catch (err) {
        alert(t.error);
      }

      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }, 800);
  }

  function setupFileUpload() {
    const fileInput = document.getElementById('contactFiles');
    const preview = document.getElementById('filePreview');
    const uploadArea = document.querySelector('.file-upload');
    if (!fileInput || !preview || !uploadArea) return;

    // Drag & drop
    ['dragenter', 'dragover'].forEach(evt => {
      uploadArea.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      uploadArea.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
      });
    });

    uploadArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      handleFiles(files, preview);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files, preview);
    });
  }

  function handleFiles(files, preview) {
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const lang = typeof LanguageManager !== 'undefined' ? LanguageManager.getLang() : 'en';
    const errorEl = document.getElementById('fileError');

    Array.from(files).slice(0, maxFiles).forEach(file => {
      if (!allowedTypes.includes(file.type)) return;
      if (file.size > maxSize) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const item = document.createElement('div');
        item.className = 'file-preview-item scale-in';
        item.innerHTML = `<img src="${e.target.result}" alt="Upload preview"><button class="file-preview-remove" aria-label="Remove file"><i class="fas fa-times"></i></button>`;
        item.querySelector('.file-preview-remove').addEventListener('click', () => item.remove());
        preview.appendChild(item);
      };
      reader.readAsDataURL(file);
    });
  }

  function setupHeroEstimateForm() {
    const form = document.getElementById('heroEstimateForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const lang = typeof LanguageManager !== 'undefined' ? LanguageManager.getLang() : 'en';
      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      const labels = {
        en: { name: 'Name', phone: 'Phone', service: 'Service', subject: 'New Estimate Request - S&Y Tree Services', sending: 'Sending...' },
        es: { name: 'Nombre', phone: 'Telefono', service: 'Servicio', subject: 'Nueva Solicitud de Presupuesto - S&Y Tree Services', sending: 'Enviando...' }
      };
      const t = labels[lang];

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ' + t.sending;

      setTimeout(() => {
        const formData = new FormData(form);
        let body = '';
        body += t.name + ': ' + (formData.get('name') || '') + '\n';
        body += t.phone + ': ' + (formData.get('phone') || '') + '\n';
        body += t.service + ': ' + (formData.get('service') || '') + '\n';

        const subject = encodeURIComponent(t.subject);
        const bodyEncoded = encodeURIComponent(body);
        window.location.href = 'mailto:info@sytreeservices.com?subject=' + subject + '&body=' + bodyEncoded;

        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }, 800);
    });
  }

  return { init };
})();

// Global modal functions
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }
}

document.addEventListener('DOMContentLoaded', () => ContactManager.init());
