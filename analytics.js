/**
 * MeowBTI Analytics & Core Web Vitals Monitoring
 * Lightweight instrumentation for product behavior and performance.
 */
(function() {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    function track(eventName, payload = {}) {
        if (isDev) console.log(`[MeowAnalytics] ${eventName}`, payload);

        try {
            // Support existing window.MeowTrack if it was used
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, payload);
            } else if (window.dataLayer) {
                window.dataLayer.push({ event: eventName, ...payload });
            }
        } catch (e) {
            if (isDev) console.error('MeowAnalytics error:', e);
        }
    }

    // Replace or augment the thin wrapper in script.js
    window.MeowTrack = track;
    window.MeowAnalytics = { 
        track,
        microShare: async function(payload) {
            const { framework, content_type, text, route } = payload;
            const lang = (window.MeowI18n && window.MeowI18n.getLang()) || 'en';
            const url = window.location.origin + (route || window.location.pathname);
            const shareText = `${text}\n\n${url}`;

            track('micro_share_attempt', {
                framework,
                content_type,
                route: route || window.location.pathname,
                lang
            });

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'MeowBTI Insight',
                        text: shareText
                    });
                } catch (e) {
                    console.warn('Share cancelled or failed', e);
                }
            } else {
                try {
                    await navigator.clipboard.writeText(shareText);
                    const msg = lang === 'th' ? 'คัดลอกข้อความแล้ว!' : 'Text copied to clipboard!';
                    alert(msg);
                } catch (e) {
                    console.error('Clipboard failed', e);
                }
            }
        }
    };

    // --- Global Bridge Click Listener ---
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        
        let targetFramework = null;
        if (href.includes('/mbti/')) targetFramework = 'mbti';
        else if (href.includes('/enneagram/')) targetFramework = 'enneagram';
        else if (href.includes('human-quiz.html')) targetFramework = 'human';
        else if (href.includes('quiz.html')) targetFramework = 'cat';
        else if (href.includes('daily.html')) targetFramework = 'daily_weather';
        else if (href.includes('/personality-types/') || href.includes('/human-types/')) {
            track('archetype_bridge', {
                source_route: window.location.pathname,
                target_href: href
            });
            return;
        }

        if (targetFramework) {
            track('bridge_click', {
                target_framework: targetFramework,
                source_route: window.location.pathname,
                target_href: href
            });
        }
    });

    // --- Core Web Vitals ---
    if ('PerformanceObserver' in window) {
        // FCP
        try {
            const fcpObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        track('web_vital', {
                            metric_name: 'FCP',
                            metric_value: Math.round(entry.startTime),
                            route: window.location.pathname
                        });
                        fcpObserver.disconnect();
                    }
                }
            });
            fcpObserver.observe({ type: 'paint', buffered: true });
        } catch (e) {}

        // LCP
        try {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                track('web_vital', {
                    metric_name: 'LCP',
                    metric_value: Math.round(lastEntry.startTime),
                    route: window.location.pathname
                });
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {}

        // CLS
        try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });

            window.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    track('web_vital', {
                        metric_name: 'CLS',
                        metric_value: parseFloat(clsValue.toFixed(4)),
                        route: window.location.pathname
                    });
                }
            });
        } catch (e) {}

        // INP (Interaction to Next Paint) - Simplified
        try {
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.interactionId) {
                        track('web_vital', {
                            metric_name: 'INP_CANDIDATE',
                            metric_value: Math.round(entry.duration),
                            route: window.location.pathname
                        });
                    }
                }
            }).observe({ type: 'event', buffered: true, durationThreshold: 100 });
        } catch (e) {}

        // TTFB
        try {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                track('web_vital', {
                    metric_name: 'TTFB',
                    metric_value: Math.round(navigation.responseStart),
                    route: window.location.pathname
                });
            }
        } catch (e) {}
    }
})();
