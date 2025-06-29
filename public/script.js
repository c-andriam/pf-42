// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

// Update theme toggle icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'var(--bg-secondary)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// Observe skill categories
document.querySelectorAll('.skill-category').forEach(category => {
    observer.observe(category);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Reset form
            this.reset();
            
            // Show success message
            showNotification('Message envoyé avec succès !', 'success');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#238636',
        error: '#da3633',
        warning: '#fb8500',
        info: '#58a6ff'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--text-accent) !important;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Skills animation counter
function animateSkillBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Trigger skill animation when skills section is visible
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.disconnect();
            }
        });
    }, observerOptions);
    
    skillsObserver.observe(skillsSection);
}

// Copy email to clipboard
function copyEmail() {
    const email = 'c-andriam@student.42antananarivo.mg';
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email copié dans le presse-papiers !', 'success');
    }).catch(() => {
        showNotification('Impossible de copier l\'email', 'error');
    });
}

// Add click event to email link
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        copyEmail();
    });
}

// Add project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Gestion de l'image animée
document.addEventListener('DOMContentLoaded', function() {
    const animatedQuote = document.querySelector('.animated-quote');
    
    if (animatedQuote) {
        // Ajouter un indicateur de chargement
        animatedQuote.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Gérer les erreurs de chargement
        animatedQuote.addEventListener('error', function() {
            const fallbackQuote = this.nextElementSibling;
            if (fallbackQuote && fallbackQuote.classList.contains('fallback-quote')) {
                this.style.display = 'none';
                fallbackQuote.style.display = 'block';
            }
        });
        
        // Style initial
        animatedQuote.style.opacity = '0';
        animatedQuote.style.transition = 'opacity 0.3s ease';
    }
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Ajoutez cette fonction à votre script.js existant

// Skills Radar Chart
function createSkillsRadar() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    
    // Données des compétences (0-100)
    const skills = [
        { name: 'C Programming', value: 90 },
        { name: 'Unix/Linux', value: 85 },
        { name: 'Algorithms', value: 80 },
        { name: 'Git/GitHub', value: 85 },
        { name: 'Shell Scripting', value: 75 },
        { name: 'Memory Management', value: 88 },
        { name: 'Data Structures', value: 82 },
        { name: 'Debugging', value: 78 }
    ];
    
    const numSkills = skills.length;
    const angleStep = (2 * Math.PI) / numSkills;
    
    // Couleurs
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
    const fillColor = getComputedStyle(document.documentElement).getPropertyValue('--text-accent').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    
    // Fonction pour dessiner le radar
    function drawRadar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner les cercles concentriques
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Dessiner les axes
        for (let i = 0; i < numSkills; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Labels
            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            
            ctx.fillStyle = textColor;
            ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(skills[i].name, labelX, labelY);
        }
        
        // Dessiner les données
        ctx.fillStyle = fillColor + '40'; // 40 = 25% opacity
        ctx.strokeStyle = fillColor;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < numSkills; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const value = (skills[i].value / 100) * radius;
            const x = centerX + Math.cos(angle) * value;
            const y = centerY + Math.sin(angle) * value;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Dessiner les points
        ctx.fillStyle = fillColor;
        for (let i = 0; i < numSkills; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const value = (skills[i].value / 100) * radius;
            const x = centerX + Math.cos(angle) * value;
            const y = centerY + Math.sin(angle) * value;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    drawRadar();
    
    // Redessiner lors du changement de thème
    window.addEventListener('themechange', drawRadar);
}

// Animation des achievement cards
function animateAchievements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    });
    
    document.querySelectorAll('.achievement-card').forEach(card => {
        observer.observe(card);
    });
}

// Animation des cercles du network
function animateNetworkCircles() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circles = entry.target.querySelectorAll('.circle');
                circles.forEach((circle, index) => {
                    setTimeout(() => {
                        circle.classList.add('animate-in');
                    }, index * 200);
                });
            }
        });
    });
    
    const networkProgress = document.querySelector('.network-progress');
    if (networkProgress) {
        observer.observe(networkProgress);
    }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
    createSkillsRadar();
    animateAchievements();
    animateNetworkCircles();
});

// CSS pour les animations (ajoutez à votre CSS)
const animationCSS = `
.achievement-card {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
}

.achievement-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.circle {
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.5s ease;
}

.circle.animate-in {
    opacity: 1;
    transform: scale(1);
}
`;

// Ajouter le CSS d'animation
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// Console easter egg
console.log(`
    ╔══════════════════════════════════════╗
    ║           🚀 Portfolio 42            ║
    ║                                      ║
    ║      Développé par: c-andriam        ║
    ║      École: 42 Antananarivo          ║
    ║      Milestone: 5                    ║
    ║                                      ║
    ║  "Code is poetry written in logic"   ║
    ╚══════════════════════════════════════╝
    
    Interested in hiring me? Let's talk!
    📧 c-andriam@student.42antananarivo.mg
`);
