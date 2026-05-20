/**
 * MeowBTI v3 Household Drama Feed
 * Generates funny, archetype-based status updates for the household.
 */
(function() {
    if (!window.MeowI18n) return;

    const { t } = window.MeowI18n;

    function getDramaUpdates(profiles) {
        if (profiles.length < 2) return [];

        const updates = [];
        const compReport = window.MeowCompatibility ? window.MeowCompatibility.getFullReport(profiles) : null;
        const menace = compReport ? compReport.menace : null;
        const bestPair = compReport ? compReport.pairs.find(p => p.isBest) : null;
        const chaoticPair = compReport ? compReport.pairs.find(p => p.isChaotic) : null;

        // Use Daily Weather check-ins to make updates more dynamic
        const checkins = profiles.map(p => {
            return window.MeowDaily ? window.MeowDaily.getTodayCheckin(p.id) : null;
        });

        // 1. Menace Entry (Influenced by stress)
        if (menace) {
            const menaceCheckin = window.MeowDaily ? window.MeowDaily.getTodayCheckin(menace.id) : null;
            if (menaceCheckin && menaceCheckin.answers.stress === 'overloaded') {
                updates.push(t('dramaMenaceOverloaded', menace.name));
            } else {
                updates.push(t('dramaMenace', menace.name));
            }
        }

        // 2. Relationship Dynamics (The core of the drama)
        if (compReport && compReport.pairs) {
            compReport.pairs.slice(0, 3).forEach(pair => {
                const dyn = pair.dynamic;
                if (dyn.key === 'dynSpreadsheet') {
                    updates.push(t('dramaSpreadsheet', pair.a.name, pair.b.name));
                } else if (dyn.key === 'dynSideQuests') {
                    updates.push(t('dramaSideQuests', pair.a.name, pair.b.name));
                } else if (dyn.key === 'dynPowerStruggle') {
                    updates.push(t('dramaPowerStruggle', pair.a.name, pair.b.name));
                } else if (dyn.key === 'dynImprov') {
                    updates.push(t('dramaImprov', pair.a.name, pair.b.name));
                }
            });
        }

        // 3. Best Pair Status
        if (bestPair) {
            updates.push(t('dramaAlliance', bestPair.a.name, bestPair.b.name));
        }

        // 4. Chaotic Pair Warning
        if (chaoticPair) {
            updates.push(t('dramaChaosWarning', chaoticPair.a.name, chaoticPair.b.name));
        }

        // 5. collective energy
        const totalEnergy = checkins.reduce((acc, c) => acc + (c ? (c.answers.energy === 'high' ? 2 : 1) : 0), 0);
        if (totalEnergy > profiles.length) {
            updates.push(t('dramaHighEnergyChaos'));
        }

        // 6. Relic Hauntings
        const haunt = window.MeowMuseum ? window.MeowMuseum.getApparition('drama') : null;
        if (haunt) {
            updates.push({ text: haunt.text, isHaunted: true });
            if (window.MeowTrack) window.MeowTrack('drama_haunting', { relic_key: haunt.relic.id, lang: window.MeowI18n.getLang() });
        }

        return updates.sort(() => Math.random() - 0.5).slice(0, 6);
    }

    function renderFeed(profiles, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (profiles.length < 2) {
            container.style.display = 'none';
            return;
        }

        const updates = getDramaUpdates(profiles);
        
        container.style.display = 'block';
        container.innerHTML = `
            <div class="drama-feed-header">
                <h3 class="drama-feed-title">${t('dramaFeedTitle')}</h3>
                <p class="drama-feed-sub">${t('dramaFeedSub')}</p>
            </div>
            <div class="drama-posts-scroll">
                ${updates.map((update, i) => {
                    const text = typeof update === 'string' ? update : update.text;
                    const isHaunted = update.isHaunted || false;
                    return `
                        <div class="drama-post ${isHaunted ? 'haunted' : ''}" style="animation-delay: ${i * 0.1}s">
                            ${isHaunted ? '<span class="haunted-badge">RELIC</span>' : ''}
                            <div class="drama-post-icon">${isHaunted ? '👻' : '💬'}</div>
                            <div class="drama-post-content">
                                <p>${text}</p>
                                <span class="drama-post-time">${t('dramaTimeMinutesAgo', i + 1)}</span>
                            </div>
                            <button class="micro-share-icon drama" data-text="${text.replace(/"/g, '&quot;')}">📤</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_drama',
                        content_type: 'drama_line',
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics Hook
        window.dispatchEvent(new CustomEvent('household_drama_feed_rendered', {
            detail: {
                profile_count: profiles.length,
                update_count: updates.length,
                lang: window.MeowI18n.getLang()
            }
        }));
    }

    window.MeowDramaFeed = {
        render: renderFeed
    };
})();