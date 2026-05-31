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

    function getConnections(archive) {
        const allBoxes = window.MeowStore.getBlackBoxes() || [];
        const otherBoxes = allBoxes.filter(b => b.id !== archive.id);
        if (otherBoxes.length === 0) return null;

        const resTypes = ['resMirrorMemory', 'resSharedSignal', 'resMirrorRecord', 'resArchiveLink', 'resArchiveReflection', 'resAncientReflection'];
        const resMsgs = ['resMsgLoud', 'resMsgDoctrine', 'resMsgSync', 'resMsgOrigin'];

        // Find 1-3 resonant archives deterministically
        const seed = archive.id.length + archive.historyDepth;
        const count = (seed % 3) + 1;
        const selected = otherBoxes.slice(0, count);

        if (window.MeowTrack) {
            window.MeowTrack('archive_resonance_detected', { archive_id: archive.id, connection_count: selected.length });
            window.MeowTrack('archive_network_viewed', { total_archives: allBoxes.length });
        }

        return selected.map((other, i) => {
            const pairSeed = archive.id + other.id + new Date().getDate();
            let hash = 0;
            for (let k = 0; k < pairSeed.length; k++) hash = ((hash << 5) - hash) + pairSeed.charCodeAt(k);
            const absHash = Math.abs(hash);

            return {
                targetId: other.id.toUpperCase(),
                type: t(resTypes[absHash % resTypes.length]),
                note: t(resMsgs[absHash % resMsgs.length]).replace('{0}', other.id.toUpperCase().slice(-4)),
                why: getChemistryDetail(absHash)
            };
        });
    }

    function getChemistryDetail(seed) {
        const cats = ['catSharedRecovery', 'catParallelDrift', 'catRitualAlignment', 'catCrisisEcho', 'catQuietStability', 'catSameEraSurvival'];
        const reasons = ['reasonLoudWeek', 'reasonSoupRituals', 'reasonParallelRec', 'reasonStabilized', 'reasonSoftReset', 'reasonBufferSilence'];
        
        const catIndex = seed % cats.length;
        const reasonIndex = (seed + 3) % reasons.length; // Different offset for archives
        
        return {
            category: t(cats[catIndex]),
            reason: t(reasons[reasonIndex])
        };
    }

    function getDeterministicFiles(archive) {
        const seed = archive.id.length + archive.historyDepth;
        const connections = getConnections(archive);
        
        const files = {
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

        if (connections) {
            const doctrines = window.MeowStore.getSynthesisDoctrines() || [];
            const proposed = window.MeowStore.getProposedDoctrines() || [];
            const pillars = window.MeowStore.getLegacyPillars() || [];
            
            const synthesisIds = new Set(doctrines.flatMap(d => d.sourcePair));
            const federationIds = new Set(proposed.flatMap(p => p.sourcePair));
            const pillarSourceIds = new Set(pillars.map(p => p.sourceId));
            
            const synthesisPair = checkSynthesisEligibility();

            files['/connections'] = {
                icon: '🔗',
                onOpen: () => {
                    if (window.MeowTrack) {
                        window.MeowTrack('archive_link_reason_opened', { archive_id: archive.id });
                    }
                },
                content: connections.map(r => `
                    TARGET: #${r.targetId}
                    TYPE: ${r.type}
                    NOTE: ${r.note}
                    ${synthesisIds.has(r.targetId) ? `STATUS: ${t('synthesisContrib')}` : ''}
                    ${federationIds.has(r.targetId) ? `FEDERATION: ${t('fedCultureContrib')}` : ''}
                    ${pillarSourceIds.has(r.targetId) ? `LEGACY: ${t('pillarAdopted')}` : ''}
                    
                    WHY LINKED:
                    ${r.why.category.toUpperCase()}
                    “${r.why.reason}”
                    --------------------------
                    [COMMAND] mirror --target #${r.targetId}
                `).join('') + (synthesisPair ? `
                    --------------------------
                    [SYSTEM] ${t('synthesisEligible')}
                    [COMMAND] evolve --pair ${synthesisPair[0].id},${synthesisPair[1].id}
                ` : '')
            };
        }

        // ERA RECORD (v15)
        const era = window.MeowStore.getActiveEra ? window.MeowStore.getActiveEra() : null;
        if (era) {
            files['/era'] = {
                icon: '✦',
                content: `
                    CIVILIZATION ERA:
                    ${era.title.toUpperCase()}
                    
                    TRIGGER:
                    ${t('eraNote' + era.trigger.charAt(0).toUpperCase() + era.trigger.slice(1))}
                    
                    SYMBOLIC LOG:
                    “Era initiated as the civilization
                    transcended temporary survival
                    into permanent cultural abundance.”
                    --------------------------
                    SEAL: ${era.seal}
                    STATUS: ACTIVE
                `
            };
        }

        // SEED RECORD (v16)
        const seeds = window.MeowStore.getSeedCivilizations ? window.MeowStore.getSeedCivilizations() : [];
        if (seeds.length > 0) {
            files['/seed'] = {
                icon: '🌱',
                onOpen: () => {
                    if (window.MeowTrack) window.MeowTrack('seed_file_opened', { seed_count: seeds.length });
                },
                content: seeds.map(s => `
                    FOUNDED: ${s.title.toUpperCase()}
                    ORIGIN: ${s.originEra}
                    INHERITED: ${s.inherited}
                    
                    LOG:
                    “First Breath recorded. 
                    Generational continuity established.”
                    --------------------------
                    STATUS: ACTIVE
                `).join('')
            };
        }

        // LEGACY RECORD (v17)
        const storedTransfers = window.MeowStore.getLegacyTransfers ? window.MeowStore.getLegacyTransfers() : [];
        const archiveTransfers = Array.isArray(archive.legacyTransfers) ? archive.legacyTransfers : [];
        const transfers = (storedTransfers.length > 0 ? storedTransfers : archiveTransfers).filter(Boolean);
        if (transfers.length > 0) {
            files['/legacy'] = {
                icon: '🕯️',
                onOpen: () => {
                    if (window.MeowTrack) window.MeowTrack('legacy_file_opened', { transfer_count: transfers.length });
                },
                content: transfers.map(transfer => {
                    const previousEra = sanitize(transfer.previousEra || transfer.source || transfer.originEra || 'Unknown');
                    const traitTitle = sanitize(transfer.traitTitle || transfer.title || transfer.name || t('legacyTransferTitle'));
                    const note = sanitize(transfer.note || t('legacyStatusActive'), 160);
                    return `
                    PREVIOUS: ${previousEra.toUpperCase()}
                    INHERITED: ${traitTitle}
                    
                    LOG:
                    “${note}”
                    --------------------------
                    STATUS: ANCHORED
                `;
                }).join('')
            };
        }

        // RESTORED HEIRLOOMS (v18)
        const heirlooms = window.MeowStore.getRestoredHeirlooms ? window.MeowStore.getRestoredHeirlooms().filter(Boolean) : [];
        files['/heirlooms'] = {
            icon: '✨',
            onOpen: () => {
                if (window.MeowTrack) window.MeowTrack('heirloom_file_opened', { heirloom_count: heirlooms.length });
            },
            content: heirlooms.length > 0 ? heirlooms.map(heirloom => {
                const title = sanitize(heirloom.titleKey ? t(heirloom.titleKey) : (heirloom.title || t('heirloomShelfTitle')));
                const note = sanitize(heirloom.descKey ? t(heirloom.descKey) : (heirloom.description || t('heirloomDefaultDesc')), 180);
                const profile = heirloom.linkedProfileName ? sanitize(heirloom.linkedProfileName) : t('heirloomUnknownProfile');
                return `
                    TITLE: ${title}
                    PROFILE: ${profile}

                    LOG:
                    “${note}”
                    --------------------------
                    STATUS: ${t('heirloomRecoveredStatus')}
                `;
            }).join('') : t('heirloomGhostEmpty')
        };

        return files;
    }

    function generateBorrowedArtifact(targetId, archiveId, historyDepth) {
        // Deterministic generation from archive metadata
        const seed = targetId.length + historyDepth + new Date().getDate();
        const types = ['artBorrowedRitual', 'artBorrowedProverb', 'artBorrowedSignal', 'artBorrowedMotto', 'artBorrowedDoctrine'];
        const icons = ['🍲', '📜', '📡', '🛡️', '🧠'];
        const notes = ['borrowNoteShared', 'borrowNoteEcho', 'borrowNoteFragment'];
        
        const typeKey = types[seed % types.length];
        const icon = icons[seed % icons.length];
        const note = t(notes[seed % notes.length]);
        
        // Generate a name fragment based on class and depth
        const names = ['Silent Pause', 'Soup Ritual', 'Cloud Buffer', 'Soft Shield', 'Resonant Echo', 'Ancient Protocol'];
        const title = `${t(typeKey)}: ${names[seed % names.length]}`;

        return {
            id: 'borrow_' + targetId.toLowerCase() + '_' + seed,
            sourceId: targetId,
            typeKey,
            title,
            icon,
            note,
            mirroredFrom: archiveId
        };
    }

    function checkSynthesisEligibility() {
        const borrowed = window.MeowStore.getBorrowedRituals() || [];
        if (borrowed.length < 2) return null;

        const survived = window.MeowStore.survivedLoudWeeks();
        
        // Find first compatible pair
        for (let i = 0; i < borrowed.length; i++) {
            for (let j = i + 1; j < borrowed.length; j++) {
                const a = borrowed[i];
                const b = borrowed[j];
                
                // Compatibility: survivied OR specific type pairs
                const isCompatible = survived || 
                    (a.typeKey === 'artBorrowedRitual' && b.typeKey === 'artBorrowedProverb') ||
                    (a.typeKey === 'artBorrowedSignal' && b.typeKey === 'artBorrowedMotto') ||
                    (a.typeKey === 'artBorrowedDoctrine' && b.typeKey === 'artBorrowedRitual');
                
                if (isCompatible) return [a, b];
            }
        }
        return null;
    }

    function evolveDoctrine(pair) {
        const [a, b] = pair;
        const seed = a.id.length + b.id.length + new Date().getDate();
        
        const titles = ['Quiet Soup Accord', 'Parallel Reset Doctrine', 'Synchronized Stability Pact', 'Cloud Shield Protocol'];
        const icons = ['🍲', '🛏️', '⚖️', '🛡️'];
        const notes = ['synthesisNoteQuiet', 'synthesisNoteReset', 'synthesisNoteSync'];
        
        const title = t(titles[seed % titles.length]);
        const icon = icons[seed % icons.length];
        const note = t(notes[seed % notes.length]);

        return {
            id: 'doc_' + a.sourceId.toLowerCase() + '_' + b.sourceId.toLowerCase() + '_' + seed,
            title,
            icon,
            note,
            sourcePair: [a.sourceId, b.sourceId],
            ritualIds: [a.id, b.id]
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
                let content = files[path].content.trim();
                
                // Interactive command parsing
                if (path === '/connections') {
                    content = content.replace(/\[COMMAND\] mirror --target #([A-Z0-9]+)/g, (match, targetId) => {
                        return `<button class="ghost-mirror-btn" data-target="${targetId}">${t('borrowAction')}</button>`;
                    });
                    content = content.replace(/\[COMMAND\] evolve --pair ([^ ]+)/g, (match, pairIds) => {
                        return `<button class="ghost-evolve-btn" data-pair="${pairIds}">${t('synthesisAction')}</button>`;
                    });
                }

                terminal.innerHTML = `<p class="cmd-line">> cat ${path}</p><pre class="file-content">${content}</pre>`;
                
                // Bind buttons
                terminal.querySelectorAll('.ghost-mirror-btn').forEach(mBtn => {
                    mBtn.onclick = () => {
                        const targetId = mBtn.getAttribute('data-target');
                        const artifact = generateBorrowedArtifact(targetId, archive.id, archive.historyDepth);
                        
                        if (window.MeowStore.saveBorrowedRitual(artifact)) {
                            mBtn.innerHTML = `✅ ${t('borrowSuccess')}`;
                            mBtn.disabled = true;
                            mBtn.style.opacity = '0.5';
                            
                            if (window.MeowTrack) {
                                window.MeowTrack('ritual_mirrored', { source_id: targetId, artifact_type: artifact.title });
                                window.MeowTrack('linked_archive_mirrored', { archive_id: archive.id });
                            }
                        }
                    };
                });

                terminal.querySelectorAll('.ghost-evolve-btn').forEach(eBtn => {
                    eBtn.onclick = () => {
                        const pairIds = eBtn.getAttribute('data-pair').split(',');
                        const borrowed = window.MeowStore.getBorrowedRituals() || [];
                        const pair = [borrowed.find(r => r.id === pairIds[0]), borrowed.find(r => r.id === pairIds[1])];
                        
                        if (pair[0] && pair[1]) {
                            const doctrine = evolveDoctrine(pair);
                            if (window.MeowStore.saveSynthesisDoctrine(doctrine)) {
                                eBtn.innerHTML = `✨ ${t('synthesisSuccess')}`;
                                eBtn.disabled = true;
                                eBtn.style.opacity = '0.5';
                                
                                if (window.MeowTrack) {
                                    window.MeowTrack('synthesis_created', { doctrine_id: doctrine.id, title: doctrine.title });
                                    window.MeowTrack('linked_archive_contributed', { archive_id: pair[0].sourceId });
                                    window.MeowTrack('linked_archive_contributed', { archive_id: pair[1].sourceId });
                                }
                            }
                        }
                    };
                });

                // Trigger file-specific hooks
                if (files[path].onOpen) files[path].onOpen();

                if (window.MeowTrack) {
                    window.MeowTrack('archive_file_opened', { archive_id: archive.id, file_path: path });
                    if (path === '/connections') window.MeowTrack('connection_file_opened', { archive_id: archive.id });
                }
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
