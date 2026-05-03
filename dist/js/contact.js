import { updateCartCounter } from './utils/cartUtils.js';
import { initLoginModal } from './utils/modal.js';
// ================= BURGER MENU =================
const initBurgerMenu = () => {
    const header = document.querySelector('.header');
    const burgerButton = document.querySelector('.header__burger');
    const navigation = document.querySelector('#site-navigation');
    if (!header || !burgerButton || !navigation) {
        return;
    }
    const closeMenu = () => {
        header.classList.remove('header--menu-open');
        burgerButton.setAttribute('aria-expanded', 'false');
        burgerButton.setAttribute('aria-label', 'Open menu');
    };
    burgerButton.addEventListener('click', () => {
        const isOpen = header.classList.toggle('header--menu-open');
        burgerButton.setAttribute('aria-expanded', String(isOpen));
        burgerButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    navigation.addEventListener('click', event => {
        const target = event.target;
        if (target.closest('a')) {
            closeMenu();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
};
// ================= VALIDATION HELPERS =================
const isValidEmail = (str) => {
    if (str === null || str === undefined)
        return false;
    if (str.includes(' '))
        return false;
    const atMatches = str.match(/@/g);
    if (!atMatches || atMatches.length !== 1)
        return false;
    const domain = /^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
    const atIndex = str.indexOf('@');
    const local = str.slice(0, atIndex);
    const domainPart = str.slice(atIndex + 1);
    if (local.length === 0 || local.length > 64)
        return false;
    if (domainPart.length === 0 || domainPart.length > 253)
        return false;
    const localRegex = /^[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+(\.[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)*$/;
    return localRegex.test(local) && domain.test(domainPart);
};
const isNotEmpty = (val) => val.trim().length > 0;
// ================= FIELD VALIDATION =================
const validateField = (input, errorEl, type) => {
    const val = input.value;
    if (!isNotEmpty(val)) {
        showFieldError(input, errorEl, 'This field is required');
        return false;
    }
    if (type === 'email' && !isValidEmail(val)) {
        showFieldError(input, errorEl, 'Please enter a valid email address');
        return false;
    }
    clearFieldError(input, errorEl);
    return true;
};
const showFieldError = (input, errorEl, message) => {
    input.classList.remove('is-valid');
    input.classList.add('is-error');
    errorEl.textContent = message;
};
const clearFieldError = (input, errorEl) => {
    input.classList.remove('is-error');
    input.classList.add('is-valid');
    errorEl.textContent = '';
};
// ================= INIT FORM =================
const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form)
        return;
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const topicInput = document.getElementById('contact-topic');
    const messageInput = document.getElementById('contact-message');
    const errorName = document.getElementById('error-name');
    const errorEmail = document.getElementById('error-email');
    const errorTopic = document.getElementById('error-topic');
    const errorMessage = document.getElementById('error-message');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const hideFormErrorIfValid = () => {
        if (formError.style.display !== 'block')
            return;
        const allValid = isNotEmpty(nameInput.value) &&
            isValidEmail(emailInput.value) &&
            isNotEmpty(topicInput.value) &&
            isNotEmpty(messageInput.value);
        if (allValid) {
            formError.style.display = 'none';
        }
    };
    // ---- real-time validation ----
    nameInput.addEventListener('input', () => {
        validateField(nameInput, errorName, 'text');
        hideFormErrorIfValid();
    });
    emailInput.addEventListener('input', () => {
        validateField(emailInput, errorEmail, 'email');
        hideFormErrorIfValid();
    });
    topicInput.addEventListener('input', () => {
        validateField(topicInput, errorTopic, 'text');
        hideFormErrorIfValid();
    });
    messageInput.addEventListener('input', () => {
        validateField(messageInput, errorMessage, 'text');
        hideFormErrorIfValid();
    });
    // ---- blur validation (показувати помилку при виході з поля) ----
    nameInput.addEventListener('blur', () => {
        validateField(nameInput, errorName, 'text');
        hideFormErrorIfValid();
    });
    emailInput.addEventListener('blur', () => {
        validateField(emailInput, errorEmail, 'email');
        hideFormErrorIfValid();
    });
    topicInput.addEventListener('blur', () => {
        validateField(topicInput, errorTopic, 'text');
        hideFormErrorIfValid();
    });
    messageInput.addEventListener('blur', () => {
        validateField(messageInput, errorMessage, 'text');
        hideFormErrorIfValid();
    });
    // ---- submit ----
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // приховати попередні повідомлення
        formSuccess.style.display = 'none';
        formError.style.display = 'none';
        // валідуємо всі поля
        const isNameValid = validateField(nameInput, errorName, 'text');
        const isEmailValid = validateField(emailInput, errorEmail, 'email');
        const isTopicValid = validateField(topicInput, errorTopic, 'text');
        const isMessageValid = validateField(messageInput, errorMessage, 'text');
        if (!isNameValid || !isEmailValid || !isTopicValid || !isMessageValid) {
            formError.style.display = 'block';
            // фокус на перше поле з помилкою
            if (!isNameValid)
                nameInput.focus();
            else if (!isEmailValid)
                emailInput.focus();
            else if (!isTopicValid)
                topicInput.focus();
            else
                messageInput.focus();
            return;
        }
        // симулюємо відправку (без реального запиту)
        const submitBtn = form.querySelector('.contact-form__submit');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        setTimeout(() => {
            // success
            formSuccess.style.display = 'block';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            // скидаємо форму
            form.reset();
            [nameInput, emailInput, topicInput, messageInput].forEach(el => {
                el.classList.remove('is-valid', 'is-error');
            });
            [errorName, errorEmail, errorTopic, errorMessage].forEach(el => {
                el.textContent = '';
            });
            submitBtn.textContent = 'Send';
            submitBtn.disabled = false;
        }, 800);
    });
};
// ================= BOOTSTRAP =================
updateCartCounter();
initBurgerMenu();
initContactForm();
initLoginModal();
