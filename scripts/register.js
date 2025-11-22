/**
 * Spring Owasis Store - register.js
 * Handles form submission and validation for the registration page.
 */
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;

            // --- Client-Side Validation ---

            // 1. Check if passwords match
            if (password !== confirmPassword) {
                alert('Error: Passwords do not match. Please try again.');
                document.getElementById('password').value = '';
                document.getElementById('confirm-password').value = '';
                document.getElementById('password').focus();
                return; // Stop form submission
            }

            // 2. Check terms acceptance (required attribute handles this, but good to check)
            if (!termsAccepted) {
                alert('Error: You must agree to the Terms and Conditions.');
                return;
            }

            // --- Submission Logic ---

            console.log('--- Registration Attempt ---');
            console.log('Full Name:', name);
            console.log('Email:', email);
            console.log('Password Length:', password.length);
            console.log('Terms Accepted:', termsAccepted);

            // In a real application, you would send this data to your server.

            // Simulate a successful registration and redirect to login
            setTimeout(() => {
                alert('Registration successful! Redirecting to the Login page.');
                location.href = 'login.html';
            }, 700);
        });
    }
});