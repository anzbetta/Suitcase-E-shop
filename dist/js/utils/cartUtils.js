export const getCart = () => {
    try {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    catch {
        return [];
    }
};
export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
};
export const updateCartCounter = () => {
    const counter = document.querySelector('.header__cart-count');
    if (!counter)
        return;
    const total = getCart().reduce((sum, i) => sum + i.quantity, 0);
    counter.textContent = String(total);
    counter.style.display = total > 0 ? 'flex' : 'none';
};
export const addToCart = (item) => {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id &&
        i.name === item.name &&
        i.size === item.size &&
        i.color === item.color);
    if (existing) {
        existing.quantity++;
    }
    else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart(cart);
};
