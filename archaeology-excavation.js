/**
 * MeowBTI Temporal Archaeology v3 — “Sifting Through The Dust”
 * Implementation of the excavation minigame and lost fragment discovery.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    const FRAGMENT_TYPES = [
        'fragTypePostcard', 'fragTypeTreaty', 'fragTypeChronicle', 'fragTypeGift',
        'fragTypeReceipt', 'fragTypeFragment', 'fragTypeNotice', 'fragTypeRecord',
        'fragTypePermit', 'fragTypeTransmission'
    ];

    const FRAGMENT_LORE = [
        'fragLore1', 'fragLore2', 'fragLore3', 'fragLore4',
        'fragLore5', 'fragLore6', 'fragLore7', 'fragLore8'
    ];

    const RARITIES = [
        { key: 'rarityDusty', weight: 10, color: '#a0a0a0' },
        { key: 'rarityForgotten', weight: 6, color: '#8d6e63' },
        { key: 'rarityAncient', weight: 3, color: '#d4af37' },
        { key: 'rarityMythic', weight: 1, color: '#ffb000' },
        { key: 'rarityForbidden', weight: 0.2, color: '#ff5b3b' }
    ];

    function getDeterministicFragment(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        const absHash = Math.abs(hash);
        
        // Rarity selection
        const totalWeight = RARITIES.reduce((acc, r) => acc + r.weight, 0);
        let random = (absHash % 1000) / 1000 * totalWeight;
        let rarity = RARITIES[0];
        for (const r of RARITIES) {
            if (random < r.weight) {
                rarity = r;
                break;
            }
            random -= r.weight;
        }

        const typeKey = FRAGMENT_TYPES[absHash % FRAGMENT_TYPES.length];
        const loreKey = FRAGMENT_LORE[(absHash >> 2) % FRAGMENT_LORE.length];
        const isCorrupted = rarity.key === 'rarityForbidden' || (absHash % 5 === 0);

        return {
            id: `frag-${absHash.toString(36)}-${seed.slice(-4)}`,
            typeKey,
            loreKey,
            rarityKey: rarity.key,
            rarityColor: rarity.color,
            isCorrupted,
            reconstructed: false,
            seed: absHash
        };
    }

    function openExcavationOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'excavation-overlay active';
        
        const settings = window.MeowStore.getOSSettings ? window.MeowStore.getOSSettings() : { mode: 'calm' };
        if (settings.mode === 'lore') overlay.classList.add('mode-lore');

        overlay.innerHTML = `
            <div class="excavation-scanline"></div>
            <div class="excavation-content animate-fade-in">
                <div class="exc-status" id="exc-status-text">${t('excScanning')}</div>
                <div class="exc-progress-container">
                    <div class="exc-progress-bar" id="exc-progress"></div>
                </div>
                <div id="exc-result-host"></div>
            </div>
        `;

        document.body.append(overlay);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            document.getElementById('exc-progress').style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                revealDiscovery(overlay);
            }
        }, 50);

        window.MeowTrack && window.MeowTrack('excavation_started', { mode: settings.mode, lang: getLang() });
    }

    function revealDiscovery(overlay) {
        const history = window.MeowDaily.getHistory() || [];
        const forged = window.MeowStore.getForgedRelics() || [];
        const family = window.MeowStore.getFamily() || [];
        const householdId = family.length > 0 ? family[0].id : 'temp';
        
        // Deterministic Seed
        const now = new Date();
        const weekSeed = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;
        const seed = `${householdId}-${weekSeed}-${history.length}-${forged.length}`;
        
        const frag = getDeterministicFragment(seed);
        const host = document.getElementById('exc-result-host');
        const status = document.getElementById('exc-status-text');
        
        status.textContent = t('excFound');
        
        const loreText = t(frag.loreKey);
        const displayLore = frag.isCorrupted 
            ? loreText.split(' ').map((word, i) => (i % 3 === 0 ? '████' : word)).join(' ')
            : loreText;

        host.innerHTML = `
            <div class="fragment-reveal-card animate-pop-in" style="--rarity-color: ${frag.rarityColor}">
                <div class="frag-rarity">${t(frag.rarityKey)}</div>
                <div class="frag-type">${t(frag.typeKey)}</div>
                <div class="frag-lore">"${displayLore}"</div>
                ${frag.rarityKey === 'rarityForbidden' ? `<div class="frag-alert">${t('excForbiddenAlert')}</div>` : ''}
                <div class="frag-actions">
                    <button class="big-btn accent" id="btn-save-frag">${t('backToDashboard')}</button>
                    ${frag.isCorrupted ? `<button class="big-btn ghost" id="btn-recon-frag">${t('excReconstruct')}</button>` : ''}
                </div>
            </div>
        `;

        overlay.querySelector('#btn-save-frag').onclick = () => {
            window.MeowStore.saveLostFragment(frag);
            overlay.remove();
            // Refresh museum if visible
            if (window.renderMuseum) window.renderMuseum();
            window.MeowTrack && window.MeowTrack('fragment_discovered', { rarity: frag.rarityKey, type: frag.typeKey });
        };

        if (frag.isCorrupted) {
            overlay.querySelector('#btn-recon-frag').onclick = () => {
                reconstructFragment(overlay, frag);
            };
        }
    }

    function reconstructFragment(overlay, frag) {
        const status = document.getElementById('exc-status-text');
        const loreBox = overlay.querySelector('.frag-lore');
        const reconBtn = overlay.querySelector('#btn-recon-frag');
        
        status.textContent = t('excReconstructing');
        reconBtn.disabled = true;
        reconBtn.style.opacity = '0.3';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progress >= 100) {
                clearInterval(interval);
                frag.reconstructed = true;
                frag.isCorrupted = false;
                loreBox.innerHTML = `"${t(frag.loreKey)}"`;
                status.textContent = t('excFound');
                reconBtn.remove();
                window.MeowTrack && window.MeowTrack('fragment_reconstructed', { id: frag.id });
            }
        }, 100);
    }

    function renderLostArchive() {
        const host = window.MeowOS ? window.MeowOS.getLayer('memory') : document.getElementById('family-content');
        if (!host) return;

        const fragments = window.MeowStore.getLostFragments ? window.MeowStore.getLostFragments() : [];
        if (fragments.length === 0) return;

        let container = document.getElementById('lost-civilization-archive-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'lost-civilization-archive-section';
            container.className = 'lost-archive-container animate-fade-in';
            const echoSection = document.getElementById('echo-postcards-section');
            if (echoSection) echoSection.after(container);
            else host.append(container);
        }

        container.innerHTML = `
            <div class="lost-archive-header">
                <h3 class="lost-archive-h3">${t('excArchiveTitle')}</h3>
            </div>
            <div class="lost-fragments-grid">
                ${fragments.slice().reverse().map(f => {
                    const loreText = t(f.loreKey);
                    const displayLore = (f.isCorrupted && !f.reconstructed)
                        ? loreText.split(' ').map((word, i) => (i % 3 === 0 ? '████' : word)).join(' ')
                        : loreText;
                        
                    return `
                        <div class="lost-fragment-card ${f.rarityKey.split('rarity')[1].toLowerCase()}" style="--rarity-color: ${f.rarityColor}">
                            <div class="frag-stamp">RECOVERED</div>
                            <div class="frag-rarity-tag">${t(f.rarityKey)}</div>
                            <div class="frag-type-tag">${t(f.typeKey)}</div>
                            <div class="frag-lore-box">"${displayLore}"</div>
                            <div class="frag-id">#${f.id.toUpperCase()}</div>
                            <button class="micro-share-icon mini" data-text="Recovered from another civilization: ${t(f.typeKey)}. ${displayLore}">📤</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'temporal_archaeology',
                        content_type: 'lost_fragment',
                        text: btn.getAttribute('data-text')
                    });
                }
            };
        });

        if (window.MeowTrack) {
            window.MeowTrack('lost_archive_opened', { count: fragments.length });
        }
    }

    // Export globally for archaeology.js to trigger
    window.MeowArchaeology = {
        openExcavation: openExcavationOverlay,
        renderArchive: renderLostArchive
    };

    window.addEventListener('meow:daily:updated', renderLostArchive);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family') renderLostArchive();
    });

    // Initial render if ready
    if (document.readyState !== 'loading') renderLostArchive();
    else document.addEventListener('DOMContentLoaded', renderLostArchive);

})();
