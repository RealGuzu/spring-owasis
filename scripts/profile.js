/**
 * Spring Owasis Store - Profile Page
 */

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    updateCartBadge();
    initTabs();
    initForms();
    initProfilePicture();
    initPaymentSection();
});

// Check if user is logged in
function checkAuthStatus() {
    const session = JSON.parse(localStorage.getItem('currentSession'));

    if (!session) {
        document.getElementById('not-logged-in').style.display = 'flex';
        document.getElementById('profile-content').style.display = 'none';
        return;
    }

    document.getElementById('not-logged-in').style.display = 'none';
    document.getElementById('profile-content').style.display = 'block';
    loadUserData();
}

// Load user data into form
function loadUserData() {
    const user = getCurrentUser();
    if (!user) return;

    // Header info
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('member-since').textContent = `Member since: ${formatDate(user.createdAt)}`;

    // Profile picture
    const profilePic = document.getElementById('profile-picture');
    profilePic.src = user.profile?.profilePicture || '/assets/default-avatar.png';
    profilePic.onerror = () => { profilePic.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="35" r="25" fill="%23ddd"/><ellipse cx="50" cy="85" rx="40" ry="30" fill="%23ddd"/></svg>'; };

    // Personal info
    document.getElementById('full-name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.profile?.phone || '';
    document.getElementById('dob').value = user.profile?.dob || '';

    // Address
    document.getElementById('street').value = user.profile?.address?.street || '';
    document.getElementById('city').value = user.profile?.address?.city || '';
    document.getElementById('parish').value = user.profile?.address?.parish || '';
    document.getElementById('postal-code').value = user.profile?.address?.postalCode || '';
    document.getElementById('delivery-instructions').value = user.profile?.address?.instructions || '';

    // Payment methods
    renderPaymentMethods(user.profile?.paymentMethods || []);

    // Order history
    renderOrderHistory(user.orders || []);
}

// Get current user
function getCurrentUser() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (!session) return null;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.id === session.userId);
}

// Save user data
function saveUserData(updates) {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (!session) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const idx = users.findIndex(u => u.id === session.userId);

    if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
        showNotification('Changes saved successfully!', 'success');
    }
}

// Initialize tabs
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
        });
    });
}

// Initialize forms
function initForms() {
    // Personal form
    document.getElementById('personal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        saveUserData({
            name: document.getElementById('full-name').value,
            profile: {
                ...user.profile,
                phone: document.getElementById('phone').value,
                dob: document.getElementById('dob').value
            }
        });
        document.getElementById('user-name').textContent = document.getElementById('full-name').value;
    });

    // Address form
    document.getElementById('address-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        saveUserData({
            profile: {
                ...user.profile,
                address: {
                    street: document.getElementById('street').value,
                    city: document.getElementById('city').value,
                    parish: document.getElementById('parish').value,
                    postalCode: document.getElementById('postal-code').value,
                    instructions: document.getElementById('delivery-instructions').value
                }
            }
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// Profile picture upload
function initProfilePicture() {
    document.getElementById('picture-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            document.getElementById('profile-picture').src = base64;

            const user = getCurrentUser();
            saveUserData({
                profile: { ...user.profile, profilePicture: base64 }
            });
        };
        reader.readAsDataURL(file);
    });
}

// Payment methods
function initPaymentSection() {
    document.getElementById('add-payment-btn').addEventListener('click', () => {
        document.getElementById('payment-form-container').style.display = 'block';
    });

    document.getElementById('cancel-payment').addEventListener('click', () => {
        document.getElementById('payment-form-container').style.display = 'none';
        document.getElementById('payment-form').reset();
    });

    document.getElementById('card-number').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    });

    document.getElementById('card-expiry').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/').substr(0, 5);
    });

    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        const payments = user.profile?.paymentMethods || [];

        payments.push({
            id: 'card_' + Date.now(),
            name: document.getElementById('card-name').value,
            last4: document.getElementById('card-number').value.slice(-4),
            expiry: document.getElementById('card-expiry').value,
            type: getCardType(document.getElementById('card-number').value)
        });

        saveUserData({ profile: { ...user.profile, paymentMethods: payments } });
        renderPaymentMethods(payments);

        document.getElementById('payment-form-container').style.display = 'none';
        document.getElementById('payment-form').reset();
    });
}

function getCardType(number) {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    return 'Card';
}

function renderPaymentMethods(methods) {
    const container = document.getElementById('payment-list');
    if (!methods.length) {
        container.innerHTML = '<p class="empty-text">No payment methods saved</p>';
        return;
    }

    container.innerHTML = methods.map(m => `
        <div class="payment-card">
            <div class="card-info">
                <span class="card-type">${m.type}</span>
                <span class="card-number">•••• •••• •••• ${m.last4}</span>
                <span class="card-expiry">Expires ${m.expiry}</span>
            </div>
            <button class="delete-card" data-id="${m.id}">×</button>
        </div>
    `).join('');

    container.querySelectorAll('.delete-card').forEach(btn => {
        btn.addEventListener('click', () => deletePaymentMethod(btn.dataset.id));
    });
}

function deletePaymentMethod(id) {
    const user = getCurrentUser();
    const payments = (user.profile?.paymentMethods || []).filter(m => m.id !== id);
    saveUserData({ profile: { ...user.profile, paymentMethods: payments } });
    renderPaymentMethods(payments);
}

function renderOrderHistory(orders) {
    const container = document.getElementById('orders-list');
    if (!orders.length) {
        container.innerHTML = '<div class="empty-state"><p>No orders yet</p><a href="/Pages/shop.html" class="shop-link">Start Shopping</a></div>';
        return;
    }
    container.innerHTML = orders.map(o => `
        <div class="order-card">
            <div class="order-header"><span>Order #${o.id}</span><span>${formatDate(o.date)}</span></div>
            <div class="order-total">$${o.total}</div>
            <div class="order-status ${o.status}">${o.status}</div>
        </div>
    `).join('');
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function logout() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (session) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem(`cart_${session.userId}`, JSON.stringify(cart));
    }
    localStorage.removeItem('currentSession');
    localStorage.setItem('cart', JSON.stringify([]));
    window.location.href = '/index.html';
}

function showNotification(msg, type) {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = cart.reduce((s, i) => s + i.quantity, 0);
}