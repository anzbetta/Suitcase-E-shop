import { initBenefits } from './utils/benefits.js';
import { updateCartCounter } from './utils/cartUtils.js';
import { initLoginModal } from './utils/modal.js';

const initAboutPage = (): void => {
	document.body.classList.add('page-transition');

	const header = document.querySelector<HTMLElement>('.header');
	const burgerButton = document.querySelector<HTMLButtonElement>('.header__burger');
	const navigation = document.querySelector<HTMLElement>('#site-navigation');

	if (header && burgerButton && navigation) {
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
	}

	document.addEventListener('click', (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		const anchor = target.closest('a') as HTMLAnchorElement | null;

		if (!anchor) return;
		if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

		try {
			const url = new URL(anchor.href, location.href);
			if (url.origin !== location.origin) return;
			if (!url.pathname.endsWith('.html')) return;
		} catch {
			return;
		}

		event.preventDefault();
		document.body.classList.add('page-transition--out');

		const navigate = () => {
			location.href = anchor.href;
		};

		const timeout = window.setTimeout(navigate, 350);
		document.body.addEventListener('transitionend', function onEnd(e) {
			if (e.propertyName !== 'opacity') return;
			window.clearTimeout(timeout);
			document.body.removeEventListener('transitionend', onEnd);
			navigate();
		});
	});

	// init benefits animation if present
	initBenefits();
};

initAboutPage();
updateCartCounter();
initLoginModal();
