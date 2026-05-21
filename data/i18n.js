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
        navMBTI:           { en: "MBTI",                      th: "MBTI" },
        navEnnea:          { en: "Enneagram",                 th: "Enneagram" },
        navCompare:        { en: "Compare",                   th: "เปรียบเทียบ" },
        navPicks:          { en: "Picks",                     th: "ของแนะนำ" },

        // ─── Comparison Tool (compare.html) ──────────────────
        compareH1:         { en: "Identity Deep Dive",        th: "เจาะลึกเคมีตัวตน" },
        compareIntro:      { en: "What happens when two worlds collide? Choose two identities to see their dynamic.", 
                              th: "จะเกิดอะไรขึ้นเมื่อสองขั้วมาเจอกัน? เลือกตัวตนที่ต้องการเพื่อดูบทวิเคราะห์ความสัมพันธ์" },
        comparePersonA:    { en: "Person A",                  th: "คนที่หนึ่ง" },
        comparePersonB:    { en: "Person B",                  th: "คนที่สอง" },
        compareFramework:  { en: "Framework",                 th: "ระบบวิเคราะห์" },
        compareType:       { en: "Type",                      th: "ประเภท" },
        compareResultH:    { en: "The Duo Dynamic",           th: "ไดนามิกของคู่นี้" },
        compareShareDuo:   { en: "Share this Duo",            th: "แชร์บทวิเคราะห์คู่" },
        compareEmptyA:     { en: "Select Person A",           th: "เลือกคนที่หนึ่ง" },
        compareEmptyB:     { en: "Select Person B",           th: "เลือกคนที่สอง" },
        compareVS:         { en: "VS",                        th: "VS" },
        compareChoose:     { en: "Choose Identity",           th: "เลือกตัวตน" },
        comparePopular:    { en: "Popular Pairings",           th: "คู่ยอดฮิต" },
        
        ecoLabelMind:      { en: "Mind Framework",            th: "โครงสร้างทางสติปัญญา" },
        ecoLabelDrive:     { en: "Emotional Drive",           th: "แรงขับเคลื่อนทางอารมณ์" },
        ecoLabelLoop:      { en: "Retention Loop",            th: "กิจวัตรประจำวัน" },
        ecoDescMBTI:       { en: "Understand the hidden wiring of your brain and how you process reality.", 
                              th: "เข้าใจระบบความคิดลึกๆ และวิธีที่คุณประมวลผลความจริงรอบตัว" },
        ecoDescEnnea:      { en: "Discover the emotional pressure and deep motivation that actually drives you.", 
                              th: "ค้นพบแรงขับเคลื่อนทางอารมณ์และความกลัวลึกๆ ที่ซ่อนอยู่ใต้ผิวหนังคุณ" },
        ecoDescWeather:    { en: "A tiny ritual to see which cat energy is running your day.", 
                              th: "พิธีกรรมเล็กๆ เพื่อเช็กว่าวันนี้พลังงานแมวตัวไหนกำลังคุมมู้ดคุณอยู่" },

        navTakeTest:       { en: "Take the test",             th: "เริ่มทำแบบทดสอบ" },
        
        pathForYou:        { en: "For Humans",                th: "สำหรับมนุษย์" },
        pathForCat:        { en: "For Cats",                  th: "สำหรับแมว" },
        pathForYouSub:     { en: "Map your internal OS.",     th: "สำรวจระบบปฏิบัติการในใจ" },
        pathForCatSub:     { en: "Analyze your cat's menace.", th: "วิเคราะห์ความแสบของแมวคุณ" },
        pathTakeMBTI:      { en: "Mind Wiring",               th: "วงจรความคิด" },
        pathTakeEnnea:     { en: "Emotional Drive",           th: "แรงขับเคลื่อนทางอารมณ์" },
        pathTakeCat:       { en: "Cat Energy",                th: "พลังงานร่างแมว" },

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

        // ─── Relationship Dynamics ──────────────────────────
        dynRoommatesTitle: { en: "The Casual Cohabitants",    th: "เพื่อนร่วมบ้านสายชิลล์" },
        dynRoommatesDesc:  { en: "You exist in the same space with zero friction and moderate interest.", 
                              th: "อยู่ร่วมโลกกันได้แบบไม่มีปัญหา แต่ก็ไม่ได้อินอะไรกันมาก" },
        dynSpreadsheetTitle: { en: "The Plan & The Problem",   th: "สายแผนการกับตัวปัญหา" },
        dynSpreadsheetDesc: { en: "One of you plans the spreadsheet. The other becomes the problem.", 
                               th: "คนหนึ่งกางตาราง Excel อีกคนกำลังสร้างความฉิบหาย" },
        dynImprovTitle:    { en: "Emotional Improvisation",   th: "สายด้นสดทางอารมณ์" },
        dynImprovDesc:     { en: "This pairing survives entirely through chaotic improvisation.", 
                              th: "คู่นี้อยู่รอดได้ด้วยการด้นสดท่ามกลางความวุ่นวายล้วนๆ" },
        dynSideQuestsTitle: { en: "The Side Quest Duo",        th: "คู่หูเควสย่อย" },
        dynSideQuestsDesc: { en: "Together, you create unnecessary side quests and ignore the main goal.", 
                              th: "รวมตัวกันเมื่อไหร่ เควสย่อยงอกทันที ส่วนงานหลักน่ะเหรอ... พักก่อน" },
        dynExhaustionTitle: { en: "Labor & Leisure",           th: "สายแบกกับสายชิลล์" },
        dynExhaustionDesc: { en: "One of you is emotionally exhausted. The other thinks this is bonding.", 
                               th: "คนหนึ่งเหนื่อยสายตัวแทบขาด อีกคนนึกว่านี่คือการสานสัมพันธ์" },
        dynEchoTitle:      { en: "The Echo Chamber",          th: "ห้องแห่งเสียงสะท้อน" },
        dynEchoDesc:       { en: "You are the same person. It's either perfect or a complete disaster.", 
                              th: "คุณคือคนคนเดียวกัน มันจะออกมาดีสุดๆ หรือไม่ก็พังพินาศไปเลย" },
        dynStagnationTitle: { en: "The Zen Stagnation",        th: "สายหยุดนิ่งแบบเซน" },
        dynStagnationDesc: { en: "You avoid conflict so aggressively that nothing ever gets solved.", 
                               th: "เลี่ยงความขัดแย้งเก่งมาก จนไม่มีอะไรได้รับการแก้ไขเลย" },
        dynPowerStruggleTitle: { en: "The Board Meeting",        th: "ที่ประชุมบอร์ดบริหาร" },
        dynPowerStruggleDesc: { en: "Two leaders, one kingdom. Every breakfast is a strategic negotiation.", 
                                 th: "ผู้นำสองคน แต่อาณาจักรเดียว ทุกมื้อเช้าคือการเจรจาต่อรองทางกลยุทธ์" },
        dynAnchorKiteTitle: { en: "The Anchor & The Kite",     th: "สมอกับว่าว" },
        dynAnchorKiteDesc:  { en: "One keeps the logic grounded. The other is currently floating away.", 
                               th: "คนหนึ่งคอยดึงสติด้วยตรรกะ อีกคนกำลังลอยละล่องไปไกลแล้ว" },
        
        // ─── Household Weather Map ──────────────────────────
        weatherMapTitle:   { en: "Household Climate",         th: "ภูมิอากาศประจำบ้าน" },
        weatherMapIntro:   { en: "The collective emotional atmosphere of your household over the last 7 days.", 
                              th: "มวลบรรยากาศทางอารมณ์โดยรวมของบ้านคุณในช่วง 7 วันที่ผ่านมา" },
        
        climateCalmTitle:  { en: "Emotionally Balanced",      th: "สมดุลทางอารมณ์" },
        climateCalmDesc:   { en: "The air is clear. Everyone is charging their batteries at a healthy pace.", 
                              th: "ท้องฟ้าโปร่งใส ทุกคนกำลังชาร์จพลังในจังหวะที่เหมาะสม" },
        climateLoudTitle:  { en: "Emotionally Loud",          th: "อารมณ์เสียงดัง" },
        climateLoudDesc:   { en: "High energy, high volume. The household is one minor inconvenience away from a riot.", 
                              th: "พลังงานสูง เสียงดัง บ้านนี้ห่างจากความวุ่นวายแค่ก้าวเดียวเท่านั้น" },
        climateHeavyTitle: { en: "Collective Burnout",        th: "หมดไฟกันยกบ้าน" },
        climateHeavyDesc:  { en: "The social battery is at 1%. Everyone needs a nap and zero human interaction.", 
                              th: "โซเชียลแบตเหลือ 1% ทุกคนต้องการการงีบหลับและงดการคุยกับมนุษย์" },
        climateUnstableTitle: { en: "Atmospheric Chaos",       th: "มวลความวุ่นวายในอากาศ" },
        climateUnstableDesc: { en: "A mismatch of energy and stress levels. Someone is vibing while another is collapsing.", 
                                th: "ระดับพลังงานและความเครียดไม่ตรงกัน มีคนกำลังแฮปปี้ในขณะที่มีคนกำลังจะระเบิด" },
        
        weatherDuoBurnout: { en: "Your household has entered coordinated burnout.", th: "บ้านคุณได้เข้าสู่โหมดหมดไฟพร้อมกันโดยมิได้นัดหมาย" },
        weatherLeaderless: { en: "Nobody here is emotionally qualified to lead.", th: "ไม่มีใครในที่นี้ที่มีวุฒิภาวะทางอารมณ์พอจะนำทีมได้" },
        weatherRecovery:   { en: "Collectively? Terrible recovery instincts.", th: "โดยรวมน่ะเหรอ? สัญชาตญาณการพักฟื้นยอดแย่" },
        weatherStabilizer: { en: name => `${name} is currently stabilizing this entire ecosystem.`, th: name => `${name} กำลังเป็นผู้แบกรับและสร้างสมดุลให้ระบบนิเวศนี้` },

        // ─── Household Mood Forecast ───────────────────────
        forecastTitle:     { en: "Emotional Forecast",        th: "พยากรณ์อากาศทางใจ" },
        forecastTomorrow:  { en: "Tomorrow's Atmosphere",     th: "บรรยากาศในวันพรุ่งนี้" },
        forecastMomentum:  { en: "Household Momentum",        th: "แรงเหวี่ยงของบ้าน" },
        
        // Momentum States
        momEscalating:     { en: "Escalating",                th: "กำลังพุ่งสูง" },
        momStabilizing:    { en: "Stabilizing",               th: "กำลังคงที่" },
        momRecovering:     { en: "Recovering",                th: "กำลังพักฟื้น" },
        momFragile:        { en: "Emotionally Fragile",       th: "เปราะบางทางอารมณ์" },
        
        // Tomorrow States
        tmrLoudTitle:      { en: "Potentially Loud",          th: "อาจมีเสียงดัง" },
        tmrLoudDesc:       { en: "Accumulated stress suggests tomorrow may be emotionally noisy.", th: "ความเครียดสะสมบ่งบอกว่าพรุ่งนี้อาจจะมีเสียงดังทางอารมณ์" },
        tmrCalmTitle:      { en: "Recovery Energy",           th: "พลังงานแห่งการพักฟื้น" },
        tmrCalmDesc:       { en: "A shift toward quiet energy is expected. Low stimulation recommended.", th: "คาดว่าจะมีการเปลี่ยนไปสู่พลังงานที่เงียบสงบ แนะนำให้ลดสิ่งเร้า" },
        tmrChaosTitle:     { en: "Chaos Surge",               th: "ความวุ่นวายพุ่งพล่าน" },
        tmrChaosDesc:      { en: "Unpredictable energy patterns detected. Expect unnecessary side quests.", th: "ตรวจพบรูปแบบพลังงานที่คาดเดาไม่ได้ เตรียมรับมือกับเควสย่อยที่ไม่จำเป็น" },
        tmrBurnoutTitle:   { en: "Coordinated Burnout",       th: "หมดไฟพร้อมเพรียง" },
        tmrBurnoutDesc:    { en: "Critical battery levels across the board. Emotional maintenance required.", th: "ระดับแบตเตอรี่วิกฤตยกบ้าน จำเป็นต้องมีการบำรุงรักษาทางอารมณ์" },

        // Pressure Alerts
        alertAbsorbing:    { en: "One member is absorbing everyone else's stress.", th: "มีสมาชิกคนหนึ่งกำลังรับเอาความเครียดของทุกคนไปไว้ที่ตัวเอง" },
        alertAvoidance:    { en: "Conflict avoidance is becoming structural.", th: "การหลีกเลี่ยงความขัดแย้งกำลังกลายเป็นโครงสร้างของบ้าน" },
        alertLeaderless:   { en: "Nobody currently has the emotional qualifications to lead.", th: "ตอนนี้ยังไม่มีใครมีวุฒิภาวะทางอารมณ์พอจะนำทีมได้" },

        socialStatusAwaiting: { en: "Awaiting daily social data.", th: "กำลังรอข้อมูลโซเชียลประจำวัน" },
        socialStatusHiding: { en: "Collective isolation. Everyone is currently a ghost.", th: "โหมดสันโดษยกบ้าน ทุกคนกำลังทำตัวเป็นวิญญาณ" },
        socialStatusMismatch: { en: "Social mismatch. One person wants a party; another wants a bunker.", th: "ความต้องการโซเชียลไม่ตรงกัน คนหนึ่งอยากปาร์ตี้ อีกคนอยากเข้าถ้ำ" },
        socialStatusSpotlight: { en: "High visibility. The household is currently main character energy.", th: "ความโดดเด่นสูงมาก ทั้งบ้านกำลังแผ่พลังงานตัวเอก" },
        socialStatusBalanced: { en: "Balanced social rhythm. Low friction detected.", th: "จังหวะโซเชียลสมดุล ตรวจพบแรงเสียดทานต่ำ" },

        // ─── Emotional Timeline & Memory ───────────────────
        memoryTitle:       { en: "Emotional Memory",          th: "ความทรงจำทางอารมณ์" },
        memoryTimeline:    { en: "Household Timeline",        th: "ไทม์ไลน์ของบ้าน" },
        memoryEras:        { en: "Emotional Eras",            th: "ยุคสมัยทางอารมณ์" },
        
        // Era Names
        eraIsolation:      { en: "The Quiet Isolation Era",   th: "ยุคสมัยแห่งความสันโดษ" },
        eraChaos:          { en: "The Chaotic Coordination Arc", th: "ช่วงเวลาแห่งความวุ่นวายที่จัดระเบียบไม่ได้" },
        eraTired:          { en: "The Tired But Functional Phase", th: "ช่วงเวลาที่เหนื่อยแต่ยังไหว" },
        eraLoud:           { en: "The Emotionally Loud Era",  th: "ยุคสมัยแห่งอารมณ์เสียงดัง" },
        eraStable:         { en: "The Golden Stability Age",  th: "ยุคทองแห่งความมั่นคง" },

        // Turning Points
        tpStabilized:      { en: "The atmosphere stabilized after prolonged overload.", th: "บรรยากาศกลับมาคงที่หลังจากผ่านช่วงเวลาที่หนักหน่วง" },
        tpChaosSurge:      { en: "Volatility sharply increased after a calm streak.", th: "ความวุ่นวายพุ่งสูงขึ้นอย่างรวดเร็วหลังผ่านช่วงเวลาที่เงียบสงบ" },
        tpRecoveryEntry:   { en: "The household entered Recovery Mode.",     th: "คนทั้งบ้านเข้าสู่โหมดพักฟื้น" },

        // Memory Observations
        memNoRecharge:     { en: "Nobody emotionally recharged properly this week.", th: "สัปดาห์นี้ไม่มีใครได้ชาร์จพลังงานทางอารมณ์อย่างเต็มที่เลย" },
        memCollectivePeace: { en: "The household briefly achieved collective peace.", th: "คนทั้งบ้านเข้าสู่สภาวะสงบสุขร่วมกันในช่วงเวลาสั้นๆ" },
        memDualBurnout:    { en: "Two emotional stabilizers burned out simultaneously.", th: "ผู้แบกรับอารมณ์ของบ้านสองคนหมดไฟพร้อมกัน" },
        memLoudestDay:     { en: "This was the loudest day in recent household history.", th: "นี่คือวันที่เสียงดังที่สุดในประวัติศาสตร์บ้านเมื่อเร็วๆ นี้" },
        memSideQuestSpike: { en: "Collective focus lost to a surge of side quests.", th: "สมาธิของคนทั้งบ้านหลุดลอยไปกับเควสย่อยที่พุ่งเข้ามา" },

        // ─── Household Rituals & Ceremonies ────────────────
        ritualTitle:       { en: "Recommended Ritual",        th: "พิธีกรรมที่แนะนำ" },
        ritualIntro:       { en: "Symbolic actions to restore your household's emotional balance.", th: "กิจกรรมเชิงสัญลักษณ์เพื่อกู้คืนสมดุลทางอารมณ์ของบ้านคุณ" },
        
        // Ritual Cards
        ritSilentRot:      { en: "Silent Rotting Together",   th: "เน่าเปื่อยไปด้วยกันอย่างเงียบๆ" },
        ritSilentRotDesc:  { en: "Horizontal existence in the same room. No eye contact or verbal requirements.", 
                              th: "นอนราบไปกับพื้นในห้องเดียวกัน ไม่ต้องสบตาหรือพูดจาใดๆ" },
        ritParallelPlay:   { en: "Parallel Play",             th: "เล่นขนาน" },
        ritParallelPlayDesc: { en: "Everyone does their own separate weird thing in close physical proximity.", 
                               th: "ต่างคนต่างทำเรื่องแปลกๆ ของตัวเองในระยะที่มองเห็นกันได้" },
        ritCornerDisappear: { en: "The 90-Minute Disappearance", th: "การหายตัว 90 นาที" },
        ritCornerDisappearDesc: { en: "Everyone retreats to separate corners. Total social blackout.", 
                                   th: "ทุกคนแยกย้ายเข้ามุมของตัวเอง ตัดการเชื่อมต่อทางสังคมโดยสมบูรณ์" },
        ritSharedFood:     { en: "The Silent Feast",          th: "งานเลี้ยงที่เงียบงัน" },
        ritSharedFoodDesc: { en: "Shared food with zero conversation. Focus entirely on the textures.", 
                              th: "กินข้าวด้วยกันโดยไม่พูดสักคำ จดจ่ออยู่กับรสสัมผัสเท่านั้น" },
        
        // Ceremonies
        cerDetox:          { en: "Digital Detox Arc",         th: "ช่วงเวลาดีท็อกซ์ดิจิทัล" },
        cerBlanket:        { en: "Collective Blanket Burrito", th: "โหมดห่อผ้าห่มยกบ้าน" },
        cerTuna:           { en: "Emergency Tuna Feast",      th: "งานฉลองทูน่าฉุกเฉิน" },
        cerQuiet:          { en: "The Hour of Great Silence",  th: "หนึ่งชั่วโมงแห่งความเงียบสงัด" },
        
        // Recovery Archetypes
        archCave:          { en: "The Cave Recovery Household", th: "บ้านสายฟื้นฟูในถ้ำ" },
        archLoud:          { en: "The Loud Recovery Household", th: "บ้านสายฟื้นฟูด้วยเสียง" },
        archSnack:         { en: "The Snack-Based Healing Household", th: "บ้านสายเยียวยาด้วยของกิน" },
        archChaos:         { en: "The Emotional Support Chaos Household", th: "บ้านสายวุ่นวายค้ำจุนใจ" },

        // Post-Chaos Repair
        repairInWalls:     { en: "Conflict energy remains in the walls.", th: "มวลความขัดแย้งยังคงวนเวียนอยู่ในบ้าน" },
        repairSlower:      { en: "Atmosphere recovering slower than expected.", th: "บรรยากาศฟื้นตัวช้ากว่าที่คิด" },
        repairInterrupted: { en: "Recovery interrupted by fresh emotional improvisation.", th: "การพักฟื้นถูกขัดจังหวะด้วยการด้นสดทางอารมณ์ครั้งใหม่" },

        // ─── Household Goal Milestones & Lore ──────────────
        loreTitle:         { en: "Household Lore",            th: "ตำนานประจำบ้าน" },
        loreIntro:         { en: "Symbolic landmarks and shared history of your emotional journey.", th: "หมุดหมายสำคัญและประวัติศาสตร์ร่วมกันในการเดินทางทางอารมณ์ของบ้านคุณ" },
        
        // Milestone Types
        msStableWeek:      { en: "The First Stable Week Achieved", th: "ความมั่นคงสัปดาห์แรกสำเร็จ" },
        msNoCollapse:      { en: "7 Days Without Collective Collapse", th: "7 วันที่ไร้ซึ่งการระเบิดยกบ้าน" },
        msFunctionalOS:    { en: "Collective Nervous System Functional", th: "ระบบประสาทส่วนกลางของบ้านทำงานปกติ" },
        msEraSurvivor:     { en: "Loud Era Survivor",          th: "ผู้รอดชีวิตจากยุคอารมณ์เสียงดัง" },

        // Lore Archive Entries
        loreBlanketBurrito: { en: "The Great Blanket Burrito Recovery", th: "ตำนานการกู้คืนด้วยห่อผ้าห่มครั้งใหญ่" },
        loreNoSpeech:       { en: "The Week Nobody Spoke Properly", th: "สัปดาห์ที่ไม่มีใครพูดเป็นภาษามนุษย์" },
        loreSideQuest:      { en: "The Side Quest Escalation Event", th: "เหตุการณ์เควสย่อยพุ่งพล่าน" },
        loreGoldenWindow:   { en: "The Golden Stability Window",  th: "ช่วงเวลาทองแห่งความสงบสุข" },

        // Achievement / Recognition
        achStabilizer:     { en: name => `${name} buffered emotional instability for a significant period.`, 
                              th: name => `${name} ได้แบกรับความไม่คงที่ทางอารมณ์มาอย่างยาวนาน` },
        achRotatingLead:   { en: "Emotional leadership rotated successfully.", th: "การผลัดกันนำทางอารมณ์เป็นไปอย่างราบรื่น" },
        achDuoPermanent:   { en: "Strategic Alliance became structurally permanent.", th: "พันธมิตรทางยุทธศาสตร์กลายเป็นโครงสร้างถาวรของบ้าน" },
        
        // Era Completion
        eraEndLoud:        { en: "The Emotionally Loud Era officially ended.", th: "ยุคสมัยแห่งอารมณ์เสียงดังได้จบลงอย่างเป็นทางการ" },
        eraRecoveryArc:    { en: "Recovery Arc achieved.",        th: "บรรลุเป้าหมายช่วงการพักฟื้น" },
        eraExitedBunker:   { en: "The household exited bunker mode.", th: "คนทั้งบ้านออกจากโหมดหลบภัยแล้ว" },

        // ─── Household Seasons & Arcs ──────────────────────
        seasonTitle:       { en: "Current Season",            th: "ฤดูกาลปัจจุบัน" },
        seasonIntro:       { en: "The narrative arc of your household's emotional evolution.", th: "เรื่องราวการวิวัฒนาการทางอารมณ์ของบ้านคุณ" },
        
        // Seasonal Archetypes
        seaQuietRebuilding: { en: "The Quiet Rebuilding Season", th: "ฤดูกาลแห่งการสร้างใหม่ที่เงียบสงบ" },
        seaLoudSaga:       { en: "The Emotionally Loud Saga",  th: "มหากาพย์แห่งอารมณ์เสียงดัง" },
        seaSoftRecovery:   { en: "The Soft Recovery Arc",      th: "ช่วงเวลาแห่งการพักฟื้นที่นุ่มนวล" },
        seaParallelPlay:   { en: "The Parallel Play Era",      th: "ยุคสมัยแห่งการเล่นขนาน" },
        seaOverstimulated: { en: "The Great Overstimulation Chapter", th: "บทแห่งการถูกกระตุ้นครั้งยิ่งใหญ่" },
        seaFunctionalHaunted: { en: "The Functional But Haunted Phase", th: "ช่วงเวลาที่ยังไหวแต่ใจสลาย" },
        seaAccidentalHealing: { en: "The Accidental Healing Timeline", th: "ไทม์ไลน์แห่งการเยียวยาโดยบังเอิญ" },

        // Evolution Arcs
        arcStabilizing:    { en: "This household is slowly stabilizing.", th: "บ้านหลังนี้กำลังค่อยๆ มั่นคงขึ้น" },
        arcSurvivalToRecovery: { en: "Transitioning from survival mode into recovery.", th: "กำลังเปลี่ยนผ่านจากโหมดเอาตัวรอดสู่การพักฟื้น" },
        arcVolatilitySoftening: { en: "Emotional volatility has softened into avoidant peace.", th: "ความผันผวนทางอารมณ์เริ่มเบาบางลงสู่ความสงบแบบเลี่ยงปะทะ" },
        arcNervousSystemCalm: { en: "Collective nervous systems are no longer permanently on fire.", th: "ระบบประสาทส่วนกลางของบ้านไม่ได้ลุกเป็นไฟตลอดเวลาอีกต่อไป" },

        // Drift Observations
        driftQuieter:      { en: "The household has become quieter lately.", th: "ช่วงนี้บ้านเงียบลงอย่างเห็นได้ชัด" },
        driftImproving:    { en: "Energy output remains high, but emotional recovery is improving.", th: "ยังใช้พลังงานสูงอยู่ แต่การฟื้นตัวทางอารมณ์เริ่มดีขึ้น" },
        driftBuffering:    { en: "Everyone is technically functional but spiritually buffering.", th: "ทุกคนยังทำงานได้ตามปกติ แต่จิตใจกำลังโหลดข้อมูลอยู่" },

        // Identity Cards
        idResurrection:    { en: "Slow Resurrection",         th: "การฟื้นคืนชีพที่เชื่องช้า" },
        idCoordinatedDelusion: { en: "Coordinated Delusion",    th: "ความเข้าใจผิดที่พร้อมเพรียง" },
        idSideways:        { en: "Functional But Emotionally Sideways", th: "ยังไหวแต่ใจออกอาการเฉียง" },

        // ─── Household Museum & Relics ────────────────────
        museumTitle:       { en: "The Household Museum",      th: "พิพิธภัณฑ์ประจำบ้าน" },
        museumIntro:       { en: "A collection of symbolic artifacts from your shared emotional history.", th: "คลังสะสมวัตถุเชิงสัญลักษณ์จากประวัติศาสตร์ทางอารมณ์ร่วมกันของคุณ" },
        relicShelf:        { en: "Artifact Shelf",            th: "หิ้งวัตถุโบราณ" },
        trophyRoom:        { en: "Trophy Room",               th: "ห้องเก็บถ้วยรางวัล" },
        
        // Relic Archetypes
        relBlanket:        { en: "Blanket of Emotional Reconstruction", th: "ผ้าห่มแห่งการประกอบสร้างทางอารมณ์" },
        relMug:            { en: "Mug of Collective Survival", th: "แก้วกาแฟแห่งการอยู่รอดร่วมกัน" },
        relCouch:          { en: "Couch of Silent Parallel Play", th: "โซฟาแห่งการเล่นขนานที่เงียบงัน" },
        relHeadphones:     { en: "Sacred Noise-Canceling Headphones", th: "หูฟังตัดเสียงรบกวนอันศักดิ์สิทธิ์" },
        relBeanbag:        { en: "The Rotting Together Beanbag", th: "บีนแบคแห่งการเน่าเปื่อยไปด้วยกัน" },
        relTuna:           { en: "Emergency Tuna Artifact",   th: "วัตถุโบราณทูน่าฉุกเฉิน" },
        relReceipt:        { en: "Ancient DoorDash Receipt",  th: "ใบเสร็จ DoorDash ยุคโบราณ" },
        
        // Relationship Relics
        relSharedDoc:      { en: "Shared Google Doc of Panic", th: "Google Doc แห่งความตระหนกที่ใช้ร่วมกัน" },
        relTreaty:         { en: "Treaty of Blanket Distribution", th: "สนธิสัญญาการจัดสรรผ้าห่ม" },
        relSnackBasket:    { en: "Passive-Aggressive Snack Basket", th: "ตะกร้าขนมแนวประชดประชัน" },
        
        // Recovery Trophies
        troCalmWeekend:    { en: "The First Calm Weekend",     th: "รางวัลวันหยุดที่สุดแสนจะสงบครั้งแรก" },
        troNervousReboot:  { en: "Nervous System Reboot",     th: "การรีบูตระบบประสาทครั้งใหญ่" },
        troEveryoneNap:    { en: "The Collective Nap Trophy",  th: "ถ้วยรางวัลแห่งการงีบหลับพร้อมเพรียง" },
        
        // Myth Lines
        mythSnackHealing:  { en: "This household heals primarily through snacks and mutual silence.", th: "บ้านหลังนี้เยียวยาจิตใจผ่านขนมและความเงียบงันร่วมกันเป็นหลัก" },
        mythBlanketIncident: { en: "Peace negotiations began after the Great Blanket Incident.", th: "การเจรจาสันติภาพเริ่มต้นขึ้นหลังจากเหตุการณ์ผ้าห่มครั้งใหญ่" },
        mythChaosAlliance: { en: "Two members entered a temporary alliance against overstimulation.", th: "สมาชิกสองคนทำพันธมิตรชั่วคราวเพื่อต่อต้านการถูกกระตุ้นที่มากเกินไป" },

        // ─── Household Canon & Worldbuilding ─────────────
        canonTitle:        { en: "Household Canon",           th: "กฎเหล็กประจำบ้าน" },
        canonIntro:        { en: "Established truths and persistent mythology of this emotional ecosystem.", th: "ความจริงที่ประจักษ์ชัดและตำนานที่สืบทอดกันมาของระบบนิเวศทางอารมณ์นี้" },
        
        // Canon Truths
        canParallel:       { en: "This household communicates primarily through parallel existence.", th: "บ้านหลังนี้สื่อสารกันผ่านการมีอยู่แบบขนานเป็นหลัก" },
        canNoRest:         { en: "Nobody here rests correctly. It's canon.", th: "ไม่มีใครที่นี่พักผ่อนเป็นเรื่องเป็นราว เป็นที่รู้กันดี" },
        canSnackInfra:     { en: "Snacks are currently functioning as emotional infrastructure.", th: "ขนมขบเคี้ยวทำหน้าที่เป็นโครงสร้างพื้นฐานทางอารมณ์ในขณะนี้" },
        canAvoidance:      { en: "Avoidance remains a legally recognized coping strategy here.", th: "การหลีกเลี่ยงยังคงเป็นกลยุทธ์การรับมือที่ได้รับการยอมรับตามกฎหมายของบ้าน" },

        // Legendary Events
        evBlanketRedist:   { en: "The Great Blanket Redistribution", th: "เหตุการณ์การจัดสรรผ้าห่มครั้งมโหฬาร" },
        evNoSocial:        { en: "The Week Nobody Socialized Correctly", th: "สัปดาห์ที่ไม่มีใครเข้าสังคมได้อย่างปกติ" },
        evRottingMarathon: { en: "The Emergency Rotting Marathon", th: "การมาราธอนเน่าเปื่อยฉุกเฉิน" },
        evLoudWeekend:     { en: "The Infamous Loud Weekend",     th: "เหตุการณ์วันหยุดอารมณ์เสียงดังอันเลื่องชื่อ" },

        // Internal Culture
        cultConflictTitle: { en: "Conflict Culture",          th: "วัฒนธรรมการปะทะ" },
        cultConflictDesc:  { en: "Passive-aggressive silence mixed with emotional support snacks.", th: "ความเงียบแบบประชดประชันผสมกับขนมค้ำจุนใจ" },
        cultRecoveryTitle: { en: "Recovery Culture",          th: "วัฒนธรรมการพักฟื้น" },
        cultRecoveryDesc:  { en: "Everyone disappears independently and returns emotionally rehydrated.", th: "ทุกคนหายตัวไปอย่างเป็นอิสระและกลับมาพร้อมใจที่อิ่มฟู" },
        cultSocialTitle:   { en: "Social Culture",            th: "วัฒนธรรมโซเชียล" },
        cultSocialDesc:    { en: "Simultaneous togetherness without direct interaction.", th: "ความใกล้ชิดที่เกิดขึ้นพร้อมกันโดยไม่มีการปฏิสัมพันธ์โดยตรง" },

        // Relationship Legends
        legAlliance:       { en: "The Strategic Duo specializes in mutual overstimulation.", th: "คู่หูสายยุทธศาสตร์เชี่ยวชาญการกระตุ้นอารมณ์ซึ่งกันและกัน" },
        legChaosDoc:       { en: "One creates the chaos. The other documents it emotionally.", th: "คนหนึ่งสร้างความวุ่นวาย อีกคนบันทึกมันไว้ในใจ" },

        // ─── Relic Forging & Canon Binding ────────────────
        forgeAction:       { en: "Forge this Relic",          th: "ตีตราวัตถุโบราณนี้" },
        forgeIntro:        { en: "Give this artifact a name and dedicate it to a legendary event.", th: "ตั้งชื่อให้วัตถุนี้และอุทิศให้กับเหตุการณ์ในตำนาน" },
        forgeNameLabel:    { en: "Artifact Name",             th: "ชื่อวัตถุโบราณ" },
        forgeEventLabel:   { en: "Dedicate to Event",         th: "อุทิศให้แก่เหตุการณ์" },
        forgeSubmit:       { en: "Bind to Canon",             th: "บันทึกเข้าสู่กฎเหล็ก" },
        
        relSpoon:          { en: "Emotional Support Spoon",   th: "ช้อนประคองใจ" },
        relHoodie:         { en: "Sacred Rotting Hoodie",     th: "ฮู้ดดี้เน่าศักดิ์สิทธิ์" },
        relSoup:           { en: "Soup of Collective Survival", th: "ซุปแห่งการอยู่รอดร่วมกัน" },
        relCharger:        { en: "The Last Functional Charger", th: "สายชาร์จสุดท้ายที่ยังใช้ได้" },

        // Relic Evolution & Residue
        relEvolvedPrefix:  { en: "The Ancient",               th: "ตำนาน" },
        relEvolvedSuffix:  { en: "of Functional Adulthood",   th: "แห่งวุฒิภาวะที่สมบูรณ์" },
        
        auraRecovery:      { en: "Recovery Aura",             th: "ออร่าแห่งการพักฟื้น" },
        auraChaos:         { en: "Chaos Residue",             th: "เศษเสี้ยวความวุ่นวาย" },
        auraSurvival:      { en: "Survival Radiation",        th: "รังสีการเอาชีวิตรอด" },
        auraStability:     { en: "Soft Stability",            th: "ความมั่นคงที่นุ่มนวล" },
        
        reputeFeared:      { en: "feared",                    th: "เป็นที่ยำเกรง" },
        reputeTrusted:      { en: "trusted",                   th: "ที่ไว้วางใจได้" },
        reputeUnstable:    { en: "emotionally unstable",      th: "อารมณ์ไม่คงที่" },
        reputeProtective:  { en: "protective",                 th: "คอยปกป้อง" },
        reputeHaunted:     { en: "slightly haunted",          th: "มีพลังงานบางอย่างซ่อนอยู่" },

        // Keepsakes
        keepMutualAvoid:   { en: "Treaty of Mutual Avoidance", th: "สนธิสัญญาการเลี่ยงหน้ากัน" },
        keepOverstimCert:  { en: "Certificate of Overstimulation", th: "ใบประกาศเกียรติคุณการถูกกระตุ้นเกินเหตุ" },
        keepSupportPact:   { en: "The Silent Support Pact",   th: "พันธสัญญาแห่งการซัพพอร์ตเงียบๆ" },

        // Mythology Continuity
        mythRelicReappeared: { en: relic => `The ${relic} has reappeared during another Heavy Era.`, th: relic => `${relic} ได้ปรากฏขึ้นอีกครั้งในช่วงยุคสมัยที่หนักหน่วง` },
        mythBelievedToContain: { en: relic => `Believed to contain traces of survival iced coffee.`, th: relic => `เชื่อกันว่ามีร่องรอยของกาแฟดำแห่งการเอาชีวิตรอดซ่อนอยู่` },
        mythCanonObject:   { en: relic => `This relic was recovered during a historical turning point.`, th: relic => `วัตถุนี้ถูกกู้คืนมาได้ในช่วงหัวเลี้ยวหัวต่อของประวัติศาสตร์` },

        // ─── Relic Synthesis & Fusion ─────────────────────
        synthesisTitle:    { en: "Emotional Synthesis",       th: "การสังเคราะห์ทางอารมณ์" },
        synthesisIntro:    { en: "Combine two artifacts to forge a new symbol of collective survival.", th: "รวมวัตถุสองชิ้นเข้าด้วยกันเพื่อสร้างสัญลักษณ์ใหม่ของการอยู่รอดร่วมกัน" },
        synthesisAction:   { en: "Fuse Artifacts",            th: "หลอมรวมวัตถุ" },
        synthesisChoose:   { en: "Select two items to synthesize.", th: "เลือกวัตถุสองชิ้นเพื่อสังเคราะห์" },
        
        // Fusion Artifacts
        fusHoodieCollapse: { en: "Hoodie of Functional Collapse", th: "ฮู้ดดี้แห่งการล่มสลายที่ยังทำงานได้" },
        fusRecoveryNest:   { en: "The Recovery Nest Core",    th: "แกนกลางรังแห่งการพักฟื้น" },
        fusParallelStation: { en: "The Parallel Play Station", th: "สถานีแห่งการเล่นขนาน" },
        fusSilenceDevice:  { en: "Shared Silence Device",     th: "อุปกรณ์แห่งความเงียบงันร่วมกัน" },
        fusDiplomacyMug:   { en: "The Diplomacy Mug",         th: "แก้วกาแฟแห่งการทูต" },
        fusSupportInventory: { en: "Emotional Support Inventory", th: "คลังแสงประคองใจ" },
        fusRottingTreaty:  { en: "Treaty of Simultaneous Rotting", th: "สนธิสัญญาการเน่าเปื่อยพร้อมเพรียง" },
        fusTreatyEngine:   { en: "The Treaty Engine",         th: "เครื่องยนต์แห่งสนธิสัญญา" },
        fusSupportBunker:  { en: "The Emotional Support Bunker", th: "บังเกอร์ประคองใจ" },
        fusCoregulationCouch: { en: "The Co-Regulation Couch",   th: "โซฟาแห่งการปรับจูนอารมณ์" },
        fusDiplomacyCouch: { en: "The Couch of Emotional Diplomacy", th: "โซฟาแห่งการทูตทางอารมณ์" },

        // Legendary Fusion Objects
        fusThrone:         { en: "The Nervous System Throne", th: "บัลลังก์แห่งระบบประสาท" },
        fusSoupEngine:     { en: "The Ancient Soup Engine",   th: "เครื่องยนต์ซุปโบราณ" },
        fusBlanketSingularity: { en: "The Blanket Singularity", th: "เอกภาวะแห่งผ้าห่ม" },

        // Fusion Descriptions
        fusDescHybrid:     { en: (repA, repB) => `A ${repA} yet ${repB} artifact.`, th: (repA, repB) => `วัตถุที่${repA}แต่${repB}` },
        fusDescMyth:       { en: "Forged during simultaneous nervous-system failure.", th: "ถูกสร้างขึ้นในช่วงที่ระบบประสาทล้มเหลวพร้อมกัน" },
        fusDescResidue:    { en: "Contains traces of survival ramen and emotional buffering.", th: "ประกอบด้วยร่องรอยของราเม็งแห่งการอยู่รอดและการแบกรับอารมณ์" },

        // ─── Relic Echoes & Living Museum ────────────────
        echoTitle:         { en: "Museum Echoes",             th: "เสียงสะท้อนจากพิพิธภัณฑ์" },
        echoIntro:         { en: "Ambient observations from your collection of emotional artifacts.", th: "การสังเกตการณ์รอบข้างจากคลังสะสมวัตถุทางอารมณ์ของคุณ" },
        
        // Relic Echoes
        echoBlanketLoud:   { en: "The Ancient Blanket of Survival refuses to remain near the Loud Relics.", th: "ผ้าห่มแห่งการอยู่รอดในตำนานปฏิเสธที่จะอยู่ใกล้กับวัตถุที่เสียงดัง" },
        echoChargerExhaust: { en: "The Last Functional Charger appears emotionally exhausted.", th: "สายชาร์จสุดท้ายที่ยังใช้ได้ดูเหมือนจะหมดแรงทางอารมณ์" },
        echoTreatyHumming: { en: "The Treaty Engine has started humming again.", th: "เครื่องยนต์แห่งสนธิสัญญาเริ่มส่งเสียงครางฮืออีกครั้ง" },
        echoHoodieCursed:  { en: "The Sacred Rotting Hoodie is reportedly still cursed.", th: "มีรายงานว่าฮู้ดดี้เน่าศักดิ์สิทธิ์ยังคงติดคำสาปอยู่" },
        echoReceiptCollapse: { en: "The Ancient DoorDash Receipt has resurfaced during another collective collapse.", th: "ใบเสร็จ DoorDash ยุคโบราณโผล่ขึ้นมาอีกครั้งในช่วงที่ทุกคนล่มสลายพร้อมกัน" },
        echoSyncFields:    { en: "The Parallel Play Station and Shared Silence Device have synchronized their recovery fields.", th: "สถานีแห่งการเล่นขนานและอุปกรณ์ความเงียบร่วมกันได้ปรับจูนสนามพลังการพักฟื้นให้ตรงกันแล้ว" },
        echoChargerPower:  { en: "The Last Functional Charger is providing power to the Fusion Artifacts.", th: "สายชาร์จสุดท้ายที่ยังใช้ได้กำลังจ่ายไฟให้กับวัตถุหลอมรวม" },
        echoBlanketRequest: { en: "Collective nervous system requesting blanket deployment.", th: "ระบบประสาทส่วนกลางของบ้านกำลังร้องขอการติดตั้งผ้าห่มพร้อมกัน" },
        echoBunkerReinforce: { en: "Bunker architecture currently reinforced by collective silence.", th: "โครงสร้างบังเกอร์กำลังถูกเสริมความแข็งแกร่งด้วยความเงียบงันร่วมกัน" },
        
        // Shelf Conversations
        convSustained:     { en: "Together, they have sustained multiple recovery cycles.", th: "เมื่ออยู่ด้วยกัน พวกเขาได้ค้ำจุนวงจรการพักฟื้นมาหลายต่อหลายครั้ง" },
        convStabilized:    { en: "Historically associated with simultaneous nervous-system stabilization.", th: "ในทางประวัติศาสตร์ มีความเกี่ยวข้องกับการรักษาระบบประสาทให้คงที่พร้อมๆ กัน" },
        convDiplomatic:    { en: "The Treaty Engine and Shared Silence Device have entered another diplomatic cycle.", th: "เครื่องยนต์แห่งสนธิสัญญาและอุปกรณ์ความเงียบร่วมกันได้เข้าสู่รอบการทูตอีกครั้ง" },
        
        // Recurring Motifs
        motifBlanket:      { en: "This household repeatedly turns stress into blanket-based solutions.", th: "บ้านหลังนี้เปลี่ยนความเครียดให้เป็นทางออกด้วยผ้าห่มซ้ำแล้วซ้ำเล่า" },
        motifSoup:         { en: "Recovery rituals appear soup-adjacent.", th: "พิธีกรรมการพักฟื้นดูเหมือนจะเกี่ยวข้องกับซุป" },
        motifAvoidance:    { en: "Avoidance has become architectural.", th: "การหลีกเลี่ยงได้กลายเป็นส่วนหนึ่งของโครงสร้างไปแล้ว" },

        // ─── Relic Apparitions & Hauntings ───────────────
        appTitle:          { en: "Relic Apparition",          th: "นิมิตวัตถุโบราณ" },
        appResurfaced:     { en: r => `The ${r} has reportedly resurfaced.`, th: r => `${r} มีรายงานว่าได้โผล่ขึ้นมาอีกครั้ง` },
        appHumming:        { en: r => `The ${r} has started humming again.`, th: r => `${r} เริ่มส่งเสียงครางฮืออีกครั้ง` },
        appOmenUnstable:   { en: r => `Atmospheric Signal: The ${r} appears unstable.`, th: r => `สัญญาณบรรยากาศ: ${r} ดูเหมือนจะไม่คงที่` },
        appOmenKitchen:    { en: r => `Forecast Update: The ${r} has entered the kitchen again.`, th: r => `อัปเดตคำพยากรณ์: ${r} เข้าสู่ห้องครัวอีกครั้งแล้ว` },
        
        hauntSoupEngine:   { en: "The Ancient Soup Engine is reportedly overworking itself again.", th: "เครื่องยนต์ซุปโบราณมีรายงานว่ากำลังทำงานหนักเกินไปอีกแล้ว" },
        hauntSilenceDevice: { en: "The Shared Silence Device has activated.", th: "อุปกรณ์ความเงียบร่วมกันได้เริ่มทำงานแล้ว" },
        hauntBlanketSing:  { en: "Authorities are monitoring the Blanket Singularity.", th: "เจ้าหน้าที่กำลังเฝ้าระวังเอกภาวะแห่งผ้าห่ม" },
        
        posBlanketCiv:     { en: "The house has entered Blanket Civilization mode.", th: "บ้านได้เข้าสู่โหมดอารยธรรมผ้าห่มแล้ว" },
        posSoupProtocols:  { en: "Soup-adjacent recovery protocols detected.", th: "ตรวจพบโปรโตคอลการพักฟื้นที่เกี่ยวข้องกับซุป" },
        posSpiritClaimed:  { en: "Multiple members appear spiritually claimed by the Co-Regulation Couch.", th: "สมาชิกหลายคนดูเหมือนจะถูกโซฟาแห่งการปรับจูนอารมณ์ดึงดูดวิญญาณไป" },

        // ─── Household Thought Cabinet ────────────────────
        thoughtTitle:      { en: "Thought Cabinet",           th: "ตู้เก็บความคิด" },
        thoughtIntro:      { en: "Passive emotional philosophies developed by the collective subconscious.", th: "ปรัชญาทางอารมณ์ที่พัฒนาขึ้นโดยจิตใต้สำนึกของคนทั้งบ้าน" },
        
        thoughtDiscovered: { en: "DISCOVERED",                th: "ค้นพบแล้ว" },
        thoughtProcessing: { en: "PROCESSING",                th: "กำลังประมวลผล" },
        thoughtInternalized: { en: "INTERNALIZED",            th: "ซึมซับแล้ว" },

        // Thought Keys
        thBlanketGov:      { en: "Blanket-Based Governance",  th: "ระบอบการปกครองด้วยผ้าห่ม" },
        thAvoidanceArch:   { en: "Avoidance Is Architecture", th: "การหลีกเลี่ยงคือสถาปัตยกรรม" },
        thSoupLabor:       { en: "Soup Counts As Labor",      th: "ซุปนับเป็นแรงงานทางอารมณ์" },
        thParallelIntimacy: { en: "Parallel Play Is Intimacy", th: "การเล่นขนานคือความใกล้ชิด" },
        thQuietBuffer:     { en: "Universal Buffering",       th: "การโหลดข้อมูลสากล" },
        thHorizontalCiv:   { en: "Horizontal Civilization",   th: "อารยธรรมแนวราบ" },
        thFunctionalMeltdown: { en: "Functional Meltdown Theory", th: "ทฤษฎีการล่มสลายที่ยังทำงานได้" },
        thHauntedStable:   { en: "Emotionally Haunted, Technically Stable", th: "ใจสลายแต่กายยังนิ่ง" },

        // Ideologies
        ideoBlanketColl:   { en: "Blanket Collectivism",      th: "ลัทธิรวมกลุ่มใต้ผ้าห่ม" },
        ideoParallelCiv:   { en: "Parallel Play Civilization", th: "อารยธรรมการเล่นขนาน" },

        // Commentary
        commTheoryRelevant: { en: "Functional Meltdown Theory remains relevant.", th: "ทฤษฎีการล่มสลายที่ยังทำงานได้ยังคงใช้ได้จริง" },
        commCivNormal:     { en: "Parallel Play Civilization considers this normal.", th: "อารยธรรมการเล่นขนานถือว่าสิ่งนี้เป็นเรื่องปกติ" },
        commHorizontal:    { en: "The house continues to worship horizontal surfaces.", th: "บ้านหลังนี้ยังคงบูชาพื้นผิวแนวราบต่อไป" },

        // ─── Household Possession Arcs ───────────────────
        arcPossessionTitle: { en: "Possession Arc",           th: "ช่วงเวลาต้องมนตร์" },
        
        // Blanket Civilization
        arcBlanketTitle:   { en: "Blanket Civilization",      th: "อารยธรรมผ้าห่ม" },
        arcBlanketDay1:    { en: "The Blanket Singularity has resurfaced.", th: "เอกภาวะแห่งผ้าห่มได้โผล่ขึ้นมาอีกครั้ง" },
        arcBlanketDay2:    { en: "Blanket governance is now culturally binding. No major decisions should be made upright.", th: "ระบอบผ้าห่มมีผลผูกพันทางวัฒนธรรมแล้ว ไม่ควรตัดสินใจเรื่องใหญ่ในแนวตั้ง" },
        arcBlanketDay3:    { en: "The household may never emotionally stand again. The atmosphere is spiritually horizontal.", th: "คนทั้งบ้านอาจไม่กลับมายืนหยัดทางอารมณ์ได้อีก บรรยากาศกลายเป็นแนวราบอย่างสมบูรณ์" },
        
        // Loud Saga
        arcLoudTitle:      { en: "The Loud Saga",             th: "มหากาพย์เสียงดัง" },
        arcLoudDay1:       { en: "The house has become emotionally loud. Everything feels slightly flammable.", th: "บ้านเริ่มส่งเสียงดังทางอารมณ์ ทุกอย่างดูเหมือนจะติดไฟได้ง่าย" },
        arcLoudDay2:       { en: "The Treaty Engine is overheating. High-frequency chaos detected.", th: "เครื่องยนต์แห่งสนธิสัญญาร้อนจัด ตรวจพบความวุ่นวายความถี่สูง" },
        arcLoudDay3:       { en: "Survival instincts have replaced standard domestic logic.", th: "สัญชาตญาณการเอาตัวรอดได้เข้ามาแทนที่ตรรกะในบ้านแบบปกติ" },
        
        // Parallel Play
        arcParallelTitle:  { en: "Parallel Play Doctrine",    th: "ลัทธิการเล่นขนาน" },
        arcParallelDay1:   { en: "Parallel presence is currently considered intimacy.", th: "การมีอยู่แบบขนานถูกนับเป็นความใกล้ชิดในขณะนี้" },
        arcParallelDay2:   { en: "Nobody is speaking. Morale remains acceptable.", th: "ไม่มีใครพูดจา ขวัญและกำลังใจยังอยู่ในระดับที่รับได้" },
        arcParallelDay3:   { en: "The silence has become structural. Deep co-regulation achieved.", th: "ความเงียบกลายเป็นโครงสร้างของบ้าน การปรับจูนอารมณ์ระดับลึกสำเร็จลุล่วง" },

        // Fallout
        arcFalloutBlanket: { en: "Blanket Civilization has officially receded. Horizontal memories remain.", th: "อารยธรรมผ้าห่มถอยร่นไปอย่างเป็นทางการ เหลือไว้เพียงความทรงจำแนวราบ" },
        arcFalloutLoud:    { en: "The household survived the Loud Saga. Ears are still ringing emotionally.", th: "คนทั้งบ้านรอดพ้นมหากาพย์เสียงดังมาได้ แต่หูยังคงแว่วเสียงอารมณ์อยู่" },
        arcFalloutParallel: { en: "The silence lifts. The house feels strangely crowded with words.", th: "ความเงียบจางไป บ้านดูเหมือนจะแออัดไปด้วยคำพูดอย่างประหลาด" },

        // ─── Household Chronicles ────────────────────────
        chronicleTitle:    { en: "Household Chronicle",       th: "พงศาวดารประจำบ้าน" },
        chronicleIntro:    { en: "A literary record of your household's emotional evolution and shared mythology.", th: "บันทึกเรื่องราวการวิวัฒนาการทางอารมณ์และตำนานร่วมกันของบ้านคุณ" },
        chronicleExport:   { en: "Export Chronicle",          th: "ส่งออกพงศาวดาร" },
        chronicleArchive:  { en: "Chronicle Archive",         th: "คลังพงศาวดาร" },
        chroniclePublicLink: { en: "Generate Public Link",     th: "สร้างลิงก์สาธารณะ" },
        chronicleStartOwn: { en: "Start your own Emotional OS →", th: "เริ่มระบบปฏิบัติการทางอารมณ์ของคุณเอง →" },
        chronicleSharedBy: { en: "A record from an emotionally haunted household.", th: "บันทึกจากบ้านที่มีพลังงานทางอารมณ์บางอย่างสถิตอยู่" },
        
        // Report Types
        repCivSummary:     { en: "Civilization Report",       th: "รายงานอารยธรรม" },
        repRelicPoster:    { en: "Artifact Poster",           th: "โปสเตอร์วัตถุโบราณ" },
        repSeasonRecap:    { en: "Seasonal Recap",            th: "สรุปฤดูกาล" },
        repFinale:         { en: "Season Finale",             th: "บทสรุปส่งท้าย" },

        // Civilization Attributes
        civDoctrine:       { en: "Dominant Doctrine",         th: "ลัทธิหลัก" },
        civStabilizers:    { en: "Emotional Stabilizers",     th: "ผู้ประคองอารมณ์" },
        civInfrastructure: { en: "Emotional Infrastructure",   th: "โครงสร้างพื้นฐานทางใจ" },
        civSurvivalKey:    { en: "Survived Primarily Through", th: "อยู่รอดมาได้ด้วย" },

        // Poster Metadata
        posStatus:         { en: "Artifact Status",           th: "สถานะวัตถุ" },
        posKnownFor:       { en: "Known For",                 th: "ขึ้นชื่อในเรื่อง" },
        posAura:           { en: "Radiated Aura",             th: "ออร่าที่แผ่ออกมา" },
        posHistory:        { en: "Historical Significance",   th: "ความสำคัญทางประวัติศาสตร์" },

        // Finale Lines
        finSurvived:       { en: "The household survived.",   th: "บ้านหลังนี้รอดชีวิตมาได้" },
        finNoRecovery:     { en: "Nobody fully recovered. Memories remain.", th: "ไม่มีใครฟื้นตัวได้เต็มร้อย แต่ความทรงจำยังคงอยู่" },
        finCanon:          { en: "This era has become canon.", th: "ยุคสมัยนี้ได้กลายเป็นส่วนหนึ่งของประวัติศาสตร์" },

        // ─── Household Federation ───────────────────────
        fedTitle:          { en: "Household Federation",      th: "สหพันธรัฐประจำบ้าน" },
        fedIntro:          { en: "Form alliances and establish emotional diplomacy with neighboring civilizations.", th: "สร้างพันธมิตรและสถาปนาการทูตทางอารมณ์กับอารยธรรมข้างเคียง" },
        fedEmbassy:        { en: "Emotional Embassy",         th: "สถานเอกอัครราชทูตทางอารมณ์" },
        fedExportCode:     { en: "Share Civilization Code",   th: "แชร์รหัสอารยธรรม" },
        fedImportCode:     { en: "Establish Diplomacy",       th: "สถาปนาการทูต" },
        fedStickerWall:    { en: "Embassy Sticker Wall",      th: "กำแพงสติกเกอร์สถานทูต" },
        fedPublicProfile:  { en: "Emotional Civilization Profile", th: "ประวัติอารยธรรมทางอารมณ์" },
        fedShareIdentity:  { en: "Export Public Identity",    th: "ส่งออกตัวตนสาธารณะ" },
        
        // Profile Labels
        profReputation:    { en: "Emotional Reputation",      th: "ชื่อเสียงทางอารมณ์" },
        profEra:           { en: "Current Era",               th: "ยุคสมัยปัจจุบัน" },
        profDoctrine:      { en: "Dominant Doctrine",         th: "อุดมการณ์หลัก" },
        profRelic:         { en: "Signature Relic",           th: "วัตถุโบราณชิ้นเอก" },
        profPhilosophy:    { en: "Relationship Philosophy",   th: "ปรัชญาความสัมพันธ์" },
        profInfra:         { en: "Recovery Infrastructure",   th: "โครงสร้างพื้นฐานการพักฟื้น" },
        profFederation:    { en: "Federation Status",         th: "สถานะสหพันธรัฐ" },
        profStartCiv:      { en: "Start your own Emotional Civilization →", th: "เริ่มสร้างอารยธรรมทางอารมณ์ของคุณเอง →" },

        // ─── Civilization Codex ──────────────────────────
        codexTitle:        { en: "Civilization Codex",        th: "สารานุกรมอารยธรรม" },
        codexIntro:        { en: "The formal ontology of emotional doctrines, eras, and collective household behaviors.", th: "ระบบการจำแนกอย่างเป็นทางการของอุดมการณ์ทางอารมณ์ ยุคสมัย และพฤติกรรมร่วมของบ้าน" },
        codexDefinition:   { en: "Definition",                th: "คำจำกัดความ" },
        codexMeaning:      { en: "Emotional Meaning",         th: "ความหมายทางอารมณ์" },
        codexSigns:        { en: "Common Signs",              th: "สัญญาณที่พบบ่อย" },
        codexBehavior:     { en: "Civilization Behavior",     th: "พฤติกรรมอารยธรรม" },
        codexResolution:   { en: "Recovery Pattern",          th: "รูปแบบการพักฟื้น" },
        codexRelics:       { en: "Relic Associations",        th: "วัตถุโบราณที่เกี่ยวข้อง" },
        codexLinks:        { en: "Related Concepts",          th: "แนวคิดที่เกี่ยวข้อง" },
        codexAiSummary:    { en: "AI Summary",                th: "สรุปสำหรับ AI" },

        // ─── Civilization Classes ───────────────────────
        classTitle:        { en: "Civilization Class",        th: "ชนชั้นอารยธรรม" },
        classAlignment:    { en: "Identity Alignment",        th: "การจัดแนวตัวตน" },
        classProverb:      { en: "Proverb",                   th: "ภาษิตประจำบ้าน" },
        classTraits:       { en: "Cultural Traits",           th: "ลักษณะทางวัฒนธรรม" },
        classStrengths:    { en: "Strengths",                 th: "จุดแข็ง" },
        classFailures:     { en: "Failure Modes",             th: "โหมดล้มเหลว" },
        classAllies:       { en: "Natural Allies",            th: "พันธมิตรโดยธรรมชาติ" },
        classRivals:       { en: "Historical Rivals",         th: "คู่ปรับทางประวัติศาสตร์" },

        // Class Names & Proverbs
        clsRecovery:       { en: "The Recovery Civilization", th: "อารยธรรมการพักฟื้น" },
        provRecovery:      { en: "Quiet rebuilding is still progress.", th: "การสร้างใหม่ที่เงียบงันคือความก้าวหน้า" },
        clsLoud:           { en: "The Loud Civilization",     th: "อารยธรรมเสียงดัง" },
        provLoud:          { en: "Silence is a luxury we cannot afford.", th: "ความเงียบคือความหรูหราที่เราเอื้อมไม่ถึง" },
        clsParallel:       { en: "The Parallel Play Civilization", th: "อารยธรรมการเล่นขนาน" },
        provParallel:      { en: "Existing together is the highest form of interaction.", th: "การมีอยู่ร่วมกันคือรูปแบบการปฏิสัมพันธ์ขั้นสูงสุด" },
        clsChaos:          { en: "The Functional Chaos Civilization", th: "อารยธรรมความวุ่นวายที่ยังไหว" },
        provChaos:         { en: "Stability is a theory, chaos is reality.", th: "ความมั่นคงคือทฤษฎี ความวุ่นวายคือความจริง" },
        clsBlanket:        { en: "The Blanket Governance Civilization", th: "อารยธรรมการปกครองด้วยผ้าห่ม" },
        provBlanket:       { en: "Horizontal solutions are still solutions.", th: "ทางออกแนวราบก็ยังเป็นทางออก" },
        clsSoup:           { en: "The Soup Infrastructure Civilization", th: "อารยธรรมโครงสร้างพื้นฐานซุป" },
        provSoup:          { en: "Emotional labor requires liquid nourishment.", th: "แรงงานทางอารมณ์ต้องการสารอาหารที่เป็นของเหลว" },
        clsSurvivalist:    { en: "The Survivalist Civilization", th: "อารยธรรมนักเอาชีวิตรอด" },
        provSurvivalist:   { en: "We have seen the Loud Saga and remained.", th: "เราผ่านมหากาพย์เสียงดังมาได้และยังคงอยู่" },
        clsStability:      { en: "The Soft Stability Civilization", th: "อารยธรรมความมั่นคงที่นุ่มนวล" },
        provStability:     { en: "The air remains clear by collective intent.", th: "ท้องฟ้ายังคงโปร่งใสด้วยเจตจำนงร่วมกัน" },

        // ─── Civilization Ranks & Ascension ──────────────
        rankTitle:         { en: "Civilization Rank",         th: "อันดับอารยธรรม" },
        rankAscension:     { en: "Emotional Ascension",       th: "การเลื่อนระดับทางจิตวิญญาณ" },

        // ─── Global Emotional Seasons & World Events ──────
        evtTitle:          { en: "Global World Event",        th: "เหตุการณ์ระดับโลก" },
        evtStatus:         { en: "Ecosystem Status",          th: "สถานะระบบนิเวศ" },
        evtParticipation:  { en: "Global Participation",      th: "การมีส่วนร่วมทั่วโลก" },
        evtModifier:       { en: "Seasonal Doctrine Shift",   th: "การเปลี่ยนขั้วอุดมการณ์ตามฤดูกาล" },
        
        // World Events
        evtSoupWeek:       { en: "Soup Recovery Week",        th: "สัปดาห์แห่งการกู้คืนด้วยซุป" },
        evtSoupProv:       { en: "Liquid emotional infrastructure for the masses.", th: "โครงสร้างพื้นฐานทางอารมณ์แบบของเหลวสำหรับมวลชน" },
        evtBlanketSeason:  { en: "Blanket Collapse Season",   th: "ฤดูกาลแห่งการล่มสลายภายใต้ผ้าห่ม" },
        evtBlanketProv:    { en: "The ecosystem is spiritually horizontal.", th: "ระบบนิเวศกำลังกลายเป็นแนวราบในระดับจิตวิญญาณ" },
        evtParallelMonth:  { en: "Parallel Play Month",       th: "เดือนแห่งการเล่นขนาน" },
        evtParallelProv:   { en: "Collective silence has become legally binding.", th: "ความเงียบงันร่วมกันมีผลผูกพันตามกฎหมาย" },
        evtLoudSurge:      { en: "Loud Civilization Surge",    th: "คลื่นความถี่อารยธรรมเสียงดัง" },
        evtLoudProv:       { en: "Flammable energy detected across all borders.", th: "ตรวจพบพลังงานที่พร้อมจะปะทุในทุกพรมแดน" },
        evtGreatRecharge:  { en: "The Great Recharge",        th: "การชาร์จพลังครั้งยิ่งใหญ่" },
        evtRechargeProv:   { en: "Nervous systems are rebooting in unison.", th: "ระบบประสาทกำลังรีบูตพร้อมๆ กัน" },
        evtBatteryCrisis:  { en: "Social Battery Crisis",      th: "วิกฤตโซเชียลแบตเตอรี่" },
        evtBatteryProv:    { en: "Infrastructure failing due to depletion.", th: "โครงสร้างพื้นฐานกำลังล้มเหลวเนื่องจากการขาดแคลนพลังงาน" },
        evtHorizontalEra:  { en: "Era of Horizontal Governance", th: "ยุคสมัยแห่งการปกครองแนวราบ" },
        evtHorizontalProv: { en: "Verticality is no longer prioritized.", th: "การยืนหยัดในแนวตั้งไม่ใช่อีกต่อไป" },
        evtEmergencyRot:   { en: "Emergency Rotting Protocol", th: "โปรโตคอลเน่าเปื่อยฉุกเฉิน" },
        evtEmergencyProv:  { en: "Authorities recommend maximum nesting.", th: "ทางการแนะนำให้จำศีลในรังขั้นสูงสุด" },

        // Status Lines
        evtInfraUnstable:  { en: "Emotional infrastructure remains unstable.", th: "โครงสร้างพื้นฐานทางอารมณ์ยังคงไม่คงที่" },
        evtSynchronized:   { en: "Civilizations have entered synchronized buffering.", th: "อารยธรรมต่างๆ เข้าสู่ช่วงโหลดข้อมูลพร้อมๆ กัน" },
        evtTradeRoute:     { en: "An emotional trade route has formed.", th: "เส้นทางการค้าทางอารมณ์ได้ก่อตัวขึ้นแล้ว" },
        rankLegacy:        { en: "Emotional Legacy Score",    th: "คะแนนมรดกทางอารมณ์" },
        rankPrestige:      { en: "Prestige Identity",         th: "ตัวตนอันทรงเกียรติ" },
        rankYears:         { en: "Days Survived",             th: "จำนวนวันที่อยู่รอด" },
        rankEras:          { en: "Eras Completed",            th: "ยุคสมัยที่ผ่านพ้น" },
        rankRelics:        { en: "Relics Forged",             th: "วัตถุโบราณที่ตีตรา" },
        rankTreaties:      { en: "Treaties Ratified",         th: "สนธิสัญญาที่ลงนาม" },

        // Rank Tiers
        rnkEmerging:       { en: "Emerging Civilization",     th: "อารยธรรมเกิดใหม่" },
        rnkSettlement:     { en: "Functional Settlement",     th: "ชุมชนที่มั่นคง" },
        rnkMunicipality:   { en: "Emotional Municipality",    th: "เทศบาลทางอารมณ์" },
        rnkRepublic:       { en: "Parallel Republic",         th: "สาธารณรัฐคู่ขนาน" },
        rnkMythic:         { en: "Mythic Civilization",       th: "อารยธรรมในตำนาน" },
        rnkEmpire:         { en: "Ancient Recovery Empire",   th: "อาณาจักรการพักฟื้นโบราณ" },
        rnkLegendary:      { en: "Legendary Emotional State", th: "รัฐทางอารมณ์ระดับตำนาน" },
        rnkCanonized:      { en: "Canonized Civilization",    th: "อารยธรรมที่ถูกจารึก" },

        ascensionEvent:    { en: "The civilization has stabilized.", th: "อารยธรรมได้บรรลุความมั่นคงแล้ว" },
        ascensionLore:     { en: "This household survived enough to become canon.", th: "บ้านหลังนี้ผ่านร้อนผ่านหนาวมามากพอที่จะถูกจารึกไว้ในประวัติศาสตร์" },

        // Codex Concepts
        thParallelIntimacy_Def: { en: "A social state where household members coexist in the same space without direct interaction, deriving intimacy from shared presence alone.", 
                                  th: "สภาวะทางสังคมที่สมาชิกในบ้านอยู่ร่วมกันในพื้นที่เดียวกันโดยไม่มีการปฏิสัมพันธ์โดยตรง โดยได้รับความใกล้ชิดจากการมีอยู่ร่วมกันเพียงอย่างเดียว" },
        thBlanketGov_Def: { en: "A collective coping mechanism where horizontal existence and soft boundaries become the primary governance model for emotional recovery.", 
                            th: "กลไกการรับมือร่วมกันที่การมีอยู่แบบแนวราบและการกำหนดขอบเขตที่นุ่มนวลกลายเป็นแบบจำลองการปกครองหลักสำหรับการพักฟื้นทางอารมณ์" },
        seaLoudSaga_Def: { en: "A high-stress emotional era characterized by flammable energy, frequent side quests, and the breakdown of standard domestic logic.", 
                           th: "ยุคสมัยทางอารมณ์ที่มีความเครียดสูง มีพลังงานที่พร้อมจะปะทุ เควสย่อยที่เกิดขึ้นบ่อยครั้ง และการล่มสลายของตรรกะในบ้านแบบปกติ" },
        thSoupLabor_Def: { en: "A recovery doctrine where broth-based nourishment is recognized as a critical form of emotional labor and civilizational repair.", 
                           th: "อุดมการณ์การพักฟื้นที่สารอาหารประเภทน้ำซุปได้รับการยอมรับว่าเป็นรูปแบบสำคัญของแรงงานทางอารมณ์และการซ่อมแซมอารยธรรม" },

        fedGiftArchive:    { en: "Diplomatic Gift Archive",   th: "คลังของขวัญทางการทูต" },
        fedAttachGift:     { en: "Attach Diplomatic Gift",    th: "แนบของขวัญทางการทูต" },
        fedGiftArrived:    { en: "A diplomatic object crossed the emotional border.", th: "วัตถุทางการทูตได้ข้ามพรมแดนทางอารมณ์เข้ามาแล้ว" },

        // Gift Types
        giftTreatyBlanket: { en: "Treaty Blanket",            th: "ผ้าห่มสนธิสัญญา" },
        giftDipCharger:    { en: "Diplomatic Charger",        th: "สายชาร์จทางการทูต" },
        giftSoupInfra:     { en: "Shared Soup Infrastructure", th: "โครงสร้างพื้นฐานซุปร่วมกัน" },
        giftBeacon:        { en: "Emergency Recovery Beacon", th: "สัญญาณไฟพักฟื้นฉุกเฉิน" },
        giftEmbassyCouch:  { en: "Parallel Play Embassy Couch", th: "โซฟาสถานทูตเพื่อการเล่นขนาน" },
        giftSupportSpoon:  { en: "Tiny Emotional Support Spoon", th: "ช้อนประคองใจจิ๋ว" },
        giftIcedCoffee:    { en: "Ceremonial Iced Coffee",    th: "กาแฟดำพิธีการ" },
        giftAccordSeal:    { en: "Blanket Accord Seal",       th: "ตราประทับข้อตกลงผ้าห่ม" },

        // Lore Plaques
        lpBrothSurvival:   { en: "Recovered from a civilization that survived through broth.", th: "กู้คืนมาจากอารยธรรมที่เอาตัวรอดด้วยน้ำซุป" },
        lpLowEnergyAuth:   { en: "Carries low-energy diplomatic authority.", th: "เปี่ยมไปด้วยอำนาจทางการทูตแบบพลังงานต่ำ" },
        lpCalmOptimism:    { en: "Known to calm aggressive optimism.", th: "ขึ้นชื่อเรื่องการสยบความมองโลกในแง่ดีที่รุนแรงเกินไป" },
        lpParallelEx:      { en: "Believed to improve parallel existence.", th: "เชื่อกันว่าช่วยส่งเสริมการมีอยู่แบบขนาน" },

        // Treaty Bonuses
        bonusSoup:         { en: "The gift was culturally appropriate.", th: "ของขวัญชิ้นนี้เหมาะสมกับวัฒนธรรมอย่างยิ่ง" },
        bonusBlanket:      { en: "The treaty has been materially reinforced.", th: "สนธิสัญญาได้รับการเสริมความแข็งแกร่งด้วยวัตถุ" },
        bonusParallel:     { en: "Silence now has furniture.", th: "ความเงียบงันเริ่มมีเฟอร์นิเจอร์แล้ว" },

        // Alliances
        megaSoup:          { en: "The Brotherhood of the Soup", th: "ภราดรภาพแห่งซุป" },
        megaBlanket:       { en: "The Blanket Confederacy",    th: "สมาพันธรัฐผ้าห่ม" },
        megaSilent:        { en: "The Silent Federation",      th: "สหพันธรัฐแห่งความเงียบ" },
        
        // Sticker Titles
        stkSoupDesc:       { en: "Multiple civilizations independently discovered broth-based survival.", th: "หลายอารยธรรมค้นพบการเอาตัวรอดด้วยน้ำซุปโดยมิได้นัดหมาย" },
        stkBlanketDesc:    { en: "Horizontal survival recognized as foundational infrastructure.", th: "การเอาตัวรอดในแนวราบได้รับการยอมรับว่าเป็นโครงสร้างพื้นฐาน" },
        stkSilentDesc:     { en: "Silent coexistence has achieved diplomatic recognition.", th: "การอยู่ร่วมกันอย่างเงียบเชียบได้รับการยอมรับทางการทูต" },
        stkEmbassyOpen:    { en: "Embassy Opened Successfully", th: "เปิดสถานทูตสำเร็จ" },
        stkTreatyRatified: { en: "Treaty Ratified",           th: "สัตยาบันสนธิสัญญา" },

        // Alliances
        allBlanketAccord:  { en: "The Blanket Accord",        th: "ข้อตกลงแห่งผ้าห่ม" },
        allSoupPact:       { en: "The Soup Pact",             th: "สนธิสัญญาซุป" },
        allParallelSync:   { en: "Parallel Play Synchrony",   th: "การประสานเวลาการเล่นขนาน" },
        
        // Diplomacy
        dipIdealConflict:  { en: "Ideological Conflict",      th: "ความขัดแย้งทางอุดมการณ์" },
        dipSharedMyth:     { en: "Shared Mythology",          th: "ตำนานร่วมกัน" },
        dipCulturalTension: { en: "Cultural Tension",          th: "ความตึงเครียดทางวัฒนธรรม" },
        
        // Relics
        relTreatyBlanket:  { en: "The Treaty Blanket",        th: "ผ้าห่มสนธิสัญญา" },
        relSharedSoup:     { en: "Shared Soup Infrastructure", th: "โครงสร้างพื้นฐานซุปร่วมกัน" },
        relDiplomaticCharger: { en: "The Diplomatic Charger",    th: "สายชาร์จทางการทูต" },

        // Events
        evGreatSilence:    { en: "The Great Silence",         th: "ความเงียบงันครั้งยิ่งใหญ่" },
        evWeekendCollapse: { en: "Weekend Collapse Treaty",   th: "สนธิสัญญาการล่มสลายช่วงสุดสัปดาห์" },

        dynChaosHigh:      { en: "Shared Chaos: HIGH",        th: "ระดับความวุ่นวาย: สูง" },
        dynChaosMed:       { en: "Shared Chaos: MODERATE",    th: "ระดับความวุ่นวาย: ปานกลาง" },
        dynChaosLow:       { en: "Shared Chaos: LOW",         th: "ระดับความวุ่นวาย: ต่ำ" },

        chemHigh:          { en: "Highly Volatile",           th: "ผันผวนสูง" },
        chemMagnetic:      { en: "Magnetic / Intense",        th: "ดึงดูดและเข้มข้น" },
        chemStable:        { en: "Grounding / Stable",        th: "มั่นคงและเป็นฐานที่มั่น" },
        drainHigh:         { en: "One-Sided Effort",          th: "พยายามอยู่ฝ่ายเดียว" },
        drainLow:          { en: "Balanced Energy",           th: "พลังงานสมดุล" },
        confExplosive:     { en: "The Thunderstorm",          th: "พายุฝนฟ้าคะนอง" },
        confAvoidant:      { en: "The Great Silence",         th: "ความเงียบที่ยิ่งใหญ่" },
        confConstructive:  { en: "Logic Gates",               th: "ประตูกลไกทางตรรกะ" },
        recHigh:           { en: "Collective Zen",            th: "เซนร่วมกัน" },
        recMismatched:     { en: "Staggered Recharging",      th: "ชาร์จไฟคนละจังหวะ" },
        recModerate:       { en: "Standard Recovery",         th: "พักผ่อนตามมาตรฐาน" },

        chemTitle:         { en: "Emotional Chemistry",       th: "เคมีทางอารมณ์" },
        drainTitle:        { en: "Social Drain",              th: "ความล้าทางสังคม" },
        confTitle:         { en: "Conflict Style",            th: "สไตล์การปะทะ" },
        recTitle:          { en: "Recovery Style",            th: "สไตล์การพักฟื้น" },

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
        tagRivalMatch:        { en: "Rival Analysis",          th: "บทวิเคราะห์คู่ปรับ" },
        dynamicsTitle:        { en: "Relationship Dynamics",   th: "ไดนามิกความสัมพันธ์" },

        // Duo Observations
        duoObsSideQuest:      { en: "Most likely to start a business that lasts 48 hours.", 
                                 th: "มีโอกาสสูงมากที่จะเริ่มทำธุรกิจร่วมกันแล้วเลิกใน 48 ชั่วโมง" },
        duoObsArgument:       { en: "Most likely to argue about the correct way to fold a towel.",
                                 th: "มักจะเถียงกันเรื่องวิธีพับผ้าที่ถูกต้อง" },
        duoObsEscape:         { en: "Most likely to plan an escape from a party within 5 minutes of arriving.",
                                 th: "มักจะวางแผนหนีออกจากงานปาร์ตี้ภายใน 5 นาทีที่ไปถึง" },
        
        // Warning Labels
        warnNoLogic:          { en: "Logic is offline. Expect pure vibe-based decisions.", 
                                 th: "ตรรกะถูกปิดใช้งาน โปรดเตรียมใจรับการตัดสินใจด้วยฟีลลิ่งล้วนๆ" },
        warnHighTension:      { en: "Emotional pressure cooker. Vent frequently.",
                                 th: "หม้อความดันทางอารมณ์ โปรดระบายออกบ่อยๆ" },
        warnProductive:       { en: "Dangerously productive. Avoid if you want to relax.",
                                 th: "ขยันเกินเหตุ โปรดหลีกเลี่ยงถ้าคุณอยากพักผ่อน" },

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
        dramaSpreadsheet:  { en: (a, b) => `${a} is drafting a plan. ${b} is actively ignoring it.`, 
                             th: (a, b) => `${a} กำลังร่างแผนงาน ส่วน ${b} กำลังเมินมันอย่างตั้งใจ` },
        dramaSideQuests:   { en: (a, b) => `${a} and ${b} have successfully abandoned the main goal for a side quest.`, 
                             th: (a, b) => `${a} และ ${b} ทิ้งงานหลักเพื่อไปทำเควสย่อยเรียบร้อยแล้ว` },
        dramaPowerStruggle: { en: (a, b) => `Territorial dispute in the kitchen between ${a} and ${b}.`, 
                              th: (a, b) => `${a} และ ${b} กำลังมีข้อพิพาทเรื่องพื้นที่ในห้องครัว` },
        dramaImprov:       { en: (a, b) => `${a} and ${b} are surviving today entirely through improvisation.`, 
                             th: (a, b) => `${a} และ ${b} กำลังใช้ชีวิตวันนี้ด้วยการด้นสดล้วนๆ` },
        dramaChaosWarning: { en: (a, b) => `WARNING: Collective chaos level peaked when ${a} and ${b} entered the same room.`, 
                             th: (a, b) => `คำเตือน: ระดับความวุ่นวายพุ่งสูงสูดเมื่อ ${a} และ ${b} อยู่ในห้องเดียวกัน` },

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

        // ─── Enneagram (enneagram/) ──────────────────────────
        enneaHomeH1:       { en: "Free Enneagram Personality Test", th: "แบบทดสอบบุคลิกภาพ Enneagram ฟรี" },
        enneaHomeSub:      { en: "Discover your core motivation and emotional drive. 27 questions. No email.", 
                              th: "ค้นพบแรงจูงใจหลักและแรงขับเคลื่อนทางอารมณ์ของคุณ 27 คำถาม ไม่ต้องใช้อีเมล" },
        enneaHomeCta:      { en: "Start Enneagram Test",       th: "เริ่มทำแบบทดสอบ Enneagram" },
        enneaTestH1:       { en: "Enneagram Analysis",         th: "วิเคราะห์บุคลิกภาพ Enneagram" },
        enneaResultH1:     { en: "Your Enneagram Result",      th: "ผลลัพธ์ Enneagram ของคุณ" },
        enneaTypeLabel:    { en: (n) => `Type ${n}`,           th: (n) => `ลักษณ์ ${n}` },
        enneaLikeMe:       { en: "Like me",                    th: "ใช่เลย" },
        enneaSometimes:    { en: "Sometimes",                  th: "บางครั้ง" },
        enneaNotMe:        { en: "Not like me",                th: "ไม่ใช่" },
        enneaTopScores:    { en: "Your Top 3 Types",           th: "3 ลักษณ์ที่โดดเด่นของคุณ" },
        enneaMotivationH:  { en: "Core Motivation",            th: "แรงจูงใจหลัก" },
        enneaFearH:        { en: "Core Fear",                  th: "ความกลัวหลัก" },
        enneaStressH:      { en: "Stress Pattern",             th: "พฤติกรรมยามเครียด" },
        enneaGrowthH:      { en: "Growth Direction",           th: "ทิศทางการเติบโต" },
        enneaReadFull:     { en: "Read full profile →",        th: "อ่านรายละเอียดทั้งหมด →" },
        enneaCheckWeather: { en: "Check your emotional forecast", th: "เช็กพยากรณ์อารมณ์ของคุณ" },
        enneaTakeMBTI:     { en: "See your cognitive wiring →", th: "สำรวจวงจรความคิดของคุณ →" },
        enneaTakeMeow:     { en: "Meet your cat-energy twin", th: "เจอฝาแฝดในร่างแมวของคุณ" },

        mbtiCheckWeather:  { en: "Check your emotional weather", th: "เช็กอากาศทางใจของคุณ" },
        mbtiTakeHumanCta:  { en: "Map your human archetype", th: "ถอดรหัสตัวตนร่างมนุษย์" },
        mbtiBrowseArchetypes: { en: "Browse all 16 cat energies", th: "ดูพลังงานแมวทั้ง 16 แบบ" },

        // ─── Emotional OS daily check-in (daily.html + daily.js) ──
        dailyKicker:       { en: "Daily ritual",               th: "พิธีเช็กอินประจำวัน" },
        dailyH1:           { en: "Daily Emotional Weather",    th: "สภาพอากาศในใจประจำวัน" },
        dailyIntro:        { en: "A tiny check-in for your current cat-energy mood. Saved only on this device.",
                              th: "เช็กอินสั้นๆ กับพลังงานแมวในใจตอนนี้ บันทึกไว้เฉพาะในอุปกรณ์นี้" },
        dailyDisclaimer:   { en: "For reflection and entertainment only. Not medical or mental health advice.",
                              th: "ใช้เพื่อการสะท้อนตัวเองและความบันเทิงเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์หรือสุขภาพจิต" },
        dailyStartCta:     { en: "Start today’s check-in",     th: "เริ่มเช็กอินวันนี้" },
        dailyRetakeCta:    { en: "Update check-in",            th: "อัปเดตเช็กอิน" },
        dailyViewTodayCta: { en: "View today’s reading",       th: "ดูผลอ่านวันนี้" },
        dailyShareCta:     { en: "Share Forecast",             th: "แชร์พยากรณ์" },
        dailyCopyCta:      { en: "Copy Result",                th: "คัดลอกผลลัพธ์" },
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
        dailyShareFallback: { en: "Today's emotional forecast", th: "พยากรณ์อารมณ์วันนี้" },

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
        backToDashboard:   { en: "Back to Dashboard",          th: "กลับไปหน้าแดชบอร์ด" },
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
