/**
 * MeowBTI Parallel Transmissions v4 — “Broadcast Into The Dust”
 * Handles encoding, broadcasting, and importing civilization fragments.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

    // Compact Encoding Logic (Base64 + JSON)
    function encodeTransmission(payload) {
        try {
            const str = JSON.stringify(payload);
            return btoa(unescape(encodeURIComponent(str)));
        } catch (e) {
            console.error('MeowTrans: Encoding failed', e);
            return null;
        }
    }

    function decodeTransmission(encoded) {
        try {
            const str = decodeURIComponent(escape(atob(encoded)));
            return JSON.parse(str);
        } catch (e) {
            console.error('MeowTrans: Decoding failed', e);
            return null;
        }
    }

    function openBroadcastCeremony(data) {
        const overlay = document.createElement('div');
        overlay.className = 'transmission-overlay active';
        
        const settings = window.MeowStore.getOSSettings ? window.MeowStore.getOSSettings() : { mode: 'calm' };
        if (settings.mode === 'lore') overlay.classList.add('mode-lore');

        overlay.innerHTML = `
            <div class="trans-scanline"></div>
            <div class="trans-content animate-fade-in">
                <div class="trans-header">
                    <span class="trans-freq">88.5 MHz</span>
                    <h3>${t('transCeremony')}</h3>
                </div>
                <div class="trans-visual">
                    <div class="signal-wave"></div>
                    <div class="signal-orb">${data.icon || '✨'}</div>
                </div>
                <div class="trans-status" id="trans-status-text">${t('transStabilizing')}</div>
                <div class="trans-payload-host" id="trans-payload-host" style="display:none;">
                    <p style="font-size:0.8rem; opacity:0.6;">${t('transPayload')}</p>
                    <div class="trans-code-box" id="trans-code"></div>
                    <button class="big-btn accent" id="btn-copy-trans" style="margin-top:24px;">Copy Signal</button>
                    <button class="big-btn ghost" id="btn-close-trans" style="margin-top:12px;">Close</button>
                </div>
            </div>
        `;

        document.body.append(overlay);

        // Animation Sequence
        setTimeout(() => {
            document.getElementById('trans-status-text').textContent = t('transEncoding');
            setTimeout(() => {
                const payload = {
                    id: 'tx-' + Math.random().toString(36).substr(2, 9),
                    type: data.type,
                    title: data.title,
                    lore: data.lore,
                    icon: data.icon,
                    origin_week: `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`
                };
                const encoded = encodeTransmission(payload);
                
                document.getElementById('trans-status-text').textContent = t('transComplete');
                document.getElementById('trans-payload-host').style.display = 'block';
                document.getElementById('trans-code').textContent = encoded;
                
                window.MeowStore.saveBroadcast(payload);
                window.MeowTrack && window.MeowTrack('transmission_broadcast', { type: data.type, lang: getLang() });

                overlay.querySelector('#btn-copy-trans').onclick = () => {
                    navigator.clipboard.writeText(encoded);
                    overlay.querySelector('#btn-copy-trans').textContent = 'Copied!';
                };
                overlay.querySelector('#btn-close-trans').onclick = () => overlay.remove();

            }, 2000);
        }, 1500);
    }

    function openImportUI() {
        const val = prompt(t('transImport'));
        if (!val) return;
        
        const payload = decodeTransmission(val);
        if (payload && payload.id && payload.title) {
            if (window.MeowStore.saveImportedTransmission(payload)) {
                alert(t('transForeign'));
                window.MeowTrack && window.MeowTrack('transmission_imported', { type: payload.type, origin: payload.origin_week });
                if (window.MeowArchaeology && window.MeowArchaeology.renderArchive) {
                    window.MeowArchaeology.renderArchive();
                }
            } else {
                alert("Signal already archived or malformed.");
            }
        } else {
            alert("Invalid transmission signal.");
        }
    }

    window.MeowTransmissions = {
        broadcast: openBroadcastCeremony,
        importSignal: openImportUI,
        decode: decodeTransmission
    };

    // Attach to global hooks if needed
    window.addEventListener('meow:trans:import', openImportUI);

})();
