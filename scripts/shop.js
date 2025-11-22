// Add to cart functionality
document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
        const product = {
            name: btn.dataset.name,
            price: parseInt(btn.dataset.price),
            image: btn.dataset.image,
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item => item.name === product.name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        saveCartToUser();
        updateCartBadge();

        // Visual feedback
        btn.textContent = "Added!";
        btn.style.background = "#4CAF50";
        setTimeout(() => {
            btn.textContent = "Add to Cart";
            btn.style.background = "";
        }, 1000);
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

// Initialize badge on page load
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
});