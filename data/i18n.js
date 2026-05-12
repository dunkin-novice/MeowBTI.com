// MeowBTI i18n — single source of truth for every UI string across the site.
// Active language is decided by ?lang=th URL param, sticky via localStorage.
// Defaults to EN. Falls back to EN string when a TH key is missing.
//
// Exposes window.MeowI18n = { getLang, setLang, t, withLang, STRINGS }.
// Also fires `meow:langchange` on window when setLang() is called.

(function () {
    const STRINGS = {
        // ─── nav (loaded from /nav.html partial) ──────────────
        navHome:           { en: "Home",                      th: "หน้าหลัก" },
        navAll16:          { en: "All 16",                    th: "ทั้ง 16" },
        navPicks:          { en: "Picks",                     th: "ของแนะนำ" },
        navTakeTest:       { en: "Take the test",             th: "เริ่มทำแบบทดสอบ" },

        // ─── footer (loaded from /footer.html partial) ────────
        footerSponsor:     { en: 'A <a href="#">CatGuy.</a> production.', th: 'ผลิตโดย <a href="#">CatGuy.</a>' },
        footerPrivacy:     { en: "Privacy",                   th: "ความเป็นส่วนตัว" },
        footerTerms:       { en: "Terms",                     th: "เงื่อนไขการใช้" },
        footerContact:     { en: "Contact",                   th: "ติดต่อ" },
        footerDisclaimer:  { en: "This test is for fun and entertainment only. Affiliate links may generate commission at no extra cost to you.",
                              th: "แบบทดสอบนี้เพื่อความบันเทิงเท่านั้น ลิงก์พันธมิตรอาจสร้างคอมมิชชันโดยไม่มีค่าใช้จ่ายเพิ่มเติมสำหรับคุณ" },

        // ─── home (index.html) ─────────────────────────────────
        heroH1:            { en: "What kind of <em>menace</em> is your cat?",
                              th: "แมวคุณเป็น<em>ตัวป่วน</em>แบบไหนกัน?" },
        heroSubtitle:      { en: "Quick quiz or Deep analysis. Receive verdict.",
                              th: "แบบสั้นหรือวิเคราะห์เจาะลึก รับคำตัดสิน" },
        heroCta:           { en: "Start the test",            th: "เริ่มทำแบบทดสอบ" },
        heroMetaNoLogin:   { en: "No login",                  th: "ไม่ต้องล็อกอิน" },
        heroMetaNoEmail:   { en: "No email",                  th: "ไม่ต้องอีเมล" },
        heroMetaJustChaos: { en: "Just chaos",                th: "แค่ความวุ่นวาย" },
        testimonialsH:     { en: "people are saying",         th: "เสียงตอบรับจากคนใช้" },
        affiliateH:        { en: "our favorite cat picks",    th: "ของโปรดของแมวเรา" },
        affiliateSub:      { en: "Tested by judgmental cats. Approved by us. (Affiliate links — we may earn a small commission.)",
                              th: "ผ่านการทดสอบโดยแมวจอมจู้จี้ อนุมัติโดยเรา (ลิงก์พันธมิตร — เราอาจได้ค่าคอมเล็กน้อย)" },
        bedTitle:          { en: "Cat Cozy Bed Deluxe",       th: "ที่นอนแมวสุดอบอุ่น" },
        bedBlurb:          { en: "For cats who require a \"spot\" with thermal regulation.",
                              th: "สำหรับแมวที่ต้องการ \"จุดประจำ\" ที่ควบคุมอุณหภูมิได้" },
        bedCta:            { en: "Shop the bed →",            th: "ดูเตียง →" },
        wandTitle:         { en: "Interactive Feather Wand",  th: "ไม้ตกแมวขนนก" },
        wandBlurb:         { en: "Engineered for the \"I have to murder this\" personality types.",
                              th: "ออกแบบมาเพื่อแมวสายต้องล่าให้ได้" },
        wandCta:           { en: "Shop the wand →",           th: "ดูไม้ตกแมว →" },
        catnipTitle:       { en: "Gourmet Catnip Spray",      th: "สเปรย์แคทนิปคุณภาพดี" },
        catnipBlurb:       { en: "For when the vibes simply must be elevated.",
                              th: "สำหรับเวลาที่อยากยกระดับวิบให้สูงขึ้น" },
        catnipCta:         { en: "Shop the spray →",          th: "ดูสเปรย์ →" },
        ctaBannerH:        { en: "ready to uncover your cat's true personality?",
                              th: "พร้อมจะค้นหาตัวตนของแมวคุณแล้วยัง?" },
        ctaBannerBtn:      { en: "Take the MeowBTI quiz",     th: "ทำแบบทดสอบ MeowBTI" },

        // ─── browse (personality-types.html) ──────────────────
        browseH1:          { en: "All 16 cats.",              th: "แมวทั้ง 16 ประเภท" },
        browseIntro:       { en: "From the Grand General to the Peaceful Dreamer — tap any to read the full file.",
                              th: "จากนายพลใหญ่ถึงนักฝันสายสงบ — แตะตัวไหนก็ได้เพื่ออ่านโปรไฟล์เต็ม" },
        browseGenerals:    { en: "The Generals · xHxR",       th: "สายนายพล · xHxR" },
        browseVisionaries: { en: "The Visionaries · xDxR",    th: "สายวิชวล · xDxR" },
        browseMavericks:   { en: "The Mavericks · xHxC",      th: "สายมาเวอริก · xHxC" },
        browseExplorers:   { en: "The Explorers · xDxC",      th: "สายผจญภัย · xDxC" },
        browseTakeTest:    { en: "Take the test",             th: "ทำแบบทดสอบ" },

        // ─── quiz (quiz.html + quiz-script.js) ────────────────
        quizBack:          { en: "← back",                    th: "← กลับ" },
        quizSwipeYes:      { en: "YES ✓",                     th: "ใช่ ✓" },
        quizSwipeNo:       { en: "NO ✗",                      th: "ไม่ใช่ ✗" },
        quizStampYes:      { en: "YES",                       th: "ใช่" },
        quizStampNo:       { en: "NO",                        th: "ไม่ใช่" },
        quizSwipeHint:     { en: "swipe or tap",              th: "ปัดหรือแตะ" },
        quizCount:         { en: (n, total) => `${n} of ${total}`,
                              th: (n, total) => `${n} จาก ${total}` },
        quizModeTitle:     { en: "choose your depth",          th: "เลือกระดับความลึก" },
        quizModeShort:     { en: "Quick Quiz",                 th: "แบบสั้น" },
        quizModeShortSub:  { en: "12 questions · 90s · Viral", th: "12 คำถาม · 90 วินาที · ยอดฮิต" },
        quizModeDeep:      { en: "Deep Analysis",              th: "วิเคราะห์เจาะลึก" },
        quizModeDeepSub:   { en: "60 questions · 5m · Precise", th: "60 คำถาม · 5 นาที · แม่นยำ" },
        quizModeOwner:     { en: "The Human Quiz",             th: "แบบทดสอบสำหรับทาส" },
        quizModeOwnerSub:  { en: "What's your human energy?",  th: "คุณมีพลังงานแบบไหนในร่างมนุษย์?" },
        quizModeCat:       { en: "The Cat Quiz",               th: "แบบทดสอบสำหรับแมว" },
        quizModeCatSub:    { en: "Analyze your cat's menace.", th: "วิเคราะห์ความป่วนของแมวคุณ" },
        quizResume:        { en: "resume quiz?",               th: "ทำต่อจากเดิมไหม?" },
        quizRestart:       { en: "restart",                    th: "เริ่มใหม่" },

        // ─── results (personality-page.js) ─────────────────────
        resultTitle:       { en: "The Verdict",               th: "คำตัดสิน" },
        resultOwnerTitle:  { en: "Your Human Archetype",      th: "ตัวตนร่างมนุษย์" },
        resultOwnerSub:    { en: "You project the energy of:", th: "พลังงานในตัวคุณคือสาย:" },
        resultCatTitle:    { en: "The Official Type",         th: "ประเภทแมว" },
        shareOwnerBtn:     { en: "Share Your Identity",        th: "แชร์ตัวตนร่างคน" },
        
        // Modules
        ownerWorkplace:    { en: "Workplace Energy",          th: "Vibe ในที่ทำงาน" },
        ownerGroupChat:    { en: "Group Chat Role",           th: "ตัวตึงแชทกลุ่ม" },
        ownerDamage:       { en: "Emotional Damage",          th: "เวลาโดนดาเมจ" },
        ownerComm:         { en: "Communication Style",       th: "สไตล์การทักแชท" },
        ownerCatAttract:   { en: "The Cat You Attract",       th: "แมวที่มักจะตกเราได้" },
        ownerBossCompat:   { en: "Boss Compatibility",        th: "ความเข้ากันกับหัวหน้า" },
        ownerRoommate:     { en: "Roommate Warning",          th: "คำเตือนสำหรับรูมเมท" },
        ownerSurvival:     { en: "Survival Strategy",         th: "วิธีเอาชีวิตรอด" },

        // ─── family saving (v3) ──────────────────────────────
        saveToFamily:      { en: "Save to My Cat Family",     th: "บันทึกลงกลุ่มแมวของฉัน" },
        savedToFamily:     { en: "Saved to My Cat Family ✓",  th: "บันทึกลงกลุ่มแมวแล้ว ✓" },
        addMyselfToFamily: { en: "Add Myself to Family",      th: "เพิ่มตัวเองเข้ากลุ่ม" },
        catNameOptional:   { en: "Cat name (optional)",       th: "ชื่อแมว (ถ้ามี)" },
        yourNameOptional:  { en: "Your name (optional)",      th: "ชื่อของคุณ (ถ้ามี)" },
        defaultCatName:    { en: "My Cat",                    th: "แมวของฉัน" },
        defaultHumanName:  { en: "Me",                        th: "ฉันเอง" },

        // ─── dashboard (dashboard.js) ──────────────────────────
        familyDashboardTitle: { en: "My Cat Family",           th: "กลุ่มแมวของฉัน" },
        familyDashboardSub:   { en: "Meet the inhabitants of your chaotic household.", 
                                 th: "พบกับเหล่าสมาชิกในบ้านที่สุดจะวุ่นวาย" },
        addAnotherCat:        { en: "Add Another Cat",         th: "เพิ่มแมวอีกตัว" },
        addAnotherHuman:      { en: "Add Another Human",       th: "เพิ่มทาสอีกคน" },
        confirmRemove:        { en: (name) => `Remove ${name} from your family?`,
                                 th: (name) => `ลบ ${name} ออกจากกลุ่มใช่ไหม?` },

        // ─── compatibility (compatibility.js) ──────────────────
        dynamicsTitle:        { en: "Household Dynamics",      th: "ความสัมพันธ์ในบ้าน" },
        statsChaos:           { en: "Chaos Level",             th: "ระดับความวุ่นวาย" },
        statsDominant:        { en: "Dominant Axis",           th: "แกนหลักของบ้าน" },
        statsTotal:           { en: "Total Members",           th: "สมาชิกทั้งหมด" },
        
        // Vibe Labels
        vibeChaotic:          { en: "Chaotic Duo",             th: "คู่หูตัวป่วน" },
        vibeSilent:           { en: "Silent Respect",          th: "เคารพในความเงียบ" },
        vibeMafia:            { en: "Tiny Mafia",              th: "มาเฟียตัวจิ๋ว" },
        vibeRoommate:         { en: "Roommate Energy",         th: "พลังงานรูมเมท" },
        vibeBoss:             { en: "Boss vs Boss",            th: "บอสปะทะบอส" },
        vibeOneBrainCell:     { en: "One Brain Cell Shared",   th: "ใช้สมองก้อนเดียวกัน" },
        vibeSupport:          { en: "Emotional Support",       th: "ซัพพอร์ตทางอารมณ์" },
        vibeTwin:             { en: "Twin Flames",             th: "แฝดคนละฝา" },
        vibeOpposite:         { en: "Total Opposites",         th: "ขั้วตรงข้าม" },

        // Special Tags
        tagBestMatch:         { en: "Best Match",              th: "คู่ที่เข้ากันที่สุด" },
        tagMostChaotic:       { en: "Most Chaotic Pair",       th: "คู่ที่ป่วนที่สุด" },
        tagHouseholdMenace:   { en: "Household Menace",        th: "ตัวแสบประจำบ้าน" },

        // Observations
        obsScream:            { en: "These two definitely scream before dinner.", 
                                 th: "สองตัวนี้ต้องกรีดร้องก่อนมื้อเย็นแน่นอน" },
        obsMainChar:          { en: "One is the main character. The other is the unpaid intern.",
                                 th: "ตัวหนึ่งเป็นพระเอก อีกตัวเป็นเด็กฝึกงานที่ไม่ได้รับค่าจ้าง" },
        obsSecretLang:        { en: "They have a secret language involving slow blinks and tactical baps.",
                                 th: "พวกเขามีภาษาลับที่ประกอบด้วยการกระพริบตาช้าๆ และการตบแบบมีกลยุทธ์" },
        obsFridge:            { en: "If they could open the fridge, you'd be in serious trouble.",
                                 th: "ถ้าพวกมันเปิดตู้เย็นได้ คุณจะซวยแน่ๆ" },
        obsVibes:             { en: "This household survives entirely on vibes and expensive treats.",
                                 th: "บ้านหลังนี้อยู่รอดได้ด้วย 'วิบ' และขนมราคาแพงล้วนๆ" },

        // ─── poster (family-share.js) ──────────────────────────
        posterHouseholdVerdict: { en: "MEOWBTI HOUSEHOLD VERDICT", th: "คำตัดสินบ้าน MEOWBTI" },
        posterDownloadBtn:      { en: "Download Family Poster",    th: "ดาวน์โหลดโปสเตอร์ครอบครัว" },
        
        // Household Titles
        titleDictators:       { en: "The Tiny Dictators",      th: "เหล่านักเผด็จการตัวจิ๋ว" },
        titleUnstable:        { en: "Emotionally Unstable Apartment", th: "อะพาร์ตเมนต์ที่อารมณ์แปรปรวน" },
        titleSyndicate:       { en: "Corporate Meow Syndicate", th: "องค์กรลับเมี๊ยวเมี๊ยว" },
        titleChaos:           { en: "Chaos But Loving",        th: "วุ่นวายแต่ก็รักนะ" },
        titleJudgment:        { en: "Silent Judgment Society", th: "สมาคมตัดสินคนเงียบๆ" },
        titleScreamers:       { en: "The Midnight Screamers",  th: "เหล่านักว๊ากเที่ยงคืน" },
        titleOneBrain:        { en: "Collective One Brain Cell", th: "ศูนย์รวมสมองก้อนเดียว" },

        // Footer Insights
        footPeace:            { en: "0% peace. 100% family.",   th: "สงบ 0% ครอบครัว 100%" },
        footNormal:           { en: "Nobody here communicates normally.", th: "ไม่มีใครในบ้านนี้ที่สื่อสารแบบคนปกติ" },
        footVibes:            { en: "This household survives on vibes.", th: "บ้านหลังนี้ขับเคลื่อนด้วยวิบ" },
        footProblem:          { en: "We are all the problem.",     th: "พวกเราทุกคนคือตัวปัญหา" },
        footLove:             { en: "Judgment is our primary love language.", th: "การตัดสินกันคือภาษาบอกรักหลักของเรา" },

        // Compatibility
        compatTitle:       { en: "Compatibility Matrix",       th: "ความเข้ากันได้" },
        compatCheck:       { en: "Check Compatibility",        th: "เช็คความเข้ากัน" },
        compatWithCat:     { en: "With your cat",              th: "กับแมวของคุณ" },
        compatWithBoss:    { en: "With your boss",             th: "กับบอสของคุณ" },
        compatWithRoomie:  { en: "With your roommate",         th: "กับรูมเมทของคุณ" },
        compatChaos:       { en: "Chaos Level",               th: "ระดับความป่วน" },
        compatSurvival:    { en: "Survival Odds",             th: "โอกาสรอดชีวิต" },

        // ─── result page chrome ───────────────────────────────
        revealLine:        { en: "your cat's official type is", th: "แมวของคุณคือสาย:" },
        copyLink:          { en: "copy link",                 th: "คัดลอกลิงก์" },
        copied:            { en: "copied!",                   th: "คัดลอกแล้ว" },
        retake:            { en: "↺ retake",                  th: "↺ ทำใหม่" },
        all16:             { en: "all 16 →",                  th: "ทั้ง 16 →" },
        famouslySays:      { en: "famously says",             th: "วลีประจำตัว" },
        spectrum:          { en: "the spectrum",              th: "สเปกตรัม" },
        duringTitle:       { en: "Your cat during…",          th: "แมวคุณตอนที่…" },
        mostLikelyTitle:   { en: "Most likely to…",           th: "มีแนวโน้มจะ…" },
        relTitle:          { en: "The Social Circle",         th: "วงสังคมของแมว" },
        relBestFriend:     { en: "Best Friend",               th: "เพื่อนรัก" },
        relChaosDuo:       { en: "Chaos Duo",                 th: "คู่หูตัวป่วน" },
        relSoulmate:       { en: "Accidental Soulmate",       th: "เนื้อคู่โดยบังเอิญ" },
        relNightmare:      { en: "Roommate Nightmare",        th: "รูมเมทสุดสยอง" },
        relLabel:          { en: "relationship",              th: "ความสัมพันธ์" },
        eventDinner:       { en: "Dinner",                    th: "มื้อเย็น" },
        eventThunder:      { en: "Thunder",                   th: "ฟ้าร้อง" },
        eventFaceTime:     { en: "FaceTime",                  th: "FaceTime" },
        eventZoomies:      { en: "Zoomies",                   th: "วิ่งคึก" },
        eventGuests:       { en: "Guests",                    th: "แขกมา" },
        socialBaitFriend:  { en: "send to the friend whose cat is exactly like this", th: "ส่งให้เพื่อนที่แมวเป็นแบบนี้เป๊ะๆ" },
        socialBaitGroup:   { en: "every friend group has one", th: "ทุกกลุ่มเพื่อนต้องมีสักตัว" },
        kindredSpirits:    { en: "kindred spirits",           th: "วิญญาณร่วมเผ่า" },
        redFlag:           { en: "🚩 red flag",               th: "🚩 ธงแดง" },
        greenFlag:         { en: "💚 green flag",             th: "💚 ธงเขียว" },
        picksFor:          { en: name => `picks for ${String(name).toLowerCase()}s`,
                              th: name => `ของแนะนำสำหรับสาย${name}` },
        ctaH:              { en: "do this for your other cat. or your ex's cat. or your boss's cat.",
                              th: "ลองทำให้แมวอีกตัว หรือแมวของแฟนเก่า หรือแมวของหัวหน้าก็ได้" },
        analyzeAnother:    { en: "analyze another →",         th: "วิเคราะห์อีกตัว →" },
        browseAll:         { en: "browse all 16 types",       th: "ดูทั้ง 16 ประเภท" },
        certAuthentic:    { en: "cert. authentic",            th: "รับรองของแท้" },
        oneOfSixteen:      { en: "1 of 16",                   th: "1 จาก 16" },
        shareVerdict:      { en: "share your cat's verdict",  th: "แชร์คำตัดสินของแมวคุณ" },
        sharePromptText:   { en: "upload your cat's photo (optional) and we'll build a poster for IG / TikTok / LINE.",
                              th: "อัปโหลดรูปแมวคุณ (ไม่บังคับ) แล้วเราจะสร้างโปสเตอร์ให้สำหรับ IG / TikTok / LINE" },
        addPhoto:          { en: "add cat photo",             th: "เพิ่มรูปแมว" },
        changePhoto:       { en: "change photo",              th: "เปลี่ยนรูป" },
        sharePoster:       { en: "↗ share poster",            th: "↗ แชร์โปสเตอร์" },
        posterTitle:       { en: "your shareable poster",     th: "โปสเตอร์ของคุณพร้อมแชร์" },
        shareSave:         { en: "↗ share / save",            th: "↗ แชร์ / บันทึก" },
        copyCaption:       { en: "copy caption",              th: "คัดลอกแคปชัน" },
        close:             { en: "close",                     th: "ปิด" },
        buildingPoster:    { en: "building your poster…",     th: "กำลังสร้างโปสเตอร์…" },
        somethingWrong:    { en: "something went wrong — try again?", th: "มีบางอย่างผิดพลาด ลองใหม่นะ" },
        savedToDownloads:  { en: "saved to your downloads — share it anywhere!",
                              th: "บันทึกไว้ในดาวน์โหลดแล้ว แชร์ได้ทุกที่เลย" },
        sharedThanks:      { en: "shared — thanks for spreading the menace 😼",
                              th: "แชร์แล้ว ขอบคุณที่ช่วยกระจายความวุ่นวาย 😼" },
        vsRival:           { en: "vs. your cat's natural enemy", th: "ศัตรูคู่ปรับของแมวคุณ" },
        fullBreakdown:     { en: "The full breakdown",        th: "รายละเอียดเชิงลึก" },
        keyTraits:         { en: "Key traits in action",      th: "พฤติกรรมเด่น" },

        // Spectrum axis labels
        solitary:   { en: "Solitary",   th: "เก็บตัว" },
        commanding: { en: "Commanding", th: "ออกหน้า" },
        dreamer:    { en: "Dreamer",    th: "นักฝัน" },
        hunter:     { en: "Hunter",     th: "นักล่า" },
        nurturing:  { en: "Nurturing",  th: "ขี้ห่วง" },
        bossy:      { en: "Bossy",      th: "คุมเกม" },
        casual:     { en: "Casual",     th: "ฟรีสไตล์" },
        regal:      { en: "Regal",      th: "เจ้าระเบียบ" },
    };

    const STORAGE_KEY = 'meow-lang';

    function getLang() {
        try {
            const url = new URLSearchParams(window.location.search).get('lang');
            if (url === 'th' || url === 'en') {
                try { localStorage.setItem(STORAGE_KEY, url); } catch (_) {}
                return url;
            }
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'th' || stored === 'en') return stored;
        } catch (_) {}
        return 'en';
    }

    function setLang(lang) {
        if (lang !== 'en' && lang !== 'th') return;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
        try { window.dispatchEvent(new CustomEvent('meow:langchange', { detail: { lang } })); } catch (_) {}
    }

    function t(key, ...args) {
        const lang = getLang();
        const entry = STRINGS[key];
        if (!entry) return key;
        const v = entry[lang] != null ? entry[lang] : entry.en;
        if (typeof v === 'function') return v(...args);
        // Tiny {0}/{1} substitution for templated strings.
        if (args.length && typeof v === 'string' && v.includes('{0}')) {
            return args.reduce((s, a, i) => s.replaceAll(`{${i}}`, String(a)), v);
        }
        return v;
    }

    // Append ?lang=th to internal links when in TH mode so navigation persists.
    function withLang(href) {
        const lang = getLang();
        if (lang !== 'th') return href;
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return href;
        if (/[?&]lang=/.test(href)) return href;
        const sep = href.includes('?') ? '&' : '?';
        // Preserve hash fragments at the end.
        const hashIdx = href.indexOf('#');
        if (hashIdx >= 0) {
            return href.slice(0, hashIdx) + sep + 'lang=th' + href.slice(hashIdx);
        }
        return href + sep + 'lang=th';
    }

    window.MeowI18n = { getLang, setLang, t, withLang, STRINGS };
})();
