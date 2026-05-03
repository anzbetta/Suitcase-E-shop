import { CartItem, getCart, saveCart, updateCartCounter } from './utils/cartUtils.js';
import { initBenefits } from './utils/benefits.js';
import { initLoginModal } from './utils/modal.js';

const SHIPPING = 30;
const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_RATE = 0.1;

const fallbackImages = [
  '../assets/arrival/1.jpg',
  '../assets/arrival/2.jpg',
  '../assets/arrival/3.jpg',
  '../assets/arrival/4.jpg',
];

const resolveCartImage = (image: string, index: number): string => {
  if (image && !image.startsWith('path/to/')) return image;
  return fallbackImages[index % fallbackImages.length];
};

interface ProductPrice {
  id: string;
  price: number;
}

const loadProductPrices = async (): Promise<Map<string, number>> => {
  try {
    const response = await fetch('../assets/data.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const rawData = await response.json();
    const products: ProductPrice[] = rawData.data || [];
    return new Map(products.map(product => [product.id, product.price]));
  } catch (error) {
    console.error('Failed to load product prices:', error);
    return new Map();
  }
};

// ================= CART PAGE LOGIC =================
const initCartPage = async (): Promise<void> => {
  const cartBody = document.getElementById('cart-body');
  const cartSummary = document.getElementById('cart-summary');
  const cartEmpty = document.getElementById('cart-empty');
  const cartClear = document.getElementById('cart-clear');
  const cartTable = document.querySelector<HTMLElement>('.cart-table');
  const cartBottom = document.querySelector<HTMLElement>('.cart-bottom');

  if (!cartBody || !cartSummary || !cartEmpty) return;

  // ================= RENDER ROW =================
  const renderRow = (item: CartItem, index: number): string => `
    <div class="cart-row"
      data-id="${item.id}"
      data-name="${item.name}"
      data-size="${item.size ?? ''}"
      data-color="${item.color ?? ''}">

      <div class="cart-row__image">
        <img src="${resolveCartImage(item.image, index)}" alt="${item.name}">
      </div>

      <div class="cart-row__name">
        ${item.name}
        ${item.size ? `<span class="cart-row__meta">Size: ${item.size}</span>` : ''}
        ${item.color ? `<span class="cart-row__meta">Color: ${item.color}</span>` : ''}
      </div>

      <div class="cart-row__price">$${item.price}</div>

      <div class="cart-row__qty">
        <button class="cart-row__qty-btn" data-action="dec">−</button>
        <span class="cart-row__qty-val">${item.quantity}</span>
        <button class="cart-row__qty-btn" data-action="inc">+</button>
      </div>

      <div class="cart-row__total">$${item.price * item.quantity}</div>

      <button class="cart-row__delete" data-action="delete" aria-label="Remove">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  // ================= RENDER SUMMARY =================
  const renderSummary = (cart: CartItem[]): void => {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const hasDiscount = subtotal > DISCOUNT_THRESHOLD;
    const discount = hasDiscount ? Math.round(subtotal * DISCOUNT_RATE) : 0;
    const total = subtotal - discount + SHIPPING;

    cartSummary.innerHTML = `
      <div class="cart-summary__row">
        <span>Sub Total</span>
        <span>$${subtotal}</span>
      </div>
      ${hasDiscount ? `
      <div class="cart-summary__row">
        <span>Discount</span>
        <span>$${discount}</span>
      </div>` : ''}
      <div class="cart-summary__row">
        <span>Shipping</span>
        <span>$${SHIPPING}</span>
      </div>
      <div class="cart-summary__row cart-summary__row--total">
        <span>Total</span>
        <span>$${total}</span>
      </div>
      <button class="cart-summary__checkout" id="cart-checkout">Checkout</button>
    `;

    document.getElementById('cart-checkout')?.addEventListener('click', handleCheckout);
  };

  // ================= SHOW EMPTY =================
  const showEmpty = (message = 'Your cart is empty. Use the catalog to add new items.'): void => {
    if (cartTable) cartTable.style.display = 'none';
    if (cartBottom) cartBottom.style.display = 'none';

    cartEmpty.style.display = 'block';
    cartEmpty.innerHTML = `
      <p>${message}</p>
      <a href="catalog.html" class="cart-actions__btn cart-actions__btn--fill">
        Go to Catalog
      </a>
    `;
  };

  const priceMap = await loadProductPrices();

  // ================= RENDER CART =================
  const renderCart = (): void => {
    let cart = getCart();

    if (priceMap.size > 0) {
      cart = cart.map(item => {
        const updatedPrice = priceMap.get(item.id);
        if (updatedPrice === undefined) return item;
        return { ...item, price: updatedPrice };
      });
      saveCart(cart);
    }

    if (cart.length === 0) {
      showEmpty();
      return;
    }

    if (cartTable) cartTable.style.display = '';
    if (cartBottom) cartBottom.style.display = '';
    cartEmpty.style.display = 'none';

    cartBody.innerHTML = cart.map(renderRow).join('');
    renderSummary(cart);
  };

  // ================= CHECKOUT =================
  const handleCheckout = (): void => {
    saveCart([]);
    showEmpty('Thank you for your purchase.');
  };

  // ================= CLEAR =================
  cartClear?.addEventListener('click', () => {
    saveCart([]);
    showEmpty('Your cart is empty. Use the catalog to add new items.');
  });

  // ================= ROW ACTIONS =================
  cartBody.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const row = target.closest<HTMLElement>('.cart-row');
    if (!row) return;

    const name = row.dataset.name as string;
    const size = row.dataset.size ?? '';
    const color = row.dataset.color ?? '';
    const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
    if (!action) return;

    let cart = getCart();

    // знаходимо по name + size + color (merge логіка — пункти 50, 51)
    const findItem = (c: CartItem[]) =>
      c.find(
        i =>
          i.name === name &&
          (i.size ?? '') === size &&
          (i.color ?? '') === color
      );

    if (action === 'delete') {
      cart = cart.filter(
        i =>
          !(
            i.name === name &&
            (i.size ?? '') === size &&
            (i.color ?? '') === color
          )
      );
    }

    if (action === 'inc') {
      const item = findItem(cart);
      if (item) item.quantity++;
    }

    if (action === 'dec') {
      const item = findItem(cart);
      if (item) item.quantity = Math.max(1, item.quantity - 1);
    }

    saveCart(cart);
    renderCart();
  });

  // ================= INIT =================
  renderCart();
};

// ================= BURGER MENU =================
const initBurgerMenu = (): void => {
  const header = document.querySelector<HTMLElement>('.header');
  const burgerButton = document.querySelector<HTMLButtonElement>('.header__burger');
  const navigation = document.querySelector<HTMLElement>('#site-navigation');

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
    const target = event.target as HTMLElement;

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

// ================= BOOTSTRAP =================
updateCartCounter();
initBurgerMenu();
void initCartPage();
initBenefits();
initLoginModal();
