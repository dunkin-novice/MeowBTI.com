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
        saveDiplomaticGift
    };
})();
