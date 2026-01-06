// ============================================
// DR Ceylon Tours - Complete JavaScript
// All Interactive Features & Page Navigation
// ============================================

// Smooth Page Navigation System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initContactForm();
    initBackToTop();
    initFAQ();

    console.log('✅ DR Ceylon Tours website loaded successfully!');
});

// ============================================
// PAGE NAVIGATION SYSTEM
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    // Show home page by default
    showPage('home');

    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showPage(targetId);

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Close mobile menu if open
            const navLinksContainer = document.getElementById('navLinks');
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }

            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            showPage(e.state.page);
            updateActiveNav(e.state.page);
        }
    });
}

function showPage(pageId) {
    const sections = document.querySelectorAll('.page-section');

    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');

        // Update URL without reload
        const newUrl = `#${pageId}`;
        if (window.location.hash !== newUrl) {
            history.pushState({ page: pageId }, '', newUrl);
        }

        // Update page title
        updatePageTitle(pageId);
    }
}

function updateActiveNav(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function updatePageTitle(pageId) {
    const titles = {
        'home': 'DR Ceylon Tours - Best Taxi & Tour Service in Sri Lanka',
        'taxi': 'Taxi Services - DR Ceylon Tours',
        'tours': 'Tour Packages - DR Ceylon Tours',
        'about': 'About Us - DR Ceylon Tours',
        'contact': 'Contact - DR Ceylon Tours'
    };

    if (titles[pageId]) {
        document.title = titles[pageId];
    }
}

// Handle initial page load from URL hash
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showPage(hash);
        updateActiveNav(hash);
    }
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Change icon
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', debounce(function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, 10));
}

// ============================================
// ANIMATED COUNTERS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        observer.observe(counters[0].closest('.stats-section') || counters[0].closest('.about-stats-section'));
    }
}

function animateCounter(counter) {
    const target = parseFloat(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            // Format with decimal for ratings, integer for others
            if (target < 10) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
            requestAnimationFrame(updateCounter);
        } else {
            // Final value
            if (target < 10) {
                counter.textContent = target.toFixed(1);
            } else {
                counter.textContent = Math.floor(target).toLocaleString();
            }
        }
    };

    updateCounter();
}

// ============================================
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (validateForm(form)) {
                // Show success message
                const successMsg = document.getElementById('successMessage');
                successMsg.classList.add('show');

                // Reset form
                form.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);

                // In production, send data to backend
                // sendFormData(new FormData(form));

                console.log('✅ Form submitted successfully!');
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.closest('.form-group').classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const value = field.value.trim();
    let isValid = true;

    // Remove previous error
    formGroup.classList.remove('error');

    // Check if empty
    if (field.hasAttribute('required') && value === '') {
        formGroup.classList.add('error');
        isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            formGroup.classList.add('error');
            isValid = false;
        }
    }

    // Phone validation (basic)
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[+]?[0-9\s-()]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            formGroup.classList.add('error');
            isValid = false;
        }
    }

    return isValid;
}

// ============================================
// FAQ ACCORDION
// ============================================
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current FAQ
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', debounce(function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }, 100));

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
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

// ============================================
// WHATSAPP INTEGRATION
// ============================================
// WhatsApp buttons are already linked in HTML
// Can add analytics tracking here if needed

document.querySelectorAll('a[href^="https://wa.me"]').forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('📱 WhatsApp button clicked');
        // Add Google Analytics or other tracking here
        // gtag('event', 'whatsapp_click', { ... });
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if it's a page navigation link (already handled)
        if (this.classList.contains('nav-link')) {
            return;
        }

        // Handle other anchor links within same page
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement && !targetElement.classList.contains('page-section')) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images (if you add actual image elements)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
function preloadResources() {
    // Preload fonts
    const fonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap'
    ];

    fonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = font;
        document.head.appendChild(link);
    });
}

// ============================================
// ANALYTICS & TRACKING (Optional)
// ============================================

// Track page views
function trackPageView(pageName) {
    console.log(`📊 Page view: ${pageName}`);
    // Add your analytics code here
    // Example: gtag('config', 'GA_MEASUREMENT_ID', { 'page_path': pageName });
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        console.log(`🔘 Button clicked: ${btnText}`);
        // Add tracking code
    });
});

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.message);
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c🚗 DR Ceylon Tours Website', 'color: #1e3a8a; font-size: 20px; font-weight: bold;');
console.log('%c✨ Powered by modern JavaScript', 'color: #f59e0b; font-size: 14px;');
console.log('%c📞 Contact: +94 70 191 4681', 'color: #10b981; font-size: 12px;');

// ============================================
// EXPORT FOR TESTING (Optional)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showPage,
        validateForm,
        validateField,
        debounce
    };
}