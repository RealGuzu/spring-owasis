/**
 * Spring Owasis Store - About Page
 */

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    initNavigation();
});

// Update cart badge
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
    }
}

// Initialize navigation click handlers
function initNavigation() {
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            console.log('Search functionality coming soon');
        });
    }
}