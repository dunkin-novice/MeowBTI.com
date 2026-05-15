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
        } else {
            updates.push(t('dramaJudging', profiles[0].name));
        }

        // 2. Pair Dynamic (Alliance or Brain Cell)
        if (chaoticPair) {
            updates.push(t('dramaAlliance', chaoticPair.a.name, chaoticPair.b.name));
        } else if (bestPair) {
            updates.push(t('dramaBrainCell', bestPair.a.name, bestPair.b.name));
        }

        // 3. Archetype Activity (Audit or Meeting)
        const logical = profiles.find(p => p.code.includes('L')) || profiles[1];
        updates.push(t('dramaAudit', logical.name));

        // 4. Random Chaos Event (Influenced by collective energy)
        const totalEnergy = checkins.reduce((acc, c) => acc + (c ? (c.answers.energy === 'high' ? 2 : 1) : 0), 0);
        if (totalEnergy > profiles.length) {
            updates.push(t('dramaHighEnergyChaos'));
        } else {
            updates.push(t('dramaStability'));
        }

        // 5. Another Archetype Action
        const vocal = profiles.find(p => p.code.includes('R')) || profiles[0];
        updates.push(t('dramaMeeting', vocal.name));

        // 6. Generic Stats
        updates.push(t('dramaChaos'));

        return updates;
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
                ${updates.map((text, i) => `
                    <div class="drama-post" style="animation-delay: ${i * 0.1}s">
                        <div class="drama-post-icon">💬</div>
                        <div class="drama-post-content">
                            <p>${text}</p>
                            <span class="drama-post-time">${t('dramaTimeMinutesAgo', i + 1)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

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