const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const initLoginModal = () => {
    const modal = document.getElementById('login-modal');
    if (!modal)
        return;
    if (modal.getAttribute('data-initialized') === 'true')
        return;
    modal.setAttribute('data-initialized', 'true');
    const openButtons = document.querySelectorAll('.header__action-link--account');
    const overlay = document.getElementById('modal-overlay');
    const closeButton = document.getElementById('modal-close');
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const emailError = document.getElementById('error-login-email');
    const passwordError = document.getElementById('error-login-password');
    const success = document.getElementById('login-success');
    const togglePassword = document.getElementById('toggle-password');
    if (!form || !emailInput || !passwordInput || !emailError || !passwordError || !success)
        return;
    const openModal = () => {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
        success.style.display = 'none';
        emailInput.focus();
    };
    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    };
    const showEmailError = (message) => {
        emailError.textContent = message;
        emailInput.classList.add('is-error');
        emailInput.classList.remove('is-valid');
    };
    const showPasswordError = (message) => {
        passwordError.textContent = message;
        passwordInput.classList.add('is-error');
        passwordInput.classList.remove('is-valid');
    };
    const clearEmailError = () => {
        emailError.textContent = '';
        emailInput.classList.remove('is-error');
        emailInput.classList.add('is-valid');
    };
    const clearPasswordError = () => {
        passwordError.textContent = '';
        passwordInput.classList.remove('is-error');
        passwordInput.classList.add('is-valid');
    };
    const validateEmail = () => {
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
    const validatePassword = () => {
        const value = passwordInput.value.trim();
        if (!value) {
            showPasswordError('Password is required');
            return false;
        }
        clearPasswordError();
        return true;
    };
    const resetFormState = () => {
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
        if (event.key === 'Escape')
            closeModal();
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
        if (!isEmailValid || !isPasswordValid)
            return;
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
