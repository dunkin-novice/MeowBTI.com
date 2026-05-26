/**
 * MeowBTI The Emotional Black Box v8 — “When a Civilization Compresses Itself Into Evidence”
 * Implementation of monolithic civilization snapshots and archival breach events.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;
    const sanitize = window.MeowSanitize || ((s) => s);

    function getSeed(str = '') {
        const d = new Date();
        const family = window.MeowStore.getFamily();
        const householdId = family.length > 0 ? family[0].id : 'temp';
        const base = `${d.getFullYear()}${d.getMonth()}${d.getDate()}-${householdId}-${str}`;
        let hash = 0;
        for (let i = 0; i < base.length; i++) hash = ((hash << 5) - hash) + base.charCodeAt(i);
        return Math.abs(hash) / 2147483647;
    }

    const BB_STATES = [
        { key: 'bbStateSealed', level: 0, corruption: 0 },
        { key: 'bbStateDormant', level: 1, corruption: 0.1 },
        { key: 'bbStateWeathered', level: 2, corruption: 0.25 },
        { key: 'bbStateDistorted', level: 3, corruption: 0.4 },
        { key: 'bbStateCracking', level: 4, corruption: 0.6 },
        { key: 'bbStateBreached', level: 5, corruption: 0.8 },
        { key: 'bbStateLost', level: 6, corruption: 1.0 }
    ];

    const BB_COMP_NAMES = ['bbCompParallel', 'bbCompSoup', 'bbCompGov', 'bbCompFed'];
    const GHOST_STATUS_MAP = ['ghostPresent', 'ghostFlickering', 'ghostStable', 'ghostDormant', 'ghostGone'];

    function getBlackBoxState(sealedAt) {
        if (!sealedAt) return BB_STATES[0];
        const ageDays = (Date.now() - new Date(sealedAt).getTime()) / 86400000;
        if (ageDays > 45) return BB_STATES[6];
        if (ageDays > 30) return BB_STATES[5];
        if (ageDays > 21) return BB_STATES[4];
        if (ageDays > 14) return BB_STATES[3];
        if (ageDays > 7) return BB_STATES[2];
        if (ageDays > 1) return BB_STATES[1];
        return BB_STATES[0];
    }

    function createBlackBox() {
        const family = window.MeowStore.getFamily();
        const mainCiv = family.length > 0 ? family[0] : { name: 'Unknown', type: 'Guardian' };
        const history = window.MeowDaily.getHistory() || [];
        const forged = window.MeowStore.getForgedRelics() || [];
        const decisions = window.MeowStore.getCivDecisions() || { history: [] };
        const federation = window.MeowStore.getFederation() || [];
        
        // Deterministic ID
        const id = 'bb-' + Math.random().toString(36).substr(2, 9);
        
        // Compress Snapshot (Symbolic Metadata)
        const snapshot = {
            id,
            civName: sanitize(mainCiv.name),
            civType: mainCiv.type,
            rank: window.MeowOSUnlocks ? (Object.keys(window.MeowOSUnlocks).filter(k => window.MeowOSUnlocks[k]).length) : 0,
            doctrines: decisions.history.slice(-3).map(h => h.id),
            relicCount: forged.length,
            historyDepth: history.length,
            fedCount: federation.length,
            dominantEvent: history.length > 0 ? history[0].answers.stress : 'stable',
            sealedAt: new Date().toISOString(),
            reconstructed: 0
        };

        if (window.MeowStore.saveBlackBox(snapshot)) {
            window.MeowTrack && window.MeowTrack('black_box_created', { civ_type: snapshot.civType, depth: snapshot.historyDepth });
            renderBlackBoxVault();
            return snapshot;
        }
        return null;
    }

    function renderBlackBoxVault() {
        let container = document.getElementById('black-box-vault-section');
        if (!container) {
            const host = window.MeowOS ? window.MeowOS.getLayer('archive') : document.getElementById('family-content');
            if (!host) return;
            container = document.createElement('div');
            container.id = 'black-box-vault-section';
            container.className = 'bb-vault-container animate-fade-in';
            host.append(container);
        }

        const boxes = window.MeowStore.getBlackBoxes();
        const composites = window.MeowStore.getCompositeArchives();

        if (boxes.length === 0 && composites.length === 0) {
            container.style.display = 'none';
            // Optional: Render a "Seal Archive" button if conditions met
            const history = window.MeowDaily.getHistory() || [];
            if (history.length >= 30) {
                let sealZone = document.getElementById('bb-seal-zone');
                if (!sealZone) {
                    const host = window.MeowOS ? window.MeowOS.getLayer('archive') : document.getElementById('family-content');
                    if (!host) return;
                    sealZone = document.createElement('div');
                    sealZone.id = 'bb-seal-zone';
                    sealZone.className = 'bb-seal-zone animate-fade-in';
                    host.append(sealZone);
                }
                sealZone.innerHTML = `
                    <div class="bb-seal-card">
                        <h3>${t('bbTitle')}</h3>
                        <p>${t('bbLoreEvidence')}</p>
                        <button class="big-btn accent" id="btn-bb-seal">${t('bbSeal')}</button>
                    </div>
                `;
                sealZone.querySelector('#btn-bb-seal').onclick = createBlackBox;
            }
            return;
        }
        container.style.display = 'block';

        const settings = window.MeowStore.getOSSettings ? window.MeowStore.getOSSettings() : { mode: 'calm' };

        container.innerHTML = `
            <div class="bb-vault-header">
                <h3 class="bb-h3">✦ ${t('bbArchive')} ✦</h3>
            </div>

            <div class="bb-grid">
                ${boxes.slice().reverse().map(b => {
                    const state = getBlackBoxState(b.sealedAt);
                    const corruption = Math.min(1, state.corruption + (1 - b.reconstructed / 100));
                    const ghostStatus = GHOST_STATUS_MAP[(b.id.length + new Date().getDate()) % GHOST_STATUS_MAP.length];
                    
                    return `
                        <div class="bb-card ${state.key.split('bbState')[1].toLowerCase()} ${settings.mode === 'lore' ? 'mode-lore' : ''}" style="--bb-corruption: ${corruption}">
                            <div class="bb-seal-svg"></div>
                            <div class="bb-meta">
                                <div class="bb-state-tag">${t(state.key)}</div>
                                <div class="bb-id">#${b.id.toUpperCase()}</div>
                            </div>
                            <div class="bb-content">
                                <div class="bb-civ-name">${corruption > 0.5 ? '████████' : b.civName}</div>
                                <div class="bb-civ-type">${t('civ' + b.civType)} Snapshot</div>
                                <div class="bb-ghost-info">
                                    <span class="ghost-label">${t('bbGhostPresence')}:</span>
                                    <span class="ghost-val">${t(ghostStatus)}</span>
                                </div>
                                <div class="bb-weight">${t('bbWeight')}: ${b.historyDepth * 10} units</div>
                                <div class="bb-recon-bar">
                                    <div class="bb-recon-fill" style="width: ${b.reconstructed}%"></div>
                                </div>
                                <div class="bb-recon-text">${b.reconstructed}% ${t('bbReconstruct')}</div>
                                ${b.lastBooted ? `<div class="bb-last-access">${t('bbLastAccessed')}: ${new Date(b.lastBooted).toLocaleDateString()}</div>` : ''}
                            </div>
                            <div class="bb-actions">
                                <button class="big-btn ghost mini boot-bb-btn" data-id="${b.id}">⚡ ${t('bbBoot')}</button>
                                <button class="micro-share-icon mini" data-text="Archive Snapshot: ${b.civName} Black Box.">📤</button>
                                ${b.reconstructed < 100 ? `<button class="big-btn ghost mini recon-bb-btn" data-id="${b.id}">🔧 ${t('bbReconstruct')}</button>` : ''}
                            </div>
                            ${corruption < 0.2 ? `<div class="bb-boot-status">BOOT AVAILABLE</div>` : ''}
                        </div>
                    `;
                }).join('')}

                ${composites.slice().reverse().map(c => `
                    <div class="bb-card composite">
                        <div class="bb-badge">${t('bbComposite')}</div>
                        <div class="bb-civ-name">${t(c.nameKey)}</div>
                        <div class="bb-weight">Ancient Convergence Debris</div>
                        <div class="bb-id">#${c.id.toUpperCase()}</div>
                    </div>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.recon-bb-btn').forEach(btn => {
            btn.onclick = () => reconstructBlackBox(btn.dataset.id);
        });

        container.querySelectorAll('.boot-bb-btn').forEach(btn => {
            btn.onclick = () => {
                const b = boxes.find(box => box.id === btn.dataset.id);
                if (b && window.MeowGhostOS) window.MeowGhostOS.boot(b);
            };
        });

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'black_box',
                        content_type: 'civilization_snapshot',
                        text: btn.getAttribute('data-text')
                    });
                }
            };
        });
    }

    function reconstructBlackBox(id) {
        const boxes = window.MeowStore.getBlackBoxes();
        const b = boxes.find(box => box.id === id);
        if (!b) return;

        const overlay = document.createElement('div');
        overlay.className = 'bb-recon-overlay active';
        overlay.innerHTML = `
            <div class="bb-recon-content animate-fade-in">
                <div class="bb-recon-status">${t('bbSealing')}</div>
                <div class="bb-recon-progress"><div class="bb-recon-bar-inner" id="bb-recon-bar"></div></div>
                <div class="bb-recon-terminal" id="bb-terminal"></div>
            </div>
        `;
        document.body.append(overlay);

        const terminal = overlay.querySelector('#bb-terminal');
        const lines = [
            'Accessing emotional strata...',
            'Bypassing corruption layer...',
            'Restoring doctrine fragments...',
            'Historical sync detected...',
            'Finalizing archival clarity...'
        ];

        let lineIdx = 0;
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            document.getElementById('bb-recon-bar').style.width = progress + '%';
            
            if (progress % 20 === 0 && lineIdx < lines.length) {
                const p = document.createElement('p');
                p.textContent = `> ${lines[lineIdx++]}`;
                terminal.append(p);
            }

            if (progress >= 100) {
                clearInterval(interval);
                b.reconstructed = Math.min(100, b.reconstructed + 25);
                window.MeowStore.saveBlackBox(b);
                setTimeout(() => {
                    overlay.remove();
                    renderBlackBoxVault();
                    window.MeowTrack && window.MeowTrack('archive_reconstructed', { id: b.id, recon: b.reconstructed });
                    window.MeowTrack && window.MeowTrack('archive_clarity_improved', { type: 'black_box' });
                }, 1000);
            }
        }, 50);
    }

    function checkForBreach() {
        const boxes = window.MeowStore.getBlackBoxes();
        const breached = boxes.find(b => getBlackBoxState(b.sealedAt).key === 'bbStateBreached');
        if (breached && getSeed('breach') > 0.8) {
            window.MeowTrack && window.MeowTrack('archive_breached', { id: breached.id });
            // This is picked up by ecosystem-sim.js
            window.MeowArchiveBreach = breached;
        }
    }

    window.MeowBlackBox = {
        create: createBlackBox,
        render: renderBlackBoxVault,
        checkForBreach
    };

    window.addEventListener('meow:daily:updated', () => {
        renderBlackBoxVault();
        checkForBreach();
    });

    if (document.readyState !== 'loading') renderBlackBoxVault();
    else document.addEventListener('DOMContentLoaded', renderBlackBoxVault);

})();
