// ========================================
// Islamic Health Awareness Campaign
// Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initCounters();
    initCarousel();
    initMobileMenu();
    initFormValidation();
    initSmoothScroll();
});

// ========================================
// Navigation
// ========================================
function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scrolled class on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }
}

// ========================================
// Scroll Effects
// ========================================
function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');

    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled * 0.002);
            }
        });
    }
}

// ========================================
// Intersection Observer Animations
// ========================================
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animate;
                const delay = entry.target.dataset.delay || 0;

                setTimeout(() => {
                    entry.target.classList.add(`animate-${animation}`);
                    entry.target.style.opacity = '1';
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ========================================
// Animated Counters
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target) || parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

// ========================================
// Carousel/Slider
// ========================================
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        const slidesToShow = parseInt(carousel.dataset.slides) || 1;

        // Create dots
        if (dotsContainer) {
            slides.forEach((_, index) => {
                if (index % slidesToShow === 0) {
                    const dot = document.createElement('button');
                    dot.classList.add('carousel-dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(index));
                    dotsContainer.appendChild(dot);
                }
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            const slideWidth = slides[0].offsetWidth;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Update dots
            const dots = dotsContainer?.querySelectorAll('.carousel-dot');
            dots?.forEach((dot, i) => {
                dot.classList.toggle('active', i === Math.floor(currentIndex / slidesToShow));
            });
        }

        function nextSlide() {
            if (currentIndex < slides.length - slidesToShow) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0);
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(slides.length - slidesToShow);
            }
        }

        prevBtn?.addEventListener('click', prevSlide);
        nextBtn?.addEventListener('click', nextSlide);

        // Auto-play
        if (carousel.dataset.autoplay) {
            const interval = parseInt(carousel.dataset.interval) || 5000;
            setInterval(nextSlide, interval);
        }
    });
}

// ========================================
// Form Validation
// ========================================
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

            inputs.forEach(input => {
                removeError(input);

                if (!input.value.trim()) {
                    showError(input, 'This field is required');
                    isValid = false;
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    showError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
          <div class="success-icon">✓</div>
          <h4>Thank you!</h4>
          <p>Your message has been sent successfully. We'll get back to you soon.</p>
        `;
                form.innerHTML = '';
                form.appendChild(successMessage);
            }
        });
    });
}

function showError(input, message) {
    input.classList.add('error');
    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    input.parentNode.appendChild(errorEl);
}

function removeError(input) {
    input.classList.remove('error');
    const errorEl = input.parentNode.querySelector('.form-error');
    if (errorEl) errorEl.remove();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Utility Functions
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Tab Component
// ========================================
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');

    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                // Update active states
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(target)?.classList.add('active');
            });
        });
    });
}

// ========================================
// Modal Component
// ========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ========================================
// Newsletter Subscription
// ========================================
function initNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');

            if (emailInput && isValidEmail(emailInput.value)) {
                button.textContent = 'Subscribed!';
                button.disabled = true;
                emailInput.value = '';

                setTimeout(() => {
                    button.textContent = 'Subscribe';
                    button.disabled = false;
                }, 3000);
            }
        });
    });
}

// Initialize additional components
document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    initNewsletter();
});
