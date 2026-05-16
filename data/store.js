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

    window.MeowStore = {
        getFamily,
        saveFamilyProfile,
        removeFamilyProfile,
        generateProfileId
    };
})();
