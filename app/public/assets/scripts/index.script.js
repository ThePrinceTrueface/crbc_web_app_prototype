// Loader Screen Management
window.addEventListener('load', () => {
    // Simuler un temps de chargement minimum pour l'effet visuel
    setTimeout(() => {
        const loaderScreen = document.getElementById('loaderScreen');
        loaderScreen && loaderScreen.classList.add('hidden');

        // Démarrer les animations après la disparition du loader
        startPageAnimations();
    }, 2500); // 2.5 secondes pour un effet complet
});

function startPageAnimations() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Testimonials slider
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;

    function showSlide(index) {
        testimonialsSlider.style.transform = `translateX(-${index * 100}%)`;

        sliderDots.forEach(dot => dot.classList.remove('active'));
        sliderDots[index].classList.add('active');
        currentSlide = index;
    }

    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-rotate testimonials
    setInterval(() => {
        currentSlide = (currentSlide + 1) % sliderDots.length;
        showSlide(currentSlide);
    }, 5000);

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Add parallax effect to hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
        }
    });

    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    const heroTitleText = heroTitle.textContent;
    heroTitle.textContent = '';
    let charIndex = 0;

    function typeText() {
        if (charIndex < heroTitleText.length) {
            heroTitle.textContent += heroTitleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 50);
        }
    }

    // Start typing effect
    setTimeout(typeText, 500);

    // Add ripple effect to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.5);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                }
                
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                .btn-primary, .btn-secondary, .cta-button {
                    position: relative;
                    overflow: hidden;
                }
            `;
    document.head.appendChild(style);
}
