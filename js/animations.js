/**
 * MICRO-INTERACTIONS & ANIMATIONS — TOM SAX
 * Animations courtes et élégantes dans le respect strict de prefers-reduced-motion.
 */

const AnimationsModule = {
  init() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // IntersectionObserver et transitions subtiles
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AnimationsModule.init();
});
