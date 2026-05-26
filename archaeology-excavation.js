/**
 * MeowBTI Temporal Archaeology v3 — “Sifting Through The Dust”
 * Implementation of the excavation minigame and lost fragment discovery.
 * v4 Update: Parallel Transmissions integration.
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

    function getSignalDegradation(importedAt) {
        if (!importedAt) return { key: 'transDecayStable', level: 0 };
        const ageDays = (Date.now() - new Date(importedAt).getTime()) / 86400000;
        if (ageDays > 30) return { key: 'transDecayLost', level: 3 };
        if (ageDays > 14) return { key: 'transDecayCorrupted', level: 2 };
        if (ageDays > 7) return { key: 'transDecayDusted', level: 1 };
        return { key: 'transDecayStable', level: 0 };
    }

    function getDeterministicFragment(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        const absHash = Math.abs(hash);
        
        // Mix in Imported Transmissions if available (30% chance for foreign signal)
        const imported = window.MeowStore.getImportedTransmissions ? window.MeowStore.getImportedTransmissions() : [];
        if (imported.length > 0 && absHash % 10 < 3) {
            const tx = imported[absHash % imported.length];
            const decay = getSignalDegradation(tx.importedAt);
            
            return {
                id: tx.id,
                isForeign: true,
                typeKey: tx.type || 'fragTypeTransmission',
                customTitle: tx.title,
                loreText: tx.lore,
                icon: tx.icon,
                rarityKey: decay.level >= 2 ? 'rarityForbidden' : 'rarityAncient',
                rarityColor: decay.level >= 2 ? '#ff5b3b' : '#d4af37',
                isCorrupted: decay.level >= 2,
                decayKey: decay.key,
                reconstructed: false
            };
        }

        // Mix in Void Recordings (15% chance for recovered evidence)
        const recordings = window.MeowStore.getVoidRecordings ? window.MeowStore.getVoidRecordings() : [];
        const composites = window.MeowStore.getCompositeSignals ? window.MeowStore.getCompositeSignals() : [];
        
        if (composites.length > 0 && absHash % 100 < 10) { // 10% chance for composite fossil
            const comp = composites[absHash % composites.length];
            return {
                id: comp.id,
                isComposite: true,
                typeKey: 'echoConvergence',
                customTitle: t(comp.nameKey),
                loreText: `Unexplained synthesis of ${comp.recordingIds.length} signals.`,
                icon: '🌀',
                rarityKey: 'rarityForbidden',
                rarityColor: '#ff5b3b',
                isCorrupted: true,
                reconstructed: false
            };
        } else if (absHash % 100 < 5) { // 5% chance for fractured black box shard
            return {
                id: `bb-shard-${absHash.toString(36)}`,
                isBlackBoxShard: true,
                typeKey: 'bbFragment',
                customTitle: t('bbBreach'),
                loreText: t('bbMsgBreach3'),
                icon: '📼',
                rarityKey: 'rarityForbidden',
                rarityColor: '#ff5b3b',
                isCorrupted: true,
                reconstructed: false
            };
        } else if (recordings.length > 0 && absHash % 100 < 25) {
            const rec = recordings[absHash % recordings.length];
            return {
                id: rec.id,
                isEvidence: true,
                typeKey: rec.typeKey,
                customTitle: `Evidence: ${t(rec.typeKey)}`,
                loreText: rec.content,
                icon: '📼',
                rarityKey: 'rarityMythic',
                rarityColor: '#ffb000',
                isCorrupted: rec.stabilityKey === 'antSigCorrupted',
                reconstructed: rec.reconstructed
            };
        }

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
        const weekSeed = `${now.getFullYear()}-W${now.getMonth()}-${Math.ceil(now.getDate() / 7)}`;
        const seed = `${householdId}-${weekSeed}-${history.length}-${forged.length}`;
        
        const frag = getDeterministicFragment(seed);
        const host = document.getElementById('exc-result-host');
        const status = document.getElementById('exc-status-text');
        
        status.textContent = t(frag.isForeign ? 'transForeign' : (frag.isComposite || frag.isBlackBoxShard ? 'echoConvergence' : (frag.isEvidence ? 'voidPrimaryEvidence' : 'excFound')));
        
        const loreText = frag.isForeign ? frag.loreText : (frag.isEvidence || frag.isComposite || frag.isBlackBoxShard ? frag.loreText : t(frag.loreKey));
        let displayLore = frag.isCorrupted 
            ? loreText.split(' ').map((word, i) => (i % 3 === 0 ? '████' : word)).join(' ')
            : loreText;

        if (frag.isForeign && frag.isCorrupted) {
            displayLore = displayLore.replace(/[aeiou]/gi, char => Math.random() > 0.5 ? '▰' : char);
        }

        host.innerHTML = `
            <div class="fragment-reveal-card animate-pop-in ${frag.isForeign ? 'foreign-signal' : ''} ${frag.isEvidence || frag.isComposite || frag.isBlackBoxShard ? 'void-evidence' : ''}" style="--rarity-color: ${frag.rarityColor}">
                <div class="frag-rarity">${t(frag.rarityKey)} ${frag.isForeign ? `(${t(frag.decayKey)})` : ''}</div>
                <div class="frag-type">${frag.customTitle || t(frag.typeKey)}</div>
                <div class="frag-lore">"${displayLore}"</div>
                ${frag.isForeign ? `<div class="frag-origin">${t('transUnknownOrigin')}</div>` : ''}
                ${frag.rarityKey === 'rarityForbidden' || frag.isEvidence || frag.isComposite || frag.isBlackBoxShard ? `<div class="frag-alert">${frag.isComposite || frag.isBlackBoxShard ? 'UNEXPLAINED SYNTHESIS' : (frag.isEvidence ? 'HISTORICAL SYNC DETECTED' : t('excForbiddenAlert'))}</div>` : ''}
                <div class="frag-actions">
                    <button class="big-btn accent" id="btn-save-frag">${t('backToDashboard')}</button>
                    ${frag.isCorrupted ? `<button class="big-btn ghost" id="btn-recon-frag">${t('excReconstruct')}</button>` : ''}
                </div>
            </div>
        `;

        overlay.querySelector('#btn-save-frag').onclick = () => {
            if (!frag.isEvidence && !frag.isComposite && !frag.isBlackBoxShard) window.MeowStore.saveLostFragment(frag);
            overlay.remove();
            if (window.renderMuseum) window.renderMuseum();
            if (window.MeowArchaeology && window.MeowArchaeology.renderArchive) window.MeowArchaeology.renderArchive();
            window.MeowTrack && window.MeowTrack(frag.isForeign ? 'foreign_fragment_discovered' : (frag.isComposite || frag.isBlackBoxShard ? 'world_fragment_detected' : (frag.isEvidence ? 'atmospheric_evidence_recovered' : 'fragment_discovered')), { rarity: frag.rarityKey, id: frag.id });
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
                loreBox.innerHTML = `"${frag.isForeign || frag.isEvidence ? frag.loreText : t(frag.loreKey)}"`;
                status.textContent = t(frag.isForeign ? 'transForeign' : (frag.isEvidence ? 'voidPrimaryEvidence' : 'excFound'));
                reconBtn.remove();
                window.MeowTrack && window.MeowTrack('fragment_reconstructed', { id: frag.id, is_foreign: !!frag.isForeign, is_evidence: !!frag.isEvidence });
            }
        }, 100);
    }

    function renderLostArchive() {
        let container = document.getElementById('lost-civilization-archive-section');
        if (!container) {
            const host = window.MeowOS ? window.MeowOS.getLayer('archive') : document.getElementById('family-content');
            if (!host) return;
            container = document.createElement('div');
            container.id = 'lost-civilization-archive-section';
            container.className = 'lost-archive-container animate-fade-in';
            host.append(container);
        }

        const fragments = window.MeowStore.getLostFragments ? window.MeowStore.getLostFragments() : [];
        if (fragments.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="lost-archive-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="lost-archive-h3">${t('excArchiveTitle')}</h3>
                <button class="big-btn ghost mini" onclick="window.MeowTransmissions.importSignal()">${t('transImport')}</button>
            </div>
            <div class="lost-fragments-grid">
                ${fragments.slice().reverse().map(f => {
                    const loreFull = f.isForeign ? f.loreText : t(f.loreKey);
                    const decay = f.isForeign ? getSignalDegradation(f.discoveredAt) : null;
                    const displayLore = (f.isCorrupted && !f.reconstructed)
                        ? loreFull.split(' ').map((word, i) => (i % 3 === 0 ? '████' : word)).join(' ')
                        : loreFull;
                        
                    return `
                        <div class="lost-fragment-card ${f.isForeign ? 'foreign-signal' : ''} ${f.rarityKey.split('rarity')[1].toLowerCase()}" style="--rarity-color: ${f.rarityColor}">
                            <div class="frag-stamp">${f.isForeign ? 'FOREIGN ECHO' : 'RECOVERED'}</div>
                            <div class="frag-rarity-tag">${t(f.rarityKey)} ${f.isForeign ? `(${t(decay.key)})` : ''}</div>
                            <div class="frag-type-tag">${f.customTitle || t(f.typeKey)}</div>
                            <div class="frag-lore-box">"${displayLore}"</div>
                            <div class="frag-id">#${f.id.toUpperCase()}</div>
                            <button class="micro-share-icon mini" data-text="Recovered: ${f.customTitle || t(f.typeKey)}. ${displayLore}">📤</button>
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
