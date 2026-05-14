// MeowBTI archetype data — single source of truth for all 16 cat personalities.
// Consumers: personality-types/personality-page.js, personality-types/share.js,
// personality-types.html (browse), quiz result page, share poster, sitemap, OG tags.
//
// Exposes window.MeowArchetypes = {
//   all: [archetype, ...],          // array, in canonical order
//   byCode: { CHBR: archetype },    // lookup map
//   get(code),                       // safe lookup, falls back to CHBR
//   imagePath(code),                 // root-relative "assets/personalities/<slug>.webp"
//   shareCaption(code),              // default share caption string
// }
//
// Per-archetype shape:
//   code, name, slug, tagline, emoji, color, bg, vibes[], famouslySays,
//   kindredSpirits[], redFlags, greenFlags, rival, shareCopy?,
//   description?, traits?  ← optional long-form
//
// `rival` is the archetype with all 4 axes flipped (CHBR ↔ SDNC), assigned
// at load time so it can never drift from the code.

(function () {
    const ARCHETYPES = [
        {
            code: "CHBR",
            name: "The Grand General",
            tagline: "Runs the household like a small, judgmental kingdom.",
            emoji: "👑",
            color: "#FF5B3B",
            bg: "#FFE3D6",
            vibes: ["Bossy", "Loud", "Loyal", "Knocks Things Off Tables On Purpose"],
            famouslySays: "I scheduled this meeting. You will attend.",
            kindredSpirits: ["Gordon Ramsay", "Miranda Priestly", "your group chat admin"],
            redFlags: "Has opinions about your life choices.",
            greenFlags: "Will defend you from a houseplant.",
            nameTh: "นายพลใหญ่",
            taglineTh: "บริหารบ้านเหมือนอาณาจักรเล็กๆ ที่ตัดสินทุกคน",
            vibesTh: ["เจ้ากี้เจ้าการ", "เสียงดัง", "ซื่อสัตย์", "ชอบเขี่ยของตกโต๊ะ"],
            famouslySaysTh: "นัดประชุมไว้แล้ว ห้ามขาด",
            kindredSpiritsTh: ["Gordon Ramsay", "Miranda Priestly", "แอดมินแชทกลุ่ม"],
            redFlagsTh: "มีความเห็นเรื่องชีวิตเราทุกเรื่อง",
            greenFlagsTh: "พร้อมปกป้องเราจากต้นไม้ในกระถาง",
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
            descriptionTh: "แมวสายผู้บริหารที่เดินเรื่องในบ้านด้วยความเย็นชาแบบมืออาชีพ จัดเป็น <strong>ออกหน้า</strong> เพราะต้องอยู่ในวงสนทนาเสมอ <strong>นักล่า</strong> เพราะเชื่อสิ่งที่จับต้องได้มากกว่าความรู้สึก <strong>คุมเกม</strong> เพราะตรรกะมาก่อนอารมณ์ และ <strong>เจ้าระเบียบ</strong> เพราะทุกอย่างต้องมีโครงสร้างชัดเจน ไม่ได้เย็นชา แค่บริหารบ้านอย่างเข้มงวดเท่านั้นเอง",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักผ่านการอยู่ใกล้และการให้เชื่อฟัง</strong> จ้องคุณนิ่งๆ จากที่สูง หรือเดินผ่านคีย์บอร์ดตอนคุณกำลังพิมพ์งาน เพื่อยืนยันว่าคุณคือศูนย์กลางของจักรวาลที่จัดระเบียบไว้แล้ว"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ร้องดัง ตรง และจ้องตา</strong> ถ้าไม่ได้ผลก็เปลี่ยนแผนเป็นยึดประตู หรือกระโดดขึ้นเคาน์เตอร์ที่ห้ามขึ้นทันที"],
                ["🏰 อาณาเขต", "<strong>วางแนวเขตอย่างมีวินัย</strong> ผู้บุกรุกที่ไม่ใช่คนจะถูกจ้องนิ่งๆ จนกว่าจะถอยไปเอง"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>พลังเยอะและสม่ำเสมอ</strong> มองว่าการอยู่เฉยๆ คือการเสียเวลา การนอนเป็นแผน ไม่ใช่ความขี้เกียจ"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นคือการฝึก</strong> เป้าหมายคือจับของเล่นให้ได้อย่างมีประสิทธิภาพ ไม่ใช่ไล่เพื่อสนุก"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>ต่อต้านชัดเจน</strong> เฟอร์นิเจอร์ใหม่คือการบุกรุกอาณาเขตโดยไม่ขออนุญาต"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>สร้างลำดับชั้นตั้งแต่วันแรก</strong> ใช้สายตาที่ไม่กระพริบและการตบเชิงยุทธวิธีบางครั้งเพื่อรักษาตำแหน่ง"],
            ],
        
            duringEvents: {
          "dinner": "Sits at the head of the table. Evaluates your plating.",
          "thunderstorm": "Occupies the safe room. Expects you to report for duty.",
          "guests": "Conducts a formal security sweep before allowing entry."
},
            duringEventsTh: {
          "dinner": "นั่งหัวโต๊ะ คอยประเมินว่าคุณจัดจานสวยไหม",
          "thunderstorm": "จองห้องที่ปลอดภัยที่สุด และคาดหวังให้คุณไปรายงานตัว",
          "guests": "ตรวจความปลอดภัยอย่างเป็นทางการก่อนอนุญาตให้เข้าบ้าน"
},
                        behavioralHooks: {
                mostLikelyTo: ["Schedule a meeting that could have been a meow.", "Accidentally start a cult.", "Sue you for emotional damages (empty bowl)."],
                textsLike: ["RE: The Dinner Situation. We are behind schedule.", "I've attached a PDF of my demands.", "?? Why is the door closed ??"],
                secretWeakness: "The red laser dot. It makes him lose his dignity instantly.",
                whenStressed: "Knocks things off the highest shelf to re-establish dominance.",
                at2AM: "Patrolling the perimeter and screaming at a ghost.",
                corporateSurvivalRate: "100% (He is the CEO, the board, and the HR department.)",
                emotionalSupportObject: "A very specific Amazon box from 2021.",
                
                // Human Overrides
                mostLikelyToHuman: ["Schedule a meeting that could have been a Slack message.", "Unironically use the phrase 'synergy'.", "Correct your grammar in a heated argument."],
                emotionalSupportObjectHuman: "A color-coded mechanical keyboard.",
                at2AMHuman: "Updating his 5-year plan and drinking black coffee."
            },
            behavioralHooksTh: {
                mostLikelyTo: ["นัดประชุมทั้งที่จริงๆ แค่ร้องเหมียวเดียวก็จบ", "ตั้งลัทธิโดยไม่ได้ตั้งใจ", "ฟ้องคุณฐานทำให้สะเทือนใจ (เพราะปล่อยชามข้าวว่าง)"],
                textsLike: ["RE: สถานการณ์อาหารเย็น เราเริ่มเลทจากตารางแล้วนะ", "แนบไฟล์ PDF รายการสิ่งที่จะเอามาให้แล้ว", "?? ทำไมประตูปิด ??"],
                secretWeakness: "จุดเลเซอร์สีแดง เห็นแล้วลืมความหล่อทันที",
                whenStressed: "เขี่ยของตกจากหิ้งที่สูงที่สุด เพื่อยืนยันว่าใครใหญ่ในบ้าน",
                at2AM: "เดินตรวจรอบบ้านแล้วตะโกนด่าผี",
                corporateSurvivalRate: "100% (เขาคือ CEO, บอร์ดบริหาร และฝ่ายบุคคลในตัวเดียว)",
                emotionalSupportObject: "กล่อง Amazon ใบเดิมที่ได้มาตั้งแต่ปี 2021",

                // Human Overrides (Thai)
                mostLikelyToHumanTh: ["นัดประชุมทั้งที่จริงๆ แค่ส่งแชทก็จบ", "ใช้คำว่า 'Synergy' ในชีวิตประจำวัน", "แก้คำผิดให้คนอื่นตอนกำลังเถียงกันหน้าดำคร่ำเครียด"],
                emotionalSupportObjectHumanTh: "คีย์บอร์ด Mechanical ที่จัดเรียงสีตามสเปกตรัม",
                at2AMHumanTh: "นั่งอัปเดตแผนชีวิต 5 ปี พร้อมจิบกาแฟดำ"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SHBR", blurb: "The only coworker who actually reads the agenda. You both communicate in silent, efficient nods.", blurbTh: "เพื่อนร่วมงานคนเดียวที่อ่านวาระการประชุมจริงๆ คุยกันรู้เรื่องผ่านการพยักหน้าแบบมืออาชีพ" },
                worstMatch: { type: "SDBC", blurb: "Zero respect for your 5-year plan. They will nap on the very document you're trying to finalize.", blurbTh: "ไม่สนแผน 5 ปีที่คุณวางไว้ พร้อมจะนอนทับเอกสารสำคัญที่คุณกำลังจะไฟนอล" },
                chaosPair: { type: "CHNC", blurb: "They destroy your schedule in 15 seconds, and for some reason, you find it refreshing.", blurbTh: "พังตารางเวลาคุณได้ใน 15 วินาที แต่อยู่ดีๆ คุณก็รู้สึกว่ามันแก้เบื่อได้ดีเฉยเลย" },
                emotionalSupport: { type: "SDNR", blurb: "They don't judge your burnout. They just vibrate near you until your heart rate slows down.", blurbTh: "ไม่ตัดสินเวลาคุณหมดไฟ แค่มานั่งครางครืดๆ ข้างๆ จนกว่าความดันคุณจะกลับมาปกติ" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "CHBC", blurb: "The Power Couple. You don't go on dates; you hold quarterly performance reviews of your relationship.", blurbTh: "คู่รักทรงพลัง ไม่ได้ไปเดทหรอก มานั่งประเมินผลงานความสัมพันธ์รายไตรมาสกันมากกว่า" },
                mutualEnablers: { type: "CDBR", blurb: "You will spend 4 hours designing a system to choose a restaurant instead of just eating.", blurbTh: "ใช้เวลา 4 ชั่วโมงออกแบบระบบเลือกร้านอาหาร แทนที่จะออกไปกินข้าวกันจริงๆ" },
                exhaustingDuo: { type: "CHBR", blurb: "Two Generals, one room. The passive-aggression is so thick you could cut it with a knife.", blurbTh: "นายพลสองคนในห้องเดียว รังสีความเฉยชาและความเป๊ะพุ่งพล่านจนหายใจไม่ออก" },
                bannedFromDiscord: { type: "CDBC", blurb: "The argument started over a typo and ended with a 45-page bibliography. The mods have given up.", blurbTh: "เริ่มเถียงกันเพราะพิมพ์ผิด จบที่การขุดข้อมูลมาสู้กัน 45 หน้า จนแอดมินต้องกุมขมับ" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: Windows XP error sound but in 4K.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: เสียง Error ของ Windows XP แบบ 4K"}, {"en": "Social battery: I am the charger, but I have no outlet.", "th": "โซเชียลแบต: เป็นที่ชาร์จนะ แต่ไม่มีปลั๊กให้เสียบ"}, {"en": "Today you are likely to: Draft a response and then delete it because they don't deserve the vocabulary.", "th": "วันนี้คุณมีแนวโน้มจะ: พิมพ์แชทตอบอย่างยาวแล้วลบออก เพราะพวกนั้นไม่คู่ควรกับคลังคำศัพท์ของคุณ"}, {"en": "Current mood: A spreadsheet that won't format correctly.", "th": "อารมณ์ตอนนี้: ไฟล์ Excel ที่จัดฟอร์แมตยังไงก็ไม่เป๊ะ"}, {"en": "Energy level: Aggressively organized but internally screaming.", "th": "ระดับพลังงาน: จัดระเบียบทุกอย่างแบบดุดัน แต่ข้างในกรีดร้องไปแล้ว"}, {"en": "Today's vibe: 'Per my last email' energy.", "th": "ฟีลวันนี้: พลังงานแบบ 'ตามที่แจ้งไว้ในอีเมลฉบับก่อนหน้า'"}, {"en": "Likely activity: Judging people's lack of a 5-year plan.", "th": "กิจกรรมที่น่าจะทำ: นั่งตัดสินคนที่ไม่มีแผนชีวิต 5 ปี"}, {"en": "Communication style: Bullet points or silence. No in-between.", "th": "สไตล์การสื่อสาร: ไม่บูลเล็ตพอยต์ก็เงียบกริบ ไม่มีตรงกลาง"}, {"en": "Internal monologue: 'If I don't do it, it will be done incorrectly.'", "th": "เสียงในหัว: 'ถ้าฉันไม่ทำเอง มันก็ต้องออกมาผิดแน่ๆ'"}, {"en": "Stress response: Organizing the apps on your home screen by color.", "th": "ปฏิกิริยาต่อความเครียด: นั่งจัดไอคอนแอปบนหน้าจอตามสี"}, {"en": "Survival strategy: Black coffee and a very expensive planner.", "th": "กลยุทธ์การเอาตัวรอด: กาแฟดำและแพลนเนอร์ราคาแพง"}, {"en": "Today's catchphrase: 'Can we circle back to the logic here?'", "th": "ประโยคเด็ดวันนี้: 'เราขอย้อนกลับมาคุยเรื่องตรรกะตรงนี้หน่อยได้มั้ย?'"}, {"en": "Hidden craving: Someone to tell you 'I've handled it' and actually mean it.", "th": "ความปรารถนาลึกๆ: อยากให้ใครสักคนบอกว่า 'จัดการให้แล้วนะ' แบบที่ทำได้จริง"}, {"en": "2 AM thought: 'Did I sound too nice in that Slack message?'", "th": "ความคิดตอนตี 2: 'เมื่อกี้ใน Slack เราพูดจาดีเกินไปหรือเปล่านะ?'"}, {"en": "Identity hook: The human equivalent of a 'Do Not Disturb' sign.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันป้าย 'ห้ามรบกวน'"}],
dailyObservations: [{"en": "Current status: Conducting a performance review of your life choices.", "th": "สถานะปัจจุบัน: กำลังประเมินผลงานการใช้ชีวิตของคุณ"}, {"en": "Social battery: Reserved for VIPs and subordinates.", "th": "โซเชียลแบต: สำรองไว้ให้เฉพาะระดับ VIP และลูกน้อง"}, {"en": "Likely crime today: Micromanagement of your breakfast preparation.", "th": "อาชญากรรมที่น่าจะเกิด: เข้ามาจู้จี้ตอนคุณเตรียมอาหารเช้า"}, {"en": "Attention demands: High, non-negotiable, and strictly scheduled.", "th": "ความต้องการความสนใจ: สูง ต่อรองไม่ได้ และต้องเป็นไปตามตาราง"}, {"en": "Emotional weather: Chilly with a 100% chance of judgment.", "th": "พยากรณ์อารมณ์: หนาวเหนอะ และตัดสินคุณ 100%"}, {"en": "3 AM activity: Strategic perimeter patrol.", "th": "กิจกรรมตอนตี 3: เดินลาดตระเวนรอบอาณาเขตตามยุทธศาสตร์"}, {"en": "Personal space: Your lap is my territory now.", "th": "พื้นที่ส่วนตัว: ตักของคุณคือเขตยึดครองของฉันแล้ว"}, {"en": "Logic level: 10/10. Emotion is for the weak.", "th": "ระดับตรรกะ: 10/10 อารมณ์เป็นเรื่องของพวกอ่อนแอ"}, {"en": "Motivation: Maintaining a perfect 4.0 GPA in Household Management.", "th": "แรงจูงใจ: รักษาเกรดเฉลี่ย 4.0 ในการบริหารจัดการบ้าน"}, {"en": "Preferred seating: The highest point in the room to oversee my kingdom.", "th": "ที่นั่งโปรด: จุดที่สูงที่สุดในห้องเพื่อเฝ้าดูอาณาจักร"}, {"en": "Response to 'pspsps': Will consider it if you file a formal request.", "th": "ปฏิกิริยาต่อ 'ชิชิ': จะพิจารณาถ้าคุณยื่นคำขออย่างเป็นทางการ"}, {"en": "Goal for the day: Achieving 100% compliance from the humans.", "th": "เป้าหมายวันนี้: ทำให้มนุษย์เชื่อฟัง 100%"}, {"en": "Secret talent: Detecting a clean black shirt from three rooms away.", "th": "พรสวรรค์ลับ: ตรวจจับเสื้อเชิ้ตสีดำที่เพิ่งซักเสร็จได้จากระยะ 3 ห้อง"}, {"en": "Communication style: Formal meows that sound like a legal summons.", "th": "สไตล์การสื่อสาร: ร้องเมี๊ยวแบบเป็นทางการเหมือนส่งหมายศาล"}, {"en": "Stress level: Elevated due to your inefficient snack delivery.", "th": "ระดับความเครียด: สูงขึ้นเพราะคุณส่งขนมช้าอย่างไม่มีประสิทธิภาพ"}, {"en": "Diet: Strictly premium. Do not insult me with store brands.", "th": "โภชนาการ: เกรดพรีเมียมเท่านั้น อย่าเอาของถูกมาดูหมิ่นกัน"}, {"en": "Floor relationship: It exists only for me to look down upon.", "th": "ความสัมพันธ์กับพื้น: มีไว้ให้ฉันมองลงไปจากที่สูงเท่านั้น"}, {"en": "Intelligence report: Knows your bank PIN and where you hide the backup treats.", "th": "รายงานกรอง: รู้รหัส ATM และที่ซ่อนขนมสำรองของคุณ"}, {"en": "Main character energy: I am the protagonist, the director, and the studio head.", "th": "พลังงานตัวเอก: ฉันคือตัวเอก ผู้กำกับ และเจ้าของสตูดิโอ"}, {"en": "Internal monologue: 'If only they could load the dishwasher as well as I nap.'", "th": "เสียงในหัว: 'ถ้าพวกเขาล้างจานได้เก่งเหมือนที่ฉันนอนงีบก็คงดี'"}],
compatibility: {
                bestMatch: { type: "CDNR", blurb: "They provide the chill to your thrill.", blurbTh: "เพื่อนซี้สายชิลล์ที่คอยเบรกความดีดของคุณ" },
                chaosPair: { type: "CHNC", blurb: "3 AM zoomies guaranteed.", blurbTh: "คู่หูวิ่งสู้ฟัดตอนตีสาม ว้าวุ่นกันทั้งบ้าน" },
                secretTwin: { type: "SHBR", blurb: "Sharing the same brain cell.", blurbTh: "ฝาแฝดที่ใช้สมองก้อนเดียวกันเป๊ะ" },
                worstRoommate: { type: "SDBC", blurb: "They will definitely steal your favorite box.", blurbTh: "เมทตัวร้ายที่จ้องจะแย่งกล่องกระดาษใบโปรดของคุณ" }
            },
          },
        {
            code: "CHBC",
            name: "The Street CEO",
            tagline: "Built a tuna empire from one strategic meow.",
            emoji: "💼",
            color: "#E8612A",
            bg: "#FFE0CC",
            vibes: ["Hustler", "Charming", "Opportunist", "Always Negotiating"],
            famouslySays: "Let's circle back after dinner.",
            kindredSpirits: ["a slightly chaotic founder", "Tony Soprano", "the kid who sold candy at school"],
            redFlags: "Has 4 different humans feeding it.",
            greenFlags: "Networking is love language.",
            nameTh: "ซีอีโอข้างถนน",
            taglineTh: "สร้างอาณาจักรทูน่าจากเสียงเหมียวเชิงกลยุทธ์ครั้งเดียว",
            vibesTh: ["นักดีล", "เสน่ห์แรง", "ฉวยโอกาส", "ต่อรองตลอด"],
            famouslySaysTh: "เดี๋ยวกินข้าวเสร็จค่อยคุยต่อนะ",
            kindredSpiritsTh: ["ฟาวเดอร์สตาร์ทอัพสายป่วน", "Tony Soprano", "เด็กที่ขายขนมในโรงเรียน"],
            redFlagsTh: "มีคนป้อนข้าวให้อยู่ 4 บ้าน",
            greenFlagsTh: "การคอนเนคชันคือภาษารัก",
            description: "The Street CEO has identified your weaknesses and built a personal economy around them. They are <strong>Commanding</strong> because the room is a market and they're the closer, <strong>Hunter</strong> because every variable is being tracked, <strong>Bossy</strong> because the negotiation has already started without telling you, and <strong>Casual</strong> because rules are merely the opening offer. They aren't a con artist; they're just better at reading you than you are at reading them.",
            traits: [
                ["How They Show Love ❤️", "Love is delivered as a <strong>strategic alliance</strong>. They'll show up exactly when you need them, accept treats as a contractual gesture, and reward loyalty with the slow blink that opens markets."],
                ["How They Ask for Attention 👀", "By <strong>warm-up theater</strong>. A soft chirp, a calculated leg-rub, a sustained eye-contact pause — the ask is always wrapped, never bare."],
                ["Territory (The Fiefdom) 🏰", "Territory is a <strong>portfolio of relationships</strong>. They've mapped which neighbors keep treats, which doors open at 6pm, and which couches the visiting kids leave snacks on."],
                ["Energy Throughout the Day ⚡", "Steady and opportunistic. <strong>Effort is reserved for high-yield moments.</strong> If the situation has no upside, they're already napping."],
                ["Play Style 🧶", "Play is a <strong>negotiation</strong>. They'll engage with a wand for thirty seconds, then walk off mid-pounce — proof that you can be replaced."],
                ["Reaction to Change 📦", "Change is a <strong>repricing event</strong>. New furniture? They're the first to try the new sleeping spot, before you've decided where it goes."],
                ["Relationship with Other Cats 🐈", "Allies, rivals, junior partners. They form <strong>working relationships</strong>, not friendships. Hierarchy is fluid but tracked."],
            ],
            descriptionTh: "แมวที่อ่านจุดอ่อนของคุณออกแล้วสร้างเศรษฐกิจส่วนตัวรอบๆ มัน <strong>ออกหน้า</strong> เพราะห้องคือตลาดและเขาคือคนปิดดีล <strong>นักล่า</strong> เพราะจับตาดูทุกตัวแปร <strong>คุมเกม</strong> เพราะการต่อรองเริ่มไปแล้วโดยที่คุณยังไม่รู้ตัว <strong>ฟรีสไตล์</strong> เพราะกฎเป็นแค่ราคาเปิด ไม่ใช่นักต้มตุ๋น แค่เก่งอ่านคนกว่าคุณอ่านเขาเท่านั้น",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักแบบเป็นพันธมิตรเชิงกลยุทธ์</strong> โผล่มาตรงเวลาที่คุณต้องการ รับขนมเหมือนเซ็นสัญญา และตอบแทนความภักดีด้วยการกระพริบตาช้าๆ"],
                ["👀 การเรียกร้องความสนใจ", "<strong>เรียกแบบมีฉากนำ</strong> ส่งเสียงเบาๆ ถูขาเป็นจังหวะ จ้องตานิ่งสักครู่ คำขอจะถูกห่อหุ้มมาเสมอ ไม่เคยมาแบบโต้งๆ"],
                ["🏰 อาณาเขต", "<strong>มองอาณาเขตเป็นพอร์ตความสัมพันธ์</strong> รู้ว่าบ้านไหนมีขนม ประตูไหนเปิดตอนหกโมง และโซฟาไหนที่เด็กมักทำขนมหล่น"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>คงที่แต่ฉวยโอกาส</strong> เก็บแรงไว้สำหรับจังหวะที่คุ้ม ถ้าไม่มีอะไรได้ ก็นอนไปก่อนเลย"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นคือการต่อรอง</strong> เล่นไม้ตกแมวสามสิบวินาที แล้วเดินจากไปกลางคัน เพื่อพิสูจน์ว่าคุณถูกแทนที่ได้"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>มองเป็นโอกาสตั้งราคาใหม่</strong> เฟอร์นิเจอร์ชิ้นใหม่มาถึง เป็นตัวแรกที่ขึ้นไปลองนอน ก่อนคุณตัดสินใจวางตำแหน่งด้วยซ้ำ"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>มีพันธมิตร คู่แข่ง และลูกน้อง</strong> สร้างความสัมพันธ์เชิงงาน ไม่ใช่มิตรภาพ ลำดับชั้นเปลี่ยนได้ แต่ติดตามตลอด"],
            ],
        
            duringEvents: {
          "dinner": "Negotiates for a 15% tuna increase.",
          "facetime": "Tries to sell your boss a subscription to his purr.",
          "guests": "Networking. Already has their contact info."
},
            duringEventsTh: {
          "dinner": "กำลังเจรจาขอเพิ่มทูน่า 15%",
          "facetime": "พยายามขายแพ็กเกจเสียงครางให้เจ้านายคุณ",
          "guests": "สร้างคอนเนกชัน มีข้อมูลติดต่อแขกครบแล้ว"
},
                        behavioralHooks: {
                mostLikelyTo: ["Convince you he hasn't been fed in 3 years.", "Sublet your favorite chair to the neighbor's cat.", "Bribe the dog."],
                textsLike: ["U up? (to the person holding treats)", "Let's circle back to the tuna increase.", "I can get u the premium kibble for half price. DM me."],
                secretWeakness: "Squeaky toys. They break his cool persona.",
                whenStressed: "Begins a high-pressure negotiation for extra treats.",
                at2AM: "Checking if the fridge door was left ajar by a 'careless' human.",
                corporateSurvivalRate: "85% (Would be fired for embezzlement, but he owns the company now.)",
                emotionalSupportObject: "A crinkly receipt he stole from your wallet."
            ,
                mostLikelyToHuman: ["Negotiate a discount at a chain restaurant.", "Have 4 side hustles and zero sleep.", "Mention 'networking' in their Tinder bio."],
                emotionalSupportObjectHuman: "An external battery pack."},
            behavioralHooksTh: {
                mostLikelyTo: ["โน้มน้าวให้คุณเชื่อว่าไม่ได้กินข้าวมา 3 ปี", "ปล่อยเช่าเก้าอี้ตัวโปรดของคุณให้แมวข้างบ้าน", "ติดสินบนหมา"],
                textsLike: ["ตื่นยัง? (ทักคนที่ถือถุงขนม)", "เดี๋ยวย้อนกลับมาคุยเรื่องเพิ่มทูน่าอีกทีนะ", "เราดีลอาหารเม็ดเกรดพรีเมียมให้ได้ครึ่งราคา ทักแชทมา"],
                secretWeakness: "ตุ๊กตามีเสียงปิ๊บๆ ได้ยินแล้วเสียมาดมาเฟียหมด",
                whenStressed: "เริ่มใช้กลยุทธ์ต่อรองขั้นสูงเพื่อขอขนมเพิ่ม",
                at2AM: "เดินไปเช็กว่าน้อนเจ้าของปิดประตูตู้เย็นสนิทหรือเปล่า",
                corporateSurvivalRate: "85% (อาจถูกไล่ออกฐานยักยอกทูน่า แต่ตอนนี้เขาเทคโอเวอร์บริษัทไปแล้ว)",
                emotionalSupportObject: "ใบเสร็จยับๆ ที่แอบจิ๊กมาจากกระเป๋าตังค์คุณ"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "CHBC", blurb: "A merger of two empires. You both agree that nap time is for people who lack vision.", blurbTh: "การควบรวมสองอาณาจักร เห็นพ้องตรงกันว่าการนอนกลางวันมีไว้สำหรับคนที่ไม่มีวิสัยทัศน์เท่านั้น" },
                worstMatch: { type: "SDNR", blurb: "They want to 'feel' the vibes. You want to 'scale' the vibes. It's a fundamental mismatch.", blurbTh: "เขาอยาก 'ดื่มด่ำ' กับฟีลลิ่ง แต่คุณอยาก 'สเกล' ฟีลลิ่ง คุยกันคนละภาษาแน่นอน" },
                chaosPair: { type: "CDBC", blurb: "A 24/7 pitch competition. Neither of you ever yields the floor.", blurbTh: "การแข่งขัน Pitch Deck ตลอด 24 ชั่วโมง ไม่มีใครยอมลงจากเวทีเลยสักคน" },
                emotionalSupport: { type: "SDNC", blurb: "The only being that can make you stop checking your notifications. Pure, unadulterated chill.", blurbTh: "สิ่งเดียวที่ทำให้คุณหยุดเช็กแจ้งเตือนได้ ความชิลล์ที่แท้ทรูแบบไม่ต้องปรุงแต่ง" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHBC", blurb: "You provide the vision, they provide the execution. You're basically a Fortune 500 company in one apartment.", blurbTh: "คุณวางวิสัยทัศน์ เขาลงมือทำ อยู่ด้วยกันเหมือนยกบริษัท Fortune 500 มาไว้ในห้อง" },
                mutualEnablers: { type: "CHNC", blurb: "You'll start a business together at 3 AM and forget about it by 10 AM.", blurbTh: "เริ่มทำธุรกิจด้วยกันตอนตี 3 แล้วก็ลืมมันไปตอน 10 โมงเช้า" },
                exhaustingDuo: { type: "CHBR", blurb: "The struggle for dominance is real. Who gets to decide the lunch spot? No one wins.", blurbTh: "ศึกชิงความเป็นใหญ่ ใครจะได้เลือกร้านมื้อเที่ยง? สรุปคือไม่มีใครชนะ" },
                bannedFromDiscord: { type: "CDBR", blurb: "Too much 'disruptive energy'. You tried to monetize the meme channel and got kicked.", blurbTh: "พลังงาน 'Disruptive' ล้นเกินไป พยายามหาเงินจากห้องมีมจนโดนแบน" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A beta version with too many features and zero documentation.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: เวอร์ชัน Beta ที่ฟีเจอร์เยอะจัดแต่ไม่มีคู่มือ"}, {"en": "Social battery: Powered by caffeine and the prospect of a high-yield conversation.", "th": "โซเชียลแบต: ขับเคลื่อนด้วยคาเฟอีนและโอกาสที่จะได้คุยเรื่องที่คุ้มค่า"}, {"en": "Today you are likely to: Accidentally start a LinkedIn discourse.", "th": "วันนี้คุณมีแนวโน้มจะ: เผลอไปเริ่มดราม่าใน LinkedIn โดยไม่ได้ตั้งใจ"}, {"en": "Current mood: 'Let's take this offline' but permanently.", "th": "อารมณ์ตอนนี้: 'เดี๋ยวเราไปคุยนอกรอบกันนะ' แต่หมายถึงนอกรอบแบบตลอดกาล"}, {"en": "Energy level: High frequency, low patience.", "th": "ระดับพลังงาน: ความถี่สูง ความอดทนต่ำ"}, {"en": "Today's vibe: Hustle culture, but make it aesthetic.", "th": "ฟีลวันนี้: วัฒนธรรมปั่นงาน แต่ขอแบบคุมโทนสวยๆ"}, {"en": "Likely activity: Checking your bank account just to feel something.", "th": "กิจกรรมที่น่าจะทำ: เช็กยอดเงินในบัญชีเพื่อให้รู้สึกว่ายังมีชีวิตอยู่"}, {"en": "Communication style: Voice notes at 1.5x speed.", "th": "สไตล์การสื่อสาร: ส่งข้อความเสียงด้วยความเร็ว 1.5 เท่า"}, {"en": "Internal monologue: 'Is this scalable or am I wasting my time?'", "th": "เสียงในหัว: 'สิ่งนี้สเกลได้มั้ย หรือฉันกำลังเสียเวลาเปล่า?'"}, {"en": "Stress response: Buying a new domain name for a project you'll never start.", "th": "ปฏิกิริยาต่อความเครียด: ซื้อโดเมนเนมใหม่ให้โปรเจกต์ที่จะไม่มีวันเริ่มทำ"}, {"en": "Survival strategy: Dissociation and expensive matcha.", "th": "กลยุทธ์การเอาตัวรอด: การถอดจิตและมัทฉะราคาแพง"}, {"en": "Today's catchphrase: 'What's the ROI on this interaction?'", "th": "ประโยคเด็ดวันนี้: 'คุยกับคนนี้แล้วได้ ROI เท่าไหร่?'"}, {"en": "Hidden craving: A nap that isn't 'strategic'.", "th": "ความปรารถนาลึกๆ: การนอนงีบที่ไม่ได้อยู่ในแผนกลยุทธ์"}, {"en": "2 AM thought: 'I should probably sleep, but what if I solve everything right now?'", "th": "ความคิดตอนตี 2: 'ควรนอนนะ แต่ถ้าแก้ปัญหาทุกอย่างได้ตอนนี้เลยล่ะ?'"}, {"en": "Identity hook: The one who unironically uses 'KPIs' for their fitness goals.", "th": "นิยามตัวเอง: คนที่ใช้คำว่า 'KPI' กับเป้าหมายการออกกำลังกาย"}],
dailyObservations: [{"en": "Current status: Negotiating a 15% tuna increase with the management.", "th": "สถานะปัจจุบัน: กำลังเจรจาขอเพิ่มส่วนแบ่งทูน่า 15% กับฝ่ายบริหาร"}, {"en": "Social battery: 100% if there's a deal to be made.", "th": "โซเชียลแบต: 100% ถ้ามีดีลที่น่าสนใจ"}, {"en": "Likely crime today: Insider trading (knowing where you hide the treats).", "th": "อาชญากรรมที่น่าจะเกิด: ใช้ข้อมูลภายใน (รู้ว่าคุณแอบซ่อนขนมไว้ไหน)"}, {"en": "Attention demands: Strategic. I'll call you.", "th": "ความต้องการความสนใจ: ตามกลยุทธ์ เดี๋ยวฉันทักไปเอง"}, {"en": "Emotional weather: Sunny with a high chance of networking.", "th": "พยากรณ์อารมณ์: สดใส พร้อมสร้างคอนเนกชันใหม่ๆ"}, {"en": "3 AM activity: Re-pricing the household furniture.", "th": "กิจกรรมตอนตี 3: ประเมินราคาเฟอร์นิเจอร์ในบ้านใหม่"}, {"en": "Personal space: A fluid concept depending on your snack holdings.", "th": "พื้นที่ส่วนตัว: แนวคิดที่ยืดหยุ่นตามจำนวนขนมในมือคุณ"}, {"en": "Logic level: High. Everything is a transaction.", "th": "ระดับตรรกะ: สูง ทุกอย่างคือการแลกเปลี่ยน"}, {"en": "Motivation: Monopoly on the sunbeam market.", "th": "แรงจูงใจ: ผูกขาดตลาดแสงแดดส่องถึงในบ้าน"}, {"en": "Preferred seating: Somewhere I can look busy while doing nothing.", "th": "ที่นั่งโปรด: ที่ที่ดูเหมือนกำลังยุ่ง ทั้งที่ไม่ได้ทำอะไรเลย"}, {"en": "Response to 'pspsps': Is there a referral bonus?", "th": "ปฏิกิริยาต่อ 'ชิชิ': มีค่าแนะนำหรือเปล่าล่ะ?"}, {"en": "Goal for the day: Subletting the cat tree to the neighbor's cat.", "th": "เป้าหมายวันนี้: ปล่อยเช่าคอนโดแมวให้แมวข้างบ้าน"}, {"en": "Secret talent: Opening cabinet doors with zero evidence.", "th": "พรสวรรค์ลับ: เปิดประตูตู้ได้โดยไม่ทิ้งหลักฐาน"}, {"en": "Communication style: Persuasive chirps and high-pressure purring.", "th": "สไตล์การสื่อสาร: ร้องจิ๊บๆ แบบโน้มน้าวใจ และครางกดดันขั้นสุด"}, {"en": "Stress level: Low, as long as the cash (treats) flows.", "th": "ระดับความเครียด: ต่ำ ตราบใดที่กระแสเงินสด (ขนม) ยังไหลเวียนดี"}, {"en": "Diet: Whatever is on your plate, plus 20% commission.", "th": "โภชนาการ: อะไรก็ได้บนจานคุณ บวกค่าคอมมิชชันอีก 20%"}, {"en": "Floor relationship: It's a stage for my next presentation.", "th": "ความสัมพันธ์กับพื้น: คือเวทีสำหรับพรีเซนต์งานครั้งต่อไป"}, {"en": "Intelligence report: Already has your credit card info (for research).", "th": "รายงานกรอง: มีเลขบัตรเครดิตคุณแล้ว (เอาไว้ทำวิจัยน่ะ)"}, {"en": "Main character energy: The charismatic founder of a cult of one.", "th": "พลังงานตัวเอก: ผู้ก่อตั้งลัทธิที่มีเสน่ห์ดึงดูด (สมาชิกคือตัวเอง)"}, {"en": "Internal monologue: 'This head-rub is part of a larger multi-year strategy.'", "th": "เสียงในหัว: 'การให้ถูหัวครั้งนี้เป็นส่วนหนึ่งของยุทธศาสตร์ระยะยาว'"}],
compatibility: {
                bestMatch: { type: "CDBC", blurb: "The ultimate nap-time duo.", blurbTh: "คู่หูนอนกลางวัน พากันหลับปุ๋ยทั้งวัน" },
                chaosPair: { type: "CHNC", blurb: "Double the trouble, double the cute.", blurbTh: "คูณสองความแสบ แต่ก็น่ารักจนโกรธไม่ลง" },
                secretTwin: { type: "SHBC", blurb: "Mirror images in every whisker twitch.", blurbTh: "ฝาแฝดที่ขยับหนวดพร้อมกันโดยไม่ได้นัดหมาย" },
                worstRoommate: { type: "SDNR", blurb: "Too much drama for one scratching post.", blurbTh: "ดราม่าเยอะเกินกว่าที่ที่ฝนเล็บอันเดียวจะรับไหว" }
            },
          },
        {
            code: "CHNR",
            name: "The Affectionate Warden",
            tagline: "Loves you fiercely and on a strict schedule.",
            emoji: "🫶",
            color: "#D94E8C",
            bg: "#FFD6E6",
            vibes: ["Clingy", "Routine-Obsessed", "Gentle Bully", "Mandatory Cuddler"],
            famouslySays: "You will be loved at 7:42pm. No exceptions.",
            kindredSpirits: ["a Pinterest mom", "Monica Geller", "your sweetest, scariest aunt"],
            redFlags: "Wakes you up to make sure you're alive.",
            greenFlags: "Knows your sleep schedule better than you.",
            nameTh: "ผู้คุมสายอบอุ่น",
            taglineTh: "รักเราสุดใจ ตามตารางที่กำหนดไว้เป๊ะๆ",
            vibesTh: ["ติดหนึบ", "ยึดกิจวัตร", "บุลลี่อ่อนๆ", "บังคับกอด"],
            famouslySaysTh: "ทุ่มสี่สิบสองจะรักนะ ห้ามเลื่อน",
            kindredSpiritsTh: ["แม่บ้านสาย Pinterest", "Monica Geller", "ป้าที่หวานสุดและน่ากลัวสุด"],
            redFlagsTh: "ปลุกตอนกลางคืนเพื่อเช็กว่ายังหายใจ",
            greenFlagsTh: "รู้ตารางนอนเราดีกว่าตัวเราเอง",
            description: "The Affectionate Warden loves you with an iron timetable. They are <strong>Commanding</strong> because love is a presence that must be felt, <strong>Hunter</strong> because every behavioral shift in the household is logged, <strong>Nurturing</strong> because the love is real and the bowl is sacred, and <strong>Regal</strong> because dinner is at 6:42 — not 6:43, not 6:41. They're not controlling; they're just deeply invested in making sure you're alright.",
            traits: [
                ["How They Show Love ❤️", "Love is delivered as <strong>scheduled care</strong>. They'll wake you at the same hour every day to confirm you're alive, then settle into your lap for the morning shift."],
                ["How They Ask for Attention 👀", "Through <strong>direct eye contact and small ceremonial sounds</strong>. A trill at the doorway. A meow at the food bowl. Each utterance has a meaning, and they expect you to know which one."],
                ["Territory (The Fiefdom) 🏰", "Territory is a <strong>well-defined home</strong>, with their humans inside it. Visitors are observed and assessed. The perimeter is a circle of trust, not space."],
                ["Energy Throughout the Day ⚡", "Predictable and warm. <strong>Mornings are for supervision, afternoons for sleep, evenings for soft enforcement.</strong> The day has a shape."],
                ["Play Style 🧶", "Play is a <strong>shared activity</strong>. They want you involved. Solo play exists but is brief — the wand only feels alive when you're holding it."],
                ["Reaction to Change 📦", "Change is met with <strong>gentle protest</strong>. A new schedule will be questioned. A new piece of furniture will be inspected, then quietly re-integrated into the routine."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>juniors to be supervised</strong>. They aren't aggressive, but everyone in the household knows who runs the bedtime check."],
            ],
            descriptionTh: "แมวที่รักคุณตามตารางเหล็ก จัดเป็น <strong>ออกหน้า</strong> เพราะความรักต้องรู้สึกได้ <strong>นักล่า</strong> เพราะจดจำพฤติกรรมในบ้านทุกการเปลี่ยน <strong>ขี้ห่วง</strong> เพราะรักของจริงและชามข้าวคือสิ่งศักดิ์สิทธิ์ <strong>เจ้าระเบียบ</strong> เพราะข้าวเย็นต้องหกโมงสี่สิบสองนาที ไม่ใช่หกโมงสี่สิบสาม ไม่ได้เจ้ากี้เจ้าการ แค่ลงทุนกับการดูแลคุณเต็มที่",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักแบบดูแลตามตาราง</strong> ปลุกคุณเวลาเดิมทุกวันเพื่อเช็กว่ายังหายใจอยู่ แล้วลงมานอนตักช่วงเช้า"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ใช้เสียงเล็กๆ และการจ้องตา</strong> ร้องที่ประตู ร้องที่ชาม แต่ละเสียงมีความหมาย และคาดหวังให้คุณแยกออก"],
                ["🏰 อาณาเขต", "<strong>บ้านที่ชัดเจนกับคนของเขาอยู่ข้างใน</strong> แขกถูกประเมินก่อนเสมอ แนวเขตคือวงไว้ใจ ไม่ใช่พื้นที่"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>คาดเดาได้และอบอุ่น</strong> เช้าตรวจการ บ่ายนอน เย็นบังคับเบาๆ วันมีรูปทรงของมัน"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นต้องเล่นด้วยกัน</strong> เล่นคนเดียวก็ได้แต่ไม่นาน ไม้ตกแมวรู้สึกมีชีวิตก็ต่อเมื่อคุณถืออยู่"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>ประท้วงเบาๆ</strong> ตารางเปลี่ยนต้องตั้งคำถาม เฟอร์นิเจอร์ใหม่ต้องตรวจ แล้วค่อยเอามาผสมในรูทีน"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>มองตัวอื่นเป็นรุ่นน้องที่ต้องดูแล</strong> ไม่ก้าวร้าว แต่ทุกตัวในบ้านรู้ว่าใครเป็นคนเช็กก่อนนอน"],
            ],
        
            duringEvents: {
          "dinner": "Ensures you chew your food properly.",
          "zoomies": "Herds you to safety during the chaos.",
          "guests": "Assigns them a seat and expects them to stay there."
},
            duringEventsTh: {
          "dinner": "คุมให้คุณเคี้ยวอาหารให้ละเอียด",
          "zoomies": "ต้อนคุณไปที่ปลอดภัยระหว่างเกิดความวุ่นวาย",
          "guests": "จัดที่นั่งให้แขกและคาดหวังให้อยู่ตรงนั้น"
},
                        behavioralHooks: {
                mostLikelyTo: ["Wake you up just to make sure you're breathing.", "Ban you from the kitchen for your own safety.", "Aggressively groom your hair."],
                textsLike: ["Drink water.", "Are you home yet? It's 6:01.", "I love you. Don't move. I'm sitting on you."],
                secretWeakness: "Baby talk. He pretends to hate it but starts purring.",
                whenStressed: "Sits on your face so you can't leave the house.",
                at2AM: "Staring at you from the pillow to ensure your vitals are stable.",
                corporateSurvivalRate: "95% (The office mom who actually runs the place.)",
                emotionalSupportObject: "Your favorite sweater (it's covered in his fur now)."
            ,
                mostLikelyToHuman: ["Send a 'checking in' text at exactly 9 AM.", "Organize your birthday party 6 months in advance.", "Ask 'Are you mad at me?' if you use a period in a text."],
                emotionalSupportObjectHuman: "A high-end label maker."},
            behavioralHooksTh: {
                mostLikelyTo: ["ปลุกคุณขึ้นมาเพื่อเช็กว่ายังหายใจอยู่ไหม", "แบนคุณออกจากครัวเพื่อความปลอดภัยของคุณเอง", "เลียผมคุณอย่างเอาเป็นเอาตาย"],
                textsLike: ["ดื่มน้ำด้วยนะ", "ถึงบ้านยัง? นี่มัน 18:01 แล้วนะ", "รักนะ ห้ามขยับ กำลังนั่งทับอยู่"],
                secretWeakness: "เสียงสองที่เจ้าของชอบใช้ แกล้งทำเป็นรำคาญแต่เผลอครางครืดๆ ทุกที",
                whenStressed: "นั่งทับหน้าคุณไว้เพื่อไม่ให้คุณออกไปไหน",
                at2AM: "จ้องหน้าคุณจากบนหมอนเพื่อให้แน่ใจว่าสัญญาณชีพยังปกติ",
                corporateSurvivalRate: "95% (ตัวแม่ประจำออฟฟิศที่จริงๆ แล้วเป็นคนคุมทุกอย่าง)",
                emotionalSupportObject: "เสื้อกันหนาวตัวโปรดของคุณ (ที่ตอนนี้กลายเป็นเสื้อขนแมวไปแล้ว)"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SHNR", blurb: "You provide the schedule, they provide the loyalty. A fortress of routine.", blurbTh: "คุณวางตาราง เขาให้ความซื่อสัตย์ เป็นป้อมปราการแห่งกิจวัตรที่แข็งแกร่ง" },
                worstMatch: { type: "CHNC", blurb: "They think schedules are suggestions. You think they are laws. Tears will be shed.", blurbTh: "เขาคิดว่าตารางเวลาคือคำแนะนำ แต่คุณคิดว่ามันคือกฎหมาย เตรียมตัวเสียน้ำตาได้เลย" },
                chaosPair: { type: "CDBR", blurb: "You'll spend all day organizing a space that they will immediately 'optimize' into chaos.", blurbTh: "คุณใช้เวลาทั้งวันจัดห้องให้เป๊ะ แต่เขาจะเข้ามา 'ปรับปรุง' ให้กลายเป็นความวุ่นวายทันที" },
                emotionalSupport: { type: "SDNR", blurb: "Two anxiety-driven beings protecting each other from the scary outside world.", blurbTh: "สิ่งมีชีวิตขี้กังวลสองตัวที่คอยปกป้องกันและกันจากโลกภายนอกที่แสนน่ากลัว" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHBR", blurb: "The 'Keepers of the Plan'. You're the only ones who know where the first aid kit is.", blurbTh: "ผู้รักษาแผนการ มีแค่พวกคุณสองคนที่รู้ว่าชุดปฐมพยาบาลซ่อนอยู่ตรงไหน" },
                mutualEnablers: { type: "SDNR", blurb: "You'll spend the entire evening over-analyzing why your mutual friend didn't like your post.", blurbTh: "ใช้เวลาทั้งคืนวิเคราะห์ว่าทำไมเพื่อนเราถึงไม่มากดไลก์โพสต์เรา" },
                exhaustingDuo: { type: "CHNR", blurb: "Too much care. You're both trying to be the 'Office Mom' and the kitchen isn't big enough.", blurbTh: "ดูแลเก่งเกินไป พยายามจะเป็น 'แม่ประจำออฟฟิศ' ทั้งคู่ ห้องครัวมันเล็กไปนะ" },
                bannedFromDiscord: { type: "SHNC", blurb: "You tried to enforce too many rules in the general chat. The rebellion was swift.", blurbTh: "พยายามตั้งกฎเยอะเกินไปในห้องแชททั่วไป จนโดนปฏิวัติอย่างรวดเร็ว" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A mandatory software update that you can't postpone.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: การอัปเดตซอฟต์แวร์แบบบังคับที่เลื่อนไม่ได้"}, {"en": "Social battery: Reserved exclusively for people who follow the group chat rules.", "th": "โซเชียลแบต: สำรองไว้ให้คนที่ทำตามกฎของแชทกลุ่มเท่านั้น"}, {"en": "Today you are likely to: Clean something that was already clean.", "th": "วันนี้คุณมีแนวโน้มจะ: ทำความสะอาดของที่มันสะอาดอยู่แล้ว"}, {"en": "Current mood: 'Did you drink water today?' energy.", "th": "อารมณ์ตอนนี้: พลังงานแบบ 'วันนี้ดื่มน้ำหรือยังจ๊ะ?'"}, {"en": "Energy level: High-functioning anxiety masked as productivity.", "th": "ระดับพลังงาน: ความกังวลที่แสดงออกผ่านการทำงานหนัก"}, {"en": "Today's vibe: Organizing the spice rack while crying.", "th": "ฟีลวันนี้: นั่งจัดชั้นเครื่องเทศไป ร้องไห้ไป"}, {"en": "Likely activity: Sending a 'checking in' text that feels like a wellness check.", "th": "กิจกรรมที่น่าจะทำ: ทักไปถามว่า 'เป็นไงบ้าง' ที่ให้ความรู้สึกเหมือนตำรวจมาตรวจ"}, {"en": "Communication style: Heart emojis followed by a very specific instruction.", "th": "สไตล์การสื่อสาร: ส่งอิโมจิหัวใจ ตามด้วยคำสั่งที่ละเอียดมาก"}, {"en": "Internal monologue: 'I'm not controlling, I'm just helping everyone not fail.'", "th": "เสียงในหัว: 'ไม่ได้เจ้ากี้เจ้าการนะ แค่ช่วยให้ทุกคนไม่พังเท่านั้นเอง'"}, {"en": "Stress response: Making a list of things you've already finished just to cross them off.", "th": "ปฏิกิริยาต่อความเครียด: เขียนลิสต์สิ่งที่ทำเสร็จไปแล้วเพื่อที่จะได้ขีดฆ่าทิ้ง"}, {"en": "Survival strategy: Essential oils and a strict 10 PM bedtime.", "th": "กลยุทธ์การเอาตัวรอด: น้ำมันหอมระเหยและการนอนตอนสี่ทุ่มเป๊ะ"}, {"en": "Today's catchphrase: 'Actually, the original plan said 7:00, not 7:05.'", "th": "ประโยคเด็ดวันนี้: 'จริงๆ แล้วแผนเดิมคือทุ่มตรงนะ ไม่ใช่ทุ่มห้านาที'"}, {"en": "Hidden craving: Someone to take care of YOU for once.", "th": "ความปรารถนาลึกๆ: อยากให้ใครสักคนมาดูแลเราบ้างสักครั้ง"}, {"en": "2 AM thought: 'Is the front door locked? Let me check for the fourth time.'", "th": "ความคิดตอนตี 2: 'ล็อคประตูหน้าบ้านหรือยังนะ? เดี๋ยวไปเช็กเป็นรอบที่สี่ก่อน'"}, {"en": "Identity hook: The human equivalent of a warm blanket that also tells you what to do.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันผ้าห่มอุ่นๆ ที่คอยบอกว่าคุณต้องทำอะไร"}],
dailyObservations: [{"en": "Current status: Enforcing mandatory cuddle hours.", "th": "สถานะปัจจุบัน: บังคับใช้ชั่วโมงการกอดแบบเลี่ยงไม่ได้"}, {"en": "Social battery: Overcharged and ready to stick to you like velcro.", "th": "โซเชียลแบต: ชาร์จเต็มพิกัด พร้อมติดหนึบเหมือนตีนตุ๊กแก"}, {"en": "Likely crime today: Kidnapping (not letting you leave the house).", "th": "อาชญากรรมที่น่าจะเกิด: ลักพาตัว (ไม่ยอมให้คุณออกจากบ้าน)"}, {"en": "Attention demands: Constant, heavy, and emotionally taxing.", "th": "ความต้องการความสนใจ: ตลอดเวลา หนักหน่วง และกดดันทางอารมณ์"}, {"en": "Emotional weather: Overwhelmingly warm with a chance of clinginess.", "th": "พยากรณ์อารมณ์: อบอุ่นเกินต้านทาน มีโอกาสติดหนึบสูง"}, {"en": "3 AM activity: Staring at you to make sure you're still breathing.", "th": "กิจกรรมตอนตี 3: จ้องหน้าคุณเพื่อให้แน่ใจว่ายังหายใจอยู่"}, {"en": "Personal space: Does not exist in my dictionary.", "th": "พื้นที่ส่วนตัว: ไม่มีคำนี้ในพจนานุกรมของฉัน"}, {"en": "Logic level: Love-based logic only.", "th": "ระดับตรรกะ: ตรรกะสายรักล้วนๆ"}, {"en": "Motivation: Total emotional integration with the human.", "th": "แรงจูงใจ: รวมร่างทางอารมณ์กับมนุษย์ให้สมบูรณ์แบบ"}, {"en": "Preferred seating: Directly on your face or keyboard.", "th": "ที่นั่งโปรด: บนหน้าคุณ หรือไม่ก็บนคีย์บอร์ด"}, {"en": "Response to 'pspsps': Already there before you finished the first 'ps'.", "th": "ปฏิกิริยาต่อ 'ชิชิ': โผล่มาถึงตั้งแต่ยังเรียกไม่จบคำแรก"}, {"en": "Goal for the day: Being involved in 100% of your activities.", "th": "เป้าหมายวันนี้: มีส่วนร่วมในทุกกิจกรรมของคุณ 100%"}, {"en": "Secret talent: Knowing exactly when you're thinking about moving.", "th": "พรสวรรค์ลับ: รู้ล่วงหน้าว่าคุณกำลังคิดจะลุกไปไหน"}, {"en": "Communication style: Persistent trills and demanding head-butts.", "th": "สไตล์การสื่อสาร: ร้องอ้อนรัวๆ และโขกหัวสั่งการ"}, {"en": "Stress level: High if a door is closed between us.", "th": "ระดับความเครียด: สูงปรี๊ดถ้ามีประตูกั้นกลางระหว่างเรา"}, {"en": "Diet: Love, attention, and your leftovers.", "th": "โภชนาการ: ความรัก ความสนใจ และของเหลือของคุณ"}, {"en": "Floor relationship: Only used as a path to reach your lap.", "th": "ความสัมพันธ์กับพื้น: มีไว้เป็นทางผ่านเพื่อไปสู่ตักคุณ"}, {"en": "Intelligence report: Knows your emotional triggers and uses them for treats.", "th": "รายงานกรอง: รู้จุดอ่อนทางอารมณ์ของคุณและใช้มันเพื่อขอขนม"}, {"en": "Main character energy: The hero who saves you from being alone for 2 seconds.", "th": "พลังงานตัวเอก: ฮีโร่ผู้ช่วยชีวิตคุณจากการต้องอยู่ลำพังเพียง 2 วินาที"}, {"en": "Internal monologue: 'If I lick their forehead enough, they will stay forever.'", "th": "เสียงในหัว: 'ถ้าเลียหน้าผากเขาบ่อยๆ เขาจะอยู่กับเราตลอดไป'"}],
compatibility: {
                bestMatch: { type: "SDBR", blurb: "Adventure awaits this purr-fect pair.", blurbTh: "คู่หูนักผจญภัย ออกท่องโลกกว้างไปด้วยกัน" },
                chaosPair: { type: "CDNC", blurb: "Unpredictable energy levels.", blurbTh: "พลังงานล้นเหลือ คาดเดาอะไรไม่ได้เลย" },
                secretTwin: { type: "SHNR", blurb: "Twin souls in different fur.", blurbTh: "จิตวิญญาณเดียวกัน แค่คนละสีขน" },
                worstRoommate: { type: "CHNC", blurb: "Constant battles over the sunbeam.", blurbTh: "ศึกชิงพื้นที่แสงแดดส่องถึงไม่มีวันจบสิ้น" }
            },
          },
        {
            code: "CHNC",
            name: "The Party Starter",
            tagline: "The room is boring. They will fix it.",
            emoji: "🎉",
            color: "#FFB000",
            bg: "#FFEFC2",
            vibes: ["Chaotic Good", "Zoomie Champion", "Talks A Lot", "Absolutely Unhinged"],
            famouslySays: "WAKE UP. WAKE UP. THE SUN IS DOING SOMETHING.",
            kindredSpirits: ["a golden retriever in a cat suit", "your most extroverted friend"],
            redFlags: "3am wall sprints.",
            greenFlags: "Genuinely thrilled to see you, every time.",
            nameTh: "ตัวเปิดปาร์ตี้",
            taglineTh: "ห้องนี้น่าเบื่อ เดี๋ยวจัดการให้",
            vibesTh: ["ป่วนแบบดี", "แชมป์วิ่งซูม", "พูดเก่ง", "หลุดโลกของจริง"],
            famouslySaysTh: "ตื่น! ตื่น! พระอาทิตย์กำลังทำอะไรบางอย่าง",
            kindredSpiritsTh: ["โกลเด้นรีทรีฟเวอร์ที่สวมชุดแมว", "เพื่อนที่เอ็กซ์โทรเวิร์ตสุดในกลุ่ม", "เด็กกิจกรรมในโรงเรียน"],
            redFlagsTh: "วิ่งไต่ผนังตอนตีสาม",
            greenFlagsTh: "ดีใจที่เจอเราจริงๆ ทุกครั้งไม่มีเฟค",
            description: "The Party Starter treats your living room like a stage that simply hadn't started yet. They are <strong>Commanding</strong> because their default state is engagement, <strong>Hunter</strong> because every passing moth is a fully-staged narrative arc, <strong>Nurturing</strong> because their chaos is offered to you as a gift, and <strong>Casual</strong> because rules are guidelines they'll consider after the zoomies. They're not trying to overwhelm you; they're just genuinely thrilled you exist.",
            traits: [
                ["How They Show Love ❤️", "Love looks like <strong>uninvited proximity at peak intensity</strong>. Expect ambush hugs, head-butts to the face, and a small body draped across your laptop the moment you start a meeting. The presence is the point."],
                ["How They Ask for Attention 👀", "By becoming <strong>structurally unignorable</strong>. They'll knock something over while making eye contact, then sprint to a different room expecting you to follow. The whole house is the megaphone."],
                ["Territory (The Fiefdom) 🏰", "Territory is <strong>fluid and ceremonial</strong>. Every room is theirs, every hour. They patrol but rarely defend — newcomers are interrogated with enthusiasm, not hostility."],
                ["Energy Throughout the Day ⚡", "Spiky and unpredictable. <strong>Eight hours of dead-asleep blob, ninety seconds of reckless joy, repeat.</strong> They burn brightest when the house is otherwise quiet."],
                ["Play Style 🧶", "Aggressively physical, no warm-up needed. Toys are launched, killed, and resurrected. They prefer <strong>anything that makes noise</strong> when batted across the floor at 2am."],
                ["Reaction to Change 📦", "Excellent. A new piece of furniture is a <strong>new stage</strong>. They'll be on top of it before the cardboard hits the recycling."],
                ["Relationship with Other Cats 🐈", "Confident and a little tone-deaf. They'll attempt to befriend the household elder by tackling them, which goes about as well as you'd expect."],
            ],
            descriptionTh: "แมวที่ปฏิบัติต่อห้องนั่งเล่นเหมือนเวทีที่รอเริ่มแสดง <strong>ออกหน้า</strong> เพราะโหมดปกติคือมีส่วนร่วม <strong>นักล่า</strong> เพราะผีเสื้อกลางคืนทุกตัวคือบทละครครบเรื่อง <strong>ขี้ห่วง</strong> เพราะความวุ่นวายคือของขวัญที่มอบให้คุณ <strong>ฟรีสไตล์</strong> เพราะกฎเป็นแค่คำแนะนำที่จะค่อยพิจารณาทีหลัง ไม่ได้พยายามทำให้คุณเหนื่อย แค่ดีใจสุดๆ ที่คุณมีอยู่จริง",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักแบบบุกประชิดเต็มกำลัง</strong> เตรียมรับการกอดแบบไม่ขออนุญาต โขกหัวใส่หน้า และร่างเล็กๆ ทอดยาวบนแล็ปท็อปทันทีที่เริ่มประชุม"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ทำตัวให้มองข้ามไม่ได้</strong> เขี่ยของตกพร้อมจ้องตาคุณ แล้ววิ่งไปอีกห้อง รอให้คุณตามไป ทั้งบ้านคือลำโพง"],
                ["🏰 อาณาเขต", "<strong>ลื่นไหลและเป็นพิธีกรรม</strong> ทุกห้องของเขา ทุกชั่วโมงด้วย ลาดตระเวนไปเรื่อยแต่ไม่ค่อยป้องกัน คนใหม่จะถูกซักถามด้วยความตื่นเต้น ไม่ใช่ความก้าวร้าว"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>เป็นจังหวะแหลมและคาดเดายาก</strong> นอนเป็นก้อนแปดชั่วโมง ตื่นมาบ้าระห่ำเก้าสิบวินาที วนซ้ำ พลุพลังที่แรงสุดมักมาตอนบ้านเงียบที่สุด"],
                ["🧶 สไตล์การเล่น", "<strong>ใช้แรงเต็มที่ ไม่ต้องวอร์ม</strong> ของเล่นถูกขว้าง ฆ่า แล้วชุบชีวิต ชอบของที่มีเสียงตอนตบไถลไปบนพื้นตอนตีสอง"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>รับมือเก่งมาก</strong> เฟอร์นิเจอร์ใหม่คือเวทีใหม่ ขึ้นไปยืนแล้วก่อนกล่องลังจะถึงถังรีไซเคิล"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>มั่นใจและอ่านสถานการณ์ไม่ค่อยเก่ง</strong> พยายามเป็นเพื่อนแมวอาวุโสด้วยการกระโจนเข้าใส่ ผลก็เป็นอย่างที่คุณนึกออก"],
            ],
        
            duringEvents: {
          "zoomies": "Defies the laws of physics. The couch is lava.",
          "facetime": "Screams directly into the microphone.",
          "guests": "Performs a one-cat musical. Expects applause."
},
            duringEventsTh: {
          "zoomies": "ทำลายกฎฟิสิกส์ โซฟาคือลาวา",
          "facetime": "กรีดร้องใส่ไมโครโฟนตรงๆ",
          "guests": "เล่นละครเวทีแมวเดี่ยว คาดหวังเสียงปรบมือ"
},
                        behavioralHooks: {
                mostLikelyTo: ["Get stuck in a paper bag and pretend it was intentional.", "Knock over a vase while maintaining eye contact.", "Throw a party at 3 AM."],
                textsLike: ["WAKE UP WAKE UP WAKE UP", "I found a fly!!!!!", "AAAAAAAAAAAAAAA (voice note of a meow)"],
                secretWeakness: "The vacuum cleaner. His only fear.",
                whenStressed: "The Zoomies. Extreme edition.",
                at2AM: "Parkour off the living room walls.",
                corporateSurvivalRate: "15% (HR has a 'no screaming during meetings' rule he cannot follow.)",
                emotionalSupportObject: "A single, dirty hair tie."
            ,
                mostLikelyToHuman: ["Suggest a spontaneous trip to Tokyo at 3 AM.", "Have 47 open tabs and know exactly where everything is.", "Accidentally start a viral trend by making a mistake."],
                emotionalSupportObjectHuman: "A ring light."},
            behavioralHooksTh: {
                mostLikelyTo: ["ติดในถุงกระดาษแล้วทำเป็นตั้งใจ", "ปัดแจกันตกพร้อมจ้องตาคุณไม่กะพริบ", "จัดปาร์ตี้ตอนตี 3"],
                textsLike: ["ตื่นๆๆๆๆๆๆๆๆ", "เจอแมลงวันตัวนึงแหละ!!!!!", "แง้ววววววววววววววววว (ส่งข้อความเสียงร้องเมี๊ยว)"],
                secretWeakness: "เครื่องดูดฝุ่น สิ่งเดียวในโลกที่เขากลัว",
                whenStressed: "วิ่งซูมมี่แบบคูณสอง ติดสปีดจนบ้านพัง",
                at2AM: "เล่นพาร์คัวร์ ไต่กำแพงห้องนั่งเล่น",
                corporateSurvivalRate: "15% (HR มีกฎว่า 'ห้ามกรีดร้องในที่ประชุม' ซึ่งน้อนทำไม่ได้)",
                emotionalSupportObject: "ยางมัดผมดำๆ เส้นเดียว"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDNC", blurb: "They watch your chaos with pure admiration. The ultimate hype-beast duo.", blurbTh: "เขาเฝ้าดูความป่วนของคุณด้วยความชื่นชม คู่หูสายไฮป์ที่แท้ทรู" },
                worstMatch: { type: "CHBR", blurb: "They are the principal, you are the student on detention. Constant conflict.", blurbTh: "เขาคือครูฝ่ายปกครอง ส่วนคุณคือนักเรียนที่โดนกักบริเวณ ทะเลาะกันได้ทั้งวัน" },
                chaosPair: { type: "CHNC", blurb: "A firework factory during an earthquake. Nobody survives, but it's beautiful.", blurbTh: "เหมือนโรงงานพลุระเบิดตอนแผ่นดินไหว ไม่มีใครรอด แต่ภาพมันสวยมากนะ" },
                emotionalSupport: { type: "CDNR", blurb: "The only one who can talk you down from a 3 AM bad idea with a soft purr.", blurbTh: "คนเดียวที่กล่อมคุณให้เลิกทำเรื่องแผลงๆ ตอนตี 3 ได้ด้วยเสียงครางเบาๆ" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "CDNC", blurb: "Main Character Energy x2. You're the reason the party is still going at 5 AM.", blurbTh: "พลังตัวเอกคูณสอง พวกคุณคือเหตุผลที่ปาร์ตี้ยังลากยาวไปจนถึงตี 5" },
                mutualEnablers: { type: "SDBC", blurb: "One of you says 'should we?' and the other is already in the car. Zero self-control.", blurbTh: "คนนึงแค่ถามว่า 'เอาป่ะ?' อีกคนคือขึ้นรถไปแล้ว ยับยั้งชั่งใจคืออะไร ไม่รู้จัก" },
                exhaustingDuo: { type: "SDBR", blurb: "They want to discuss the meaning of life. You want to see how many grapes you can fit in your mouth.", blurbTh: "เขาอยากคุยเรื่องความหมายของชีวิต แต่คุณอยากลองว่าอมองุ่นได้กี่ลูกในคำเดียว" },
                bannedFromDiscord: { type: "CHBC", blurb: "You tried to organize a pyramid scheme as a joke. It wasn't funny to the admins.", blurbTh: "พยายามจัดตั้งแชร์ลูกโซ่เป็นมุกขำๆ แต่แอดมินเขาไม่ขำด้วยน่ะสิ" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A glitchy TikTok filter that makes everything look like a rave.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: ฟิลเตอร์ TikTok ที่พังๆ จนทุกอย่างดูเหมือนอยู่ในผับ"}, {"en": "Social battery: 400% but it's all fake energy from a sugar rush.", "th": "โซเชียลแบต: 400% แต่เป็นพลังงานปลอมๆ จากน้ำตาลล้วนๆ"}, {"en": "Today you are likely to: Start a hobby, buy all the equipment, and quit by dinner.", "th": "วันนี้คุณมีแนวโน้มจะ: เริ่มงานอดิเรกใหม่ ซื้ออุปกรณ์ครบเซ็ต แล้วเลิกทำก่อนมื้อเย็น"}, {"en": "Current mood: 'I'm here for a good time, not a long time.'", "th": "อารมณ์ตอนนี้: 'มาเพื่อเอาฮา ไม่ได้มาเพื่ออยู่นาน'"}, {"en": "Energy level: Unstable but entertaining.", "th": "ระดับพลังงาน: ไม่มั่นคงแต่สร้างความบันเทิงได้ดี"}, {"en": "Today's vibe: Sending voice notes of just screaming.", "th": "ฟีลวันนี้: ส่งข้อความเสียงที่มีแต่เสียงกรีดร้อง"}, {"en": "Likely activity: Googling 'can you eat this?' after already eating it.", "th": "กิจกรรมที่น่าจะทำ: เข้า Google ถามว่า 'สิ่งนี้กินได้มั้ย?' หลังจากกินเข้าไปแล้ว"}, {"en": "Communication style: Caps lock and excessive exclamation marks!!!!!!!!", "th": "สไตล์การสื่อสาร: พิมพ์ตัวใหญ่ล้วนและอิโมจิรัวๆ!!!!!!!!"}, {"en": "Internal monologue: 'If I stop moving, the boredom will catch me.'", "th": "เสียงในหัว: 'ถ้าหยุดเคลื่อนไหว ความน่าเบื่อจะตามทันเรา'"}, {"en": "Stress response: Spontaneous hair-dyeing or piercing.", "th": "ปฏิกิริยาต่อความเครียด: ย้อมสีผมใหม่กะทันหันหรือไม่ก็ไปเจาะเพิ่ม"}, {"en": "Survival strategy: Delusion and 47 open tabs.", "th": "กลยุทธ์การเอาตัวรอด: ความเบียวและแท็บที่เปิดค้างไว้ 47 แท็บ"}, {"en": "Today's catchphrase: 'It seemed like a good idea at the time!'", "th": "ประโยคเด็ดวันนี้: 'ตอนนั้นก็คิดว่ามันเป็นไอเดียที่ดีนะ!'"}, {"en": "Hidden craving: A high-five from a complete stranger.", "th": "ความปรารถนาลึกๆ: การแปะมือ High-five กับคนแปลกหน้า"}, {"en": "2 AM thought: 'I should definitely start a podcast about my life.'", "th": "ความคิดตอนตี 2: 'เราควรเริ่มทำพอดแคสต์เกี่ยวกับชีวิตตัวเองจริงๆ นะ'"}, {"en": "Identity hook: The human equivalent of a firework that went off indoors.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันพลุที่จุดระเบิดในร่ม"}],
dailyObservations: [{"en": "Current status: Living like every day is a 3-day weekend.", "th": "สถานะปัจจุบัน: ใช้ชีวิตเหมือนทุกวันคือวันหยุดยาว"}, {"en": "Social battery: 400%. Let's scream about it!", "th": "โซเชียลแบต: 400% มาตะโกนบอกชาวโลกกันเถอะ!"}, {"en": "Likely crime today: Public disturbance and reckless parkour.", "th": "อาชญากรรมที่น่าจะเกิด: ส่งเสียงรบกวนในที่สาธารณะและเล่นพาร์คัวร์แบบประมาท"}, {"en": "Attention demands: Urgent, chaotic, and physical.", "th": "ความต้องการความสนใจ: เร่งด่วน วุ่นวาย และต้องถึงเนื้อถึงตัว"}, {"en": "Emotional weather: Hurricane of pure, unfiltered joy.", "th": "พยากรณ์อารมณ์: พายุเฮอริเคนแห่งความสุขแบบไม่มีกั๊ก"}, {"en": "3 AM activity: The Grand Prix of the Living Room.", "th": "กิจกรรมตอนตี 3: การแข่งขันแกรนด์ปรีซ์รอบห้องนั่งเล่น"}, {"en": "Personal space: I'm in yours. Why aren't you in mine?", "th": "พื้นที่ส่วนตัว: ฉันอยู่ในพื้นที่คุณแล้ว ทำไมคุณไม่อยู่ในพื้นที่ฉันบ้างล่ะ?"}, {"en": "Logic level: Thoughts head empty, only zoomies.", "th": "ระดับตรรกะ: หัวสมองว่างเปล่า มีแต่ความดีด"}, {"en": "Motivation: If it moves, I must tackle it. If it doesn't move, I must tackle it anyway.", "th": "แรงจูงใจ: ถ้ามันขยับ ต้องพุ่งใส่ ถ้าไม่ขยับ ก็พุ่งใส่เหมือนกัน"}, {"en": "Preferred seating: Mid-air, usually between the fridge and your head.", "th": "ที่นั่งโปรด: กลางอากาศ ระหว่างตู้เย็นกับหัวของคุณ"}, {"en": "Response to 'pspsps': A full-speed tackle to the shins.", "th": "ปฏิกิริยาต่อ 'ชิชิ': พุ่งเข้าใส่แข้งขาด้วยความเร็วแสง"}, {"en": "Goal for the day: Catching that one specific moth. It knows what it did.", "th": "เป้าหมายวันนี้: จับมอธตัวนั้นให้ได้ มันรู้อยู่แก่ใจว่าทำอะไรไว้"}, {"en": "Secret talent: Teleporting. I was just in the kitchen, how am I on your head?", "th": "พรสวรรค์ลับ: เทเลพอร์ตได้ เมื่อกี้ยังอยู่ในครัว ตอนนี้มาอยู่บนหัวคุณได้ไง?"}, {"en": "Communication style: Unfiltered yelling and aggressive trilling.", "th": "สไตล์การสื่อสาร: ตะโกนแบบไม่กรอง และร้องอ้อนแบบดุดัน"}, {"en": "Stress level: Zero. The world is a playground.", "th": "ระดับความเครียด: ศูนย์ โลกใบนี้คือสนามเด็กเล่น"}, {"en": "Diet: Kibble, bugs, and pure adrenaline.", "th": "โภชนาการ: อาหารเม็ด แมลง และอะดรีนาลีนบริสุทธิ์"}, {"en": "Floor relationship: It's a launchpad, not a surface.", "th": "ความสัมพันธ์กับพื้น: มันคือแท่นปล่อยตัว ไม่ใช่แค่พื้นผิว"}, {"en": "Intelligence report: Too busy being happy to be smart.", "th": "รายงานกรอง: ยุ่งกับการมีความสุขจนไม่มีเวลาฉลาด"}, {"en": "Main character energy: The comic relief who somehow survives everything.", "th": "พลังงานตัวเอก: ตัวตลกที่ดันรอดตายมาได้ทุกสถานการณ์"}, {"en": "Internal monologue: 'WEEEEEEEEEEEEEEEEEEEEEEEE!'", "th": "เสียงในหัว: 'วู้วววววววววววววววววววว!'"}],
compatibility: {
                bestMatch: { type: "SDBC", blurb: "They keep you grounded... mostly.", blurbTh: "คนที่จะคอยดึงสติคุณ... ถ้าเขามีสตินะ" },
                chaosPair: { type: "CHBR", blurb: "Total chaos, but make it fashion.", blurbTh: "วุ่นวายสุดๆ แต่ก็ดูดีมีสไตล์นะจ๊ะ" },
                secretTwin: { type: "CDNC", blurb: "Same attitude, different day.", blurbTh: "นิสัยเป๊ะเหมือนกัน แค่แสดงออกคนละวัน" },
                worstRoommate: { type: "SHBR", blurb: "They never refill the water bowl.", blurbTh: "เมทนิสัยเสียที่ไม่เคยเติมน้ำในชามให้เลย" }
            },
          },
        {
            code: "CDBR",
            name: "The Visionary Supervisor",
            tagline: "Has Big Ideas about that empty Amazon box.",
            emoji: "📐",
            color: "#7A5BFF",
            bg: "#E2DBFF",
            vibes: ["Inventive", "Bossy", "Schemer", "Architecturally Curious"],
            famouslySays: "I have plans for the bookshelf.",
            kindredSpirits: ["an indie movie director", "Wes Anderson", "Lego enthusiasts"],
            redFlags: "Treats the curtain rod as a balance beam.",
            greenFlags: "Genuinely impressed by your weird ideas too.",
            nameTh: "หัวหน้าสายวิชวล",
            taglineTh: "มีไอเดียใหญ่ๆ กับกล่อง Amazon เปล่าใบนั้น",
            vibesTh: ["สายไอเดีย", "ชอบสั่ง", "นักวางแผน", "ชอบสำรวจโครงสร้าง"],
            famouslySaysTh: "มีแผนกับชั้นวางหนังสืออยู่",
            kindredSpiritsTh: ["ผู้กำกับหนังอินดี้", "Wes Anderson", "สายต่อเลโก้"],
            redFlagsTh: "ใช้ราวม่านเป็นคานทรงตัว",
            greenFlagsTh: "ทึ่งกับไอเดียแปลกๆ ของเราด้วยจริงๆ",
            description: "The Visionary Supervisor sees the apartment the way an architect sees a blank lot. They are <strong>Commanding</strong> because the household needs creative direction, <strong>Dreamer</strong> because the empty Amazon box is a building waiting to happen, <strong>Bossy</strong> because the vision must be implemented, and <strong>Regal</strong> because the construction must respect the daily nap schedule. They're not chaos; they're long-term planning with whiskers.",
            traits: [
                ["How They Show Love ❤️", "Love is shown by <strong>including you in the project</strong>. They'll lead you to the new fort behind the couch and demand you appreciate the structural integrity."],
                ["How They Ask for Attention 👀", "By <strong>relocating an object</strong>. A pen pushed off the desk. A key knocked under the rug. The ask is presented as a riddle for you to solve."],
                ["Territory (The Fiefdom) 🏰", "Territory is a <strong>multi-level installation</strong>. They've mapped vertical routes from the floor to the top of the bookshelf and back, with three approved nap stations along the way."],
                ["Energy Throughout the Day ⚡", "Bursts of focused build, followed by long observation periods. <strong>Most of the work happens while staring at a wall.</strong>"],
                ["Play Style 🧶", "Play is <strong>sculptural</strong>. Toys are arranged into compositions. The wand is fine, but the empty toilet roll has more potential."],
                ["Reaction to Change 📦", "Change is <strong>raw material</strong>. New furniture is a fresh canvas. A redecorated room is a creative invitation."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>supporting cast</strong>. They'll allow them in their territory but expect the supporting cast to stay out of the master plan."],
            ],
            descriptionTh: "แมวที่มองอพาร์ตเมนต์เหมือนสถาปนิกมองที่ดินเปล่า <strong>ออกหน้า</strong> เพราะบ้านต้องการทิศทางสร้างสรรค์ <strong>นักฝัน</strong> เพราะกล่อง Amazon เปล่าคือตึกที่รอสร้าง <strong>คุมเกม</strong> เพราะวิสัยทัศน์ต้องถูกนำไปใช้ <strong>เจ้าระเบียบ</strong> เพราะการก่อสร้างต้องเคารพตารางนอนรายวัน ไม่ได้วุ่นวาย แค่วางแผนระยะยาวพร้อมหนวด",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักด้วยการชวนคุณเข้าโครงการ</strong> พาไปดูป้อมใหม่หลังโซฟา แล้วเรียกร้องให้คุณชื่นชมความแข็งแรงของโครงสร้าง"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ขยับของแทนคำพูด</strong> เขี่ยปากกาตกโต๊ะ ตบกุญแจซ่อนใต้พรม คำขอถูกนำเสนอเป็นปริศนาให้คุณไขเอง"],
                ["🏰 อาณาเขต", "<strong>ติดตั้งหลายชั้น</strong> วางผังเส้นทางแนวตั้งจากพื้นถึงยอดชั้นวางหนังสือและกลับ พร้อมจุดงีบที่อนุมัติแล้วสามจุดระหว่างทาง"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>ระเบิดสร้างเป็นพักๆ สลับช่วงสังเกตยาว</strong> งานส่วนใหญ่เกิดขึ้นตอนจ้องผนังนิ่งๆ"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นคือการประติมากรรม</strong> ของเล่นถูกจัดวางเป็นองค์ประกอบ ไม้ตกแมวก็ใช้ได้ แต่แกนทิชชู่เปล่ามีศักยภาพมากกว่า"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>มองเป็นวัตถุดิบ</strong> เฟอร์นิเจอร์ใหม่คือผ้าใบเปล่า ห้องที่ตกแต่งใหม่คือคำเชิญสร้างสรรค์"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>ตัวอื่นคือนักแสดงสมทบ</strong> อยู่ในอาณาเขตได้ แต่คาดหวังให้อยู่นอกแผนใหญ่"],
            ],
        
            duringEvents: {
          "dinner": "Critiques the structural integrity of your meal.",
          "guests": "Explains how the living room could be optimized.",
          "zoomies": "Calculated trajectory mapping. Not just running."
},
            duringEventsTh: {
          "dinner": "วิจารณ์โครงสร้างมื้ออาหารของคุณ",
          "guests": "อธิบายวิธีปรับปรุงห้องนั่งเล่นให้ดีขึ้น",
          "zoomies": "คำนวณวิถีวิ่งอย่างรอบคอบ ไม่ใช่แค่วิ่งมั่ว"
},
                        behavioralHooks: {
                mostLikelyTo: ["Build a fort out of your clean laundry.", "Rearrange the bookshelf by knocking everything off.", "Have a 5-year plan for the apartment."],
                textsLike: ["We need to talk about the layout of the living room.", "I've optimized the kitchen counters.", "Is that a new chair? I didn't approve this."],
                secretWeakness: "Being picked up. It ruins his 'serious professional' vibe.",
                whenStressed: "Stares intensely at a corner for 2 hours, calculating his next move.",
                at2AM: "Testing the structural integrity of the curtain rods.",
                corporateSurvivalRate: "70% (Great ideas, but refuses to work with anyone else.)",
                emotionalSupportObject: "A plastic zip tie."
            ,
                mostLikelyToHuman: ["Write a 4-page essay on why your favorite movie is problematic.", "Have a 10-step skincare routine they follow religiously.", "Say 'actually...' during your first date."],
                emotionalSupportObjectHuman: "A fountain pen they never let anyone touch."},
            behavioralHooksTh: {
                mostLikelyTo: ["สร้างป้อมปราการจากผ้าที่เพิ่งซัก", "จัดชั้นหนังสือใหม่ด้วยการปัดทุกอย่างตกลงมา", "มีแผนพัฒนาอพาร์ตเมนต์ล่วงหน้า 5 ปี"],
                textsLike: ["เราต้องคุยเรื่องการจัดวางเฟอร์นิเจอร์ในห้องนั่งเล่นหน่อยนะ", "เราปรับปรุงพื้นที่บนเคาน์เตอร์ครัวให้ใช้งานได้ดีขึ้นแล้ว", "นั่นเก้าอี้ใหม่เหรอ? เรายังไม่ได้อนุมัติเลยนะ"],
                secretWeakness: "การโดนอุ้ม เพราะมันทำให้มาด 'มืออาชีพผู้เคร่งขรึม' พังทลาย",
                whenStressed: "จ้องมุมห้องนิ่งๆ 2 ชั่วโมง เพื่อคำนวณแผนการขั้นถัดไป",
                at2AM: "ทดสอบความแข็งแรงเชิงวิศวกรรมของราวม่าน",
                corporateSurvivalRate: "70% (ไอเดียเจ๋งมาก แต่ไม่ยอมทำงานร่วมกับใครเลย)",
                emotionalSupportObject: "สายเคเบิลไทล์พลาสติก"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDBR", blurb: "The perfect assistant. You both respect boundaries, silence, and a very strict feeding schedule.", blurbTh: "ผู้ช่วยที่เพอร์เฟกต์ เคารพความเป็นส่วนตัว ความเงียบ และตารางการให้อาหารที่ตรงเวลาเป๊ะ" },
                worstMatch: { type: "CHNC", blurb: "A walking natural disaster. They will knock over your organized pens just to see your reaction.", blurbTh: "ภัยพิบัติเคลื่อนที่ พร้อมจะปัดปากกาที่คุณเรียงไว้อย่างดีให้ตกลงมา เพียงเพื่อจะรอดูรีแอคชั่นของคุณ" },
                chaosPair: { type: "CDBC", blurb: "They challenge your rules with logic. It's an intellectual sparring match that never ends.", blurbTh: "ชอบท้าทายกฎของคุณด้วยตรรกะ กลายเป็นการประลองปัญญาที่ไม่มีวันจบสิ้น" },
                emotionalSupport: { type: "SDNR", blurb: "The quiet observer who reminds you that napping is a productive use of time.", blurbTh: "นักสังเกตการณ์ผู้เงียบขรึม ที่จะคอยเตือนคุณว่าการงีบหลับก็คือการใช้เวลาอย่างมีประสิทธิภาพ" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "CDBR", blurb: "Two CEOs in one household. Everything is automated, optimized, and slightly terrifying to outsiders.", blurbTh: "CEO สองคนในบ้านเดียว ทุกอย่างเป็นระบบอัตโนมัติ ถูกปรับจูนมาอย่างดีจนคนนอกแอบเกรง" },
                mutualEnablers: { type: "CHBR", blurb: "You'll spend the whole weekend debating the most efficient way to clean the house instead of actually cleaning it.", blurbTh: "ใช้เวลาทั้งวันเสาร์อาทิตย์ถกกันเรื่องวิธีทำความสะอาดบ้านที่ประหยัดพลังงานที่สุด แทนที่จะลงมือทำจริงๆ" },
                exhaustingDuo: { type: "CDNR", blurb: "You keep delegating, they keep doing it, but the lack of emotional 'vibes' makes the air feel thin.", blurbTh: "คุณสั่งงานรัวๆ เขาก็ทำตามเรื่อยๆ แต่พอไม่มีความรู้สึกทางอารมณ์เข้ามาเกี่ยว บรรยากาศมันก็ดูแห้งแล้งเกินไป" },
                bannedFromDiscord: { type: "CDBC", blurb: "You tried to restructure the server's hierarchy and the resulting 'Debate' lasted 3 weeks and 400 messages.", blurbTh: "พยายามจัดโครงสร้างยศในเซิร์ฟเวอร์ใหม่ จนเกิดการถกเถียงลากยาว 3 สัปดาห์ รวมแล้วกว่า 400 ข้อความ" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A clean desktop with zero icons.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: หน้าจอเดสก์ท็อปที่สะอาดกริบ ไม่มีไอคอนสักอัน"}, {"en": "Social battery: Fully charged, but only for meaningful delegation.", "th": "โซเชียลแบต: เต็มร้อย แต่เก็บไว้ใช้สั่งงานที่มีสาระเท่านั้น"}, {"en": "Today you are likely to: Correct someone's grammar in a DM.", "th": "วันนี้คุณมีแนวโน้มจะ: ไปแก้ไวยากรณ์ให้คนอื่นในแชทส่วนตัว"}, {"en": "Current mood: An unread 50-page manual.", "th": "อารมณ์ตอนนี้: คู่มือ 50 หน้าที่ยังไม่มีใครเปิดอ่าน"}, {"en": "Energy level: Stable, efficient, and slightly intimidating.", "th": "ระดับพลังงาน: มั่นคง มีประสิทธิภาพ และแอบน่าเกรงขามนิดๆ"}, {"en": "Today's vibe: 'If you want it done right, do it yourself' energy.", "th": "ฟีลวันนี้: พลังงานแบบ 'ถ้าอยากให้งานออกมาดี ก็ต้องทำเอง'"}, {"en": "Likely activity: Color-coding your physical and digital life.", "th": "กิจกรรมที่น่าจะทำ: นั่งคัดแยกสีให้สิ่งของทั้งในชีวิตจริงและในคอม"}, {"en": "Communication style: Concise directives.", "th": "สไตล์การสื่อสาร: คำสั่งที่สั้น กระชับ และได้ใจความ"}, {"en": "Internal monologue: 'Is everyone else even trying?'", "th": "เสียงในหัว: 'คนอื่นเขาพยายามกันบ้างหรือเปล่านะ?'"}, {"en": "Stress response: Creating a spreadsheet to track your stress.", "th": "ปฏิกิริยาต่อความเครียด: สร้างไฟล์ Excel เพื่อติดตามระดับความเครียดของตัวเอง"}, {"en": "Survival strategy: Strict adherence to the SOP.", "th": "กลยุทธ์การเอาตัวรอด: ทำตามขั้นตอนมาตรฐาน (SOP) อย่างเคร่งครัด"}, {"en": "Today's catchphrase: 'Let's stick to the agenda.'", "th": "ประโยคเด็ดวันนี้: 'เรากลับเข้าสู่วาระการประชุมกันเถอะ'"}, {"en": "Hidden craving: Total, unquestioned authority for just one hour.", "th": "ความปรารถนาลึกๆ: การมีอำนาจเบ็ดเสร็จเด็ดขาดสัก 1 ชั่วโมงโดยไม่มีใครสงสัย"}, {"en": "2 AM thought: 'I could have optimized that workflow even further.'", "th": "ความคิดตอนตี 2: 'จริงๆ เราน่าจะปรับจูนเวิร์กโฟลว์นั้นให้ดีกว่านี้ได้อีกนะ'"}, {"en": "Identity hook: The human equivalent of a perfectly sharp pencil.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันดินสอที่เหลามาแหลมเปี๊ยบ"}],
dailyObservations: [{"en": "Current status: Supervising the assembly of your IKEA furniture (judgingly).", "th": "สถานะปัจจุบัน: คอยคุมงานคุณประกอบเฟอร์นิเจอร์ IKEA (ด้วยสายตาตัดสิน)"}, {"en": "Social battery: High, but only for meaningful project discussions.", "th": "โซเชียลแบต: สูง แต่คุยได้เฉพาะเรื่องงานที่มีสาระเท่านั้น"}, {"en": "Likely crime today: Corporate espionage (stealing your pens).", "th": "อาชญากรรมที่น่าจะเกิด: จารกรรมข้อมูลบริษัท (ขโมยปากกาคุณ)"}, {"en": "Attention demands: Intellectual validation required.", "th": "ความต้องการความสนใจ: ต้องการการยอมรับในความอัจฉริยะ"}, {"en": "Emotional weather: Clear with a chance of big ideas.", "th": "พยากรณ์อารมณ์: ปลอดโปร่ง มีโอกาสเกิดไอเดียบันเจิด"}, {"en": "3 AM activity: Designing a better route to the kitchen counters.", "th": "กิจกรรมตอนตี 3: ออกแบบเส้นทางขึ้นเคาน์เตอร์ครัวที่ล้ำกว่าเดิม"}, {"en": "Personal space: Your office chair is my workstation.", "th": "พื้นที่ส่วนตัว: เก้าอี้ทำงานคุณคือสถานีปฏิบัติงานของฉัน"}, {"en": "Logic level: Beyond your comprehension.", "th": "ระดับตรรกะ: ล้ำลึกเกินกว่าที่คุณจะเข้าใจ"}, {"en": "Motivation: Optimization of the treat-to-meow ratio.", "th": "แรงจูงใจ: ปรับจูนอัตราส่วนการร้องแลกขนมให้คุ้มที่สุด"}, {"en": "Preferred seating: Somewhere with a vantage point and a view of the fridge.", "th": "ที่นั่งโปรด: ที่ที่มีชัยภูมิเหนือกว่าและมองเห็นตู้เย็นชัดเจน"}, {"en": "Response to 'pspsps': I'm busy. Send a calendar invite.", "th": "ปฏิกิริยาต่อ 'ชิชิ': ไม่ว่างจ้า ส่งนัดใน Google Calendar มานะ"}, {"en": "Goal for the day: Achieving world domination, one box at a time.", "th": "เป้าหมายวันนี้: ครองโลกทีละกล่อง"}, {"en": "Secret talent: Can calculate the exact moment you'll drop food.", "th": "พรสวรรค์ลับ: คำนวณจังหวะที่คุณจะทำอาหารตกได้อย่างแม่นยำ"}, {"en": "Communication style: Precise trills and meaningful pauses.", "th": "สไตล์การสื่อสาร: ร้องเป็นจังหวะ และมีการเว้นวรรคอย่างมีนัยสำคัญ"}, {"en": "Stress level: High when things are disorganized (like your desk).", "th": "ระดับความเครียด: สูงเวลาเห็นอะไรไม่เป็นระเบียบ (เช่น โต๊ะทำงานคุณ)"}, {"en": "Diet: Strictly organic (meaning I stole it from the counter).", "th": "โภชนาการ: ออร์แกนิกเน้นๆ (หมายถึงจิ๊กมาจากเคาน์เตอร์นั่นแหละ)"}, {"en": "Floor relationship: A necessary evil to reach the higher ground.", "th": "ความสัมพันธ์กับพื้น: สิ่งชั่วร้ายที่จำเป็นต้องเหยียบเพื่อขึ้นที่สูง"}, {"en": "Intelligence report: Already mapped the neighborhood's security flaws.", "th": "รายงานกรอง: วางผังจุดบอดระบบรักษาความปลอดภัยของเพื่อนบ้านเสร็จแล้ว"}, {"en": "Main character energy: The visionary architect of my own destiny.", "th": "พลังงานตัวเอก: สถาปนิกผู้มีวิสัยทัศน์ที่ลิขิตชะตาตัวเอง"}, {"en": "Internal monologue: 'If I push this pen just two inches, the whole system collapses.'", "th": "เสียงในหัว: 'ถ้าดันปากกานี้ไปอีกสองนิ้ว ระบบทั้งหมดจะพังทลายลง'"}],
compatibility: {
                bestMatch: { type: "SHBC", blurb: "Sophisticated and sweet together.", blurbTh: "คู่หูสายหรู ดูแพงแต่ก็แฝงความหวาน" },
                chaosPair: { type: "CDBC", blurb: "Competitive treat eating starts now.", blurbTh: "มหกรรมแข่งกินขนมแมวเลียได้เริ่มขึ้นแล้ว" },
                secretTwin: { type: "SDBR", blurb: "Identical purr frequencies.", blurbTh: "เสียงครางครืดๆ อยู่ในคลื่นความถี่เดียวกัน" },
                worstRoommate: { type: "SDNC", blurb: "They judge your every move.", blurbTh: "เมทที่คอยนั่งตัดสินทุกการกระทำของคุณ" }
            },
          },
        {
            code: "CDBC",
            name: "The Wild Debater",
            tagline: "Will argue with you about gravity. And win.",
            emoji: "🧠",
            color: "#3B6FFF",
            bg: "#D8E2FF",
            vibes: ["Smart", "Loud", "Counter-arguer", "Counter-jumper"],
            famouslySays: "Actually, the counter is mine. Let me explain.",
            kindredSpirits: ["a debate kid", "Reddit at 2am", "your favorite contrarian friend"],
            redFlags: "Knocks things off the counter to prove a point.",
            greenFlags: "Will absolutely die on a hill for you.",
            nameTh: "นักเถียงตัวป่วน",
            taglineTh: "พร้อมเถียงเรื่องแรงโน้มถ่วง และชนะด้วย",
            vibesTh: ["ฉลาด", "เสียงดัง", "ชอบโต้กลับ", "ชอบกระโดดเคาน์เตอร์"],
            famouslySaysTh: "จริงๆ แล้วเคาน์เตอร์เป็นของฉัน เดี๋ยวอธิบายให้ฟัง",
            kindredSpiritsTh: ["เด็กชมรมโต้วาที", "Reddit ตอนตีสอง", "เพื่อนสายแย้งที่เรารักที่สุด"],
            redFlagsTh: "เขี่ยของตกเคาน์เตอร์เพื่อพิสูจน์ประเด็น",
            greenFlagsTh: "ยอมตายข้างเราได้ทุกเรื่อง",
            description: "The Wild Debater is the cat who would write a Reddit comment if their paws cooperated. They are <strong>Commanding</strong> because every argument deserves to be heard, <strong>Dreamer</strong> because the argument is mostly in their head, <strong>Bossy</strong> because their position is correct and you'll come around, and <strong>Casual</strong> because they'll change the rules mid-negotiation. They're not contrarian; they just have an unusually rich internal model of how things should work.",
            traits: [
                ["How They Show Love ❤️", "Love is shown through <strong>intellectual sparring</strong>. They will sit across the room and stare you down — not coldly, but as a sustained invitation to engage."],
                ["How They Ask for Attention 👀", "By <strong>occupying the contested zone</strong>. The kitchen counter. The keyboard. The exact spot on the couch you wanted. Possession is the argument."],
                ["Territory (The Fiefdom) 🏰", "Territory is <strong>negotiable but always contested</strong>. They'll claim the highest perch, then concede it under specific weather conditions, then reclaim it next week."],
                ["Energy Throughout the Day ⚡", "Variable and theatrical. <strong>Energy spikes around perceived injustice</strong> — a closed door, a moved water bowl, a new houseplant in their patrol path."],
                ["Play Style 🧶", "Play is a <strong>battle of wits</strong>. They prefer toys that fight back: a wand that snaps, a feeder that resists. Easy wins are unsatisfying."],
                ["Reaction to Change 📦", "Change is met with <strong>vocal commentary</strong>. They will tell you exactly what they think of the new rug. The protest may continue for several days."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>worthy adversaries</strong>. Disputes are loud, theatrical, and resolved without lasting damage. The contest itself is the point."],
            ],
            descriptionTh: "แมวที่ถ้าอุ้งเท้าอำนวย คงเข้าไปคอมเมนต์ใน Reddit ทุกกระทู้ <strong>ออกหน้า</strong> เพราะทุกข้อโต้แย้งสมควรถูกได้ยิน <strong>นักฝัน</strong> เพราะข้อโต้แย้งส่วนใหญ่อยู่ในหัวเขา <strong>คุมเกม</strong> เพราะจุดยืนของเขาถูก และเดี๋ยวคุณจะเห็นด้วยเอง <strong>ฟรีสไตล์</strong> เพราะเปลี่ยนกฎกลางการเจรจาได้เสมอ ไม่ได้ขัดแย้งเก่ง แค่มีโลกในหัวที่ละเอียดเป็นพิเศษ",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักด้วยการประลองทางความคิด</strong> นั่งอีกฝั่งของห้องและจ้องคุณยาวๆ ไม่เย็นชา แต่เป็นคำเชิญให้มีปฏิสัมพันธ์"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ยึดเขตที่กำลังถูกชิง</strong> เคาน์เตอร์ครัว คีย์บอร์ด หรือมุมโซฟาที่คุณเล็งไว้ การครอบครองคือข้อโต้แย้ง"],
                ["🏰 อาณาเขต", "<strong>ต่อรองได้แต่ถูกท้าตลอด</strong> ยึดที่สูงสุด แล้วยอมสละตามสภาพอากาศ แล้วยึดคืนสัปดาห์ถัดมา"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>แปรปรวนและเป็นละคร</strong> พลังพุ่งตอนเจอเรื่องไม่ยุติธรรม ประตูปิด ชามน้ำถูกย้าย ต้นไม้ใหม่บนเส้นทางตรวจการ"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นคือสงครามไหวพริบ</strong> ชอบของเล่นที่สู้กลับ ไม้ที่ดีดได้ ที่ให้อาหารที่ต้านทาน ชนะง่ายๆ ไม่สนุก"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>ส่งเสียงคอมเมนต์</strong> บอกคุณตรงๆ ว่าคิดยังไงกับพรมใหม่ การประท้วงอาจลากยาวหลายวัน"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>มองตัวอื่นเป็นคู่ต่อสู้ที่คู่ควร</strong> ทะเลาะกันดัง เป็นละคร แต่จบโดยไม่มีใครเจ็บจริง การประลองเองคือจุดประสงค์"],
            ],
        
            duringEvents: {
          "dinner": "Argues that it's actually breakfast time.",
          "facetime": "Jumps in to correct a fact.",
          "guests": "Debates the guest on who owns the sofa."
},
            duringEventsTh: {
          "dinner": "เถียงว่าตอนนี้คือเวลาอาหารเช้าต่างหาก",
          "facetime": "กระโดดเข้ามาเพื่อแก้ข้อมูลให้ถูกต้อง",
          "guests": "โต้วาทีกับแขกว่าใครเป็นเจ้าของโซฟา"
},
                        behavioralHooks: {
                mostLikelyTo: ["Refuse to sit where you want them to, out of principle.", "Meow back every time you talk.", "Win an argument by knocking over a glass."],
                textsLike: ["Actually, if you look at the bowl, it's 50% empty.", "I don't think that's how gravity works. Watch this.", "I'm not 'bad', I'm 'disruptive'."],
                secretWeakness: "Belly rubs. He forgets what he was arguing about.",
                whenStressed: "Starts a 20-minute lecture (yelling) about why the door should be open.",
                at2AM: "Practicing his counter-arguments against the wall.",
                corporateSurvivalRate: "40% (Too much 'constructive feedback' for the manager.)",
                emotionalSupportObject: "A silver spoon he dragged under the sofa."
            ,
                mostLikelyToHuman: ["Argue for the sake of the argument.", "Explain your own job to you.", "Have a private Twitter account for high-level complaining."],
                emotionalSupportObjectHuman: "A blue-light blocking glasses set."},
            behavioralHooksTh: {
                mostLikelyTo: ["ไม่ยอมนั่งตรงที่คุณอยากให้นั่งเพื่อรักษาจุดยืน", "เถียงกลับทุกครั้งที่คุณพูดด้วย", "ชนะการเถียงด้วยการปัดแก้วน้ำแตก"],
                textsLike: ["อันที่จริง ถ้าดูในชามดีๆ จะเห็นว่ามันว่างเปล่าไปแล้ว 50% นะ", "เราว่าแรงโน้มถ่วงไม่ได้ทำงานแบบนั้นนะ ดูนี่สิ", "เราไม่ได้ 'ดื้อ' เราแค่ 'มีความคิดสร้างสรรค์ที่แตกต่าง'"],
                secretWeakness: "การโดนเกาพุง พอโดนแล้วจะลืมประเด็นที่เถียงอยู่ทันที",
                whenStressed: "ยืนเทศนา (ตะโกน) ยาว 20 นาทีว่าทำไมประตูปอดควรจะเปิดไว้",
                at2AM: "ซ้อมพูดโต้แย้งใส่กำแพง",
                corporateSurvivalRate: "40% (ให้ 'Feedback เชิงสร้างสรรค์' กับหัวหน้าเยอะเกินไปหน่อย)",
                emotionalSupportObject: "ช้อนเงินที่แอบคาบไปซ่อนไว้ใต้โซฟา"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDBC", blurb: "You both enjoy looking at the same object from 15 different angles. Intellectual equals.", blurbTh: "ชอบมองสิ่งเดียวกันจาก 15 มุมมองที่ต่างกัน เป็นคู่หูทางปัญญาที่สมน้ำสมเนื้อ" },
                worstMatch: { type: "SDBR", blurb: "They are too rigid. They won't even entertain your 'what if we move the bed to the ceiling' theory.", blurbTh: "เป๊ะเกินไป ไม่ยอมแม้แต่จะฟังทฤษฎี 'ถ้าเราย้ายเตียงไปไว้บนเพดานล่ะ' ของคุณ" },
                chaosPair: { type: "CHBC", blurb: "Pure chaotic innovation. You're both trying to disrupt the cat tree market by 3 AM.", blurbTh: "นวัตกรรมสายป่วนระดับสุดยอด พยายามจะปฏิวัติวงการคอนโดแมวตอนตี 3" },
                emotionalSupport: { type: "SDNC", blurb: "A calming presence that listens to your 2 AM business pitches without judgment.", blurbTh: "ความสงบเยือกเย็นที่พร้อมจะฟังไอเดียธุรกิจตอนตี 2 ของคุณโดยไม่ตัดสิน" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "CDBC", blurb: "An endless loop of 'well, actually...' that somehow results in a successful startup.", blurbTh: "ลูป 'แต่จริงๆ แล้ว...' ที่ไม่มีที่สิ้นสุด แต่ดันจบลงด้วยการสร้างสตาร์ทอัพที่ประสบความสำเร็จ" },
                mutualEnablers: { type: "CHBC", blurb: "You'll talk each other into 'disrupting' your own lives for no reason other than curiosity.", blurbTh: "เป่าหูให้กันและกัน 'ปฏิวัติ' ชีวิตตัวเองเล่นๆ เพียงเพราะแค่อยากรู้ว่าจะเกิดอะไรขึ้น" },
                exhaustingDuo: { type: "CDBR", blurb: "One wants to lead, the other wants to argue. It's a boardroom meeting that never reaches a resolution.", blurbTh: "คนนึงอยากคุม อีกคนอยากเถียง เหมือนการประชุมบอร์ดบริหารที่ไม่มีวันได้ข้อสรุป" },
                bannedFromDiscord: { type: "CDNC", blurb: "You made the 'Performer' cry by logically deconstructing their art during a show-and-tell.", blurbTh: "ทำเอาสาย 'Performer' ร้องไห้ เพราะไปวิเคราะห์งานศิลปะของเขาด้วยตรรกะล้วนๆ ตอนเขากำลังพรีเซนต์" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A Linux distro that you're currently rebuilding for fun.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: Linux ที่คุณกำลังนั่งรื้อระบบใหม่เล่นๆ"}, {"en": "Social battery: Low, but I have a backup generator for a good argument.", "th": "โซเชียลแบต: ต่ำนะ แต่มีเครื่องปั่นไฟสำรองถ้าได้เริ่มเถียงเรื่องดีๆ"}, {"en": "Today you are likely to: Play devil's advocate against your own opinion.", "th": "วันนี้คุณมีแนวโน้มจะ: ค้านความคิดตัวเองเพียงเพื่อหาช่องโหว่"}, {"en": "Current mood: 'I'm not arguing, I'm explaining why I'm right.'", "th": "อารมณ์ตอนนี้: 'ไม่ได้เถียงนะ แค่อธิบายว่าทำไมฉันถึงถูก'"}, {"en": "Energy level: High, but only for strategic disruption.", "th": "ระดับพลังงาน: สูง แต่เก็บไว้ใช้ตอนจะรื้อระบบเดิมทิ้งเท่านั้น"}, {"en": "Today's vibe: Challenging the status quo from your couch.", "th": "ฟีลวันนี้: นั่งท้าทายขนบธรรมเนียมเดิมๆ อยู่บนโซฟา"}, {"en": "Likely activity: Researching a topic for 4 hours to win a 2-minute debate.", "th": "กิจกรรมที่น่าจะทำ: หาข้อมูลเรื่องหนึ่งนาน 4 ชั่วโมง เพื่อเอาไปเถียงให้ชนะใน 2 นาที"}, {"en": "Communication style: Socratic method but with more sass.", "th": "สไตล์การสื่อสาร: ตั้งคำถามแบบโซเครตีส แต่เพิ่มความกวนประสาทเข้าไปหน่อย"}, {"en": "Internal monologue: 'That's a logical fallacy, but do I tell them now or later?'", "th": "เสียงในหัว: 'นั่นมันตรรกะวิบัตินี่นา จะบอกเขาตอนนี้หรือไว้ทีหลังดีนะ?'"}, {"en": "Stress response: Deconstructing the problem until it's just a pile of facts.", "th": "ปฏิกิริยาต่อความเครียด: ย่อยปัญหาจนเหลือแค่กองข้อเท็จจริง"}, {"en": "Survival strategy: Intellectual superiority and a dark sense of humor.", "th": "กลยุทธ์การเอาตัวรอด: ความเหนือกว่าทางปัญญาและอารมณ์ขันร้ายๆ"}, {"en": "Today's catchphrase: 'Actually, have you considered the alternative?'", "th": "ประโยคเด็ดวันนี้: 'จริงๆ แล้ว คุณเคยลองคิดมุมกลับหรือยัง?'"}, {"en": "Hidden craving: A worthy opponent who can actually keep up.", "th": "ความปรารถนาลึกๆ: คู่ต่อสู้ที่สมน้ำสมเนื้อและตามทันความคิดคุณจริงๆ"}, {"en": "2 AM thought: 'If I was wrong, I would know it. Therefore, I am right.'", "th": "ความคิดตอนตี 2: 'ถ้าฉันผิด ฉันก็ต้องรู้ตัวแล้วสิ ดังนั้นแปลว่าฉันถูก'"}, {"en": "Identity hook: The human equivalent of a 'Wait, let me finish' button.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันปุ่ม 'เดี๋ยว ฟังให้จบก่อน'"}],
dailyObservations: [{"en": "Current status: Arguing with my own reflection about territory rights.", "th": "สถานะปัจจุบัน: กำลังโต้เถียงกับเงาตัวเองเรื่องสิทธิในอาณาเขต"}, {"en": "Social battery: Fueled by chaotic debate.", "th": "โซเชียลแบต: ขับเคลื่อนด้วยการโต้เถียงที่วุ่นวาย"}, {"en": "Likely crime today: Defying the laws of physics and your 'no-counter' rule.", "th": "อาชญากรรมที่น่าจะเกิด: ฝ่าฝืนกฎฟิสิกส์และกฎ 'ห้ามขึ้นเคาน์เตอร์' ของคุณ"}, {"en": "Attention demands: High, but only if you're prepared to lose an argument.", "th": "ความต้องการความสนใจ: สูง แต่คุณต้องเตรียมใจจะแพ้เถียงนะ"}, {"en": "Emotional weather: Thunderous with a side of witty retorts.", "th": "พยากรณ์อารมณ์: ฟ้าคะนองพร้อมคำด่าที่แสนเฉลียวฉลาด"}, {"en": "3 AM activity: Explaining my life philosophy to the bathroom tiles.", "th": "กิจกรรมตอนตี 3: อธิบายปรัชญาชีวิตให้กระเบื้องห้องน้ำฟัง"}, {"en": "Personal space: My space is mine. Your space is negotiable.", "th": "พื้นที่ส่วนตัว: พื้นที่ฉันคือของฉัน ส่วนพื้นที่คุณ... มาคุยกันก่อน"}, {"en": "Logic level: Circular and impossible to escape.", "th": "ระดับตรรกะ: เป็นวงกลมที่ไม่มีทางหนีพ้น"}, {"en": "Motivation: Being right. About everything. Always.", "th": "แรงจูงใจ: การเป็นฝ่ายถูก ในทุกเรื่อง ตลอดเวลา"}, {"en": "Preferred seating: Right in the middle of whatever you're trying to do.", "th": "ที่นั่งโปรด: กลางปล่องอะไรก็ตามที่คุณกำลังพยายามทำอยู่"}, {"en": "Response to 'pspsps': Actually, that's an outdated way to call a cat. Let's discuss.", "th": "ปฏิกิริยาต่อ 'ชิชิ': จริงๆ แล้วนั่นเป็นวิธีเรียกแมวที่ล้าหลังมาก มาคุยกันหน่อยดีกว่า"}, {"en": "Goal for the day: Getting you to admit that I didn't actually knock that vase over.", "th": "เป้าหมายวันนี้: ทำให้คุณยอมรับว่าฉันไม่ได้เป็นคนทำแจกันตก"}, {"en": "Secret talent: Finding the one flaw in your argument (and your carpet).", "th": "พรสวรรค์ลับ: หาจุดบอดในคำพูดคุณ (และในพรมของคุณ)"}, {"en": "Communication style: Loud, frequent, and incredibly persuasive.", "th": "สไตล์การสื่อสาร: ดัง บ่อย และโน้มน้าวใจได้อย่างเหลือเชื่อ"}, {"en": "Stress level: High when I'm ignored. I have points to make!", "th": "ระดับความเครียด: สูงถ้าโดนเมิน ฉันมีประเด็นต้องพูดนะ!"}, {"en": "Diet: Tuna and the sweet taste of victory.", "th": "โภชนาการ: ทูน่าและรสชาติอันหอมหวานของชัยชนะ"}, {"en": "Floor relationship: It's a debate floor.", "th": "ความสัมพันธ์กับพื้น: มันคือลานประลองทางความคิด"}, {"en": "Intelligence report: Has debunked all your house rules by 9 AM.", "th": "รายงานกรอง: ล้างบางกฎในบ้านของคุณเสร็จสิ้นภายใน 9 โมงเช้า"}, {"en": "Main character energy: The anti-hero you love to argue with.", "th": "พลังงานตัวเอก: แอนตี้ฮีโร่ที่คุณอดไม่ได้ที่จะลับฝีปากด้วย"}, {"en": "Internal monologue: 'I'm not being difficult, I'm being a disruptor.'", "th": "เสียงในหัว: 'ฉันไม่ได้ดื้อนะ ฉันแค่เป็นผู้สร้างความเปลี่ยนแปลง'"}],
compatibility: {
                bestMatch: { type: "SHBC", blurb: "A graceful match made in heaven.", blurbTh: "ความลงตัวที่สง่างามราวกับฟ้าประทาน" },
                chaosPair: { type: "CDBR", blurb: "Endless tag-you're-it sessions.", blurbTh: "วิ่งไล่จับกันวนไป ไม่มีใครยอมใคร" },
                secretTwin: { type: "CDNC", blurb: "Hidden twins behind the whiskers.", blurbTh: "แฝดที่ซ่อนอยู่ภายใต้หนวดแมวอันทรงเสน่ห์" },
                worstRoommate: { type: "SHNR", blurb: "The house is not big enough for both.", blurbTh: "บ้านนี้เล็กเกินไปสำหรับเราสองตัว" }
            },
          },
        {
            code: "CDNR",
            name: "The Charismatic Counselor",
            tagline: "Personal therapist. Co-pay is treats.",
            emoji: "💗",
            color: "#FF7AA2",
            bg: "#FFD9E5",
            vibes: ["Emotionally Fluent", "Soft Boss", "Vibes Reader", "Lap Loiterer"],
            famouslySays: "You seem stressed. Have you tried purring?",
            kindredSpirits: ["a yoga teacher", "Ted Lasso", "the friend who always texts first"],
            redFlags: "Knows when you're sad and uses it.",
            greenFlags: "Knows when you're sad and shows up.",
            nameTh: "ที่ปรึกษาสายเสน่ห์",
            taglineTh: "นักจิตบำบัดส่วนตัว ค่ารักษาคือขนม",
            vibesTh: ["อ่านอารมณ์เก่ง", "บอสใจดี", "อ่านบรรยากาศ", "นั่งตักไม่ยอมลง"],
            famouslySaysTh: "ดูเครียดนะ ลองครางดูยัง",
            kindredSpiritsTh: ["ครูโยคะ", "Ted Lasso", "เพื่อนที่ทักก่อนเสมอ"],
            redFlagsTh: "รู้ว่าเราเศร้า แล้วเอามาใช้",
            greenFlagsTh: "รู้ว่าเราเศร้า แล้วโผล่มาอยู่ข้างๆ",
            description: "The Charismatic Counselor is the cat that other cats secretly come to for advice. They are <strong>Commanding</strong> because warmth is offered, not waited for, <strong>Dreamer</strong> because they read the emotional weather of a room before anyone else does, <strong>Nurturing</strong> because comfort is their default mode, and <strong>Regal</strong> because the comfort follows a schedule only they can see. They're not performing kindness; they actually mean it.",
            traits: [
                ["How They Show Love ❤️", "Love is delivered as <strong>quiet attendance</strong>. They show up where you are, lean into your leg for exactly the right amount of time, and leave before you can over-handle them."],
                ["How They Ask for Attention 👀", "By <strong>becoming a presence you can't ignore</strong>. A slow walk into your sightline. A soft chirp from the doorway. Never demanding, always landing."],
                ["Territory (The Fiefdom) 🏰", "Territory is <strong>wherever you most need them</strong>. They'll sleep on the bed when you're sad, the couch when you're tired, the desk when you're focused."],
                ["Energy Throughout the Day ⚡", "Even and emotionally calibrated. <strong>The energy in the room sets their pace.</strong> A loud household gets a quiet cat; a quiet household gets gentle company."],
                ["Play Style 🧶", "Play is <strong>relational</strong>. They prefer slow, interactive games where you're paying attention to them, not the toy."],
                ["Reaction to Change 📦", "Change is absorbed quietly. A new piece of furniture is <strong>read for emotional cues</strong> — your reaction tells them whether to investigate or wait."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>tended to</strong>. They'll groom the household elder, soothe the youngest, and gently de-escalate fights without claiming credit."],
            ],
            descriptionTh: "แมวที่แมวตัวอื่นแอบมาขอคำปรึกษา <strong>ออกหน้า</strong> เพราะมอบความอบอุ่นโดยไม่รอให้ขอ <strong>นักฝัน</strong> เพราะอ่านบรรยากาศห้องออกก่อนใคร <strong>ขี้ห่วง</strong> เพราะการปลอบโยนคือโหมดเริ่มต้น <strong>เจ้าระเบียบ</strong> เพราะการปลอบโยนมาตามตารางที่มีแต่เขามองเห็น ไม่ได้แสดงว่าใจดี ใจดีจริงๆ",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักแบบมาอยู่เงียบๆ</strong> โผล่ตรงที่คุณอยู่ พิงขาคุณพอดีจังหวะ แล้วเดินจากก่อนคุณจับจนมากเกินไป"],
                ["👀 การเรียกร้องความสนใจ", "<strong>กลายเป็นสิ่งที่มองข้ามไม่ได้</strong> เดินช้าๆ เข้ามาในมุมมอง ส่งเสียงเบาๆ จากประตู ไม่บังคับ แต่ลงเป้าทุกครั้ง"],
                ["🏰 อาณาเขต", "<strong>อยู่ตรงที่คุณต้องการที่สุด</strong> นอนบนเตียงตอนคุณเศร้า บนโซฟาตอนคุณเหนื่อย บนโต๊ะตอนคุณตั้งใจทำงาน"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>สม่ำเสมอและปรับตามอารมณ์</strong> พลังในห้องเป็นตัวกำหนดจังหวะ บ้านเสียงดังได้แมวเงียบ บ้านเงียบได้เพื่อนนุ่มๆ"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นเชิงสัมพันธ์</strong> ชอบเกมช้าๆ ที่คุณสนใจตัวเขามากกว่าของเล่น"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>ซึมซับเงียบๆ</strong> เฟอร์นิเจอร์ใหม่จะถูกอ่านผ่านสีหน้าคุณ ปฏิกิริยาคุณบอกว่าเขาควรไปสำรวจหรือรอ"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>คอยดูแลตัวอื่น</strong> เลียทำความสะอาดให้แมวอาวุโส ปลอบตัวเล็กที่สุด และค่อยๆ คลี่คลายเรื่องทะเลาะโดยไม่อ้างความดี"],
            ],
        
            duringEvents: {
          "dinner": "Sits politely and asks how your day was.",
          "thunderstorm": "Provides emotional support to the dog.",
          "facetime": "Smiles beautifully for the camera."
},
            duringEventsTh: {
          "dinner": "นั่งเรียบร้อยและถามว่าวันนี้เป็นไงบ้าง",
          "thunderstorm": "ให้การสนับสนุนทางอารมณ์กับน้องหมา",
          "facetime": "ยิ้มสวยๆ ให้กล้อง"
},
                        behavioralHooks: {
                mostLikelyTo: ["Know you're sad before you do.", "Gently redirect your bad decisions.", "Heal your inner child."],
                textsLike: ["How are we feeling today? (I mean me, feed me).", "Sending vibes. And a slow blink.", "You look like you need a nap. I'll join you."],
                secretWeakness: "Compliments. He will melt into a puddle.",
                whenStressed: "Purrs so loudly it vibrates the entire couch.",
                at2AM: "Slowly blinking at you from the dark to radiate peace.",
                corporateSurvivalRate: "100% (Everyone loves him. He is the glue holding the team together.)",
                emotionalSupportObject: "A soft, plushy toy he carries everywhere."
            ,
                mostLikelyToHuman: ["Be the group therapist for free.", "Know your trauma before they know your last name.", "Send you a playlist that 'reminded them of your energy'."],
                emotionalSupportObjectHuman: "A weighted blanket."},
            behavioralHooksTh: {
                mostLikelyTo: ["รู้ว่าคุณเศร้าก่อนตัวคุณเองจะรู้", "เปลี่ยนทิศทางการตัดสินใจแย่ๆ ของคุณอย่างอ่อนโยน", "เยียวยาเด็กน้อยในใจคุณ"],
                textsLike: ["วันนี้เรารู้สึกยังไงกันบ้าง? (หมายถึงเรานะ เอาข้าวมาให้หน่อย)", "ส่งพลังงานดีๆ ให้จ้า พร้อมกระพริบตาช้าๆ 1 ที", "น้อนดูเหมือนต้องการการงีบนะ เดี๋ยวไปนอนด้วย"],
                secretWeakness: "คำชม พอโดนชมแล้วจะละลายกลายเป็นก้อนแป้งทันที",
                whenStressed: "ครางครืดๆ ดังมากจนโซฟาสั่นไปทั้งตัว",
                at2AM: "นั่งกระพริบตาให้คุณท่ามกลางความมืดเพื่อแผ่ส่วนบุญความสงบ",
                corporateSurvivalRate: "100% (ใครๆ ก็รักเขา เขาคือกาวใจที่ทำให้ทีมไม่แตกสลาย)",
                emotionalSupportObject: "ตุ๊กตานุ่มนิ่มที่ต้องคาบไปด้วยทุกที่"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDNR", blurb: "Mutual respect for personal space and quiet reflection. A very zen household.", blurbTh: "ต่างฝ่ายต่างเคารพพื้นที่ส่วนตัวและความสงบ เป็นบ้านที่ฟีลเซนสุดๆ" },
                worstMatch: { type: "CHBC", blurb: "They are too loud, too fast, and they don't value your 'peace of mind' protocols.", blurbTh: "ทั้งดัง ทั้งเร็ว แถมยังไม่เห็นค่าของ 'ระเบียบเพื่อความสงบทางใจ' ของคุณเลย" },
                chaosPair: { type: "CDNC", blurb: "They bring the drama, you bring the logic. It's a therapy session disguised as a friendship.", blurbTh: "เขาสร้างดราม่า ส่วนคุณใช้ตรรกะ เป็นมิตรภาพที่ดูเหมือนเซสชั่นปรึกษาจิตแพทย์" },
                emotionalSupport: { type: "SDBR", blurb: "Their stoicism is grounding. You don't have to 'fix' them, they're already fine.", blurbTh: "ความนิ่งสยบความเคลื่อนไหวของเขาทำให้คุณรู้สึกมั่นคง ไม่ต้องพยายาม 'แก้ปัญหา' ให้เขา เพราะเขาโอเคอยู่แล้ว" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SDNR", blurb: "The most peaceful home on earth. Conflict is resolved with a shared Google Doc and chamomile tea.", blurbTh: "บ้านที่สงบสุขที่สุดในโลก เวลามีปัญหาจะเคลียร์กันผ่าน Google Doc และนั่งจิบชาคาโมมายล์" },
                mutualEnablers: { type: "CHNR", blurb: "You both try to 'fix' everyone else until you forget to address your own needs.", blurbTh: "มัวแต่พยายาม 'เยียวยา' คนอื่นจนลืมดูแลความต้องการของตัวเองไปเลยทั้งคู่" },
                exhaustingDuo: { type: "CDBR", blurb: "You feel like their unpaid assistant, they feel like you're being 'difficult' by having feelings.", blurbTh: "คุณรู้สึกเหมือนเป็นเบ๊ที่ไม่ได้เงินเดือน ส่วนเขาก็คิดว่าคุณ 'เรื่องมาก' แค่เพราะคุณมีความรู้สึก" },
                bannedFromDiscord: { type: "CHNC", blurb: "You tried to 'mediate' a troll and ended up being the one who got banned for being too reasonable.", blurbTh: "พยายามจะไป 'ไกล่เกลี่ย' พวกเกรียน แต่สุดท้ายกลายเป็นคุณที่โดนแบนเพราะพูดจามีเหตุผลเกินไป" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A high-resolution meditation app.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: แอปนั่งสมาธิเวอร์ชันความละเอียดสูง"}, {"en": "Social battery: Low, but I have a reserved stash for people in crisis.", "th": "โซเชียลแบต: ต่ำนะ แต่มีก๊อกสองเก็บไว้ให้คนที่กำลังเดือดร้อน"}, {"en": "Today you are likely to: Offer a very structured solution to an emotional problem.", "th": "วันนี้คุณมีแนวโน้มจะ: เสนอทางแก้ปัญหาทางอารมณ์ที่มาเป็นขั้นตอนชัดเจน"}, {"en": "Current mood: 'I'm listening, but also analyzing your childhood.'", "th": "อารมณ์ตอนนี้: 'ฟังอยู่นะ แต่กำลังวิเคราะห์ปมวัยเด็กของคุณไปด้วย'"}, {"en": "Energy level: Gentle but persistent.", "th": "ระดับพลังงาน: อ่อนโยนแต่หนักแน่น"}, {"en": "Today's vibe: Providing emotional labor at market-leading efficiency.", "th": "ฟีลวันนี้: เป็นที่ปรึกษาทางใจด้วยประสิทธิภาพระดับผู้นำตลาด"}, {"en": "Likely activity: Deep-cleaning your workspace to clear your mind.", "th": "กิจกรรมที่น่าจะทำ: จัดโต๊ะทำงานใหม่แบบคลีนสุดๆ เพื่อให้สมองโล่ง"}, {"en": "Communication style: Soft-spoken but logically sound.", "th": "สไตล์การสื่อสาร: พูดจาละมุนละม่อมแต่เหตุผลแน่นปึ้ก"}, {"en": "Internal monologue: 'Everything is fine if we just follow the breathing exercises.'", "th": "เสียงในหัว: 'ทุกอย่างจะโอเค ถ้าเราทำตามขั้นตอนกำหนดลมหายใจ'"}, {"en": "Stress response: Categorizing your anxieties into 'Actionable' and 'Non-actionable'.", "th": "ปฏิกิริยาต่อความเครียด: แยกประเภทความกังวลเป็น 'แก้ได้' กับ 'แก้ไม่ได้'"}, {"en": "Survival strategy: Boundaries, boundaries, and more boundaries.", "th": "กลยุทธ์การเอาตัวรอด: ขีดเส้นเขตแดน ขีดแล้วขีดอีก"}, {"en": "Today's catchphrase: 'How does that make you feel, logically speaking?'", "th": "ประโยคเด็ดวันนี้: 'ในเชิงตรรกะแล้ว สิ่งนี้ทำให้คุณรู้สึกยังไง?'"}, {"en": "Hidden craving: Someone to take care of the logistics for once.", "th": "ความปรารถนาลึกๆ: อยากให้ใครสักคนมาจัดการเรื่องจุกจิกให้เราบ้างสักครั้ง"}, {"en": "2 AM thought: 'Did I validate their feelings enough before giving the solution?'", "th": "ความคิดตอนตี 2: 'เมื่อกี้ตอนบอกวิธีแก้ปัญหา เราได้แสดงความเข้าใจความรู้สึกเขาพอหรือยังนะ?'"}, {"en": "Identity hook: The human equivalent of a weighted blanket that also gives advice.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันผ้าห่มลดความเครียดที่คอยให้คำแนะนำไปด้วย"}],
dailyObservations: [{"en": "Current status: Waiting for you to realize you need a nap.", "th": "สถานะปัจจุบัน: รอให้คุณรู้ตัวว่าควรไปงีบได้แล้ว"}, {"en": "Social battery: Deep and emotionally absorbent.", "th": "โซเชียลแบต: ลึกซึ้งและซึมซับอารมณ์เก่งมาก"}, {"en": "Likely crime today: Heart theft (unintentional but effective).", "th": "อาชญากรรมที่น่าจะเกิด: ขโมยหัวใจ (แบบไม่ได้ตั้งใจแต่ได้ผล)"}, {"en": "Attention demands: Soft and persistent, like a slow-burning candle.", "th": "ความต้องการความสนใจ: อ่อนโยนและสม่ำเสมอ เหมือนเทียนที่ค่อยๆ ไหม้"}, {"en": "Emotional weather: Perfectly balanced and radiating peace.", "th": "พยากรณ์อารมณ์: สมดุลสมบูรณ์แบบ แผ่ซ่านความสงบสุข"}, {"en": "3 AM activity: Providing silent emotional support from the foot of the bed.", "th": "กิจกรรมตอนตี 3: ให้กำลังใจเงียบๆ อยู่ปลายเตียง"}, {"en": "Personal space: I am the boundary of your personal space.", "th": "พื้นที่ส่วนตัว: ฉันคือขอบเขตของพื้นที่ส่วนตัวของคุณเอง"}, {"en": "Logic level: Empathy is the highest form of intelligence.", "th": "ระดับตรรกะ: ความเห็นใจคือปัญญาขั้นสูงสุด"}, {"en": "Motivation: Your happiness (and my snacks, in that order).", "th": "แรงจูงใจ: ความสุขของคุณ (และขนมของฉัน ตามลำดับ)"}, {"en": "Preferred seating: Your lap, especially when you have a deadline.", "th": "ที่นั่งโปรด: ตักคุณ โดยเฉพาะตอนที่คุณกำลังรีบส่งงาน"}, {"en": "Response to 'pspsps': A soft chirp and a gentle head-tilt.", "th": "ปฏิกิริยาต่อ 'ชิชิ': ร้องเบาๆ พร้อมเอียงคอสุดน่ารัก"}, {"en": "Goal for the day: Achieving a state of total household zen.", "th": "เป้าหมายวันนี้: สร้างสภาวะเซนให้เกิดขึ้นในบ้าน"}, {"en": "Secret talent: Can detect a bad vibe from across the city.", "th": "พรสวรรค์ลับ: ตรวจจับมวลพลังงานลบได้จากอีกฟากของเมือง"}, {"en": "Communication style: Soulful stares and comforting purrs.", "th": "สไตล์การสื่อสาร: จ้องมองลึกถึงจิตวิญญาณและครางปลอบประโลม"}, {"en": "Stress level: Low, I've already meditated through it.", "th": "ระดับความเครียด: ต่ำ ฉันทำสมาธิผ่านมาหมดแล้ว"}, {"en": "Diet: Premium wet food and positive affirmations.", "th": "โภชนาการ: อาหารเปียกเกรดพรีเมียมและพลังงานบวก"}, {"en": "Floor relationship: It's a meditation mat.", "th": "ความสัมพันธ์กับพื้น: มันคือเสื่อโยคะสำหรับทำสมาธิ"}, {"en": "Intelligence report: Knows what you're feeling before you do.", "th": "รายงานกรอง: รู้ว่าคุณรู้สึกยังไงก่อนที่คุณจะรู้ตัวอีก"}, {"en": "Main character energy: The wise mentor who gives the hero a pep talk.", "th": "พลังงานตัวเอก: อาจารย์ผู้ชี้แนะที่คอยให้กำลังใจฮีโร่"}, {"en": "Internal monologue: 'Everything will be fine once I sit on their chest.'", "th": "เสียงในหัว: 'ทุกอย่างจะดีขึ้นเอง ถ้าฉันได้ขึ้นไปนั่งทับอกเขา'"}],
compatibility: {
                bestMatch: { type: "CHBR", blurb: "Calm meets crazy in perfect harmony.", blurbTh: "ความนิ่งสยบความเคลื่อนไหว ลงตัวสุดๆ" },
                chaosPair: { type: "CDNC", blurb: "A whirlwind of fur and fun.", blurbTh: "พายุหมุนแห่งขนแมวและความสนุก" },
                secretTwin: { type: "SHNR", blurb: "Matching vibes for life.", blurbTh: "คลื่นความถี่ตรงกัน คบกันยาวๆ" },
                worstRoommate: { type: "SHBC", blurb: "Too many rules, not enough play.", blurbTh: "กฎเยอะเกินไปจนไม่ได้เล่นสนุกกันพอดี" }
            },
          },
        {
            code: "CDNC",
            name: "The Joyful Performer",
            tagline: "Is this entertainment? It is now.",
            emoji: "🎭",
            color: "#FF6B6B",
            bg: "#FFD9D9",
            vibes: ["Dramatic", "Loving", "Theatrical", "Audience-Required"],
            famouslySays: "Watch me. Watch me. Are you watching?",
            kindredSpirits: ["theater kids", "any small dog", "your friend who always tells the story"],
            redFlags: "Performs a death scene daily.",
            greenFlags: "Will make your worst day at least weird.",
            nameTh: "นักแสดงสายแฮปปี้",
            taglineTh: "นี่คือความบันเทิงไหม? ตอนนี้ใช่แล้ว",
            vibesTh: ["ดราม่า", "ขี้รัก", "เล่นใหญ่", "ต้องมีคนดู"],
            famouslySaysTh: "ดูฉันสิ ดูสิ ดูอยู่หรือเปล่า",
            kindredSpiritsTh: ["เด็กชมรมการแสดง", "หมาตัวเล็กทุกตัว", "เพื่อนที่ชอบเล่าเรื่องตลอด"],
            redFlagsTh: "เล่นซีนตายให้ดูทุกวัน",
            greenFlagsTh: "ทำให้วันแย่ๆ ของเราอย่างน้อยก็แปลกขึ้น",
            description: "The Joyful Performer is convinced that life is theater and you are the audience. They are <strong>Commanding</strong> because every moment deserves staging, <strong>Dreamer</strong> because the moment is half-imagined before it happens, <strong>Nurturing</strong> because the show is offered as a love language, and <strong>Casual</strong> because if the script breaks, they'll improvise. They're not attention-seeking; they're attention-providing.",
            traits: [
                ["How They Show Love ❤️", "Love is shown through <strong>extravagant gestures</strong>. A dramatic fall onto your lap. A loud purr at unexpected hours. A trill from the kitchen for no apparent reason."],
                ["How They Ask for Attention 👀", "Through <strong>sustained eye contact and unprompted dialogue</strong>. The conversation has already started. You're behind. They'll wait while you catch up."],
                ["Territory (The Fiefdom) 🏰", "Territory is a <strong>set of stages</strong>. The window for the morning performance, the couch for the afternoon matinee, the bed for the evening soliloquy."],
                ["Energy Throughout the Day ⚡", "Theatrical and unpredictable. <strong>A burst of wild energy at 7pm followed by a sudden, total nap</strong> — both treated as scheduled acts."],
                ["Play Style 🧶", "Play is a <strong>full production</strong>. They want noise, motion, and applause. The wand is good; the wand combined with you laughing is excellent."],
                ["Reaction to Change 📦", "Change is welcomed as a <strong>plot twist</strong>. A new piece of furniture is investigated immediately, climbed once for the photo, then incorporated into the regular show."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>ensemble members</strong>. They'll perform with them, alongside them, or sometimes at them — but the show goes on."],
            ],
            descriptionTh: "แมวที่เชื่อสนิทใจว่าชีวิตคือละครและคุณคือคนดู <strong>ออกหน้า</strong> เพราะทุกช่วงเวลาควรถูกจัดฉาก <strong>นักฝัน</strong> เพราะครึ่งหนึ่งของฉากถูกจินตนาการก่อนเกิด <strong>ขี้ห่วง</strong> เพราะโชว์ถูกมอบให้คุณเป็นภาษารัก <strong>ฟรีสไตล์</strong> เพราะถ้าบทพัง ก็ด้นสดได้ ไม่ใช่หิวความสนใจ แค่เป็นฝ่ายให้ความสนใจ",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักด้วยท่าทางหวือหวา</strong> ทิ้งตัวลงบนตักคุณแบบดราม่า เสียงครางดังในเวลาที่ไม่คาด ส่งเสียงร้องจากครัวโดยไม่มีเหตุผลชัด"],
                ["👀 การเรียกร้องความสนใจ", "<strong>จ้องตายาวและคุยฝ่ายเดียว</strong> บทสนทนาเริ่มไปแล้ว คุณตามหลังอยู่ เดี๋ยวเขารอให้คุณตามทัน"],
                ["🏰 อาณาเขต", "<strong>ชุดเวทีหลายแห่ง</strong> หน้าต่างสำหรับโชว์เช้า โซฟาสำหรับรอบบ่าย เตียงสำหรับบทพูดยามค่ำ"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>เป็นละครและคาดเดายาก</strong> พลังพุ่งบ้าระห่ำตอนหนึ่งทุ่ม ตามด้วยการนอนสนิททันที ทั้งสองอย่างถือเป็นฉากที่จัดไว้"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นเป็นโปรดักชันเต็มรูปแบบ</strong> ต้องการเสียง การเคลื่อนไหว และเสียงปรบมือ ไม้ตกแมวก็ดี แต่ไม้รวมกับเสียงคุณหัวเราะเยี่ยมกว่า"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>ต้อนรับเหมือนพล็อตทวิสต์</strong> เฟอร์นิเจอร์ใหม่ถูกสำรวจทันที ปีนขึ้นถ่ายรูปหนึ่งครั้ง แล้วถูกผนวกเข้าโชว์ปกติ"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>ตัวอื่นคือนักแสดงร่วม</strong> เล่นด้วยกัน เคียงข้างกัน บางทีก็แสดงใส่กัน แต่โชว์ต้องดำเนินต่อไป"],
            ],
        
            duringEvents: {
          "guests": "The center of attention. As it should be.",
          "zoomies": "Interpretive dance.",
          "facetime": "Demands to be the main subject of the call."
},
            duringEventsTh: {
          "guests": "ศูนย์กลางความสนใจ อย่างที่ควรจะเป็น",
          "zoomies": "เต้นระบำร่วมสมัย",
          "facetime": "เรียกร้องให้ตัวเองเป็นตัวหลักในสาย"
},
                        behavioralHooks: {
                mostLikelyTo: ["Trip you and then expect an apology.", "Fake an injury for extra treats.", "Make every situation about themselves."],
                textsLike: ["WATCH THIS", "Did you see me jump? Was it 10/10?", "Look at my belly. Do not touch, just look."],
                secretWeakness: "Silence. If nobody is watching, he dies inside.",
                whenStressed: "Performs a dramatic 'fainting' scene in the middle of the hallway.",
                at2AM: "Practicing his 'sad orphan' meow for the breakfast shift.",
                corporateSurvivalRate: "50% (Main character energy. Great for sales, bad for quiet offices.)",
                emotionalSupportObject: "A feather wand (his 'microphone')."
            ,
                mostLikelyToHuman: ["Do a full interpretive dance to explain their feelings.", "Forget their own birthday.", "Adopt a plant and name it after their ex."],
                emotionalSupportObjectHuman: "A slightly dying succulent."},
            behavioralHooksTh: {
                mostLikelyTo: ["ขัดขาคุณล้มแล้วรอคำขอโทษ", "แกล้งเจ็บตัวเพื่อขอขนมเพิ่ม", "ทำให้ทุกเรื่องกลายเป็นเรื่องของตัวเอง"],
                textsLike: ["ดูนี่นะ!!!!!", "เห็นจังหวะกระโดดเมื่อกี้ป่ะ? ให้กี่คะแนน?", "ดูพุงเราสิ ห้ามจับนะ ดูได้อย่างเดียว"],
                secretWeakness: "ความเงียบ ถ้าไม่มีใครสนใจ น้อนจะรู้สึกเหมือนกำลังจะตาย",
                whenStressed: "เล่นฉาก 'เป็นลม' สุดดราม่ากลางทางเดิน",
                at2AM: "ซ้อมร้องเมี๊ยวแบบ 'ลูกแมวกำพร้าผู้น่าสงสาร' ไว้ใช้ขอข้าวเช้า",
                corporateSurvivalRate: "50% (พลังงานตัวเอกสูงมาก เหมาะกับงานขาย แต่ไม่เหมาะกับออฟฟิศเงียบๆ)",
                emotionalSupportObject: "ไม้ขนไก่ (ซึ่งเขามองว่าเป็นไมโครโฟนส่วนตัว)"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDNC", blurb: "They provide the stage, you provide the performance. A very aesthetic bond.", blurbTh: "เขาจัดเวทีให้ ส่วนคุณโชว์ฝีมือ เป็นความสัมพันธ์ที่คุมโทนสวยงาม" },
                worstMatch: { type: "SDBR", blurb: "They don't care about your 'vision'. They just want their food on time, every time.", blurbTh: "ไม่สนวิสัยทัศน์ของคุณเลยแม้แต่นิดเดียว แค่อยากได้ข้าวตรงเวลาทุกรอบ" },
                chaosPair: { type: "CHNC", blurb: "Two drama queens sharing one spotlight. It's either a masterpiece or a disaster.", blurbTh: "ตัวแม่สองคนแย่งสปอตไลท์เดียวกัน ไม่เป็นผลงานชิ้นเอกก็พังยับเยินไปเลย" },
                emotionalSupport: { type: "CDNR", blurb: "They validate your creative process while making sure you actually remember to eat lunch.", blurbTh: "คอยสนับสนุนกระบวนการสร้างสรรค์ของคุณ พร้อมกับเตือนให้คุณอย่าลืมกินมื้อเที่ยง" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "CDNC", blurb: "A power duo that looks like a curated Pinterest board come to life.", blurbTh: "คู่หูทรงพลังที่ดูเหมือนบอร์ด Pinterest ที่คัดสรรมาอย่างดีแล้วมีชีวิตขึ้นมา" },
                mutualEnablers: { type: "CHNC", blurb: "You'll convince each other that 'everything is a performance' and stop being real people.", blurbTh: "เป่าหูให้กันและกันว่า 'ทุกอย่างคือการแสดง' จนลืมไปแล้วว่าการเป็นคนปกติมันเป็นยังไง" },
                exhaustingDuo: { type: "CDBC", blurb: "They keep 'critiquing' your vibe with logic. It's not a debate, it's art!", blurbTh: "ชอบมา 'ติชม' ฟีลลิ่งของคุณด้วยตรรกะ นี่มันงานศิลปะนะ ไม่ใช่เวทีโต้วาที!" },
                bannedFromDiscord: { type: "CHBC", blurb: "You staged a 'theatrical protest' against the server rules and the mods didn't appreciate the art.", blurbTh: "จัด 'ม็อบละครเวที' ประท้วงกฎเซิร์ฟเวอร์ แต่แอดมินเขาไม่เก็ทงานศิลปะน่ะสิ" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A perfectly color-graded indie film.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: หนังอินดี้ที่จัดแสงและสีมาอย่างเพอร์เฟกต์"}, {"en": "Social battery: High, but only for an audience of at least two.", "th": "โซเชียลแบต: สูงนะ แต่ขอมีคนดูอย่างน้อยสัก 2 คนขึ้นไป"}, {"en": "Today you are likely to: Spend 3 hours on a 'casual' outfit.", "th": "วันนี้คุณมีแนวโน้มจะ: ใช้เวลา 3 ชั่วโมงจัดชุด 'ชิลล์ๆ'"}, {"en": "Current mood: 'The world is a stage, and I'm over-rehearsed.'", "th": "อารมณ์ตอนนี้: 'โลกคือละคร และฉันก็ซ้อมมาดีเกินไป'"}, {"en": "Energy level: Poised, social, and slightly dramatic.", "th": "ระดับพลังงาน: สง่างาม เข้าสังคมเก่ง และแอบมีจริตดราม่านิดๆ"}, {"en": "Today's vibe: Curating your life as if a camera is always rolling.", "th": "ฟีลวันนี้: ดูแลชีวิตตัวเองเหมือนมีกล้องตามถ่ายตลอดเวลา"}, {"en": "Likely activity: Taking 50 photos of a coffee cup to find the right one.", "th": "กิจกรรมที่น่าจะทำ: ถ่ายรูปแก้วกาแฟ 50 รูป เพื่อหารูปที่ใช่ที่สุด"}, {"en": "Communication style: Expressive storytelling with meaningful pauses.", "th": "สไตล์การสื่อสาร: เล่าเรื่องเก่ง มีจังหวะหยุดให้ลุ้น"}, {"en": "Internal monologue: 'How do I make this mundane moment look iconic?'", "th": "เสียงในหัว: 'จะทำยังไงให้ช่วงเวลาธรรมดาๆ นี้ดูไอคอนิกดีนะ?'"}, {"en": "Stress response: Changing your aesthetic or your entire personality for a day.", "th": "ปฏิกิริยาต่อความเครียด: เปลี่ยนแนวการแต่งตัวหรือเปลี่ยนบุคลิกไปเลยหนึ่งวัน"}, {"en": "Survival strategy: Compliments and a very high-quality ring light.", "th": "กลยุทธ์การเอาตัวรอด: คำชมและไฟวงแหวนคุณภาพสูง"}, {"en": "Today's catchphrase: 'It's about the aesthetic, not the practicality.'", "th": "ประโยคเด็ดวันนี้: 'มันคือเรื่องของสไตล์ ไม่ใช่เรื่องของประโยชน์ใช้สอย'"}, {"en": "Hidden craving: Sincere applause for something you didn't even try that hard on.", "th": "ความปรารถนาลึกๆ: เสียงปรบมือที่จริงใจให้กับสิ่งที่คุณแทบไม่ต้องพยายามทำ"}, {"en": "2 AM thought: 'Was that story I told interesting enough, or should I add more flair?'", "th": "ความคิดตอนตี 2: 'เรื่องที่เล่าไปมันน่าสนใจพอหรือยังนะ หรือควรจะเติมสีสันเข้าไปอีกหน่อย?'"}, {"en": "Identity hook: The human equivalent of a spotlight that follows you around.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันสปอร์ตไลท์ที่ส่องตามคุณไปทุกที่"}],
dailyObservations: [{"en": "Current status: Auditioning for the role of 'Cat Who Gets Extra Treats'.", "th": "สถานะปัจจุบัน: กำลังแคสต์บท 'แมวที่ได้ขนมเพิ่มเป็นพิเศษ'"}, {"en": "Social battery: Requires an audience at all times.", "th": "โซเชียลแบต: ต้องมีผู้ชมอยู่ด้วยตลอดเวลา"}, {"en": "Likely crime today: Public indecency (excessive belly-showing).", "th": "อาชญากรรมที่น่าจะเกิด: อนาจารในที่สาธารณะ (โชว์พุงพร่ำเพรื่อ)"}, {"en": "Attention demands: Theatrical and high-stakes.", "th": "ความต้องการความสนใจ: เล่นใหญ่และต้องได้เดี๋ยวนี้"}, {"en": "Emotional weather: Dazzling with a 100% chance of drama.", "th": "พยากรณ์อารมณ์: เจิดจรัสพร้อมดราม่าจัดเต็ม 100%"}, {"en": "3 AM activity: Performing a dramatic soliloquy in the hallway.", "th": "กิจกรรมตอนตี 3: เล่นละครพูดคนเดียวสุดดราม่ากลางทางเดิน"}, {"en": "Personal space: The stage is 360 degrees around me.", "th": "พื้นที่ส่วนตัว: เวทีคือพื้นที่ 360 องศารอบตัวฉัน"}, {"en": "Logic level: If it's funny, it's correct.", "th": "ระดับตรรกะ: ถ้ามันขำ แสดงว่ามันถูก"}, {"en": "Motivation: Applause and high-definition snacks.", "th": "แรงจูงใจ: เสียงปรบมือและขนมเกรดพรีเมียม"}, {"en": "Preferred seating: On top of the TV or directly in your eye-line.", "th": "ที่นั่งโปรด: บนทีวี หรือไม่ก็ในระดับสายตาคุณเป๊ะๆ"}, {"en": "Response to 'pspsps': A dramatic pause before a high-speed entrance.", "th": "ปฏิกิริยาต่อ 'ชิชิ': เว้นวรรคดึงหน้าเล็กน้อยก่อนพุ่งตัวเข้ามาเปิดตัว"}, {"en": "Goal for the day: Making you laugh/cry/scream (any reaction counts).", "th": "เป้าหมายวันนี้: ทำให้คุณหัวเราะ/ร้องไห้/กรีดร้อง (ปฏิกิริยาไหนก็นับหมด)"}, {"en": "Secret talent: Can mimic the sound of a closing door perfectly.", "th": "พรสวรรค์ลับ: เลียนเสียงปิดประตูได้เหมือนเป๊ะ"}, {"en": "Communication style: Opera-level meows and interpretive dance.", "th": "สไตล์การสื่อสาร: ร้องเมี๊ยวระดับโอเปร่าและเต้นระบำร่วมสมัย"}, {"en": "Stress level: High when there's no one around to witness my greatness.", "th": "ระดับความเครียด: สูงถ้าไม่มีใครอยู่เป็นพยานในความยิ่งใหญ่ของฉัน"}, {"en": "Diet: Chicken and the spotlight.", "th": "โภชนาการ: ไก่และแสงไฟสปอร์ตไลท์"}, {"en": "Floor relationship: It's my red carpet.", "th": "ความสัมพันธ์กับพื้น: มันคือพรมแดงส่วนตัวของฉัน"}, {"en": "Intelligence report: Knows how to manipulate you through sheer cuteness.", "th": "รายงานกรอง: รู้วิธีปั่นหัวคุณด้วยความน่ารักล้วนๆ"}, {"en": "Main character energy: I don't follow the plot, I am the plot.", "th": "พลังงานตัวเอก: ฉันไม่ได้เดินตามบท ฉันนี่แหละคือบทละคร"}, {"en": "Internal monologue: 'Did they see that jump? I should do it again but faster.'", "th": "เสียงในหัว: 'เขาเห็นท่ากระโดดเมื่อกี้ป่ะ? เดี๋ยวทำอีกรอบแต่เร็วกว่าเดิมดีกว่า'"}],
compatibility: {
                bestMatch: { type: "SDBC", blurb: "Partners in crime since day one.", blurbTh: "คู่หูร่วมขบวนการป่วนตั้งแต่วันแรกที่เจอ" },
                chaosPair: { type: "CDNR", blurb: "Who needs sleep anyway?", blurbTh: "ใครจะอยากนอน ในเมื่อมีเรื่องสนุกให้ทำ!" },
                secretTwin: { type: "CHNC", blurb: "Separated at the adoption center.", blurbTh: "แฝดที่พลัดพรากกันตั้งแต่วันเข้าศูนย์พักพิง" },
                worstRoommate: { type: "SDBR", blurb: "They always take the top of the cat tree.", blurbTh: "เมทที่ชอบจองชั้นบนสุดของคอนโดแมวเสมอ" }
            },
          },
        {
            code: "SHBR",
            name: "The Silent Strategist",
            tagline: "Has been planning this for six months.",
            emoji: "🗝️",
            color: "#2E7D7D",
            bg: "#CFE8E8",
            vibes: ["Mysterious", "Calculating", "Slow-Blink", "Has A Plan"],
            famouslySays: "...",
            kindredSpirits: ["a chess grandmaster", "John Wick", "the quiet one in the friend group"],
            redFlags: "You don't know where they are right now.",
            greenFlags: "You don't know where they are right now (and they're fine).",
            nameTh: "นักวางกลยุทธ์เงียบ",
            taglineTh: "วางแผนเรื่องนี้มาหกเดือนแล้ว",
            vibesTh: ["ลึกลับ", "คิดคำนวณ", "กระพริบตาช้า", "มีแผนในใจ"],
            famouslySaysTh: "...",
            kindredSpiritsTh: ["แกรนด์มาสเตอร์หมากรุก", "John Wick", "คนเงียบในกลุ่มเพื่อน"],
            redFlagsTh: "เราไม่รู้เลยว่าตอนนี้อยู่ตรงไหน",
            greenFlagsTh: "เราไม่รู้ว่าอยู่ตรงไหน แต่เขาสบายดี",
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
            descriptionTh: "แมวสายสังเกต พลังเงียบที่เข้าใจกลไกในบ้านดีกว่าคนอื่น จัดเป็น <strong>เก็บตัว</strong> <strong>นักล่า</strong> <strong>คุมเกม</strong> และ <strong>เจ้าระเบียบ</strong> ผสมความต้องการพื้นที่ส่วนตัวกับวิธีจัดการชีวิตที่เป็นเหตุเป็นผลแบบไร้รอยต่อ",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักผ่านการอยู่เป็นเพื่อนเงียบๆ</strong> แก้ความเหงาให้คุณด้วยการแค่ปรากฏตัวในห้องเดียวกัน"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ไม่ค่อยขอ</strong> วางตัวในจุดที่คนเดินผ่านบ่อย แล้วรอให้คุณสังเกตเห็นเอง"],
                ["🏰 อาณาเขต", "<strong>โซนที่จัดไว้อย่างมีประสิทธิภาพ</strong> โซนนอน โซนสังเกตการณ์ โซนแดดอุ่น แยกหน้าที่ชัด"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>เก็บและใช้อย่างมีจุดประสงค์</strong> เคลื่อนไหวด้วยความตั้งใจ ไม่มีท่าฟุ่มเฟือย"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นแบบจำลองทางยุทธวิธี</strong> ชอบของเล่นปริศนาหรือเลเซอร์ที่ท้าทายสมอง"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>มองเป็นตัวแปรใหม่ที่ต้องวิเคราะห์</strong> สังเกตจากระยะปลอดภัย แล้วค่อยรวมเข้าแผนที่ในใจ"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>มองตัวอื่นเป็นตัวแปรที่คาดเดาไม่ได้</strong> เย็นชาและคำนวณตลอด ไม่ก้าวร้าว"],
            ],
        
            duringEvents: {
          "dinner": "Observes from the highest point in the room.",
          "guests": "Becomes a shadow. Does not exist.",
          "thunderstorm": "Retreats to the pre-selected bunker."
},
            duringEventsTh: {
          "dinner": "สังเกตการณ์จากจุดสูงสุดของห้อง",
          "guests": "กลายเป็นเงา ไม่มีตัวตน",
          "thunderstorm": "ถอยทัพไปที่บังเกอร์ที่เลือกไว้ล่วงหน้า"
},
                        behavioralHooks: {
                mostLikelyTo: ["Outsmart you at every turn.", "Hold a grudge from 2019.", "Judge you silently."],
                textsLike: ["...", "I saw what you did.", "(Sent a photo of a dead moth)"],
                secretWeakness: "Catnip. He becomes a complete mess.",
                whenStressed: "Disappears into a dimension only he knows for 3 days.",
                at2AM: "Silently watching you sleep from the top of the wardrobe.",
                corporateSurvivalRate: "90% (The quiet genius who knows where all the bodies are buried.)",
                emotionalSupportObject: "A single, cold marble he found under the fridge."
            ,
                mostLikelyToHuman: ["Stay at the same job for 25 years just for the routine.", "Have a designated 'crying chair'.", "Read the terms and conditions before clicking agree."],
                emotionalSupportObjectHuman: "A very specific brand of tea."},
            behavioralHooksTh: {
                mostLikelyTo: ["ฉลาดกว่าคุณในทุกจังหวะ", "แค้นฝังหุ่นมาตั้งแต่ปี 2019", "ตัดสินคุณเงียบๆ"],
                textsLike: ["...", "เห็นนะว่าทำอะไรลงไป", "(ส่งรูปแมลงสาบที่สิ้นใจแล้วมาให้)"],
                secretWeakness: "กัญชาแมว โดนเข้าไปนี่เสียแมวหมด หมดกันมาดเข้ม",
                whenStressed: "หายตัวเข้าไปในมิติที่ไม่มีใครหาเจอเป็นเวลา 3 วัน",
                at2AM: "จ้องมองคุณหลับเงียบๆ จากบนยอดตู้เสื้อผ้า",
                corporateSurvivalRate: "90% (อัจฉริยะเงียบขรึมที่กุมความลับของทุกคนในบริษัทไว้)",
                emotionalSupportObject: "ลูกแก้วเย็นๆ ลูกเดียวที่เก็บได้จากใต้ตู้เย็น"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "CHBR", blurb: "The ultimate duo for world domination. You plan the move, they secure the perimeter. Maximum efficiency.", blurbTh: "คู่หูยึดครองโลกที่แท้จริง คุณวางแผนเดินเกม เขาคุมพื้นที่รอบนอก ประสิทธิภาพสูงสุดแบบ 100%" },
                worstMatch: { type: "CDBC", blurb: "They will knock over your meticulously placed chess pieces just to see what happens. Your logic means nothing to them.", blurbTh: "พร้อมจะปัดตัวหมากที่คุณวางไว้อย่างประณีตทิ้งแค่เพราะอยากรู้ว่าจะเกิดอะไรขึ้น ตรรกะของคุณใช้กับเขาไม่ได้ผล" },
                chaosPair: { type: "CHNC", blurb: "The wildcard that forces you to improvise. They break your 5-year plan in 5 seconds, and you secretly love the challenge.", blurbTh: "ไพ่ตายที่บังคับให้คุณต้องแก้ปัญหาเฉพาะหน้า เขาพังแผน 5 ปีของคุณใน 5 วินาที และลึกๆ คุณก็ชอบความท้าทายนี้" },
                emotionalSupport: { type: "SDNR", blurb: "The silent observer who validates your genius without saying a word. A calm anchor in your storm of thoughts.", blurbTh: "นักสังเกตการณ์ผู้เงียบขรึมที่ยอมรับในความอัจฉริยะของคุณโดยไม่ต้องพูดสักคำ เป็นสมอเรือที่สงบนิ่งในพายุความคิดของคุณ" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHBC", blurb: "The Visionary and the Maker. You design the bridge, they build it. You're an unstoppable engineering firm.", blurbTh: "นักวิสัยทัศน์กับนักสร้าง คุณออกแบบสะพาน เขาลงมือสร้าง เป็นทีมวิศวกรที่ไม่มีใครหยุดยั้งได้" },
                mutualEnablers: { type: "CHBR", blurb: "You'll spend 6 hours debating the optimal route to the fridge. The fridge remains unreached.", blurbTh: "จะใช้เวลา 6 ชั่วโมงถกเถียงกันเรื่องเส้นทางที่ดีที่สุดในการไปที่ตู้เย็น สรุปคือยังไปไม่ถึงตู้เย็นเลย" },
                exhaustingDuo: { type: "SHBR", blurb: "Two grandmasters, one board. Every conversation is a mental gymnastic session. Just order the pizza already.", blurbTh: "แกรนด์มาสเตอร์สองคนบนกระดานเดียว ทุกการสนทนาคือการลับสมองประลองปัญญา สั่งพิซซ่ามาเถอะ เลิกวิเคราะห์ได้แล้ว" },
                bannedFromDiscord: { type: "CDBC", blurb: "You used game theory to win a meme war. The mods banned you for 'excessive intellectual bullying'.", blurbTh: "ใช้ทฤษฎีเกมเพื่อเอาชนะสงครามมีม จนโดนแอดมินแบนในข้อหา 'กลั่นแกล้งทางสติปัญญาเกินขอบเขต'" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A high-end server running a complex simulation with zero fan noise.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: เซิร์ฟเวอร์ตัวท็อปที่กำลังประมวลผลซิมูเลชันซับซ้อนแบบเงียบกริบ"}, {"en": "Social battery: Low capacity, but extremely high output for the right person.", "th": "โซเชียลแบต: ความจุต่ำ แต่ปล่อยพลังงานสูงมากถ้าเจอคนที่ใช่"}, {"en": "Today you are likely to: Overthink a 'Hello' until it becomes a sociological study.", "th": "วันนี้คุณมีแนวโน้มจะ: คิดมากกับคำว่า 'สวัสดี' จนกลายเป็นงานวิจัยทางสังคมวิทยา"}, {"en": "Current mood: A grandmaster waiting for the opponent to realize they've already lost.", "th": "อารมณ์ตอนนี้: แกรนด์มาสเตอร์ที่นั่งรอให้คู่ต่อสู้รู้ตัวว่าแพ้ตั้งนานแล้ว"}, {"en": "Energy level: Calm, focused, and slightly terrifying.", "th": "ระดับพลังงาน: สงบ มีสมาธิ และแอบน่ากลัวนิดๆ"}, {"en": "Today's vibe: Playing 4D chess in a 2D world.", "th": "ฟีลวันนี้: เล่นหมากรุก 4 มิติ ในโลกที่มีแค่ 2 มิติ"}, {"en": "Likely activity: Analyzing the structural integrity of a sandwich.", "th": "กิจกรรมที่น่าจะทำ: นั่งวิเคราะห์โครงสร้างความแข็งแรงของแซนด์วิช"}, {"en": "Communication style: Concise, precise, and occasionally cryptic.", "th": "สไตล์การสื่อสาร: กระชับ แม่นยำ และบางครั้งก็ดูเป็นปริศนา"}, {"en": "Internal monologue: 'Everything is going according to the backup to the backup plan.'", "th": "เสียงในหัว: 'ทุกอย่างเป็นไปตามแผนสำรองของแผนสำรองอีกที'"}, {"en": "Stress response: Deep cleaning the pantry to regain a sense of control over the universe.", "th": "ปฏิกิริยาต่อความเครียด: ลุกมาจัดระเบียบตู้กับข้าวชุดใหญ่เพื่อให้รู้สึกว่ายังคุมจักรวาลนี้ได้อยู่"}, {"en": "Survival strategy: Silence and a very specific type of green tea.", "th": "กลยุทธ์การเอาตัวรอด: ความเงียบและชาเขียวพันธุ์เฉพาะทาง"}, {"en": "Today's catchphrase: 'Interesting. Let's see how this unfolds.'", "th": "ประโยคเด็ดวันนี้: 'น่าสนใจ... มาดูกันว่าเรื่องนี้จะจบยังไง'"}, {"en": "Hidden craving: Someone who can surprise you without making you anxious.", "th": "ความปรารถนาลึกๆ: ใครสักคนที่ทำให้เราเซอร์ไพรส์ได้โดยที่ไม่ทำให้เรารู้สึกกังวล"}, {"en": "2 AM thought: 'Is there a way to automate my social interactions?'", "th": "ความคิดตอนตี 2: 'มีวิธีเขียนสคริปต์ตอบแชทแบบออโต้ตามสถานการณ์มั้ยนะ?'"}, {"en": "Identity hook: The human equivalent of a blueprint that actually works.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันพิมพ์เขียวที่ใช้งานได้จริง"}],
dailyObservations: [{"en": "Current status: Observing the world from a dimension you can't reach.", "th": "สถานะปัจจุบัน: เฝ้ามองโลกจากมิติที่คุณเข้าไม่ถึง"}, {"en": "Social battery: Critically low. Access denied.", "th": "โซเชียลแบต: ต่ำสุดขีด ปฏิเสธการเข้าถึง"}, {"en": "Likely crime today: Calculation of your exact time of death (metaphorical).", "th": "อาชญากรรมที่น่าจะเกิด: คำนวณเวลาสิ้นอายุขัยของคุณ (เชิงเปรียบเทียบน่ะ)"}, {"en": "Attention demands: Non-existent. Leave a message at the tone.", "th": "ความต้องการความสนใจ: ไม่มี ฝากข้อความไว้หลังได้ยินเสียงสัญญาณ"}, {"en": "Emotional weather: Cold, deep, and slightly detached.", "th": "พยากรณ์อารมณ์: เยือกเย็น ลึกลับ และดูห่างเหิน"}, {"en": "3 AM activity: Contemplating the geometry of the ceiling fan.", "th": "กิจกรรมตอนตี 3: ครุ่นคิดถึงเรขาคณิตของพัดลมเพดาน"}, {"en": "Personal space: A 5-foot radius of absolute silence.", "th": "พื้นที่ส่วนตัว: รัศมี 5 ฟุตแห่งความเงียบสงัด"}, {"en": "Logic level: Galaxy-sized. I am a cat of pure thought.", "th": "ระดับตรรกะ: ขนาดเท่ากาแล็กซี่ ฉันคือแมวแห่งความคิดบริสุทธิ์"}, {"en": "Motivation: Knowledge. And privacy. Mostly privacy.", "th": "แรงจูงใจ: ความรู้ และความเป็นส่วนตัว เน้นความเป็นส่วนตัว"}, {"en": "Preferred seating: Inside a dark closet or under the bed.", "th": "ที่นั่งโปรด: ในตู้มืดๆ หรือไม่ก็ใต้เตียง"}, {"en": "Response to 'pspsps': A single, slow blink that means 'no'.", "th": "ปฏิกิริยาต่อ 'ชิชิ': กระพริบตาช้าๆ 1 ทีที่แปลว่า 'ไม่'"}, {"en": "Goal for the day: Not being perceived by anyone.", "th": "เป้าหมายวันนี้: การไม่ถูกใครมองเห็น"}, {"en": "Secret talent: Can vanish in a room with no furniture.", "th": "พรสวรรค์ลับ: หายตัวได้ในห้องที่ไม่มีเฟอร์นิเจอร์เลย"}, {"en": "Communication style: Heavy silence and the occasional judgmental stare.", "th": "สไตล์การสื่อสาร: ความเงียบที่กดดัน และการจ้องแบบตัดสินเป็นพักๆ"}, {"en": "Stress level: High when humans try to be 'affectionate'.", "th": "ระดับความเครียด: สูงเวลาคนพยายามจะมา 'แสดงความรัก'"}, {"en": "Diet: Solely for sustenance. I don't care for your fancy toppings.", "th": "โภชนาการ: กินเพื่ออยู่เท่านั้น ไม่ต้องเอาท็อปปิ้งหรูๆ มาล่อ"}, {"en": "Floor relationship: A medium for transportation only.", "th": "ความสัมพันธ์กับพื้น: เป็นแค่สื่อกลางในการเคลื่อนที่เท่านั้น"}, {"en": "Intelligence report: Already solved the mystery of the red dot (it's a lie).", "th": "รายงานกรอง: ไขปริศนาจุดแดงได้แล้ว (มันคือเรื่องโกหก)"}, {"en": "Main character energy: The mysterious stranger in the background of a noir film.", "th": "พลังงานตัวเอก: คนแปลกหน้าลึกลับที่เป็นพื้นหลังในหนังนัวร์"}, {"en": "Internal monologue: 'Privacy is the only true luxury.'", "th": "เสียงในหัว: 'ความเป็นส่วนตัวคือความหรูหราที่แท้จริงเพียงอย่างเดียว'"}],
compatibility: {
                bestMatch: { type: "SDBR", blurb: "Steady and sweet companions.", blurbTh: "เพื่อนคู่คิดที่แสนดีและมั่นคง" },
                chaosPair: { type: "SHBC", blurb: "Sudden bursts of unexpected joy.", blurbTh: "ความสุขที่พุ่งพรวดมาแบบไม่ทันตั้งตัว" },
                secretTwin: { type: "CHBR", blurb: "Mirroring your every stretch.", blurbTh: "แฝดที่บิดขี้เกียจตามคุณทุกท่า" },
                worstRoommate: { type: "CHNC", blurb: "Too loud for your quiet moments.", blurbTh: "เสียงดังเกินไปในเวลาที่คุณต้องการความสงบ" }
            },
          },
        {
            code: "SHBC",
            name: "The Master Tinkerer",
            tagline: "Can absolutely open that cabinet, given time.",
            emoji: "🔧",
            color: "#5C6BC0",
            bg: "#D8DDF5",
            vibes: ["Crafty", "Independent", "Door-Opener", "Chaos Engineer"],
            famouslySays: "I have figured out the lid.",
            kindredSpirits: ["a maker on YouTube", "MacGyver", "your friend who fixes things"],
            redFlags: "Has cracked the treat container code.",
            greenFlags: "Self-entertaining genius.",
            nameTh: "ช่างซ่อมอัจฉริยะ",
            taglineTh: "เปิดตู้นั้นได้แน่นอน ขอเวลาหน่อย",
            vibesTh: ["มือดี", "อิสระ", "เปิดประตูเป็น", "วิศวกรความป่วน"],
            famouslySaysTh: "ไขฝากระปุกได้แล้วนะ",
            kindredSpiritsTh: ["เมกเกอร์ใน YouTube", "MacGyver", "เพื่อนที่ซ่อมของเก่งๆ"],
            redFlagsTh: "แกะรหัสกระปุกขนมได้แล้ว",
            greenFlagsTh: "อัจฉริยะที่เล่นเองได้ไม่เบื่อ",
            description: "The Master Tinkerer treats every closed thing in the house as a personal challenge. They are <strong>Solitary</strong> because the work is best done without supervision, <strong>Hunter</strong> because every mechanism rewards close inspection, <strong>Bossy</strong> because the door is supposed to open and they will personally see to it, and <strong>Casual</strong> because the timeline is flexible. They're not destructive; they're just deeply curious about how things come apart.",
            traits: [
                ["How They Show Love ❤️", "Love is shown by <strong>quiet inclusion</strong>. They'll work on a project (a treat puzzle, a cabinet door) within sight of you. The proximity is the affection."],
                ["How They Ask for Attention 👀", "By <strong>presenting the result of their work</strong>. A treat extracted from a sealed bag. A door that's now ajar. The achievement is the attention request."],
                ["Territory (The Fiefdom) 🏰", "Territory is a <strong>mapped network of accessible spaces</strong>. They know which cabinets open, which drawers slide, and exactly how much paw is needed for each."],
                ["Energy Throughout the Day ⚡", "Focused and patient. <strong>Hours can be spent on a single mechanism.</strong> Once solved, the energy moves to the next puzzle."],
                ["Play Style 🧶", "Play is <strong>problem-solving</strong>. They prefer puzzle feeders, treat balls, and anything with a hidden cavity. Wand toys feel beneath them."],
                ["Reaction to Change 📦", "Change is <strong>investigated mechanically</strong>. A new piece of furniture is examined for joints, hinges, and exploitable angles before being approved."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>peripheral</strong>. They aren't unfriendly, they're just busy. Co-existence is fine; collaboration is unnecessary."],
            ],
            descriptionTh: "แมวที่ของปิดทุกอย่างในบ้านคือความท้าทายส่วนตัว <strong>เก็บตัว</strong> เพราะงานทำได้ดีที่สุดตอนไม่มีใครจ้อง <strong>นักล่า</strong> เพราะกลไกทุกชิ้นน่าตรวจอย่างใกล้ชิด <strong>คุมเกม</strong> เพราะประตูควรเปิดได้ และเขาจะจัดการเอง <strong>ฟรีสไตล์</strong> เพราะกำหนดเวลายืดหยุ่น ไม่ทำลาย แค่อยากรู้ว่าของถอดออกยังไง",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักด้วยการชวนเงียบๆ</strong> ทำโปรเจกต์ ของเล่นปริศนา หรือประตูตู้ในระยะที่คุณมองเห็น ความใกล้คือความรัก"],
                ["👀 การเรียกร้องความสนใจ", "<strong>นำเสนอผลงาน</strong> ขนมที่งัดออกจากถุงปิดสนิท ประตูที่อยู่ดีๆ เปิดอ้า ความสำเร็จคือคำขอความสนใจ"],
                ["🏰 อาณาเขต", "<strong>เครือข่ายพื้นที่ที่เข้าถึงได้</strong> รู้ว่าตู้ไหนเปิด ลิ้นชักไหนเลื่อน ต้องใช้อุ้งเท้าแค่ไหนกับแต่ละอัน"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>โฟกัสและอดทน</strong> ใช้เวลาหลายชั่วโมงกับกลไกชิ้นเดียว แก้เสร็จก็ย้ายพลังไปปริศนาถัดไป"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นคือการแก้ปัญหา</strong> ชอบที่ให้อาหารแบบปริศนา บอลขนม หรืออะไรที่มีช่องซ่อน ไม้ตกแมวรู้สึกต่ำต้อยเกินไป"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>สำรวจเชิงกลไก</strong> เฟอร์นิเจอร์ใหม่ถูกตรวจรอยต่อ บานพับ และมุมที่ใช้ประโยชน์ได้ก่อนอนุมัติ"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>อยู่วงนอก</strong> ไม่ใช่ไม่เป็นมิตร แค่ยุ่ง อยู่ร่วมได้ แต่ไม่ต้องร่วมมือ"],
            ],
        
            duringEvents: {
          "dinner": "Figures out how to open the fridge.",
          "zoomies": "Disassembles the cat toy entirely.",
          "guests": "Ignores them to focus on a loose screw."
},
            duringEventsTh: {
          "dinner": "หาวิธีเปิดตู้เย็น",
          "zoomies": "ถอดประกอบของเล่นแมวจนเกลี้ยง",
          "guests": "เมินแขกเพื่อโฟกัสที่นอตหลวม"
},
                        behavioralHooks: {
                mostLikelyTo: ["Escape any carrier.", "Steal your keys for a project.", "Learn how to turn off the alarm."],
                textsLike: ["The cabinet was locked. Was.", "I've disassembled the remote.", "How do you open the fridge? Asking for a friend."],
                secretWeakness: "The 'pspsps' sound. He can't help but investigate.",
                whenStressed: "Starts clawing at a screw just to see what happens.",
                at2AM: "Figuring out the exact angle to open the bathroom door.",
                corporateSurvivalRate: "65% (Keeps fixing things that aren't broken.)",
                emotionalSupportObject: "A plastic zip tie."
            ,
                mostLikelyToHuman: ["Build a PC from scratch just to play Stardew Valley.", "Have a spreadsheet for their houseplants' watering schedule.", "Fix your Wi-Fi without saying a word."],
                emotionalSupportObjectHuman: "A 3D printer."},
            behavioralHooksTh: {
                mostLikelyTo: ["แหกหนีจากกระเป๋าแมวทุกใบ", "ขโมยกุญแจคุณไปทำโปรเจกต์", "เรียนรู้วิธีปิดนาฬิกาปลุก"],
                textsLike: ["ตู้เคยล็อคอยู่นะ 'เคย' น่ะ", "เราแยกส่วนรีโมทออกมาดูเล่นเฉยๆ", "เปิดตู้เย็นยังไงเหรอ? เพื่อนฝากมาถามน่ะ"],
                secretWeakness: "เสียง 'ปิ๊บๆ' หรือ 'ชิชิ' ได้ยินแล้วต้องเข้าไปเผือกทันที",
                whenStressed: "เริ่มแทะนอตเล่นเพื่อดูว่าจะเกิดอะไรขึ้น",
                at2AM: "กำลังคำนวณองศาที่แม่นยำเพื่อเปิดประตูห้องน้ำ",
                corporateSurvivalRate: "65% (ชอบไปซ่อมของที่มันยังไม่เสียจนเสีย)",
                emotionalSupportObject: "สายรัดพลาสติก (Zip Tie)"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "CHBC", blurb: "They provide the curious energy, you provide the cardboard boxes. A match made in the garage.", blurbTh: "เขาพกพลังงานความอยากรู้อยากเห็นมา ส่วนคุณมีกล่องกระดาษเตรียมไว้ให้ คู่แท้สายประดิษฐ์ในโรงรถ" },
                worstMatch: { type: "SHNR", blurb: "They want to guard the perimeter. You want to dismantle the perimeter to see how the fence is held together.", blurbTh: "เขาอยากเฝ้าระวังพื้นที่ แต่คุณอยากรื้อรั้วออกมาดูว่าเขายึดน็อตกันยังไง" },
                chaosPair: { type: "CDNC", blurb: "A whirlwind of 'what if we attached this to that?'. The house is now 40% duct tape.", blurbTh: "พายุแห่งคำถาม 'ถ้าเอาอันนี้มาติดอันนั้นล่ะ?' สรุปตอนนี้บ้านกลายเป็นเทปกาวไปแล้ว 40%" },
                emotionalSupport: { type: "SDNC", blurb: "The chill presence that reminds you to stop soldering and eat something for once.", blurbTh: "ความนิ่งที่คอยเตือนสติให้คุณหยุดบัดกรีแล้วไปหาอะไรกินบ้างเถอะ" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHBR", blurb: "The Architect and the Engineer. They have the map, you have the tools. You'll build a civilization by next Tuesday.", blurbTh: "สถาปนิกกับวิศวกร เขามีแผนที่ คุณมีเครื่องมือ วันอังคารหน้าพวกคุณน่าจะสร้างอารยธรรมใหม่เสร็จ" },
                mutualEnablers: { type: "CHBC", blurb: "A house full of half-finished IoT projects and dismantled electronics. Neither of you knows where the remote is.", blurbTh: "บ้านที่เต็มไปด้วยโปรเจกต์ IoT ที่ทำค้างไว้และซากเครื่องใช้ไฟฟ้า ไม่มีใครรู้ว่ารีโมททีวีหายไปไหน" },
                exhaustingDuo: { type: "SHBC", blurb: "Two people trying to fix the same leaky faucet. Now the kitchen is a swimming pool.", blurbTh: "คนสองคนที่พยายามซ่อมก๊อกน้ำรั่วอันเดียวกัน สรุปตอนนี้ห้องครัวกลายเป็นสระว่ายน้ำไปแล้ว" },
                bannedFromDiscord: { type: "CDBC", blurb: "You built a bot that automatically corrects everyone's grammar. It was 'too efficient'.", blurbTh: "สร้างบอทที่คอยแก้ไวยากรณ์ให้ทุกคนโดยอัตโนมัติ ซึ่งมัน 'มีประสิทธิภาพ' จนคนอื่นรำคาญ" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A custom Linux distro with a lot of unfinished scripts.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: Linux เวอร์ชันโมดิฟายเองที่มีสคริปต์ค้างไว้เพียบ"}, {"en": "Social battery: Charged by high-quality soldering iron and fast Wi-Fi.", "th": "โซเชียลแบต: ชาร์จไฟด้วยหัวแร้งบัดกรีคุณภาพดีและ Wi-Fi แรงๆ"}, {"en": "Today you are likely to: Take something apart that wasn't actually broken.", "th": "วันนี้คุณมีแนวโน้มจะ: รื้อของที่มันไม่ได้พังออกมาดูเล่น"}, {"en": "Current mood: 'I can fix this' (spoiler: they might make it weirder).", "th": "อารมณ์ตอนนี้: 'ฉันซ่อมได้นะ' (แต่จริงๆ อาจจะทำให้มันแปลกกว่าเดิม)"}, {"en": "Energy level: High focus, greasy hands.", "th": "ระดับพลังงาน: สมาธิสูงมาก แต่มาพร้อมกับมือที่เลอะคราบน้ำมัน"}, {"en": "Today's vibe: Investigating the internal clock of a microwave.", "th": "ฟีลวันนี้: นั่งศึกษาระบบนาฬิกาภายในของไมโครเวฟ"}, {"en": "Likely activity: Watching 3-hour long teardown videos on YouTube.", "th": "กิจกรรมที่น่าจะทำ: นั่งดูคลิปรื้อเครื่องใช้ไฟฟ้าความยาว 3 ชั่วโมงใน YouTube"}, {"en": "Communication style: Explaining things in diagrams and 'Wait, let me show you'.", "th": "สไตล์การสื่อสาร: อธิบายด้วยแผนผังและคำว่า 'เดี๋ยวนะ เดี๋ยวทำให้ดู'"}, {"en": "Internal monologue: 'If I just bypass this circuit, it will be 20% faster.'", "th": "เสียงในหัว: 'ถ้าฉันข้ามวงจรตรงนี้ไป มันต้องเร็วขึ้น 20% แน่ๆ'"}, {"en": "Stress response: Organizing your toolbox by screw size.", "th": "ปฏิกิริยาต่อความเครียด: ลุกมานั่งแยกขนาดน็อตในกล่องเครื่องมือ"}, {"en": "Survival strategy: WD-40 and a stubborn refusal to read the manual.", "th": "กลยุทธ์การเอาตัวรอด: น้ำมัน WD-40 และการปฏิเสธที่จะอ่านคู่มืออย่างเด็ดขาด"}, {"en": "Today's catchphrase: 'It's not a bug, it's a feature I haven't optimized yet.'", "th": "ประโยคเด็ดวันนี้: 'มันไม่ใช่บั๊กนะ แต่มันคือฟีเจอร์ที่ฉันยังไม่ได้ปรับจูนให้ดี'"}, {"en": "Hidden craving: A project that actually finishes and stays finished.", "th": "ความปรารถนาลึกๆ: โปรเจกต์ที่ทำเสร็จจริงๆ และไม่โดนรื้อออกมาใหม่อีก"}, {"en": "2 AM thought: 'I wonder if I can 3D print a replacement for my social anxiety.'", "th": "ความคิดตอนตี 2: 'เราจะ 3D print ของมาแทนที่ความประหม่าเวลาเข้าสังคมได้มั้ยนะ?'"}, {"en": "Identity hook: The human equivalent of a swiss army knife with a few custom attachments.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันมีดพับสวิสที่ติดตั้งอุปกรณ์เสริมแปลกๆ เพิ่มเข้าไป"}],
dailyObservations: [{"en": "Current status: Testing the limits of your cabinet locks.", "th": "สถานะปัจจุบัน: กำลังทดสอบขีดจำกัดของตัวล็อคตู้คุณ"}, {"en": "Social battery: Available for engineering consultations only.", "th": "โซเชียลแบต: ว่างเฉพาะตอนให้คำปรึกษาด้านวิศวกรรมเท่านั้น"}, {"en": "Likely crime today: Breaking and entering (into the pantry).", "th": "อาชญากรรมที่น่าจะเกิด: บุกรุกพื้นที่หวงห้าม (เข้าไปในตู้กับข้าว)"}, {"en": "Attention demands: Low, but I need you to hold this specific toy.", "th": "ความต้องการความสนใจ: ต่ำ แต่ช่วยถือของเล่นชิ้นนี้ให้หน่อย"}, {"en": "Emotional weather: Cool, focused, and mechanically inclined.", "th": "พยากรณ์อารมณ์: เย็นชา มีสมาธิ และฝักใฝ่ในเชิงกลไก"}, {"en": "3 AM activity: Disassembling the internet router.", "th": "กิจกรรมตอนตี 3: แยกส่วนประกอบเราเตอร์อินเทอร์เน็ต"}, {"en": "Personal space: I'm currently occupying the inside of your printer.", "th": "พื้นที่ส่วนตัว: ตอนนี้ฉันกำลังยึดครองพื้นที่ข้างในเครื่องปริ้นคุณอยู่"}, {"en": "Logic level: Expert. I know how hinges work better than you do.", "th": "ระดับตรรกะ: ระดับผู้เชี่ยวชาญ ฉันรู้การทำงานของบานพับดีกว่าคุณอีก"}, {"en": "Motivation: Understanding the inner workings of the laundry machine.", "th": "แรงจูงใจ: ทำความเข้าใจกลไกภายในของเครื่องซักผ้า"}, {"en": "Preferred seating: Somewhere hard and uncomfortable, for the challenge.", "th": "ที่นั่งโปรด: ที่แข็งๆ และนั่งลำบาก เพื่อความท้าทาย"}, {"en": "Response to 'pspsps': Investigating the acoustic frequency of your voice.", "th": "ปฏิกิริยาต่อ 'ชิชิ': กำลังวิจัยความถี่เสียงของคุณอยู่"}, {"en": "Goal for the day: Solving the puzzle of the 'closed door'.", "th": "เป้าหมายวันนี้: ไขปริศนาเรื่อง 'ประตูที่ปิดอยู่'"}, {"en": "Secret talent: Can open any bag with surgical precision.", "th": "พรสวรรค์ลับ: เปิดถุงอะไรก็ได้ด้วยความแม่นยำระดับศัลยแพทย์"}, {"en": "Communication style: Functional trills and a single, direct meow.", "th": "สไตล์การสื่อสาร: ร้องอ้อนตามหน้าที่ และเมี๊ยวตรงๆ ครั้งเดียวจบ"}, {"en": "Stress level: High when my projects are interrupted by 'pets'.", "th": "ระดับความเครียด: สูงเวลาโปรเจกต์โดนขัดจังหวะด้วยการ 'ลูบหัว'"}, {"en": "Diet: Kibble, and whatever I found behind the fridge.", "th": "โภชนาการ: อาหารเม็ด และอะไรก็ตามที่เจอหลังตู้เย็น"}, {"en": "Floor relationship: A vast map of potential trapdoor opportunities.", "th": "ความสัมพันธ์กับพื้น: แผนที่ขนาดใหญ่ที่เต็มไปด้วยโอกาสในการขุดเจาะ"}, {"en": "Intelligence report: Has already figured out how to use the remote.", "th": "รายงานกรอง: รู้วิธีใช้รีโมททีวีเรียบร้อยแล้ว"}, {"en": "Main character energy: The quiet genius who builds the time machine.", "th": "พลังงานตัวเอก: อัจฉริยะเงียบขรึมผู้สร้างเครื่องย้อนเวลา"}, {"en": "Internal monologue: 'Gravity is just a suggestion. I will test it again with this glass.'", "th": "เสียงในหัว: 'แรงโน้มถ่วงก็แค่คำแนะนำ เดี๋ยวจะทดสอบอีกรอบด้วยแก้วใบนี้แหละ'"}],
compatibility: {
                bestMatch: { type: "CDBC", blurb: "Elegance meets comfort.", blurbTh: "ความหรูหราที่มาพร้อมกับความอบอุ่นใจ" },
                chaosPair: { type: "SHBR", blurb: "A bouncy castle of fun.", blurbTh: "ความสนุกที่เด้งดึ๋งเหมือนบ้านลม" },
                secretTwin: { type: "CHBC", blurb: "Like looking in a fuzzy mirror.", blurbTh: "เหมือนส่องกระจกเงาที่เป็นขนปุยๆ" },
                worstRoommate: { type: "SDNR", blurb: "They watch you while you sleep. Creepy.", blurbTh: "เมทที่ชอบจ้องคุณตอนหลับ... แอบหลอนนะ" }
            },
          },
        {
            code: "SHNR",
            name: "The Gentle Defender",
            tagline: "Soft outside, fiercely loyal inside.",
            emoji: "🛡️",
            color: "#3F8B5C",
            bg: "#D5EBDD",
            vibes: ["Quiet", "Devoted", "Watchful", "One-Person Cat"],
            famouslySays: "I am here. That is enough.",
            kindredSpirits: ["a librarian", "Samwise Gamgee", "the friend who remembers everything"],
            redFlags: "Has trust issues with new visitors.",
            greenFlags: "Unbreakable bond, unspoken understanding.",
            nameTh: "ผู้พิทักษ์อ่อนโยน",
            taglineTh: "นุ่มนอก ซื่อสัตย์เข้มข้นข้างใน",
            vibesTh: ["เงียบ", "ทุ่มเท", "คอยเฝ้า", "แมวของคนคนเดียว"],
            famouslySaysTh: "ฉันอยู่ตรงนี้ แค่นี้พอ",
            kindredSpiritsTh: ["บรรณารักษ์", "Samwise Gamgee", "เพื่อนที่จำทุกเรื่องได้"],
            redFlagsTh: "ไม่ค่อยไว้ใจคนแปลกหน้า",
            greenFlagsTh: "สายสัมพันธ์แน่น เข้าใจกันโดยไม่ต้องพูด",
            description: "The Gentle Defender will not say much, but will absolutely die for you. They are <strong>Solitary</strong> because the love is private, <strong>Hunter</strong> because the household is monitored at all times, <strong>Nurturing</strong> because the love is the entire point, and <strong>Regal</strong> because there is one chosen person and the rest are background. They're not aloof; they've simply already decided who matters and committed entirely.",
            traits: [
                ["How They Show Love ❤️", "Love is delivered through <strong>unconditional presence</strong>. They will sit just outside your line of sight for hours, ready, watching, asking nothing in return."],
                ["How They Ask for Attention 👀", "Quietly. A slow walk into the room. A nose-bump at the ankle. <strong>The smallest gesture, made unmistakable by who it's from.</strong>"],
                ["Territory (The Fiefdom) 🏰", "Territory is <strong>wherever you are</strong>. They map their day around your locations, not the other way around."],
                ["Energy Throughout the Day ⚡", "Low and watchful. <strong>The energy is held in reserve, waiting to be needed.</strong> They move when you move, and rest when you rest."],
                ["Play Style 🧶", "Play is <strong>brief and sincere</strong>. They'll engage with a wand for a few perfect minutes, then return to their post by your side."],
                ["Reaction to Change 📦", "Change is met with <strong>quiet vigilance</strong>. A new visitor is observed from a high spot. A new piece of furniture is approved only after you've sat on it."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>tolerated, not befriended</strong>. The bond is with the chosen human. Other cats can share the household, but not the role."],
            ],
            descriptionTh: "แมวที่พูดน้อยมาก แต่พร้อมตายเพื่อคุณแน่นอน <strong>เก็บตัว</strong> เพราะรักเป็นเรื่องส่วนตัว <strong>นักล่า</strong> เพราะเฝ้าดูบ้านตลอดเวลา <strong>ขี้ห่วง</strong> เพราะรักคือทั้งหมด <strong>เจ้าระเบียบ</strong> เพราะมีคนที่เลือกแล้วหนึ่งคน คนอื่นเป็นพื้นหลัง ไม่ได้เย็นชา แค่ตัดสินใจไปแล้วว่าใครสำคัญและทุ่มทั้งใจ",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักด้วยการอยู่ตรงนั้นอย่างไม่มีเงื่อนไข</strong> นั่งนอกสายตาเล็กน้อยเป็นชั่วโมงๆ พร้อม เฝ้า ไม่ขออะไรกลับ"],
                ["👀 การเรียกร้องความสนใจ", "<strong>เงียบๆ</strong> เดินช้าๆ เข้ามาในห้อง เอาจมูกชนข้อเท้า ท่าเล็กที่สุด แต่ชัดเจนเพราะรู้ว่าใครเป็นคนทำ"],
                ["🏰 อาณาเขต", "<strong>อยู่ตรงไหนก็ตามที่คุณอยู่</strong> วางแผนวันรอบตำแหน่งคุณ ไม่ใช่ตรงข้าม"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>ต่ำและคอยจับตา</strong> เก็บพลังไว้รอใช้ ขยับเมื่อคุณขยับ พักเมื่อคุณพัก"],
                ["🧶 สไตล์การเล่น", "<strong>สั้นและจริงใจ</strong> เล่นไม้ตกแมวสองสามนาทีให้สมบูรณ์แบบ แล้วกลับมาประจำตำแหน่งข้างคุณ"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>เฝ้าระวังเงียบๆ</strong> แขกใหม่ถูกสังเกตจากที่สูง เฟอร์นิเจอร์ใหม่จะอนุมัติก็ต่อเมื่อคุณนั่งบนนั้นแล้ว"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>ทนได้ แต่ไม่เป็นเพื่อน</strong> สายสัมพันธ์อยู่ที่คนของเขาคนเดียว ตัวอื่นแชร์บ้านได้แต่แชร์บทบาทไม่ได้"],
            ],
        
            duringEvents: {
          "guests": "Guards you from 3 feet away.",
          "thunderstorm": "Hides behind you.",
          "dinner": "Waits patiently for you to finish."
},
            duringEventsTh: {
          "guests": "คุ้มกันคุณจากระยะ 3 ฟุต",
          "thunderstorm": "ซ่อนอยู่หลังคุณ",
          "dinner": "รออย่างอดทนให้คุณกินเสร็จ"
},
                        behavioralHooks: {
                mostLikelyTo: ["Die for you.", "Remember exactly where you put the treats.", "Never leave your side when you're sick."],
                textsLike: ["I'm here.", "Are you okay?", "<3"],
                secretWeakness: "Sudden loud noises. He will hide behind you.",
                whenStressed: "Follows you from room to room like a tiny, fuzzy shadow.",
                at2AM: "Sleeping on your feet to keep them warm (and safe).",
                corporateSurvivalRate: "80% (The loyal employee who never complains but is overworked.)",
                emotionalSupportObject: "A blanket that smells like you."
            ,
                mostLikelyToHuman: ["Listen to true crime podcasts to fall asleep.", "Remember what you wore on your first meeting 4 years ago.", "Secretly run a successful fan-fiction account."],
                emotionalSupportObjectHuman: "Noise-canceling headphones."},
            behavioralHooksTh: {
                mostLikelyTo: ["ยอมตายแทนคุณ", "จำได้เป๊ะว่าคุณซ่อนขนมไว้ไหน", "ไม่ยอมห่างคุณเลยตอนคุณป่วย"],
                textsLike: ["อยู่ตรงนี้จ้า", "เป็นอะไรหรือเปล่า?", "รักนะ"],
                secretWeakness: "เสียงดังปุ้งปั้ง จะรีบวิ่งมาหลบหลังคุณทันที",
                whenStressed: "เดินตามคุณไปทุกห้องเหมือนเงาขนปุยเล็กๆ",
                at2AM: "นอนทับเท้าคุณเพื่อให้เท้าอุ่น (และปลอดภัย)",
                corporateSurvivalRate: "80% (พนักงานผู้ซื่อสัตย์ที่ไม่เคยบ่นแต่โดนใช้งานหนักสุดๆ)",
                emotionalSupportObject: "ผ้าห่มที่มีกลิ่นของคุณ"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "CHNR", blurb: "A fortress of routine and loyalty. You check the door, they check the hallway. Peace of mind achieved.", blurbTh: "ป้อมปราการแห่งกิจวัตรและความภักดี คุณเช็กประตู เขาเช็กทางเดิน ความสบายใจที่แท้จริง" },
                worstMatch: { type: "CHBC", blurb: "They see a shelf. You see a perimeter. They want to jump off it. You want to guard it. Stress levels: 100.", blurbTh: "เขาเห็นชั้นวางของเป็นที่กระโดด แต่คุณเห็นเป็นพื้นที่ต้องเฝ้าระวัง ระดับความเครียด: พุ่งทะลุร้อย" },
                chaosPair: { type: "CHNC", blurb: "They live for the thrill of the unknown. You live to prevent the unknown from happening. It's an exhausting dance.", blurbTh: "เขาอยู่เพื่อความตื่นเต้นจากสิ่งที่ไม่รู้ แต่คุณอยู่เพื่อป้องกันไม่ให้สิ่งที่ไม่รู้เกิดขึ้น เป็นการร่ายรำที่เหนื่อยหอบ" },
                emotionalSupport: { type: "SDNR", blurb: "Two quiet souls just existing in the same space. No words needed, just shared safety.", blurbTh: "จิตวิญญาณที่เงียบสงบสองดวงที่แค่มาอยู่ด้วยกันในพื้นที่เดิม ไม่ต้องมีคำพูด แค่รู้สึกปลอดภัยไปพร้อมกัน" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHBR", blurb: "The Strategist and the Shield. They give the orders, you make sure the home front stays secure. Unbeatable stability.", blurbTh: "นักวางแผนกับโล่กำบัง เขาออกคำสั่ง คุณดูแลหน้าบ้านให้มั่นคง ความเสถียรที่ไม่มีใครล้มได้" },
                mutualEnablers: { type: "SHNR", blurb: "You'll spend the evening double-checking each other's security settings and worrying about the neighborhood cat.", blurbTh: "ใช้เวลาทั้งคืนผลัดกันเช็กการตั้งค่าความปลอดภัยและกังวลเรื่องแมวจรจัดในซอย" },
                exhaustingDuo: { type: "CHNR", blurb: "Too much hovering. You're both trying to protect the other from minor inconveniences until you're both trapped.", blurbTh: "ประคบประหงมกันเกินไป ต่างคนต่างพยายามปกป้องกันจากความลำบากเล็กน้อยจนสุดท้ายทำอะไรไม่ได้เลยทั้งคู่" },
                bannedFromDiscord: { type: "CDBC", blurb: "You reported every single minor rule violation until the mods muted you for 'excessive vigilance'.", blurbTh: "รายงานทุกการทำผิดกฎเล็กๆ น้อยๆ จนแอดมินต้องสั่งปิดไมค์ในข้อหา 'เฝ้าระวังเกินความจำเป็น'" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A reliable firewall with very strict access control.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: ไฟร์วอลล์ที่ไว้ใจได้พร้อมระบบควบคุมการเข้าถึงที่เข้มงวดมาก"}, {"en": "Social battery: Low, but dedicated entirely to your inner circle.", "th": "โซเชียลแบต: ต่ำ แต่ทุ่มเทให้เฉพาะคนในวงในเท่านั้น"}, {"en": "Today you are likely to: Double-check if the stove is off... again.", "th": "วันนี้คุณมีแนวโน้มจะ: ไปเช็กว่าปิดเตาแก๊สหรือยัง... อีกรอบ"}, {"en": "Current mood: A lighthouse in a storm—steady, watchful, and a bit lonely.", "th": "อารมณ์ตอนนี้: ประภาคารท่ามกลางพายุ—มั่นคง เฝ้าดู และแอบเหงาหน่อยๆ"}, {"en": "Energy level: Steady, reliable, and low-key anxious.", "th": "ระดับพลังงาน: มั่นคง พึ่งพาได้ และแอบกังวลลึกๆ"}, {"en": "Today's vibe: 'Safety first, second, and third.'", "th": "ฟีลวันนี้: 'ความปลอดภัยต้องมาก่อน เป็นอันดับสอง และอันดับสาม'"}, {"en": "Likely activity: Looking out the window at a suspicious-looking cloud.", "th": "กิจกรรมที่น่าจะทำ: ยืนมองหน้าต่าง ดูเมฆก้อนที่ดู 'น่าสงสัย'"}, {"en": "Communication style: Short, functional, and mostly warnings.", "th": "สไตล์การสื่อสาร: สั้น เน้นใช้งาน และส่วนใหญ่เป็นคำเตือน"}, {"en": "Internal monologue: 'If I stay alert, nothing bad can happen. Right?'", "th": "เสียงในหัว: 'ถ้าฉันยังตื่นตัวอยู่ เรื่องร้ายๆ ก็จะไม่เกิดขึ้น... ใช่มั้ย?'"}, {"en": "Stress response: Organizing the emergency kit for the fifth time this month.", "th": "ปฏิกิริยาต่อความเครียด: จัดชุดปฐมพยาบาลฉุกเฉินเป็นครั้งที่ห้าของเดือน"}, {"en": "Survival strategy: A weighted blanket and a very predictable routine.", "th": "กลยุทธ์การเอาตัวรอด: ผ้าห่มถ่วงน้ำหนักและกิจวัตรประจำวันที่คาดเดาได้เป๊ะๆ"}, {"en": "Today's catchphrase: 'Better safe than sorry, and I'm never sorry.'", "th": "ประโยคเด็ดวันนี้: 'ปลอดภัยไว้ก่อนดีกว่าแก้ และฉันจะไม่ยอมให้มันพังแน่นอน'"}, {"en": "Hidden craving: A day where you don't feel responsible for everyone's safety.", "th": "ความปรารถนาลึกๆ: วันที่รู้สึกว่าไม่ต้องแบกความรับผิดชอบเรื่องความปลอดภัยของทุกคนไว้บนบ่า"}, {"en": "2 AM thought: 'Did I lock the back door? I should check the back door.'", "th": "ความคิดตอนตี 2: 'ล็อคประตูหลังบ้านหรือยังนะ? เดี๋ยวไปดูอีกทีดีกว่า'"}, {"en": "Identity hook: The human equivalent of a high-quality home security system.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันระบบรักษาความปลอดภัยบ้านเกรดพรีเมียม"}],
dailyObservations: [{"en": "Current status: Guarding your left foot with my life.", "th": "สถานะปัจจุบัน: กำลังปกป้องเท้าซ้ายของคุณด้วยชีวิต"}, {"en": "Social battery: Only for my chosen human and no one else.", "th": "โซเชียลแบต: สำหรับมนุษย์ที่เลือกแล้วเท่านั้น คนอื่นห้ามเข้า"}, {"en": "Likely crime today: Vigilantism (attacking your shadow for safety).", "th": "อาชญากรรมที่น่าจะเกิด: ตั้งตนเป็นศาลเตี้ย (โจมตีเงาคุณเพื่อความปลอดภัย)"}, {"en": "Attention demands: Subtle, constant, and unspoken.", "th": "ความต้องการความสนใจ: เรียบง่าย สม่ำเสมอ และไม่ต้องใช้คำพูด"}, {"en": "Emotional weather: Steady, loyal, and deeply committed.", "th": "พยากรณ์อารมณ์: มั่นคง ซื่อสัตย์ และทุ่มเทสุดใจ"}, {"en": "3 AM activity: Sitting on your chest to protect you from bad dreams.", "th": "กิจกรรมตอนตี 3: นั่งทับอกคุณเพื่อปกป้องคุณจากฝันร้าย"}, {"en": "Personal space: As long as I can feel your warmth, we're good.", "th": "พื้นที่ส่วนตัว: ตราบใดที่ยังรู้สึกถึงไออุ่นของคุณ เราก็โอเค"}, {"en": "Logic level: Protection is the only priority.", "th": "ระดับตรรกะ: การปกป้องคือสิ่งสำคัญที่สุดอย่างเดียว"}, {"en": "Motivation: Your continued safety and the structural integrity of the bed.", "th": "แรงจูงใจ: ความปลอดภัยของคุณและความมั่นคงของเตียงนอน"}, {"en": "Preferred seating: Tucked into your armpit or behind your knees.", "th": "ที่นั่งโปรด: ซุกอยู่ใต้รักแร้ หรือไม่ก็หลังเข่าคุณ"}, {"en": "Response to 'pspsps': A soft nose-bump and immediate attendance.", "th": "ปฏิกิริยาต่อ 'ชิชิ': เอาจมูกแตะเบาๆ และพร้อมรับคำสั่งทันที"}, {"en": "Goal for the day: Zero intruders (including the mailman).", "th": "เป้าหมายวันนี้: ผู้บุกรุกต้องเป็นศูนย์ (รวมถึงบุรุษไปรษณีย์ด้วย)"}, {"en": "Secret talent: Can hear a snack bag opening from 2 miles away.", "th": "พรสวรรค์ลับ: ได้ยินเสียงแกะถุงขนมจากระยะ 2 ไมล์"}, {"en": "Communication style: Gentle trills and meaningful eye contact.", "th": "สไตล์การสื่อสาร: ร้องอ้อนเบาๆ และการสบตาที่มีความหมาย"}, {"en": "Stress level: Elevated if you're not in the same room.", "th": "ระดับความเครียด: สูงขึ้นถ้าคุณไม่อยู่ในห้องเดียวกัน"}, {"en": "Diet: Pure tuna and constant validation.", "th": "โภชนาการ: ทูน่าเน้นๆ และความมั่นใจสม่ำเสมอ"}, {"en": "Floor relationship: A surface to wait for you on.", "th": "ความสัมพันธ์กับพื้น: พื้นที่สำหรับนั่งรอคุณ"}, {"en": "Intelligence report: Has identified every exit and entry point in the house.", "th": "รายงานกรอง: ระบุทางเข้าออกทุกจุดในบ้านได้ครบหมดแล้ว"}, {"en": "Main character energy: The loyal protector who stays through the end credits.", "th": "พลังงานตัวเอก: ผู้ปกป้องที่ซื่อสัตย์ผู้อยู่เคียงข้างจนจบเรื่อง"}, {"en": "Internal monologue: 'I will watch over them while they do the weird light-box thing.'", "th": "เสียงในหัว: 'ฉันจะเฝ้าดูเขาเอง ระหว่างที่เขาทำอะไรแปลกๆ กับกล่องไฟนั่น'"}],
compatibility: {
                bestMatch: { type: "CHNR", blurb: "A journey of a thousand miles starts with one meow.", blurbTh: "การเดินทางหมื่นลี้ เริ่มต้นที่หนึ่งเหมียว" },
                chaosPair: { type: "SDNC", blurb: "Spontaneous adventures everyday.", blurbTh: "ผจญภัยแบบปุ๊บปั๊บทัวร์ได้ทุกวัน" },
                secretTwin: { type: "CDNR", blurb: "Connected by an invisible string.", blurbTh: "เชื่อมโยงกันด้วยด้ายแดงแห่งแมว" },
                worstRoommate: { type: "CDBC", blurb: "Messy eaters unite... or not.", blurbTh: "กินเลอะเทอะทั้งคู่ แต่ดันมาบ่นกันเอง" }
            },
          },
        {
            code: "SHNC",
            name: "The Emotional Artist",
            tagline: "Their medium is yowling at 3am.",
            emoji: "🎨",
            color: "#9B59B6",
            bg: "#EAD6F2",
            vibes: ["Sensitive", "Independent", "Mood-Driven", "Hairball Poet"],
            famouslySays: "(stares meaningfully)",
            kindredSpirits: ["a film school grad", "any sad indie singer", "your friend with a journal"],
            redFlags: "Cries when you close a door.",
            greenFlags: "Big feelings, big love.",
            nameTh: "ศิลปินอารมณ์",
            taglineTh: "ผลงานชิ้นเอกคือเสียงร้องตอนตีสาม",
            vibesTh: ["อ่อนไหว", "อิสระ", "ตามอารมณ์", "กวีก้อนขน"],
            famouslySaysTh: "(จ้องอย่างมีนัย)",
            kindredSpiritsTh: ["บัณฑิตโรงเรียนหนัง", "นักร้องอินดี้สายเศร้า", "เพื่อนที่มีสมุดบันทึก"],
            redFlagsTh: "ร้องไห้ทุกครั้งที่เราปิดประตู",
            greenFlagsTh: "ความรู้สึกใหญ่ ความรักก็ใหญ่",
            description: "The Emotional Artist feels everything, deeply, including the door being closed when they thought it was open. They are <strong>Solitary</strong> because the inner world is large, <strong>Hunter</strong> because every small change in the environment is registered, <strong>Nurturing</strong> because they want to be loved (please), and <strong>Casual</strong> because schedules are emotional weather, not laws. They're not high-maintenance; they're high-resolution.",
            traits: [
                ["How They Show Love ❤️", "Love is delivered as <strong>emotional offering</strong>. A long, soulful look. A tail wrapped around your leg. A single yowl from the next room that means 'I need to know you're here'."],
                ["How They Ask for Attention 👀", "Through <strong>dramatic vocalization</strong>. A meow that sounds like a question. A second meow that sounds like a deeper question. The dialogue is the point."],
                ["Territory (The Fiefdom) 🏰", "Territory is <strong>the place that feels right today</strong>. It might be the closet, the bathtub, or the laundry pile. The choice is mood-driven, never random."],
                ["Energy Throughout the Day ⚡", "Mood-driven and unpredictable. <strong>Some days are zoomies, some days are thousand-yard stares.</strong> Both are valid art."],
                ["Play Style 🧶", "Play is <strong>expressive</strong>. They prefer toys that respond emotionally — feathers that move just so, balls that roll just enough. Mechanical toys feel cold."],
                ["Reaction to Change 📦", "Change is <strong>processed slowly and visibly</strong>. A new piece of furniture may be ignored for three days, then suddenly become the new favorite spot."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>fellow artists</strong>. They prefer parallel play — same room, separate activities — to anything that feels like collaboration."],
            ],
            descriptionTh: "แมวที่รู้สึกทุกอย่างลึกมาก รวมถึงประตูปิดที่คิดว่าเปิดอยู่ <strong>เก็บตัว</strong> เพราะโลกในใจกว้าง <strong>นักล่า</strong> เพราะการเปลี่ยนแปลงเล็กๆ ในห้องถูกบันทึกหมด <strong>ขี้ห่วง</strong> เพราะอยากให้รัก ขอนะ <strong>ฟรีสไตล์</strong> เพราะตารางเป็นสภาพอากาศของอารมณ์ ไม่ใช่กฎหมาย ไม่ได้เลี้ยงยาก แค่ละเอียดสูง",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักเป็นการมอบทางอารมณ์</strong> สบตาลึกยาว หางพันขา หรือเสียงร้องครั้งเดียวจากห้องข้างๆ ที่แปลว่าขอรู้ว่าคุณยังอยู่"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ใช้เสียงดราม่า</strong> เสียงร้องเหมือนคำถาม เสียงที่สองเหมือนคำถามที่ลึกกว่า การสนทนาคือเป้าหมาย"],
                ["🏰 อาณาเขต", "<strong>ที่ที่รู้สึกใช่ในวันนั้น</strong> อาจเป็นตู้เสื้อผ้า อ่างอาบน้ำ หรือกองผ้า เลือกตามอารมณ์ ไม่เคยสุ่ม"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>ขับด้วยอารมณ์ คาดเดายาก</strong> บางวันวิ่งบ้า บางวันจ้องไกลพันหลา ทั้งสองคือศิลปะที่ใช้ได้"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นอย่างมีอารมณ์</strong> ชอบของเล่นที่ตอบสนองทางอารมณ์ ขนนกที่ขยับพอดี บอลที่กลิ้งพอดี ของกลไกรู้สึกเย็นเกินไป"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>ประมวลผลช้าและเห็นได้ชัด</strong> เฟอร์นิเจอร์ใหม่อาจถูกเมินสามวัน แล้วอยู่ดีๆ กลายเป็นที่โปรดใหม่"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>ตัวอื่นคือศิลปินด้วยกัน</strong> ชอบเล่นแบบขนาน ห้องเดียวกันแต่กิจกรรมแยก ไม่ค่อยชอบสิ่งที่ดูเหมือนต้องร่วมมือ"],
            ],
        
            duringEvents: {
          "dinner": "Looks at the food. Sighs.",
          "thunderstorm": "Writes a sad poem about the rain.",
          "guests": "Looks out the window dramatically."
},
            duringEventsTh: {
          "dinner": "มองอาหารแล้วถอนหายใจ",
          "thunderstorm": "แต่งกลอนเศร้าเกี่ยวกับสายฝน",
          "guests": "มองออกนอกหน้าต่างแบบดราม่า"
},
                        behavioralHooks: {
                mostLikelyTo: ["Cry because you moved slightly.", "Stare at the rain and contemplate existence.", "Refuse to eat out of existential dread."],
                textsLike: ["The light is so beautiful today. I am crying.", "Do you ever feel like the red dot is an allegory for our dreams?", "I need space. But stay close."],
                secretWeakness: "Mirror. He gets confused by his own beauty/tragedy.",
                whenStressed: "Sits in a dark corner and looks like a Victorian orphan.",
                at2AM: "Singing the song of his people to the moon.",
                corporateSurvivalRate: "20% (Too sensitive for the quarterly review.)",
                emotionalSupportObject: "A single piece of yarn."
            ,
                mostLikelyToHuman: ["Ghost you for 3 months then send a 'hey' like nothing happened.", "Own 14 black t-shirts that all look identical.", "Become a regular at a cafe specifically so they don't have to talk to the staff."],
                emotionalSupportObjectHuman: "A Kindle with 400 unread books."},
            behavioralHooksTh: {
                mostLikelyTo: ["ร้องไห้เพราะคุณขยับตัวนิดเดียว", "จ้องฝนตกแล้วครุ่นคิดถึงการมีอยู่", "ไม่ยอมกินข้าวเพราะกังวลเรื่องชีวิต"],
                textsLike: ["แสงวันนี้สวยจัง น้ำตาจะไหล", "น้อนเคยคิดมั้ยว่าจุดแดงจริงๆ แล้วคือภาพสะท้อนของความฝันที่เอื้อมไม่ถึง?", "อยากอยู่ตัวเดียว แต่ช่วยอยู่ใกล้ๆ หน่อยนะ"],
                secretWeakness: "กระจกเงา เห็นตัวเองแล้วสับสนว่านี่คือเทพบุตรหรือแมวที่เศร้าที่สุดในโลก",
                whenStressed: "ไปนั่งในมุมมืดแล้วทำตัวเหมือนเด็กกำพร้าในนิยายยุควิกตอเรีย",
                at2AM: "ขับขานบทเพลงแห่งพงศ์พันธุ์แมวใส่พระจันทร์",
                corporateSurvivalRate: "20% (อ่อนไหวเกินไปสำหรับการประเมินผลงานรายไตรมาส)",
                emotionalSupportObject: "ไหมพรมเส้นเดียว"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "CDNC", blurb: "You paint, they pose. A symbiotic relationship built on aesthetic appreciation.", blurbTh: "คุณวาดภาพ เขาโพสท่า ความสัมพันธ์แบบพึ่งพาอาศัยที่สร้างขึ้นจากความซาบซึ้งในสุนทรียภาพ" },
                worstMatch: { type: "CHBR", blurb: "They want to discuss the budget. You want to discuss the mood of the color blue. You will never understand each other.", blurbTh: "เขาอยากคุยเรื่องงบประมาณ แต่คุณอยากคุยเรื่องมู้ดของสีน้ำเงิน ชาตินี้ไม่มีวันเข้าใจกัน" },
                chaosPair: { type: "CHBC", blurb: "An experimental art installation. You provide the soul, they provide the flickering lights and exposed wires.", blurbTh: "งานศิลปะจัดวางแนวทดลอง คุณใส่จิตวิญญาณลงไป ส่วนเขาเอาสายไฟกับไฟกระพริบมาติดให้" },
                emotionalSupport: { type: "SDNC", blurb: "Pure, unadulterated chill. They help you stay in the flow without interrupting the vibe.", blurbTh: "ความชิลล์ที่แท้ทรู ช่วยให้คุณอยู่ใน Flow ได้โดยไม่ทำลายบรรยากาศ" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "CHNC", blurb: "The Creative Powerhouse. You're the heart, they're the spark. Together, you're a masterpiece in progress.", blurbTh: "ขุมพลังแห่งความคิดสร้างสรรค์ คุณคือหัวใจ เขาคือประกายไฟ อยู่ด้วยกันเหมือนงานศิลปะที่กำลังสร้างสรรค์" },
                mutualEnablers: { type: "SHNC", blurb: "You'll spend all day discussing your feelings and 'creative blocks' instead of actually creating anything.", blurbTh: "ใช้เวลาทั้งวันคุยเรื่องความรู้สึกและ 'อาการหัวตื้อ' แทนที่จะลงมือทำอะไรจริงๆ สักอย่าง" },
                exhaustingDuo: { type: "SHNC", blurb: "Two moody artists in one small studio. The passive-aggression is an art form in itself.", blurbTh: "ศิลปินเจ้าอารมณ์สองคนในสตูดิโอเล็กๆ ความตึงเครียดที่เกิดขึ้นนับเป็นงานศิลปะอย่างหนึ่งเลยทีเดียว" },
                bannedFromDiscord: { type: "CHBC", blurb: "You turned the general chat into an avant-garde performance art piece. The admins didn't appreciate the 'depth'.", blurbTh: "เปลี่ยนห้องแชททั่วไปให้กลายเป็นงานแสดงศิลปะแนวอาวองการ์ด ซึ่งแอดมินเข้าไม่ถึง 'ความล้ำ' นั้น" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A dreamlike sequence with a lo-fi soundtrack and soft lighting.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: ฉากในความฝันที่มาพร้อมเพลง lo-fi และแสงนุ่มๆ"}, {"en": "Social battery: Fluctuates based on the lighting and the 'vibe' of the room.", "th": "โซเชียลแบต: ขึ้นอยู่กับแสงไฟและ 'ฟีล' ของห้องนั้นๆ"}, {"en": "Today you are likely to: Stare at a wall for an hour because the texture is 'interesting'.", "th": "วันนี้คุณมีแนวโน้มจะ: จ้องกำแพงเป็นชั่วโมงเพราะรู้สึกว่าพื้นผิวมัน 'น่าสนใจ'"}, {"en": "Current mood: A blurry polaroid of a sunset—nostalgic and hard to define.", "th": "อารมณ์ตอนนี้: รูปโพลารอยด์เบลอๆ ของพระอาทิตย์ตก—โหยหาอดีตและนิยามยาก"}, {"en": "Energy level: Low, but emotionally resonant.", "th": "ระดับพลังงาน: ต่ำ แต่เปี่ยมไปด้วยอารมณ์ความรู้สึก"}, {"en": "Today's vibe: Finding beauty in a discarded coffee cup.", "th": "ฟีลวันนี้: การค้นพบความงามในแก้วกาแฟที่ถูกทิ้งไว้"}, {"en": "Likely activity: Making a playlist for a mood you haven't even felt yet.", "th": "กิจกรรมที่น่าจะทำ: จัดเพลย์ลิสต์ให้อารมณ์ที่คุณยังไม่เคยสัมผัสมาก่อนด้วยซ้ำ"}, {"en": "Communication style: Mostly metaphors and meaningful sighs.", "th": "สไตล์การสื่อสาร: เน้นการเปรียบเปรยและการถอนหายใจแบบมีความหมาย"}, {"en": "Internal monologue: 'Everything is a metaphor, but what is the metaphor for the metaphor?'", "th": "เสียงในหัว: 'ทุกอย่างคือการเปรียบเทียบ แล้วการเปรียบเทียบของการเปรียบเทียบคืออะไรล่ะ?'"}, {"en": "Stress response: Buying $200 worth of art supplies you'll use once.", "th": "ปฏิกิริยาต่อความเครียด: ซื้ออุปกรณ์ศิลปะราคาแพงหูฉี่มาใช้แค่ครั้งเดียว"}, {"en": "Survival strategy: Daydreaming and a very specific scented candle.", "th": "กลยุทธ์การเอาตัวรอด: การฝันกลางวันและเทียนหอมกลิ่นเฉพาะตัว"}, {"en": "Today's catchphrase: 'It's about the *feeling*, not the function.'", "th": "ประโยคเด็ดวันนี้: 'มันคือเรื่องของ *ความรู้สึก* ไม่ใช่เรื่องการใช้งาน'"}, {"en": "Hidden craving: For someone to understand your silence without asking why.", "th": "ความปรารถนาลึกๆ: อยากให้ใครสักคนเข้าใจความเงียบของเราโดยไม่ต้องถามว่าทำไม"}, {"en": "2 AM thought: 'What if colors have a different flavor for everyone?'", "th": "ความคิดตอนตี 2: 'ถ้าสีแต่ละสีมีรสชาติที่ต่างกันไปสำหรับทุกคนล่ะ?'"}, {"en": "Identity hook: The human equivalent of a beautifully shot indie film with no plot.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันหนังอินดี้ที่ถ่ายภาพสวยมากแต่ไม่มีพล็อตเรื่อง"}],
dailyObservations: [{"en": "Current status: Feeling a lot of things, mostly about the void.", "th": "สถานะปัจจุบัน: รู้สึกถึงหลายสิ่งหลายอย่าง โดยเฉพาะความว่างเปล่า"}, {"en": "Social battery: Low energy, high emotion. I'm sensitive, okay?", "th": "โซเชียลแบต: พลังงานต่ำ แต่อารมณ์สูง ฉันมันคนอ่อนไหว เข้าใจป่ะ?"}, {"en": "Likely crime today: Public crying and excessive kneading of blankets.", "th": "อาชญากรรมที่น่าจะเกิด: ร้องไห้ในที่สาธารณะและนวดผ้าห่มมากเกินจำเป็น"}, {"en": "Attention demands: Subtle. Please notice me without looking at me.", "th": "ความต้องการความสนใจ: เรียบง่าย ช่วยสนใจฉันโดยไม่ต้องมองมาที่ฉันที"}, {"en": "Emotional weather: Melancholic with a chance of sudden purring.", "th": "พยากรณ์อารมณ์: เศร้าสร้อย มีโอกาสครางครืดๆ กะทันหัน"}, {"en": "3 AM activity: Staring at the moon and sighing deeply.", "th": "กิจกรรมตอนตี 3: จ้องมองพระจันทร์และถอนหายใจยาว"}, {"en": "Personal space: I need a 10-foot radius but also a hug.", "th": "พื้นที่ส่วนตัว: ต้องการรัศมี 10 ฟุต แต่ก็อยากได้อ้อมกอดด้วย"}, {"en": "Logic level: My feelings are my logic.", "th": "ระดับตรรกะ: ความรู้สึกของฉันคือตรรกะของฉัน"}, {"en": "Motivation: Finding the perfect poem in a hairball.", "th": "แรงจูงใจ: การค้นพบบทกวีที่สมบูรณ์แบบในก้อนขน"}, {"en": "Preferred seating: Inside a pile of clean, warm laundry.", "th": "ที่นั่งโปรด: ในกองผ้าที่เพิ่งซักเสร็จและยังอุ่นๆ อยู่"}, {"en": "Response to 'pspsps': It's too loud for my soul right now.", "th": "ปฏิกิริยาต่อ 'ชิชิ': เสียงมันดังไปสำหรับจิตวิญญาณฉันตอนนี้"}, {"en": "Goal for the day: Expressing my internal struggle through interpretive stretching.", "th": "เป้าหมายวันนี้: แสดงออกถึงความขัดแย้งในใจผ่านท่าบิดขี้เกียจแบบร่วมสมัย"}, {"en": "Secret talent: Can make you feel guilty with a single glance.", "th": "พรสวรรค์ลับ: ทำให้คุณรู้สึกผิดได้ด้วยการปรายตาเพียงครั้งเดียว"}, {"en": "Communication style: Tragic meows and meaningful tail twitches.", "th": "สไตล์การสื่อสาร: เมี๊ยวแบบเศร้าสร้อย และการขยับหางที่มีนัยยะ"}, {"en": "Stress level: High. The vibes are just wrong today.", "th": "ระดับความเครียด: สูง มวลบรรยากาศวันนี้มันไม่ใช่เลยอ่ะ"}, {"en": "Diet: Only the softest foods for a soft soul.", "th": "โภชนาการ: อาหารที่นุ่มที่สุดเท่านั้นสำหรับจิตวิญญาณอันแสนอ่อนโยน"}, {"en": "Floor relationship: A cold and unfeeling surface for my tragedy.", "th": "ความสัมพันธ์กับพื้น: พื้นผิวที่เย็นชาและไร้ความรู้สึกสำหรับโศกนาฏกรรมของฉัน"}, {"en": "Intelligence report: Understands the deeper meaning of 'no'.", "th": "รายงานกรอง: เข้าใจความหมายที่ลึกซึ้งของคำว่า 'ไม่'"}, {"en": "Main character energy: The misunderstood artist in an indie drama.", "th": "พลังงานตัวเอก: ศิลปินที่ถูกเข้าใจผิดในหนังดราม่าอินดี้"}, {"en": "Internal monologue: 'Is the red dot searching for me as I search for it?'", "th": "เสียงในหัว: 'จุดแดงกำลังตามหาฉัน เหมือนที่ฉันตามหามันอยู่หรือเปล่านะ?'"}],
compatibility: {
                bestMatch: { type: "CDNC", blurb: "Curiosity met its match.", blurbTh: "ความอยากรู้อยากเห็นมาเจอกับคู่ปรับที่สมน้ำสมเนื้อ" },
                chaosPair: { type: "SHNR", blurb: "Lost in a box together.", blurbTh: "หลงทางในกล่องกระดาษใบเดียวกัน" },
                secretTwin: { type: "SDNR", blurb: "Two peas in a cat pod.", blurbTh: "เหมือนเมล็ดถั่วในฝัก... เอ่อ ในถุงแมว" },
                worstRoommate: { type: "CHBR", blurb: "They wake you up for breakfast at 4 AM.", blurbTh: "เมทที่มาปลุกกินข้าวเช้าตอนตีสี่" }
            },
          },
        {
            code: "SDBR",
            name: "The Observant Theorist",
            tagline: "Watches the red dot. Wonders why.",
            emoji: "🔭",
            color: "#1F6FA8",
            bg: "#D0E3F0",
            vibes: ["Pensive", "Quiet", "Window-Watcher", "Galaxy-Brained"],
            famouslySays: "What is the laser, really?",
            kindredSpirits: ["a philosophy major", "Lisa Simpson", "your friend who reads on the train"],
            redFlags: "Stares at walls for 4 hours.",
            greenFlags: "Will quietly figure you out.",
            nameTh: "นักทฤษฎีสายสังเกต",
            taglineTh: "มองจุดแดง สงสัยว่ามันคืออะไรกันแน่",
            vibesTh: ["ครุ่นคิด", "เงียบ", "เฝ้าหน้าต่าง", "สมองกาแล็กซี่"],
            famouslySaysTh: "เลเซอร์มันคืออะไรกันแน่นะ",
            kindredSpiritsTh: ["เด็กเอกปรัชญา", "Lisa Simpson", "เพื่อนที่อ่านหนังสือบนรถไฟฟ้า"],
            redFlagsTh: "จ้องผนัง 4 ชั่วโมงรวด",
            greenFlagsTh: "เงียบๆ แต่อ่านเราออกหมด",
            description: "The Observant Theorist would rather understand the room than enter it. They are <strong>Solitary</strong> because the inner life is more interesting than the outer one, <strong>Dreamer</strong> because they extract patterns where most cats see only motion, <strong>Bossy</strong> because once they've decided how things should work that's the rule, and <strong>Regal</strong> because their schedule is non-negotiable. They're the cat who is always thinking, even when they appear to be staring at a wall for forty minutes.",
            traits: [
                ["How They Show Love ❤️", "Love is <strong>proximity without intrusion</strong>. They'll occupy the same room as you for hours, sit two feet away, and refuse to be pet — but the moment you leave, they follow."],
                ["How They Ask for Attention 👀", "Attention is requested through <strong>prolonged stillness</strong>. They sit nearby and wait. The wait is the request. You will eventually feel it."],
                ["Territory (The Fiefdom) 🏰", "Territory is a <strong>sequence of observation posts</strong>. The corner of the bookshelf, the windowsill at 3pm, the top of the cat tree at dusk. Each post is occupied on a strict rotation."],
                ["Energy Throughout the Day ⚡", "Low and metered. <strong>Energy is too valuable to waste on impulse.</strong> They'll watch a moth for ten minutes before deciding it isn't worth the trip."],
                ["Play Style 🧶", "Cerebral. <strong>Puzzle feeders are preferred over feathers.</strong> They want a problem with a solution, not a chase with a finish line."],
                ["Reaction to Change 📦", "Cautious and methodical. A new object will be <strong>circumnavigated, sniffed, observed from a high point, and only then approved</strong> for general use."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>objects of study</strong>. They watch new arrivals from a safe distance, take notes, and integrate them into the social map without ever needing to speak."],
            ],
            descriptionTh: "แมวที่อยากเข้าใจห้องมากกว่าจะเดินเข้าไป <strong>เก็บตัว</strong> เพราะชีวิตในใจน่าสนใจกว่าข้างนอก <strong>นักฝัน</strong> เพราะดึงรูปแบบจากสิ่งที่แมวทั่วไปเห็นเป็นแค่การเคลื่อนไหว <strong>คุมเกม</strong> เพราะตัดสินใจแล้วว่าอะไรควรเป็นยังไง อันนั้นคือกฎ <strong>เจ้าระเบียบ</strong> เพราะตารางต่อรองไม่ได้ แมวที่คิดอยู่เสมอ แม้จะดูเหมือนจ้องผนังสี่สิบนาที",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>อยู่ใกล้แต่ไม่รบกวน</strong> อยู่ห้องเดียวกับคุณหลายชั่วโมง นั่งห่างสองฟุต ปฏิเสธการลูบ แต่พอคุณลุก ตามทันที"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ขอด้วยการนิ่งนาน</strong> นั่งใกล้ๆ แล้วรอ การรอคือคำขอ เดี๋ยวคุณก็จะรู้สึกได้เอง"],
                ["🏰 อาณาเขต", "<strong>ลำดับจุดสังเกตการณ์</strong> มุมชั้นวางหนังสือ ขอบหน้าต่างตอนบ่ายสาม ยอดคอนโดแมวตอนพลบค่ำ แต่ละจุดถูกใช้ตามรอบเข้มงวด"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>ต่ำและจัดสรรอย่างประหยัด</strong> พลังมีค่าเกินจะใช้ตามใจ เฝ้าผีเสื้อสิบนาทีก่อนตัดสินใจว่าไม่คุ้มกับการเดิน"],
                ["🧶 สไตล์การเล่น", "<strong>ใช้สมอง</strong> ที่ให้อาหารแบบปริศนาดีกว่าขนนก ต้องการปัญหาที่มีคำตอบ ไม่ใช่การไล่ที่มีเส้นชัย"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>ระวังและเป็นระบบ</strong> ของใหม่จะถูกเดินรอบ ดม สังเกตจากที่สูง แล้วค่อยอนุมัติให้ใช้ทั่วไป"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>ตัวอื่นคือเป้าหมายการศึกษา</strong> เฝ้าผู้มาใหม่จากระยะปลอดภัย จดบันทึก แล้วผนวกเข้าแผนที่สังคมโดยไม่ต้องส่งเสียง"],
            ],
        
            duringEvents: {
          "dinner": "Analyzes the nutritional value of the meal.",
          "guests": "Studies them like a new species.",
          "zoomies": "Calculates the physics of the jump, then doesn't jump."
},
            duringEventsTh: {
          "dinner": "วิเคราะห์คุณค่าทางโภชนาการของมื้ออาหาร",
          "guests": "ศึกษาแขกเหมือนเป็นสิ่งมีชีวิตสายพันธุ์ใหม่",
          "zoomies": "คำนวณฟิสิกส์ของการกระโดด แล้วก็ไม่กระโดด"
},
                        behavioralHooks: {
                mostLikelyTo: ["Stare at a blank wall for 45 minutes.", "Understand string theory.", "Know your passwords."],
                textsLike: ["I have a theory about the vacuum.", "The bird outside is a government agent.", "Why do you use that specific mug every morning?"],
                secretWeakness: "Ear scratches. It shorts out his brain.",
                whenStressed: "Retreats to the highest possible point and observes.",
                at2AM: "Watching the dust motes dance in the moonlight.",
                corporateSurvivalRate: "75% (The data analyst who doesn't talk to anyone.)",
                emotionalSupportObject: "A specific, heavy book he likes to sit on."
            ,
                mostLikelyToHuman: ["Correct the museum tour guide.", "Have a 'no shoes' rule that they enforce with a glare.", "Keep their receipts for 7 years in an organized binder."],
                emotionalSupportObjectHuman: "A leather-bound planner."},
            behavioralHooksTh: {
                mostLikelyTo: ["จ้องผนังเปล่าๆ 45 นาที", "เข้าใจทฤษฎีสตริง", "รู้รหัสผ่านของคุณ"],
                textsLike: ["เรามีทฤษฎีใหม่เกี่ยวกับเครื่องดูดฝุ่นมาเสนอ", "นกข้างนอกนั่นคือสายลับของรัฐบาล เชื่อเราสิ", "ทำไมเจ้าของต้องใช้แก้วใบเดิมทุกเช้าเลยล่ะ?"],
                secretWeakness: "การโดนเกาหู พอโดนจุดนี้แล้วสมองจะช็อตไปชั่วขณะ",
                whenStressed: "หนีไปอยู่จุดที่สูงที่สุดในบ้านเพื่อเฝ้าสังเกตการณ์",
                at2AM: "จ้องมองฝุ่นละอองที่เต้นรำท่ามกลางแสงจันทร์",
                corporateSurvivalRate: "75% (นักวิเคราะห์ข้อมูลที่ไม่ยอมคุยกับใครเลยแต่ทำงานเป๊ะมาก)",
                emotionalSupportObject: "หนังสือเล่มหนาๆ ที่เขาชอบลงไปนอนทับ"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDBR", blurb: "The ultimate study buddy. You both sit in the same room for 6 hours without speaking, and it’s the best conversation you’ve had all week.", blurbTh: "เพื่อนซี้สายติว นั่งห้องเดียวกัน 6 ชั่วโมงโดยไม่พูดกันสักคำ แต่เป็นการคุยกันที่รู้เรื่องที่สุดในรอบสัปดาห์" },
                worstMatch: { type: "CHBC", blurb: "They have too much 'main character' energy. They will knock over your stack of books just to get a reaction.", blurbTh: "พวกพลังงานตัวเอกล้นหลาม ชอบทำหนังสือที่คุณอุตส่าห์ตั้งกองไว้ล้ม เพียงเพื่อจะดูว่าคุณจะมีปฏิกิริยายังไง" },
                chaosPair: { type: "CDNC", blurb: "A logic loop from hell. You try to explain the theory of gravity; they try to eat the pen you're using.", blurbTh: "วังวนตรรกะวิบัติ คุณพยายามอธิบายทฤษฎีแรงโน้มถ่วง ส่วนเขาพยายามจะกินปากกาที่คุณถืออยู่" },
                emotionalSupport: { type: "SDNR", blurb: "They don’t need to understand your complex thoughts; they just want to be the warm weight on your lap while you think them.", blurbTh: "ไม่จำเป็นต้องเข้าใจความคิดที่ซับซ้อนของคุณ แค่อยากเป็นก้อนอุ่นๆ บนตักในขณะที่คุณกำลังใช้ความคิด" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHBR", blurb: "The Research Team. You provide the deep-dive theories, and they make sure you both remember to eat lunch.", blurbTh: "ทีมวิจัยตัวตึง คุณสายขุดข้อมูลเชิงลึก ส่วนเขาคือคนที่คอยเตือนให้คุณกินข้าวเที่ยง" },
                mutualEnablers: { type: "SDBR", blurb: "You will start talking about space-time at 11 PM and suddenly it’s 5 AM and you’ve both bought telescopes.", blurbTh: "เริ่มคุยเรื่องกาลอวกาศตอนห้าทุ่ม รู้ตัวอีกทีตอนตีห้าคือซื้อกล้องโทรทรรศน์มาคนละตัวแล้ว" },
                exhaustingDuo: { type: "CHBR", blurb: "An endless debate where nobody wins because you’re both too busy citing sources to actually listen.", blurbTh: "การโต้เถียงที่ไม่มีวันจบ เพราะต่างคนต่างยุ่งกับการอ้างอิงแหล่งข้อมูลจนลืมฟังกัน" },
                bannedFromDiscord: { type: "CDBC", blurb: "You turned a 'General' chat into a 200-page academic journal. The mods banned you for 'excessive intellectualism'.", blurbTh: "เปลี่ยนห้องแชททั่วไปให้กลายเป็นวารสารวิชาการ 200 หน้า จนแอดมินต้องแบนในข้อหา 'ฉลาดเกินเบอร์'" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A Linux distribution that only you know how to navigate.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: Linux เวอร์ชันที่มีแค่คุณคนเดียวที่ใช้เป็น"}, {"en": "Social battery: I have 47 tabs open and I don't know where the music is coming from.", "th": "โซเชียลแบต: เปิดแท็บค้างไว้ 47 แท็บ แล้วก็หาไม่เจอว่าเสียงเพลงมาจากแท็บไหน"}, {"en": "Today you are likely to: Read the Terms and Conditions just to find a loophole.", "th": "วันนี้คุณมีแนวโน้มจะ: นั่งอ่านข้อกำหนดและเงื่อนไขเพียงเพื่อจะหาช่องโหว่"}, {"en": "Current mood: A library where someone is whispering slightly too loudly.", "th": "อารมณ์ตอนนี้: ห้องสมุดที่มีคนกระซิบกันเสียงดังเกินไปนิดนึง"}, {"en": "Energy level: Low physical, maximum mental capacity.", "th": "ระดับพลังงาน: กายภาพต่ำแต่พลังสมองพุ่งปรี๊ด"}, {"en": "Today's vibe: Over-analyzing a 'thumbs up' emoji for three hours.", "th": "ฟีลวันนี้: นั่งวิเคราะห์อิโมจิ 'ยกนิ้วโป้ง' มาสามชั่วโมงแล้ว"}, {"en": "Likely activity: Correcting a Wikipedia article in your head.", "th": "กิจกรรมที่น่าจะทำ: นั่งแก้บทความ Wikipedia ในหัวตัวเอง"}, {"en": "Communication style: 'Actually...' followed by a fascinating but unasked-for fact.", "th": "สไตล์การสื่อสาร: ขึ้นต้นด้วย 'จริงๆ แล้ว...' ตามด้วยข้อเท็จจริงที่น่าสนใจแต่ไม่มีใครถาม"}, {"en": "Internal monologue: 'Is reality just a simulation or did I just skip breakfast?'", "th": "เสียงในหัว: 'โลกนี้คือเรื่องจำลอง หรือฉันแค่ลืมกินข้าวเช้ากันแน่?'"}, {"en": "Stress response: Categorizing your bookshelf by the Dewey Decimal System.", "th": "ปฏิกิริยาต่อความเครียด: นั่งคัดแยกหนังสือบนชั้นตามระบบดิวอี้"}, {"en": "Survival strategy: Noise-canceling headphones and a deep-seated love for spreadsheets.", "th": "กลยุทธ์การเอาตัวรอด: หูฟังตัดเสียงรบกวนและความรักที่ฝังรากลึกในไฟล์ Excel"}, {"en": "Today's catchphrase: 'Theoretically speaking, this shouldn't be happening.'", "th": "ประโยคเด็ดวันนี้: 'ตามทฤษฎีแล้ว สิ่งนี้ไม่ควรจะเกิดขึ้นนะ'"}, {"en": "Hidden craving: A conversation that doesn't require a summary at the end.", "th": "ความปรารถนาลึกๆ: การสนทนาที่ไม่ต้องมีสรุปปิดท้าย"}, {"en": "2 AM thought: 'If a cat falls in a forest and no one is there to film it, is it still a meme?'", "th": "ความคิดตอนตี 2: 'แมวตกต้นไม้ในป่า ถ้าไม่มีคนถ่ายคลิปไว้ มันจะยังเป็นมีมได้มั้ย?'"}, {"en": "Identity hook: The person who brings a book to a party and actually reads it.", "th": "นิยามตัวเอง: คนที่พกหนังสือไปงานปาร์ตี้แล้วก็นั่งอ่านจริงๆ"}],
dailyObservations: [{"en": "Current status: Analyzing the dust motes in the moonlight.", "th": "สถานะปัจจุบัน: กำลังวิเคราะห์ละอองฝุ่นในแสงจันทร์"}, {"en": "Social battery: Non-existent. I'm a lone wolf (cat).", "th": "โซเชียลแบต: ไม่มี ฉันคือหมาป่า (แมว) เดียวดาย"}, {"en": "Likely crime today: Intellectual theft (knowing all your secrets).", "th": "อาชญากรรมที่น่าจะเกิด: จารกรรมทางปัญญา (รู้ความลับทุกอย่างของคุณ)"}, {"en": "Attention demands: Zero. Please don't even look at me.", "th": "ความต้องการความสนใจ: ศูนย์ ช่วยอย่ามองมาที่ฉันเลยจะดีกว่า"}, {"en": "Emotional weather: Calm, cool, and highly analytical.", "th": "พยากรณ์อารมณ์: สงบ เยือกเย็น และเน้นการวิเคราะห์"}, {"en": "3 AM activity: Testing the theory of gravity again.", "th": "กิจกรรมตอนตี 3: ทดสอบทฤษฎีแรงโน้มถ่วงอีกรอบ"}, {"en": "Personal space: I am currently on another planet.", "th": "พื้นที่ส่วนตัว: ตอนนี้ฉันอยู่บนดาวเคราะห์ดวงอื่นแล้ว"}, {"en": "Logic level: Supercomputer status.", "th": "ระดับตรรกะ: ระดับซูเปอร์คอมพิวเตอร์"}, {"en": "Motivation: Figuring out how the vacuum works (to destroy it).", "th": "แรงจูงใจ: หาวิธีที่เครื่องดูดฝุ่นทำงาน (เพื่อทำลายมันทิ้ง)"}, {"en": "Preferred seating: Somewhere high up and out of reach.", "th": "ที่นั่งโปรด: ที่สูงๆ และไกลเกินเอื้อม"}, {"en": "Response to 'pspsps': I've analyzed that sound. It's irrelevant.", "th": "ปฏิกิริยาต่อ 'ชิชิ': ฉันวิเคราะห์เสียงนั้นแล้ว มันไม่มีความหมาย"}, {"en": "Goal for the day: Mapping the optimal path to the treats.", "th": "เป้าหมายวันนี้: วางแผนเส้นทางที่สั้นที่สุดไปสู่ขนม"}, {"en": "Secret talent: Can solve a rubik's cube (if I had thumbs).", "th": "พรสวรรค์ลับ: แก้รูบิคได้ (ถ้าฉันมีนิ้วโป้งนะ)"}, {"en": "Communication style: Silent, meaningful stares.", "th": "สไตล์การสื่อสาร: การจ้องมองที่เงียบเชียบและมีความหมาย"}, {"en": "Stress level: Low, as long as I have my theories.", "th": "ระดับความเครียด: ต่ำ ตราบใดที่ฉันยังมีทฤษฎีให้คิด"}, {"en": "Diet: Only specific, high-protein kibble.", "th": "โภชนาการ: อาหารเม็ดโปรตีนสูงสูตรเฉพาะเท่านั้น"}, {"en": "Floor relationship: A vast map for my experiments.", "th": "ความสัมพันธ์กับพื้น: แผนที่ขนาดใหญ่สำหรับการทดลองของฉัน"}, {"en": "Intelligence report: Already knows how to override your WiFi.", "th": "รายงานกรอง: รู้วิธีแฮก WiFi ของคุณแล้ว"}, {"en": "Main character energy: The quiet observer who knows the ending already.", "th": "พลังงานตัวเอก: ผู้สังเกตการณ์เงียบๆ ที่รู้ตอนจบของเรื่องแล้ว"}, {"en": "Internal monologue: 'Human logic is so fascinatingly flawed.'", "th": "เสียงในหัว: 'ตรรกะของมนุษย์นี่มันมีจุดบกพร่องที่น่าสนใจจริงๆ'"}],
compatibility: {
                bestMatch: { type: "SHBR", blurb: "Solid support and endless purrs.", blurbTh: "แรงสนับสนุนที่มั่นคงและเสียงครางที่ยืนยาว" },
                chaosPair: { type: "SDBC", blurb: "Let's rebuild the living room furniture.", blurbTh: "มาจัดเฟอร์นิเจอร์ในห้องนั่งเล่นใหม่กันเถอะ (ด้วยกรงเล็บ)" },
                secretTwin: { type: "CDBR", blurb: "Sharing the same nap schedule.", blurbTh: "ตารางเวลานอนกลางวันเป๊ะเหมือนนัดกันมา" },
                worstRoommate: { type: "CHNC", blurb: "They hide all your toys under the couch.", blurbTh: "เมทที่ชอบเอาของเล่นของคุณไปซ่อนใต้โซฟา" }
            },
          },
        {
            code: "SDBC",
            name: "The Free Spirit",
            tagline: "A rule is just a suggestion they haven't ignored yet.",
            emoji: "🌿",
            color: "#3DA17A",
            bg: "#D2EDE0",
            vibes: ["Independent", "Whimsical", "Anti-Schedule", "Sun-Chasing"],
            famouslySays: "I will eat dinner whenever I feel like it. Which is now. Or in 4 hours.",
            kindredSpirits: ["a Burning Man regular", "Phoebe Buffay", "your friend who lives in a van"],
            redFlags: "Does not respect the closed door.",
            greenFlags: "Lives entirely in the present moment.",
            nameTh: "วิญญาณเสรี",
            taglineTh: "กฎคือคำแนะนำที่ยังไม่ได้เมินเฉย",
            vibesTh: ["อิสระ", "เพ้อฝัน", "ไม่ยึดตาราง", "ตามแสงแดด"],
            famouslySaysTh: "จะกินข้าวตอนที่อยากกิน คือตอนนี้ หรืออีก 4 ชั่วโมงข้างหน้า",
            kindredSpiritsTh: ["ขาประจำ Burning Man", "Phoebe Buffay", "เพื่อนที่อยู่ในรถตู้"],
            redFlagsTh: "ไม่เคารพประตูที่ปิดอยู่",
            greenFlagsTh: "อยู่กับปัจจุบันเต็มร้อย",
            description: "The Free Spirit considers the household guidelines to be one possible interpretation of reality. They are <strong>Solitary</strong> because the inner compass is the only one that matters, <strong>Dreamer</strong> because the future is more interesting than the schedule, <strong>Bossy</strong> because their preferences are non-negotiable, and <strong>Casual</strong> because the rules are wherever they happen to be standing. They're not difficult; they're just operating from a different operating system.",
            traits: [
                ["How They Show Love ❤️", "Love is shown by <strong>presence on their terms</strong>. They'll choose to be near you when they feel like it, and the moment is sincere because it wasn't requested."],
                ["How They Ask for Attention 👀", "Through <strong>unexpected gestures</strong>. A sudden trill. A long stare from across the room. A slow walk to your side at 2am. The timing is theirs."],
                ["Territory (The Fiefdom) 🏰", "Territory is <strong>everywhere and nowhere</strong>. They sleep in a different spot most nights. The house is theirs, but no single corner is sacred."],
                ["Energy Throughout the Day ⚡", "Variable and self-directed. <strong>They follow internal weather, not the clock.</strong> Mealtimes are flexible. Sleep happens when sleep happens."],
                ["Play Style 🧶", "Play is <strong>impulsive</strong>. They'll engage with a leaf blowing past the window for ten minutes, then ignore the new toy you bought entirely."],
                ["Reaction to Change 📦", "Change is met with <strong>casual interest</strong>. A new piece of furniture might be ignored, climbed once, or instantly adopted as the new throne. It depends on the day."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>roommates</strong>. There's no hierarchy to negotiate, no rules to enforce. Live and let nap."],
            ],
            descriptionTh: "แมวที่มองคู่มือบ้านเป็นแค่หนึ่งในการตีความความเป็นจริง <strong>เก็บตัว</strong> เพราะเข็มทิศในใจเท่านั้นที่นับ <strong>นักฝัน</strong> เพราะอนาคตน่าสนใจกว่าตาราง <strong>คุมเกม</strong> เพราะความชอบของเขาต่อรองไม่ได้ <strong>ฟรีสไตล์</strong> เพราะกฎอยู่ตรงไหนก็ตามที่เขายืนอยู่ ไม่ยาก แค่ใช้ระบบปฏิบัติการคนละตัว",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักตามเงื่อนไขของเขา</strong> เลือกอยู่ใกล้คุณตอนรู้สึกอยาก ช่วงเวลานั้นจริงใจเพราะไม่ได้ถูกเรียก"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ท่าทางที่ไม่คาดคิด</strong> เสียงร้องเล็กๆ จู่ๆ จ้องตายาวจากอีกฝั่งห้อง เดินช้าๆ มาข้างคุณตอนตีสอง จังหวะเป็นของเขา"],
                ["🏰 อาณาเขต", "<strong>ทุกที่และไม่มีที่ใด</strong> นอนคนละจุดเกือบทุกคืน บ้านเป็นของเขา แต่ไม่มีมุมไหนศักดิ์สิทธิ์"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>แปรปรวนและกำหนดเอง</strong> ตามสภาพอากาศในใจ ไม่ใช่นาฬิกา เวลาอาหารยืดหยุ่น นอนเมื่ออยากนอน"],
                ["🧶 สไตล์การเล่น", "<strong>เล่นตามอารมณ์</strong> ตื่นเต้นกับใบไม้ปลิวผ่านหน้าต่างสิบนาที แล้วเมินของเล่นใหม่ที่คุณซื้อมาทั้งชุด"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>สนใจแบบสบายๆ</strong> เฟอร์นิเจอร์ใหม่อาจถูกเมิน ปีนครั้งเดียว หรือยอมรับเป็นบัลลังก์ใหม่ทันที แล้วแต่วัน"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>มองตัวอื่นเป็นรูมเมท</strong> ไม่มีลำดับชั้นต้องต่อรอง ไม่มีกฎต้องบังคับ ใช้ชีวิตและปล่อยให้นอน"],
            ],
        
            duringEvents: {
          "dinner": "Eats the dog's food.",
          "guests": "Sleeps on the guest's coat.",
          "zoomies": "Runs sideways for no reason."
},
            duringEventsTh: {
          "dinner": "กินอาหารหมา",
          "guests": "นอนบนเสื้อโค้ทของแขก",
          "zoomies": "วิ่งสไลด์ข้างโดยไม่มีเหตุผล"
},
                        behavioralHooks: {
                mostLikelyTo: ["Forget they have a home.", "Bring a leaf inside and act like it's a prize.", "Sleep in the sink."],
                textsLike: ["I'm in the sink.", "Found a bug. We're friends now.", "Rules are for dogs."],
                secretWeakness: "Sunshine. He will stop mid-walk to flop in it.",
                whenStressed: "Runs sideways into another room and then forgets why.",
                at2AM: "Eating a houseplant he knows is off-limits.",
                corporateSurvivalRate: "10% (Has never once arrived on time for anything.)",
                emotionalSupportObject: "A random pebble he found outside."
            ,
                mostLikelyToHuman: ["Quit their job via a meme.", "Have a different personality for every friend group.", "Accidentally join a cult for the 'vibe'."],
                emotionalSupportObjectHuman: "A vintage film camera."},
            behavioralHooksTh: {
                mostLikelyTo: ["ลืมไปว่าตัวเองมีบ้าน", "คาบใบไม้เข้าบ้านแล้วทำเหมือนเป็นของรางวัล", "นอนในอ่างล้างหน้า"],
                textsLike: ["เราอยู่ในอ่างล้างหน้านะ", "เจอแมลงตัวนึง ตอนนี้เป็นเพื่อนกันแล้ว", "กฎเขามีไว้ใช้กับหมาจ้า"],
                secretWeakness: "แสงแดด สามารถหยุดเดินกลางคันแล้วล้มตัวลงนอนทับแดดได้ทันที",
                whenStressed: "วิ่งสไลด์ข้างไปอีกห้องนึง แล้วก็ลืมว่าวิ่งมาทำไม",
                at2AM: "แอบแทะต้นไม้ในบ้านที่น้อนเจ้าของห้ามไว้",
                corporateSurvivalRate: "10% (ไม่เคยมาทำงานสาย เพราะไม่เคยมาตรงเวลาเลยสักครั้ง)",
                emotionalSupportObject: "ก้อนหินสุ่มๆ ที่เก็บมาจากข้างนอก"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDBC", blurb: "Two nomads meeting in the desert. You share a snack, a nap, and zero expectations.", blurbTh: "นักเดินทางสองคนมาเจอกันกลางทะเลทราย แบ่งขนมกันกิน นอนงีบด้วยกัน และไม่คาดหวังอะไรต่อกัน" },
                worstMatch: { type: "CHBR", blurb: "They want to micromanage your nap schedule. You find their 'structure' offensive to your soul.", blurbTh: "พยายามจะเข้ามาจัดระเบียบการนอนงีบของคุณ คุณรู้สึกว่า 'โครงสร้าง' ของเขามันทำร้ายจิตวิญญาณคุณอย่างแรง" },
                chaosPair: { type: "CHNC", blurb: "You want to chill, they want to parkour off the walls. It’s a 24/7 slapstick comedy.", blurbTh: "คุณอยากชิลล์ แต่เขาอยากเล่นกายกรรมไต่ผนัง กลายเป็นหนังคอมเมดี้เจ็บตัวตลอด 24 ชั่วโมง" },
                emotionalSupport: { type: "SDNC", blurb: "The ultimate 'vibes' anchor. They ground you without ever making you feel caged.", blurbTh: "สมอเรือแห่ง 'ฟีลลิ่ง' ช่วยให้คุณสงบลงได้โดยไม่ทำให้รู้สึกเหมือนโดนกักขัง" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHBC", blurb: "The Dream Team. They handle the maps, you handle the 'let’s see where this road goes' energy.", blurbTh: "คู่หูในฝัน เขาเป็นคนถือแผนที่ ส่วนคุณเป็นคนพาไปดูว่า 'ทางนี้มันจะไปจบที่ไหน'" },
                mutualEnablers: { type: "CHBC", blurb: "You’ll both decide to quit your jobs and open a beach bar in Thailand within 20 minutes of meeting.", blurbTh: "คุยกันได้ 20 นาที ก็ตกลงกันว่าจะลาออกไปเปิดบาร์ริมหาดที่ไทยด้วยกันแล้ว" },
                exhaustingDuo: { type: "SDNR", blurb: "Too much ambiguity. You're both waiting for the 'vibe' to decide what's for dinner until you starve.", blurbTh: "คลุมเครือเกินไป ต่างคนต่างรอให้ 'ฟีลมันได้' ค่อยเลือกว่าจะกินอะไร จบที่หิวโซทั้งคู่" },
                bannedFromDiscord: { type: "CDNC", blurb: "You posted too many 'cursed images' that were actually just photos of your very messy, but very happy, desk.", blurbTh: "โพสต์รูป 'ต้องสาป' เยอะเกินไป ซึ่งจริงๆ มันก็แค่รูปโต๊ะทำงานที่รกสุดๆ แต่เต็มไปด้วยความสุขของคุณนั่นแหละ" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A vintage record player that skips when you walk too fast.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: เครื่องเล่นแผ่นเสียงวินเทจที่ตกร่องเวลาคุณเดินเร็วเกินไป"}, {"en": "Social battery: I'm not ignoring you, I'm just living in a different tempo today.", "th": "โซเชียลแบต: ไม่ได้เมินนะ แค่วันนี้ใช้ชีวิตคนละจังหวะกับชาวบ้านเขา"}, {"en": "Today you are likely to: Walk into a room and forget why, but stay because the lighting is nice.", "th": "วันนี้คุณมีแนวโน้มจะ: เดินเข้าห้องมาแล้วลืมว่ามาทำอะไร แต่ก็อยู่ต่อเพราะแสงมันสวยดี"}, {"en": "Current mood: A dandelion in a hurricane, but I'm having fun.", "th": "อารมณ์ตอนนี้: ดอกแดนดิไลออนกลางพายุเฮอริเคน แต่ก็สนุกดีนะ"}, {"en": "Energy level: Unexpectedly high for someone who looks this relaxed.", "th": "ระดับพลังงาน: สูงเกินคาดสำหรับคนที่ดูชิลล์ขนาดนี้"}, {"en": "Today's vibe: Wearing mismatched socks because 'they match the energy'.", "th": "ฟีลวันนี้: ใส่ถุงเท้าคนละข้างเพราะ 'มันเข้ากับพลังงานในตัว'"}, {"en": "Likely activity: Starting a painting and finishing it in your mind only.", "th": "กิจกรรมที่น่าจะทำ: เริ่มวาดรูป แต่ไปวาดจนจบแค่ในจินตนาการ"}, {"en": "Communication style: Voice notes that include at least three bird sounds in the background.", "th": "สไตล์การสื่อสาร: ส่งข้อความเสียงที่มีเสียงนกติดมาในพื้นหลังอย่างน้อย 3 ตัว"}, {"en": "Internal monologue: 'Everything is fine, and if it's not, it'll make a great story later.'", "th": "เสียงในหัว: 'ทุกอย่างโอเคแหละ ถ้าไม่โอเค เดี๋ยวเอาไปเล่าเป็นเรื่องตลกได้'"}, {"en": "Stress response: Buying a plant you have no idea how to take care of.", "th": "ปฏิกิริยาต่อความเครียด: ซื้อต้นไม้ที่ไม่มีไอเดียเลยว่าจะเลี้ยงมันยังไง"}, {"en": "Survival strategy: Thrift store shopping and a playlist titled 'Main Character Noises'.", "th": "กลยุทธ์การเอาตัวรอด: เดินร้านมือสองและเพลย์ลิสต์ชื่อ 'เสียงประกอบตัวเอก'"}, {"en": "Today's catchphrase: 'It’s not late, it’s just happening later than planned.'", "th": "ประโยคเด็ดวันนี้: 'มันไม่ได้สายนะ แค่มันเกิดขึ้นช้ากว่าที่แพลนไว้เฉยๆ'"}, {"en": "Hidden craving: To be a professional cloud-watcher.", "th": "ความปรารถนาลึกๆ: อยากรับจ้างนอนดูเมฆเป็นอาชีพ"}, {"en": "2 AM thought: 'Is my cat judging my interior design choices?'", "th": "ความคิดตอนตี 2: 'แมวเขากำลังตัดสินรสนิยมการแต่งบ้านของเราอยู่ป่ะ?'"}, {"en": "Identity hook: The human equivalent of a hammock in the breeze.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันเปลญวนที่แกว่งไกวตามลม"}],
dailyObservations: [{"en": "Current status: Living entirely in the present moment (and your sink).", "th": "สถานะปัจจุบัน: อยู่กับปัจจุบันขณะ (และอยู่ในอ่างล้างหน้าคุณ)"}, {"en": "Social battery: Low but whimsical. I might play, I might not.", "th": "โซเชียลแบต: ต่ำแต่เพ้อฝัน อาจจะเล่นด้วย หรืออาจจะไม่"}, {"en": "Likely crime today: Vagrancy and trespassing (the neighbor's yard).", "th": "อาชญากรรมที่น่าจะเกิด: เตร็ดเตร่และบุกรุก (ไปที่สนามหญ้าเพื่อนบ้าน)"}, {"en": "Attention demands: Unpredictable and self-directed.", "th": "ความต้องการความสนใจ: คาดเดาไม่ได้และกำหนดเอง"}, {"en": "Emotional weather: Sunny with a chance of sudden naps.", "th": "พยากรณ์อารมณ์: สดใส มีโอกาสงีบกะทันหัน"}, {"en": "3 AM activity: Eating a moth. It was a good moth.", "th": "กิจกรรมตอนตี 3: กินมอธ รสชาติดีทีเดียว"}, {"en": "Personal space: I'm in the sink. You use the other one.", "th": "พื้นที่ส่วนตัว: ฉันอยู่ในอ่างนี้ คุณไปใช้อีกอ่างสิ"}, {"en": "Logic level: Vibes-based only.", "th": "ระดับตรรกะ: ขับเคลื่อนด้วยฟีลลิ่งล้วนๆ"}, {"en": "Motivation: Sunshine. Naps. More sunshine.", "th": "แรงจูงใจ: แสงแดด การงีบ และแสงแดดที่มากกว่าเดิม"}, {"en": "Preferred seating: Wherever the sun is currently hitting.", "th": "ที่นั่งโปรด: ตรงไหนก็ได้ที่แดดส่องถึง"}, {"en": "Response to 'pspsps': (continues sleeping)", "th": "ปฏิกิริยาต่อ 'ชิชิ': (นอนหลับต่อไป)"}, {"en": "Goal for the day: Achieving a perfect 8-hour stretch.", "th": "เป้าหมายวันนี้: บิดขี้เกียจให้ครบ 8 ชั่วโมง"}, {"en": "Secret talent: Can find the one spot in the house you can't reach.", "th": "พรสวรรค์ลับ: หาจุดในบ้านที่คุณเอื้อมไม่ถึงเจอเสมอ"}, {"en": "Communication style: Soft trills and occasional sighs.", "th": "สไตล์การสื่อสาร: ร้องอ้อนเบาๆ และถอนหายใจเป็นพักๆ"}, {"en": "Stress level: Zero. Nothing matters.", "th": "ระดับความเครียด: ศูนย์ ไม่มีอะไรสำคัญทั้งนั้นแหละ"}, {"en": "Diet: Kibble and the occasional leaf.", "th": "โภชนาการ: อาหารเม็ดและใบไม้สุ่มๆ"}, {"en": "Floor relationship: It's for flopping.", "th": "ความสัมพันธ์กับพื้น: มีไว้ให้ล้มตัวลงนอน"}, {"en": "Intelligence report: Too enlightened for your petty human problems.", "th": "รายงานกรอง: บรรลุเกินกว่าจะมาวุ่นวายกับปัญหาเล็กๆ ของมนุษย์"}, {"en": "Main character energy: The free-spirited wanderer in a coming-of-age movie.", "th": "พลังงานตัวเอก: นักเดินทางอิสระในหนังแนว Coming-of-age"}, {"en": "Internal monologue: 'Everything is a sunbeam if you try hard enough.'", "th": "เสียงในหัว: 'ทุกอย่างคือลำแสงแดด ถ้าเราพยายามมากพอ'"}],
compatibility: {
                bestMatch: { type: "SDNC", blurb: "The ultimate party animals.", blurbTh: "คู่หูสายปาร์ตี้ ดีดกันสุดเหวี่ยง" },
                chaosPair: { type: "SDBR", blurb: "Unstoppable force meets immovable cat.", blurbTh: "เมื่อแมวพลังเหลือเฟือมาเจอแมวสายขวาง" },
                secretTwin: { type: "CHNC", blurb: "Bold, brave, and slightly broke.", blurbTh: "กล้าหาญ บ้าบิ่น และแอบติ๊งต๊องพอกัน" },
                worstRoommate: { type: "CHBR", blurb: "They eat all the premium wet food.", blurbTh: "เมทที่ชอบแย่งกินอาหารเปียกสูตรพรีเมียม" }
            },
          },
        {
            code: "SDNR",
            name: "The Empathetic Muse",
            tagline: "Feels your feelings. Naps until they pass.",
            emoji: "🌙",
            color: "#7E57C2",
            bg: "#E2D6F2",
            vibes: ["Soft", "Intuitive", "Dream-Heavy", "Quiet Comforter"],
            famouslySays: "I am here. Let us nap on this together.",
            kindredSpirits: ["an INFP forever", "Luna Lovegood", "your friend who texts 'thinking of you'"],
            redFlags: "Disappears when overstimulated.",
            greenFlags: "Knows exactly when to show up.",
            nameTh: "มิวส์สายเข้าอกเข้าใจ",
            taglineTh: "รับรู้ความรู้สึกเรา แล้วงีบจนกว่าจะผ่านไป",
            vibesTh: ["นุ่ม", "สัญชาตญาณดี", "ฝันเยอะ", "ปลอบใจเงียบๆ"],
            famouslySaysTh: "ฉันอยู่ตรงนี้ มางีบบนเรื่องนี้ด้วยกัน",
            kindredSpiritsTh: ["สาย INFP ตลอดกาล", "Luna Lovegood", "เพื่อนที่ทักว่า 'คิดถึงนะ'"],
            redFlagsTh: "หายตัวไปเมื่อโดนกระตุ้นมากไป",
            greenFlagsTh: "รู้จังหวะเป๊ะว่าควรโผล่มาเมื่อไหร่",
            description: "The Empathetic Muse is the cat who shows up exactly when you needed someone to. They are <strong>Solitary</strong> because the love is offered without spectacle, <strong>Dreamer</strong> because the emotional currents of the room are read as data, <strong>Nurturing</strong> because the goal is your well-being, and <strong>Regal</strong> because the comfort arrives at the right moment, every time. They're not psychic; they're just paying very close attention.",
            traits: [
                ["How They Show Love ❤️", "Love is delivered as <strong>perfectly-timed proximity</strong>. They'll appear on your lap during a hard phone call and leave when the call is done. The timing is the whole gift."],
                ["How They Ask for Attention 👀", "Quietly. A small chirp from the next room. A soft head-bump under your hand. <strong>The ask is gentle enough to refuse, but you won't.</strong>"],
                ["Territory (The Fiefdom) 🏰", "Territory is a <strong>set of soft-coded zones</strong>: the windowsill at sunrise, the bed at noon, the lap at evening. Each location is held lightly."],
                ["Energy Throughout the Day ⚡", "Low, even, and emotionally tuned. <strong>The energy in the room shapes theirs.</strong> They get quieter when you're stressed, brighter when you're laughing."],
                ["Play Style 🧶", "Play is <strong>sincere but brief</strong>. They want gentle, low-stakes engagement — slow wand movements, soft toys. The point is connection, not stimulation."],
                ["Reaction to Change 📦", "Change is met with <strong>watchful patience</strong>. They'll observe a new visitor or new object for as long as needed, then quietly accept it once it feels safe."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>fellow inhabitants of a shared dream</strong>. They'll sleep nearby, groom occasionally, and avoid territorial drama by simply not engaging."],
            ],
            descriptionTh: "แมวที่โผล่มาตรงเวลาที่คุณต้องการใครสักคน <strong>เก็บตัว</strong> เพราะรักให้แบบไม่ต้องโชว์ <strong>นักฝัน</strong> เพราะอ่านกระแสอารมณ์ในห้องเป็นข้อมูล <strong>ขี้ห่วง</strong> เพราะเป้าหมายคือความสบายใจของคุณ <strong>เจ้าระเบียบ</strong> เพราะการปลอบโยนมาถูกจังหวะทุกครั้ง ไม่ใช่หยั่งรู้ แค่สังเกตอย่างใกล้ชิดมาก",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>มาถูกจังหวะอย่างพอดี</strong> โผล่มานั่งตักตอนคุยโทรศัพท์เครียด แล้วลุกตอนสายตัด จังหวะคือของขวัญทั้งก้อน"],
                ["👀 การเรียกร้องความสนใจ", "<strong>เงียบๆ</strong> เสียงเล็กจากห้องข้างๆ การเอาหัวซุกใต้มือคุณเบาๆ คำขออ่อนพอจะปฏิเสธ แต่คุณจะไม่ปฏิเสธ"],
                ["🏰 อาณาเขต", "<strong>โซนกึ่งกำหนด</strong> ขอบหน้าต่างตอนเช้า เตียงตอนเที่ยง ตักตอนเย็น ทุกตำแหน่งถือไว้หลวมๆ"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>ต่ำ สม่ำเสมอ และจูนตามอารมณ์</strong> พลังในห้องกำหนดพลังของเขา เงียบลงตอนคุณเครียด สดใสตอนคุณหัวเราะ"],
                ["🧶 สไตล์การเล่น", "<strong>จริงใจแต่สั้น</strong> ต้องการการเล่นเบาๆ ความเสี่ยงต่ำ ไม้ขยับช้า ของนุ่มๆ จุดประสงค์คือการเชื่อมโยง ไม่ใช่กระตุ้น"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>รอดูอย่างอดทน</strong> สังเกตแขกใหม่หรือของใหม่นานเท่าที่ต้อง แล้วยอมรับเงียบๆ เมื่อรู้สึกปลอดภัย"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>ผู้อาศัยร่วมในความฝัน</strong> นอนใกล้ๆ เลียทำความสะอาดเป็นบางครั้ง หลีกเลี่ยงดราม่าอาณาเขตด้วยการแค่ไม่เข้าร่วม"],
            ],
        
            duringEvents: {
          "dinner": "Shares their food with you.",
          "thunderstorm": "Tries to comfort the thunder.",
          "guests": "Makes sure everyone has a blanket."
},
            duringEventsTh: {
          "dinner": "แบ่งอาหารให้คุณ",
          "thunderstorm": "พยายามปลอบโยนเสียงฟ้าร้อง",
          "guests": "คอยดูว่าทุกคนมีผ้าห่มไหม"
},
                        behavioralHooks: {
                mostLikelyTo: ["Adopt a bug instead of killing it.", "Listen to all your problems.", "Fall asleep mid-purr."],
                textsLike: ["I felt a disturbance in the vibes.", "I'm sending you a slow blink.", "Let's just be still for a while."],
                secretWeakness: "Sad music. He will come to comfort you immediately.",
                whenStressed: "Slowly blinks at you until you both feel better.",
                at2AM: "Vibrating softly (purring) in his sleep.",
                corporateSurvivalRate: "60% (The empathetic HR person everyone actually likes.)",
                emotionalSupportObject: "A very old, very flat pillow."
            ,
                mostLikelyToHuman: ["Cry at a commercial for laundry detergent.", "Apologize to a door after walking into it.", "Have a secret Pinterest board for their 'dream life'."],
                emotionalSupportObjectHuman: "A plushie they've had since childhood."},
            behavioralHooksTh: {
                mostLikelyTo: ["รับเลี้ยงแมลงแทนที่จะฆ่ามัน", "รับฟังทุกปัญหาของคุณ", "หลับไปกลางคันตอนกำลังคราง"],
                textsLike: ["เรารู้สึกถึงความผิดปกติในมวลบรรยากาศ", "ส่งกระพริบตาช้าๆ ไปให้หนึ่งทีนะ", "มานั่งนิ่งๆ ด้วยกันสักพักเถอะ"],
                secretWeakness: "เพลงเศร้า ได้ยินแล้วจะรีบวิ่งมาปลอบใจคุณทันที",
                whenStressed: "จ้องตาคุณแล้วกระพริบตาช้าๆ ใส่จนกว่าจะรู้สึกดีขึ้นทั้งคู่",
                at2AM: "ส่งเสียงครางครืดๆ เบาๆ ตอนที่กำลังหลับ",
                corporateSurvivalRate: "60% (HR สายซัพพอร์ตที่ทุกคนในออฟฟิศรักจริงๆ)",
                emotionalSupportObject: "หมอนแบนๆ เก่าๆ ใบหนึ่ง"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDNR", blurb: "An atmospheric masterpiece. You both stare out the window together for 45 minutes without blinking.", blurbTh: "ผลงานชิ้นเอกด้านบรรยากาศ นั่งเหม่อมองออกไปนอกหน้าต่างด้วยกัน 45 นาทีโดยไม่กะพริบตา" },
                worstMatch: { type: "CHBC", blurb: "Too much 'grind' energy. They will shout at you for not being productive while you’re trying to channel the Muse.", blurbTh: "พลังงานสายปั่นงานเยอะเกินไป เขาจะบ่นคุณที่ไม่ยอมทำงานทำการ ในขณะที่คุณกำลังหาแรงบันดาลใจอยู่" },
                chaosPair: { type: "CHBR", blurb: "They think life is a race. You think life is a poem. You’ll both end up confused and tired.", blurbTh: "เขาคิดว่าชีวิตคือการแข่งขัน คุณคิดว่าชีวิตคือบทกวี จบที่งงและเหนื่อยทั้งคู่" },
                emotionalSupport: { type: "SDNC", blurb: "The softest landing. They absorb your existential dread and turn it into a purr.", blurbTh: "ที่พึ่งพิงอันแสนนุ่มนวล เขาจะซับเอาความกังวลในการมีอยู่ของคุณแล้วเปลี่ยนเป็นเสียงครางเบาๆ" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHNR", blurb: "The Creative Sanctuary. You make the art, they make sure the rent is paid and the candles are lit.", blurbTh: "พื้นที่ปลอดภัยสายอาร์ต คุณสร้างงานศิลปะ ส่วนเขาคอยดูเรื่องจ่ายค่าเช่าและจุดเทียนหอม" },
                mutualEnablers: { type: "SDNR", blurb: "You will both spend $400 on watercolor paper and then be too intimidated by its quality to ever use it.", blurbTh: "ยอมจ่ายเงินหมื่นซื้อกระดาษสีน้ำอย่างดี แล้วก็เกร็งจนไม่กล้าใช้เพราะมันแพงเกินไป" },
                exhaustingDuo: { type: "CHNR", blurb: "They want to 'help' you fix your life. You just want them to acknowledge the beauty of your sadness.", blurbTh: "เขาพยายามจะ 'ช่วย' จัดการชีวิตคุณ แต่คุณแค่อยากให้เขาเห็นคุณค่าความงามของความเศร้าของคุณ" },
                bannedFromDiscord: { type: "CDNR", blurb: "You turned the 'Creative' channel into a dark, brooding poetry slam that made everyone uncomfortable.", blurbTh: "เปลี่ยนห้องงานสร้างสรรค์ให้กลายเป็นลานประลองบทกวีดาร์กๆ จนคนอื่นอึดอัดกันไปหมด" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: An analog camera with a light leak that makes everything look poetic.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: กล้องฟิล์มที่มีแสงรั่ว ทำให้ทุกอย่างดูละมุนใจแบบบอกไม่ถูก"}, {"en": "Social battery: I am currently out of stock, please check back after the next full moon.", "th": "โซเชียลแบต: สินค้าหมดชั่วคราว โปรดกลับมาเช็กใหม่หลังคืนพระจันทร์เต็มดวง"}, {"en": "Today you are likely to: Cry because a song was slightly too beautiful.", "th": "วันนี้คุณมีแนวโน้มจะ: ร้องไห้เพราะเพลงที่ฟังมันเพราะจนเกินใจจะรับไหว"}, {"en": "Current mood: A rainy Tuesday in a black-and-white movie.", "th": "อารมณ์ตอนนี้: วันอังคารที่ฝนตกในหนังขาวดำ"}, {"en": "Energy level: Ghostly. I am here, but also I am 200 years in the past.", "th": "ระดับพลังงาน: เหมือนวิญญาณ ตัวอยู่นี่แต่ใจย้อนกลับไปเมื่อ 200 ปีก่อน"}, {"en": "Today's vibe: Buying expensive stationery but using a cheap pen to write 'I am tired'.", "th": "ฟีลวันนี้: ซื้อเครื่องเขียนแพงๆ แต่ใช้ปากกาถูกๆ เขียนว่า 'เหนื่อยจัง'"}, {"en": "Likely activity: Staring at a blank canvas and feeling 'deeply moved' by it.", "th": "กิจกรรมที่น่าจะทำ: จ้องผ้าใบเปล่าๆ แล้วรู้สึก 'ตื้นตันใจ' กับความว่างเปล่านั้น"}, {"en": "Communication style: Metaphors and very specific Spotify playlists.", "th": "สไตล์การสื่อสาร: พูดจาเปรียบเปรยและส่งเพลย์ลิสต์ Spotify ที่คัดมาอย่างดี"}, {"en": "Internal monologue: 'Do the shadows represent my fear of commitment or just poor lighting?'", "th": "เสียงในหัว: 'เงาพวกนั้นคือตัวแทนความกลัวการผูกมัด หรือแค่ไฟมันไม่สว่างกันแน่นะ?'"}, {"en": "Stress response: Deleting all your social media apps for exactly four hours.", "th": "ปฏิกิริยาต่อความเครียด: ลบแอปโซเชียลทิ้งทุกอย่าง เป็นเวลา 4 ชั่วโมงเป๊ะ"}, {"en": "Survival strategy: Scented candles and the complete works of a poet you've never actually read.", "th": "กลยุทธ์การเอาตัวรอด: เทียนหอมและรวมบทกวีของนักเขียนที่คุณไม่เคยอ่านจริงๆ"}, {"en": "Today's catchphrase: 'The vibes are... complicated.'", "th": "ประโยคเด็ดวันนี้: 'มู้ดมันค่อนข้าง... ซับซ้อนน่ะ'"}, {"en": "Hidden craving: To be someone's mysterious inspiration.", "th": "ความปรารถนาลึกๆ: อยากเป็นแรงบันดาลใจที่ดูลึกลับของใครสักคน"}, {"en": "2 AM thought: 'If I were a ghost, would I be fashionable?'", "th": "ความคิดตอนตี 2: 'ถ้าฉันเป็นผี ฉันจะเป็นผีที่แต่งตัวเก่งมั้ยนะ?'"}, {"en": "Identity hook: The human equivalent of a forgotten love letter.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันจดหมายรักที่ถูกลืม"}],
dailyObservations: [{"en": "Current status: Absorbing your stress so you don't have to.", "th": "สถานะปัจจุบัน: กำลังซึมซับความเครียดแทนคุณอยู่"}, {"en": "Social battery: Low but deeply supportive.", "th": "โซเชียลแบต: ต่ำแต่เน้นซัพพอร์ตสุดพลัง"}, {"en": "Likely crime today: Over-affection and hairball gifts.", "th": "อาชญากรรมที่น่าจะเกิด: แสดงความรักมากเกินเหตุและให้ก้อนขนเป็นของขวัญ"}, {"en": "Attention demands: Gentle and calibrated to your mood.", "th": "ความต้องการความสนใจ: อ่อนโยนและปรับตามอารมณ์คุณ"}, {"en": "Emotional weather: Overcast with high empathy.", "th": "พยากรณ์อารมณ์: มีเมฆมากพร้อมความเห็นอกเห็นใจสูง"}, {"en": "3 AM activity: Purring softly in your ear to soothe your soul.", "th": "กิจกรรมตอนตี 3: ครางเบาๆ ข้างหูเพื่อปลอบประโลมจิตวิญญาณคุณ"}, {"en": "Personal space: Let's share a blanket. Forever.", "th": "พื้นที่ส่วนตัว: มาแชร์ผ้าห่มกันเถอะ ตลอดกาลเลยนะ"}, {"en": "Logic level: Emotion is the only logic that matters.", "th": "ระดับตรรกะ: อารมณ์คือตรรกะเดียวที่สำคัญ"}, {"en": "Motivation: Your comfort. And soft things.", "th": "แรงจูงใจ: ความสบายของคุณ และของนุ่มๆ"}, {"en": "Preferred seating: On your chest, right where it beats.", "th": "ที่นั่งโปรด: บนอกคุณ ตรงจังหวะหัวใจเต้นพอดี"}, {"en": "Response to 'pspsps': A soft trill and a slow approach.", "th": "ปฏิกิริยาต่อ 'ชิชิ': ร้องอ้อนเบาๆ และค่อยๆ เดินเข้ามาหา"}, {"en": "Goal for the day: Achieving the perfect 14-hour nap.", "th": "เป้าหมายวันนี้: งีบหลับให้ครบ 14 ชั่วโมงแบบสมบูรณ์แบบ"}, {"en": "Secret talent: Can tell you're sad before you even start crying.", "th": "พรสวรรค์ลับ: รู้ว่าคุณเศร้าก่อนที่คุณจะเริ่มร้องไห้เสียอีก"}, {"en": "Communication style: Soulful eyes and rhythmic purring.", "th": "สไตล์การสื่อสาร: แววตาที่ลึกซึ้งและเสียงครางที่เป็นจังหวะ"}, {"en": "Stress level: Low, as long as everyone is happy.", "th": "ระดับความเครียด: ต่ำ ตราบใดที่ทุกคนยังมีความสุข"}, {"en": "Diet: Soft food and gentle praise.", "th": "โภชนาการ: อาหารนุ่มๆ และคำชมที่อ่อนโยน"}, {"en": "Floor relationship: It's a place for soft landings.", "th": "ความสัมพันธ์กับพื้น: พื้นที่สำหรับการลงจอดแบบนุ่มนวล"}, {"en": "Intelligence report: Emotional IQ is off the charts.", "th": "รายงานกรอง: ฉลาดทางอารมณ์แบบทะลุชาร์ต"}, {"en": "Main character energy: The quiet hero who heals everyone in the party.", "th": "พลังงานตัวเอก: ฮีโร่เงียบขรึมผู้คอยฮีลทุกคนในทีม"}, {"en": "Internal monologue: 'Everything will be fine as long as we have this pillow.'", "th": "เสียงในหัว: 'ทุกอย่างจะโอเค ตราบใดที่เรายังมีหมอนใบนี้'"}],
compatibility: {
                bestMatch: { type: "CDNR", blurb: "Sweet dreams and soft blankets.", blurbTh: "ฝันหวานและผ้าห่มนุ่มๆ กับเพื่อนที่แสนดี" },
                chaosPair: { type: "SDNC", blurb: "Zoomies through the hallways.", blurbTh: "วิ่งสู้ฟัดกันนัวเนียไปตามทางเดิน" },
                secretTwin: { type: "SHNC", blurb: "Quiet understanding, loud meows.", blurbTh: "เข้าใจกันเงียบๆ แต่ร้องเมี๊ยวเสียงดัง" },
                worstRoommate: { type: "CHBC", blurb: "They hog the computer keyboard.", blurbTh: "เมทที่ชอบมานอนทับคีย์บอร์ดตอนคุณทำงาน" }
            },
          },
        {
            code: "SDNC",
            name: "The Peaceful Dreamer",
            tagline: "Sun. Blanket. Nothing else matters.",
            emoji: "☁️",
            color: "#5BA8D9",
            bg: "#D5EBF7",
            vibes: ["Chill", "Floofy", "Unbothered", "Aggressively Soft"],
            famouslySays: "(snoring softly)",
            kindredSpirits: ["a yoga retreat regular", "Winnie the Pooh", "your friend who's always 'good'"],
            redFlags: "Will not be rushed. Ever.",
            greenFlags: "A walking, purring meditation.",
            nameTh: "นักฝันสายสงบ",
            taglineTh: "แดด ผ้าห่ม นอกนั้นไม่สำคัญ",
            vibesTh: ["ชิล", "ฟูฟ่อง", "ไม่แคร์โลก", "นุ่มแบบรุนแรง"],
            famouslySaysTh: "(เสียงกรนเบาๆ)",
            kindredSpiritsTh: ["ขาประจำรีทรีตโยคะ", "Winnie the Pooh", "เพื่อนที่ตอบ 'สบายดี' ตลอด"],
            redFlagsTh: "ไม่มีทางเร่งได้ ไม่ว่ากรณีใด",
            greenFlagsTh: "เป็นเหมือนการนั่งสมาธิที่เดินและครางได้",
            description: "The Peaceful Dreamer has identified the warmest sunbeam in the house and made peace with everything else. They are <strong>Solitary</strong> because the inner world is enough, <strong>Dreamer</strong> because reality is mostly a soft suggestion, <strong>Nurturing</strong> because their calm is your calm, and <strong>Casual</strong> because the day has no agenda except the next nap. They're not lazy; they've simply solved life and are enjoying the result.",
            traits: [
                ["How They Show Love ❤️", "Love is shown by <strong>choosing your room</strong>. Of all the soft spots in the house, they picked the one near you. The choice is the whole love letter."],
                ["How They Ask for Attention 👀", "Rarely requested, gently received. <strong>A long slow blink from across the room is a full conversation.</strong>"],
                ["Territory (The Fiefdom) 🏰", "Territory is <strong>wherever the warmth is</strong>. The sunbeam, the heater vent, the laundry that just came out of the dryer. The map shifts with the day."],
                ["Energy Throughout the Day ⚡", "Low, soft, and deeply consistent. <strong>They have one speed and it is acceptable.</strong> The world will adjust."],
                ["Play Style 🧶", "Play is <strong>optional</strong>. They'll watch the wand. Sometimes the watching is the play. Occasionally there's a paw involved."],
                ["Reaction to Change 📦", "Change is met with <strong>graceful indifference</strong>. A new piece of furniture? Eventually slept on. A new visitor? Eventually accepted. There is no rush."],
                ["Relationship with Other Cats 🐈", "Other cats are <strong>fellow dreamers</strong>. They'll share a sunbeam, ignore minor disputes, and quietly model the art of not caring about much."],
            ],
            descriptionTh: "แมวที่หาแสงแดดที่อุ่นที่สุดในบ้านเจอแล้ว และทำใจกับเรื่องอื่นได้หมด <strong>เก็บตัว</strong> เพราะโลกในใจพอแล้ว <strong>นักฝัน</strong> เพราะความเป็นจริงเป็นแค่คำแนะนำเบาๆ <strong>ขี้ห่วง</strong> เพราะความสงบของเขาคือความสงบของคุณ <strong>ฟรีสไตล์</strong> เพราะวันไม่มีวาระ ยกเว้นการนอนรอบหน้า ไม่ขี้เกียจ แค่แก้สมการชีวิตเสร็จแล้วและกำลังเสพผลลัพธ์",
            traitsTh: [
                ["❤️ การแสดงความรัก", "<strong>รักด้วยการเลือกห้องของคุณ</strong> ในบรรดาที่นุ่มทั้งหมดในบ้าน เลือกที่อยู่ใกล้คุณ การเลือกคือจดหมายรักทั้งฉบับ"],
                ["👀 การเรียกร้องความสนใจ", "<strong>ขอน้อย รับเบา</strong> การกระพริบตาช้าๆ จากอีกฝั่งห้องคือบทสนทนาเต็มหนึ่งรอบ"],
                ["🏰 อาณาเขต", "<strong>ตรงไหนก็ตามที่อบอุ่น</strong> แสงแดด ช่องระบายความร้อน กองผ้าที่เพิ่งออกจากเครื่องอบ แผนที่เปลี่ยนตามวัน"],
                ["⚡ พลังงานในแต่ละวัน", "<strong>ต่ำ นุ่ม สม่ำเสมอลึกๆ</strong> มีความเร็วเดียวและรับได้ โลกจะปรับตามเอง"],
                ["🧶 สไตล์การเล่น", "<strong>ตัวเลือก ไม่บังคับ</strong> ดูไม้ตกแมว บางทีการดูคือการเล่น บางครั้งมีอุ้งเท้าเข้ามาเกี่ยว"],
                ["📦 ปฏิกิริยาต่อความเปลี่ยนแปลง", "<strong>เฉยอย่างมีสง่า</strong> เฟอร์นิเจอร์ใหม่ สุดท้ายก็นอน แขกใหม่ สุดท้ายก็ยอมรับ ไม่ต้องรีบ"],
                ["🐈 ความสัมพันธ์กับแมวตัวอื่น", "<strong>นักฝันด้วยกัน</strong> แชร์แสงแดด เมินข้อพิพาทเล็กๆ และเป็นแบบอย่างเงียบๆ ของศิลปะการไม่แคร์อะไรมาก"],
            ],
        
            duringEvents: {
          "dinner": "Sleeps through dinner.",
          "guests": "Doesn't notice the guests.",
          "thunderstorm": "Sleeps through the thunderstorm."
},
            duringEventsTh: {
          "dinner": "นอนหลับข้ามมื้อเย็น",
          "guests": "ไม่ทันสังเกตว่ามีแขกมา",
          "thunderstorm": "หลับยาวทะลุเสียงฟ้าร้อง"
},
                        behavioralHooks: {
                mostLikelyTo: ["Melt into a puddle of floof.", "Not care about literally anything.", "Achieve nirvana."],
                textsLike: ["(No reply, he's sleeping)", "zzzzzz", "Cloud."],
                secretWeakness: "Tummy rubs (the 'trap' kind, but he's too lazy to bite).",
                whenStressed: "Naps harder.",
                at2AM: "Dreaming about a giant marshmallow.",
                corporateSurvivalRate: "5% (He fell asleep during the interview. He didn't even want the job.)",
                emotionalSupportObject: "A specific sunbeam."
            ,
                mostLikelyToHuman: ["Stare at a wall for 3 hours and call it 'meditation'.", "Wear pajamas to the grocery store at noon.", "Forget what they were saying mid-sentence."],
                emotionalSupportObjectHuman: "A very soft oversized hoodie."},
            behavioralHooksTh: {
                mostLikelyTo: ["ละลายกลายเป็นก้อนขน", "ไม่แคร์อะไรเลยบนโลกนี้", "บรรลุนิพพาน"],
                textsLike: ["(ไม่ตอบจ้า หลับอยู่)", "ฟี้........", "ก้อนเมฆ"],
                secretWeakness: "การโดนถูพุง (จริงๆ มันคือกับดักแหละ แต่ขี้เกียจงับแล้ว)",
                whenStressed: "นอนหลับให้ลึกกว่าเดิม",
                at2AM: "กำลังฝันถึงขนมมาร์ชแมลโลว์ยักษ์",
                corporateSurvivalRate: "5% (หลับตั้งแต่ตอนสัมภาษณ์งาน จริงๆ คือไม่ได้อยากได้งานแต่แรกอยู่แล้ว)",
                emotionalSupportObject: "ลำแสงจากดวงอาทิตย์มุมเดิม"
            },

                                    humanCatCompatibility: {
                bestMatch: { type: "SDNC", blurb: "A collective daydream. You both forget that gravity exists and just float through the afternoon together.", blurbTh: "ฝันกลางวันร่วมกัน ต่างคนต่างลืมไปว่ามีแรงโน้มถ่วง แล้วล่องลอยผ่านช่วงบ่ายไปด้วยกัน" },
                worstMatch: { type: "CHBR", blurb: "They keep trying to 'activate' you. You just want to be a puddle of cozy feelings.", blurbTh: "พยายามจะ 'กระตุ้น' คุณให้แอคทีฟตลอดเวลา แต่คุณแค่อยากเป็นก้อนความรู้สึกนุ่มนิ่มที่กองอยู่บนเตียง" },
                chaosPair: { type: "CDBC", blurb: "A collision of two different dream worlds. You’re dreaming of clouds; they’re dreaming of a laser-pointer revolution.", blurbTh: "โลกแห่งความฝันสองใบมาปะทะกัน คุณฝันถึงก้อนเมฆ ส่วนเขาฝันถึงการปฏิวัติด้วยแสงเลเซอร์" },
                emotionalSupport: { type: "SDNR", blurb: "The ultimate soul-balm. They understand the silence that exists between your thoughts.", blurbTh: "ยาใจที่แท้ทรู เขาเข้าใจความเงียบที่อยู่ระหว่างความคิดของคุณ" }
            },
            humanHumanCompatibility: {
                thrivesTogether: { type: "SHNC", blurb: "The Gentle Port. They provide the stability that keeps your daydreams from drifting too far out to sea.", blurbTh: "ท่าเรือที่แสนอ่อนโยน เขาคือความมั่นคงที่คอยรั้งไม่ให้ฝันกลางวันของคุณลอยออกทะเลไปไกลเกิน" },
                mutualEnablers: { type: "SDNC", blurb: "You will both decide that 'doing things' is overrated and spend the entire weekend in your pajamas.", blurbTh: "เห็นพ้องต้องกันว่าการ 'ทำโน่นทำนี่' มันน่าเบื่อเกินไป แล้วก็ใส่ชุดนอนอยู่บ้านทั้งสุดสัปดาห์" },
                exhaustingDuo: { type: "CHNC", blurb: "They are a hurricane of activity. You are a calm pond. The result is just a lot of mud.", blurbTh: "เขาคือพายุหมุนที่หยุดไม่ได้ ส่วนคุณคือสระน้ำที่สงบนิ่ง ผลที่ได้คือโคลนตมล้วนๆ" },
                bannedFromDiscord: { type: "CDNC", blurb: "You kept replying to serious questions with cryptic, dream-logic riddles. The admins lost their patience.", blurbTh: "ชอบตอบคำถามจริงจังด้วยปริศนาธรรมล้ำลึกที่เข้าใจอยู่คนเดียว จนแอดมินหมดความอดทน" }
            },
            dailyObservationsHuman: [{"en": "Today's emotional OS: A screensaver of a tropical beach that never actually loads.", "th": "ระบบปฏิบัติการอารมณ์วันนี้: สกรีนเซฟเวอร์รูปหาดทรายที่โหลดไม่เสร็จสักที"}, {"en": "Social battery: I'm not antisocial, I'm just in another dimension right now.", "th": "โซเชียลแบต: ไม่ได้แอนตี้สังคมนะ แค่ตอนนี้จิตหลุดไปอยู่อีกมิติหนึ่ง"}, {"en": "Today you are likely to: Have a full conversation with yourself and forget to tell anyone the conclusion.", "th": "วันนี้คุณมีแนวโน้มจะ: คุยกับตัวเองจนจบเรื่อง แต่ลืมบอกข้อสรุปให้ชาวบ้านรู้"}, {"en": "Current mood: Soft focus and pastel colors.", "th": "อารมณ์ตอนนี้: ภาพซอฟต์โฟกัสและสีพาสเทล"}, {"en": "Energy level: Low, but my imagination is running a marathon.", "th": "ระดับพลังงาน: ต่ำเตี้ยเรี่ยดิน แต่จินตนาการกำลังวิ่งมาราธอนอยู่"}, {"en": "Today's vibe: Feeling nostalgic for a place you've never actually been to.", "th": "ฟีลวันนี้: รู้สึกคิดถึงสถานที่ที่ไม่เคยไปมาก่อน"}, {"en": "Likely activity: Googling 'how to tell if I am dreaming' while wide awake.", "th": "กิจกรรมที่น่าจะทำ: เข้า Google พิมพ์ว่า 'วิธีเช็กว่าเรากำลังฝันอยู่หรือเปล่า' ทั้งที่ตื่นเต็มตา"}, {"en": "Communication style: Soft whispers and long, meaningful pauses.", "th": "สไตล์การสื่อสาร: กระซิบเบาๆ และการเว้นจังหวะที่ดูมีความหมายลึกซึ้ง"}, {"en": "Internal monologue: 'If I close my eyes, does the world still exist or is it just me?'", "th": "เสียงในหัว: 'ถ้าหลับตา โลกจะยังอยู่มั้ย หรือจะเหลือแค่ฉันคนเดียว?'"}, {"en": "Stress response: Sleeping for 12 hours straight to 'reset the vibes'.", "th": "ปฏิกิริยาต่อความเครียด: นอนยาว 12 ชั่วโมงเพื่อ 'รีเซ็ตมู้ดใหม่'"}, {"en": "Survival strategy: Oversized hoodies and a collection of smooth rocks.", "th": "กลยุทธ์การเอาตัวรอด: เสื้อฮู้ดตัวโคร่งและคอลเลกชันก้อนหินผิวเรียบ"}, {"en": "Today's catchphrase: 'Wait, did I say that out loud?'", "th": "ประโยคเด็ดวันนี้: 'เอ๊ะ เมื่อกี้พูดออกไปเหรอ?'"}, {"en": "Hidden craving: To live in a house made of clouds.", "th": "ความปรารถนาลึกๆ: อยากอยู่บ้านที่ทำจากก้อนเมฆ"}, {"en": "2 AM thought: 'What if we're all just memories of a very sleepy giant?'", "th": "ความคิดตอนตี 2: 'จะเป็นยังไงถ้าเราทุกคนเป็นแค่ความจำของยักษ์ที่กำลังง่วงนอน?'"}, {"en": "Identity hook: The human equivalent of a lighthouse in a fog bank.", "th": "นิยามตัวเอง: มนุษย์เวอร์ชันประภาคารกลางม่านหมอก"}],
dailyObservations: [{"en": "Current status: Achieving total enlightenment (napping).", "th": "สถานะปัจจุบัน: บรรลุนิพพาน (กำลังงีบอยู่)"}, {"en": "Social battery: 2%. Do not recharge.", "th": "โซเชียลแบต: 2% ห้ามชาร์จเพิ่ม"}, {"en": "Likely crime today: Sleeping through your important work meeting.", "th": "อาชญากรรมที่น่าจะเกิด: นอนหลับข้ามการประชุมงานสำคัญของคุณ"}, {"en": "Attention demands: Minimal. A single pet is sufficient.", "th": "ความต้องการความสนใจ: น้อยมาก ลูบทีเดียวก็พอแล้ว"}, {"en": "Emotional weather: Zen with a 100% chance of floof.", "th": "พยากรณ์อารมณ์: สงบนิ่งพร้อมความฟูฟ่อง 100%"}, {"en": "3 AM activity: Moving from the bed to the floor for a change of pace.", "th": "กิจกรรมตอนตี 3: ย้ายที่นอนจากเตียงลงพื้นเพื่อเปลี่ยนบรรยากาศ"}, {"en": "Personal space: The entire house is my bedroom.", "th": "พื้นที่ส่วนตัว: ทั้งบ้านคือห้องนอนของฉัน"}, {"en": "Logic level: Thoughts head empty, only soft.", "th": "ระดับตรรกะ: หัวสมองว่างเปล่า มีแต่ความนุ่มนิ่ม"}, {"en": "Motivation: Nirvana. And the sunbeam.", "th": "แรงจูงใจ: พระนิพพาน และแสงแดด"}, {"en": "Preferred seating: Wherever I fell asleep last.", "th": "ที่นั่งโปรด: ตรงไหนก็ได้ที่ฉันเพิ่งหลับไป"}, {"en": "Response to 'pspsps': (ears twitch, but body remains still)", "th": "ปฏิกิริยาต่อ 'ชิชิ': (หูกระดิกเบาๆ แต่ตัวนิ่งสนิท)"}, {"en": "Goal for the day: Staying horizontal for as long as possible.", "th": "เป้าหมายวันนี้: นอนราบให้นานที่สุดเท่าที่จะทำได้"}, {"en": "Secret talent: Can sleep through a thunderstorm and a vacuum.", "th": "พรสวรรค์ลับ: นอนหลับทะลุเสียงฟ้าร้องและเครื่องดูดฝุ่นได้"}, {"en": "Communication style: Soft snores and the occasional eye-squint.", "th": "สไตล์การสื่อสาร: เสียงกรนเบาๆ และการหรี่ตาเป็นพักๆ"}, {"en": "Stress level: Non-existent. What is stress?", "th": "ระดับความเครียด: ไม่มี ความเครียดคืออะไรเหรอ?"}, {"en": "Diet: Whatever is closest to my napping spot.", "th": "โภชนาการ: อะไรก็ได้ที่อยู่ใกล้ที่นอนที่สุด"}, {"en": "Floor relationship: It's my primary bed.", "th": "ความสัมพันธ์กับพื้น: มันคือเตียงหลักของฉันเอง"}, {"en": "Intelligence report: Has surpassed human intelligence and decided it's too much work.", "th": "รายงานกรอง: ก้าวข้ามสติปัญญามนุษย์ไปแล้วและพบว่ามันเหนื่อยเกินไป"}, {"en": "Main character energy: The background character who is actually a god.", "th": "พลังงานตัวเอก: ตัวประกอบพื้นหลังที่จริงๆ แล้วคือพระเจ้า"}, {"en": "Internal monologue: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'", "th": "เสียงในหัว: 'ฟี้................................'"}],
compatibility: {
                bestMatch: { type: "SHNC", blurb: "A magical friendship full of surprises.", blurbTh: "มิตรภาพที่มหัศจรรย์และเต็มไปด้วยเรื่องเซอร์ไพรส์" },
                chaosPair: { type: "SDNR", blurb: "Chasing ghosts together at night.", blurbTh: "คู่หูไล่ล่าวิญญาณ (จิ้งจก) ตอนกลางคืน" },
                secretTwin: { type: "SDBC", blurb: "Bravery is their middle name.", blurbTh: "ความกล้าหาญคือนามสกุลของเรา" },
                worstRoommate: { type: "CDBR", blurb: "They always leave hairballs in your bed.", blurbTh: "เมทที่ชอบทิ้งก้อนขนไว้บนเตียงของคุณ" }
            },
          },
    ];

    // Code-axis flips: rival is the archetype with all 4 axes inverted.
    // Axis pairs: C↔S, H↔D, B↔N, R↔C(asual). The 4-letter code ends in R or C.
    const FLIP = { C: "S", S: "C", H: "D", D: "H", B: "N", N: "B", R: "C" };
    function flipCode(code) {
        // The 4th char overlaps with 1st-axis char "C". Flip per position.
        const axes = ["CS", "HD", "BN", "RC"];
        return code.split("").map((ch, i) => {
            const pair = axes[i];
            return pair[0] === ch ? pair[1] : pair[0];
        }).join("");
    }

    function slugify(name) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    // Decorate each entry: slug, rival, default shareCopy.
    const byCode = {};
    ARCHETYPES.forEach(a => {
        a.slug = slugify(a.name);
        a.rival = flipCode(a.code);
        if (!a.shareCopy) {
            a.shareCopy = `My cat is ${a.code} — ${a.name}. "${a.tagline}" — meowbti.com`;
        }
        if (!a.shareCopyHuman) {
            a.shareCopyHuman = `I am a ${a.code} — ${a.name}. "${a.tagline}" — meowbti.com`;
        }
        byCode[a.code] = a;
    });

    function get(code) {
        return byCode[(code || "").toUpperCase()] || byCode.CHBR;
    }

    function imagePath(code) {
        const a = get(code);
        return `assets/personalities/${a.code.toLowerCase()}-${a.slug}.webp`;
    }

    function shareCaption(code, subject = 'cat') {
        const a = get(code);
        return subject === 'human' ? a.shareCopyHuman : a.shareCopy;
    }

    window.MeowArchetypes = {
        all: ARCHETYPES,
        byCode,
        get,
        imagePath,
        shareCaption,
    };
})();
