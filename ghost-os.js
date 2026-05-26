/**
 * MeowBTI Ghost OS v9 — “Booting the Archive”
 * Explorable symbolic filesystem for civilization archives.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;
    const sanitize = window.MeowSanitize || ((s) => s);

    const GHOST_STATES = ['ghostDormant', 'ghostStable', 'ghostFlickering', 'ghostPresent', 'ghostGone'];
    const FINAL_NOTES = ['noteSilence', 'noteSoup', 'noteSoftness', 'noteEvidence'];

    function getDeterministicFiles(archive) {
        const seed = archive.id.length + archive.historyDepth;
        
        return {
            '/identity': {
                icon: '🆔',
                content: `
                    CLASS: ${t('cls' + archive.civType)}
                    MOTTO: ${archive.motto || t('mottoStability')}
                    RANK: ${archive.rank}
                    STATUS: ${t('bbStateSealed')}
                `
            },
            '/history': {
                icon: '⏳',
                content: `
                    ERA: ${archive.era || 'Early History'}
                    DEPTH: ${archive.historyDepth} Days
                    DOMINANT: ${archive.dominantEvent}
                    --------------------------
                    Log fragment recovered...
                    Day 1: Connection established.
                    Day ${Math.floor(archive.historyDepth / 2)}: Strata detected.
                    Day ${archive.historyDepth}: Final Snapshot.
                `
            },
            '/signals': {
                icon: '📡',
                content: `
                    LAST FREQ: ${archive.freq || '88.1'} MHz
                    SOURCE: Local Atmosphere
                    INTEGRITY: ${100 - (archive.corruption || 0) * 100}%
                    --------------------------
                    "Atmospheric residue remains active."
                `
            },
            '/memory': {
                icon: '🧠',
                content: `
                    DOCTRINES: ${archive.doctrines ? archive.doctrines.map(d => t(d)).join(', ') : 'None'}
                    RELICS: ${archive.relicCount}
                    FEDERATION: ${archive.fedCount} Alliances
                `
            },
            '/final-note': {
                icon: '📝',
                content: t(FINAL_NOTES[seed % FINAL_NOTES.length])
            }
        };
    }

    function openGhostOS(archive) {
        const overlay = document.createElement('div');
        overlay.className = 'ghost-os-overlay active';
        
        const settings = window.MeowStore.getOSSettings ? window.MeowStore.getOSSettings() : { mode: 'calm' };
        if (settings.mode === 'lore') overlay.classList.add('mode-lore');

        const seed = archive.id.length + new Date().getDate();
        const ghostState = GHOST_STATES[seed % GHOST_STATES.length];

        overlay.innerHTML = `
            <div class="ghost-scanline"></div>
            <div class="ghost-container animate-fade-in">
                <div class="ghost-header">
                    <div class="ghost-title">GHOST OS v9.0.1 - #/ARCHIVE/${archive.id.toUpperCase()}</div>
                    <div class="ghost-status">${t(ghostState)}</div>
                    <button class="ghost-close-btn" id="btn-ghost-close">✕</button>
                </div>
                
                <div class="ghost-body">
                    <div class="ghost-sidebar">
                        <div class="file-list" id="ghost-file-list"></div>
                    </div>
                    <div class="ghost-main">
                        <div class="terminal-output" id="ghost-terminal">
                            <p class="boot-line">> BOOTING ARCHIVE...</p>
                            <p class="boot-line">> DECOMPRESSING STRATA...</p>
                            <p class="boot-line">> ACCESS GRANTED.</p>
                            <p class="boot-line">--------------------------</p>
                            <p class="boot-line">Welcome, authorized observer.</p>
                            <p class="boot-line">Select a fragment to visualize.</p>
                        </div>
                    </div>
                </div>
                
                <div class="ghost-footer">
                    <span class="footer-meta">${t('bbLastAccessed')}: ${new Date().toLocaleTimeString()}</span>
                    <span class="footer-meta">${t('bbWeight')}: ${archive.historyDepth * 10}</span>
                </div>
            </div>
        `;

        document.body.append(overlay);

        const terminal = overlay.querySelector('#ghost-terminal');
        const fileList = overlay.querySelector('#ghost-file-list');
        const files = getDeterministicFiles(archive);

        Object.keys(files).forEach(path => {
            const btn = document.createElement('div');
            btn.className = 'file-item';
            btn.innerHTML = `<span class="file-icon">${files[path].icon}</span> ${path}`;
            btn.onclick = () => {
                terminal.innerHTML = `<p class="cmd-line">> cat ${path}</p><pre class="file-content">${files[path].content.trim()}</pre>`;
                window.MeowTrack && window.MeowTrack('archive_file_opened', { archive_id: archive.id, file_path: path });
            };
            fileList.append(btn);
        });

        overlay.querySelector('#btn-ghost-close').onclick = () => {
            overlay.remove();
        };

        // Update last accessed
        const isRevisit = !!archive.lastBooted;
        archive.lastBooted = new Date().toISOString();
        window.MeowStore.saveBlackBox(archive);

        if (window.MeowTrack) {
            window.MeowTrack('archive_booted', { archive_id: archive.id, ghost_state: ghostState });
            window.MeowTrack('ghost_presence_seen', { ghost_state: ghostState });
            if (isRevisit) window.MeowTrack('archive_revisited', { archive_id: archive.id });
        }
    }

    window.MeowGhostOS = {
        boot: openGhostOS
    };

})();
