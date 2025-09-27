import { statsObserverOptions } from './observer-config.js';

function animateCounter(statElement) {
    const target = parseInt(statElement.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += document.addEventListener('DOMContentLoaded', function () {
    const statElements = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statElements.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            clearInterval(timer);
                            current = target;
                        }
                        stat.textContent = Math.round(current);
                    }, 16);
                });

                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
});increment;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        statElement.textContent = Math.round(current);
    }, 16);
}

export function initCounterAnimation() {
    const statElements = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statElements.forEach(stat => {
                    animateCounter(stat);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, statsObserverOptions);

    statsObserver.observe(statsSection);
}