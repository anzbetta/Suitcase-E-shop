export const initBenefits = () => {
    const benefitItems = document.querySelectorAll(".benefits__item");
    if (benefitItems.length === 0)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    benefitItems.forEach((item) => observer.observe(item));
};
