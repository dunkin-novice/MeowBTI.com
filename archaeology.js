/**
 * MeowBTI Emotional Archaeology & Ruins System v1
 * Detects inactive patterns and turns them into rediscovered mythology.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;
    const sanitize = window.MeowSanitize || ((s) => s);

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function generateRuins(history, chronicles, forged) {
        const ruins = [];
        if (history.length < 10) return ruins;

        const days = [...new Set(history.map(h => h.date))].sort();
        const firstDay = new Date(days[0]);
        const lastDay = new Date(days[days.length - 1]);
        const totalSpan = (lastDay - firstDay) / 86400000;

        // 1. Silent Kitchen Era (Large gaps in check-ins)
        if (totalSpan > history.length * 1.5) {
            ruins.push({ id: 'ruinSilentKitchen', title: t('ruinSilentKitchen'), type: 'era' });
        }

        // 2. Forgotten Soup Infrastructure
        const soupRelic = forged.find(r => r.id === 'relSoup' || r.id === 'fusSoupEngine');
        if (soupRelic && history.slice(0, 10).every(h => h.answers.stress !== 'overloaded')) {
            ruins.push({ id: 'ruinForgottenSoup', title: t('ruinForgottenSoup'), type: 'infrastructure' });
        }

        // 3. Ancient Recharge Site (Oldest chronicles)
        if (chronicles.length > 3) {
            ruins.push({ id: 'ruinAncientRecharge', title: t('ruinAncientRecharge'), type: 'site' });
        }

        return ruins.slice(0, 3);
    }

    function getFossils(forged, history) {
        const fossils = [];
        const recent = history.slice(0, 14);
        
        forged.forEach(relic => {
            const isActive = recent.some(h => {
                 // Check if relic would have been triggered by recent weather
                 if (relic.id === 'relBlanket' && h.answers.energy === 'low') return true;
                 if (relic.id === 'relMug' && h.answers.stress === 'overloaded') return true;
                 return false;
            });

            if (!isActive && history.length > 20) {
                fossils.push({
                    ...relic,
                    status: history.length > 50 ? t('fosAncientHusk') : t('fosDormant')
                });
            }
        });

        return fossils.slice(0, 4);
    }

    function renderArchaeology() {
        const host = window.MeowOS ? window.MeowOS.getLayer('lore') : document.getElementById('family-content');
        if (!host) return;
        if (window.MeowOS && !window.MeowOS.isUnlocked('archaeology')) {
            window.MeowOS.renderLock(host, 'archaeology', 'unlockHintArch');
            return;
        }

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-archaeology-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-archaeology-section';
            container.className = 'archaeology-container animate-fade-in';
            // Insert after museum or at end
            const museum = document.getElementById('household-museum-section');
            if (museum) museum.after(container);
            else host.append(container);
        }

        const history = getHistory();
        const chronicles = window.MeowStore.getChronicles ? window.MeowStore.getChronicles() : [];
        const forged = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];
        
        const ruins = generateRuins(history, chronicles, forged);
        const fossils = getFossils(forged, history);

        if (ruins.length === 0 && fossils.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="scanline-overlay"></div>
            <div style="position:relative; z-index:10;">
                <h2 class="arch-h2">${t('archTitle')}</h2>
                <p class="codex-p" style="color:inherit; opacity:0.6; margin-bottom:40px;">${t('archIntro')}</p>

                <div class="ruins-list">
                    ${ruins.map(r => `
                        <div class="ruin-card">
                            <span class="ruin-label">${r.type.toUpperCase()} RUINS</span>
                            <h3 class="ruin-name">${r.title}</h3>
                            <p style="font-size:0.85rem; opacity:0.7;">
                                <span class="corruption-text">${t('archCorrupted')}</span> Traces of 
                                ${r.id === 'ruinSilentKitchen' ? 'parallel silence' : 'ancient recovery'} detected.
                            </p>
                            <a href="/ruins/${r.id}.html" class="big-btn ghost mini" style="margin-top:16px; border-color:rgba(255,255,255,0.2); color:inherit;">
                                Explore Ruins
                            </a>
                        </div>
                    `).join('')}
                </div>

                <!-- Temporal Archaeology v3: Sifting Through The Dust -->
                <div class="excavation-module" style="margin-top:48px; padding:24px; border:1px dashed rgba(255,255,255,0.2); border-radius:12px; background:rgba(0,0,0,0.2);">
                    <h4 class="module-label" style="color:inherit;">✦ ${t('excTitle')} ✦</h4>
                    <p style="font-size:0.85rem; opacity:0.6; margin:12px 0 24px 0;">
                        Emotional strata detected from unknown parallel civilizations. Sift through the dust to recover lost fragments.
                    </p>
                    <button class="big-btn accent" id="btn-arch-excavate-v3" style="width:100%;">
                        ⛏️ ${t('excBegin')}
                    </button>
                </div>

                ${fossils.length > 0 ? `
                    <div class="fossil-cabinet" style="margin-top:48px;">
                        <h4 class="module-label" style="color:inherit;">${t('fosAncientHusk')} CABINET</h4>
                        <div class="fossil-grid">
                            ${fossils.map(f => `
                                <div class="fossil-item">
                                    <div class="fossil-icon">${f.icon}</div>
                                    <span class="fossil-status">${f.status}</span>
                                    <div style="font-size:0.6rem; margin-top:4px;">${sanitize(f.customName || f.name)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        const btnExc = container.querySelector('#btn-arch-excavate-v3');
        if (btnExc) {
            btnExc.onclick = () => {
                if (window.MeowArchaeology && window.MeowArchaeology.openExcavation) {
                    window.MeowArchaeology.openExcavation();
                } else {
                    // Fallback to v1 alert if v3 script not loaded
                    alert("Scanning strata... System not fully initialized.");
                }
            };
        }
    }

        // Analytics
        if (ruins.length > 0 && window.MeowTrack) {
            window.MeowTrack('ruin_discovered', { ruin_count: ruins.length, lang: getLang() });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderArchaeology);
    } else {
        renderArchaeology();
    }

    window.addEventListener('meow:daily:updated', renderArchaeology);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderArchaeology();
    });
})();
