/**
 * MeowBTI Centralized Data Store
 * Handles all localStorage operations for the family system.
 */
(function() {
    const STORAGE_KEY = 'meow-bti-family';
    const SCHEMA_VERSION = 1;
    let _cachedStore = null;

    function getRawStore() {
        if (_cachedStore) return _cachedStore;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                _cachedStore = { version: SCHEMA_VERSION, profiles: [] };
                return _cachedStore;
            }
            const parsed = JSON.parse(raw);
            _cachedStore = normalizeStore(parsed);
            return _cachedStore;
        } catch (e) {
            console.error('MeowStore: Failed to parse localStorage:', e);
            return { version: SCHEMA_VERSION, profiles: [] };
        }
    }

    function normalizeStore(store) {
        if (!store || typeof store !== 'object') return { version: SCHEMA_VERSION, profiles: [] };
        if (!Array.isArray(store.profiles)) store.profiles = [];
        store.version = store.version || SCHEMA_VERSION;
        
        // Migration: Ensure all profiles have an ID
        let migrated = false;
        store.profiles.forEach(p => {
            if (!p.id) {
                p.id = generateProfileId();
                migrated = true;
            }
        });
        if (migrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        }

        return store;
    }

    function getFamily() {
        return getRawStore().profiles;
    }

    function saveFamilyProfile(profile) {
        const store = getRawStore();
        
        // Check for duplicates (same subject + code + name)
        const isDup = store.profiles.some(p => 
            p.subject === profile.subject && 
            p.code === profile.code && 
            p.name === profile.name
        );
        if (isDup) return false;

        store.profiles.push(profile);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function removeFamilyProfile(id) {
        const store = getRawStore();
        store.profiles = store.profiles.filter(p => p.id !== id);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function generateProfileId() {
        return 'p-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
    }

    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) _cachedStore = null;
    });

    function getForgedRelics() {
        return getRawStore().relics || [];
    }

    function saveForgedRelic(relic) {
        const store = getRawStore();
        store.relics = store.relics || [];
        // Update if exists, else push
        const idx = store.relics.findIndex(r => r.id === relic.id);
        if (idx >= 0) store.relics[idx] = relic;
        else store.relics.push(relic);
        
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getThoughtCabinet() {
        return getRawStore().thoughts || {};
    }

    function updateThought(id, data) {
        const store = getRawStore();
        store.thoughts = store.thoughts || {};
        store.thoughts[id] = {
            ...store.thoughts[id],
            ...data,
            lastUpdated: new Date().toISOString()
        };
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getActiveArc() {
        return getRawStore().activeArc || null;
    }

    function updateActiveArc(arcData) {
        const store = getRawStore();
        store.activeArc = arcData;
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getChronicles() {
        return getRawStore().chronicles || [];
    }

    function saveChronicle(chronicle) {
        const store = getRawStore();
        store.chronicles = store.chronicles || [];
        store.chronicles.push({
            ...chronicle,
            createdAt: new Date().toISOString()
        });
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getFederation() {
        return getRawStore().federation || [];
    }

    function saveFederationMember(member) {
        const store = getRawStore();
        store.federation = store.federation || [];
        const idx = store.federation.findIndex(f => f.id === member.id);
        if (idx >= 0) store.federation[idx] = member;
        else store.federation.push(member);
        
        // Prune to latest 20 members
        if (store.federation.length > 20) {
            store.federation = store.federation.slice(-20);
        }

        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getUnlockedStickers() {
        return getRawStore().unlockedStickers || {};
    }

    function unlockSticker(id) {
        const store = getRawStore();
        store.unlockedStickers = store.unlockedStickers || {};
        if (!store.unlockedStickers[id]) {
            store.unlockedStickers[id] = new Date().toISOString();
            _cachedStore = store;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
            return true;
        }
        return false;
    }

    function getDiplomaticGifts() {
        return getRawStore().diplomaticGifts || [];
    }

    function saveDiplomaticGift(gift) {
        const store = getRawStore();
        store.diplomaticGifts = store.diplomaticGifts || [];
        
        // Prevent exact duplicates (same key from same origin)
        const isDup = store.diplomaticGifts.some(g => g.key === gift.key && g.origin === gift.origin);
        if (isDup) return false;

        // Add gift with arrival timestamp
        store.diplomaticGifts.push({
            ...gift,
            receivedAt: new Date().toISOString()
        });

        // Prune to latest 50 gifts
        if (store.diplomaticGifts.length > 50) {
            store.diplomaticGifts = store.diplomaticGifts.slice(-50);
        }

        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getCivDecisions() {
        return getRawStore().civDecisions || { policies: [], history: [], alignment: 'neutral', traits: [] };
    }

    function updateCivDecisions(updater) {
        const store = getRawStore();
        const current = store.civDecisions || { policies: [], history: [], alignment: 'neutral', traits: [] };
        store.civDecisions = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return store.civDecisions;
    }

    function getOSSettings() {
        return getRawStore().osSettings || { mode: 'calm' };
    }

    function updateOSSettings(updater) {
        const store = getRawStore();
        const current = store.osSettings || { mode: 'calm' };
        store.osSettings = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return store.osSettings;
    }

    function getEchoCards() {
        return getRawStore().echoCards || [];
    }

    function saveEchoCard(card) {
        const store = getRawStore();
        store.echoCards = store.echoCards || [];
        if (store.echoCards.some(c => c.card_key === card.card_key)) return false;
        store.echoCards.push({ ...card, created_at: new Date().toISOString() });
        if (store.echoCards.length > 50) store.echoCards = store.echoCards.slice(-50);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getLostFragments() {
        return getRawStore().lostFragments || [];
    }

    function saveLostFragment(fragment) {
        const store = getRawStore();
        store.lostFragments = store.lostFragments || [];
        const idx = store.lostFragments.findIndex(f => f.id === fragment.id);
        if (idx >= 0) {
            store.lostFragments[idx] = { ...store.lostFragments[idx], ...fragment };
        } else {
            store.lostFragments.push({
                ...fragment,
                discoveredAt: new Date().toISOString()
            });
        }
        if (store.lostFragments.length > 50) store.lostFragments = store.lostFragments.slice(-50);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getBroadcasts() {
        return getRawStore().broadcasts || [];
    }

    function saveBroadcast(broadcast) {
        const store = getRawStore();
        store.broadcasts = store.broadcasts || [];
        store.broadcasts.push({
            ...broadcast,
            broadcastAt: new Date().toISOString()
        });
        if (store.broadcasts.length > 20) store.broadcasts = store.broadcasts.slice(-20);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getImportedTransmissions() {
        return getRawStore().importedTransmissions || [];
    }

    function saveImportedTransmission(transmission) {
        const store = getRawStore();
        store.importedTransmissions = store.importedTransmissions || [];
        // Prevent duplicates
        if (store.importedTransmissions.some(t => t.id === transmission.id)) return false;
        
        store.importedTransmissions.push({
            ...transmission,
            importedAt: new Date().toISOString()
        });
        if (store.importedTransmissions.length > 30) store.importedTransmissions = store.importedTransmissions.slice(-30);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getSavedStations() {
        return getRawStore().savedStations || [];
    }

    function saveStation(station) {
        const store = getRawStore();
        store.savedStations = store.savedStations || [];
        if (store.savedStations.some(s => s.freq === station.freq)) return false;
        store.savedStations.push({
            ...station,
            savedAt: new Date().toISOString()
        });
        if (store.savedStations.length > 20) store.savedStations = store.savedStations.slice(-20);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getVoidRecordings() {
        return getRawStore().voidRecordings || [];
    }

    function saveVoidRecording(recording) {
        const store = getRawStore();
        store.voidRecordings = store.voidRecordings || [];
        const idx = store.voidRecordings.findIndex(r => r.id === recording.id);
        if (idx >= 0) {
            store.voidRecordings[idx] = { ...store.voidRecordings[idx], ...recording };
        } else {
            store.voidRecordings.push({
                ...recording,
                capturedAt: new Date().toISOString()
            });
        }
        if (store.voidRecordings.length > 40) store.voidRecordings = store.voidRecordings.slice(-40);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getSyntheticEchoes() {
        return getRawStore().syntheticEchoes || [];
    }

    function saveSyntheticEcho(echo) {
        const store = getRawStore();
        store.syntheticEchoes = store.syntheticEchoes || [];
        if (store.syntheticEchoes.some(e => e.id === echo.id)) return false;
        store.syntheticEchoes.push({
            ...echo,
            generatedAt: new Date().toISOString()
        });
        if (store.syntheticEchoes.length > 25) store.syntheticEchoes = store.syntheticEchoes.slice(-25);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getCompositeSignals() {
        return getRawStore().compositeSignals || [];
    }

    function saveCompositeSignal(signal) {
        const store = getRawStore();
        store.compositeSignals = store.compositeSignals || [];
        if (store.compositeSignals.some(s => s.id === signal.id)) return false;
        store.compositeSignals.push({
            ...signal,
            formedAt: new Date().toISOString()
        });
        if (store.compositeSignals.length > 10) store.compositeSignals = store.compositeSignals.slice(-10);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    window.MeowStore = {
        getFamily,
        saveFamilyProfile,
        removeFamilyProfile,
        generateProfileId,
        getForgedRelics,
        saveForgedRelic,
        getThoughtCabinet,
        updateThought,
        getActiveArc,
        updateActiveArc,
        getChronicles,
        saveChronicle,
        getFederation,
        saveFederationMember,
        getUnlockedStickers,
        unlockSticker,
        getDiplomaticGifts,
        saveDiplomaticGift,
        getCivDecisions,
        updateCivDecisions,
        getOSSettings,
        updateOSSettings,
        getEchoCards,
        saveEchoCard,
        getLostFragments,
        saveLostFragment,
        getBroadcasts,
        saveBroadcast,
        getImportedTransmissions,
        saveImportedTransmission,
        getSavedStations,
        saveStation,
        getVoidRecordings,
        saveVoidRecording,
        getSyntheticEchoes,
        saveSyntheticEcho,
        getCompositeSignals,
        saveCompositeSignal
    };
})();
