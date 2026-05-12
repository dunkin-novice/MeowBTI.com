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
        let desc = "";

        // Specific Rules
        if (a.code === "CHBR" && b.code === "CHBR") {
            vibeKey = "vibeBoss";
            desc = "A constant power struggle for the sunny spot.";
        } else if (a.code[2] === 'l' && b.code[2] === 'l') {
            vibeKey = "vibeOneBrainCell";
            desc = "Logic has left the building. Chaos reigns.";
        } else if (matches === 4) {
            vibeKey = "vibeTwin";
            desc = "Literally the same person in different bodies.";
        } else if (matches === 0) {
            vibeKey = "vibeOpposite";
            desc = "They have nothing in common, yet here they are.";
        } else if (matches === 3) {
            vibeKey = "vibeMafia";
            desc = "Coordinated efforts to acquire extra treats.";
        } else if (matches === 2) {
            if (a.code[3] === 'R' && b.code[3] === 'R') {
                vibeKey = "vibeChaotic";
                desc = "Emotional volume set to 11 at all times.";
            } else if (a.code[1] === 'A' && b.code[1] === 'A') {
                vibeKey = "vibeSupport";
                desc = "A constant loop of seeking and giving validation.";
            }
        }

        return {
            score,
            vibeKey,
            desc
        };
    }

    function getFullReport(profiles) {
        const pairs = [];
        for (let i = 0; i < profiles.length; i++) {
            for (let j = i + 1; j < profiles.length; j++) {
                const a = profiles[i];
                const b = profiles[j];
                const comp = compareCodes(a, b);
                pairs.push({
                    a, b, 
                    score: comp.score,
                    vibeKey: comp.vibeKey,
                    desc: comp.desc,
                    isBest: false,
                    isChaotic: false
                });
            }
        }

        if (pairs.length > 0) {
            // Find Best Match (highest score)
            const best = pairs.reduce((prev, current) => (prev.score > current.score) ? prev : current);
            best.isBest = true;

            // Find Most Chaotic (lowest score or One Brain Cell vibe)
            const chaotic = pairs.reduce((prev, current) => {
                if (current.vibeKey === "vibeOneBrainCell") return current;
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
            pairs: pairs.slice(0, 6), // Limit display
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
        getFullReport: getFullReport
    };
})();
