// MeowBTI site script — partial loader, scroll-shadow, smooth-anchor scroll,
// i18n DOM walker, and a thin GA event wrapper used by other scripts.

// Thin wrapper around gtag for funnel events. Safe to call before gtag loads
// (push lands in dataLayer; gtag flushes on init). Other scripts call this.
if (!window.MeowTrack) {
    window.MeowTrack = function (name, params) {
        try {
            if (typeof gtag === 'function') gtag('event', name, params || {});
            else if (window.dataLayer) window.dataLayer.push({ event: name, ...(params || {}) });
        } catch (_) {}
    };
}

document.addEventListener('DOMContentLoaded', () => {

    // Walk every [data-i18n] in a root and apply the translation. Also patches
    // every [data-i18n-href] to carry ?lang=th forward when in TH mode, and
    // wires lang-switcher pills if any are present.
    function applyI18n(root) {
        if (!window.MeowI18n) return;
        const { t, withLang, getLang, setLang } = window.MeowI18n;
        const lang = getLang();
        root.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = t(key);
            if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
            else el.textContent = value;
        });
        root.querySelectorAll('[data-i18n-href]').forEach(el => {
            const href = el.getAttribute('href');
            if (href) el.setAttribute('href', withLang(href));
        });
        root.querySelectorAll('.lang-switcher .lang-pill').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
            if (btn._meowLangBound) return;
            btn._meowLangBound = true;
            btn.addEventListener('click', () => {
                const next = btn.dataset.lang;
                if (next === getLang()) return;
                window.MeowTrack && window.MeowTrack('lang_switched', { from: getLang(), to: next });
                setLang(next);
                const url = new URL(window.location.href);
                if (next === 'en') url.searchParams.delete('lang');
                else url.searchParams.set('lang', next);
                window.location.href = url.toString();
            });
        });
    }

    function loadComponent(url, elementId) {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (!element) return;
                element.innerHTML = data;
                applyI18n(element);
            })
            .catch(error => console.error('Error loading component:', error));
    }

    // Translate any [data-i18n] elements that were already in the static HTML.
    applyI18n(document);

    // Load header and footer into their placeholders. Root-relative so they
    // work from any subdirectory (e.g. /personality-types/CHBR.html).
    loadComponent('/nav.html', 'main-header');
    loadComponent('/footer.html', 'main-footer');

    // Sync <html lang> attribute with active language.
    if (window.MeowI18n) {
        document.documentElement.lang = window.MeowI18n.getLang();
    }

    // Sticky navbar shadow on scroll.
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Smooth-scroll for in-page anchor links. Wait for nav to inject so newly
    // added anchors get listeners too.
    setTimeout(() => {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#') && document.querySelector(href)) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            });
        });
    }, 500);
});
