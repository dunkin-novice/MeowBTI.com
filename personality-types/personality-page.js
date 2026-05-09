// MeowBTI personality page renderer.
// Reads code from filename + tally from ?t querystring (set by quiz),
// then builds the trading-card result UI inside #personality-content.

(function () {
    const PERSONALITIES = {
        CHBR: { code:"CHBR", name:"The Grand General",         tagline:"Runs the household like a small, judgmental kingdom.",  emoji:"👑", color:"#FF5B3B", bg:"#FFE3D6",
            vibes:["Bossy","Loud","Loyal","Knocks Things Off Tables On Purpose"],
            famouslySays:"I scheduled this meeting. You will attend.",
            kindredSpirits:["Gordon Ramsay","Miranda Priestly","your group chat admin"],
            redFlags:"Has opinions about your life choices.",
            greenFlags:"Will defend you from a houseplant." },
        CHBC: { code:"CHBC", name:"The Street CEO",              tagline:"Built a tuna empire from one strategic meow.",            emoji:"💼", color:"#E8612A", bg:"#FFE0CC",
            vibes:["Hustler","Charming","Opportunist","Always Negotiating"],
            famouslySays:"Let's circle back after dinner.",
            kindredSpirits:["a slightly chaotic founder","Tony Soprano","the kid who sold candy at school"],
            redFlags:"Has 4 different humans feeding it.",
            greenFlags:"Networking is love language." },
        CHNR: { code:"CHNR", name:"The Affectionate Warden",     tagline:"Loves you fiercely and on a strict schedule.",            emoji:"🫶", color:"#D94E8C", bg:"#FFD6E6",
            vibes:["Clingy","Routine-Obsessed","Gentle Bully","Mandatory Cuddler"],
            famouslySays:"You will be loved at 7:42pm. No exceptions.",
            kindredSpirits:["a Pinterest mom","Monica Geller","your sweetest, scariest aunt"],
            redFlags:"Wakes you up to make sure you're alive.",
            greenFlags:"Knows your sleep schedule better than you." },
        CHNC: { code:"CHNC", name:"The Party Starter",           tagline:"The room is boring. They will fix it.",                  emoji:"🎉", color:"#FFB000", bg:"#FFEFC2",
            vibes:["Chaotic Good","Zoomie Champion","Talks A Lot","Absolutely Unhinged"],
            famouslySays:"WAKE UP. WAKE UP. THE SUN IS DOING SOMETHING.",
            kindredSpirits:["a golden retriever in a cat suit","your most extroverted friend"],
            redFlags:"3am wall sprints.",
            greenFlags:"Genuinely thrilled to see you, every time." },
        CDBR: { code:"CDBR", name:"The Visionary Supervisor",    tagline:"Has Big Ideas about that empty Amazon box.",             emoji:"📐", color:"#7A5BFF", bg:"#E2DBFF",
            vibes:["Inventive","Bossy","Schemer","Architecturally Curious"],
            famouslySays:"I have plans for the bookshelf.",
            kindredSpirits:["an indie movie director","Wes Anderson","Lego enthusiasts"],
            redFlags:"Treats the curtain rod as a balance beam.",
            greenFlags:"Genuinely impressed by your weird ideas too." },
        CDBC: { code:"CDBC", name:"The Wild Debater",            tagline:"Will argue with you about gravity. And win.",            emoji:"🧠", color:"#3B6FFF", bg:"#D8E2FF",
            vibes:["Smart","Loud","Counter-arguer","Counter-jumper"],
            famouslySays:"Actually, the counter is mine. Let me explain.",
            kindredSpirits:["a debate kid","Reddit at 2am","your favorite contrarian friend"],
            redFlags:"Knocks things off the counter to prove a point.",
            greenFlags:"Will absolutely die on a hill for you." },
        CDNR: { code:"CDNR", name:"The Charismatic Counselor",   tagline:"Personal therapist. Co-pay is treats.",                  emoji:"💗", color:"#FF7AA2", bg:"#FFD9E5",
            vibes:["Emotionally Fluent","Soft Boss","Vibes Reader","Lap Loiterer"],
            famouslySays:"You seem stressed. Have you tried purring?",
            kindredSpirits:["a yoga teacher","Ted Lasso","the friend who always texts first"],
            redFlags:"Knows when you're sad and uses it.",
            greenFlags:"Knows when you're sad and shows up." },
        CDNC: { code:"CDNC", name:"The Joyful Performer",        tagline:"Is this entertainment? It is now.",                       emoji:"🎭", color:"#FF6B6B", bg:"#FFD9D9",
            vibes:["Dramatic","Loving","Theatrical","Audience-Required"],
            famouslySays:"Watch me. Watch me. Are you watching?",
            kindredSpirits:["theater kids","any small dog","your friend who always tells the story"],
            redFlags:"Performs a death scene daily.",
            greenFlags:"Will make your worst day at least weird." },
        SHBR: { code:"SHBR", name:"The Silent Strategist",       tagline:"Has been planning this for six months.",                  emoji:"🗝️", color:"#2E7D7D", bg:"#CFE8E8",
            vibes:["Mysterious","Calculating","Slow-Blink","Has A Plan"],
            famouslySays:"...",
            kindredSpirits:["a chess grandmaster","John Wick","the quiet one in the friend group"],
            redFlags:"You don't know where they are right now.",
            greenFlags:"You don't know where they are right now (and they're fine)." },
        SHBC: { code:"SHBC", name:"The Master Tinkerer",         tagline:"Can absolutely open that cabinet, given time.",           emoji:"🔧", color:"#5C6BC0", bg:"#D8DDF5",
            vibes:["Crafty","Independent","Door-Opener","Chaos Engineer"],
            famouslySays:"I have figured out the lid.",
            kindredSpirits:["a maker on YouTube","MacGyver","your friend who fixes things"],
            redFlags:"Has cracked the treat container code.",
            greenFlags:"Self-entertaining genius." },
        SHNR: { code:"SHNR", name:"The Gentle Defender",         tagline:"Soft outside, fiercely loyal inside.",                    emoji:"🛡️", color:"#3F8B5C", bg:"#D5EBDD",
            vibes:["Quiet","Devoted","Watchful","One-Person Cat"],
            famouslySays:"I am here. That is enough.",
            kindredSpirits:["a librarian","Samwise Gamgee","the friend who remembers everything"],
            redFlags:"Has trust issues with new visitors.",
            greenFlags:"Unbreakable bond, unspoken understanding." },
        SHNC: { code:"SHNC", name:"The Emotional Artist",        tagline:"Their medium is yowling at 3am.",                         emoji:"🎨", color:"#9B59B6", bg:"#EAD6F2",
            vibes:["Sensitive","Independent","Mood-Driven","Hairball Poet"],
            famouslySays:"(stares meaningfully)",
            kindredSpirits:["a film school grad","any sad indie singer","your friend with a journal"],
            redFlags:"Cries when you close a door.",
            greenFlags:"Big feelings, big love." },
        SDBR: { code:"SDBR", name:"The Observant Theorist",      tagline:"Watches the red dot. Wonders why.",                       emoji:"🔭", color:"#1F6FA8", bg:"#D0E3F0",
            vibes:["Pensive","Quiet","Window-Watcher","Galaxy-Brained"],
            famouslySays:"What is the laser, really?",
            kindredSpirits:["a philosophy major","Lisa Simpson","your friend who reads on the train"],
            redFlags:"Stares at walls for 4 hours.",
            greenFlags:"Will quietly figure you out." },
        SDBC: { code:"SDBC", name:"The Free Spirit",             tagline:"A rule is just a suggestion they haven't ignored yet.",   emoji:"🌿", color:"#3DA17A", bg:"#D2EDE0",
            vibes:["Independent","Whimsical","Anti-Schedule","Sun-Chasing"],
            famouslySays:"I will eat dinner whenever I feel like it. Which is now. Or in 4 hours.",
            kindredSpirits:["a Burning Man regular","Phoebe Buffay","your friend who lives in a van"],
            redFlags:"Does not respect the closed door.",
            greenFlags:"Lives entirely in the present moment." },
        SDNR: { code:"SDNR", name:"The Empathetic Muse",         tagline:"Feels your feelings. Naps until they pass.",              emoji:"🌙", color:"#7E57C2", bg:"#E2D6F2",
            vibes:["Soft","Intuitive","Dream-Heavy","Quiet Comforter"],
            famouslySays:"I am here. Let us nap on this together.",
            kindredSpirits:["an INFP forever","Luna Lovegood","your friend who texts 'thinking of you'"],
            redFlags:"Disappears when overstimulated.",
            greenFlags:"Knows exactly when to show up." },
        SDNC: { code:"SDNC", name:"The Peaceful Dreamer",        tagline:"Sun. Blanket. Nothing else matters.",                     emoji:"☁️", color:"#5BA8D9", bg:"#D5EBF7",
            vibes:["Chill","Floofy","Unbothered","Aggressively Soft"],
            famouslySays:"(snoring softly)",
            kindredSpirits:["a yoga retreat regular","Winnie the Pooh","your friend who's always 'good'"],
            redFlags:"Will not be rushed. Ever.",
            greenFlags:"A walking, purring meditation." },
    };

    // Optional long-form copy (preserved from the previous site for SEO depth on detailed types).
    const LONG_FORM = {
        CHBR: {
            description: "This is the rare, powerful cat who operates with the cold efficiency of a corporate executive. The Grand General is <strong>Commanding</strong> because they seek external engagement, <strong>Hunter</strong> because they rely on observable facts, <strong>Bossy</strong> because they prioritize logic over emotion, and <strong>Regal</strong> because they demand structure and closure. They aren't trying to be mean; they're just running a tight ship.",
            traits: [
                ["How They Show Love ❤️", "Love is shown through <strong>compliance and proximity</strong>. They will stare intensely at you from a high perch or walk across your keyboard mid-use, signifying that you are the central, albeit distracting, object in their structured universe."],
                ["How They Ask for Attention 👀", "With <strong>loud, sustained, direct meows</strong> and demanding eye contact. If that fails, they will use strategic territorial obstruction (blocking doorways or jumping onto a forbidden counter)."],
                ["Territory (The Fiefdom) 🏰", "They maintain a highly <strong>disciplined perimeter</strong>. Non-human invaders are observed with chilling stillness until they retreat."],
                ["Energy Throughout the Day ⚡", "High and consistent. They see idleness as non-productive. Naps are strategic, not leisurely."],
                ["Play Style 🧶", "Play is <strong>training</strong>. The goal is the efficient capture of the toy."],
                ["Reaction to Change 📦", "Hostile. A new piece of furniture is an unauthorized invasion of their territory."],
                ["Relationship with Other Cats 🐈", "Hierarchical. The General establishes dominance early and enforces it with unblinking stares and the occasional tactical bap."],
            ],
        },
        SHBR: {
            description: "The Silent Strategist is the master observer, a quiet force who understands the household's inner workings better than anyone. They are <strong>Solitary</strong>, <strong>Hunter</strong>, <strong>Bossy</strong>, and <strong>Regal</strong> — combining a need for privacy with a brutally logical and structured approach to life.",
            traits: [
                ["How They Show Love ❤️", "Love is demonstrated through <strong>silent companionship</strong>. They will 'fix' your loneliness by simply materializing in the same room as you."],
                ["How They Ask for Attention 👀", "They don't. They position themselves in a high-traffic area and wait for you to notice."],
                ["Territory (The Fiefdom) 🏰", "Their territory is a series of <strong>optimized, efficient zones</strong>: a sleeping zone, an observation zone, a sunbeam zone."],
                ["Energy Throughout the Day ⚡", "Energy is conserved and expended with purpose. They move with deliberation."],
                ["Play Style 🧶", "Play is a <strong>tactical simulation</strong>. They prefer puzzle toys or laser pointers that challenge their intellect."],
                ["Reaction to Change 📦", "Change is a new variable that must be analyzed. They observe from a safe distance, then integrate it into their internal map."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>unpredictable variables</strong>. Aloof and calculating, not aggressive."],
            ],
        },
    };

    function parseTally() {
        // Format: "C5S3H4D4B5N3R6F2"
        const t = new URLSearchParams(window.location.search).get('t');
        if (!t) return null;
        const tally = { C:0, S:0, H:0, D:0, B:0, N:0, R:0, F:0 };
        const re = /([CSHDBNRF])(\d+)/g;
        let m;
        while ((m = re.exec(t)) !== null) {
            tally[m[1]] = parseInt(m[2], 10) || 0;
        }
        return tally;
    }

    function evenTally() {
        return { C:5, S:5, H:5, D:5, B:5, N:5, R:5, F:5 };
    }

    function getCodeFromUrl() {
        const path = window.location.pathname;
        const fname = path.split('/').pop() || '';
        return fname.replace('.html', '').toUpperCase();
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function imagePath(p) {
        const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return `../assets/personalities/${p.code.toLowerCase()}-${slug}.webp`;
    }

    function spectrumRows(tally, color) {
        const axes = [
            { left:"Solitary",   right:"Commanding", leftKey:"S", rightKey:"C" },
            { left:"Dreamer",    right:"Hunter",     leftKey:"D", rightKey:"H" },
            { left:"Nurturing",  right:"Bossy",      leftKey:"N", rightKey:"B" },
            { left:"Casual",     right:"Regal",      leftKey:"F", rightKey:"R" },
        ];
        return axes.map(a => {
            const l = tally[a.leftKey] || 0;
            const r = tally[a.rightKey] || 0;
            const sum = l + r || 1;
            const rightPct = Math.round((r / sum) * 100);
            return `
                <div class="spec-row">
                    <span class="spec-label left">${a.left}</span>
                    <div class="spec-bar">
                        <div class="spec-fill" style="width:${rightPct}%;background:${color}"></div>
                        <div class="spec-marker" style="left:calc(${rightPct}% - 8px);background:#1F1410"></div>
                    </div>
                    <span class="spec-label right">${a.right}</span>
                </div>`;
        }).join('');
    }

    function tradingCard(p) {
        const stamp = Math.floor(100000 + Math.random() * 899999);
        return `
        <article class="trading-card" style="background:${p.color}">
            <div class="tc-noise" aria-hidden="true"></div>
            <div class="tc-top">
                <div class="tc-code">${p.code}</div>
                <div class="tc-stamp">
                    <span>cert. authentic</span>
                    <span>№${stamp}</span>
                </div>
            </div>
            <div class="tc-portrait" style="background:${p.bg}">
                <img class="tc-image" src="${imagePath(p)}" alt="${escapeHtml(`${p.name} cat illustration`)}" loading="eager" decoding="async">
                <div class="tc-rays" aria-hidden="true">
                    ${Array.from({length:12}).map((_,i) =>
                        `<span style="transform:rotate(${i*30}deg) translateY(-130px);background:${p.color}"></span>`
                    ).join('')}
                </div>
            </div>
            <div class="tc-meta">
                <h1 class="tc-name">${escapeHtml(p.name)}</h1>
                <p class="tc-tag">"${escapeHtml(p.tagline)}"</p>
            </div>
            <div class="tc-vibes">
                ${p.vibes.map(v => `<span class="tc-vibe">${escapeHtml(v)}</span>`).join('')}
            </div>
            <div class="tc-foot">
                <span>meowbti.com</span>
                <span>1 of 16</span>
            </div>
        </article>`;
    }

    function confetti(p, accent) {
        const colors = [accent, p.color, '#FFB000', '#3DA17A', '#7A5BFF'];
        return `<div class="result-confetti" aria-hidden="true">${
            Array.from({length:18}).map((_,i) =>
                `<span class="confetti-dot" style="left:${(i*53)%100}%;top:${(i*37)%60}%;background:${colors[i%5]};transform:rotate(${(i*47)%360}deg);animation-delay:${i*0.08}s"></span>`
            ).join('')
        }</div>`;
    }

    function longFormSection(code) {
        const lf = LONG_FORM[code];
        if (!lf) return '';
        const traits = lf.traits.map(([title, body]) =>
            `<div class="trait-item"><h3>${escapeHtml(title)}</h3><p>${body}</p></div>`
        ).join('');
        return `
            <h2 class="breakdown-title">The full breakdown</h2>
            <p class="type-description">${lf.description}</p>
            <h2 class="breakdown-title">Key traits in action</h2>
            <div class="traits-container">${traits}</div>
        `;
    }

    function copyLink(p) {
        const txt = `My cat is ${p.code} — ${p.name}. "${p.tagline}" — meowbti.com`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(txt).catch(() => {});
        }
    }

    function render() {
        const host = document.getElementById('personality-content');
        if (!host) return;

        const code = getCodeFromUrl();
        const p = PERSONALITIES[code] || PERSONALITIES.CHBR;
        const tally = parseTally() || evenTally();
        const accent = '#FF5B3B';

        document.title = `${p.name} (${p.code}) — MeowBTI`;
        // Update meta description for SEO
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `${p.code} — ${p.name}. ${p.tagline} The MeowBTI cat personality test.`);
        document.body.style.background = p.bg;

        host.innerHTML = `
            ${confetti(p, accent)}
            <div class="reveal-line">your cat's official type is</div>
            ${tradingCard(p)}

            <div class="result-actions">
                <button class="big-btn" id="btn-copy" type="button">copy link</button>
                <a href="../quiz.html" class="big-btn ghost">↺ retake</a>
                <a href="../personality-types.html" class="big-btn ghost">all 16 →</a>
            </div>

            <section class="result-grid">
                <div class="rg-block">
                    <h3 class="rg-h">famously says</h3>
                    <p class="rg-quote">"${escapeHtml(p.famouslySays)}"</p>
                </div>
                <div class="rg-block">
                    <h3 class="rg-h">the spectrum</h3>
                    <div class="spectrum">${spectrumRows(tally, p.color)}</div>
                </div>
                <div class="rg-block">
                    <h3 class="rg-h">kindred spirits</h3>
                    <ul class="kindred">
                        ${p.kindredSpirits.map(k => `<li>${escapeHtml(k)}</li>`).join('')}
                    </ul>
                </div>
                <div class="rg-block flags">
                    <div>
                        <h3 class="rg-h">🚩 red flag</h3>
                        <p>${escapeHtml(p.redFlags)}</p>
                    </div>
                    <div>
                        <h3 class="rg-h">💚 green flag</h3>
                        <p>${escapeHtml(p.greenFlags)}</p>
                    </div>
                </div>
            </section>

            ${longFormSection(code)}

            <section class="result-affiliate">
                <h3 class="result-affiliate-h">picks for ${escapeHtml(p.name).toLowerCase()}s</h3>
                <div class="product-grid">
                    <a href="../index.html#affiliate-products" rel="sponsored noopener" class="product-card" style="--product-bg:${p.bg}">
                        <span class="product-emoji" aria-hidden="true">🛏️</span>
                        <h3>The Spot™ — premium nap zone</h3>
                        <p class="product-blurb">A bed they will pretend to ignore for 3 days, then never leave.</p>
                        <span class="product-cta">See picks →</span>
                    </a>
                    <a href="../index.html#affiliate-products" rel="sponsored noopener" class="product-card" style="--product-bg:#FFEFC2">
                        <span class="product-emoji" aria-hidden="true">🪶</span>
                        <h3>Wand of personal relevance</h3>
                        <p class="product-blurb">Engineered for the "I have to murder this" personality types.</p>
                        <span class="product-cta">See picks →</span>
                    </a>
                </div>
            </section>

            <section class="result-cta">
                <h2 class="cta-h">do this for your other cat. or your ex's cat. or your boss's cat.</h2>
                <div class="cta-actions">
                    <a href="../quiz.html" class="big-btn" style="background:${p.color};color:#fff">analyze another →</a>
                    <a href="../personality-types.html" class="big-btn ghost">browse all 16 types</a>
                </div>
            </section>
        `;

        const copyBtn = document.getElementById('btn-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                copyLink(p);
                const old = copyBtn.textContent;
                copyBtn.textContent = 'copied!';
                setTimeout(() => { copyBtn.textContent = old; }, 1600);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
