/**
 * MeowBTI Household Canon & Worldbuilding System v1
 * Generates persistent truths, legendary events, and internal culture for households.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function generateCanon(history, profiles) {
        const canon = [];
        if (history.length < 5) return canon;

        const recent = history.slice(0, 30);
        const lowEnergySocialHiding = recent.filter(h => h.answers.energy === 'low' && h.answers.social === 'hiding').length;
        const highStress = recent.filter(h => h.answers.stress === 'overloaded').length;

        // 1. Communication Canon
        if (lowEnergySocialHiding > recent.length * 0.4) {
            canon.push({ label: "Communication", text: t('canParallel') });
        } else {
            canon.push({ label: "Coping Strategy", text: t('canAvoidance') });
        }

        // 2. Rest Canon
        if (recent.filter(h => h.answers.energy === 'low').length > recent.length * 0.5) {
            canon.push({ label: "Universal Truth", text: t('canNoRest') });
        }

        // 3. Infrastructure Canon
        if (highStress > recent.length * 0.3) {
            canon.push({ label: "Infrastructure", text: t('canSnackInfra') });
        }

        return canon.slice(0, 3);
    }

    function getLegendaryEvents(history) {
        const events = [];
        if (history.length < 7) return events;

        const days = [...new Set(history.map(h => h.date))].sort().reverse();
        
        // Blanket Redistribution (proxied by collective low energy spikes)
        const lowEnergyDays = days.filter(ds => {
            const dayCheckins = history.filter(h => h.date === ds);
            return dayCheckins.every(c => c.answers.energy === 'low');
        });
        if (lowEnergyDays.length > 0) {
            events.push({ id: 'evBlanketRedist', title: t('evBlanketRedist'), emoji: '🛌' });
        }

        // Loud Weekend
        const weekends = days.filter(ds => {
            const d = new Date(ds).getDay();
            return d === 0 || d === 6;
        });
        const loudWeekends = weekends.filter(ds => {
            const dayCheckins = history.filter(h => h.date === ds);
            return dayCheckins.some(c => c.answers.stress === 'overloaded');
        });
        if (loudWeekends.length > 0) {
            events.push({ id: 'evLoudWeekend', title: t('evLoudWeekend'), emoji: '⚡' });
        }

        // Emergency Rotting
        if (history.filter(h => h.answers.social === 'hiding' && h.answers.energy === 'low').length > 5) {
            events.push({ id: 'evRottingMarathon', title: t('evRottingMarathon'), emoji: '☁️' });
        }

        return events.slice(0, 4);
    }

    function getCulture(profiles) {
        const culture = [];
        if (profiles.length < 2) return culture;

        // Conflict Culture
        culture.push({ title: t('cultConflictTitle'), desc: t('cultConflictDesc') });
        // Recovery Culture
        culture.push({ title: t('cultRecoveryTitle'), desc: t('cultRecoveryDesc') });
        // Social Culture
        culture.push({ title: t('cultSocialTitle'), desc: t('cultSocialDesc') });

        return culture;
    }

    function renderCanon() {
        const host = window.MeowOS ? window.MeowOS.getLayer('memory') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-canon-system');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-canon-system';
            container.className = 'canon-system-container animate-fade-in';
            // Append at the very bottom or before social proof
            host.append(container);
        }

        const history = getHistory();
        const canon = generateCanon(history, profiles);
        const events = getLegendaryEvents(history);
        const culture = getCulture(profiles);

        if (canon.length === 0 && events.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="wm-header">
                <h2 class="wm-title">${t('canonTitle')}</h2>
                <p class="wm-intro">${t('canonIntro')}</p>
            </div>

            <div class="canon-grid">
                ${canon.map(c => `
                    <div class="canon-card">
                        <button class="micro-share-icon mini" data-type="canon" data-text="Household Canon: ${c.text}">📤</button>
                        <span class="canon-label">${c.label}</span>
                        <div class="canon-text">${c.text}</div>
                    </div>
                `).join('')}
            </div>

            <div class="culture-row">
                ${culture.map(c => `
                    <div class="culture-card">
                        <h4>${c.title}</h4>
                        <p>${c.desc}</p>
                    </div>
                `).join('')}
            </div>

            ${events.length > 0 ? `
                <div class="legendary-events-section">
                    <div class="le-header">
                        <h3 class="le-title">Legendary Incidents</h3>
                    </div>
                    <div class="event-strip">
                        ${events.map(e => `
                            <div class="event-item">
                                <span>${e.emoji} ${e.title}</span>
                                <button class="micro-share-icon mini" style="position:static; background:transparent; border-color:rgba(255,255,255,0.2); color:#fff;" 
                                        data-type="legend" data-text="Legendary Incident: ${e.title}">📤</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_canon',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        if (canon.length > 0 && window.MeowTrack) {
            window.MeowTrack('canon_detected', {
                canon_count: canon.length,
                profile_count: profiles.length,
                lang: getLang()
            });
        }
    }

    window.MeowCanon = {
        getLegendaryEvents,
        generateCanon,
        getCulture
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCanon);
    } else {
        renderCanon();
    }

    window.addEventListener('meow:daily:updated', renderCanon);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderCanon();
    });
})();
