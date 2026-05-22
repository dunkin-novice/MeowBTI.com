/**
 * MeowBTI Emotional Religion, Schism & Prophecy Systems v1
 * Generates structured belief systems, sects, and prophecies from emotional doctrines.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function determineReligion(doctrine, history) {
        if (doctrine === 'thParallelIntimacy') return { name: t('faithParallel'), sect: t('sectQuietOrth') };
        if (doctrine === 'thBlanketGov') return { name: t('faithBlanket'), sect: t('sectRadicalRot') };
        if (doctrine === 'thSoupLabor') return { name: t('faithSoup'), sect: t('sectEmergencySoup') };
        
        // Fallback or evolving faiths
        const recent = history.slice(0, 10);
        if (recent.filter(h => h.answers.energy === 'low').length > 5) return { name: t('faithHorizontal'), sect: t('cultRotProphets') };
        
        return { name: t('faithRecharge'), sect: t('sectChargerAsc') };
    }

    function getScripture(religion) {
        if (religion.name === t('faithHorizontal') || religion.name === t('faithBlanket')) return t('scrHorizontal');
        if (religion.name === t('faithSoup')) return t('scrSoupShared');
        return t('scrSilenceInfra');
    }

    function getProphecy(history) {
        const d = new Date();
        const seed = d.getFullYear() + d.getMonth() + d.getDate();
        
        // Simple deterministic rotation for v1
        if (seed % 3 === 0) return { text: t('proCharger'), isFulfilled: history.length > 30 };
        if (seed % 3 === 1) return { text: t('proLoudSoup'), isFulfilled: false };
        return { text: t('proBlanketSing'), isFulfilled: history.some(h => h.answers.social === 'hiding') };
    }

    function checkHeresy(stabilityScore, religion) {
        // High instability triggers heretical declarations against current sect
        if (stabilityScore < 30) {
            let schism = t('schGreatSoup');
            if (religion.name === t('faithBlanket')) schism = t('schBlanketPurity');
            if (religion.name === t('faithParallel')) schism = t('splitParallel');
            
            return {
                isHeresy: true,
                schismName: schism,
                reason: t('heresyReason')
            };
        }
        return { isHeresy: false };
    }

    function renderTheology() {
        const host = document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-theology-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-theology-section';
            container.className = 'theology-container animate-fade-in';
            // Insert after governance
            const gov = document.getElementById('household-governance-section');
            if (gov) gov.after(container);
            else host.append(container);
        }

        const history = getHistory();
        const localSnapshot = window.MeowFederation ? window.MeowFederation.getLocalCivilizationSnapshot() : {};
        const govState = window.MeowGovernanceState || { stability: 100 };
        
        const religion = determineReligion(localSnapshot.doctrine, history);
        const scripture = getScripture(religion);
        const prophecy = getProphecy(history);
        const heresy = checkHeresy(govState.stability, religion);

        // Export state for museum to canonize relics
        window.MeowTheologyState = {
            activeFaith: religion.name
        };

        if (!localSnapshot.doctrine && history.length < 10) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <h2 class="theology-h2">${t('relTitle')}</h2>
            
            <div class="faith-banner">${religion.name}</div>
            <span class="sect-label">${t('relSect')}: ${religion.sect}</span>

            ${heresy.isHeresy ? `
                <div style="margin-bottom:32px;">
                    <div class="heresy-badge">${t('heresyDeclared')}</div>
                    <div style="font-size:0.85rem; margin-top:8px; opacity:0.8;">${heresy.schismName} — ${heresy.reason}</div>
                    <button class="micro-share-icon mini" data-type="heresy" data-text="Declared Heretical: ${religion.sect}. ${heresy.schismName}">📤</button>
                </div>
            ` : ''}

            <div class="scripture-block">
                "${scripture}"
                <button class="micro-share-icon mini" style="position:absolute; bottom:12px; right:12px;" data-type="scripture" data-text="Emotional Scripture: ${scripture}">📤</button>
            </div>

            <div class="prophecy-strip ${prophecy.isFulfilled ? 'fulfilled' : ''}">
                <div style="font-size:1.5rem;">${prophecy.isFulfilled ? '👁️' : '🔮'}</div>
                <div style="flex:1;">
                    <div style="opacity:0.6; margin-bottom:4px;">${t('relProphecy')} ${prophecy.isFulfilled ? t('proFulfilled') : ''}</div>
                    <div>${prophecy.text}</div>
                </div>
                <button class="micro-share-icon mini" style="border-color:currentColor;" data-type="prophecy" data-text="Prophecy: ${prophecy.text}">📤</button>
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_theology',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        if (window.MeowTrack) {
            window.MeowTrack('religion_adopted', { religion_name: religion.name, lang: getLang() });
            window.MeowTrack('sect_formed', { sect_name: religion.sect, lang: getLang() });
            if (heresy.isHeresy) window.MeowTrack('heresy_detected', { schism: heresy.schismName, lang: getLang() });
            window.MeowTrack(prophecy.isFulfilled ? 'prophecy_fulfilled' : 'prophecy_generated', { text: prophecy.text, lang: getLang() });
            window.MeowTrack('scripture_viewed', { text: scripture, lang: getLang() });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderTheology);
    } else {
        renderTheology();
    }

    window.addEventListener('meow:daily:updated', renderTheology);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderTheology();
    });
})();
