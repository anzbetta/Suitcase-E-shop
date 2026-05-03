import Slider from "./home.js";

const sliders: Slider[] = [];

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-transition");

  document.querySelectorAll<HTMLElement>("[data-slider]").forEach((root) => {
    if (root.dataset.sliderDynamic === "true") return;
    sliders.push(new Slider(root));
  });

  const header = document.querySelector<HTMLElement>(".header");
  const burgerButton =
    document.querySelector<HTMLButtonElement>(".header__burger");
  const navigation = document.querySelector<HTMLElement>("#site-navigation");

  if (!header || !burgerButton || !navigation) {
    return;
  }

  const closeMenu = () => {
    header.classList.remove("header--menu-open");
    burgerButton.setAttribute("aria-expanded", "false");
    burgerButton.setAttribute("aria-label", "Open menu");
  };

  burgerButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("header--menu-open");
    burgerButton.setAttribute("aria-expanded", String(isOpen));
    burgerButton.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu",
    );
  });

  navigation.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.closest("a")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  // Intercept internal link clicks and play a fade-out transition
  document.addEventListener("click", (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest("a");

    if (!anchor) return;
    if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

    // Only handle same-origin HTML links (relative links included)
    try {
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (!url.pathname.endsWith(".html")) return;
    } catch {
      return;
    }

    // Prevent immediate navigation, animate out, then navigate
    event.preventDefault();
    document.body.classList.add("page-transition--out");

    const navigate = () => {
      location.href = anchor.href;
    };

    // Wait for CSS transition to finish (fallback 350ms)
    const timeout = window.setTimeout(navigate, 350);
    document.body.addEventListener("transitionend", function onEnd(e) {
      if (e.propertyName !== "opacity") return;
      window.clearTimeout(timeout);
      document.body.removeEventListener("transitionend", onEnd);
      navigate();
    });
  });
});
