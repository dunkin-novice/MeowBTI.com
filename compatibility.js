/**
 * MeowBTI Compatibility Engine
 * Logic for comparing VALR codes and generating household dynamics.
 */
(function() {
    function getT() {
        return (window.MeowI18n && window.MeowI18n.t) || ((k) => k);
    }

    function compareCodes(a, b) {
        const t = getT();
        let matches = 0;
        for (let i = 0; i < 4; i++) {
            if (a.code[i] === b.code[i]) matches++;
        }

        const score = (matches / 4) * 100;
        let vibeKey = "vibeRoommate";
        let descKey = "compDescRoommateEnergy";

        // Specific Rules
        if (a.code === "CHBR" && b.code === "CHBR") {
            vibeKey = "vibeBoss";
            descKey = "compDescBossBattle";
        } else if (a.code[2] === 'l' && b.code[2] === 'l') {
            vibeKey = "vibeOneBrainCell";
            descKey = "compDescOneBrainCell";
        } else if (matches === 4) {
            vibeKey = "vibeTwin";
            descKey = "compDescTwinFlames";
        } else if (matches === 0) {
            vibeKey = "vibeOpposite";
            descKey = "compDescTotalOpposites";
        } else if (matches === 3) {
            vibeKey = "vibeMafia";
            descKey = "compDescTinyMafia";
        } else if (matches === 2) {
            if (a.code[3] === 'R' && b.code[3] === 'R') {
                vibeKey = "vibeChaotic";
                descKey = "compDescChaoticVolume";
            } else if (a.code[1] === 'A' && b.code[1] === 'A') {
                vibeKey = "vibeSupport";
                descKey = "compDescEmotionalSupport";
            }
        }

        return {
            score,
            vibeKey,
            desc: t(descKey)
        };
    }

    function getDuoDynamic(a, b) {
        const t = getT();
        
        // Axis check
        const aCode = a.code;
        const bCode = b.code;

        const bothHighEnergy = aCode[0] === 'V' && bCode[0] === 'V';
        const bothLowEnergy = aCode[0] === 'v' && bCode[0] === 'v';
        const energyMismatch = aCode[0] !== bCode[0];

        const bothLogical = aCode[1] === 'H' && bCode[1] === 'H';
        const bothEmotional = aCode[1] === 'D' && bCode[1] === 'D';
        const logicMismatch = aCode[1] !== bCode[1];

        const bothChaos = aCode[2] === 'l' && bCode[2] === 'l';
        const bothStructured = aCode[2] === 'B' && bCode[2] === 'B';
        const chaosMismatch = aCode[2] !== bCode[2];

        const bothRegal = aCode[3] === 'R' && bCode[3] === 'R';
        const bothCasual = aCode[3] === 'F' && bCode[3] === 'F';

        let dynamicKey = "dynRoommates";
        
        if ((aCode[2] === 'B' && bCode[2] === 'l') || (bCode[2] === 'B' && aCode[2] === 'l')) {
            dynamicKey = "dynSpreadsheet";
        } else if (bothCasual && bothChaos) {
            dynamicKey = "dynImprov";
        } else if (bothHighEnergy && bothChaos) {
            dynamicKey = "dynSideQuests";
        } else if ((aCode[1] === 'N' && bCode[2] === 'l') || (bCode[1] === 'N' && aCode[2] === 'l')) {
            dynamicKey = "dynExhaustion";
        } else if (aCode === bCode) {
            dynamicKey = "dynEcho";
        } else if (bothLowEnergy && bothCasual) {
            dynamicKey = "dynStagnation";
        } else if (bothRegal && bothStructured) {
            dynamicKey = "dynPowerStruggle";
        } else if (logicMismatch && chaosMismatch) {
            dynamicKey = "dynAnchorKite";
        }

        // Expanded Relational Modules
        const chemistry = (bothEmotional || bothHighEnergy) ? t('chemHigh') : (logicMismatch ? t('chemMagnetic') : t('chemStable'));
        const drain = (energyMismatch && bothLogical) ? t('drainHigh') : t('drainLow');
        const conflict = (bothRegal) ? t('confExplosive') : (bothCasual ? t('confAvoidant') : t('confConstructive'));
        const recovery = (bothLowEnergy) ? t('recHigh') : (energyMismatch ? t('recMismatched') : t('recModerate'));

        return {
            title: t(dynamicKey + "Title"),
            desc: t(dynamicKey + "Desc"),
            key: dynamicKey,
            chaosLevel: (bothChaos ? 90 : (chaosMismatch ? 50 : 20)),
            modules: {
                chemistry,
                drain,
                conflict,
                recovery
            }
        };
    }

    function getFullReport(profiles) {
        const pairs = [];
        for (let i = 0; i < profiles.length; i++) {
            for (let j = i + 1; j < profiles.length; j++) {
                const a = profiles[i];
                const b = profiles[j];
                const comp = compareCodes(a, b);
                const dynamic = getDuoDynamic(a, b);
                pairs.push({
                    a, b, 
                    score: comp.score,
                    vibeKey: comp.vibeKey,
                    desc: comp.desc,
                    dynamic: dynamic,
                    isBest: false,
                    isChaotic: false
                });
            }
        }

        if (pairs.length > 0) {
            // Find Best Match (highest score)
            const best = pairs.reduce((prev, current) => (prev.score > current.score) ? prev : current);
            best.isBest = true;

            // Find Most Chaotic (highest shared chaos or lowest score)
            const chaotic = pairs.reduce((prev, current) => {
                if (current.dynamic.key === "dynSideQuests" || current.dynamic.key === "dynImprov") return current;
                return (prev.score < current.score) ? prev : current;
            });
            chaotic.isChaotic = true;
        }

        // Find Household Menace
        // Menace Score = count of 'l' (Chaos Goblin) and 'R' (Drama Queen)
        let menace = null;
        let maxMenaceScore = -1;
        profiles.forEach(p => {
            let mScore = 0;
            if (p.code[2] === 'l') mScore += 2; // Logic: Chaos
            if (p.code[3] === 'R') mScore += 1; // Reaction: Drama
            if (p.code[0] === 'V') mScore += 1; // Vibe: Zoomies
            
            if (mScore > maxMenaceScore) {
                maxMenaceScore = mScore;
                menace = p;
            }
        });

        return {
            pairs: pairs, // Return all for dashboard selection
            menace: maxMenaceScore >= 2 ? menace : null
        };
    }

    function getHouseholdStats(profiles) {
        if (profiles.length === 0) return null;
        
        const axes = { V: 0, v: 0, A: 0, a: 0, L: 0, l: 0, R: 0, r: 0 };
        profiles.forEach(p => {
            p.code.split('').forEach(char => axes[char]++);
        });

        const dominant = Object.keys(axes).reduce((a, b) => axes[a] > axes[b] ? a : b);
        const chaosCount = (axes['l'] || 0) + (axes['R'] || 0);
        const chaosLevel = Math.round((chaosCount / (profiles.length * 2)) * 100);

        return {
            dominantAxis: dominant,
            chaosLevel: Math.min(100, chaosLevel),
            memberCount: profiles.length
        };
    }

    window.MeowCompatibility = {
        compare: compareCodes,
        getStats: getHouseholdStats,
        getFullReport: getFullReport,
        getDuoDynamic: getDuoDynamic
    };
})();
