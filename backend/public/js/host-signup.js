/* ========================================
   HOST SIGNUP FORM - JAVASCRIPT
   ======================================== */

class HostSignupForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.formData = this.loadFormData() || {
      fullName: '',
      cpf: '',
      email: '',
      phone: '',
      document: null,
      selfie: null,
      emailCode: '',
      phoneCode: '',
      emailVerified: false,
      phoneVerified: false,
      paymentMethod: '',
      pixKey: '',
      pixKeyType: '',
      bank: '',
      accountType: '',
      agency: '',
      accountNumber: '',
      accountHolder: ''
    };

    this.form = document.getElementById('signupForm');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showStep(this.currentStep);
  }

  setupEventListeners() {
    // Step Navigation
    this.nextBtn.addEventListener('click', (e) => this.handleNext(e));
    this.prevBtn.addEventListener('click', (e) => this.handlePrev(e));

    // Step 1: Personal Data
    document.getElementById('fullName')?.addEventListener('input', (e) => {
      this.formData.fullName = e.target.value;
      this.clearError('fullName');
      this.saveFormData();
    });

    document.getElementById('cpf')?.addEventListener('input', (e) => {
      e.target.value = this.formatCPF(e.target.value);
      this.formData.cpf = e.target.value;
      this.clearError('cpf');
      this.saveFormData();
    });

    document.getElementById('email')?.addEventListener('input', (e) => {
      this.formData.email = e.target.value;
      this.clearError('email');
      this.saveFormData();
    });

    document.getElementById('phone')?.addEventListener('input', (e) => {
      e.target.value = this.formatPhone(e.target.value);
      this.formData.phone = e.target.value;
      this.clearError('phone');
      this.saveFormData();
    });

    // Step 2: Documents
    document.getElementById('document')?.addEventListener('change', (e) => {
      this.handleFileUpload(e, 'document');
    });

    document.getElementById('selfie')?.addEventListener('change', (e) => {
      this.handleFileUpload(e, 'selfie');
    });

    // Make upload areas clickable and support drag & drop
    document.querySelectorAll('.file-upload').forEach((fu) => {
      const input = fu.querySelector('input[type="file"]');
      const area = fu.querySelector('.upload-area');
      if (!input || !area) return;

      // Forward click to the hidden input
      area.addEventListener('click', () => input.click());

      // Visual feedback for drag
      area.addEventListener('dragover', (ev) => { ev.preventDefault(); area.classList.add('dragover'); });
      area.addEventListener('dragleave', () => { area.classList.remove('dragover'); });

      area.addEventListener('drop', (ev) => {
        ev.preventDefault();
        area.classList.remove('dragover');
        const files = ev.dataTransfer && ev.dataTransfer.files;
        if (files && files.length) {
          // Call existing handler directly
          const type = input.id || '';
          this.handleFileUpload({ target: { files: files } }, type);
        }
      });
    });

    // Step 3: Confirmations
    document.getElementById('verifyEmailBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.verifyEmail();
    });

    document.getElementById('verifyPhoneBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.verifyPhone();
    });

    document.getElementById('resendEmailBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.resendEmail();
    });

    document.getElementById('resendPhoneBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.resendPhone();
    });

    document.getElementById('emailCode')?.addEventListener('input', (e) => {
      this.formData.emailCode = e.target.value;
      this.clearError('emailCode');
    });

    document.getElementById('phoneCode')?.addEventListener('input', (e) => {
      this.formData.phoneCode = e.target.value;
      this.clearError('phoneCode');
    });

    // Step 4: Payment Method
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.formData.paymentMethod = e.target.value;
        this.togglePaymentFields(e.target.value);
        this.saveFormData();
      });
    });

    // Step 4: Pix Fields
    document.getElementById('pixKey')?.addEventListener('input', (e) => {
      this.formData.pixKey = e.target.value;
      this.clearError('pixKey');
      this.saveFormData();
    });

    document.getElementById('pixKeyType')?.addEventListener('change', (e) => {
      this.formData.pixKeyType = e.target.value;
      this.clearError('pixKeyType');
      this.saveFormData();
    });

    // Step 4: Bank Fields
    document.getElementById('bank')?.addEventListener('input', (e) => {
      this.formData.bank = e.target.value;
      this.clearError('bank');
      this.saveFormData();
    });

    document.getElementById('accountType')?.addEventListener('change', (e) => {
      this.formData.accountType = e.target.value;
      this.clearError('accountType');
      this.saveFormData();
    });

    document.getElementById('agency')?.addEventListener('input', (e) => {
      this.formData.agency = e.target.value;
      this.clearError('agency');
      this.saveFormData();
    });

    document.getElementById('accountNumber')?.addEventListener('input', (e) => {
      this.formData.accountNumber = e.target.value;
      this.clearError('accountNumber');
      this.saveFormData();
    });

    document.getElementById('accountHolder')?.addEventListener('input', (e) => {
      this.formData.accountHolder = e.target.value;
      this.clearError('accountHolder');
      this.saveFormData();
    });
  }

  handleNext(e) {
    e.preventDefault();

    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.showStep(this.currentStep);
        this.saveFormData();
        window.scrollTo(0, 0);
      } else if (this.currentStep === this.totalSteps) {
        this.submitForm();
      }
    }
  }

  handlePrev(e) {
    e.preventDefault();

    if (this.currentStep > 1) {
      this.currentStep--;
      this.showStep(this.currentStep);
      window.scrollTo(0, 0);
    }
  }

  showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach((el) => {
      el.classList.remove('active');
    });

    // Show current step
    const currentFormStep = document.getElementById(`form-step-${step}`);
    if (currentFormStep) {
      currentFormStep.classList.add('active');
    }

    // Update progress
    this.updateProgress(step);
    this.updateButtons(step);

    // Step 3: Populate confirmation data
    if (step === 3) {
      this.populateConfirmationData();
    }
  }

  updateProgress(step) {
    // Update progress text
    document.getElementById('progressText').textContent = `Etapa ${step} de ${this.totalSteps}`;

    // Update progress bar
    const percentage = (step / this.totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${percentage}%`;

    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
      const stepNum = index + 1;
      stepEl.classList.remove('active', 'completed');

      if (stepNum === step) {
        stepEl.classList.add('active');
      } else if (stepNum < step) {
        stepEl.classList.add('completed');
      }
    });
  }

  updateButtons(step) {
    // Show/hide prev button
    if (step === 1) {
      this.prevBtn.style.display = 'none';
      this.nextBtn.textContent = 'Próximo ';
      this.nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
    } else if (step === this.totalSteps) {
      this.prevBtn.style.display = 'flex';
      this.nextBtn.textContent = 'Concluir Cadastro';
      this.nextBtn.innerHTML = 'Concluir Cadastro <i class="fas fa-check"></i>';
    } else {
      this.prevBtn.style.display = 'flex';
      this.nextBtn.textContent = 'Próximo ';
      this.nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
    }
  }

  validateStep(step) {
    let isValid = true;

    if (step === 1) {
      isValid = this.validatePersonalData() && isValid;
    } else if (step === 2) {
      isValid = this.validateDocuments() && isValid;
    } else if (step === 3) {
      isValid = this.validateConfirmation() && isValid;
    } else if (step === 4) {
      isValid = this.validatePayment() && isValid;
    }

    return isValid;
  }

  validatePersonalData() {
    let isValid = true;

    // Name validation
    const fullName = document.getElementById('fullName').value.trim();
    if (fullName.length < 5) {
      this.showError('fullName', 'Nome deve ter no mínimo 5 caracteres');
      isValid = false;
    }

    // CPF validation
    const cpf = document.getElementById('cpf').value.trim();
    if (!this.isValidCPF(cpf)) {
      this.showError('cpf', 'CPF inválido');
      isValid = false;
    }

    // Email validation
    const email = document.getElementById('email').value.trim();
    if (!this.isValidEmail(email)) {
      this.showError('email', 'E-mail inválido');
      isValid = false;
    }

    // Phone validation
    const phone = document.getElementById('phone').value.trim();
    if (!this.isValidPhone(phone)) {
      this.showError('phone', 'Telefone inválido');
      isValid = false;
    }

    return isValid;
  }

  validateDocuments() {
    let isValid = true;

    const documentInput = document.getElementById('document');
    const selfieInput = document.getElementById('selfie');

    // Document validation
    if (!documentInput.files.length) {
      this.showError('document', 'Selecione um documento');
      isValid = false;
    } else if (!this.isValidFile(documentInput.files[0])) {
      this.showError('document', 'Arquivo inválido (PNG ou JPG, até 5MB)');
      isValid = false;
    }

    // Selfie validation
    if (!selfieInput.files.length) {
      this.showError('selfie', 'Selecione uma selfie');
      isValid = false;
    } else if (!this.isValidFile(selfieInput.files[0])) {
      this.showError('selfie', 'Arquivo inválido (PNG ou JPG, até 5MB)');
      isValid = false;
    }

    return isValid;
  }

  validateConfirmation() {
    let isValid = true;

    // Email code validation
    const emailCode = document.getElementById('emailCode').value.trim();
    if (emailCode.length !== 6 || !this.isNumeric(emailCode)) {
      this.showError('emailCode', 'Código deve ter 6 dígitos');
      isValid = false;
    } else if (!this.formData.emailVerified) {
      this.showError('emailCode', 'E-mail não verificado');
      isValid = false;
    }

    // Phone code validation
    const phoneCode = document.getElementById('phoneCode').value.trim();
    if (phoneCode.length !== 6 || !this.isNumeric(phoneCode)) {
      this.showError('phoneCode', 'Código deve ter 6 dígitos');
      isValid = false;
    } else if (!this.formData.phoneVerified) {
      this.showError('phoneCode', 'Telefone não verificado');
      isValid = false;
    }

    return isValid;
  }

  validatePayment() {
    let isValid = true;

    const paymentMethod = this.formData.paymentMethod;

    if (!paymentMethod) {
      this.showError('payment', 'Selecione uma forma de recebimento');
      return false;
    }

    if (paymentMethod === 'pix') {
      const pixKey = document.getElementById('pixKey').value.trim();
      const pixKeyType = document.getElementById('pixKeyType').value;

      if (!pixKey) {
        this.showError('pixKey', 'Chave Pix é obrigatória');
        isValid = false;
      }

      if (!pixKeyType) {
        this.showError('pixKeyType', 'Tipo de chave é obrigatório');
        isValid = false;
      }
    } else if (paymentMethod === 'bank') {
      const bank = document.getElementById('bank').value.trim();
      const accountType = document.getElementById('accountType').value;
      const agency = document.getElementById('agency').value.trim();
      const accountNumber = document.getElementById('accountNumber').value.trim();
      const accountHolder = document.getElementById('accountHolder').value.trim();

      if (!bank) {
        this.showError('bank', 'Banco é obrigatório');
        isValid = false;
      }

      if (!accountType) {
        this.showError('accountType', 'Tipo de conta é obrigatório');
        isValid = false;
      }

      if (!agency || agency.length < 4) {
        this.showError('agency', 'Agência inválida');
        isValid = false;
      }

      if (!accountNumber || accountNumber.length < 6) {
        this.showError('accountNumber', 'Número de conta inválido');
        isValid = false;
      }

      if (!accountHolder || accountHolder.length < 5) {
        this.showError('accountHolder', 'Nome do titular inválido');
        isValid = false;
      }
    }

    return isValid;
  }

  submitForm() {
    // Save all data
    this.saveFormData();

    // Simulate submission to backend
    console.log('Dados do formulário:', this.formData);

    // Show success message and move to status page
    this.showStep(5);
    this.updateButtons(5);

    // Clear localStorage after successful submission
    // localStorage.removeItem('hostSignupFormData');
  }

  handleFileUpload(e, type) {
    const file = e.target.files[0];
    const fileNameEl = document.getElementById(`${type}-name`);
    const errorEl = document.getElementById(`error-${type}`);

    if (file) {
      if (this.isValidFile(file)) {
        this.formData[type] = {
          name: file.name,
          size: file.size,
          type: file.type
        };
        fileNameEl.textContent = file.name;
        errorEl.textContent = '';
        this.saveFormData();
      } else {
        this.showError(type, 'Arquivo inválido');
        e.target.value = '';
      }
    }
  }

  togglePaymentFields(method) {
    const pixFields = document.getElementById('pixFields');
    const bankFields = document.getElementById('bankFields');

    if (method === 'pix') {
      pixFields.style.display = 'grid';
      bankFields.style.display = 'none';
    } else if (method === 'bank') {
      pixFields.style.display = 'none';
      bankFields.style.display = 'grid';
    } else {
      pixFields.style.display = 'none';
      bankFields.style.display = 'none';
    }
  }

  populateConfirmationData() {
    document.getElementById('confirmEmail').textContent = this.formData.email || 'não fornecido';
    document.getElementById('confirmPhone').textContent = this.formData.phone || 'não fornecido';
  }

  verifyEmail() {
    const emailCode = document.getElementById('emailCode').value.trim();

    if (emailCode.length !== 6 || !this.isNumeric(emailCode)) {
      this.showError('emailCode', 'Código deve ter 6 dígitos');
      return;
    }

    // Simulate verification
    // In production, this would call an API endpoint
    const codeEl = document.getElementById('emailCode');
    codeEl.disabled = true;
    const verifyBtn = document.getElementById('verifyEmailBtn');
    const originalText = verifyBtn.textContent;
    verifyBtn.textContent = 'Verificando...';
    verifyBtn.disabled = true;

    setTimeout(() => {
      this.formData.emailVerified = true;
      this.saveFormData();
      codeEl.disabled = true;
      codeEl.classList.add('success');
      verifyBtn.textContent = '✓ E-mail Verificado';
      verifyBtn.classList.add('success');
      verifyBtn.disabled = true;
      this.clearError('emailCode');
    }, 1500);
  }

  verifyPhone() {
    const phoneCode = document.getElementById('phoneCode').value.trim();

    if (phoneCode.length !== 6 || !this.isNumeric(phoneCode)) {
      this.showError('phoneCode', 'Código deve ter 6 dígitos');
      return;
    }

    // Simulate verification
    const codeEl = document.getElementById('phoneCode');
    codeEl.disabled = true;
    const verifyBtn = document.getElementById('verifyPhoneBtn');
    verifyBtn.textContent = 'Verificando...';
    verifyBtn.disabled = true;

    setTimeout(() => {
      this.formData.phoneVerified = true;
      this.saveFormData();
      codeEl.disabled = true;
      codeEl.classList.add('success');
      verifyBtn.textContent = '✓ Telefone Verificado';
      verifyBtn.classList.add('success');
      verifyBtn.disabled = true;
      this.clearError('phoneCode');
    }, 1500);
  }

  resendEmail() {
    alert('Código reenviado para ' + this.formData.email);
    // Reset code field
    document.getElementById('emailCode').value = '';
  }

  resendPhone() {
    alert('Código reenviado para ' + this.formData.phone);
    // Reset code field
    document.getElementById('phoneCode').value = '';
  }

  showError(fieldName, message) {
    const errorEl = document.getElementById(`error-${fieldName}`);
    const inputEl = document.querySelector(`[name="${fieldName}"], #${fieldName}`);

    if (errorEl) {
      errorEl.textContent = message;
    }

    if (inputEl) {
      inputEl.classList.add('error');
    }
  }

  clearError(fieldName) {
    const errorEl = document.getElementById(`error-${fieldName}`);
    const inputEl = document.querySelector(`[name="${fieldName}"], #${fieldName}`);

    if (errorEl) {
      errorEl.textContent = '';
    }

    if (inputEl) {
      inputEl.classList.remove('error');
    }
  }

  // Utility Functions
  formatCPF(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
    return value;
  }

  formatPhone(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value;
  }

  isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Basic CPF validation (simplified)
    return cpf.length === 11;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    phone = phone.replace(/\D/g, '');
    return phone.length >= 10;
  }

  isValidFile(file) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  isNumeric(value) {
    return /^\d+$/.test(value);
  }

  saveFormData() {
    localStorage.setItem('hostSignupFormData', JSON.stringify(this.formData));
  }

  loadFormData() {
    const data = localStorage.getItem('hostSignupFormData');
    return data ? JSON.parse(data) : null;
  }
}

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new HostSignupForm();
});
