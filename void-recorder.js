/**
 * MeowBTI The Void Recorder v6 — “Capturing The Signal”
 * Implementation of the signal capture and permanent archival system.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    const RECORDING_TYPES = [
        'voidTypeSnapshot', 'voidTypeBroadcast', 'voidTypeRogue', 'voidTypeResidue',
        'voidTypeArchaeology', 'voidTypeWeather', 'voidTypeRelic', 'voidTypeEcho'
    ];

    const RECORDING_LORE = [
        'voidLoreSync', 'voidLoreUnstable', 'voidLoreFading', 'voidLoreTerritory'
    ];

    function getRecordingState(capturedAt) {
        if (!capturedAt) return { key: 'voidStateFresh', level: 0 };
        const ageDays = (Date.now() - new Date(capturedAt).getTime()) / 86400000;
        if (ageDays > 30) return { key: 'voidStateFossilized', level: 4 };
        if (ageDays > 14) return { key: 'voidStateDistorted', level: 3 };
        if (ageDays > 7) return { key: 'voidStateWeathered', level: 2 };
        if (ageDays > 1) return { key: 'voidStateArchived', level: 1 };
        return { key: 'voidStateFresh', level: 0 };
    }

    function openRecordingOverlay(signal) {
        const overlay = document.createElement('div');
        overlay.className = 'recording-overlay active';
        
        const settings = window.MeowStore.getOSSettings ? window.MeowStore.getOSSettings() : { mode: 'calm' };
        if (settings.mode === 'lore') overlay.classList.add('mode-lore');

        overlay.innerHTML = `
            <div class="recording-scanline"></div>
            <div class="recording-content animate-fade-in">
                <div class="rec-visual">
                    <div class="rec-waveform"></div>
                    <div class="rec-icon">📼</div>
                </div>
                <div class="rec-status" id="rec-status-text">${t('voidRecording')}</div>
                <div class="rec-metadata">
                    <span class="rec-freq">${signal.freq.toFixed(1)} MHz</span>
                    <span class="rec-band">${t(signal.bandKey)}</span>
                </div>
                <div id="rec-result-host"></div>
            </div>
        `;

        document.body.append(overlay);

        // Capture Animation Sequence
        setTimeout(() => {
            const seed = signal.seed + Date.now();
            const typeKey = RECORDING_TYPES[seed % RECORDING_TYPES.length];
            const loreKey = RECORDING_LORE[(seed >> 2) % RECORDING_LORE.length];
            
            const recording = {
                id: 'rec-' + Math.random().toString(36).substr(2, 9),
                typeKey,
                loreKey,
                freq: signal.freq,
                bandKey: signal.bandKey,
                content: signal.content,
                isLive: signal.isLive,
                isRogue: signal.isRogue,
                stabilityKey: signal.stabilityKey,
                reconstructed: false,
                capturedAt: new Date().toISOString()
            };

            document.getElementById('rec-status-text').textContent = t('voidSuccess');
            
            const host = document.getElementById('rec-result-host');
            host.innerHTML = `
                <div class="recording-artifact-preview animate-pop-in">
                    <div class="rec-type-label">${t(typeKey)}</div>
                    <div class="rec-content-box">"${recording.content}"</div>
                    <div class="rec-footer-line">${t(loreKey)}</div>
                    <button class="big-btn accent" id="btn-finalize-rec" style="margin-top:32px;">${t('backToDashboard')}</button>
                </div>
            `;

            overlay.querySelector('#btn-finalize-rec').onclick = () => {
                window.MeowStore.saveVoidRecording(recording);
                overlay.remove();
                if (window.MeowEchoChamber && window.MeowEchoChamber.generate) {
                    window.MeowEchoChamber.generate();
                }
                if (window.renderMuseum) window.renderMuseum();
                window.MeowTrack && window.MeowTrack('signal_recorded', { type: typeKey, freq: signal.freq });
            };

        }, 3000);
    }

    function renderRecordingsArchive() {
        const host = window.MeowOS ? window.MeowOS.getLayer('memory') : document.getElementById('family-content');
        if (!host) return;

        const recordings = window.MeowStore.getVoidRecordings ? window.MeowStore.getVoidRecordings() : [];
        if (recordings.length === 0) return;

        let container = document.getElementById('void-recordings-archive-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'void-recordings-archive-section';
            container.className = 'void-archive-container animate-fade-in';
            const lostArchive = document.getElementById('lost-civilization-archive-section');
            if (lostArchive) lostArchive.after(container);
            else host.append(container);
        }

        container.innerHTML = `
            <div class="void-archive-header">
                <h3 class="void-archive-h3">${t('voidArchive')}</h3>
            </div>

            <div id="echo-chamber-wing"></div>

            <div class="void-recordings-grid">
                ${recordings.slice().reverse().map(r => {
                    const state = getRecordingState(r.capturedAt);
                    const isCorrupted = (r.stabilityKey === 'antSigCorrupted' || r.stabilityKey === 'antSigLost') && !r.reconstructed;
                    
                    return `
                        <div class="void-recording-card ${state.key.split('voidState')[1].toLowerCase()} ${r.isRogue ? 'rogue' : ''}">
                            <div class="rec-stamp">ARCHIVE LOG</div>
                            <div class="rec-state-tag">${t(state.key)}</div>
                            <div class="rec-type-tag">${t(r.typeKey)}</div>
                            <div class="rec-freq-tag">${r.freq.toFixed(1)} MHz — ${t(r.bandKey)}</div>
                            <div class="rec-content-box">"${r.content}"</div>
                            <div class="rec-lore-tag">${t(r.loreKey)}</div>
                            <div class="rec-actions">
                                <button class="micro-share-icon mini" data-text="Void Recording Captured: ${t(r.typeKey)}. ${r.content}">📤</button>
                                ${isCorrupted ? `<button class="big-btn ghost mini restab-btn" data-id="${r.id}">${t('voidRestabilize')}</button>` : ''}
                            </div>
                            <div class="rec-id">#${r.id.toUpperCase()}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.querySelectorAll('.restab-btn').forEach(btn => {
            btn.onclick = () => restabilizeRecording(btn.dataset.id);
        });

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'void_recorder',
                        content_type: 'void_recording',
                        text: btn.getAttribute('data-text')
                    });
                }
            };
        });

        if (window.MeowTrack) {
            window.MeowTrack('recording_archive_opened', { count: recordings.length });
        }

        // Render Echo Chamber
        if (window.MeowEchoChamber && window.MeowEchoChamber.render) {
            window.MeowEchoChamber.render();
        }
    }

    function restabilizeRecording(id) {
        const recordings = window.MeowStore.getVoidRecordings();
        const r = recordings.find(rec => rec.id === id);
        if (!r) return;

        // Show stabilization overlay
        const overlay = document.createElement('div');
        overlay.className = 'stabilization-overlay active';
        overlay.innerHTML = `
            <div class="stab-content animate-fade-in">
                <div class="stab-progress-text">${t('voidStabilizing')}</div>
                <div class="stab-bar-container"><div class="stab-bar" id="stab-bar"></div></div>
            </div>
        `;
        document.body.append(overlay);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            document.getElementById('stab-bar').style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                r.reconstructed = true;
                r.content = r.content.replace(/████/g, '[RECOVERED]');
                window.MeowStore.saveVoidRecording(r);
                overlay.remove();
                renderRecordingsArchive();
                window.MeowTrack && window.MeowTrack('recording_restabilized', { id: r.id });
            }
        }, 100);
    }

    window.MeowVoidRecorder = {
        record: openRecordingOverlay,
        render: renderRecordingsArchive
    };

    window.addEventListener('meow:daily:updated', renderRecordingsArchive);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family') renderRecordingsArchive();
    });

    if (document.readyState !== 'loading') renderRecordingsArchive();
    else document.addEventListener('DOMContentLoaded', renderRecordingsArchive);

})();
