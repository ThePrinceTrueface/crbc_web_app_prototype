document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu --- //
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });

        const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --- Header Scroll Effect --- //
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Search Form --- //
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchInput = document.getElementById('searchInput');
            const searchTerm = searchInput.value.trim();

            if (searchTerm) {
                // TODO: Redirect to a proper search results page, not a static HTML file.
                window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // --- Animations --- //
    const errorContainer = document.querySelector('.error-container');
    if (errorContainer) {
        errorContainer.style.opacity = '0';
        errorContainer.style.transform = 'translateY(20px)';

        setTimeout(() => {
            errorContainer.style.transition = 'all 0.8s ease';
            errorContainer.style.opacity = '1';
            errorContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    // --- Ripple Effect on Buttons --- //
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .search-button, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create and append ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect'); // Use a class for styling

            this.appendChild(ripple);

            // Clean up the ripple element
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Inject ripple CSS dynamically (to keep it self-contained)
    const rippleStyle = `
        .btn-primary, .btn-secondary, .search-button, .cta-button {
            position: relative;
            overflow: hidden;
        }
        .ripple-effect {
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
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = rippleStyle;
    document.head.appendChild(styleSheet);

    // --- Analytics and UX --- //
    console.log('404 Error: Page not found -', window.location.href);

    // Auto-focus search input for better UX
    /*const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        setTimeout(() => {
            searchInput.focus();
        }, 1000);
    }*/
});
