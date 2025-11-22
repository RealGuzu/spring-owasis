/**
 * Spring Owasis Store - index.js
 * Initializes interactive elements on the landing page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Cart Badge Initialization ---
    loadUserCart();
    updateCartBadge();
    updateAuthUI();

    // --- Navigation Element Initialization ---
    const navIcons = {
        search: document.querySelector('.search-icon'),
        shop: document.querySelector('.shop-icon'),
        profile: document.querySelector('.profile-icon'),
        cart: document.querySelector('.cart-icon')
    };

    // Add click handlers for navigation icons
    if (navIcons.search) {
        navIcons.search.addEventListener('click', () => {
            console.log('Search icon clicked. Functionality to be added.');
            // Example: Show search overlay or redirect to search page
        });
    }

    if (navIcons.shop) {
        navIcons.shop.addEventListener('click', () => {
            location.href = '/Pages/shop.html';
        });
    }

    if (navIcons.profile) {
        navIcons.profile.addEventListener('click', () => {
            console.log('Profile icon clicked. Functionality to be added.');
            // Example: location.href = '/Pages/profile.html';
        });
    }

    if (navIcons.cart) {
        navIcons.cart.addEventListener('click', () => {
            location.href = '/Pages/cart.html';
        });
    }

    // --- Hero Section Button Initialization ---
    const loginHeroButton = document.querySelector('.login-herobutton');
    if (loginHeroButton) {
        // Button text and behavior will be set by updateAuthUI()
        loginHeroButton.removeAttribute('onclick');
    }

    const shopHeroButton = document.querySelector('.shop-herobutton');
    if (shopHeroButton) {
        shopHeroButton.addEventListener('click', () => {
            location.href = '/Pages/shop.html';
        });
    }

    // --- FAQ Section Accordion Behavior ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
});

// Update cart badge with total quantity
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector(".cart-badge");
    if (badge) {
        badge.textContent = totalItems;
    }
}

// Load user's cart if logged in
function loadUserCart() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (session) {
        const userCart = JSON.parse(localStorage.getItem(`cart_${session.userId}`)) || [];
        if (userCart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(userCart));
        }
    }
}

// Update UI based on auth status
function updateAuthUI() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    const loginBtn = document.querySelector('.login-herobutton');

    if (loginBtn) {
        if (session) {
            loginBtn.textContent = 'My Account';
            loginBtn.onclick = () => { window.location.href = '/Pages/profile.html'; };
        } else {
            loginBtn.textContent = 'Sign In';
            loginBtn.onclick = () => { window.location.href = '/Pages/login.html'; };
        }
    }
}