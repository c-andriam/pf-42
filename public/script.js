// Toggle du thème dark/light
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Vérifier le thème sauvegardé
const savedTheme = localStorage.getItem('theme') || 'dark';
body.className = savedTheme + '-theme';
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', function() {
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.className = newTheme + '-theme';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu mobile
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Smooth scrolling pour les liens d'ancrage
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Highlight du lien actif dans la navigation
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navHeight = document.querySelector('.navbar').offsetHeight;
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Animation des compteurs dans la section éducation
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        observer.observe(statsSection);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                const formattedValue = Math.floor(current);
                if (counter.textContent.includes('+')) {
                    counter.textContent = formattedValue + '+';
                } else if (counter.textContent.includes('%')) {
                    counter.textContent = formattedValue + '%';
                } else {
                    counter.textContent = formattedValue;
                }
            }, 16);
        });
    }

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validation simple
            if (!data.name || !data.email || !data.message) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Simulation d'envoi (remplacez par votre logique d'envoi réelle)
            console.log('Données du formulaire:', data);
            
            // Affichage d'un message de succès
            showNotification('Message envoyé avec succès! Je vous répondrai bientôt.', 'success');
            
            // Reset du formulaire
            this.reset();
        });
    }

    // Validation email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Système de notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${getIconForType(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Fermeture automatique
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);

        // Fermeture manuelle
        notification.querySelector('.notification-close').addEventListener('click', () => {
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    function getIconForType(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Animation des éléments au scroll
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-content');
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // Lazy loading des images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Gestion des liens externes
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Raccourcis clavier
    document.addEventListener('keydown', function(e) {
        // Escape pour fermer les modales/menus
        if (e.key === 'Escape') {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Détection de la vitesse de scroll pour optimiser les performances
    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            document.body.classList.add('scrolling');
            isScrolling = true;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            document.body.classList.remove('scrolling');
            isScrolling = false;
        }, 100);
    }, { passive: true });

    // Animation de typing pour le hero
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const texts = ['Développeur Système', 'Student @42', 'Passionné de Code', 'Problem Solver'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeText, typeSpeed);
        }

        typeText();
    }

    // Smooth reveal des sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Gestion des tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);

            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

            setTimeout(() => {
                tooltip.classList.add('tooltip-visible');
            }, 10);

            this.addEventListener('mouseleave', function() {
                tooltip.classList.remove('tooltip-visible');
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 200);
            });
        });
    });

    // Copy to clipboard pour les liens
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification('Copié dans le presse-papiers!', 'success');
            }).catch(() => {
                showNotification('Erreur lors de la copie', 'error');
            });
        });
    });

    // Progress bars animation
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const width = progress.getAttribute('data-width');
                progress.style.width = width;
                progressObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    console.log('Portfolio 42 - c-andriam - Initialisé avec succès! 🚀');
});

// Styles CSS pour les notifications et tooltips
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
/* Notifications */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 10000;
    max-width: 350px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    background: #28a745;
    color: white;
}

.notification-error {
    background: #dc3545;
    color: white;
}

.notification-warning {
    background: #ffc107;
    color: #212529;
}

.notification-info {
    background: var(--primary-color);
    color: white;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.notification-close:hover {
    opacity: 1;
}

/* Tooltips */
.tooltip {
    position: absolute;
    background: var(--tooltip-bg, #333);
    color: var(--tooltip-color, white);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    pointer-events: none;
    opacity: 0;
    transform: translateY(5px);
    transition: opacity 0.2s, transform 0.2s;
    z-index: 9999;
}

.tooltip-visible {
    opacity: 1;
    transform: translateY(0);
}

.tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: var(--tooltip-bg, #333);
}

/* Animations de scroll */
.scrolling * {
    pointer-events: none;
}

section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

section.section-visible {
    opacity: 1;
    transform: translateY(0);
}

/* Progress bars */
.progress-fill {
    width: 0;
    transition: width 1.5s ease-in-out;
}

/* Responsive notifications */
@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
        transform: translateY(-100%);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}
`;

document.head.appendChild(dynamicStyles);

// Service Worker pour le cache (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('ServiceWorker registration failed: ', registrationError);
            });
    });
}

// Analytics (remplacez par votre code Google Analytics si nécessaire)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');

// Performance monitoring
window.addEventListener('load', function() {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
});