const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const initLoginModal = (): void => {
  const modal = document.getElementById('login-modal');
  if (!modal) return;

  if (modal.getAttribute('data-initialized') === 'true') return;
  modal.setAttribute('data-initialized', 'true');

  const openButtons = document.querySelectorAll<HTMLButtonElement>('.header__action-link--account');
  const overlay = document.getElementById('modal-overlay');
  const closeButton = document.getElementById('modal-close');
  const form = document.getElementById('login-form') as HTMLFormElement | null;
  const emailInput = document.getElementById('login-email') as HTMLInputElement | null;
  const passwordInput = document.getElementById('login-password') as HTMLInputElement | null;
  const emailError = document.getElementById('error-login-email') as HTMLElement | null;
  const passwordError = document.getElementById('error-login-password') as HTMLElement | null;
  const success = document.getElementById('login-success') as HTMLElement | null;
  const togglePassword = document.getElementById('toggle-password') as HTMLButtonElement | null;

  if (!form || !emailInput || !passwordInput || !emailError || !passwordError || !success) return;

  const openModal = (): void => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    success.style.display = 'none';
    emailInput.focus();
  };

  const closeModal = (): void => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  };

  const showEmailError = (message: string): void => {
    emailError.textContent = message;
    emailInput.classList.add('is-error');
    emailInput.classList.remove('is-valid');
  };

  const showPasswordError = (message: string): void => {
    passwordError.textContent = message;
    passwordInput.classList.add('is-error');
    passwordInput.classList.remove('is-valid');
  };

  const clearEmailError = (): void => {
    emailError.textContent = '';
    emailInput.classList.remove('is-error');
    emailInput.classList.add('is-valid');
  };

  const clearPasswordError = (): void => {
    passwordError.textContent = '';
    passwordInput.classList.remove('is-error');
    passwordInput.classList.add('is-valid');
  };

  const validateEmail = (): boolean => {
    const value = emailInput.value.trim();
    if (!value) {
      showEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(value)) {
      showEmailError('Please enter a valid email address');
      return false;
    }
    clearEmailError();
    return true;
  };

  const validatePassword = (): boolean => {
    const value = passwordInput.value.trim();
    if (!value) {
      showPasswordError('Password is required');
      return false;
    }
    clearPasswordError();
    return true;
  };

  const resetFormState = (): void => {
    form.reset();
    emailError.textContent = '';
    passwordError.textContent = '';
    success.style.display = 'none';
    emailInput.classList.remove('is-error', 'is-valid');
    passwordInput.classList.remove('is-error', 'is-valid');

    if (togglePassword) {
      togglePassword.classList.remove('is-visible');
      togglePassword.setAttribute('aria-label', 'Show password');
    }
    passwordInput.type = 'password';
  };

  openButtons.forEach(button => {
    button.addEventListener('click', () => openModal());
  });

  overlay?.addEventListener('click', closeModal);
  closeButton?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  emailInput.addEventListener('input', validateEmail);
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('input', validatePassword);
  passwordInput.addEventListener('blur', validatePassword);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    success.style.display = 'none';

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) return;

    success.style.display = 'block';

    window.setTimeout(() => {
      closeModal();
      resetFormState();
    }, 1500);
  });

  togglePassword?.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    togglePassword.classList.toggle('is-visible', !isVisible);
    togglePassword.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
  });
};
