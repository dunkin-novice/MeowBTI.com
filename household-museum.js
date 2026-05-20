/**
 * MeowBTI Household Emotional Relics & Trophy Room v1
 * Generates symbolic collectible objects and mythology from history.
 */
(function() {
    if (!window.MeowI18n || !window.MeowDaily || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function generateRelics(history, profiles) {
        const relics = [];
        if (history.length < 3) return relics;

        const recent = history.slice(0, 30);
        const stressAvg = recent.reduce((acc, h) => acc + (h.answers.stress === 'overloaded' ? 2 : 0), 0) / recent.length;
        const lowEnergyCount = recent.filter(h => h.answers.energy === 'low').length;

        // 1. Blanket of Reconstruction
        if (lowEnergyCount > recent.length * 0.4) {
            relics.push({ id: 'relBlanket', icon: '🛌', name: t('relBlanket') });
        }

        // 2. Mug of Survival
        if (stressAvg > 0.8) {
            relics.push({ id: 'relMug', icon: '☕', name: t('relMug') });
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

        return relics.slice(0, 6);
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
            const customName = overlay.querySelector('#forge-name').value.trim();
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

    function renderMuseum() {
        const host = document.getElementById('family-content');
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

        if (availableRelics.length === 0 && forgedRelics.length === 0 && trophies.length === 0 && keepsakes.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        // Categorize Relics
        const legendaryRelics = forgedRelics.filter(r => r.dedicatedTo !== 'General History');
        const standardRelics = forgedRelics.filter(r => r.dedicatedTo === 'General History');

        container.innerHTML = `
            <div class="museum-header">
                <h2 class="museum-h2">${t('museumTitle')}</h2>
                <p class="wm-intro">${t('museumIntro')}</p>
            </div>

            ${legendaryRelics.length > 0 ? `
                <div class="museum-category-section">
                    <h3 class="museum-category-title">📜 Legendary Relics</h3>
                    <div class="museum-grid">
                        ${legendaryRelics.map(r => `
                            <div class="artifact-card">
                                <span class="artifact-sticker">${r.icon}</span>
                                <span class="artifact-meta">Forged Artifact</span>
                                <div class="artifact-name">${r.customName || r.name}</div>
                                <div class="artifact-binding">Bound to: ${r.dedicatedTo}</div>
                                <button class="micro-share-icon mini" data-type="forged_relic" data-text="Household Relic Forged: ${r.customName || r.name}. Dedicated to ${r.dedicatedTo}.">📤</button>
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
                                <button class="micro-share-icon mini" data-type="keepsake" data-text="Relationship Keepsake Earned: ${k.name} ${k.icon}.">📤</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="museum-category-section">
                <h3 class="museum-category-title">🏺 Available to Forge</h3>
                <div class="relic-shelf">
                    ${availableRelics.filter(ar => !forgedRelics.some(fr => fr.id === ar.id)).map(r => `
                        <div class="relic-item" id="relic-trigger-${r.id}">
                            <div class="relic-visual">${r.icon}</div>
                            <span class="relic-name">${r.name}</span>
                        </div>
                    `).join('')}
                    ${standardRelics.map(r => `
                        <div class="relic-item forged" style="opacity:0.6; filter:grayscale(0.5);">
                            <div class="relic-visual">${r.icon}</div>
                            <span class="relic-name">${r.customName || r.name}</span>
                        </div>
                    `).join('')}
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

            <div class="myth-scrawl">
                "${myth}"
            </div>
        `;

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
        window.MeowTrack && window.MeowTrack('museum_expand_view', {
            relic_count: forgedRelics.length,
            trophy_count: trophies.length,
            keepsake_count: keepsakes.length,
            lang: getLang()
        });

        if (window.MeowTrack) {
            keepsakes.forEach(k => window.MeowTrack('keepsake_generated', { keepsake_type: k.id, is_sacred: !!k.isSacred, lang: getLang() }));
        }
    }

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
