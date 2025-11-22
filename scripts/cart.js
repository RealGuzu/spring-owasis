// Load cart from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.querySelector(".cart-items");
    const summarySubtotal = document.querySelector(".summary-row:nth-child(1) span:last-child");
    const summaryDelivery = document.querySelector(".summary-row:nth-child(2) span:last-child");
    const summaryTotal = document.querySelector(".summary-total span:last-child");

    // Clear existing items (keep only dynamically loaded ones)
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <h2 style="margin-bottom: 16px; color: #0d47a1;">Your cart is empty</h2>
                <p style="margin-bottom: 24px;">Add some water products to get started!</p>
                <a href="/Pages/shop.html" style="display: inline-block; padding: 12px 24px; background: #2196F3; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Shop Now</a>
            </div>
        `;
        updateSummary(0, 0, 0);
        return;
    }

    // Render each cart item
    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.dataset.index = index;

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            
            <div class="item-info">
                <h2>${item.name}</h2>
                <p class="item-price">$${item.price}</p>
            </div>
            
            <div class="item-quantity">
                <button class="qty-btn decrease" data-index="${index}">-</button>
                <span class="qty-number">${item.quantity}</span>
                <button class="qty-btn increase" data-index="${index}">+</button>
            </div>
            
            <button class="remove-item" data-index="${index}">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 0 ? 300 : 0;
    const total = subtotal + delivery;

    updateSummary(subtotal, delivery, total);
    attachEventListeners();
}

// Update summary display
function updateSummary(subtotal, delivery, total) {
    const summarySubtotal = document.querySelector(".summary-row:nth-child(1) span:last-child");
    const summaryDelivery = document.querySelector(".summary-row:nth-child(2) span:last-child");
    const summaryTotal = document.querySelector(".summary-total span:last-child");

    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal}`;
    if (summaryDelivery) summaryDelivery.textContent = `$${delivery}`;
    if (summaryTotal) summaryTotal.textContent = `$${total}`;
}

// Attach event listeners to buttons
function attachEventListeners() {
    // Increase quantity
    document.querySelectorAll(".qty-btn.increase").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart[index].quantity++;
            localStorage.setItem("cart", JSON.stringify(cart));
            saveCartToUser();
            loadCart();
            updateCartBadge();
        });
    });

    // Decrease quantity
    document.querySelectorAll(".qty-btn.decrease").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            saveCartToUser();
            loadCart();
            updateCartBadge();
        });
    });

    // Remove item
    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            saveCartToUser();
            loadCart();
            updateCartBadge();
        });
    });

    // Checkout button
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            alert("Proceeding to checkout... (This would redirect to checkout page)");
            // You can redirect to checkout page here
            // window.location.href = "/Pages/checkout.html";
        });
    }
}

// Update cart badge
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector(".cart-badge");
    if (badge) {
        badge.textContent = totalItems;
    }
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", () => {
    // Load user's cart if logged in
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (session) {
        const userCart = JSON.parse(localStorage.getItem(`cart_${session.userId}`)) || [];
        if (userCart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(userCart));
        }
    }
    loadCart();
    updateCartBadge();
});

// Save cart to user account if logged in
function saveCartToUser() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (session) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem(`cart_${session.userId}`, JSON.stringify(cart));
    }
}