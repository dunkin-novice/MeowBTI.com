/**
 * MeowBTI Household Emotional Relics & Trophy Room v1
 * Generates symbolic collectible objects and mythology from history.
 */
(function() {
    if (!window.MeowI18n || !window.MeowDaily || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;
    const sanitize = window.MeowSanitize || ((s) => s);

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function getAura(history) {
        if (history.length === 0) return null;
        const recent = history.slice(0, 10);
        const stress = recent.filter(h => h.answers.stress === 'overloaded').length;
        const recovery = recent.filter(h => h.answers.stress === 'calm').length;
        
        if (stress > 5) return { key: 'chaos', title: t('auraChaos') };
        if (recovery > 5) return { key: 'recovery', title: t('auraRecovery') };
        return { key: 'stability', title: t('auraStability') };
    }

    function getReputation(history, relicId) {
        // Deterministic based on relicId + history length
        const reps = [t('reputeTrusted'), t('reputeHaunted'), t('reputeProtective'), t('reputeUnstable')];
        const seed = relicId.length + history.length;
        return reps[seed % reps.length];
    }

    function generateRelics(history, profiles) {
        const relics = [];
        if (history.length < 3) return relics;

        const recent = history.slice(0, 30);
        const stressAvg = recent.reduce((acc, h) => acc + (h.answers.stress === 'overloaded' ? 2 : 0), 0) / recent.length;
        const lowEnergyCount = recent.filter(h => h.answers.energy === 'low').length;
        
        const forged = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];

        // 1. Blanket of Reconstruction -> Ancient Blanket
        if (lowEnergyCount > recent.length * 0.4) {
            const base = { id: 'relBlanket', icon: '🛌', name: t('relBlanket') };
            const isForged = forged.some(f => f.id === base.id);
            if (isForged && history.length > 20) {
                base.name = `${t('relEvolvedPrefix')} ${base.name}`;
                base.isEvolved = true;
            }
            relics.push(base);
        }

        // 2. Mug of Survival -> Mug of Adulthood
        if (stressAvg > 0.8) {
            const base = { id: 'relMug', icon: '☕', name: t('relMug') };
            const isForged = forged.some(f => f.id === base.id);
            if (isForged && history.length > 30) {
                base.name = `${base.name} ${t('relEvolvedSuffix')}`;
                base.isEvolved = true;
            }
            relics.push(base);
        }

        // 3. Couch of Parallel Play
        const quietCount = recent.filter(h => h.answers.social === 'hiding').length;
        if (quietCount > recent.length * 0.3) {
            relics.push({ id: 'relCouch', icon: '🛋️', name: t('relCouch') });
        }

        // 4. Beanbag of Rotting
        if (lowEnergyCount > recent.length * 0.6) {
            relics.push({ id: 'relBeanbag', icon: '☁️', name: t('relBeanbag') });
        }

        // 5. Emergency Tuna
        const highEnergyChaos = recent.filter(h => h.answers.energy === 'high' && h.answers.stress === 'unstable').length;
        if (highEnergyChaos > 3) {
            relics.push({ id: 'relTuna', icon: '🐟', name: t('relTuna') });
        }

        // 6. Headphones of Protection
        if (recent.filter(h => h.answers.stress === 'overloaded').length > 5) {
            relics.push({ id: 'relHeadphones', icon: '🎧', name: t('relHeadphones') });
        }

        // 7. DoorDash Receipt
        if (stressAvg > 1.2 && lowEnergyCount > recent.length * 0.5) {
            relics.push({ id: 'relReceipt', icon: '🧾', name: t('relReceipt') });
        }

        // 8. Relationship Relics (Requires 2+ profiles)
        if (profiles.length >= 2) {
            const hasChaos = profiles.some(p => p.code.includes('l'));
            const hasControl = profiles.some(p => p.code.includes('B'));
            if (hasChaos && hasControl) {
                relics.push({ id: 'relSharedDoc', icon: '📄', name: t('relSharedDoc') });
            }
            if (relics.some(r => r.id === 'relBlanket')) {
                relics.push({ id: 'relTreaty', icon: '📜', name: t('relTreaty') });
            }
        }

        // Handle Returning Artifact detection
        relics.forEach(r => {
            const wasForgedBefore = forged.find(f => f.id === r.id);
            if (wasForgedBefore && !r.isEvolved) {
                r.isReturning = true;
            }
        });

        return relics.slice(0, 8);
    }

    function generateTrophies(history, profiles) {
        const trophies = [];
        if (history.length < 5) return trophies;

        const days = [...new Set(history.map(h => h.date))].sort().reverse();
        
        // Calm Weekend
        const isCalm = (date) => !history.filter(h => h.date === date).some(c => c.answers.stress === 'overloaded');
        // Simple logic for "last 2 days"
        if (isCalm(days[0]) && isCalm(days[1])) {
            trophies.push({ id: 'troCalmWeekend', icon: '🌅', title: t('troCalmWeekend'), desc: t('climateCalmDesc') });
        }

        // Nervous System Reboot
        const todayStress = history.filter(h => h.date === days[0]).reduce((acc, c) => acc + (c.answers.stress === 'overloaded' ? 1 : 0), 0);
        const yesterdayStress = history.filter(h => h.date === days[1]).reduce((acc, c) => acc + (c.answers.stress === 'overloaded' ? 1 : 0), 0);
        if (todayStress === 0 && yesterdayStress > profiles.length / 2) {
            trophies.push({ id: 'troNervousReboot', icon: '🔌', title: t('troNervousReboot'), desc: t('tpStabilized') });
        }

        // Collective Nap Trophy (Everyone had low energy today)
        const todayCheckins = history.filter(h => h.date === days[0]);
        if (todayCheckins.length >= 2 && todayCheckins.every(c => c.answers.energy === 'low')) {
            trophies.push({ id: 'troEveryoneNap', icon: '😴', title: t('troEveryoneNap'), desc: t('seaFunctionalHaunted') });
        }

        return trophies.slice(0, 4);
    }

    function getMyth(history) {
        const forged = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];
        const myths = [t('mythSnackHealing'), t('mythBlanketIncident'), t('mythChaosAlliance')];
        
        if (forged.length > 0) {
            const r = forged[0];
            myths.push(t('mythRelicReappeared', r.customName || r.name));
            myths.push(t('mythBelievedToContain', r.customName || r.name));
        }

        // Deterministic but feels varied
        const seed = history.length > 0 ? history[0].date : '2026';
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        return myths[Math.abs(hash) % myths.length];
    }

    function openForgingUI(relic) {
        const overlay = document.createElement('div');
        overlay.className = 'forging-overlay active';
        
        const history = getHistory();
        const events = window.MeowCanon ? window.MeowCanon.getLegendaryEvents(history) : [];
        const lang = getLang();

        overlay.innerHTML = `
            <div class="forging-card animate-fade-in">
                <span class="forging-icon">${relic.icon}</span>
                <h3 class="rs-title">${t('forgeAction')}</h3>
                <p class="rs-desc">${t('forgeIntro')}</p>
                
                <div class="forging-input-group">
                    <label>${t('forgeNameLabel')}</label>
                    <input type="text" id="forge-name" value="${relic.name}" maxlength="32">
                </div>

                <div class="forging-input-group">
                    <label>${t('forgeEventLabel')}</label>
                    <select id="forge-event">
                        ${events.map(e => `<option value="${e.id}">${e.emoji} ${e.title}</option>`).join('')}
                        <option value="none">General History</option>
                    </select>
                </div>

                <button class="big-btn accent" id="btn-forge-submit">${t('forgeSubmit')}</button>
                <button class="big-btn ghost" id="btn-forge-cancel" style="margin-top:12px;">Cancel</button>
            </div>
        `;

        document.body.append(overlay);

        const close = () => overlay.remove();
        overlay.querySelector('#btn-forge-cancel').onclick = close;
        
        overlay.querySelector('#btn-forge-submit').onclick = () => {
            const customName = sanitize(overlay.querySelector('#forge-name').value.trim());
            const eventId = overlay.querySelector('#forge-event').value;
            const event = events.find(e => e.id === eventId);
            
            const forged = {
                ...relic,
                customName,
                dedicatedTo: event ? event.title : 'General History',
                forgedAt: new Date().toISOString()
            };

            window.MeowStore.saveForgedRelic(forged);
            
            window.MeowTrack && window.MeowTrack('relic_forged', {
                relic_type: relic.id,
                event_type: eventId,
                lang: getLang()
            });

            close();
            renderMuseum();
        };
    }

    function generateKeepsakes(history, profiles) {
        const keepsakes = [];
        if (profiles.length < 2) return keepsakes;

        const recent = history.slice(0, 30);
        
        // 1. Treaty of Mutual Avoidance
        const isolationDays = recent.filter(h => h.answers.social === 'hiding').length;
        if (isolationDays > recent.length * 0.5) {
            keepsakes.push({ id: 'keepMutualAvoid', icon: '📜', name: t('keepMutualAvoid') });
        }

        // 2. Silent Support Pact
        const logical = profiles.some(p => p.code.includes('L'));
        const emotional = profiles.some(p => p.code.includes('F'));
        if (logical && emotional && recent.length > 10) {
            keepsakes.push({ id: 'keepSupportPact', icon: '🤝', name: t('keepSupportPact') });
        }

        // 3. Sacred Charger (Sacred Object)
        if (recent.filter(h => h.answers.energy === 'low').length > 10) {
            keepsakes.push({ id: 'relCharger', icon: '🔌', name: t('relCharger'), isSacred: true });
        }

        return keepsakes.slice(0, 3);
    }

    function generateFusions(forged, profiles, history) {
        if (forged.length < 2) return [];
        const fusions = [];
        
        const has = (id) => forged.find(r => r.id === id);

        // 1. Hoodie + Mug -> Hoodie of Functional Collapse
        if (has('relHoodie') && has('relMug')) {
            fusions.push({ id: 'fusHoodieCollapse', icon: '🧥', name: t('fusHoodieCollapse'), parents: ['relHoodie', 'relMug'] });
        }

        // 2. Blanket + Charger -> Recovery Nest
        if (has('relBlanket') && has('relCharger')) {
            fusions.push({ id: 'fusRecoveryNest', icon: '🧶', name: t('fusRecoveryNest'), parents: ['relBlanket', 'relCharger'] });
        }

        // 3. Couch + Headphones -> Parallel Play Station
        if (has('relCouch') && has('relHeadphones')) {
            fusions.push({ id: 'fusParallelStation', icon: '🚉', name: t('fusParallelStation'), parents: ['relCouch', 'relHeadphones'] });
        }

        // 4. Mug + Snack Basket -> Diplomacy Mug
        if (has('relMug') && has('relSnackBasket')) {
            fusions.push({ id: 'fusDiplomacyMug', icon: '🍵', name: t('fusDiplomacyMug'), parents: ['relMug', 'relSnackBasket'] });
        }

        // 6. Treaty of Mutual Avoidance + Silence -> Shared Silence Device
        if (has('keepMutualAvoid') && has('relHeadphones')) {
            fusions.push({ id: 'fusSilenceDevice', icon: '🔇', name: t('fusSilenceDevice'), parents: ['keepMutualAvoid', 'relHeadphones'] });
        }

        // 7. Beanbag + Blanket -> Treaty of Simultaneous Rotting
        if (has('relBeanbag') && has('relBlanket')) {
            fusions.push({ id: 'fusRottingTreaty', icon: '🫓', name: t('fusRottingTreaty'), parents: ['relBeanbag', 'relBlanket'] });
        }

        // 10. Treaty Engine (Spreadsheet + Problem logic)
        if (has('relMug') && profiles.some(p => p.code.includes('B')) && profiles.some(p => p.code.includes('l'))) {
            fusions.push({ id: 'fusTreatyEngine', icon: '⚙️', name: t('fusTreatyEngine'), parents: ['relMug', 'relMug'] }); // Generic parent for demo
        }

        // 11. Support Bunker (Mutual Avoidance Era logic)
        const recent = history.slice(0, 20);
        if (has('relBlanket') && recent.filter(h => h.answers.social === 'hiding').length > 10) {
            fusions.push({ id: 'fusSupportBunker', icon: '🛡️', name: t('fusSupportBunker'), parents: ['relBlanket', 'relBlanket'] });
        }

        // 12. Co-Regulation Couch
        if (has('relCouch') && has('relBeanbag')) {
            fusions.push({ id: 'fusCoregulationCouch', icon: '🛋️', name: t('fusCoregulationCouch'), parents: ['relCouch', 'relBeanbag'] });
        }

        // 8. Ancient Soup Engine (Legendary)
        if (has('relSoup') && has('relCharger') && history.length > 40) {
            fusions.push({ id: 'fusSoupEngine', icon: '🍲', name: t('fusSoupEngine'), parents: ['relSoup', 'relCharger'], isLegendary: true });
        }

        // 9. Nervous System Throne (Legendary)
        if (has('relCouch') && has('relHeadphones') && has('relBlanket') && history.length > 60) {
            fusions.push({ id: 'fusThrone', icon: '👑', name: t('fusThrone'), parents: ['relCouch', 'relHeadphones'], isLegendary: true });
        }

        // 5. Legendary: Blanket + Soup + Hoodie -> Blanket Singularity
        if (has('relBlanket') && has('relSoup') && has('relHoodie') && history.length > 50) {
            fusions.push({ id: 'fusBlanketSingularity', icon: '🌌', name: t('fusBlanketSingularity'), parents: ['relBlanket', 'relSoup'], isLegendary: true });
        }

        return fusions;
    }

    function renderSynthesis(forged, profiles, history) {
        if (forged.length < 2) return '';
        
        return `
            <div class="synthesis-section animate-fade-in" id="synthesis-engine">
                <div class="wm-header">
                    <h2 class="wm-title" style="color:#fff;">${t('synthesisTitle')}</h2>
                    <p class="wm-intro" style="color:rgba(255,255,255,0.7);">${t('synthesisIntro')}</p>
                </div>
                
                <div class="fusion-slots">
                    <div class="fusion-slot" id="slot-0">?</div>
                    <div class="fusion-plus">+</div>
                    <div class="fusion-slot" id="slot-1">?</div>
                </div>

                <div id="fusion-preview-host"></div>

                <button class="big-btn accent" id="btn-fuse-relics" disabled style="opacity:0.3;">
                    ${t('synthesisAction')}
                </button>
            </div>
        `;
    }

    function getEchoes(history, forged) {
        const echoes = [];
        const has = (id) => forged.find(r => r.id === id);

        if (has('relBlanket') && history.some(h => h.answers.stress === 'overloaded')) {
            echoes.push(t('echoBlanketLoud'));
        }
        if (has('relCharger') && history.slice(0, 5).every(h => h.answers.energy === 'low')) {
            echoes.push(t('echoChargerExhaust'));
        }
        if (has('fusTreatyEngine')) {
            echoes.push(t('echoTreatyHumming'));
        }
        if (has('relHoodie')) {
            echoes.push(t('echoHoodieCursed'));
        }
        if (has('relReceipt') && history.filter(h => h.answers.stress === 'overloaded').length > 5) {
            echoes.push(t('echoReceiptCollapse'));
        }
        if (has('fusParallelStation') && has('fusSilenceDevice')) {
            echoes.push(t('echoSyncFields'));
        }
        if (has('relCharger') && forged.some(r => r.isFusion)) {
            echoes.push(t('echoChargerPower'));
        }

        const todayCheckins = history.filter(h => h.date === new Date().toISOString().split('T')[0]);
        if (todayCheckins.length >= 2 && todayCheckins.every(c => c.answers.energy === 'low')) {
            echoes.push(t('echoBlanketRequest'));
            if (window.MeowTrack) window.MeowTrack('shared_survival_object', { type: 'blanket_request', lang: getLang() });
        }
        if (todayCheckins.length >= 2 && todayCheckins.every(c => c.answers.social === 'hiding')) {
            echoes.push(t('echoBunkerReinforce'));
            if (window.MeowTrack) window.MeowTrack('shared_survival_object', { type: 'bunker_reinforce', lang: getLang() });
        }

        return echoes.slice(0, 5);
    }

    function getConversations(forged) {
        const convs = [];
        const has = (id) => forged.find(r => r.id === id);

        if (has('relMug') && has('fusSoupEngine')) {
            convs.push({ items: [t('relMug'), t('fusSoupEngine')], text: t('convSustained') });
        }
        if (has('fusBlanketSingularity') && has('fusCoregulationCouch')) {
            convs.push({ items: [t('fusBlanketSingularity'), t('fusCoregulationCouch')], text: t('convStabilized') });
        }
        if (has('fusTreatyEngine') && has('fusSilenceDevice')) {
            convs.push({ items: [t('fusTreatyEngine'), t('fusSilenceDevice')], text: t('convDiplomatic') });
        }

        return convs.slice(0, 1);
    }

    function getMotifs(history) {
        const motifs = [];
        const recent = history.slice(0, 30);
        
        const lowEnergyCount = recent.filter(h => h.answers.energy === 'low').length;
        if (lowEnergyCount > recent.length * 0.6) motifs.push(t('motifBlanket'));
        
        const highStressCount = recent.filter(h => h.answers.stress === 'overloaded').length;
        if (highStressCount > recent.length * 0.4) motifs.push(t('motifSoup'));
        
        const socialHidingCount = recent.filter(h => h.answers.social === 'hiding').length;
        if (socialHidingCount > recent.length * 0.5) motifs.push(t('motifAvoidance'));

        return motifs.slice(0, 1);
    }

    function renderEchoes(history, forged) {
        const echoes = getEchoes(history, forged);
        const convs = getConversations(forged);
        const motifs = getMotifs(history);

        if (window.MeowActiveArc) {
            const arc = window.MeowActiveArc;
            if (arc.key === 'blanket') echoes.push("The relics have accepted horizontal governance.");
            else if (arc.key === 'loud') echoes.push("High-frequency chaotic interference detected in the museum.");
            else if (arc.key === 'parallel') echoes.push("The artifacts are maintaining synchronized silence.");
        }

        if (echoes.length === 0 && convs.length === 0 && motifs.length === 0) return '';

        return `
            <div class="echoes-container animate-fade-in" id="museum-echoes-section">
                <div class="echo-header">
                    <span>✨</span>
                    <span class="echo-title">${t('echoTitle')}</span>
                </div>
                
                <div class="echo-list">
                    ${echoes.map(e => `
                        <div class="echo-item">
                            ${e}
                            <button class="micro-share-icon mini" data-type="echo" data-text="Museum Echo: ${e}">📤</button>
                        </div>
                    `).join('')}
                    ${motifs.map(m => `
                        <div class="echo-item" style="color:#FFB000;">
                            ${m}
                            <button class="micro-share-icon mini" data-type="motif" data-text="Recurring Motif: ${m}">📤</button>
                        </div>
                    `).join('')}
                    ${convs.map(c => `
                        <div class="echo-conversation">
                            <span class="echo-meta">Artifact Dialogue</span>
                            <div class="echo-item" style="padding-left:0;">
                                "${c.text}"
                                <button class="micro-share-icon mini" data-type="conversation" data-text="Shelf Conversation: ${c.text}">📤</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderLegacyPillars() {
        const pillars = window.MeowStore.getLegacyPillars() || [];
        if (pillars.length === 0) return '';

        return `
            <div class="legacy-pillars-shelf">
                <h4 class="museum-category-title">🏛️ ${t('pillarTitle')}</h4>
                <div class="pillar-grid">
                    ${pillars.map(p => `
                        <div class="pillar-card animate-fade-in">
                            <div class="pillar-glow"></div>
                            <div class="pillar-seal">🏛️</div>
                            <span class="pillar-icon">${p.icon}</span>
                            <div class="pillar-info">
                                <div class="pillar-name">${p.title}</div>
                                <div class="pillar-source">${t('pillarFrom').replace('{0}', p.sourceName)}</div>
                                <p class="pillar-note">“${p.note}”</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderEraCard() {
        const era = window.MeowStore.getActiveEra ? window.MeowStore.getActiveEra() : null;
        if (!era) return '';

        // Auto-save era record if newly active
        const records = window.MeowStore.getEraRecords();
        if (!records.some(r => r.id === era.id)) {
            window.MeowStore.saveEraRecord({
                id: era.id,
                title: era.title,
                note: t('eraNote' + era.trigger.charAt(0).toUpperCase() + era.trigger.slice(1))
            });
            if (window.MeowTrack) window.MeowTrack('era_ascended', { era_id: era.id, trigger: era.trigger });
        }

        if (window.MeowTrack) window.MeowTrack('golden_era_seen', { era_id: era.id });

        const seeding = window.MeowStore.checkSeedingEligibility();
        const legacy = window.MeowStore.checkLegacyEligibility();

        return `
            <div class="era-card-container animate-fade-in">
                <div class="era-glow"></div>
                <div class="era-card-header">
                    <span class="era-kicker">✦ ${t('eraTitleLabel')} ✦</span>
                </div>
                <div class="era-card-main">
                    <div class="era-seal-outer">
                        <div class="era-seal">${era.seal}</div>
                    </div>
                    <h1 class="era-title">${era.title}</h1>
                    <p class="era-desc">“${era.desc}”</p>
                    
                    <div class="era-ceremonial-actions" style="margin-top:32px; display:flex; gap:16px; justify-content:center;">
                        ${seeding.eligible ? `
                            <button class="seed-btn accent" id="btn-seed-civ">
                                🌱 ${t('seedAction')}
                            </button>
                        ` : ''}
                        ${legacy.eligible ? `
                            <button class="legacy-btn ghost" id="btn-legacy-torch">
                                🕯️ ${t('legacyAction')}
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    function renderLegacyTransfers() {
        const transfers = window.MeowStore.getLegacyTransfers() || [];
        if (transfers.length === 0) return '';

        return `
            <div class="legacy-transfers-shelf">
                <h4 class="museum-category-title">🕯️ ${t('legacyTransferTitle')}</h4>
                <div class="legacy-grid">
                    ${transfers.map(transfer => {
                        const traitTitle = sanitize(transfer.traitTitle || transfer.title || transfer.name || t('legacyTransferTitle'));
                        const previousEra = sanitize(transfer.previousEra || transfer.source || transfer.originEra || 'Unknown');
                        const note = sanitize(transfer.note || t('legacyTorchPassed'), 160);
                        const icon = sanitize(transfer.icon || '🕯️');
                        if (window.MeowTrack) window.MeowTrack('legacy_transfer_viewed', { trait_id: transfer.traitId || transfer.id || 'unknown' });
                        return `
                            <div class="legacy-card animate-fade-in">
                                <div class="legacy-candle-glow"></div>
                                <span class="legacy-icon">${icon}</span>
                                <div class="legacy-info">
                                    <div class="legacy-name">${traitTitle}</div>
                                    <div class="legacy-origin">${t('legacyPreviousEra').replace('{0}', previousEra)}</div>
                                    <p class="legacy-note">“${note}”</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderRestoredHeirlooms() {
        const heirlooms = window.MeowStore.getRestoredHeirlooms ? window.MeowStore.getRestoredHeirlooms() : [];
        if (!Array.isArray(heirlooms) || heirlooms.length === 0) return '';

        return `
            <div class="restored-heirlooms-shelf">
                <h4 class="museum-category-title">✨ ${t('heirloomShelfTitle')}</h4>
                <div class="heirloom-grid">
                    ${heirlooms.filter(Boolean).map(heirloom => {
                        const title = sanitize(heirloom.titleKey ? t(heirloom.titleKey) : (heirloom.title || t('heirloomShelfTitle')));
                        const desc = sanitize(heirloom.descKey ? t(heirloom.descKey) : (heirloom.description || t('heirloomDefaultDesc')), 180);
                        const icon = sanitize(heirloom.icon || '✨');
                        const profile = heirloom.linkedProfileName ? sanitize(heirloom.linkedProfileName) : '';
                        const era = heirloom.originEra ? sanitize(heirloom.originEra) : '';
                        return `
                            <div class="heirloom-card animate-fade-in">
                                <span class="heirloom-icon">${icon}</span>
                                <div class="heirloom-info">
                                    <div class="heirloom-name">${title}</div>
                                    <p class="heirloom-desc">${desc}</p>
                                    <p class="heirloom-recovered">${t('heirloomRecovered')}</p>
                                    ${era ? `<div class="heirloom-meta">${t('heirloomOriginEra').replace('{0}', era)}</div>` : ''}
                                    ${profile ? `<div class="heirloom-meta">${t('heirloomLinkedProfile').replace('{0}', profile)}</div>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function getDynastyLabel(profile) {
        const labels = ['dynastyLabelCurious', 'dynastyLabelSteady', 'dynastyLabelWarm', 'dynastyLabelWatchful'];
        const seed = String(profile.code || profile.name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return t(labels[seed % labels.length]);
    }

    function renderDynastyTree() {
        const profiles = (window.MeowStore.getFamily() || [])
            .filter(profile => profile && profile.subject !== 'human')
            .map((profile, index) => ({ ...profile, _index: index }))
            .sort((a, b) => {
                const aTime = Date.parse(a.savedAt || '') || a._index;
                const bTime = Date.parse(b.savedAt || '') || b._index;
                return aTime - bTime;
            });
        const heirlooms = window.MeowStore.getRestoredHeirlooms ? window.MeowStore.getRestoredHeirlooms() : [];
        const transfers = window.MeowStore.getLegacyTransfers ? window.MeowStore.getLegacyTransfers() : [];

        return `
            <div class="dynasty-tree-shelf">
                <h4 class="museum-category-title">🌿 ${t('dynastyTitle')}</h4>
                <p class="dynasty-intro">${t('dynastyIntro')}</p>
                ${profiles.length > 0 ? `
                    <div class="dynasty-tree">
                        ${profiles.map((profile, index) => {
                            const heirloomCount = heirlooms.filter(heirloom => heirloom && (
                                (heirloom.linkedProfileId && heirloom.linkedProfileId === profile.id) ||
                                (!heirloom.linkedProfileId && heirloom.linkedProfileName === profile.name)
                            )).length;
                            const isLatest = index === profiles.length - 1;
                            return `
                                ${index > 0 ? `<div class="dynasty-connector" aria-hidden="true">↓</div>` : ''}
                                <div class="dynasty-card animate-fade-in">
                                    <div class="dynasty-card-kicker">${index === 0 ? t('dynastyRootLabel') : (isLatest ? t('dynastyNewestLabel') : t('dynastyEarlierLabel'))}</div>
                                    <div class="dynasty-card-main">
                                        <div>
                                            <div class="dynasty-name">${sanitize(profile.name || t('defaultCatName'))}</div>
                                            <div class="dynasty-type">${sanitize(profile.archetypeName || profile.code || t('dynastyUnknownType'))}</div>
                                        </div>
                                        <span class="dynasty-code">${sanitize(profile.code || '----')}</span>
                                    </div>
                                    <div class="dynasty-emotional-label">${getDynastyLabel(profile)}</div>
                                    <div class="dynasty-meta-row">
                                        <span>${t(heirloomCount === 1 ? 'dynastyHeirloomCountOne' : 'dynastyHeirloomCount').replace('{0}', heirloomCount)}</span>
                                        ${isLatest && transfers.length > 0 ? `<span class="dynasty-legacy-marker">🕯️ ${t('dynastyLegacyMarker')}</span>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `<div class="dynasty-empty-state">${t('dynastyEmpty')}</div>`}
            </div>
        `;
    }

    function renderSeedArchive() {
        const seeds = window.MeowStore.getSeedCivilizations() || [];
        if (seeds.length === 0) return '';

        return `
            <div class="seed-archive-shelf">
                <h4 class="museum-category-title">🌱 ${t('seedArchiveTitle')}</h4>
                <div class="seed-grid">
                    ${seeds.map(s => {
                        if (window.MeowTrack) window.MeowTrack('seed_archive_viewed', { seed_id: s.id });
                        return `
                            <div class="seed-card animate-fade-in">
                                <div class="seed-glow"></div>
                                <span class="seed-icon">${s.icon}</span>
                                <div class="seed-info">
                                    <div class="seed-name">${s.title}</div>
                                    <div class="seed-inherited">${t('seedInherited').replace('{0}', s.inherited)}</div>
                                    <div class="seed-origin">${t('seedOriginEra').replace('{0}', s.originEra)}</div>
                                    <p class="seed-note">“${s.note}”</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderEraRecords() {
        const records = window.MeowStore.getEraRecords() || [];
        if (records.length === 0) return '';

        return `
            <div class="era-records-shelf">
                <h4 class="museum-category-title">🏺 ${t('eraRecordsTitle')}</h4>
                <div class="era-records-grid">
                    ${records.map(r => {
                        if (window.MeowTrack) window.MeowTrack('era_record_viewed', { era_id: r.id });
                        return `
                            <div class="era-record-card">
                                <div class="er-meta">${new Date(r.unlockedAt).toLocaleDateString()}</div>
                                <div class="er-title">${r.title}</div>
                                <p class="er-note">${r.note}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderSynthesisDoctrines() {
        const doctrines = window.MeowStore.getSynthesisDoctrines() || [];
        if (doctrines.length === 0) return '';

        const proposed = window.MeowStore.getProposedDoctrines() || [];
        const proposedIds = new Set(proposed.map(p => p.id));

        return `
            <div class="synthesis-doctrines-shelf">
                <h4 class="museum-category-title">📜 ${t('synthesisTitle')}</h4>
                <div class="doctrine-grid">
                    ${doctrines.map(d => {
                        const isProposed = proposedIds.has(d.id);
                        return `
                            <div class="doctrine-card animate-fade-in ${isProposed ? 'proposed' : ''}">
                                <div class="doctrine-glow"></div>
                                <span class="doctrine-icon">${d.icon}</span>
                                <div class="doctrine-info">
                                    <div class="doctrine-name">${d.title}</div>
                                    <div class="doctrine-source">${t('synthesisFrom').replace('{0}', '#' + d.sourcePair[0]).replace('{1}', '#' + d.sourcePair[1])}</div>
                                    <p class="doctrine-note">“${d.note}”</p>
                                    
                                    <div class="doctrine-actions" style="margin-top:16px;">
                                        ${isProposed ? `
                                            <span class="fed-proposed-badge">✨ ${t('fedProposed')}</span>
                                        ` : `
                                            <button class="fed-propose-btn" data-id="${d.id}">${t('fedProposeAction')}</button>
                                        `}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderBorrowedRituals() {
        const rituals = window.MeowStore.getBorrowedRituals() || [];
        if (rituals.length === 0) return '';

        return `
            <div class="borrowed-rituals-shelf">
                <h4 class="museum-category-title">🏺 ${t('borrowedRitualTitle')}</h4>
                <div class="borrowed-grid">
                    ${rituals.map(r => `
                        <div class="borrowed-card animate-fade-in">
                            <div class="borrowed-glow"></div>
                            <span class="borrowed-icon">${r.icon}</span>
                            <div class="borrowed-info">
                                <div class="borrowed-name">${r.title}</div>
                                <div class="borrowed-source">${t('borrowFrom')}${r.sourceId}</div>
                                <p class="borrowed-note">“${r.note}”</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderMuseum() {
        const host = window.MeowOS ? window.MeowOS.getLayer('archive') : document.getElementById('family-content');
        if (!host) return;
        if (window.MeowOS && !window.MeowOS.isUnlocked('museum')) {
            window.MeowOS.renderLock(host, 'museum', 'unlockHintMuseum');
            return;
        }

        const profiles = window.MeowStore.getFamily();
        if (profiles.length === 0) return;

        let container = document.getElementById('household-museum-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-museum-section';
            container.className = 'museum-container animate-fade-in';
            host.append(container);
        }

        const history = getHistory();
        const restored = window.MeowStore.restoreEligibleHeirloom ? window.MeowStore.restoreEligibleHeirloom(history) : null;
        if (restored && window.MeowTrack) window.MeowTrack('heirloom_restored', { heirloom_id: restored.id });
        const availableRelics = generateRelics(history, profiles);
        const keepsakes = generateKeepsakes(history, profiles);
        const forgedRelics = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];
        const trophies = generateTrophies(history, profiles);
        const myth = getMyth(history);
        const aura = getAura(history);
        const restoredHeirlooms = window.MeowStore.getRestoredHeirlooms ? window.MeowStore.getRestoredHeirlooms() : [];

        if (availableRelics.length === 0 && forgedRelics.length === 0 && trophies.length === 0 && keepsakes.length === 0 && restoredHeirlooms.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        // Categorize Relics
        const legendaryRelics = forgedRelics.filter(r => (r.dedicatedTo !== 'General History' || r.isEvolved) && !r.isFusion);
        const standardRelics = forgedRelics.filter(r => r.dedicatedTo === 'General History' && !r.isEvolved && !r.isFusion);
        const fusionRelics = forgedRelics.filter(r => r.isFusion);

        container.innerHTML = `
            ${renderEraCard()}

            <div class="museum-header">
                <h2 class="museum-h2">${t('museumTitle')}</h2>
                <p class="wm-intro">${t('museumIntro')}</p>
                <div class="world-archive-orientation">
                    <strong>World / Archive</strong>
                    <span>Museum stores your household history. Profiles and Daily Loop check-ins become memories, dynasty records, heirlooms, shared connections, and Ghost OS archive files.</span>
                    <div class="world-archive-flow">
                        <span>Profiles</span>
                        <span>Daily Loop</span>
                        <span>Museum</span>
                        <span>Dynasty</span>
                        <span>Heirlooms</span>
                        <span>Federation</span>
                        <span>Ghost OS</span>
                    </div>
                </div>
            </div>

            <!-- BUCKET: MEMORIES -->
            <div class="museum-bucket" id="bucket-memories">
                <h3 class="bucket-header">✦ ${t('bucketMemories')} ✦</h3>
                ${renderEchoes(history, forgedRelics)}
                <div id="echo-postcards-section"></div>
                <div id="void-recordings-archive-section"></div>
            </div>

            <!-- BUCKET: DISCOVERIES -->
            <div class="museum-bucket" id="bucket-discoveries">
                <h3 class="bucket-header">✦ ${t('bucketDiscoveries')} ✦</h3>
                
                ${fusionRelics.length > 0 ? `
                    <div class="museum-category-section">
                        <h4 class="museum-category-title">🌌 Fusion Artifacts</h4>
                        <div class="museum-grid">
                            ${fusionRelics.map(r => `
                                <div class="artifact-card fusion ${r.isLegendary ? 'legendary' : ''}">
                                    ${aura ? `<div class="aura-overlay aura-${aura.key} aura-mix" title="${aura.title}"></div>` : ''}
                                    <span class="artifact-sticker">${r.icon}</span>
                                    <span class="artifact-meta">${r.isLegendary ? 'Legendary Fusion' : 'Fusion Artifact'}</span>
                                    <div class="artifact-name">${r.name}</div>
                                    <div class="artifact-binding">${t('fusDescMyth')}</div>
                                    <button class="micro-share-icon mini" data-type="fusion_relic" data-text="Fusion Artifact: ${r.name}.">📤</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${legendaryRelics.length > 0 ? `
                    <div class="museum-category-section">
                        <h4 class="museum-category-title">📜 Legendary Heirlooms</h4>
                        <div class="museum-grid">
                            ${legendaryRelics.map(r => `
                                <div class="artifact-card legendary">
                                    ${aura ? `<div class="aura-overlay aura-${aura.key}" title="${aura.title}"></div>` : ''}
                                    <span class="artifact-sticker">${r.icon}</span>
                                    <span class="artifact-meta">Legendary ${getReputation(history, r.id)}</span>
                                    <div class="artifact-name">${r.customName || r.name}</div>
                                    <div class="artifact-binding">Bound to: ${r.dedicatedTo}</div>
                                    <button class="micro-share-icon mini" data-type="forged_relic" data-text="Heirloom: ${r.customName || r.name}.">📤</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="museum-category-section">
                    <h4 class="museum-category-title">🏺 Artifact Shelf</h4>
                    <div class="relic-shelf">
                        ${availableRelics.filter(ar => !forgedRelics.some(fr => fr.id === ar.id)).map(r => `
                            <div class="relic-item" id="relic-trigger-${r.id}">
                                <div class="relic-visual ${r.isEvolved ? 'evolved' : ''}">
                                    ${r.icon}
                                    ${r.isReturning ? `<span class="artifact-scar" title="Returning Artifact">♻️</span>` : ''}
                                </div>
                                <span class="relic-name">${r.name}</span>
                            </div>
                        `).join('')}
                        ${standardRelics.map(r => `
                            <div class="relic-item forged">
                                <div class="relic-visual">${r.icon}</div>
                                <span class="relic-name">${r.customName || r.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div id="lost-civilization-archive-section"></div>
                
                <div class="trophy-cabinet">
                    ${trophies.map(tr => `
                        <div class="trophy-card">
                            <div class="trophy-icon">${tr.icon}</div>
                            <div class="trophy-info">
                                <h4 class="trophy-title">${tr.title}</h4>
                                <p class="trophy-desc">${tr.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- BUCKET: SIGNALS -->
            <div class="museum-bucket" id="bucket-signals">
                <h3 class="bucket-header">✦ ${t('bucketSignals')} ✦</h3>
                <div class="signals-archive-intro" style="font-size:0.8rem; opacity:0.6; text-align:center; margin-bottom:32px;">
                    Saved emotional frequencies and localized broadcasts.
                </div>
                <div id="atmospheric-antenna-saved-section"></div>
            </div>

            <!-- BUCKET: ARCHIVES -->
            <div class="museum-bucket" id="bucket-archives">
                <h3 class="bucket-header">✦ ${t('bucketArchives')} ✦</h3>
                <div class="myth-scrawl">"${myth}"</div>
                <div id="black-box-vault-section"></div>
                ${renderDynastyTree()}
                ${renderRestoredHeirlooms()}
                ${renderLegacyTransfers()}
                ${renderSeedArchive()}
                ${renderEraRecords()}
                ${renderSynthesisDoctrines()}
                ${renderLegacyPillars()}
                ${renderBorrowedRituals()}
                <div id="echo-chamber-wing"></div>
            </div>

            <div style="margin-top:48px; opacity:0.3; font-family:var(--font-mono); font-size:0.65rem; text-align:center;">
                <a href="#os-layer-archive" style="text-decoration:none; color:inherit;">✦ ${t('archiveStability')} ✦</a>
            </div>
        `;

        // Bind proposal buttons
        container.querySelectorAll('.fed-propose-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const doctrines = window.MeowStore.getSynthesisDoctrines() || [];
                const doctrine = doctrines.find(d => d.id === id);
                
                if (doctrine && window.MeowStore.saveProposedDoctrine(doctrine)) {
                    window.MeowStore.addPrestige(10); // Symbolic increase
                    if (window.MeowTrack) {
                        window.MeowTrack('doctrine_proposed', { doctrine_id: doctrine.id, title: doctrine.title });
                        window.MeowTrack('federation_recognition_awarded', { amount: 10 });
                    }
                    renderMuseum();
                }
            };
        });

        // Sub-module rendering
        if (window.MeowVoidRecorder && window.MeowVoidRecorder.render) window.MeowVoidRecorder.render();
        if (window.MeowBlackBox && window.MeowBlackBox.render) window.MeowBlackBox.render();
        if (window.MeowEchoChamber && window.MeowEchoChamber.render) window.MeowEchoChamber.render();
        if (window.MeowArchaeology && window.MeowArchaeology.renderArchive) window.MeowArchaeology.renderArchive();
        if (typeof renderEchoPostcards === 'function') renderEchoPostcards();

        bindSynthesis(forgedRelics, container, profiles, history);
        
        availableRelics.forEach(r => {
            const btn = container.querySelector(`#relic-trigger-${r.id}`);
            if (btn) btn.onclick = () => openForgingUI(r);
        });

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_museum',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text')
                    });
                }
            };
        });

        if (window.MeowTrack) {
            window.MeowTrack('lore_bucket_view', { bucket_count: 4 });
            const rituals = window.MeowStore.getBorrowedRituals() || [];
            if (rituals.length > 0) {
                window.MeowTrack('borrowed_ritual_viewed', { ritual_count: rituals.length });
            }
            const doctrines = window.MeowStore.getSynthesisDoctrines() || [];
            if (doctrines.length > 0) {
                window.MeowTrack('doctrine_viewed', { doctrine_count: doctrines.length });
            }
            const pillars = window.MeowStore.getLegacyPillars() || [];
            if (pillars.length > 0) {
                window.MeowTrack('legacy_pillar_viewed', { pillar_count: pillars.length });
            }
            const seeds = window.MeowStore.getSeedCivilizations() || [];
            if (seeds.length > 0) {
                window.MeowTrack('new_generation_seen', { seed_count: seeds.length });
            }
            const transfers = window.MeowStore.getLegacyTransfers() || [];
            if (transfers.length > 0) {
                window.MeowTrack('legacy_transfer_viewed', { transfer_count: transfers.length });
            }
            const heirlooms = window.MeowStore.getRestoredHeirlooms ? window.MeowStore.getRestoredHeirlooms() : [];
            if (heirlooms.length > 0) {
                window.MeowTrack('restored_heirloom_viewed', { heirloom_count: heirlooms.length });
            }
        }

        // Bind seed button
        const seedBtn = container.querySelector('#btn-seed-civ');
        if (seedBtn) {
            seedBtn.onclick = () => {
                const seed = window.MeowStore.generateSeedCivilization();
                if (seed && window.MeowStore.saveSeedCivilization(seed)) {
                    if (window.MeowTrack) window.MeowTrack('civilization_seeded', { seed_id: seed.id, title: seed.title });
                    renderMuseum();
                }
            };
        }

        // Bind legacy button
        const legacyBtn = container.querySelector('#btn-legacy-torch');
        if (legacyBtn) {
            legacyBtn.onclick = () => {
                const transfer = window.MeowStore.inheritLegacyTrait();
                if (transfer && window.MeowStore.saveLegacyTransfer(transfer)) {
                    if (window.MeowTrack) window.MeowTrack('torch_passed', { trait_id: transfer.traitId, previous_era: transfer.previousEra });
                    renderMuseum();
                }
            };
        }
    }

    function bindSynthesis(forged, container, profiles, history) {
        const slots = [null, null];
        const slotEls = [container.querySelector('#slot-0'), container.querySelector('#slot-1')];
        const btn = container.querySelector('#btn-fuse-relics');
        const preview = container.querySelector('#fusion-preview-host');

        if (!btn) return;

        // Allow clicking standard relics to fill slots
        container.querySelectorAll('.relic-item.forged').forEach((item, idx) => {
            item.onclick = () => {
                const relic = forged.find(r => (r.customName || r.name) === item.querySelector('.relic-name').textContent);
                if (!relic) return;

                if (!slots[0]) slots[0] = relic;
                else if (!slots[1] && slots[0].id !== relic.id) slots[1] = relic;
                else { slots[0] = relic; slots[1] = null; }

                updateSlots();
            };
        });

        function updateSlots() {
            slots.forEach((s, i) => {
                if (s) {
                    slotEls[i].innerHTML = s.icon;
                    slotEls[i].classList.add('filled');
                } else {
                    slotEls[i].innerHTML = '?';
                    slotEls[i].classList.remove('filled');
                }
            });

            if (slots[0] && slots[1]) {
                btn.disabled = false;
                btn.style.opacity = '1';
                showPreview();
            } else {
                btn.disabled = true;
                btn.style.opacity = '0.3';
                preview.innerHTML = '';
            }
        }

        function showPreview() {
            const possible = generateFusions(forged, profiles, history);
            const match = possible.find(p => p.parents.includes(slots[0].id) && p.parents.includes(slots[1].id));
            
            if (match) {
                preview.innerHTML = `
                    <div class="fusion-result-preview animate-fade-in">
                        <span class="rs-stat-label">Potential Synthesis</span>
                        <div style="font-size:3rem; margin:16px 0;">${match.icon}</div>
                        <div style="font-weight:900; font-family:var(--font-display); font-size:1.5rem;">${match.name}</div>
                    </div>
                `;
            } else {
                preview.innerHTML = `<p style="opacity:0.6; margin-top:20px;">No harmonic resonance detected between these objects.</p>`;
                btn.disabled = true;
                btn.style.opacity = '0.3';
            }
        }

        btn.onclick = () => {
            const possible = generateFusions(forged, profiles, history);
            const match = possible.find(p => p.parents.includes(slots[0].id) && p.parents.includes(slots[1].id));
            if (!match) return;

            const fusion = {
                ...match,
                isFusion: true,
                forgedAt: new Date().toISOString()
            };
            window.MeowStore.saveForgedRelic(fusion);
            
            window.MeowTrack && window.MeowTrack('fusion_relic_created', {
                relic_a: slots[0].id,
                relic_b: slots[1].id,
                fusion_type: match.id,
                lang: getLang()
            });

            renderMuseum();
        };
    }

    function getApparition(context) {
        const forged = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];
        if (forged.length === 0) return null;

        const history = getHistory();
        const profiles = window.MeowStore.getFamily();

        // Deterministic but feels random per context/day
        const seed = new Date().toDateString() + context + forged.length;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        const relic = forged[Math.abs(hash) % forged.length];

        if (context === 'forecast') {
             return { type: 'omen', text: t('appOmenUnstable', relic.customName || relic.name), relic };
        }
        if (context === 'drama') {
             return { type: 'haunting', text: t('appHumming', relic.customName || relic.name), relic };
        }
        if (context === 'ritual') {
             return { type: 'guidance', text: t('appResurfaced', relic.customName || relic.name), relic };
        }
        if (context === 'relationship') {
            const duoRelic = forged.find(r => r.id === 'fusTreatyEngine' || r.id === 'fusParallelStation');
            if (duoRelic) return { type: 'omen', text: `This pairing historically summons the ${duoRelic.customName || duoRelic.name}.`, relic: duoRelic };
            return { type: 'omen', text: `Known side effect: ${relic.customName || relic.name} manifestation.`, relic };
        }
        if (context === 'possession') {
            // Rare 10% chance
            if (Math.abs(hash) % 10 === 0) {
                if (relic.id === 'relBlanket' || relic.id === 'fusBlanketSingularity') return { type: 'possession', text: t('posBlanketCiv'), relic };
                if (relic.id === 'fusSoupEngine' || relic.id === 'relTuna') return { type: 'possession', text: t('posSoupProtocols'), relic };
                if (relic.id === 'fusCoregulationCouch') return { type: 'possession', text: t('posSpiritClaimed'), relic };
            }
        }
        return null;
    }

    window.MeowMuseum = {
        getApparition,
        getReputation,
        getAura
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderMuseum);
    } else {
        renderMuseum();
    }

    window.addEventListener('meow:daily:updated', renderMuseum);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderMuseum();
    });
})();
