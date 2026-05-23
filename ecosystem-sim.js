/**
 * MeowBTI Autonomous Civilization Simulation v1
 * Generates unscripted incidents, rumors, and rogue doctrines across the ecosystem.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getSeed() {
        const d = new Date();
        return `${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
    }

    // Deterministic random based on daily seed + string
    function seededRandom(str) {
        let hash = 0;
        const seed = getSeed() + str;
        for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        return Math.abs(hash) / 2147483647;
    }

    const RUMORS = ['rumorVertical', 'rumorSoupRogue', 'rumorBlanketSing'];
    const INCIDENTS = ['incSoupLow', 'incBlanketOverload', 'incParallelRenew', 'incChargerMissing'];
    const DOCTRINES = ['docProdRot', 'docWeaponSoup', 'docTacSilence'];

    function generateFeed(history, forged) {
        const feed = [];
        
        // 1. Daily Rumor (Changes daily based on seed)
        const activeRumor = RUMORS[Math.floor(seededRandom('rumors') * RUMORS.length)];
        feed.push({ type: 'rumor', text: t(activeRumor) });

        // 2. Incident based on recent history
        if (history.length > 5) {
            const recent = history.slice(0, 5);
            if (recent.filter(h => h.answers.stress === 'overloaded').length >= 3) {
                feed.push({ type: 'incident', text: t('incBlanketOverload') });
            } else if (recent.filter(h => h.answers.energy === 'low').length >= 3) {
                feed.push({ type: 'incident', text: t('incSoupLow') });
            } else {
                feed.push({ type: 'incident', text: t('incParallelRenew') });
            }
        }

        // 3. Rogue Doctrine
        // 30% chance of a rogue doctrine appearing
        if (seededRandom('doctrine') > 0.7) {
            const doc = DOCTRINES[Math.floor(seededRandom('rogue') * DOCTRINES.length)];
            feed.push({ type: 'mutation', text: `Warning: ${t(doc)} detected in adjacent systems.` });
        }

        // 4. Wandering Relic Alert & Saga Chains
        if (seededRandom('missing') > 0.8 && forged.length > 0) {
            const missing = forged[Math.floor(seededRandom('relic') * forged.length)];
            feed.push({ type: 'missing', text: `${missing.customName || missing.name} is ${t('statusMissing')}` });
            
            window.MeowEcosystemState = window.MeowEcosystemState || {};
            window.MeowEcosystemState.missingRelicId = missing.id;

            // Saga Chain Trigger
            if (missing.id === 'relCharger') {
                 feed.push({ type: 'mutation', text: `Saga Initiated: ${t('sagaGreatCharger')}` });
                 window.MeowEcosystemState.activeSaga = 'sagaGreatCharger';
            } else if (missing.id === 'relSoup') {
                 feed.push({ type: 'mutation', text: `Saga Initiated: ${t('sagaSoupCrisis')}` });
                 window.MeowEcosystemState.activeSaga = 'sagaSoupCrisis';
            }
        } else {
            if (window.MeowEcosystemState) {
                window.MeowEcosystemState.missingRelicId = null;
                window.MeowEcosystemState.activeSaga = null;
            }
        }

        // 5. Federation Drift
        const federation = window.MeowStore.getFederation ? window.MeowStore.getFederation() : [];
        if (federation.length > 0 && seededRandom('drift') > 0.85) {
            feed.push({ type: 'incident', text: t('statusDrifting') });
        }

        return feed;
    }

    function renderEcosystemFeed() {
        const host = window.MeowOS ? window.MeowOS.getLayer('lore') : document.getElementById('family-content');
        if (!host) return;
        if (window.MeowOS && !window.MeowOS.isUnlocked('possession')) {
            window.MeowOS.renderLock(host, 'possession', 'unlockHintArch');
            return;
        }

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('ecosystem-feed-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ecosystem-feed-section';
            container.className = 'ecosystem-feed-container animate-fade-in';
            // Insert after world events or near the top
            const we = document.getElementById('global-world-event');
            if (we) we.after(container);
            else host.prepend(container);
        }

        const history = window.MeowDaily.getHistory() || [];
        const forged = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];
        const feed = generateFeed(history, forged);

        if (feed.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="feed-header">${t('ecoTitle')}</div>
            <div class="feed-scroll">
                ${feed.map(f => `
                    <div class="feed-item ${f.type}">
                        [${f.type.toUpperCase()}] ${f.text}
                        <button class="micro-share-icon mini" data-type="${f.type}" data-text="Ecosystem ${f.type.toUpperCase()}: ${f.text}">📤</button>
                    </div>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'ecosystem_simulation',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        if (window.MeowTrack) {
            window.MeowTrack('ecosystem_feed_view', { items_count: feed.length, lang: getLang() });
            feed.forEach(f => {
                if (f.type === 'incident') window.MeowTrack('incident_generated', { text: f.text, lang: getLang() });
                if (f.type === 'mutation') {
                    window.MeowTrack('doctrine_mutated', { text: f.text, lang: getLang() });
                    if (f.text.includes('Saga Initiated')) {
                        window.MeowTrack('saga_chain_started', { text: f.text, lang: getLang() });
                    }
                }
                if (f.type === 'missing') window.MeowTrack('relic_migrated', { text: f.text, lang: getLang() });
                if (f.type === 'rumor') window.MeowTrack('rumor_detected', { text: f.text, lang: getLang() });
            });
        }
    }

    // Export state for other modules (Museum, Federation)
    window.MeowEcosystemState = window.MeowEcosystemState || {};

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderEcosystemFeed);
    } else {
        renderEcosystemFeed();
    }

    window.addEventListener('meow:daily:updated', renderEcosystemFeed);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderEcosystemFeed();
    });
})();
