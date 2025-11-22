document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            // Prevent the default form submission (which causes a page reload)
            event.preventDefault();

            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.querySelector('input[name="remember"]').checked;

            console.log('--- Login Attempt ---');
            console.log('Email:', email);
            // In a real application, NEVER log the password!
            console.log('Password Length:', password.length > 0 ? 'Entered' : 'Empty');
            console.log('Remember Me:', rememberMe); a

            // Here is where you would typically:
            // 1. Send an AJAX request (fetch/axios) to your server's login endpoint.
            // 2. Handle the server's response (success/failure).
            // 3. On success, redirect the user (e.g., location.href = '../index.html').

            // For demonstration, we'll simulate a redirect after a delay
            setTimeout(() => {
                alert('Login successful (simulated)! Redirecting to home page...');
                location.href = '../index.html';
            }, 500);
        });
    }
});