/**
 * Main.js - Application Logic
 * Handles UI interactions, form submissions, and dynamic behaviors
 */

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
if (navMenu) {
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Search Functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

if (searchBtn && searchInput) {
    const performSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            // Store search query
            sessionStorage.setItem('searchQuery', query);
            
            // Get current page
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            
            // Search in current page content
            const searchableElements = document.querySelectorAll('h1, h2, h3, h4, p, .service-card, .project-card, .news-card');
            let found = false;
            
            searchableElements.forEach(element => {
                if (element.textContent.toLowerCase().includes(query)) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.style.backgroundColor = '#fef3c7';
                    setTimeout(() => {
                        element.style.transition = 'background-color 1s ease';
                        element.style.backgroundColor = '';
                    }, 2000);
                    found = true;
                    return;
                }
            });
            
            if (!found) {
                alert(`No results found for "${query}" on this page. Try searching on other pages.`);
            }
        }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Sticky Navigation
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Get filter value
        const filter = button.getAttribute('data-filter');

        // Re-render projects with filter
        if (typeof CMS !== 'undefined' && CMS.renderAllProjects) {
            CMS.renderAllProjects(filter);
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Simulate form submission (in production, send to backend)
        try {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Log form data (in production, this would be sent to server)
            console.log('Form submitted:', formData);

            // Show success message
            formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            formMessage.className = 'form-message success';

            // Reset form
            contactForm.reset();

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            // Show error message
            formMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
            formMessage.className = 'form-message error';

            // Reset button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        }
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements when they're added to the page
const observeElements = () => {
    const elementsToObserve = document.querySelectorAll('.service-card, .project-card, .value-card, .mv-card');
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

// Run observer after a short delay to ensure CMS content is loaded
setTimeout(observeElements, 500);

// Re-run observer when content changes (for filtered projects)
const observeProjectChanges = () => {
    const projectsGrid = document.getElementById('projects-full-grid');
    if (projectsGrid) {
        const projectObserver = new MutationObserver(() => {
            observeElements();
        });
        projectObserver.observe(projectsGrid, { childList: true });
    }
};

setTimeout(observeProjectChanges, 1000);

// Form Validation
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

if (contactForm) {
    const emailInput = document.getElementById('email');
    
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            emailInput.style.borderColor = '#dc2626';
        } else {
            emailInput.style.borderColor = '';
        }
    });
}

// Add active class to current page in navigation
const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
};

// Set active nav link on page load
setActiveNavLink();

// Back to Top functionality (optional enhancement)
const createBackToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
    `;

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
};

// Initialize back to top button
createBackToTop();

// Console message for developers
console.log('%c🚀 DAL-sh Software House', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cWebsite built with HTML, CSS, and Vanilla JavaScript', 'font-size: 12px; color: #64748b;');
console.log('%cContent managed via JSON files - Edit data/ folder to update content', 'font-size: 12px; color: #10b981;');

const langButtons = document.querySelectorAll('.lang-toggle button');

async function setLanguage(lang) {
    const res = await fetch('data/lang.json');
    const data = await res.json();

    localStorage.setItem('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (data[lang][key]) el.textContent = data[lang][key];
    });

    langButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

setLanguage(localStorage.getItem('lang') || 'en');

let translations = {};
let currentLang = localStorage.getItem("lang") || "en";

async function loadLanguage(lang) {
    const res = await fetch("data/lang.json");
    translations = await res.json();
    applyLanguage(lang);
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// Language buttons
document.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
        loadLanguage(btn.dataset.lang);
    });
});

// Init
loadLanguage(currentLang);
