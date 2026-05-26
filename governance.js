/**
 * MeowBTI Federation Embargoes & Emotional Governance v1
 * Manages ideological conflicts, forbidden doctrines, and relic confiscation.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function calculateStability(history, federation) {
        let score = 100;
        
        // Penalize for frequent recent chaos
        const recent = history.slice(0, 10);
        const loudCount = recent.filter(h => h.answers.stress === 'overloaded').length;
        score -= (loudCount * 5);

        // Penalize for conflicting alliances
        const localSnapshot = window.MeowFederation ? window.MeowFederation.getLocalCivilizationSnapshot() : {};
        const conflicts = federation.filter(f => f.doctrine && localSnapshot.doctrine && f.doctrine !== localSnapshot.doctrine).length;
        score -= (conflicts * 10);

        // Check active rogue doctrines from ecosystem
        if (window.MeowEcosystemState && window.MeowEcosystemState.activeSaga) {
            score -= 20;
        }
        
        // Include consequences from decisions
        const civDecisions = window.MeowStore.getCivDecisions ? window.MeowStore.getCivDecisions() : {};
        if (civDecisions.stabilityModifier) {
            score += civDecisions.stabilityModifier;
        }

        score = Math.max(0, Math.min(100, score));

        let status = 'statStable';
        if (score < 30) status = 'statCollapse';
        else if (score < 50) status = 'statFragile';
        else if (score < 80) status = 'statStrained';

        return { score, status };
    }

    function generateEmbargoes(localDoctrine, stability, federation) {
        const embargoes = [];
        
        if (stability.score < 40) {
            if (localDoctrine === 'thParallelIntimacy') embargoes.push(t('embLoudDenied'));
            if (localDoctrine === 'thSoupLabor') embargoes.push(t('embBlanketBan'));
            if (localDoctrine === 'thBlanketGov') embargoes.push(t('embSoupSuspended'));
        }

        // Dissolved pacts based on federation strain
        if (federation.length > 0 && stability.score < 50) {
            embargoes.push(t('trpPactDissolved'));
        }

        return embargoes;
    }

    function generateUndergroundCells(stability) {
        const cells = [];
        if (stability.score > 70) return cells; // Only spawn when unstable

        // Deterministic daily rotation for cells
        const seed = new Date().toDateString();
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        
        const possible = ['undBasementSoup', 'undSilentCharger', 'undHorizontalRes', 'undSmugglingRoute'];
        
        cells.push(t(possible[Math.abs(hash) % possible.length]));
        if (stability.score < 30) {
            cells.push(t(possible[Math.abs(hash + 1) % possible.length]));
        }

        return [...new Set(cells)];
    }

    function renderGovernance() {
        const host = window.MeowOS ? window.MeowOS.getLayer('identity') : document.getElementById('family-content');
        if (!host) return;
        if (window.MeowOS && !window.MeowOS.isUnlocked('governance')) {
            window.MeowOS.renderLock(host, 'governance', 'unlockHintGov');
            return;
        }

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-governance-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-governance-section';
            container.className = 'governance-container animate-fade-in';
            // Insert before Federation
            const fed = document.getElementById('household-federation-section');
            if (fed) fed.before(container);
            else host.append(container);
        }

        const history = getHistory();
        const federation = window.MeowStore.getFederation ? window.MeowStore.getFederation() : [];
        const local = window.MeowFederation ? window.MeowFederation.getLocalCivilizationSnapshot() : {};
        
        const stability = calculateStability(history, federation);
        const embargoes = generateEmbargoes(local.doctrine, stability, federation);
        const cells = generateUndergroundCells(stability);

        // Export state for museum to confiscate relics
        window.MeowGovernanceState = {
            embargoesActive: embargoes.length > 0,
            stability: stability.score
        };

        if (embargoes.length === 0 && cells.length === 0 && stability.score > 80) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="gov-header">
                <div class="gov-title">${t('govTitle')}</div>
            </div>

            <div class="gov-stats">
                <div class="gov-stat-box">
                    <span class="gov-stat-label">${t('govStability')}</span>
                    <span class="gov-stat-val" style="color: ${stability.score < 50 ? '#ff3b30' : '#fff'};">${stability.score}% — ${t(stability.status)}</span>
                </div>
                <div class="gov-stat-box">
                    <span class="gov-stat-label">${t('govAlignment')}</span>
                    <span class="gov-stat-val">${local.doctrine ? t(local.doctrine) : "Undeclared"}</span>
                </div>
            </div>

            <div class="embargo-list">
                ${embargoes.map(e => `
                    <div class="embargo-item">
                        <span>🛑 ${e}</span>
                        <button class="micro-share-icon mini" data-type="embargo" data-text="Sanction Enacted: ${e}">📤</button>
                    </div>
                `).join('')}
                ${cells.map(c => `
                    <div class="embargo-item underground-cell">
                        <span>🕵️ ${c}</span>
                        <button class="micro-share-icon mini" style="border-color:currentColor;" data-type="underground" data-text="Underground Cell Detected: ${c}">📤</button>
                    </div>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_governance',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        if (window.MeowTrack) {
            window.MeowTrack('civilization_instability', { score: stability.score, lang: getLang() });
            embargoes.forEach(e => window.MeowTrack('embargo_enacted', { text: e, lang: getLang() }));
            cells.forEach(c => window.MeowTrack('underground_cell_detected', { text: c, lang: getLang() }));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderGovernance);
    } else {
        renderGovernance();
    }

    window.addEventListener('meow:daily:updated', renderGovernance);
    window.addEventListener('meow:decision:resolved', renderGovernance);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderGovernance();
    });
})();
