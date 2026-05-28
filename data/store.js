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
        store.chronicles.push({ ...chronicle, createdAt: new Date().toISOString() });
        if (store.chronicles.length > 20) store.chronicles = store.chronicles.slice(-20);
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
        if (store.federation.length > 20) store.federation = store.federation.slice(-20);
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
        const isDup = store.diplomaticGifts.some(g => g.key === gift.key && g.origin === gift.origin);
        if (isDup) return false;
        store.diplomaticGifts.push({ ...gift, receivedAt: new Date().toISOString() });
        if (store.diplomaticGifts.length > 50) store.diplomaticGifts = store.diplomaticGifts.slice(-50);
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
        if (idx >= 0) store.lostFragments[idx] = { ...store.lostFragments[idx], ...fragment };
        else store.lostFragments.push({ ...fragment, discoveredAt: new Date().toISOString() });
        if (store.lostFragments.length > 50) store.lostFragments = store.lostFragments.slice(-50);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getBroadcasts() {
        return getRawStore().broadcasts || [];
    }

    function saveBroadcast(broadcast) {
        const store = getRawStore();
        store.broadcasts = store.broadcasts || [];
        store.broadcasts.push({ ...broadcast, broadcastAt: new Date().toISOString() });
        if (store.broadcasts.length > 20) store.broadcasts = store.broadcasts.slice(-20);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getImportedTransmissions() {
        return getRawStore().importedTransmissions || [];
    }

    function saveImportedTransmission(transmission) {
        const store = getRawStore();
        store.importedTransmissions = store.importedTransmissions || [];
        if (store.importedTransmissions.some(t => t.id === transmission.id)) return false;
        store.importedTransmissions.push({ ...transmission, importedAt: new Date().toISOString() });
        if (store.importedTransmissions.length > 30) store.importedTransmissions = store.importedTransmissions.slice(-30);
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
        store.savedStations.push({ ...station, savedAt: new Date().toISOString() });
        if (store.savedStations.length > 20) store.savedStations = store.savedStations.slice(-20);
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
        if (idx >= 0) store.voidRecordings[idx] = { ...store.voidRecordings[idx], ...recording };
        else store.voidRecordings.push({ ...recording, capturedAt: new Date().toISOString() });
        if (store.voidRecordings.length > 40) store.voidRecordings = store.voidRecordings.slice(-40);
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
        store.syntheticEchoes.push({ ...echo, generatedAt: new Date().toISOString() });
        if (store.syntheticEchoes.length > 25) store.syntheticEchoes = store.syntheticEchoes.slice(-25);
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
        store.compositeSignals.push({ ...signal, formedAt: new Date().toISOString() });
        if (store.compositeSignals.length > 10) store.compositeSignals = store.compositeSignals.slice(-10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getBlackBoxes() {
        return getRawStore().blackBoxes || [];
    }

    function saveBlackBox(box) {
        const store = getRawStore();
        store.blackBoxes = store.blackBoxes || [];
        const idx = store.blackBoxes.findIndex(b => b.id === box.id);
        if (idx >= 0) store.blackBoxes[idx] = { ...store.blackBoxes[idx], ...box };
        else store.blackBoxes.push({ ...box, sealedAt: new Date().toISOString() });
        if (store.blackBoxes.length > 15) store.blackBoxes = store.blackBoxes.slice(-15);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getBorrowedRituals() {
        return getRawStore().borrowedRituals || [];
    }

    function saveBorrowedRitual(ritual) {
        const store = getRawStore();
        store.borrowedRituals = store.borrowedRituals || [];
        if (store.borrowedRituals.some(r => r.id === ritual.id)) return false;
        store.borrowedRituals.push({ ...ritual, mirroredAt: new Date().toISOString() });
        if (store.borrowedRituals.length > 6) store.borrowedRituals = store.borrowedRituals.slice(-6);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getSynthesisDoctrines() {
        return getRawStore().synthesisDoctrines || [];
    }

    function saveSynthesisDoctrine(doctrine) {
        const store = getRawStore();
        store.synthesisDoctrines = store.synthesisDoctrines || [];
        if (store.synthesisDoctrines.some(d => d.id === doctrine.id)) return false;
        store.synthesisDoctrines.push({ ...doctrine, evolvedAt: new Date().toISOString() });
        if (store.synthesisDoctrines.length > 4) store.synthesisDoctrines = store.synthesisDoctrines.slice(-4);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getLegacyPillars() {
        return getRawStore().legacyPillars || [];
    }

    function saveLegacyPillar(pillar) {
        const store = getRawStore();
        store.legacyPillars = store.legacyPillars || [];
        if (store.legacyPillars.some(p => p.id === pillar.id)) return false;
        store.legacyPillars.push({ ...pillar, adoptedAt: new Date().toISOString() });
        if (store.legacyPillars.length > 4) store.legacyPillars = store.legacyPillars.slice(-4);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getProposedDoctrines() {
        return getRawStore().proposedDoctrines || [];
    }

    function saveProposedDoctrine(doctrine) {
        const store = getRawStore();
        store.proposedDoctrines = store.proposedDoctrines || [];
        if (store.proposedDoctrines.some(d => d.id === doctrine.id)) return false;
        store.proposedDoctrines.push({ ...doctrine, proposedAt: new Date().toISOString() });
        if (store.proposedDoctrines.length > 5) store.proposedDoctrines = store.proposedDoctrines.slice(-5);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function addPrestige(amount) {
        const store = getRawStore();
        store.civPrestige = (store.civPrestige || 0) + amount;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return store.civPrestige;
    }

    function getCivPrestige() {
        return getRawStore().civPrestige || 0;
    }

    function getEraRecords() {
        return getRawStore().eraRecords || [];
    }

    function saveEraRecord(record) {
        const store = getRawStore();
        store.eraRecords = store.eraRecords || [];
        if (store.eraRecords.some(r => r.id === record.id)) return false;
        store.eraRecords.push({ ...record, unlockedAt: new Date().toISOString() });
        if (store.eraRecords.length > 6) store.eraRecords = store.eraRecords.slice(-6);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getSeedCivilizations() {
        return getRawStore().seedCivilizations || [];
    }

    function saveSeedCivilization(seed) {
        const store = getRawStore();
        store.seedCivilizations = store.seedCivilizations || [];
        if (store.seedCivilizations.some(s => s.id === seed.id)) return false;
        store.seedCivilizations.push({ ...seed, seededAt: new Date().toISOString() });
        if (store.seedCivilizations.length > 4) store.seedCivilizations = store.seedCivilizations.slice(-4);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function getLegacyTransfers() {
        return getRawStore().legacyTransfers || [];
    }

    function saveLegacyTransfer(transfer) {
        const store = getRawStore();
        store.legacyTransfers = store.legacyTransfers || [];
        if (store.legacyTransfers.some(t => t.id === transfer.id)) return false;
        store.legacyTransfers.push({ ...transfer, transferredAt: new Date().toISOString() });
        if (store.legacyTransfers.length > 6) store.legacyTransfers = store.legacyTransfers.slice(-6);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    function checkLegacyEligibility() {
        const era = getActiveEra();
        if (!era) return { eligible: false };
        const seeds = getSeedCivilizations();
        if (seeds.length >= 1) return { eligible: true, era, seed: seeds[0] };
        return { eligible: false };
    }

    function inheritLegacyTrait() {
        const eligibility = checkLegacyEligibility();
        if (!eligibility.eligible) return null;

        const { t } = window.MeowI18n || { t: k => k };
        const era = eligibility.era;
        const seed = eligibility.seed;
        const prestige = getCivPrestige();
        
        const seedValue = seed.id.length + era.id.length + prestige;
        const traits = [
            { id: 'traitHistoricallyQuiet', icon: '🕯️' },
            { id: 'traitSoupReinforced', icon: '🍲' },
            { id: 'traitParallelRooted', icon: '🌳' },
            { id: 'traitEmotionallyStable', icon: '⚖️' },
            { id: 'traitRecoveryDriven', icon: '⚡' }
        ];
        
        const trait = traits[seedValue % traits.length];
        
        return {
            id: 'legacy_' + era.id.toLowerCase() + '_' + seed.id.toLowerCase() + '_' + (seedValue % 100),
            traitId: trait.id,
            traitTitle: t(trait.id),
            icon: trait.icon,
            previousEra: era.title,
            note: t('legacyPassedFrom').replace('{0}', era.title)
        };
    }

    function checkSeedingEligibility() {
        const era = getActiveEra();
        if (!era) return { eligible: false };
        
        const pillars = getLegacyPillars().length;
        const doctrines = getSynthesisDoctrines().length;
        
        if (pillars >= 1 || doctrines >= 1) return { eligible: true, era, pillars, doctrines };
        return { eligible: false };
    }

    function generateSeedCivilization() {
        const eligibility = checkSeedingEligibility();
        if (!eligibility.eligible) return null;

        const { t } = window.MeowI18n || { t: k => k };
        const era = eligibility.era;
        const pillars = getLegacyPillars();
        const doctrines = getSynthesisDoctrines();
        const prestige = getCivPrestige();
        
        const strongest = doctrines.length > 0 ? doctrines[0] : (pillars.length > 0 ? pillars[0] : null);
        const seedValue = (strongest ? strongest.id.length : 0) + era.id.length + prestige;
        
        const types = [
            { id: 'seedBufferColony', icon: '🌱', note: 'seedNoteBuffer' },
            { id: 'seedSoupRelay', icon: '🍲', note: 'seedNoteSoup' },
            { id: 'seedSoftPioneer', icon: '☁️', note: 'seedNoteSoft' },
            { id: 'seedParallelRoot', icon: '🌳', note: 'seedNoteParallel' }
        ];
        
        const type = types[seedValue % types.length];
        
        return {
            id: 'seed_' + era.id.toLowerCase() + '_' + (strongest ? strongest.id.toLowerCase() : 'none') + '_' + (seedValue % 100),
            title: t(type.id),
            icon: type.icon,
            originEra: era.title,
            inherited: strongest ? strongest.title : 'General Recovery',
            note: t(type.note)
        };
    }

    function checkEraEligibility() {
        const pillars = getLegacyPillars().length;
        const proposed = getProposedDoctrines().length;
        const history = window.MeowDaily ? window.MeowDaily.getHistory().length : 0;
        const prestige = getCivPrestige();
        
        if (pillars >= 4) return { eligible: true, trigger: 'pillars' };
        if (proposed >= 3) return { eligible: true, trigger: 'doctrines' };
        if (history >= 30 && prestige >= 150) return { eligible: true, trigger: 'history' };
        
        return { eligible: false };
    }

    function getActiveEra() {
        const eligibility = checkEraEligibility();
        if (!eligibility.eligible) return null;
        
        const pillars = getLegacyPillars();
        const doctrines = getSynthesisDoctrines();
        const prestige = getCivPrestige();
        const { t } = window.MeowI18n || { t: k => k };

        const seed = pillars.length + doctrines.length + prestige;
        const eraTypes = [
            { id: 'eraQuietRecovery', seal: '🌙' },
            { id: 'eraParallelBloom', seal: '🌸' },
            { id: 'eraSoupCentury', seal: '🍲' },
            { id: 'eraSoftInfra', seal: '☁️' },
            { id: 'eraGreatRecharge', seal: '⚡' }
        ];
        
        const era = eraTypes[seed % eraTypes.length];
        return {
            ...era,
            trigger: eligibility.trigger,
            title: t(era.id),
            desc: t(era.id + 'Desc')
        };
    }

    function survivedLoudWeeks() {
        if (!window.MeowDaily) return false;
        const history = window.MeowDaily.getHistory() || [];
        if (history.length < 21) return false;
        for (let week = 0; week < 3; week++) {
            const chunk = history.slice(week * 7, (week * 7) + 7);
            const loudDays = chunk.filter(h => h.answers.stress === 'overloaded').length;
            if (loudDays < 3) return false;
        }
        return true;
    }

    function getCompositeArchives() {
        return getRawStore().compositeArchives || [];
    }

    function saveCompositeArchive(archive) {
        const store = getRawStore();
        store.compositeArchives = store.compositeArchives || [];
        if (store.compositeArchives.some(a => a.id === archive.id)) return false;
        store.compositeArchives.push({ ...archive, mergedAt: new Date().toISOString() });
        if (store.compositeArchives.length > 6) store.compositeArchives = store.compositeArchives.slice(-6);
        _cachedStore = store;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return true;
    }

    window.MeowStore = {
        getFamily, saveFamilyProfile, removeFamilyProfile, generateProfileId,
        getForgedRelics, saveForgedRelic, getThoughtCabinet, updateThought,
        getActiveArc, updateActiveArc, getChronicles, saveChronicle,
        getFederation, saveFederationMember, getUnlockedStickers, unlockSticker,
        getDiplomaticGifts, saveDiplomaticGift, getCivDecisions, updateCivDecisions,
        getOSSettings, updateOSSettings, getEchoCards, saveEchoCard,
        getLostFragments, saveLostFragment, getBroadcasts, saveBroadcast,
        getImportedTransmissions, saveImportedTransmission, getSavedStations, saveStation,
        getVoidRecordings, saveVoidRecording, getSyntheticEchoes, saveSyntheticEcho,
        getCompositeSignals, saveCompositeSignal, getBlackBoxes, saveBlackBox,
        getBorrowedRituals, saveBorrowedRitual, getSynthesisDoctrines, saveSynthesisDoctrine,
        getLegacyPillars,
        saveLegacyPillar,
        getProposedDoctrines,
        saveProposedDoctrine,
        addPrestige,
        getCivPrestige,
        getEraRecords,
        saveEraRecord,
        checkEraEligibility,
        getActiveEra,
        getSeedCivilizations,
        saveSeedCivilization,
        checkSeedingEligibility,
        generateSeedCivilization,
        getLegacyTransfers,
        saveLegacyTransfer,
        checkLegacyEligibility,
        inheritLegacyTrait,
        survivedLoudWeeks,
        getCompositeArchives,
        saveCompositeArchive
    };
})();
