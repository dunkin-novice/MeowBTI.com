// MeowBTI Questions — Source of truth for Short and Deep quiz modes.
// 
// Short mode: 12 statements (3 per axis).
// Deep mode: 60 statements (15 per axis).
// 
// Axes:
// C/S: Commanding vs Solitary
// H/D: Hunter vs Dreamer
// B/N: Bossy vs Nurturing
// R/F: Regal vs Casual (F stands for Freestyle/Casual, maps to 'C' in code)

const QUESTIONS = {
    cs: [
        { emoji: "🚪", yes: "C", no: "S", s: "Your cat acts like you've returned from war after a 3-minute bathroom trip.", sTh: "แมวคุณทำตัวเหมือนคุณกลับจากสงคราม ทั้งที่เพิ่งเข้าห้องน้ำไป 3 นาที" },
        { emoji: "👻", yes: "S", no: "C", s: "Your cat becomes a rumor when guests come over. May or may not exist.", sTh: "แมวคุณกลายเป็นตำนานเวลาแขกมาบ้าน มีอยู่จริงหรือเปล่าก็ไม่รู้" },
        { emoji: "⌨️", yes: "C", no: "S", s: "Your cat walks across your keyboard mid-meeting just to remind you they exist.", sTh: "แมวคุณเดินผ่านคีย์บอร์ดกลางประชุม แค่อยากเตือนว่ายังอยู่นะ" },
        { emoji: "💂", yes: "C", no: "S", s: "Your cat follows you from room to room like a tiny, fuzzy bodyguard.", sTh: "แมวคุณเดินตามคุณไปทุกห้องเหมือนบอดี้การ์ดตัวจิ๋ว" },
        { emoji: "📏", yes: "S", no: "C", s: "Your cat prefers to be in the same room as you, but exactly 3 feet out of reach.", sTh: "แมวคุณชอบอยู่ในห้องเดียวกับคุณ แต่ต้องรักษาระยะห่าง 3 ฟุตเสมอ" },
        { emoji: "📢", yes: "C", no: "S", s: "Your cat screams at the door the second you close it.", sTh: "แมวคุณร้องประท้วงทันทีที่คุณปิดประตู" },
        { emoji: "🕵️", yes: "S", no: "C", s: "Your cat has a 'secret spot' that even you haven't found yet.", sTh: "แมวคุณมี 'ที่กบดานลับ' ที่แม้แต่คุณก็ยังหาไม่เจอ" },
        { emoji: "🔑", yes: "C", no: "S", s: "Your cat greets you at the door before you even get the key in the lock.", sTh: "แมวคุณมารอรับที่ประตูตั้งแต่คุณยังไม่ทันไขกุญแจ" },
        { emoji: "😒", yes: "S", no: "C", s: "Your cat looks at you with profound disappointment if you try to initiate play while they're 'busy.'", sTh: "แมวคุณมองคุณด้วยความผิดหวังอย่างแรงถ้าคุณพยายามชวนเล่นตอนที่เขากำลัง 'ยุ่ง'" },
        { emoji: "🎬", yes: "C", no: "S", s: "Your cat is the 'main character' of every social gathering.", sTh: "แมวคุณมักจะเป็นตัวเอกในทุกการรวมกลุ่ม" },
        { emoji: "🧊", yes: "S", no: "C", s: "Your cat watches the world from the top of the fridge, away from the peasants.", sTh: "แมวคุณเฝ้าดูโลกจากบนตู้เย็น ห่างไกลจากพวกสามัญชน" },
        { emoji: "📞", yes: "C", no: "S", s: "Your cat tries to participate in your phone calls with loud commentary.", sTh: "แมวคุณพยายามมีส่วนร่วมในการคุยโทรศัพท์ของคุณด้วยการร้องแทรก" },
        { emoji: "📦", yes: "S", no: "C", s: "Your cat prefers the company of a cardboard box over a human today.", sTh: "วันนี้แมวคุณเลือกที่จะอยู่กับกล่องลังมากกว่าอยู่กับคน" },
        { emoji: "💓", yes: "C", no: "S", s: "Your cat sits on your chest at 3 AM to check if you're still alive.", sTh: "แมวคุณมานั่งบนอกตอนตี 3 เพื่อเช็คว่าคุณยังไม่ตาย" },
        { emoji: "🛑", yes: "S", no: "C", s: "Your cat has a 'leave me alone' face that is legally binding.", sTh: "แมวคุณมีหน้า 'อย่ามายุ่ง' ที่ดูจริงจังจนน่าเกรงขาม" }
    ],
    hd: [
        { emoji: "🎯", yes: "H", no: "D", s: "Your cat will pursue a hair tie under the fridge for 40 minutes.", sTh: "แมวคุณตามยางรัดผมที่กลิ้งเข้าใต้ตู้เย็นได้ 40 นาทีแบบไม่ยอมแพ้" },
        { emoji: "👁️", yes: "D", no: "H", s: "Your cat stares at a wall like it owes them money.", sTh: "แมวคุณจ้องกำแพงเหมือนกำแพงติดหนี้อยู่" },
        { emoji: "🪲", yes: "D", no: "H", s: "Your cat watches a passing moth like it has prophecy value.", sTh: "แมวคุณมองผีเสื้อกลางคืนบินผ่านเหมือนมันมาบอกอนาคต" },
        { emoji: "🥣", yes: "H", no: "D", s: "Your cat knows exactly what time it is based on the sound of the kibble bag.", sTh: "แมวคุณรู้เวลาเป๊ะๆ แค่ได้ยินเสียงถุงอาหารเม็ด" },
        { emoji: "🦜", yes: "H", no: "D", s: "Your cat chirps at birds through the window like they're having a heated debate.", sTh: "แมวคุณส่งเสียงจิ๊บๆ ใส่พวกนกที่นอกหน้าต่างเหมือนกำลังเถียงกันไฟแลบ" },
        { emoji: "🚀", yes: "D", no: "H", s: "Your cat gets 'the zoomies' at 11 PM for reasons known only to the elder gods.", sTh: "แมวคุณวิ่งพล่านตอนห้าทุ่มด้วยเหตุผลที่พระเจ้าเท่านั้นที่รู้" },
        { emoji: "👂", yes: "H", no: "D", s: "Your cat can hear a treat container opening from three rooms away.", sTh: "แมวคุณได้ยินเสียงเปิดกระป๋องขนมจากระยะสามห้อง" },
        { emoji: "🕯️", yes: "D", no: "H", s: "Your cat stares into the dark hallway like they're seeing a ghost from the 1800s.", sTh: "แมวคุณจ้องเข้าไปในทางเดินมืดๆ เหมือนเห็นผีจากยุค 80" },
        { emoji: "💧", yes: "H", no: "D", s: "Your cat is fascinated by the way water drips from the faucet.", sTh: "แมวคุณหลงใหลในหยดน้ำที่หยดจากก๊อกน้ำ" },
        { emoji: "😑", yes: "D", no: "H", s: "Your cat slow-blinks at nothing in particular for long periods.", sTh: "แมวคุณกะพริบตาช้าๆ ใส่ความว่างเปล่าเป็นเวลานาน" },
        { emoji: "🛍️", yes: "H", no: "D", s: "Your cat meticulously inspects every grocery bag for 'contraband.'", sTh: "แมวคุณตรวจถุงกับข้าวทุกถุงอย่างละเอียดเหมือนหาของผิดกฎหมาย" },
        { emoji: "💤", yes: "D", no: "H", s: "Your cat seems to be having a very intense dream that involves running in place.", sTh: "แมวคุณดูเหมือนจะฝันหนักมากจนขาขยับเหมือนวิ่งอยู่กับที่" },
        { emoji: "🔴", yes: "H", no: "D", s: "Your cat tracks a laser pointer with the focus of a diamond-cutter.", sTh: "แมวคุณไล่ตามเลเซอร์ด้วยสมาธิที่แน่วแน่ดั่งนักเจียระไนเพชร" },
        { emoji: "👽", yes: "D", no: "H", s: "Your cat looks at you like they've just realized you're actually a giant, hairless cat.", sTh: "แมวคุณมองคุณเหมือนเพิ่งนึกได้ว่าจริงๆ แล้วคุณคือแมวยักษ์ที่ไม่มีขน" },
        { emoji: "🗺️", yes: "H", no: "D", s: "Your cat remembers exactly where you hid the 'special' treats.", sTh: "แมวคุณจำแม่นว่าคุณซ่อนขนมสุดพิเศษไว้ที่ไหน" }
    ],
    bn: [
        { emoji: "🚧", yes: "B", no: "N", s: "Your cat believes closed doors are personal attacks.", sTh: "แมวคุณเชื่อว่าประตูที่ปิดอยู่คือการโจมตีส่วนตัว" },
        { emoji: "💞", yes: "N", no: "B", s: "Your cat slow-blinks at you like a tiny therapist.", sTh: "แมวคุณกะพริบตาช้าๆ ใส่คุณเหมือนนักจิตบำบัดตัวจิ๋ว" },
        { emoji: "💼", yes: "B", no: "N", s: "Your cat will body-slam you for treats.", sTh: "แมวคุณพร้อมพุ่งชนคุณเพื่อขอขนม" },
        { emoji: "🧼", yes: "N", no: "B", s: "Your cat grooms your hair as if you're a particularly large, incompetent kitten.", sTh: "แมวคุณเลียผมคุณเหมือนว่าคุณเป็นลูกแมวยักษ์ที่ดูแลตัวเองไม่เป็น" },
        { emoji: "📵", yes: "B", no: "N", s: "Your cat knocks your phone out of your hand because it's 'attention time' now.", sTh: "แมวคุณปัดมือถือหลุดจากมือคุณเพราะตอนนี้คือ 'เวลาของฉัน'" },
        { emoji: "🍞", yes: "N", no: "B", s: "Your cat 'makes biscuits' on your softest blanket for hours.", sTh: "แมวคุณ 'นวด' บนผ้าห่มนุ่มๆ ของคุณเป็นชั่วโมง" },
        { emoji: "🗯️", yes: "B", no: "N", s: "Your cat screams for food even though their bowl is still 50% full.", sTh: "แมวคุณร้องขออาหารทั้งที่ในชามยังเหลืออยู่ตั้งครึ่ง" },
        { emoji: "🎁", yes: "N", no: "B", s: "Your cat brings you 'gifts' (socks, toy mice) to show they care.", sTh: "แมวคุณคาบ 'ของขวัญ' (ถุงเท้า, หนูปลอม) มาให้เพื่อบอกว่ารัก" },
        { emoji: "🖥️", yes: "B", no: "N", s: "Your cat sits on whatever you are currently looking at.", sTh: "แมวคุณจะไปนั่งทับอะไรก็ตามที่คุณกำลังมองอยู่" },
        { emoji: "⚓", yes: "N", no: "B", s: "Your cat leans their whole weight against your leg when they're happy.", sTh: "แมวคุณพิงน้ำหนักตัวทั้งหมดใส่ขาคุณเวลาเขารู้สึกดี" },
        { emoji: "🥊", yes: "B", no: "N", s: "Your cat has 'the bap' ready if you pet them one time too many.", sTh: "แมวคุณเตรียม 'ตบ' ทันทีถ้าคุณลูบเขาเกินโควต้า" },
        { emoji: "👃", yes: "N", no: "B", s: "Your cat licks your nose to wake you up gently.", sTh: "แมวคุณเลียจมูกปลุกคุณอย่างเบามือ" },
        { emoji: "⏰", yes: "B", no: "N", s: "Your cat demands to be fed exactly at 6:00 AM, or there will be consequences.", sTh: "แมวคุณสั่งให้ป้อนข้าวตอน 6 โมงเช้าเป๊ะๆ ไม่งั้นมีเรื่องแน่" },
        { emoji: "🚽", yes: "N", no: "B", s: "Your cat follows you to the bathroom to make sure you're okay in there.", sTh: "แมวคุณตามคุณไปห้องน้ำเพื่อให้แน่ใจว่าคุณยังปลอดภัยดี" },
        { emoji: "🥀", yes: "B", no: "N", s: "Your cat pushes things off the table just to watch them fall.", sTh: "แมวคุณเขี่ยของตกโต๊ะเพื่อดูมันหล่นลงไปเฉยๆ" }
    ],
    rf: [
        { emoji: "📍", yes: "R", no: "F", s: "Your cat treats their favorite spot as a sacred site. Do not sit there.", sTh: "แมวคุณถือว่าจุดโปรดของตัวเองเป็นพื้นที่ศักดิ์สิทธิ์ ห้ามนั่งเด็ดขาด" },
        { emoji: "🌀", yes: "F", no: "R", s: "Your cat sleeps wherever they collapse — new spot every night.", sTh: "แมวคุณนอนตรงไหนก็ได้ที่ล้มลง คืนนี้จุดนึง พรุ่งนี้อีกจุด" },
        { emoji: "🕰️", yes: "F", no: "R", s: "Your cat eats whenever they feel like it. Could be now. Could be in 4 hours.", sTh: "แมวคุณกินตอนไหนก็ได้ที่อยากกิน อาจจะเดี๋ยวนี้ หรืออีก 4 ชั่วโมงข้างหน้า" },
        { emoji: "🦢", yes: "R", no: "F", s: "Your cat has a very specific, dignified way of sitting with their paws tucked in perfectly.", sTh: "แมวคุณมีท่านั่งที่สง่างามมาก โดยเก็บเท้าเข้าที่อย่างสมบูรณ์แบบ" },
        { emoji: "🍮", yes: "F", no: "R", s: "Your cat looks like a 'liquid' that has spilled onto the floor.", sTh: "แมวคุณดูเหมือน 'ของเหลว' ที่หกเลอะเทอะอยู่บนพื้น" },
        { emoji: "🥣", yes: "R", no: "F", s: "Your cat refuses to eat 'the bottom of the bowl' even if it's perfectly fine.", sTh: "แมวคุณไม่ยอมกินอาหารที่ก้นชาม ทั้งที่มันก็ยังดูดีอยู่" },
        { emoji: "🤸", yes: "F", no: "R", s: "Your cat sleeps in positions that look like they've had a tragic accident.", sTh: "แมวคุณนอนในท่าที่ดูเหมือนเพิ่งผ่านอุบัติเหตุร้ายแรงมา" },
        { emoji: "💅", yes: "R", no: "F", s: "Your cat grooms themselves for 20 minutes after being touched by a 'human.'", sTh: "แมวคุณเลียทำความสะอาดตัวเองยี่สิบนาทีหลังจากถูก 'มนุษย์' สัมผัส" },
        { emoji: "🗼", yes: "F", no: "R", s: "Your cat sits like a gargoyle on the edge of the bathtub.", sTh: "แมวคุณไปนั่งยองๆ เป็นการ์กอยล์อยู่บนขอบอ่างอาบน้ำ" },
        { emoji: "🏰", yes: "R", no: "F", s: "Your cat carries themselves with the air of a deposed monarch.", sTh: "แมวคุณวางตัวเหมือนเป็นกษัตริย์ที่ถูกเนรเทศออกมา" },
        { emoji: "🥔", yes: "F", no: "R", s: "Your cat is perfectly happy being a 'chaos potato' on the rug.", sTh: "แมวคุณมีความสุขกับการเป็น 'มันฝรั่งจอมป่วน' อยู่บนพรม" },
        { emoji: "🍷", yes: "R", no: "F", s: "Your cat only drinks water from a specific crystal glass (or a running faucet).", sTh: "แมวคุณจะยอมดื่มน้ำจากแก้วคริสตัลใบโปรด (หรือน้ำที่ไหลจากก๊อก) เท่านั้น" },
        { emoji: "🦦", yes: "F", no: "R", s: "Your cat is a 'belly-up' sleeper, showing total disregard for dignity.", sTh: "แมวคุณนอนหงายโชว์พุงแบบไม่เหลือเกียรติยศกษัตริย์ใดๆ" },
        { emoji: "🧵", yes: "R", no: "F", s: "Your cat will only sit on the most expensive fabric in the room.", sTh: "แมวคุณจะเลือกนั่งเฉพาะบนผ้าที่แพงที่สุดในห้องเท่านั้น" },
        { emoji: "🤵", yes: "R", no: "F", s: "Your cat acts like they're wearing a tuxedo even when they're covered in dust.", sTh: "แมวคุณทำตัวเหมือนใส่สูททักซิโด้อยู่ตลอดเวลา แม้จะเพิ่งคลุกฝุ่นมา" }
    ]
};

// For Short Mode: Take first 3 from each axis
const SHORT_STATEMENTS = [
    ...QUESTIONS.cs.slice(0, 3),
    ...QUESTIONS.hd.slice(0, 3),
    ...QUESTIONS.bn.slice(0, 3),
    ...QUESTIONS.rf.slice(0, 3)
];

// For Deep Mode: All 60
const DEEP_STATEMENTS = [
    ...QUESTIONS.cs,
    ...QUESTIONS.hd,
    ...QUESTIONS.bn,
    ...QUESTIONS.rf
];

window.MeowQuestions = {
    short: SHORT_STATEMENTS,
    deep: DEEP_STATEMENTS
};
