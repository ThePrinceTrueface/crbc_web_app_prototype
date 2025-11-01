// Search functionality
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        // Rediriger vers la page de recherche avec le terme
        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    }
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on load
    const errorContainer = document.querySelector('.error-container');
    errorContainer.style.opacity = '0';
    errorContainer.style.transform = 'translateY(20px)';

    setTimeout(() => {
        errorContainer.style.transition = 'all 0.8s ease';
        errorContainer.style.opacity = '1';
        errorContainer.style.transform = 'translateY(0)';
    }, 100);
});

// Track 404 errors (optional - for analytics)
console.log('404 Error: Page not found -', window.location.href);

// Auto-focus search input for better UX
setTimeout(() => {
    document.getElementById('searchInput').focus();
}, 1000);
