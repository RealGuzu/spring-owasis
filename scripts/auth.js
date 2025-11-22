/**
 * Spring Owasis Store - Authentication System
 * Handles user registration, login, logout, and session management
 */

// Initialize auth system
document.addEventListener('DOMContentLoaded', () => {
    initAuthForms();
    updateCartBadge();
});

// Initialize form handlers
function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('register-container').style.display = 'block';
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'block';
        });
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Set current session
        const session = {
            userId: user.id,
            email: user.email,
            name: user.name,
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('currentSession', JSON.stringify(session));

        // Load user's cart
        const userCart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
        localStorage.setItem('cart', JSON.stringify(userCart));

        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {

            window.location.href = '/index.html';
        }, 1000);
    } else {
        showMessage('Invalid email or password', 'error');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showMessage('Email already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        profile: {
            phone: '',
            address: {
                street: '',
                city: '',
                parish: '',
                postalCode: ''
            },
            profilePicture: '',
            paymentMethods: []
        }
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    const session = {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('currentSession', JSON.stringify(session));

    showMessage('Account created successfully! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 1000);
}

// Generate unique user ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show message
function showMessage(text, type) {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentSession') !== null;
}

// Get current user
function getCurrentUser() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (!session) return null;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.id === session.userId);
}

// Logout
function logout() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (session) {
        // Save current cart to user's cart
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem(`cart_${session.userId}`, JSON.stringify(cart));
    }

    localStorage.removeItem('currentSession');
    localStorage.setItem('cart', JSON.stringify([]));
    window.location.href = '/index.html';
}

// Update cart badge
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
    }
}

// Save cart to user account
function saveCartToUser() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (session) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem(`cart_${session.userId}`, JSON.stringify(cart));
    }
}