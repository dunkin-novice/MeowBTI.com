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

    function renderMuseum() {
        const host = window.MeowOS ? window.MeowOS.getLayer('memory') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-museum-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-museum-section';
            container.className = 'museum-container animate-fade-in';
            host.append(container);
        }

        const history = getHistory();
        const availableRelics = generateRelics(history, profiles);
        const keepsakes = generateKeepsakes(history, profiles);
        const forgedRelics = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];
        const trophies = generateTrophies(history, profiles);
        const myth = getMyth(history);
        const aura = getAura(history);

        if (availableRelics.length === 0 && forgedRelics.length === 0 && trophies.length === 0 && keepsakes.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        // Categorize Relics
        const legendaryRelics = forgedRelics.filter(r => (r.dedicatedTo !== 'General History' || r.isEvolved) && !r.isFusion);
        const standardRelics = forgedRelics.filter(r => r.dedicatedTo === 'General History' && !r.isEvolved && !r.isFusion);
        const fusionRelics = forgedRelics.filter(r => r.isFusion);

        container.innerHTML = `
            <div class="museum-header">
                <h2 class="museum-h2">${t('museumTitle')}</h2>
                <p class="wm-intro">${t('museumIntro')}</p>
            </div>

            ${fusionRelics.length > 0 ? `
                <div class="museum-category-section">
                    <h3 class="museum-category-title">🌌 Fusion Artifacts</h3>
                    <div class="museum-grid">
                        ${fusionRelics.map(r => {
                            const rep = getReputation(history, r.id);
                            return `
                                <div class="artifact-card fusion ${r.isLegendary ? 'legendary' : ''}">
                                    ${aura ? `<div class="aura-overlay aura-${aura.key} aura-mix" title="${aura.title}"></div>` : ''}
                                    <span class="artifact-sticker">${r.icon}</span>
                                    <span class="artifact-meta">${r.isLegendary ? 'Legendary Fusion' : 'Fusion Artifact'}</span>
                                    <div class="artifact-name">${r.name}</div>
                                    <div class="artifact-binding">${t('fusDescMyth')}</div>
                                    <button class="micro-share-icon mini" data-type="fusion_relic" data-text="Fusion Artifact Forged: ${r.name}. Status: ${rep}.">📤</button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}

            ${legendaryRelics.length > 0 ? `
                <div class="museum-category-section">
                    <h3 class="museum-category-title">📜 Legendary Heirlooms</h3>
                    <div class="museum-grid">
                        ${legendaryRelics.map(r => `
                            <div class="artifact-card legendary">
                                ${aura ? `<div class="aura-overlay aura-${aura.key}" title="${aura.title}"></div>` : ''}
                                <span class="artifact-sticker">${r.icon}</span>
                                <span class="artifact-meta">Legendary ${getReputation(history, r.id)}</span>
                                <div class="artifact-name">${r.customName || r.name}</div>
                                <div class="artifact-binding">Bound to: ${r.dedicatedTo}</div>
                                <button class="micro-share-icon mini" data-type="forged_relic" data-text="Heirloom Unlocked: ${r.customName || r.name}. Status: ${getReputation(history, r.id)}.">📤</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${keepsakes.length > 0 ? `
                <div class="museum-category-section">
                    <h3 class="museum-category-title">💞 Relationship Keepsakes</h3>
                    <div class="museum-grid">
                        ${keepsakes.map(k => `
                            <div class="artifact-card" style="border-style: ${k.isSacred ? 'solid' : 'dashed'}; border-color: ${k.isSacred ? '#FFB000' : 'var(--ink)'}">
                                <span class="artifact-sticker">${k.icon}</span>
                                <span class="artifact-meta">${k.isSacred ? 'Sacred Object' : 'Social Keepsake'}</span>
                                <div class="artifact-name">${k.name}</div>
                                <button class="micro-share-icon mini" data-type="keepsake" data-text="Relationship Keepsake: ${k.name} ${k.icon}.">📤</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${renderSynthesis(forgedRelics, profiles, history)}

            <div class="museum-category-section">
                <h3 class="museum-category-title">🏺 Available to Forge</h3>
                <div class="relic-shelf">
                    ${availableRelics.filter(ar => !forgedRelics.some(fr => fr.id === ar.id)).map(r => {
                        const isConfiscated = window.MeowGovernanceState && window.MeowGovernanceState.embargoesActive && (r.id === 'relBlanket' || r.id === 'relSoup');
                        const isCanonized = window.MeowTheologyState && ((window.MeowTheologyState.activeFaith === t('faithBlanket') && r.id === 'relBlanket') || (window.MeowTheologyState.activeFaith === t('faithSoup') && r.id === 'relSoup'));
                        if (isConfiscated && window.MeowTrack) window.MeowTrack('relic_confiscated', { relic_type: r.id, lang: getLang() });
                        if (isCanonized && window.MeowTrack) window.MeowTrack('relic_canonized', { relic_type: r.id, lang: getLang() });
                        return `
                        <div class="relic-item ${isConfiscated ? 'confiscated' : ''} ${isCanonized ? 'canonized' : ''}" id="${isConfiscated ? '' : 'relic-trigger-' + r.id}" style="${isConfiscated ? 'pointer-events:none;' : ''}">
                            <div class="relic-visual ${r.isEvolved ? 'evolved' : ''}">
                                ${r.icon}
                                ${r.isReturning && !isConfiscated ? `<span class="artifact-scar" title="Returning Artifact">♻️</span>` : ''}
                                ${isConfiscated ? `<span class="confiscated-badge">${t('relConfiscated')}</span>` : ''}
                                ${isCanonized ? `<span class="confiscated-badge" style="background:#d4af37; color:#fff; border-color:#fff; top:10px;">${t('canonizedRelic')}</span>` : ''}
                            </div>
                            <span class="relic-name">${r.name}</span>
                        </div>
                    `;}).join('')}
                    ${standardRelics.map(r => {
                        const isMissing = window.MeowEcosystemState && window.MeowEcosystemState.missingRelicId === r.id;
                        return `
                        <div class="relic-item forged" style="${isMissing ? 'opacity:0.3; filter:grayscale(1);' : 'opacity:0.6; filter:grayscale(0.5);'}">
                            <div class="relic-visual">
                                ${r.icon}
                                ${isMissing ? `<span class="wandering-badge" style="position:absolute; top:-10px; right:-10px; font-size:0.6rem; background:#FF5B3B; color:#fff; padding:2px 6px; border-radius:4px; z-index:10; transform:rotate(10deg); animation:pulse-mystical 2s infinite;">${t('statusWandering')}</span>` : ''}
                            </div>
                            <span class="relic-name">${r.customName || r.name}</span>
                        </div>
                    `;}).join('')}
                </div>
            </div>

            <div class="trophy-cabinet">
                ${trophies.map(tr => `
                    <div class="trophy-card">
                        <button class="micro-share-icon mini" data-type="trophy" data-text="Trophy Earned: ${tr.title}. ${tr.desc}">📤</button>
                        <div class="trophy-icon">${tr.icon}</div>
                        <div class="trophy-info">
                            <h4 class="trophy-title">${tr.title}</h4>
                            <p class="trophy-desc">${tr.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${renderEchoes(history, forgedRelics)}

            <div class="myth-scrawl">
                "${myth}"
            </div>

            <div style="margin-top:24px; opacity:0.5; font-family:var(--font-mono); font-size:0.75rem;">
                <a href="#household-archaeology-section" style="text-decoration:none; color:inherit;">✦ ${t('archWing')} ✦</a>
            </div>
        `;

        // Bind synthesis UI logic
        bindSynthesis(forgedRelics, container, profiles, history);

        // Bind clicks and share listeners as before...
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
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        if (window.MeowTrack) {
            window.MeowTrack('museum_expand_view', {
                relic_count: forgedRelics.length,
                trophy_count: trophies.length,
                keepsake_count: keepsakes.length,
                aura_type: aura ? aura.key : 'none',
                lang: getLang()
            });

            legendaryRelics.forEach(r => window.MeowTrack('legendary_relic_detected', { relic_type: r.id, lang: getLang() }));
            if (aura) window.MeowTrack('artifact_aura_detected', { aura_type: aura.key, lang: getLang() });
            
            const echoes = getEchoes(history, forgedRelics);
            if (echoes.length > 0) window.MeowTrack('artifact_echo_detected', { echo_count: echoes.length, lang: getLang() });
            const convs = getConversations(forgedRelics);
            if (convs.length > 0) window.MeowTrack('shelf_conversation', { conv_type: convs[0].text, lang: getLang() });
            
            const motifs = getMotifs(history);
            if (motifs.length > 0) window.MeowTrack('myth_resonance', { motif_type: motifs[0], lang: getLang() });
            
            window.MeowTrack('living_museum_view', {
                has_echoes: echoes.length > 0,
                has_conversations: convs.length > 0,
                has_motifs: motifs.length > 0,
                lang: getLang()
            });
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
