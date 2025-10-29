/**
 * Portfolio 42 - c-andriam
 * JavaScript principal avec fonctionnalités optimisées
 * Version: 2.0.0
 * Date: 2025-06-29
 */

'use strict';

// ===== CONFIGURATION & CONSTANTES =====
const CONFIG = {
    THEME_STORAGE_KEY: 'portfolio-theme',
    DEFAULT_THEME: 'dark',
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 3000,
    SCROLL_THRESHOLD: 100,
    TYPING_SPEED: 50,
    USER_EMAIL: 'candriam@student.42antananarivo.mg'
};

const SKILL_DATA = [
    { name: 'C/C++', value: 52 },
    { name: 'Unix/Linux', value: 58 },
    { name: 'Algo', value: 55 },
    { name: 'Git', value: 52 },
    { name: 'Shell/Bash', value: 52 },
    { name: 'Memory Mgmt', value: 50 },
    { name: 'Data Struct.', value: 51 },
    { name: 'Docker', value: 52 }
];

// ===== UTILITIES =====
const Utils = {
    /**
     * Debounce function to limit function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function to limit function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Safely get computed style property
     */
    getCSSVariable(property) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(property)
            .trim();
    }
};

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        this.currentTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || CONFIG.DEFAULT_THEME;
        
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.updateIcon(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            
            // Keyboard support
            this.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    setTheme(theme) {
        this.html.setAttribute('data-theme', theme);
        localStorage.setItem(CONFIG.THEME_STORAGE_KEY, theme);
        this.currentTheme = theme;
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.updateIcon(newTheme);
        
        // Add visual feedback
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    updateIcon(theme) {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
        this.updateActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleLinkClick(e);
                this.closeMobileMenu();
            });
        });

        // Scroll effects
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
            this.updateActiveLink();
        }, 16)); // ~60fps

        // Handle resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        }, 250));
    }

    toggleMobileMenu() {
        const isExpanded = this.hamburger.getAttribute('aria-expanded') === 'true';
        
        this.hamburger.setAttribute('aria-expanded', !isExpanded);
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    }

    closeMobileMenu() {
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    handleLinkClick(e) {
        const href = e.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    handleScroll() {
        if (!this.navbar) return;
        
        const scrolled = window.scrollY > CONFIG.SCROLL_THRESHOLD;
        
        if (scrolled) {
            this.navbar.style.backgroundColor = 'rgba(22, 27, 34, 0.95)';
            this.navbar.style.backdropFilter = 'blur(10px)';
            this.navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.backgroundColor = 'rgba(22, 27, 34, 0.95)';
            this.navbar.style.backdropFilter = 'blur(10px)';
            this.navbar.style.boxShadow = 'none';
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        };

        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveLink(entry.target.id);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            this.sectionObserver.observe(section);
        });
    }

    updateActiveLink() {
        // Fallback method for active link detection
        const fromTop = window.scrollY + 100;
        let currentSection = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        if (currentSection) {
            this.setActiveLink(currentSection);
        }
    }

    setActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== SKILLS RADAR CHART =====
class SkillsRadar {
    constructor(canvasId, skillData) {
        this.canvas = document.getElementById(canvasId);
        this.skillData = skillData;
        
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.centerX = this.canvas.width / 2;
            this.centerY = this.canvas.height / 2;
            this.radius = Math.min(this.canvas.width, this.canvas.height) / 2 - 60;
            
            this.init();
        }
    }

    init() {
        this.draw();
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('themechange', () => this.draw());
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));
    }

    handleResize() {
        const container = this.canvas.parentElement;
        const containerWidth = container.offsetWidth;
        const size = Math.min(containerWidth - 40, 400);
        
        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.radius = size / 2 - 60;
        
        this.draw();
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const gridColor = Utils.getCSSVariable('--border-color');
        const fillColor = Utils.getCSSVariable('--text-accent');
        const textColor = Utils.getCSSVariable('--text-primary');
        
        this.drawGrid(gridColor);
        this.drawAxes(gridColor);
        this.drawData(fillColor);
        this.drawLabels(textColor);
    }

    drawGrid(color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);
        
        // Draw concentric circles
        for (let i = 1; i <= 5; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, (this.radius * i) / 5, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
    }

    drawAxes(color) {
        const numSkills = this.skillData.length;
        const angleStep = (2 * Math.PI) / numSkills;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < numSkills; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = this.centerX + Math.cos(angle) * this.radius;
            const y = this.centerY + Math.sin(angle) * this.radius;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    drawData(color) {
        const numSkills = this.skillData.length;
        const angleStep = (2 * Math.PI) / numSkills;
        
        // Fill area
        this.ctx.fillStyle = color + '30'; // 30 for transparency
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        for (let i = 0; i < numSkills; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const value = (this.skillData[i].value / 100) * this.radius;
            const x = this.centerX + Math.cos(angle) * value;
            const y = this.centerY + Math.sin(angle) * value;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw points
        this.ctx.fillStyle = color;
        for (let i = 0; i < numSkills; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const value = (this.skillData[i].value / 100) * this.radius;
            const x = this.centerX + Math.cos(angle) * value;
            const y = this.centerY + Math.sin(angle) * value;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    drawLabels(color) {
        const numSkills = this.skillData.length;
        const angleStep = (2 * Math.PI) / numSkills;
        
        this.ctx.fillStyle = color;
        this.ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        for (let i = 0; i < numSkills; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const labelRadius = this.radius + 25;
            const x = this.centerX + Math.cos(angle) * labelRadius;
            const y = this.centerY + Math.sin(angle) * labelRadius;
            
            // Adjust text alignment based on position
            if (x < this.centerX - 10) {
                this.ctx.textAlign = 'right';
            } else if (x > this.centerX + 10) {
                this.ctx.textAlign = 'left';
            } else {
                this.ctx.textAlign = 'center';
            }
            
            this.ctx.fillText(this.skillData[i].name, x, y);
        }
    }
}

// ===== ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupProgressBarAnimation();
        this.setupTypingEffect();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in');
                    }, index * 100);
                }
            });
        }, this.observerOptions);

        // Observe elements
        document.querySelectorAll('section, .project-card, .skill-category, .achievement-card').forEach(el => {
            this.observer.observe(el);
        });
    }

    setupProgressBarAnimation() {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBars();
                    progressObserver.disconnect();
                }
            });
        }, this.observerOptions);

        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            progressObserver.observe(skillsSection);
        }
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 500);
        });
    }

    setupTypingEffect() {
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            this.typeWriter(heroTitle, originalText, CONFIG.TYPING_SPEED);
        }
    }

    typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
}

// ===== NOTIFICATION SYSTEM =====
class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#238636',
            error: '#da3633',
            warning: '#fb8500',
            info: '#58a6ff'
        };
        
        notification.style.cssText = `
            background-color: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
            font-weight: 500;
            font-size: 0.9rem;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    this.container.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        return notification;
    }
}

// ===== CONTACT FORM MANAGER =====
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.notificationManager = new NotificationManager();
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.setupValidation();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    setupValidation() {
        this.validators = {
            name: (value) => value.trim().length >= 2,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            subject: (value) => value.trim().length >= 3,
            message: (value) => value.trim().length >= 10
        };
    }

    validateField(field) {
        const validator = this.validators[field.name];
        if (!validator) return true;
        
        const isValid = validator(field.value);
        const errorElement = document.getElementById(`${field.name}-error`);
        
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = this.getErrorMessage(field.name);
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
        
        return isValid;
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    getErrorMessage(fieldName) {
        const messages = {
            name: 'Le nom doit contenir au moins 2 caractères',
            email: 'Veuillez entrer un email valide',
            subject: 'Le sujet doit contenir au moins 3 caractères',
            message: 'Le message doit contenir au moins 10 caractères'
        };
        return messages[fieldName] || 'Champ invalide';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.notificationManager.show('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        submitBtn.disabled = true;
        btnText.hidden = true;
        btnLoading.hidden = false;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.form.reset();
            this.notificationManager.show('Message envoyé avec succès !', 'success');
        } catch (error) {
            this.notificationManager.show('Erreur lors de l\'envoi du message', 'error');
        } finally {
            submitBtn.disabled = false;
            btnText.hidden = false;
            btnLoading.hidden = true;
        }
    }
}

// ===== UTILITY FUNCTIONS =====
function copyToClipboard(text) {
    const notificationManager = new NotificationManager();
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            notificationManager.show('Email copié dans le presse-papiers !', 'success');
        }).catch(() => {
            notificationManager.show('Impossible de copier l\'email', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            notificationManager.show('Email copié dans le presse-papiers !', 'success');
        } catch (err) {
            notificationManager.show('Impossible de copier l\'email', 'error');
        } finally {
            textArea.remove();
        }
    }
}

// ===== INITIALIZATION =====
class PortfolioApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize core components
            this.components.themeManager = new ThemeManager();
            this.components.navigationManager = new NavigationManager();
            this.components.animationManager = new AnimationManager();
            this.components.contactFormManager = new ContactFormManager();
            this.components.skillsRadar = new SkillsRadar('skillsChart', SKILL_DATA);
            
            // Setup additional features
            this.setupEmailCopy();
            this.setupLazyLoading();
            this.logWelcomeMessage();
            
        } catch (error) {
            console.error('Error initializing portfolio:', error);
        }
    }

    setupEmailCopy() {
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            emailLink.addEventListener('click', (e) => {
                e.preventDefault();
                copyToClipboard(CONFIG.USER_EMAIL);
            });
        }
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    logWelcomeMessage() {
        const styles = [
            'color: #58a6ff',
            'font-size: 16px',
            'font-weight: bold',
            'text-shadow: 2px 2px 4px rgba(0,0,0,0.5)'
        ].join(';');

        console.log('%c🚀 Portfolio 42 - candriam', styles);
        console.log(`
╔════════════════════════════════════════╗
║              Portfolio 42              ║
║                                        ║
║        Développé par: candriam         ║
║        École: 42 Antananarivo          ║
║        Level: 5.19                     ║
║                                        ║
║    "Code is poetry written in logic"   ║
╚════════════════════════════════════════╝

💼 Intéressé par mon profil ? Contactez-moi !
📧 ${CONFIG.USER_EMAIL}
🔗 https://github.com/c-andriam
🌐 www.linkedin.com/in/christiano-daniel-juvence-andriambeloniaina-918865225

Version: 2.0.0 | Build: ${new Date().toISOString()}
        `);
    }
}

// ===== CSS ANIMATIONS =====
const additionalCSS = `
.fade-in {
    animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.achievement-card,
.circle {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.achievement-card.animate-in,
.circle.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.form-group input.error,
.form-group textarea.error {
    border-color: var(--danger-color);
    box-shadow: 0 0 0 2px rgba(218, 54, 51, 0.2);
}

.error-message {
    color: var(--danger-color);
    font-size: 0.85rem;
    margin-top: 0.5rem;
    display: block;
    min-height: 1.2em;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    :root {
        --border-color: #ffffff;
        --text-secondary: #cccccc;
    }
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// ===== BACK TO TOP FUNCTIONALITY =====
class BackToTopManager {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        if (!this.button) return;

        this.bindEvents();
        this.handleScroll(); // Check initial state
    }

    bindEvents() {
        // Show/hide on scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 100));

        // Click event
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Keyboard support
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const showThreshold = 300; // Show button after 300px scroll

        if (scrollTop > showThreshold) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Focus management for accessibility
        setTimeout(() => {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.focus();
            }
        }, 300);
    }
}

// ===== LOADING SCREEN MANAGER =====
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.minLoadTime = 1000; // Minimum loading time for better UX
        this.startTime = Date.now();
        this.init();
    }

    init() {
        if (!this.loadingScreen) return;
        
        // Hide loading screen when everything is loaded
        if (document.readyState === 'complete') {
            this.hideLoadingScreen();
        } else {
            window.addEventListener('load', () => {
                this.hideLoadingScreen();
            });
        }
    }

    hideLoadingScreen() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoadTime - elapsedTime);

        setTimeout(() => {
            this.loadingScreen.classList.add('fade-out');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (this.loadingScreen.parentNode) {
                    this.loadingScreen.remove();
                }
            }, 500);
        }, remainingTime);
    }
}

// Initialize the application
const loadingManager = new LoadingManager();
const portfolioApp = new PortfolioApp();
const backToTopManager = new BackToTopManager();

// Export for debugging purposes
window.PortfolioApp = PortfolioApp;
window.portfolioApp = portfolioApp;
