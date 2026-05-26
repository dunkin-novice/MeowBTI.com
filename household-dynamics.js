/**
 * MeowBTI Household Dynamics v2
 * Analyzes and renders emotional roles and social chemistry between profiles.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;
    const sanitize = window.MeowSanitize || ((s) => s);

    function getRole(profile, history) {
        const checkins = history.filter(h => h.id === profile.id);
        const recent = checkins.slice(0, 7);
        const lowEnergy = recent.filter(r => r.answers.energy === 'low').length;
        const highStress = recent.filter(r => r.answers.stress === 'overloaded').length;
        const highEnergy = recent.filter(r => r.answers.energy === 'high').length;
        
        const code = profile.code;
        
        if (lowEnergy > recent.length * 0.7) return { key: 'roleBunker', icon: '🛖' };
        if (highStress > recent.length * 0.5) return { key: 'roleGenerator', icon: '🌪️' };
        
        // Dynamic Role Mapping
        if (code.includes('H') && highEnergy > recent.length * 0.4) return { key: 'roleCaretaker', icon: '🧡' };
        if (code.includes('D') && lowEnergy > recent.length * 0.4) return { key: 'roleGuardian', icon: '🛌' };
        if (code.includes('B')) return { key: 'roleProvider', icon: '🍲' };
        if (code.includes('C') || code.includes('J')) return { key: 'roleStabilizer', icon: '⚖️' };
        
        return { key: 'roleKeeper', icon: '🕯️' };
    }

    function getDrift(seed) {
        const states = ['chemNeutral', 'chemResonant', 'chemUnstable', 'dynDriftBuffering', 'dynDriftRecovering', 'dynDriftNested'];
        // Use week + seed for deterministic drift
        const week = Math.ceil(new Date().getDate() / 7);
        return states[(seed + week) % states.length];
    }

    function getActivePair(profiles, history) {
        if (profiles.length < 2) return null;
        
        // Deterministic top pair based on ID + week
        const week = Math.ceil(new Date().getDate() / 7);
        const seedStr = profiles.map(p => p.id).sort().join('') + week;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
        const absHash = Math.abs(hash);

        const a = profiles[absHash % profiles.length];
        const b = profiles[(absHash + 1) % profiles.length];
        
        const roleA = getRole(a, history);
        const roleB = getRole(b, history);
        
        let pairKey = 'pairParallel';
        let obsKey = 'obsParallel';
        let sugKey = 'sugSilent';
        
        if (roleA.key === 'roleCaretaker' || roleB.key === 'roleCaretaker') {
            pairKey = 'pairCaretaker';
            obsKey = 'obsParallel';
            sugKey = 'sugBuffering';
        } else if (roleA.key === 'roleProvider' || roleB.key === 'roleProvider') {
            pairKey = 'pairSoup';
            obsKey = 'obsNourish';
            sugKey = 'sugSoup';
        } else if (roleA.key === 'roleGenerator' || roleB.key === 'roleGenerator') {
            pairKey = 'pairShield';
            obsKey = 'obsResonance';
            sugKey = 'sugSilent';
        }

        const chemistryData = getChemistryDetail(absHash);

        return {
            a, b,
            roleA, roleB,
            driftKey: getDrift(absHash),
            pairTitle: t(pairKey),
            observation: t(obsKey),
            suggestion: t(sugKey),
            chemistryReason: chemistryData.reason,
            chemistryCategory: chemistryData.category
        };
    }

    function getChemistryDetail(seed) {
        const cats = ['catSharedRecovery', 'catParallelDrift', 'catRitualAlignment', 'catCrisisEcho', 'catQuietStability', 'catSameEraSurvival'];
        const reasons = ['reasonLoudWeek', 'reasonSoupRituals', 'reasonParallelRec', 'reasonStabilized', 'reasonSoftReset', 'reasonBufferSilence'];
        
        const catIndex = seed % cats.length;
        const reasonIndex = (seed + 2) % reasons.length;
        
        return {
            category: t(cats[catIndex]),
            reason: t(reasons[reasonIndex])
        };
    }

    function renderDynamics() {
        const host = window.MeowOS ? window.MeowOS.getLayer('snapshot') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-dynamics-v2');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-dynamics-v2';
            container.className = 'dynamics-v2-container animate-fade-in';
            // Insert before legacy dynamics if present, or at the end of snapshot
            const legacy = document.getElementById('family-dynamics');
            if (legacy) legacy.before(container);
            else host.append(container);
        }

        const history = window.MeowDaily.getHistory() || [];
        const pair = getActivePair(profiles, history);
        if (!pair) return;

        container.innerHTML = `
            <div class="dyn-header">
                <h3 class="dyn-title">✦ ${t('dynTitle')} ✦</h3>
                <span class="dyn-drift-tag">${t('dynDrift')}: ${t(pair.driftKey)}</span>
            </div>

            <div class="dyn-chemistry-card">
                <div class="dyn-duo">
                    <div class="dyn-member">
                        <div class="dyn-avatar">${pair.roleA.icon}</div>
                        <div class="dyn-name">${sanitize(pair.a.name)}</div>
                        <div class="dyn-role-tag">${t(pair.roleA.key)}</div>
                    </div>
                    <div class="dyn-link-icon">⟢</div>
                    <div class="dyn-member">
                        <div class="dyn-avatar">${pair.roleB.icon}</div>
                        <div class="dyn-name">${sanitize(pair.b.name)}</div>
                        <div class="dyn-role-tag">${t(pair.roleB.key)}</div>
                    </div>
                </div>

                <div class="dyn-info">
                    <div class="dyn-pair-title">${pair.pairTitle}</div>
                    <div class="dyn-chem-label">${pair.chemistryCategory}</div>
                    <p class="dyn-reason">“${pair.chemistryReason}”</p>
                    <p class="dyn-obs">${pair.observation}</p>
                </div>

                <div class="dyn-ritual-suggestion">
                    <span class="module-label">${t('dynRitual')}</span>
                    <div class="dyn-sug-box">
                        <span class="sug-icon">✨</span>
                        <span class="sug-text">${pair.suggestion}</span>
                    </div>
                </div>

                <div class="dyn-actions">
                    <button class="micro-share-icon mini" data-text="Household Dynamic: ${pair.a.name} + ${pair.b.name}. ${pair.pairTitle}. Why: ${pair.chemistryReason}">📤</button>
                </div>
            </div>
        `;

        container.querySelector('.micro-share-icon').onclick = () => {
            if (window.MeowAnalytics) {
                window.MeowAnalytics.microShare({
                    framework: 'household_dynamics',
                    content_type: 'chemistry_reason_seen',
                    text: container.querySelector('.micro-share-icon').getAttribute('data-text')
                });
                window.MeowTrack && window.MeowTrack('relationship_snapshot_shared', { pair_type: pair.pairTitle });
            }
        };

        if (window.MeowTrack) {
            window.MeowTrack('chemistry_reason_seen', { pair_type: pair.pairTitle, category: pair.chemistryCategory });
            window.MeowTrack('role_detected', { role: pair.roleA.key });
            window.MeowTrack('shared_ritual_viewed', { ritual: pair.suggestion });
        }
    }

    window.MeowDynamics = {
        render: renderDynamics,
        getRole
    };

    window.addEventListener('meow:daily:updated', renderDynamics);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family') renderDynamics();
    });

    if (document.readyState !== 'loading') renderDynamics();
    else document.addEventListener('DOMContentLoaded', renderDynamics);

})();
