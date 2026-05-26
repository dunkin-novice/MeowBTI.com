/**
 * MeowBTI Atmospheric Antennas v5 — “Listening To The Ecosystem”
 * Implementation of the passive radio tuning and signal discovery system.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    const BANDS = [
        { freq: 88.1, key: 'antBandParallel', type: 'civ', corruption: 0.1 },
        { freq: 91.4, key: 'antBandRecovery', type: 'weather', corruption: 0.2 },
        { freq: 94.7, key: 'antBandLoud', type: 'rogue', corruption: 0.5 },
        { freq: 101.2, key: 'antBandDust', type: 'relic', corruption: 0.3 },
        { freq: 104.8, key: 'antBandUnder', type: 'civ', corruption: 0.4 },
        { freq: 108.0, key: 'antBandUnknown', type: 'rogue', corruption: 0.8 }
    ];

    const STABILITY = [
        { key: 'antSigStable', level: 0 },
        { key: 'antSigWeak', level: 1 },
        { key: 'antSigDistorted', level: 2 },
        { key: 'antSigCorrupted', level: 3 },
        { key: 'antSigLost', level: 4 }
    ];

    const MESSAGES = {
        civ: ['antMsgCiv1', 'antMsgCiv2', 'antMsgCiv3'],
        weather: ['antMsgWeather1', 'antMsgWeather2'],
        relic: ['antMsgRelic1'],
        rogue: ['antMsgRogue1', 'antMsgRogue2']
    };

    function getDeterministicSignal(freq, seed) {
        let hash = 0;
        const fullSeed = freq.toString() + seed;
        for (let i = 0; i < fullSeed.length; i++) {
            hash = ((hash << 5) - hash) + fullSeed.charCodeAt(i);
            hash |= 0;
        }
        const absHash = Math.abs(hash);
        
        const band = BANDS.find(b => b.freq === freq) || BANDS[0];
        const stability = STABILITY[absHash % STABILITY.length];
        
        // Mix in Parallel Transmissions (Imported)
        const imported = window.MeowStore.getImportedTransmissions ? window.MeowStore.getImportedTransmissions() : [];
        let content = '';
        let isLive = false;

        if (imported.length > 0 && absHash % 10 < 2) {
            const tx = imported[absHash % imported.length];
            content = `"${tx.title}: ${tx.lore}"`;
            isLive = true;
        } else if (absHash % 10 < 4) { // 20% chance for Void Recording Echo
            const recordings = window.MeowStore.getVoidRecordings ? window.MeowStore.getVoidRecordings() : [];
            const composites = window.MeowStore.getCompositeSignals ? window.MeowStore.getCompositeSignals() : [];
            
            if (composites.length > 0 && absHash % 100 < 10) { // Rare Composite Echo
                const comp = composites[absHash % composites.length];
                content = `ARCHIVE FEEDBACK: ${t(comp.nameKey)} detected at origin.`;
                isLive = true;
            } else if (recordings.length > 0) {
                const rec = recordings[absHash % recordings.length];
                content = `FEEDBACK: ${rec.content}`;
                isLive = true;
            } else {
                const pool = MESSAGES[band.type] || MESSAGES.civ;
                content = t(pool[absHash % pool.length]);
            }
        } else if (absHash % 100 < 15) { // Black Box Resonance (15% chance)
            const boxes = window.MeowStore.getBlackBoxes ? window.MeowStore.getBlackBoxes() : [];
            if (boxes.length > 0) {
                const box = boxes[absHash % boxes.length];
                content = `ARCHIVE BLEED: ${t('bbTitle')} detected at ${box.freq || freq.toFixed(1)} MHz.`;
                isLive = true;
            } else {
                const pool = MESSAGES[band.type] || MESSAGES.civ;
                content = t(pool[absHash % pool.length]);
            }
        } else {
            const pool = MESSAGES[band.type] || MESSAGES.civ;
            content = t(pool[absHash % pool.length]);
        }

        // Apply Corruption / Redaction
        if (stability.level >= 2 || band.corruption > 0.5) {
            content = content.split(' ').map((word, i) => (i % (5 - stability.level) === 0 ? '████' : word)).join(' ');
        }

        return {
            freq,
            bandKey: band.key,
            stabilityKey: stability.key,
            stabilityLevel: stability.level,
            content,
            isLive,
            isRogue: band.type === 'rogue',
            seed: absHash
        };
    }

    function renderSavedStations() {
        let container = document.getElementById('atmospheric-antenna-saved-section');
        if (!container) return; // Only render if host exists (in Museum)

        const saved = window.MeowStore.getSavedStations();
        if (saved.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="saved-stations-grid">
                ${saved.slice().reverse().map(s => `
                    <div class="saved-signal-card">
                        <div class="sig-freq">${s.freq.toFixed(1)} MHz</div>
                        <div class="sig-band">${t(s.bandKey)}</div>
                        <div class="sig-content">"${s.content}"</div>
                        <div class="sig-stability ${s.stabilityKey.toLowerCase()}">${t(s.stabilityKey)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderAntenna() {
        const host = window.MeowOS ? window.MeowOS.getLayer('lore') : document.getElementById('family-content');
        if (!host) return;

        let container = document.getElementById('atmospheric-antenna-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'atmospheric-antenna-section';
            container.className = 'antenna-container animate-fade-in';
            host.append(container);
        }

        const settings = window.MeowStore.getOSSettings ? window.MeowStore.getOSSettings() : { mode: 'calm' };
        const history = window.MeowDaily.getHistory() || [];
        const family = window.MeowStore.getFamily() || [];
        const householdId = family.length > 0 ? family[0].id : 'temp';
        
        const weekSeed = `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`;
        const seed = `${householdId}-${weekSeed}-${history.length}`;
        
        // Current tuning (deterministic per day/session for now)
        const currentFreq = BANDS[Math.floor(Date.now() / 3600000) % BANDS.length].freq;
        const signal = getDeterministicSignal(currentFreq, seed);

        container.innerHTML = `
            <div class="antenna-header">
                <h3 class="ant-h3">${t('antTitle')}</h3>
                <div class="ant-status-bar">
                    <span class="ant-status-pulse"></span>
                    ${t('antDrifting')}
                </div>
            </div>

            <div class="radio-interface ${settings.mode === 'lore' ? 'mode-lore' : ''}">
                <div class="radio-dial">
                    <div class="dial-track">
                        ${BANDS.map(b => `<div class="dial-mark ${b.freq === currentFreq ? 'active' : ''}" style="left: ${(b.freq - 88) / 20 * 100}%"></div>`).join('')}
                    </div>
                    <div class="dial-needle" style="left: ${(currentFreq - 88) / 20 * 100}%"></div>
                </div>

                <div class="signal-display">
                    <div class="signal-meta">
                        <span class="sig-freq">${currentFreq.toFixed(1)} MHz</span>
                        <span class="sig-band">${t(signal.bandKey)}</span>
                    </div>
                    
                    <div class="signal-body">
                        ${signal.isLive ? `<div class="sig-badge live">${t('antLive')}</div>` : ''}
                        ${signal.isRogue ? `<div class="sig-badge rogue">${t('antRogue')}</div>` : ''}
                        <div class="sig-content">"${signal.content}"</div>
                        <div class="sig-stability ${signal.stabilityKey.toLowerCase()}">${t(signal.stabilityKey)}</div>
                    </div>

                    <div class="signal-footer">
                        <button class="big-btn ghost mini" id="btn-save-station">${t('antSaved')}</button>
                        <button class="big-btn accent mini" id="btn-record-signal">${t('voidRecord')}</button>
                    </div>
                </div>
            </div>
        `;

        container.querySelector('#btn-save-station').onclick = () => {
            if (window.MeowStore.saveStation(signal)) {
                renderAntenna();
                renderSavedStations();
                window.MeowTrack && window.MeowTrack('atmospheric_station_saved', { freq: signal.freq });
            }
        };

        container.querySelector('#btn-record-signal').onclick = () => {
            if (window.MeowVoidRecorder && window.MeowVoidRecorder.record) {
                window.MeowVoidRecorder.record(signal);
            }
        };

        if (window.MeowTrack) {
            window.MeowTrack('antenna_opened', { freq: currentFreq, is_live: signal.isLive });
        }
        
        renderSavedStations();
    }

    window.MeowAntennas = {
        render: renderAntenna,
        renderSaved: renderSavedStations,
        getSignal: getDeterministicSignal
    };

    window.addEventListener('meow:daily:updated', () => {
        renderAntenna();
    });
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family') {
            renderAntenna();
        }
    });

    if (document.readyState !== 'loading') {
        renderAntenna();
    } else {
        document.addEventListener('DOMContentLoaded', renderAntenna);
    }

})();
