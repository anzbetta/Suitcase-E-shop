import { addToCart, updateCartCounter } from './utils/cartUtils.js';
import { initBenefits } from './utils/benefits.js';
import { initLoginModal } from './utils/modal.js';
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
const ITEMS_PER_PAGE = 12;
let products = [];
let currentPage = 1;
let currentSort = '';
let currentFilters = { category: '', color: '', size: '', sale: '' };
let currentSearch = '';
const grid = document.getElementById('catalog-grid');
const paginationPages = document.getElementById('pagination-pages');
const prevBtn = document.getElementById('pagination-prev');
const nextBtn = document.getElementById('pagination-next');
const countEl = document.querySelector('.catalog-toolbar__count');
const sortSelect = document.querySelector('.catalog-sort__select');
const searchInput = document.querySelector('.catalog-search__input');
const searchBtn = document.querySelector('.catalog-search__btn');
const resetBtn = document.querySelector('.catalog-filters__reset');
const sidebarList = document.getElementById('sidebar-list');
const getFiltered = () => {
    let result = [...products];
    if (currentSearch) {
        result = result.filter(p => p.name.toLowerCase().includes(currentSearch.toLowerCase()));
    }
    if (currentFilters.category) {
        result = result.filter(p => p.category === currentFilters.category);
    }
    if (currentFilters.color) {
        result = result.filter(p => p.color === currentFilters.color);
    }
    if (currentFilters.size) {
        result = result.filter(p => p.size
            .split(',')
            .map((s) => s.trim())
            .indexOf(currentFilters.size) !== -1);
    }
    if (currentFilters.sale === 'true') {
        result = result.filter(p => p.salesStatus);
    }
    switch (currentSort) {
        case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            result.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
    }
    return result;
};
const renderCard = (product) => `
  <div class="catalog-card">
    <a href="./product-details.html?id=${product.id}" class="catalog-card__link">
      <div class="catalog-card__image">
        ${product.salesStatus ? '<span class="catalog-card__badge">Sale</span>' : ''}
        <img src="${product.imageUrl}" alt="${product.name}">
      </div>
      <div class="catalog-card__body">
        <h3 class="catalog-card__title">${product.name}</h3>
        <p class="catalog-card__price">$${product.price}</p>
      </div>
    </a>
    <div class="catalog-card__btn-wrap">
      <button class="catalog-card__btn" data-id="${product.id}">Add To Cart</button>
    </div>
  </div>
`;
const renderGrid = () => {
    const filtered = getFiltered();
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    if (currentPage > totalPages)
        currentPage = 1;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, total);
    const pageItems = filtered.slice(start, end);
    if (pageItems.length === 0) {
        grid.innerHTML = '<p class="catalog-empty">No products found.</p>';
    }
    else {
        grid.innerHTML = pageItems.map(renderCard).join('');
    }
    countEl.textContent = total > 0
        ? `Showing ${start + 1}–${end} of ${total} Results`
        : 'No results';
    renderPagination(totalPages);
};
const renderPagination = (totalPages) => {
    paginationPages.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `catalog-pagination__page${i === currentPage ? ' is-active' : ''}`;
        btn.textContent = String(i);
        btn.addEventListener('click', () => {
            currentPage = i;
            renderGrid();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationPages.appendChild(btn);
    }
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
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
const renderSidebarItem = (p) => `
  <a href="./product-details.html?id=${p.id}" 
     class="catalog-sidebar-item">
    <div class="catalog-sidebar-item__image">
      <img src="${p.imageUrl}" alt="${p.name}">
    </div>
    <div class="catalog-sidebar-item__info">
      <p class="catalog-sidebar-item__name">${p.name}</p>
      <div class="catalog-sidebar-item__stars">
        ${renderStars(p.rating)}
      </div>
      <p class="catalog-sidebar-item__price">$${p.price}</p>
    </div>
  </a>
`;
const renderSidebar = () => {
    if (!sidebarList)
        return;
    const shuffled = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    sidebarList.innerHTML = shuffled.map(renderSidebarItem).join('');
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
const showNotFound = () => {
    document.querySelector('.catalog-popup')?.remove();
    const popup = document.createElement('div');
    popup.className = 'catalog-popup';
    popup.innerHTML = `
    <div class="catalog-popup__box">
      <p>Product not found</p>
      <button class="catalog-popup__close">OK</button>
    </div>
  `;
    document.body.appendChild(popup);
    popup.querySelector('.catalog-popup__close')
        .addEventListener('click', () => popup.remove());
    popup.addEventListener('click', (e) => {
        if (e.target === popup)
            popup.remove();
    });
};
const handleSearch = () => {
    const val = searchInput.value.trim();
    if (val) {
        const found = products.find(p => p.name.toLowerCase().includes(val.toLowerCase()));
        if (!found) {
            showNotFound();
            return;
        }
    }
    currentSearch = val;
    currentPage = 1;
    renderGrid();
};
const filterInputs = document.querySelectorAll('.catalog-filter__option input');
filterInputs.forEach(input => {
    input.addEventListener('change', () => {
        const name = input.name;
        currentFilters[name] = input.value;
        currentPage = 1;
        const trigger = input
            .closest('.catalog-filter')
            ?.querySelector('.catalog-filter__trigger');
        trigger?.classList.toggle('is-active', input.value !== '');
        input
            .closest('.catalog-filter__dropdown')
            ?.querySelectorAll('.catalog-filter__option')
            .forEach(opt => opt.classList.remove('is-selected'));
        input.closest('.catalog-filter__option')?.classList.add('is-selected');
        renderGrid();
    });
});
resetBtn?.addEventListener('click', () => {
    currentFilters = { category: '', color: '', size: '', sale: '' };
    currentSearch = '';
    currentSort = '';
    currentPage = 1;
    filterInputs.forEach(input => {
        input.checked = false;
        input.closest('.catalog-filter__option')?.classList.remove('is-selected');
    });
    document.querySelectorAll('.catalog-filter__trigger')
        .forEach(t => t.classList.remove('is-active'));
    sortSelect.value = '';
    searchInput.value = '';
    renderGrid();
});
document.getElementById('catalog-filters-hide')?.addEventListener('click', () => {
    document.getElementById('catalog-filters-panel')?.classList.add('is-hidden');
    document.getElementById('catalog-filters-open')?.classList.add('is-visible');
});
document.getElementById('catalog-filters-open')?.addEventListener('click', () => {
    document.getElementById('catalog-filters-panel')?.classList.remove('is-hidden');
    document.getElementById('catalog-filters-open')?.classList.remove('is-visible');
});
sortSelect?.addEventListener('change', () => {
    currentSort = sortSelect.value;
    currentPage = 1;
    renderGrid();
});
searchBtn?.addEventListener('click', handleSearch);
searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
        handleSearch();
});
prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
nextBtn?.addEventListener('click', () => {
    const totalPages = Math.ceil(getFiltered().length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.catalog-card__btn');
    if (!btn)
        return;
    const id = btn.dataset.id;
    const product = products.find(p => p.id === id);
    if (!product)
        return;
    addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        size: product.size,
        color: product.color,
    });
    const original = btn.textContent ?? 'Add To Cart';
    btn.textContent = 'Added ✓';
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
    }, 1200);
});
const initCatalogPage = async () => {
    try {
        const response = await fetch('../assets/data.json');
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const rawData = await response.json();
        products.push(...(rawData.data.map((product, index) => ({
            ...product,
            imageUrl: resolveImageUrl(product.imageUrl, index),
        }))));
    }
    catch (e) {
        console.error('Failed to load data.json:', e);
        grid.innerHTML = '<p class="catalog-empty">Failed to load products.</p>';
        return;
    }
    initBenefits();
    initBurgerMenu();
    renderGrid();
    renderSidebar();
    updateCartCounter();
};
void initCatalogPage();
initLoginModal();
