/**
 * MeowBTI OS Orchestrator v1
 * Manages the Information Architecture, Progressive Disclosure, and Calm vs Deep Lore modes.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

    function buildSkeleton() {
        const host = document.getElementById('family-content');
        if (!host) return null;
        
        let wrapper = document.getElementById('os-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'os-wrapper';
            
            const grid = document.getElementById('family-grid');
            const header = host.querySelector('.family-header');
            const footer = host.querySelector('.family-footer');
            const dailyLoop = document.getElementById('daily-loop');
            const weatherHome = document.querySelector('.emotional-weather-home-section');
            const identityEngine = document.querySelector('.identity-engine-section');

            host.append(wrapper);

            const layers = ['hero', 'snapshot', 'identity', 'archive', 'lore'];
            const builtLayers = {};

            layers.forEach(l => {
                let el = document.createElement('div');
                el.id = `os-layer-${l}`;
                el.className = `os-layer os-layer-${l}`;
                wrapper.append(el);
                builtLayers[l] = el;
            });

            // Add Headers first
            addHeader(builtLayers.snapshot, 'snapshot', t('dailyTitle'), false);
            addHeader(builtLayers.identity, 'identity', t('layerCiv'), false);
            addHeader(builtLayers.archive, 'archive', t('layerMemory'), true);
            addHeader(builtLayers.lore, 'lore', t('layerLore'), true);

            // Move legacy elements into containers
            const snapContent = builtLayers.snapshot.querySelector('.os-section-content');
            if (header) (snapContent || builtLayers.snapshot).append(header);
            if (dailyLoop) (snapContent || builtLayers.snapshot).append(dailyLoop);
            if (weatherHome) (snapContent || builtLayers.snapshot).append(weatherHome);
            if (grid) (snapContent || builtLayers.snapshot).append(grid);
            if (footer) (snapContent || builtLayers.snapshot).append(footer);

            const idContent = builtLayers.identity.querySelector('.os-section-content');
            if (identityEngine) (idContent || builtLayers.identity).append(identityEngine);

            // Add Mode Toggle at top
            const toggle = document.createElement('div');
            toggle.className = 'os-mode-toggle';
            toggle.innerHTML = `
                <button id="btn-mode-calm" class="mode-btn">${t('modeCalm')}</button>
                <button id="btn-mode-lore" class="mode-btn">${t('modeLore')}</button>
            `;
            wrapper.prepend(toggle);

            return builtLayers;
        }

        const builtLayers = {};
        ['hero', 'snapshot', 'identity', 'archive', 'lore'].forEach(l => {
            builtLayers[l] = document.getElementById(`os-layer-${l}`);
        });
        return builtLayers;
    }

    function addHeader(layerEl, key, title, isCollapsed) {
        const header = document.createElement('div');
        header.id = `os-header-${key}`;
        header.className = 'os-section-header';
        header.innerHTML = `
            <h3>${title}</h3>
            <span class="os-chevron">${isCollapsed ? '▼' : '▲'}</span>
        `;
        
        const contentContainer = document.createElement('div');
        contentContainer.className = 'os-section-content';
        contentContainer.style.display = isCollapsed ? 'none' : 'block';

        header.onclick = () => {
            const isNowCollapsed = contentContainer.style.display === 'none';
            contentContainer.style.display = isNowCollapsed ? 'block' : 'none';
            header.querySelector('.os-chevron').textContent = isNowCollapsed ? '▲' : '▼';
            if (window.MeowTrack) {
                window.MeowTrack(isNowCollapsed ? 'module_expand' : 'module_collapse', { layer: key, lang: getLang() });
                if (isNowCollapsed && key === 'archive') window.MeowTrack('archive_opened');
                if (isNowCollapsed && key === 'lore') window.MeowTrack('deep_lore_opened');
            }
        };

        layerEl.append(header);
        layerEl.append(contentContainer);
    }

    function applyMode(mode) {
        const wrapper = document.getElementById('os-wrapper');
        const loreLayer = document.getElementById('os-layer-lore');
        if (!wrapper) return;

        if (mode === 'calm') {
            wrapper.classList.remove('mode-lore');
            wrapper.classList.add('mode-calm');
            if (loreLayer) loreLayer.style.display = 'none';
            document.getElementById('btn-mode-calm')?.classList.add('active');
            document.getElementById('btn-mode-lore')?.classList.remove('active');
        } else {
            wrapper.classList.remove('mode-calm');
            wrapper.classList.add('mode-lore');
            if (loreLayer) loreLayer.style.display = 'block';
            document.getElementById('btn-mode-calm')?.classList.remove('active');
            document.getElementById('btn-mode-lore')?.classList.add('active');
        }
    }

    function checkUnlocks(historyLength, forgedCount, civDecisions) {
        // Updated First Week Journey Pacing
        return {
            theology: historyLength >= 3,
            museum: historyLength >= 5,
            federation: historyLength >= 7,
            governance: historyLength >= 7 || (civDecisions.history && civDecisions.history.length > 0),
            possession: historyLength >= 10,
            archaeology: historyLength >= 14,
            blackbox: historyLength >= 30
        };
    }

    function renderOrchestrator() {
        const layers = buildSkeleton();
        if (!layers) return;

        const settings = window.MeowStore.getOSSettings ? window.MeowStore.getOSSettings() : { mode: 'calm' };
        applyMode(settings.mode);

        const btnCalm = document.getElementById('btn-mode-calm');
        const btnLore = document.getElementById('btn-mode-lore');
        if (btnCalm) btnCalm.onclick = () => {
            window.MeowStore.updateOSSettings({ mode: 'calm' });
            applyMode('calm');
            window.MeowTrack && window.MeowTrack('calm_mode_enabled', { lang: getLang() });
        };
        if (btnLore) btnLore.onclick = () => {
            window.MeowStore.updateOSSettings({ mode: 'lore' });
            applyMode('lore');
            window.MeowTrack && window.MeowTrack('deep_lore_enabled', { lang: getLang() });
        };

        const history = (window.MeowDaily && window.MeowDaily.getHistory) ? window.MeowDaily.getHistory() : [];
        const forged = (window.MeowStore.getForgedRelics) ? window.MeowStore.getForgedRelics() : [];
        const decisions = (window.MeowStore.getCivDecisions) ? window.MeowStore.getCivDecisions() : { history: [] };
        
        window.MeowOSUnlocks = checkUnlocks(history.length, forged.length, decisions);

        // Echo Card Hooks for Unlocks
        if (window.MeowOSUnlocks.federation) {
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'unlock_federation',
                type: 'unlock',
                title: t('layerCiv'),
                lore: t('echoLoreUnlock'),
                icon: '🤝'
            }}));
        }
        if (window.MeowOSUnlocks.museum) {
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'unlock_museum',
                type: 'unlock',
                title: t('layerMemory'),
                lore: t('echoLoreUnlock'),
                icon: '🏛️'
            }}));
        }
        if (window.MeowOSUnlocks.archaeology) {
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'unlock_archaeology',
                type: 'unlock',
                title: t('archTitle'),
                lore: t('echoLoreUnlock'),
                icon: '⛏️'
            }}));
        }
        if (window.MeowOSUnlocks.theology) {
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'unlock_theology',
                type: 'unlock',
                title: t('relTitle'),
                lore: t('echoLoreUnlock'),
                icon: '✨'
            }}));
        }
        if (settings.mode === 'lore') {
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'unlock_deep_lore',
                type: 'unlock',
                title: t('modeLore'),
                lore: t('echoLoreUnlock'),
                icon: '🕵️'
            }}));
        }

        if (window.MeowTrack && history.length > 0) {
            window.MeowTrack('dashboard_depth', { mode: settings.mode, history_days: history.length, lang: getLang() });
            window.MeowTrack('label_cleanup_seen', { version: 1 });
        }
    }

    // Expose utility for modules to attach correctly
    window.MeowOS = {
        getLayer: (key) => {
            const layer = document.getElementById(`os-layer-${key}`);
            if (layer) {
                const content = layer.querySelector('.os-section-content');
                return content || layer;
            }
            return document.getElementById('family-content'); // Fallback
        },
        isUnlocked: (moduleKey) => window.MeowOSUnlocks && window.MeowOSUnlocks[moduleKey],
        renderLock: (host, moduleKey, hintKey) => {
            if (!host) return;
            const lock = document.createElement('div');
            lock.className = 'os-module-locked animate-fade-in';
            lock.innerHTML = `
                <h4>Locked Module</h4>
                <p>${t(hintKey)}</p>
            `;
            host.append(lock);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderOrchestrator);
    } else {
        renderOrchestrator();
    }

    window.addEventListener('meow:daily:updated', renderOrchestrator);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderOrchestrator();
    });

    // Scroll Depth Tracking
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const h = document.documentElement, 
              b = document.body,
              st = 'scrollTop',
              sh = 'scrollHeight';
        const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
        if (percent > maxScroll + 25) {
            maxScroll = Math.floor(percent / 25) * 25;
            window.MeowTrack && window.MeowTrack('dashboard_scroll_depth', { depth: maxScroll });
        }
    });

})();
