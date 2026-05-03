import { initBenefits } from './utils/benefits.js';
import { addToCart, updateCartCounter } from './utils/cartUtils.js';
import { initLoginModal } from './utils/modal.js';

interface Product {
   id: string;
   name: string;
   price: number;
   imageUrl: string;
   category: string;
   color: string;
   size: string;
   salesStatus: boolean;
   rating: number;
   popularity: number;
   blocks: string[];
}

const fallbackImages = [
   './assets/arrival/1.jpg',
   './assets/arrival/2.jpg',
   './assets/arrival/3.jpg',
   './assets/arrival/4.jpg',
];

const resolveImageUrl = (imageUrl: string, index: number): string => {
   if (imageUrl && !imageUrl.startsWith('path/to/')) return imageUrl;
   return fallbackImages[index % fallbackImages.length];
};

const shuffle = <T>(items: T[]): T[] => {
   return [...items].sort(() => Math.random() - 0.5);
};

const pickProducts = (products: Product[], block: string, count: number): Product[] => {
   const matching = products.filter(product => product.blocks?.includes(block));
   if (matching.length >= count) return matching.slice(0, count);

   const remaining = products.filter(product => !matching.some(item => item.id === product.id));
   return matching.concat(shuffle(remaining).slice(0, count - matching.length));
};

class Slider {
   private track!: HTMLElement;
   private slides!: HTMLElement[];
   private nextBtns!: HTMLButtonElement[];
   private prevBtns!: HTMLButtonElement[];
   private totalSlides!: number;

   private currentIndex = 0;
   private targetIndex = 0;

   private isDragging = false;
   private dragStartX = 0;
   private dragCurrentX = 0;
   private baseOffset = 0;
   private dragIndexStart = 0;

   private readonly DRAG_THRESHOLD = 50;

   constructor(private root: HTMLElement) {
      const track = root.querySelector<HTMLElement>('[data-slider-track]');
      if (!track) {
         console.warn('Slider: [data-slider-track] not found in', root);
         return;
      }

      this.track = track;
      this.slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slider-slide]'));
      this.nextBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-slider-next]'));
      this.prevBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-slider-prev]'));
      this.totalSlides = this.slides.length;

      if (this.totalSlides === 0) return;

      this.init();
   }

   // --- helpers ---

   private getSlideWidth(): number {
      const style = getComputedStyle(this.track);
      const gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 0;
      return this.slides[0].getBoundingClientRect().width + gap;
   }

   private getSlidesToShow(): number {
      const trackWidth = this.track.getBoundingClientRect().width;
      const slideWidth = this.getSlideWidth();
      return slideWidth > 0 ? Math.round(trackWidth / slideWidth) : 1;
   }

   private clampIndex(index: number): number {
      const maxIndex = this.totalSlides - this.getSlidesToShow();
      return Math.max(0, Math.min(index, maxIndex));
   }

   private updateBtns(): void {
      const atStart = this.currentIndex === 0;
      const atEnd = this.currentIndex >= this.totalSlides - this.getSlidesToShow();

      this.prevBtns.forEach(btn => btn.classList.toggle('slider-btn--disabled', atStart));
      this.nextBtns.forEach(btn => btn.classList.toggle('slider-btn--disabled', atEnd));
   }

   private setPositionInstant(index: number): void {
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(-${index * this.getSlideWidth()}px)`;
   }

   private animateTo(index: number): void {
      this.targetIndex = this.clampIndex(index);
      this.track.style.transition = 'transform 0.4s ease';
      this.track.style.transform = `translateX(-${this.targetIndex * this.getSlideWidth()}px)`;
      this.currentIndex = this.targetIndex;
      this.updateBtns();
   }

   // --- drag ---

   private onDragStart(clientX: number): void {
      this.isDragging = true;
      this.dragStartX = clientX;
      this.dragCurrentX = clientX;
      this.dragIndexStart = this.currentIndex;
      this.baseOffset = this.currentIndex * this.getSlideWidth();
      this.track.style.transition = 'none';
      this.track.style.cursor = 'grabbing';
   }

   private onDragMove(clientX: number): void {
      if (!this.isDragging) return;
      this.dragCurrentX = clientX;
      const delta = this.dragCurrentX - this.dragStartX;
      this.track.style.transform = `translateX(${-(this.baseOffset - delta)}px)`;
   }

   private onDragEnd(): void {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.track.style.cursor = '';

      const delta = this.dragCurrentX - this.dragStartX;
      const slideWidth = this.getSlideWidth();

      if (Math.abs(delta) > this.DRAG_THRESHOLD) {
         const steps = Math.max(1, Math.round(Math.abs(delta) / slideWidth));
         const direction = delta < 0 ? 1 : -1;
         this.animateTo(this.dragIndexStart + direction * steps);
      } else {
         this.animateTo(this.dragIndexStart);
      }
   }

   // --- init ---

   private init(): void {
      this.nextBtns.forEach(btn => btn.addEventListener('click', () => this.animateTo(this.targetIndex + 1)));
      this.prevBtns.forEach(btn => btn.addEventListener('click', () => this.animateTo(this.targetIndex - 1)));

      // mouse drag
      this.track.addEventListener('mousedown', (e) => { e.preventDefault(); this.onDragStart(e.clientX); });
      window.addEventListener('mousemove', (e) => this.onDragMove(e.clientX));
      window.addEventListener('mouseup', () => this.onDragEnd());

      // touch drag
      this.track.addEventListener('touchstart', (e) => this.onDragStart(e.touches[0].clientX), { passive: true });
      this.track.addEventListener('touchmove', (e) => this.onDragMove(e.touches[0].clientX), { passive: true });
      this.track.addEventListener('touchend', () => this.onDragEnd());

      // resize
      window.addEventListener('resize', () => {
         this.currentIndex = this.clampIndex(this.currentIndex);
         this.targetIndex = this.currentIndex;
         this.setPositionInstant(this.currentIndex);
         this.updateBtns();
      });

      // старт
      this.setPositionInstant(this.currentIndex);
      this.updateBtns();
   }
}


// init benefits on module load (if present)
initBenefits();
updateCartCounter();
initLoginModal();

const renderSelectedCard = (product: Product, index: number): string => {
   const imageUrl = resolveImageUrl(product.imageUrl, index);
   return `
      <div class="selected-card selected-slider__slide" data-slider-slide>
         <div class="selected-card__image">
            ${product.salesStatus ? '<span class="selected-card__badge">Sale</span>' : ''}
            <a class="selected-card__link" href="./html/product-details.html?id=${product.id}">
               <img src="${imageUrl}" alt="${product.name}">
            </a>
         </div>
         <div class="selected-card__body">
            <a class="selected-card__link" href="./html/product-details.html?id=${product.id}">
               <h3 class="selected-card__title">${product.name}</h3>
            </a>
            <p class="selected-card__price">$${product.price}</p>
            <button class="selected-card__btn" data-id="${product.id}">Add To Cart</button>
         </div>
      </div>
   `;
};

const renderArrivalCard = (product: Product, index: number): string => {
   const imageUrl = resolveImageUrl(product.imageUrl, index);
   return `
      <div class="arrival-card arrival-slider__slide" data-slider-slide>
         <div class="arrival-card__image">
            ${product.salesStatus ? '<span class="arrival-card__badge">Sale</span>' : ''}
            <a class="arrival-card__link" href="./html/product-details.html?id=${product.id}">
               <img src="${imageUrl}" alt="${product.name}">
            </a>
         </div>
         <div class="arrival-card__body">
            <h3 class="arrival-card__title">${product.name}</h3>
            <p class="arrival-card__price">$${product.price}</p>
            <a href="./html/product-details.html?id=${product.id}" class="arrival-card__btn">View Product</a>
         </div>
      </div>
   `;
};

const initHomeProducts = async (): Promise<void> => {
   const selectedTrack = document.getElementById('selected-track');
   const arrivalTrack = document.getElementById('arrival-track');
   if (!selectedTrack || !arrivalTrack) return;

   try {
      const response = await fetch('./assets/data.json');
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const rawData = await response.json();
      const products: Product[] = rawData.data || [];

      const selectedProducts = pickProducts(products, 'Selected Products', 7);
      const arrivalProducts = pickProducts(products, 'New Products Arrival', 7);

      selectedTrack.innerHTML = selectedProducts
         .map(renderSelectedCard)
         .join('');
      arrivalTrack.innerHTML = arrivalProducts
         .map(renderArrivalCard)
         .join('');

      const selectedRoot = selectedTrack.closest<HTMLElement>('[data-slider]');
      const arrivalRoot = arrivalTrack.closest<HTMLElement>('[data-slider]');

      if (selectedRoot) new Slider(selectedRoot);
      if (arrivalRoot) new Slider(arrivalRoot);

      selectedTrack.addEventListener('click', (event) => {
         const target = event.target as HTMLElement;
         const button = target.closest<HTMLButtonElement>('.selected-card__btn');
         if (!button) return;

         const id = button.dataset.id;
         if (!id) return;

         const product = selectedProducts.find(item => item.id === id);
         if (!product) return;

         addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: resolveImageUrl(product.imageUrl, selectedProducts.indexOf(product)),
            size: product.size,
            color: product.color,
         });

         const original = button.textContent || 'Add To Cart';
         button.textContent = 'Added ✓';
         button.disabled = true;
         window.setTimeout(() => {
            button.textContent = original;
            button.disabled = false;
         }, 1200);
      });
   } catch (error) {
      console.error('Failed to load home products:', error);
   }
};

void initHomeProducts();

export default Slider;