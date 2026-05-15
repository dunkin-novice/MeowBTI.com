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
        navAll16:          { en: "All 16",                    th: "ทั้งหมด 16" },
        navHumanMode:      { en: "Human Energy",              th: "ตัวตนในร่างแมว" },
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
        hTeaserH2:         { en: "What cat energy are YOU?",   th: "แล้วคุณมีพลังงานแมวแบบไหน?" },
        hTeaserP:          { en: "Your boss, your ex, and your group chat all have a MeowBTI. Find the archetype hiding under your human skin.",
                              th: "หัวหน้า แฟนเก่า และแชทกลุ่มของคุณต่างก็มี MeowBTI ในตัว ค้นหาตัวตนแมวที่ซ่อนอยู่ใต้ร่างมนุษย์ของคุณ" },
        hTeaserCta:        { en: "Take the Human Quiz →",      th: "ทำแบบทดสอบร่างมนุษย์ →" },
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
        homeDailyWeatherH: { en: "What’s your emotional weather today?",
                              th: "วันนี้อากาศในใจคุณเป็นแบบไหน?" },
        homeDailyWeatherSub: { en: "A tiny check-in for your current cat-energy mood.",
                                th: "เช็กอินสั้นๆ กับพลังงานแมวในใจตอนนี้" },
        homeDailyWeatherCta: { en: "Check today’s energy",      th: "เช็กพลังงานวันนี้" },
        homeDailyWeatherSavedH: { en: "Today’s emotional weather", th: "สภาพอากาศในใจวันนี้" },
        homeDailyWeatherSavedCta: { en: "View today’s reading", th: "ดูผลอ่านวันนี้" },
        dailySavedOnlyDevice: { en: "Saved only on this device.", th: "บันทึกไว้เฉพาะในอุปกรณ์นี้" },

        // ─── browse (personality-types.html) ──────────────────
        browseH1:          { en: "All 16 cats.",              th: "แมวทั้ง 16 ประเภท" },
        browseIntro:       { en: "From the Grand General to the Peaceful Dreamer — tap any to read the full file.",
                              th: "จากนายพลใหญ่ถึงนักฝันสายสงบ — แตะตัวไหนก็ได้เพื่ออ่านโปรไฟล์เต็ม" },
        hBrowseH1:         { en: "16 ways to be a cat.",      th: "16 วิถีสู่การเป็นแมว" },
        hBrowseIntro:      { en: "Discover which cat matches your human personality. Tap any to see the breakdown.",
                              th: "ค้นหาว่าแมวตัวไหนที่ตรงกับตัวตนของคุณที่สุด แตะเพื่อดูรายละเอียดร่างมนุษย์" },
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
        
        // Evergreen Meaning Page Chrome
        revealLineEvergreen:  { en: "The {0} archetype",          th: "บุคลิกสาย {0}" },
        resultOwnerSubEvergreen: { en: "The {0} archetype projects the energy of:", th: "ตัวตนของสาย {0} คือ:" },
        duringTitleEvergreen: { en: "Behavior during events", th: "พฤติกรรมระหว่างสถานการณ์ต่างๆ" },
        dailyVibeIsEvergreen: { en: (archetype) => `Today's energy for the ${archetype} archetype.`, 
                                 th: (archetype) => `พลังงานประจำวันนี้ของสาย ${archetype}` },
        picksForEvergreen:    { en: (name) => `Editorial picks for ${String(name).toLowerCase()}s`, 
                                 th: (name) => `ของแนะนำสำหรับสาย${name}` },
        ctaHEvergreen:        { en: "Wondering if this matches your cat? Take the test.", 
                                 th: "อยากรู้ว่าแมวคุณตรงกับสายนี้ไหม? ลองทำแบบทดสอบดู" },
        ctaHumanEvergreen:    { en: "Wondering if this matches your personality? Take the test.", 
                                 th: "อยากรู้ว่าคุณตรงกับร่างมนุษย์สายนี้ไหม? ลองทำแบบทดสอบดู" },

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
        placeholderCatName:   { en: "e.g. Mochi",                th: "เช่น น้องถุงทอง" },
        placeholderHumanName: { en: "e.g. Cat Mother",           th: "เช่น มนุษย์แม่" },
        picksForHuman:        { en: "The Human Setup",           th: "เซ็ตที่ใช่สำหรับร่างมนุษย์" },
        picksForHumanEvergreen: { en: "Archetype recommendations", th: "เซ็ตแนะนำประจำสาย" },
        productBlurbDissociating: { en: "Perfect for moments of stillness.", th: "เหมาะสำหรับนิ่งสงบสยบทุกความเคลื่อนไหว" },
        productBlurbIgnoring: { en: "Perfect for maintaining boundaries.", th: "เหมาะกับการเมินทุกคนแบบตัวมารดา" },
        productBlurbProblem:  { en: "Engineered for complex personality types.", th: "ออกแบบมาเพื่อมนุษย์สายซับซ้อน" },
        productTitleSpot:     { en: "The Spot™ — premium zone", th: "The Spot™ — มุมสงบระดับพรีเมียม" },
        productTitleFuel:     { en: "Fuel for the Menace", th: "ขุมพลังของเหล่าตัวแสบ" },
        productCta:           { en: "See picks →", th: "ดูของแนะนำ →" },
        ctaHuman:             { en: "Now find out which cat matches you.", th: "ทีนี้มาดูกันว่าแมวตัวไหนที่เข้ากับคุณ" },

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
        
        // ─── compatibility graph (v1) ─────────────────────────
        compTitle:            { en: "Compatibility Graph",     th: "กราฟความเข้ากัน" },
        compIntro:            { en: "How this cat interacts with the rest of the 16 types.", 
                                 th: "วิธีที่แมวตัวนี้มีปฏิสัมพันธ์กับแมวอีกทั้ง 16 ประเภท" },
        compBestMatch:        { en: "Best Match",              th: "คู่ที่ใช่ที่สุด" },
        compChaosPair:        { en: "Chaos Pair",              th: "คู่หูสายป่วน" },
        compSecretTwin:       { en: "Secret Twin",             th: "แฝดคนละฝา" },
        compWorstRoommate:    { en: "Worst Roommate",          th: "รูมเมทสุดจะทน" },
        compViewFull:         { en: "View full compatibility →", th: "ดูรายละเอียดความเข้ากัน →" },

        // ─── human compatibility labels (v1) ─────────────────
        hCompBestMatch:       { en: "Soulmate Energy",         th: "โซลเมทสายซัพ" },
        hCompChaosPair:       { en: "Toxic Duo",               th: "คู่หูตัวเป็นพิษ" },
        hCompSecretTwin:      { en: "Identity Twin",           th: "แฝดทางจิตวิญญาณ" },
        hCompWorstRoommate:   { en: "Corporate Nemesis",       th: "ศัตรูคู่อาฆาตในออฟฟิศ" },

        // ─── human expansion growth loop (v1) ────────────────
        hCompCatTitle:        { en: "Which cat energy survives you?", th: "แมวแบบไหนที่อยู่รอดกับคุณได้?" },
        hCompHumanTitle:      { en: "Who should never be in your group chat?", th: "ใครคือคนที่ไม่ควรอยู่ในแชทกลุ่มกับคุณ?" },
        hCompCatTitleEvergreen:   { en: "Cat energy compatibility", th: "ความเข้ากันกับพลังงานแมว" },
        hCompHumanTitleEvergreen: { en: "Group chat dynamics", th: "ความสัมพันธ์ในแชทกลุ่ม" },
        
        hCompCatBest:         { en: "Ideal cat coworker",      th: "เพื่อนร่วมงานในฝัน" },
        hCompCatWorst:        { en: "Would block you",         th: "โดนบล็อกแน่นอน" },
        hCompCatChaos:        { en: "Enables your chaos",      th: "สายซัพความป่วน" },
        hCompCatSupport:      { en: "Support gremlin",         th: "หน่วยซัพพอร์ตทางใจ" },
        
        hCompCatWorstEvergreen:   { en: "Socially guarded",       th: "เว้นระยะห่าง" },
        hCompCatChaosEvergreen:   { en: "Chaos catalyst",         th: "ตัวกระตุ้นความป่วน" },

        hCompHumanBest:       { en: "Friend group goals",      th: "คู่หูตัวตึง" },
        hCompHumanEnabler:    { en: "Mutual enabler",          th: "พากันเสียคน" },
        hCompHumanExhaust:    { en: "Emotionally exhausting",  th: "เหนื่อยใจแพ็คคู่" },
        hCompHumanBanned:     { en: "Banned from Discord",     th: "โดนแบนจากกลุ่ม" },

        // ─── behavioral hooks (v1) ───────────────────────────
        hooksTitle:           { en: "Behavioral Hooks",        th: "พฤติกรรมสุดแม่น" },
        hooksMostLikely:      { en: "Most likely to…",         th: "มีแนวโน้มจะ…" },
        hooksTextsLike:       { en: "Texts like…",             th: "สไตล์การทักแชท…" },
        hooksSecretWeakness:  { en: "Secret weakness",         th: "จุดอ่อนลับ" },
        hooksWhenStressed:    { en: "When stressed",           th: "ตอนเครียด" },
        hooksAt2AM:           { en: "At 2 AM",                 th: "ตอนตี 2" },
        hooksCorporate:       { en: "Corporate survival rate", th: "โอกาสรอดในออฟฟิศ" },
        hooksSupportObject:   { en: "Emotional support object", th: "ของซัพพอร์ตทางใจ" },
        hHooksSupportObject:  { en: "Object you'd save in a fire", th: "ของที่จะหยิบถ้าไฟไหม้บ้าน" },
        hHooksSupportObjectEvergreen: { en: "Prized possession", th: "ของรักของหวง" },

        // ─── share cards (v1) ────────────────────────────────
        shareCardBtn:         { en: "Save card",               th: "เซฟรูปการ์ด" },
        shareChatBtn:         { en: "Save chat",               th: "เซฟแชท" },
        sharePairBtn:         { en: "Save pair",               th: "เซฟรูปคู่" },
        shareProcessing:      { en: "Generating...",           th: "กำลังสร้างรูป..." },
        shareDone:            { en: "Card saved!",             th: "บันทึกรูปแล้ว!" },
        shareOpened:          { en: "Share sheet opened",      th: "เปิดหน้าต่างแชร์แล้ว" },
        shareFailed:          { en: "Generation failed",       th: "สร้างรูปไม่สำเร็จ" },
        shareFallbackMsg:     { en: "Download blocked? Long-press the image to save.",
                                 th: "โหลดไม่ได้ใช่ไหม? กดค้างที่รูปเพื่อบันทึกได้เลย" },

        // ─── daily feed (v1) ─────────────────────────────────
        dailyTitle:           { en: "Today’s Cat Energy",      th: "พลังงานแมววันนี้" },
        dailyUpdated:         { en: "Updated daily",           th: "อัปเดตรายวัน" },
        dailyShareBtn:        { en: "Share mood",              th: "แชร์อารมณ์วันนี้" },
        dailyVibeIs:          { en: (name, archetype) => `Today, ${name} is giving ${archetype} energy.`,
                                 th: (name, archetype) => `วันนี้ ${name} มีพลังงานแบบ ${archetype}` },
        dailySeeFull:         { en: "See today’s full reading →", th: "ดูคำทำนายเต็มของวันนี้ →" },
        dailyFindYours:        { en: "Find your MeowBTI",       th: "ค้นหา MeowBTI ของคุณ" },
        dailyFeatured:        { en: "Featured cat energy",     th: "แมวเด่นประจำวัน" },
        dailyFamilyTitle:     { en: "Your Cat Family Today",   th: "กลุ่มแมวของคุณในวันนี้" },
        dailyViewReading:     { en: "View today’s reading",    th: "ดูคำทำนายวันนี้" },
        dailyViewAllFamily:   { en: "View all family",         th: "ดูสมาชิกทั้งหมด" },
        dailyHouseholdMood:   { en: "Today’s household mood",  th: "บรรยากาศในบ้านวันนี้" },

        // Personalized share cards
        shareNameIs:          { en: (n, a) => `${n} is the ${a}`, 
                                 th: (n, a) => `${n} คือ ${a}` },
        shareNameTextsLike:   { en: (n) => `${n} texts like…`,
                                 th: (n) => `สไตล์การทักแชทของ ${n}` },
        shareNameHook:        { en: (n, t) => `${n}’s ${t}`,
                                 th: (n, t) => `${t}ของ ${n}` },
        shareNamePair:        { en: (n1, n2) => `${n1} + ${n2}`,
                                 th: (n1, n2) => `${n1} + ${n2}` },

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

        // ─── drama feed (drama-feed.js) ───────────────────────
        dramaFeedTitle:       { en: "Household Drama Feed",    th: "ฟีดดราม่าประจำบ้าน" },
        dramaFeedSub:         { en: "Real-time updates from your tiny roommates.", th: "อัปเดตแบบเรียลไทม์จากเหล่ารูมเมทตัวจิ๋ว" },

        // Templates
        dramaAudit:           { en: (n) => `${n} is currently auditing everyone's productivity.`,
                                 th: (n) => `${n} กำลังตรวจสอบประสิทธิภาพการทำงานของทุกคนในบ้าน` },
        dramaAlliance:        { en: (n1, n2) => `${n1} and ${n2} have formed an alliance against peace.`,
                                 th: (n1, n2) => `${n1} และ ${n2} ได้จับมือเป็นพันธมิตรเพื่อทำลายความสงบสุข` },
        dramaMenace:          { en: (n) => `Warning: The household menace (${n}) has entered the room.`,
                                 th: (n) => `คำเตือน: ตัวแสบประจำบ้าน (${n}) ได้ก้าวเข้าสู่ห้องแล้ว` },
        dramaMenaceOverloaded: { en: (n) => `${n} is in System Overload mode. Do not make eye contact.`,
                                 th: (n) => `${n} อยู่ในโหมดโอเวอร์โหลด ห้ามสบตาเด็ดขาด` },
        dramaHighEnergyChaos: { en: () => `High household energy detected. Someone is about to do something expensive.`,
                                 th: () => `ตรวจพบพลังงานความดีดสูงในบ้าน เตรียมตัวเสียเงินกับเรื่องไม่เป็นเรื่องได้เลย` },
        dramaStability:       { en: () => `Someone knocked over emotional stability. It wasn't an accident.`,
                                 th: () => `มีคนทำ 'ความมั่นคงทางอารมณ์' ตกแตก... และนั่นไม่ใช่อุบัติเหตุ` },
        dramaBrainCell:       { en: (n1, n2) => `${n1} and ${n2} are currently sharing one brain cell. It's not working.`,
                                 th: (n1, n2) => `${n1} และ ${n2} กำลังแบ่งสมองก้อนเดียวกันใช้... ดูทรงแล้วไม่รอด` },
        dramaMeeting:         { en: (n) => `${n} has called an emergency 3 AM meeting. Attendance is mandatory.`,
                                 th: (n) => `${n} เรียกประชุมด่วนตอนตี 3 ทุกคนต้องเข้าประชุม ห้ามสาย` },
        dramaJudging:         { en: (n) => `${n} is watching you from a distance. Judgment level: 100%.`,
                                 th: (n) => `${n} กำลังมองคุณอยู่ห่างๆ... ระดับการตัดสิน: 100%` },
        dramaChaos:           { en: () => `The household chaos level just increased by 20%. No reason given.`,
                                 th: () => `ระดับความวุ่นวายในบ้านเพิ่มขึ้น 20% โดยไม่มีสาเหตุ` },
        dramaTimeMinutesAgo:  { en: (count) => `${count}m ago`,
                                 th: (count) => `${count} นาทีที่แล้ว` },

        // ─── compatibility descriptions ──────────────────────
        compDescBossBattle:    { en: "A constant power struggle for the sunny spot.",
                                 th: "สงครามแย่งชิงที่อาบแดดที่ดีที่สุดเกิดขึ้นตลอดเวลา" },
        compDescOneBrainCell:  { en: "Logic has left the building. Chaos reigns.",
                                 th: "ตรรกะไม่อยู่ในบ้านนี้อีกต่อไป ความวุ่นวายครองเมือง" },
        compDescTwinFlames:    { en: "Literally the same person in different bodies.",
                                 th: "คือคนเดียวกันเป๊ะ แค่อยู่ในคนละร่าง" },
        compDescTotalOpposites: { en: "They have nothing in common, yet here they are.",
                                 th: "ไม่มีอะไรเหมือนกันเลย แต่ก็ดันมาอยู่ด้วยกันได้" },
        compDescTinyMafia:     { en: "Coordinated efforts to acquire extra treats.",
                                 th: "ร่วมมือกันอย่างเป็นระบบเพื่อหลอกเอาขนมเพิ่ม" },
        compDescChaoticVolume: { en: "Emotional volume set to 11 at all times.",
                                 th: "ระดับอารมณ์ถูกตั้งไว้ที่ 11 ตลอดเวลา" },
        compDescEmotionalSupport: { en: "A constant loop of seeking and giving validation.",
                                 th: "วงจรการเรียกร้องความสนใจและให้กำลังใจกันไม่สิ้นสุด" },
        compDescRoommateEnergy: { en: "They're just figuring it out.",
                                 th: "พวกเขากำลังพยายามทำความเข้าใจกันอยู่" },

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
        readFullProfile:   { en: "Read full meaning & traits →", th: "อ่านความหมายและลักษณะเด่นเต็มๆ →" },
        meaningTakeQuiz:   { en: "Take the cat quiz →",       th: "ทำแบบทดสอบแมว →" },
        meaningTakeQuizHuman: { en: "Take the human quiz →",    th: "ทำแบบทดสอบร่างมนุษย์ →" },
        certAuthentic:    { en: "cert. authentic",            th: "รับรองของแท้" },
        oneOfSixteen:      { en: "1 of 16",                   th: "1 จาก 16" },
        shareVerdict:      { en: "share your cat's verdict",  th: "แชร์คำตัดสินของแมวคุณ" },
        sharePromptText:   { en: "upload your cat's photo (optional) and we'll build a poster for IG / TikTok / LINE.",
                              th: "อัปโหลดรูปแมวคุณ (ไม่บังคับ) แล้วเราจะสร้างโปสเตอร์ให้สำหรับ IG / TikTok / LINE" },
        addPhoto:          { en: "add cat photo",             th: "เพิ่มรูปแมว" },
        shareHumanVerdict: { en: "share your human archetype", th: "แชร์ตัวตนร่างมนุษย์ของคุณ" },
        shareHumanPromptText: { en: "Save or share your human cat-energy result.",
                                th: "บันทึกหรือแชร์ผลลัพธ์พลังงานแมวในร่างมนุษย์ของคุณ" },
        addHumanPhoto:     { en: "add your photo",             th: "เพิ่มรูปของคุณ" },
        humanResultCta:    { en: "take the Human Quiz again",  th: "ทำแบบทดสอบร่างมนุษย์อีกครั้ง" },
        humanMeaningCta:   { en: "Find your human energy →",   th: "ค้นหาพลังงานของคุณ →" },
        browseHumanAll:    { en: "browse all 16 human types",  th: "ดูร่างมนุษย์ทั้ง 16 แบบ" },
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
        vsRivalEvergreen:  { en: "The natural enemy",         th: "ศัตรูคู่ปรับตามธรรมชาติ" },
        hVsRival:          { en: "The natural rival",         th: "คู่ปรับที่สมน้ำสมเนื้อ" },
        hVsRivalResult:    { en: "Your natural rival",        th: "คู่ปรับที่สมน้ำสมเนื้อของคุณ" },
        fullBreakdown:     { en: "The full breakdown",        th: "รายละเอียดเชิงลึก" },
        keyTraits:         { en: "Key traits in action",      th: "พฤติกรรมเด่น" },

        // ─── MBTI Test (mbti/) ──────────────────────────────
        mbtiHomeH1:        { en: "Free MBTI-style Personality Test", th: "แบบทดสอบบุคลิกภาพ MBTI ฟรี" },
        mbtiHomeSub:       { en: "Find your 4-letter code and see your MeowBTI cousin. No email required.", 
                              th: "ค้นหารหัส 4 ตัวของคุณ พร้อมดูแมวที่เป็นคู่เหมือนทางจิตวิญญาณ ไม่ต้องใช้อีเมล" },
        mbtiHomeCta:       { en: "Start MBTI Test",           th: "เริ่มทำแบบทดสอบ MBTI" },
        mbtiTestH1:        { en: "MBTI-style Analysis",       th: "วิเคราะห์บุคลิกภาพ MBTI" },
        mbtiResultH1:      { en: "Your MBTI-style Result",    th: "ผลลัพธ์ MBTI ของคุณ" },
        mbtiResultCousin:  { en: "Closest MeowBTI energy cousin:", th: "คู่เหมือนทางพลังงาน MeowBTI:" },
        mbtiTakeHumanQuiz: { en: "Want the emotional version?", th: "อยากได้เวอร์ชันทางอารมณ์ไหม?" },
        mbtiTakeHumanCta:  { en: "Take Human Cat-Energy Quiz →", th: "ทำแบบทดสอบร่างมนุษย์ →" },
        mbtiCheckWeather:  { en: "Check today's Emotional Weather", th: "เช็กสภาพอากาศในใจวันนี้" },
        mbtiBrowseArchetypes: { en: "Browse all Human Archetypes", th: "ดูร่างมนุษย์ทั้ง 16 แบบ" },
        mbtiAgree:         { en: "Agree",                    th: "ใช่เลย" },
        mbtiDisagree:      { en: "Disagree",                 th: "ไม่ใช่" },
        mbtiMoreLikeMe:    { en: "More like me",             th: "เป็นเรามากกว่า" },
        mbtiLessLikeMe:    { en: "Less like me",             th: "ไม่ค่อยเหมือนเรา" },
        mbtiTeaserH2:      { en: "Free MBTI Personality Test", th: "แบบทดสอบ MBTI ฟรี" },
        mbtiTeaserP:       { en: "Find your 4-letter type and meet your cat-energy cousin.", th: "ค้นหารหัสบุคลิกภาพ 4 ตัว พร้อมเจอแมวสายพันธุ์ที่ตรงกับคุณ" },
        mbtiTeaserCta:     { en: "Take the MBTI Test →",      th: "ทำแบบทดสอบ MBTI →" },

        // ─── Emotional OS daily check-in (daily.html + daily.js) ──
        dailyKicker:       { en: "Daily ritual",               th: "พิธีเช็กอินประจำวัน" },
        dailyH1:           { en: "Daily Emotional Weather",    th: "สภาพอากาศในใจประจำวัน" },
        dailyIntro:        { en: "A tiny check-in for your current cat-energy mood. Saved only on this device.",
                              th: "เช็กอินสั้นๆ กับพลังงานแมวในใจตอนนี้ บันทึกไว้เฉพาะในอุปกรณ์นี้" },
        dailyDisclaimer:   { en: "For reflection and entertainment only. Not medical or mental health advice.",
                              th: "ใช้เพื่อการสะท้อนตัวเองและความบันเทิงเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์หรือสุขภาพจิต" },
        dailyStartCta:     { en: "Start today’s check-in",     th: "เริ่มเช็กอินวันนี้" },
        dailyRetakeCta:    { en: "Retake today’s check-in",    th: "เช็กอินวันนี้ใหม่" },
        dailyViewTodayCta: { en: "View today’s reading",       th: "ดูผลอ่านวันนี้" },
        dailyShareCta:     { en: "Share / save card",          th: "แชร์ / บันทึกการ์ด" },
        dailyCopyCta:      { en: "Copy text",                  th: "คัดลอกข้อความ" },
        dailyCopied:       { en: "copied",                     th: "คัดลอกแล้ว" },
        dailySaved:        { en: "Saved for today.",           th: "บันทึกของวันนี้แล้ว" },
        dailyStatus:       { en: "Today's check-in complete.", th: "เช็กอินวันนี้เรียบร้อย" },
        dailyContextLine:  { en: code => `Reading through your ${code} human cat-energy.`,
                              th: code => `อ่านผ่านพลังงานร่างมนุษย์สาย ${code} ของคุณ` },
        dailyNoContextLine: { en: "No profile needed. Just check the weather inside.",
                              th: "ไม่ต้องมีโปรไฟล์ก็ได้ แค่เช็กสภาพอากาศข้างในใจ" },
        dailyNeedLabel:    { en: "You might need",             th: "วันนี้คุณอาจต้องการ" },
        dailyPermissionLabel: { en: "Tiny permission",         th: "คำอนุญาตเล็กๆ" },
        dailyPrivacyNote:  { en: "No names or notes are added to URLs, metadata, sitemap, or share cards.",
                              th: "ชื่อและโน้ตจะไม่ถูกใส่ใน URL, metadata, sitemap หรือการ์ดแชร์" },
        dailyShareFallback: { en: "Today’s MeowBTI Emotional Weather", th: "สภาพอากาศในใจวันนี้จาก MeowBTI" },

        moodQEnergy:       { en: "Current energy level?",      th: "ระดับพลังงานตอนนี้?" },
        moodQSocial:       { en: "How visible do you feel?",   th: "วันนี้อยากให้คนเห็นเราแค่ไหน?" },
        moodQStress:       { en: "Mental weather status?",     th: "สภาพอากาศในหัวเป็นอย่างไร?" },
        
        moodEnergyLow:     { en: "Low Resolution",             th: "ประหยัดพลังงาน" },
        moodEnergyMed:     { en: "Steady Stream",              th: "ไหลลื่นสม่ำเสมอ" },
        moodEnergyHigh:    { en: "High Frequency",             th: "ความถี่สูงปรี๊ด" },
        
        moodSocialHiding:  { en: "Hiding Mode",               th: "โหมดจำศีล" },
        moodSocialSelective:{ en: "Selectively Available",     th: "พร้อมคุยเฉพาะคน" },
        moodSocialSocial:  { en: "Main Character",             th: "โหมดตัวเอก" },
        
        moodStressCalm:    { en: "Clear Skies",                th: "ท้องฟ้าแจ่มใส" },
        moodStressScattered:{ en: "Light Static",               th: "มีคลื่นรบกวน" },
        moodStressOver:    { en: "System Overload",            th: "ระบบโอเวอร์โหลด" },

        dailyInsightH:     { en: "Emotional Insight",          th: "ข้อมูลเจาะลึกทางอารมณ์" },
        dailyCatLineH:     { en: "Cat Energy Active",          th: "พลังงานแมวที่ทำงาน" },
        dailyAdviceH:      { en: "Tiny Advice",                th: "คำแนะนำเล็กๆ" },
        dailyShareCta:     { en: "Share Forecast",             th: "แชร์พยากรณ์" },
        dailyCopyCta:      { en: "Copy Result",                th: "คัดลอกผลลัพธ์" },
        dailyRetakeCta:    { en: "Update check-in",            th: "อัปเดตเช็กอิน" },
        dailyShareFallback:{ en: "Today's emotional forecast", th: "พยากรณ์อารมณ์วันนี้" },

        orbSoftStatic:     { en: "Soft Static",                th: "สัญญาณนุ่มๆ" },
        orbVelvetThunder:  { en: "Velvet Thunder",             th: "ฟ้าร้องกำมะหยี่" },
        orbOvercaffeinatedMoon: { en: "Overcaffeinated Moon",  th: "พระจันทร์คาเฟอีนเกิน" },
        orbTinyStorm:      { en: "Tiny Storm",                 th: "พายุจิ๋ว" },
        orbClosedCurtains: { en: "Closed Curtains",            th: "ปิดม่านก่อน" },
        orbChosenPeopleOnly: { en: "Chosen People Only",       th: "เฉพาะคนที่เลือกแล้ว" },
        orbClearWindow:    { en: "Clear Window",               th: "หน้าต่างใสๆ" },
        orbSparkleWarning: { en: "Sparkle Warning",            th: "คำเตือนวิบวับ" },

        weatherFoggySafe:  { en: "foggy but safe",             th: "หมอกลงแต่ปลอดภัย" },
        weatherSoftRain:   { en: "soft rain",                  th: "ฝนนุ่มๆ" },
        weatherEmotionalHumidity: { en: "emotional humidity",  th: "ความชื้นทางใจ" },
        weatherTinyThunder:{ en: "tiny thunder",               th: "ฟ้าร้องจิ๋ว" },
        weatherBrightChaos:{ en: "bright chaos",               th: "ความวุ่นวายสว่างจ้า" },
        weatherQuietSunbeam: { en: "quiet sunbeam",            th: "แดดอุ่นเงียบๆ" },
        weatherStaticPressure: { en: "static pressure",        th: "แรงกดสัญญาณนิ่ง" },
        weatherClearishSkies: { en: "clear-ish skies",         th: "ฟ้าใสประมาณหนึ่ง" },

        weatherLineFoggySafe: { en: "The inside is a little unclear, but not unsafe.",
                                th: "ข้างในยังมัวๆ อยู่บ้าง แต่ไม่ได้อันตราย" },
        weatherNeedFoggySafe: { en: "one small next step",      th: "ก้าวเล็กๆ ถัดไปหนึ่งก้าว" },
        weatherPermissionFoggySafe: { en: "You do not have to solve the whole sky.",
                                      th: "คุณไม่จำเป็นต้องแก้ทั้งท้องฟ้าในทีเดียว" },
        weatherLineSoftRain: { en: "Your system wants gentleness without a big explanation.",
                               th: "ระบบข้างในอยากได้ความอ่อนโยนแบบไม่ต้องอธิบายยาว" },
        weatherNeedSoftRain: { en: "lower volume and softer plans", th: "เสียงเบาลงและแผนที่นุ่มขึ้น" },
        weatherPermissionSoftRain: { en: "Being soft is still a signal.",
                                     th: "ความนุ่มก็เป็นสัญญาณเหมือนกัน" },
        weatherLineEmotionalHumidity: { en: "Feelings are in the air, refusing to become a full storm.",
                                        th: "ความรู้สึกลอยอยู่ในอากาศ แต่ยังไม่ยอมกลายเป็นพายุเต็มตัว" },
        weatherNeedEmotionalHumidity: { en: "fewer tabs, more water, one honest sentence",
                                        th: "ปิดแท็บในหัวลงบ้าง ดื่มน้ำ และพูดจริงสักประโยค" },
        weatherPermissionEmotionalHumidity: { en: "You do not have to explain the whole weather system.",
                                              th: "คุณไม่ต้องอธิบายระบบอากาศทั้งใจให้ครบก็ได้" },
        weatherLineTinyThunder: { en: "Something small is making a lot of noise inside.",
                                  th: "มีอะไรเล็กๆ ข้างในที่ส่งเสียงดังเกินตัว" },
        weatherNeedTinyThunder: { en: "one clean decision",     th: "การตัดสินใจชัดๆ สักเรื่อง" },
        weatherPermissionTinyThunder: { en: "You are allowed to be dramatic and still be right.",
                                        th: "คุณดราม่าได้นิดหน่อย และยังอาจถูกอยู่ก็ได้" },
        weatherLineBrightChaos: { en: "The energy is loud, glittery, and not fully supervised.",
                                  th: "พลังงานดัง วิบวับ และไม่มีใครคุมเวรเต็มตัว" },
        weatherNeedBrightChaos: { en: "movement before meaning", th: "ขยับก่อน ค่อยหาความหมาย" },
        weatherPermissionBrightChaos: { en: "You can be a lot without being too much.",
                                        th: "คุณมีพลังเยอะได้ โดยไม่จำเป็นต้องมากเกินไป" },
        weatherLineQuietSunbeam: { en: "Your system wants warmth without a full performance.",
                                   th: "ข้างในอยากได้ความอุ่น โดยไม่ต้องแสดงอะไรใหญ่โต" },
        weatherNeedQuietSunbeam: { en: "low-pressure company", th: "คนอยู่ใกล้แบบไม่กดดัน" },
        weatherPermissionQuietSunbeam: { en: "You can receive care quietly.",
                                         th: "คุณรับความใส่ใจแบบเงียบๆ ได้" },
        weatherLineStaticPressure: { en: "There is pressure in the wires, but the signal still works.",
                                     th: "ในสายมีแรงกดอยู่ แต่สัญญาณยังทำงานได้" },
        weatherNeedStaticPressure: { en: "a pause before the next reply", th: "หยุดหายใจก่อนตอบครั้งถัดไป" },
        weatherPermissionStaticPressure: { en: "Not every notification needs your nervous system.",
                                           th: "ไม่ใช่ทุกแจ้งเตือนที่ต้องใช้ทั้งระบบประสาทของคุณ" },
        weatherLineClearishSkies: { en: "Not perfect weather, but enough visibility to keep going.",
                                    th: "อากาศไม่ได้เพอร์เฟกต์ แต่เห็นทางพอจะไปต่อ" },
        weatherNeedClearishSkies: { en: "a simple plan and a clean surface", th: "แผนง่ายๆ กับพื้นที่โล่งสักมุม" },
        weatherPermissionClearishSkies: { en: "Good enough is a real climate.",
                                          th: "พอใช้ได้ก็เป็นสภาพอากาศที่อยู่ได้จริง" },

        humanResultWeatherH: { en: "Check today’s emotional weather as this type",
                               th: "เช็กสภาพอากาศในใจวันนี้ผ่านสายนี้" },
        humanResultWeatherSub: { en: "Your archetype is the lens. Today’s mood is the weather.",
                                 th: "ตัวตนคือเลนส์ ส่วนอารมณ์วันนี้คือสภาพอากาศ" },
        humanResultWeatherCta: { en: "Start daily check-in",    th: "เริ่มเช็กอินประจำวัน" },
        catResultHumanBridgeH: { en: "Want to compare your energy with your cat’s?",
                                 th: "อยากเทียบพลังงานของคุณกับแมวไหม?" },
        catResultHumanBridgeSub: { en: "Find your human cat-energy and see what kind of household weather you create together.",
                                   th: "ค้นหาพลังงานแมวในร่างมนุษย์ของคุณ แล้วดูว่าบ้านนี้สร้างสภาพอากาศแบบไหนด้วยกัน" },
        catResultHumanBridgeCta: { en: "Take the Human Quiz",   th: "ทำแบบทดสอบร่างมนุษย์" },

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
