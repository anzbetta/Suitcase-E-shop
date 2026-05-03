export const initBenefits = (): void => {
  const benefitItems =
    document.querySelectorAll<HTMLElement>(".benefits__item");

  if (benefitItems.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  benefitItems.forEach((item) => observer.observe(item));
};
