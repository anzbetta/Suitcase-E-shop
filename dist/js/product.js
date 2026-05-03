import { addToCart, updateCartCounter } from './utils/cartUtils.js';
import Slider from './home.js';
import { initLoginModal } from './utils/modal.js';
const getProductIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};
const fallbackImages = [
    '../assets/arrival/1.jpg',
    '../assets/arrival/2.jpg',
    '../assets/arrival/3.jpg',
    '../assets/arrival/4.jpg',
];
const resolveImageUrl = (imageUrl, index) => {
    if (imageUrl && !imageUrl.startsWith('path/to/'))
        return imageUrl;
    return fallbackImages[index % fallbackImages.length];
};
const renderStars = (rating) => {
    const full = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) => `
    <svg viewBox="0 0 24 24" fill="${i < full ? '#B92770' : 'none'}" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="#B92770" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `).join('');
};
const getThumbImages = (imageUrl) => {
    return [
        imageUrl,
        imageUrl,
        imageUrl,
        imageUrl,
    ];
};
let currentProductIndex = 0;
let currentProductName = '';
const renderProduct = (product) => {
    currentProductName = product.name;
    const titleEl = document.getElementById('product-title');
    if (titleEl)
        titleEl.textContent = product.name;
    const starsEl = document.getElementById('product-stars');
    if (starsEl)
        starsEl.innerHTML = renderStars(product.rating);
    const reviewsEl = document.getElementById('product-reviews');
    if (reviewsEl)
        reviewsEl.textContent = `| ${Math.floor(Math.random() * 50 + 5)} Clients Rewied`;
    const priceEl = document.getElementById('product-price');
    if (priceEl)
        priceEl.textContent = `$${product.price}`;
    const descEl = document.getElementById('product-description');
    if (descEl) {
        descEl.innerHTML = `
      <p>The new ${product.name} is a bold reimagining of travel essentials, designed to elevate every journey. Made with at least 30% recycled materials, its lightweight yet impact-resistant shell combines eco-conscious innovation with rugged durability.</p>
      <p>The ergonomic handle and GlideMotion spinner wheels ensure effortless mobility while making a statement in sleek design. Inside, the modular compartments and adjustable straps keep your belongings secure and neatly organised, no matter the destination.</p>
    `;
    }
    const tabDetailsEl = document.getElementById('tab-details-text');
    if (tabDetailsEl) {
        tabDetailsEl.innerHTML = `
      Vestibulum commodo sapien non elit porttitor, vitae volutpat nibh mollis. Nulla porta risus id neque tempor, in efficitur justo imperdiet. Etiam a ex at ante tincidunt imperdiet. Nunc congue ex vel nisl viverra, sit amet aliquet lectus ullamcorper. Praesent luctus lacus non lorem elementum, eu tristique sapien suscipit.<br><br>
      Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti. Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam. Proin iaculis nibh vitae lectus mollis bibendum.
    `;
    }
    const sizeSelect = document.getElementById('product-size');
    if (sizeSelect && product.size) {
        product.size.split(',').map(s => s.trim()).forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            sizeSelect.appendChild(opt);
        });
        sizeSelect.value = product.size.split(',')[0].trim();
    }
    const colorSelect = document.getElementById('product-color');
    if (colorSelect && product.color) {
        const opt = document.createElement('option');
        opt.value = product.color;
        opt.textContent = product.color.charAt(0).toUpperCase() + product.color.slice(1);
        colorSelect.appendChild(opt);
        colorSelect.value = product.color;
    }
    const categorySelect = document.getElementById('product-category');
    if (categorySelect && product.category) {
        const opt = document.createElement('option');
        opt.value = product.category;
        opt.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        categorySelect.appendChild(opt);
        categorySelect.value = product.category;
    }
    const mainImg = document.getElementById('product-main-img');
    const thumbsEl = document.getElementById('product-thumbs');
    const resolvedImageUrl = resolveImageUrl(product.imageUrl, currentProductIndex);
    const thumbs = getThumbImages(resolvedImageUrl);
    if (mainImg) {
        mainImg.src = resolvedImageUrl;
        mainImg.alt = product.name;
    }
    if (thumbsEl) {
        thumbsEl.innerHTML = thumbs.map((src, i) => `
      <div class="product__thumb${i === 0 ? ' is-active' : ''}" data-src="${src}">
        <img src="${src}" alt="${product.name}">
      </div>
    `).join('');
        thumbsEl.addEventListener('click', (e) => {
            const thumb = e.target.closest('.product__thumb');
            if (!thumb)
                return;
            const src = thumb.dataset.src;
            if (!src || !mainImg)
                return;
            mainImg.src = src;
            thumbsEl.querySelectorAll('.product__thumb').forEach(t => t.classList.remove('is-active'));
            thumb.classList.add('is-active');
        });
    }
    let qty = 1;
    const qtyVal = document.getElementById('qty-val');
    const qtyDec = document.getElementById('qty-dec');
    const qtyInc = document.getElementById('qty-inc');
    qtyDec?.addEventListener('click', () => {
        if (qty > 1) {
            qty--;
            if (qtyVal)
                qtyVal.textContent = String(qty);
        }
    });
    qtyInc?.addEventListener('click', () => {
        qty++;
        if (qtyVal)
            qtyVal.textContent = String(qty);
    });
    const addBtn = document.getElementById('product-add-btn');
    addBtn?.addEventListener('click', () => {
        const selectedSize = sizeSelect?.value || product.size;
        const selectedColor = colorSelect?.value || product.color;
        for (let i = 0; i < qty; i++) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: resolvedImageUrl,
                size: selectedSize,
                color: selectedColor,
            });
        }
        addBtn.textContent = 'Added ✓';
        addBtn.classList.add('is-added');
        setTimeout(() => {
            addBtn.textContent = 'Add To Cart';
            addBtn.classList.remove('is-added');
        }, 1500);
    });
};
const getSimilarProducts = (products, current) => {
    return products
        .filter(product => product.id !== current.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
};
const renderYouMayAlsoLike = (similar) => {
    const track = document.getElementById('you-may-also-like-track');
    if (!track)
        return;
    track.innerHTML = similar.map((product, index) => `
    <div class="arrival-card arrival-slider__slide" data-slider-slide>
      <div class="arrival-card__image">
        ${product.salesStatus ? '<span class="arrival-card__badge">Sale</span>' : ''}
        <img src="${resolveImageUrl(product.imageUrl, index)}" alt="${product.name}">
      </div>
      <div class="arrival-card__body">
        <h3 class="arrival-card__title">${product.name}</h3>
        <p class="arrival-card__price">$${product.price}</p>
        <a href="./product-details.html?id=${product.id}" class="arrival-card__btn">View Product</a>
      </div>
    </div>
  `).join('');
};
const initTabs = () => {
    const tabBtns = document.querySelectorAll('.product__tab-btn');
    const tabContents = document.querySelectorAll('.product__tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('is-active'));
            tabContents.forEach(c => c.classList.remove('is-active'));
            btn.classList.add('is-active');
            document.getElementById(`tab-${tab}`)?.classList.add('is-active');
        });
    });
};
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
const initProductPage = async () => {
    updateCartCounter();
    initBurgerMenu();
    initTabs();
    const id = getProductIdFromUrl();
    if (!id) {
        document.querySelector('.product').innerHTML =
            '<div class="container"><p style="padding:60px 0;text-align:center;color:#888;">Product not found.</p></div>';
        return;
    }
    try {
        const response = await fetch('../assets/data.json');
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const rawData = await response.json();
        const products = rawData.data;
        currentProductIndex = products.findIndex(p => p.id === id);
        const product = products[currentProductIndex];
        if (!product) {
            document.querySelector('.product').innerHTML =
                '<div class="container"><p style="padding:60px 0;text-align:center;color:#888;">Product not found.</p></div>';
            return;
        }
        renderProduct(product);
        const similar = getSimilarProducts(products, product);
        renderYouMayAlsoLike(similar);
        const youMayAlsoLikeRoot = document.querySelector('.you-may-also-like[data-slider]');
        if (youMayAlsoLikeRoot)
            new Slider(youMayAlsoLikeRoot);
    }
    catch (e) {
        console.error('Failed to load product:', e);
    }
};
const initStarRating = () => {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = Number(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('is-hover', Number(s.dataset.value) <= val);
            });
        });
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('is-hover'));
        });
        star.addEventListener('click', () => {
            selectedRating = Number(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('is-active', Number(s.dataset.value) <= selectedRating);
                s.textContent = Number(s.dataset.value) <= selectedRating ? '★' : '☆';
            });
        });
    });
};
const isValidReviewEmail = (str) => {
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
const isReviewNotEmpty = (val) => val.trim().length > 0;
const showReviewFieldError = (input, errorEl, message) => {
    input.classList.remove('is-valid');
    input.classList.add('is-error');
    errorEl.textContent = message;
};
const clearReviewFieldError = (input, errorEl) => {
    input.classList.remove('is-error');
    input.classList.add('is-valid');
    errorEl.textContent = '';
};
const validateReviewField = (input, errorEl, type) => {
    const val = input.value;
    if (!isReviewNotEmpty(val)) {
        showReviewFieldError(input, errorEl, 'This field is required');
        return false;
    }
    if (type === 'email' && !isValidReviewEmail(val)) {
        showReviewFieldError(input, errorEl, 'Please enter a valid email address');
        return false;
    }
    clearReviewFieldError(input, errorEl);
    return true;
};
const initReviewForm = () => {
    const form = document.getElementById('review-form');
    if (!form)
        return;
    const nameInput = document.getElementById('review-name');
    const emailInput = document.getElementById('review-email');
    const textInput = document.getElementById('review-text');
    const success = document.getElementById('review-success');
    const errorName = document.getElementById('error-review-name');
    const errorEmail = document.getElementById('error-review-email');
    const errorText = document.getElementById('error-review-text');
    if (!nameInput || !emailInput || !textInput || !success || !errorName || !errorEmail || !errorText) {
        return;
    }
    nameInput.addEventListener('input', () => validateReviewField(nameInput, errorName, 'text'));
    emailInput.addEventListener('input', () => validateReviewField(emailInput, errorEmail, 'email'));
    textInput.addEventListener('input', () => validateReviewField(textInput, errorText, 'text'));
    nameInput.addEventListener('blur', () => validateReviewField(nameInput, errorName, 'text'));
    emailInput.addEventListener('blur', () => validateReviewField(emailInput, errorEmail, 'email'));
    textInput.addEventListener('blur', () => validateReviewField(textInput, errorText, 'text'));
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        success.style.display = 'none';
        const isNameValid = validateReviewField(nameInput, errorName, 'text');
        const isEmailValid = validateReviewField(emailInput, errorEmail, 'email');
        const isTextValid = validateReviewField(textInput, errorText, 'text');
        if (!isNameValid || !isEmailValid || !isTextValid) {
            if (!isNameValid)
                nameInput.focus();
            else if (!isEmailValid)
                emailInput.focus();
            else
                textInput.focus();
            return;
        }
        success.style.display = 'block';
        form.reset();
        [nameInput, emailInput, textInput].forEach(el => {
            el.classList.remove('is-valid', 'is-error');
        });
        [errorName, errorEmail, errorText].forEach(el => {
            el.textContent = '';
        });
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
};
void initProductPage();
initLoginModal();
initStarRating();
initReviewForm();
const reviewsName = document.getElementById('reviews-product-name');
if (reviewsName && currentProductName) {
    reviewsName.textContent = currentProductName;
}
