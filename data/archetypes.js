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
            mostLikelyTo: [
          "Schedule a meeting that could have been a meow.",
          "Accidentally start a cult.",
          "Sue you for emotional damages (empty bowl)."
],
            mostLikelyToTh: [
          "นัดประชุมทั้งที่จริงๆ แค่ร้องเหมียวเดียวก็จบ",
          "ตั้งลัทธิโดยไม่ได้ตั้งใจ",
          "ฟ้องคุณฐานทำให้สะเทือนใจ (เพราะปล่อยชามข้าวว่าง)"
],
            relationships: {
          "bestFriend": "SHBR",
          "chaosDuo": "CHNC",
          "soulmate": "CDNR",
          "nightmare": "SDBC"
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
            mostLikelyTo: [
          "Convince you he hasn't been fed in 3 years.",
          "Sublet your favorite chair to the neighbor's cat.",
          "Bribe the dog."
],
            mostLikelyToTh: [
          "โน้มน้าวให้คุณเชื่อว่าไม่ได้กินข้าวมา 3 ปี",
          "ปล่อยเช่าเก้าอี้ตัวโปรดของคุณให้แมวข้างบ้าน",
          "ติดสินบนหมา"
],
            relationships: {
          "bestFriend": "SHBC",
          "chaosDuo": "CHNC",
          "soulmate": "CDBC",
          "nightmare": "SDNR"
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
            mostLikelyTo: [
          "Wake you up just to make sure you're breathing.",
          "Ban you from the kitchen for your own safety.",
          "Aggressively groom your hair."
],
            mostLikelyToTh: [
          "ปลุกคุณขึ้นมาเพื่อเช็กว่ายังหายใจอยู่ไหม",
          "แบนคุณออกจากครัวเพื่อความปลอดภัยของคุณเอง",
          "เลียผมคุณอย่างเอาเป็นเอาตาย"
],
            relationships: {
          "bestFriend": "SHNR",
          "chaosDuo": "CDNC",
          "soulmate": "SDBR",
          "nightmare": "CHNC"
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
            mostLikelyTo: [
          "Get stuck in a paper bag and pretend it was intentional.",
          "Knock over a vase while maintaining eye contact.",
          "Throw a party at 3 AM."
],
            mostLikelyToTh: [
          "ติดในถุงกระดาษแล้วทำเป็นตั้งใจ",
          "ปัดแจกันตกพร้อมจ้องตาคุณไม่กะพริบ",
          "จัดปาร์ตี้ตอนตี 3"
],
            relationships: {
          "bestFriend": "CDNC",
          "chaosDuo": "CHBR",
          "soulmate": "SDBC",
          "nightmare": "SHBR"
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
            mostLikelyTo: [
          "Build a fort out of your clean laundry.",
          "Rearrange the bookshelf by knocking everything off.",
          "Have a 5-year plan for the apartment."
],
            mostLikelyToTh: [
          "สร้างป้อมปราการจากผ้าที่เพิ่งซัก",
          "จัดชั้นหนังสือใหม่ด้วยการปัดทุกอย่างตกลงมา",
          "มีแผนพัฒนาอพาร์ตเมนต์ล่วงหน้า 5 ปี"
],
            relationships: {
          "bestFriend": "SDBR",
          "chaosDuo": "CDBC",
          "soulmate": "SHBC",
          "nightmare": "SDNC"
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
            mostLikelyTo: [
          "Refuse to sit where you want them to, out of principle.",
          "Meow back every time you talk.",
          "Win an argument by knocking over a glass."
],
            mostLikelyToTh: [
          "ไม่ยอมนั่งตรงที่คุณอยากให้นั่งเพื่อรักษาจุดยืน",
          "เถียงกลับทุกครั้งที่คุณพูดด้วย",
          "ชนะการเถียงด้วยการปัดแก้วน้ำแตก"
],
            relationships: {
          "bestFriend": "CDNC",
          "chaosDuo": "CDBR",
          "soulmate": "SHBC",
          "nightmare": "SHNR"
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
            mostLikelyTo: [
          "Know you're sad before you do.",
          "Gently redirect your bad decisions.",
          "Heal your inner child."
],
            mostLikelyToTh: [
          "รู้ว่าคุณเศร้าก่อนตัวคุณเองจะรู้",
          "เปลี่ยนทิศทางการตัดสินใจแย่ๆ ของคุณอย่างอ่อนโยน",
          "เยียวยาเด็กน้อยในใจคุณ"
],
            relationships: {
          "bestFriend": "SHNR",
          "chaosDuo": "CDNC",
          "soulmate": "CHBR",
          "nightmare": "SHBC"
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
            mostLikelyTo: [
          "Trip you and then expect an apology.",
          "Fake an injury for extra treats.",
          "Make every situation about themselves."
],
            mostLikelyToTh: [
          "ขัดขาคุณล้มแล้วรอคำขอโทษ",
          "แกล้งเจ็บตัวเพื่อขอขนมเพิ่ม",
          "ทำให้ทุกเรื่องกลายเป็นเรื่องของตัวเอง"
],
            relationships: {
          "bestFriend": "CHNC",
          "chaosDuo": "CDNR",
          "soulmate": "SDBC",
          "nightmare": "SDBR"
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
            mostLikelyTo: [
          "Outsmart you at every turn.",
          "Hold a grudge from 2019.",
          "Judge you silently."
],
            mostLikelyToTh: [
          "ฉลาดกว่าคุณในทุกจังหวะ",
          "แค้นฝังหุ่นมาตั้งแต่ปี 2019",
          "ตัดสินคุณเงียบๆ"
],
            relationships: {
          "bestFriend": "CHBR",
          "chaosDuo": "SHBC",
          "soulmate": "SDBR",
          "nightmare": "CHNC"
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
            mostLikelyTo: [
          "Escape any carrier.",
          "Steal your keys for a project.",
          "Learn how to turn off the alarm."
],
            mostLikelyToTh: [
          "แหกหนีจากกระเป๋าแมวทุกใบ",
          "ขโมยกุญแจคุณไปทำโปรเจกต์",
          "เรียนรู้วิธีปิดนาฬิกาปลุก"
],
            relationships: {
          "bestFriend": "CHBC",
          "chaosDuo": "SHBR",
          "soulmate": "CDBC",
          "nightmare": "SDNR"
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
            mostLikelyTo: [
          "Die for you.",
          "Remember exactly where you put the treats.",
          "Never leave your side when you're sick."
],
            mostLikelyToTh: [
          "ยอมตายแทนคุณ",
          "จำได้เป๊ะว่าคุณซ่อนขนมไว้ไหน",
          "ไม่ยอมห่างคุณเลยตอนคุณป่วย"
],
            relationships: {
          "bestFriend": "CDNR",
          "chaosDuo": "SDNC",
          "soulmate": "CHNR",
          "nightmare": "CDBC"
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
            mostLikelyTo: [
          "Cry because you moved slightly.",
          "Stare at the rain and contemplate existence.",
          "Refuse to eat out of existential dread."
],
            mostLikelyToTh: [
          "ร้องไห้เพราะคุณขยับตัวนิดเดียว",
          "จ้องฝนตกแล้วครุ่นคิดถึงการมีอยู่",
          "ไม่ยอมกินข้าวเพราะกังวลเรื่องชีวิต"
],
            relationships: {
          "bestFriend": "SDNR",
          "chaosDuo": "SHNR",
          "soulmate": "CDNC",
          "nightmare": "CHBR"
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
            mostLikelyTo: [
          "Stare at a blank wall for 45 minutes.",
          "Understand string theory.",
          "Know your passwords."
],
            mostLikelyToTh: [
          "จ้องผนังเปล่าๆ 45 นาที",
          "เข้าใจทฤษฎีสตริง",
          "รู้รหัสผ่านของคุณ"
],
            relationships: {
          "bestFriend": "CDBR",
          "chaosDuo": "SDBC",
          "soulmate": "SHBR",
          "nightmare": "CHNC"
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
            mostLikelyTo: [
          "Forget they have a home.",
          "Bring a leaf inside and act like it's a prize.",
          "Sleep in the sink."
],
            mostLikelyToTh: [
          "ลืมไปว่าตัวเองมีบ้าน",
          "คาบใบไม้เข้าบ้านแล้วทำเหมือนเป็นของรางวัล",
          "นอนในอ่างล้างหน้า"
],
            relationships: {
          "bestFriend": "CHNC",
          "chaosDuo": "SDBR",
          "soulmate": "SDNC",
          "nightmare": "CHBR"
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
            mostLikelyTo: [
          "Adopt a bug instead of killing it.",
          "Listen to all your problems.",
          "Fall asleep mid-purr."
],
            mostLikelyToTh: [
          "รับเลี้ยงแมลงแทนที่จะฆ่ามัน",
          "รับฟังทุกปัญหาของคุณ",
          "หลับไปกลางคันตอนกำลังคราง"
],
            relationships: {
          "bestFriend": "SHNC",
          "chaosDuo": "SDNC",
          "soulmate": "CDNR",
          "nightmare": "CHBC"
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
            mostLikelyTo: [
          "Melt into a puddle of floof.",
          "Not care about literally anything.",
          "Achieve nirvana."
],
            mostLikelyToTh: [
          "ละลายกลายเป็นก้อนขน",
          "ไม่แคร์อะไรเลยบนโลกนี้",
          "บรรลุนิพพาน"
],
            relationships: {
          "bestFriend": "SDBC",
          "chaosDuo": "SDNR",
          "soulmate": "SHNC",
          "nightmare": "CDBR"
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
        byCode[a.code] = a;
    });

    function get(code) {
        return byCode[(code || "").toUpperCase()] || byCode.CHBR;
    }

    function imagePath(code) {
        const a = get(code);
        return `assets/personalities/${a.code.toLowerCase()}-${a.slug}.webp`;
    }

    function shareCaption(code) {
        return get(code).shareCopy;
    }

    window.MeowArchetypes = {
        all: ARCHETYPES,
        byCode,
        get,
        imagePath,
        shareCaption,
    };
})();
