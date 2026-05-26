/**
 * MeowBTI The Echo Chamber v7 — “When Recordings Begin Talking Back”
 * Logic for deterministic resonance, synthetic lore, and composite signal generation.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    const ECHO_MESSAGES = ['echoMsgMem1', 'echoMsgMem2', 'echoMsgSync', 'echoMsgOrigin', 'echoMsgSurvival'];
    const RELATIONSHIP_TYPES = ['echoRelResonance', 'echoRelContradict', 'echoRelLoop', 'echoRelHarmony', 'echoRelPhantom'];
    const COMPOSITE_NAMES = ['echoCompSoup', 'echoCompSilence', 'echoCompBlanket', 'echoCompRecharge', 'echoCompEmergency'];

    function generateEchoes() {
        const recordings = window.MeowStore.getVoidRecordings();
        if (recordings.length < 2) return;

        const currentEchoes = window.MeowStore.getSyntheticEchoes();
        const currentComposites = window.MeowStore.getCompositeSignals();

        // 1. Find Pairwise Resonances
        for (let i = 0; i < recordings.length; i++) {
            for (let j = i + 1; j < recordings.length; j++) {
                const r1 = recordings[i];
                const r2 = recordings[j];
                
                // Deterministic seed for this specific pair
                const pairSeed = r1.id + r2.id;
                let hash = 0;
                for (let k = 0; k < pairSeed.length; k++) hash = ((hash << 5) - hash) + pairSeed.charCodeAt(k);
                const absHash = Math.abs(hash);

                // Conditions for resonance: same band OR similar lore OR both corrupted
                const sameBand = r1.bandKey === r2.bandKey;
                const bothCorrupted = r1.stabilityKey.includes('Corrupted') && r2.stabilityKey.includes('Corrupted');
                
                if ((sameBand || bothCorrupted) && absHash % 10 < 3) {
                    const echoId = `echo-${r1.id.slice(-4)}-${r2.id.slice(-4)}`;
                    if (!currentEchoes.some(e => e.id === echoId)) {
                        const echo = {
                            id: echoId,
                            recordingIds: [r1.id, r2.id],
                            relKey: RELATIONSHIP_TYPES[absHash % RELATIONSHIP_TYPES.length],
                            msgKey: ECHO_MESSAGES[(absHash >> 2) % ECHO_MESSAGES.length],
                            strength: (absHash % 5) + 1
                        };
                        window.MeowStore.saveSyntheticEcho(echo);
                        window.MeowTrack && window.MeowTrack('synthetic_echo_generated', { rel_type: echo.relKey });
                    }
                }
            }
        }

        // 2. Generate Composite Signals (Convergences)
        // Groups of 3+ recordings with same band
        const bandGroups = {};
        recordings.forEach(r => {
            if (!bandGroups[r.bandKey]) bandGroups[r.bandKey] = [];
            bandGroups[r.bandKey].push(r);
        });

        Object.keys(bandGroups).forEach(band => {
            const group = bandGroups[band];
            if (group.length >= 3) {
                const compId = `comp-${band}`;
                if (!currentComposites.some(c => c.id === compId)) {
                    const compSeed = group.map(r => r.id).join('');
                    let chash = 0;
                    for (let k = 0; k < compSeed.length; k++) chash = ((chash << 5) - chash) + compSeed.charCodeAt(k);
                    
                    const composite = {
                        id: compId,
                        nameKey: COMPOSITE_NAMES[Math.abs(chash) % COMPOSITE_NAMES.length],
                        bandKey: band,
                        recordingIds: group.map(r => r.id),
                        intensity: group.length,
                        isSacred: group.length >= 5
                    };
                    window.MeowStore.saveCompositeSignal(composite);
                    window.MeowTrack && window.MeowTrack('composite_signal_detected', { name: composite.nameKey, count: group.length });
                }
            }
        });

        // 3. Black Box Folklore Bleed
        const blackBoxes = window.MeowStore.getBlackBoxes();
        const history = window.MeowDaily.getHistory() || [];
        const family = window.MeowStore.getFamily();
        const householdId = family.length > 0 ? family[0].id : 'temp';
        const bleedSeed = `${householdId}-${history.length}`;
        let hash = 0;
        for (let k = 0; k < bleedSeed.length; k++) hash = ((hash << 5) - hash) + bleedSeed.charCodeAt(k);
        const seededRandom = Math.abs(hash) / 2147483647;

        if (blackBoxes.length > 0 && currentEchoes.length > 0 && seededRandom > 0.7) {
            const box = blackBoxes[Math.floor(seededRandom * blackBoxes.length)];
            const echo = currentEchoes[Math.floor(seededRandom * currentEchoes.length)];
            if (!echo.referencedBox) {
                echo.msgKey = 'echoMsgMem1'; // Override to reference "another civilization" (the black box)
                echo.referencedBox = box.id;
                window.MeowStore.saveSyntheticEcho(echo);
            }
        }
    }

    function renderEchoChamber() {
        let container = document.getElementById('echo-chamber-wing');
        if (!container) {
            const host = document.getElementById('family-content');
            if (!host) return;
            container = document.createElement('div');
            container.id = 'echo-chamber-wing';
            container.className = 'echo-chamber-container animate-fade-in';
            host.append(container);
        }

        const echoes = window.MeowStore.getSyntheticEchoes();
        const composites = window.MeowStore.getCompositeSignals();
        const recordings = window.MeowStore.getVoidRecordings();

        if (echoes.length === 0 && composites.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="echo-chamber-header">
                <h3 class="echo-h3">✦ ${t('echoTitle')} ✦</h3>
                <p class="echo-sub">${t('echoStability')}</p>
            </div>

            ${composites.length > 0 ? `
                <div class="composite-signals-section">
                    <h4 class="echo-label">${t('echoConvergence')}</h4>
                    <div class="composite-grid">
                        ${composites.slice().reverse().map(c => `
                            <div class="composite-card ${c.isSacred ? 'sacred' : ''}">
                                <div class="comp-badge">${t('echoUnexplained')}</div>
                                <div class="comp-name">${t(c.nameKey)}</div>
                                <div class="comp-meta">${c.recordingIds.length} Recordings Merged • ${t(c.bandKey)}</div>
                                <div class="comp-visual">
                                    <div class="comp-line" style="animation-delay: 0.1s"></div>
                                    <div class="comp-line" style="animation-delay: 0.3s"></div>
                                    <div class="comp-line" style="animation-delay: 0.5s"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="echo-resonances-section">
                <h4 class="echo-label">${t('echoResonances')}</h4>
                <div class="echo-list">
                    ${echoes.slice().reverse().map(e => {
                        const r1 = recordings.find(r => r.id === e.recordingIds[0]);
                        const r2 = recordings.find(r => r.id === e.recordingIds[1]);
                        if (!r1 || !r2) return '';
                        
                        return `
                            <div class="echo-item animate-slide-up">
                                <div class="echo-rel-tag">${t(e.relKey)} [${e.strength}]</div>
                                <div class="echo-msg">"${t(e.msgKey)}"</div>
                                <div class="echo-links">
                                    <span class="echo-link">#${r1.id.slice(-4).toUpperCase()}</span>
                                    <span class="echo-link-join">⟷</span>
                                    <span class="echo-link">#${r2.id.slice(-4).toUpperCase()}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        if (window.MeowTrack) {
            window.MeowTrack('recursive_archive_viewed', { echo_count: echoes.length, comp_count: composites.length });
        }
    }

    window.MeowEchoChamber = {
        generate: generateEchoes,
        render: renderEchoChamber
    };

    window.addEventListener('meow:daily:updated', () => {
        generateEchoes();
        renderEchoChamber();
    });

    if (document.readyState !== 'loading') {
        generateEchoes();
        renderEchoChamber();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            generateEchoes();
            renderEchoChamber();
        });
    }

})();
