export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export const getCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
};

export const updateCartCounter = (): void => {
  const counter = document.querySelector<HTMLElement>('.header__cart-count');
  if (!counter) return;

  const total = getCart().reduce((sum, i) => sum + i.quantity, 0);
  counter.textContent = String(total);
  counter.style.display = total > 0 ? 'flex' : 'none';
};

export const addToCart = (item: Omit<CartItem, 'quantity'>): void => {
  const cart = getCart();
  const existing = cart.find(
    i =>
      i.id === item.id &&
      i.name === item.name &&
      i.size === item.size &&
      i.color === item.color
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
};