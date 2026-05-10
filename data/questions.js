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

const CAT_QUESTIONS = {
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

const HUMAN_QUESTIONS = {
  cs: [
    { emoji: "💻", yes: "S", no: "C", s: "You open a message immediately… then mentally respond 6 hours later.", sTh: "คุณเปิดอ่านข้อความทันที... แต่ดันตอบในใจแล้วลืมตอบจริงไปอีก 6 ชั่วโมง" },
    { emoji: "🛌", yes: "C", no: "S", s: "Your room is a 'controlled chaos' where only you know where the socks are.", sTh: "ห้องคุณคือ 'ความโกลาหลที่ควบคุมได้' มีแค่คุณคนเดียวที่รู้ว่าถุงเท้าอยู่ไหน" },
    { emoji: "⏰", yes: "S", no: "C", s: "You set 10 alarms in 5-minute intervals just to feel something.", sTh: "คุณตั้งนาฬิกาปลุก 10 ครั้ง ทุกๆ 5 นาที เพียงเพื่อให้รู้สึกว่าได้ตื่นแล้วจริงๆ" },
    { emoji: "📈", yes: "S", no: "C", s: "You make a To-Do list just for the dopamine hit of crossing things off.", sTh: "คุณจด To-do list เพียงเพื่อจะเอาความฟินตอนขีดฆ่าสิ่งที่ทำเสร็จแล้วออก" },
    { emoji: "🫗", yes: "C", no: "S", s: "You have 4 different drinks on your desk at all times for different 'vibes'.", sTh: "บนโต๊ะคุณมีน้ำวางอยู่ 4 แก้วตลอดเวลา เพื่อฟีลลิ่งที่แตกต่างกันไป" },
    { emoji: "🗓️", yes: "S", no: "C", s: "An unscheduled phone call feels like a personal attack.", sTh: "การมีคนโทรมาหาโดยไม่ได้นัดล่วงหน้า รู้สึกเหมือนโดนประทุษร้ายร่างกาย" },
    { emoji: "🗄️", yes: "S", no: "C", s: "Your desktop folders are meticulously named 'Final_v2_REAL_final'.", sTh: "โฟลเดอร์ในคอมคุณถูกตั้งชื่ออย่างเป็นระบบว่า 'Final_v2_อันนี้จริงละ_final'" },
    { emoji: "🌪️", yes: "C", no: "S", s: "You start 5 new hobbies this week and finish none of them.", sTh: "คุณเริ่มงานอดิเรกใหม่ 5 อย่างในอาทิตย์นี้ และไม่มีอย่างไหนที่ทำจบเลยสักอัน" },
    { emoji: "🍔", yes: "C", no: "S", s: "You decide what to eat based on a random TikTok you saw 2 minutes ago.", sTh: "คุณตัดสินใจว่าจะกินอะไรจาก TikTok ที่เพิ่งเลื่อนผ่านเมื่อ 2 นาทีที่แล้ว" },
    { emoji: "📱", yes: "S", no: "C", s: "You have 0 unread notifications because red circles haunt your dreams.", sTh: "คุณไม่มีแจ้งเตือนค้างเลย เพราะวงกลมสีแดงๆ มันตามหลอกหลอนคุณในฝัน" },
    { emoji: "🛒", yes: "C", no: "S", s: "You add 50 items to your cart just to close the tab and buy nothing.", sTh: "คุณกดของใส่รถเข็น 50 อย่าง เพียงเพื่อจะปิดแท็บทิ้งแล้วไม่ซื้ออะไรเลย" },
    { emoji: "🧘", yes: "S", no: "C", s: "You research for 3 hours before buying a $10 item to ensure it's 'optimal'.", sTh: "คุณหาข้อมูล 3 ชั่วโมงก่อนซื้อของราคา 300 บาท เพื่อให้มั่นใจว่ามันคุ้มค่าที่สุด" },
    { emoji: "🧩", yes: "C", no: "S", s: "Your 'system' involves searching for your keys for 10 minutes every morning.", sTh: "ระบบการจัดการของคุณคือการใช้เวลา 10 นาทีทุกเช้าเพื่อหากุญแจ" },
    { emoji: "🧼", yes: "S", no: "C", s: "You wash the dishes immediately because the sight of a dirty sink hurts.", sTh: "คุณล้างจานทันทีที่กินเสร็จ เพราะทนเห็นอ่างล้านจานสกปรกไม่ได้จริงๆ" },
    { emoji: "🎨", yes: "C", no: "S", s: "You thrive in 'creative clutter'—others call it a disaster zone.", sTh: "คุณรุ่งเรืองในความรกแบบสร้างสรรค์ แต่คนอื่นเรียกมันว่าเขตภัยพิบัติ" }
  ],
  hd: [
    { emoji: "🏠", yes: "H", no: "D", s: "Your 'social battery' runs out after 20 minutes of small talk.", sTh: "แบตเตอรี่ทางสังคมของคุณหมดเกลี้ยงหลังจากคุยเรื่องสัพเพเหระไปแค่ 20 นาที" },
    { emoji: "🎒", yes: "D", no: "H", s: "You feel physically itchy if you stay in the house for more than 48 hours.", sTh: "คุณจะรู้สึกคันไม้คันมือถ้าต้องอุดอู้อยู่ในบ้านนานเกิน 48 ชั่วโมง" },
    { emoji: "🍿", yes: "H", no: "D", s: "Canceling plans feels better than actually going to the plans.", sTh: "การยกเลิกนัดให้ความรู้สึกฟินยิ่งกว่าการได้ไปตามนัดจริงๆ เสียอีก" },
    { emoji: "🗺️", yes: "D", no: "H", s: "You've looked at flight prices for a country you have no intention of visiting.", sTh: "คุณเคยเปิดดูราคาตั๋วเครื่องบินไปประเทศที่จริงๆ ก็ไม่ได้กะจะไปหรอก" },
    { emoji: "🛋️", yes: "H", no: "D", s: "Your bed is your office, your dining room, and your safe haven.", sTh: "เตียงนอนคือออฟฟิศ ห้องอาหาร และพื้นที่ปลอดภัยเพียงหนึ่งเดียวของคุณ" },
    { emoji: "📸", yes: "D", no: "H", s: "You'll walk 15,000 steps for the perfect sunset photo.", sTh: "คุณยอมเดิน 15,000 ก้าว เพียงเพื่อให้ได้รูปพระอาทิตย์ตกที่สมบูรณ์แบบ" },
    { emoji: "🍕", yes: "H", no: "D", s: "You know the delivery driver's car by the sound of its engine.", sTh: "คุณจำรถของไรเดอร์ส่งอาหารได้จากแค่เสียงเครื่องยนต์" },
    { emoji: "⛺", yes: "D", no: "H", s: "You'd rather sleep in a tent than a 5-star hotel if the view is better.", sTh: "คุณยอมนอนในเต็นท์มากกว่าโรงแรม 5 ดาว ถ้าวิวมันสวยกว่ากัน" },
    { emoji: "🚪", yes: "H", no: "D", s: "You check the peephole to make sure the hallway is clear before leaving.", sTh: "คุณส่องตาแมวเพื่อให้แน่ใจว่าไม่มีใครอยู่ตรงทางเดินก่อนจะเดินออกจากห้อง" },
    { emoji: "🏙️", yes: "D", no: "H", s: "You have a list of 'secret spots' in the city that aren't secret anymore.", sTh: "คุณมีลิสต์ 'ที่ลับ' ในเมืองที่ตอนนี้ไม่ลับอีกต่อไปแล้ว" },
    { emoji: "🔌", yes: "H", no: "D", s: "Your biggest fear is being at a party where you only know one person.", sTh: "ความกลัวสูงสุดของคุณคือการไปงานปาร์ตี้ที่มีคนที่คุณรู้จักอยู่แค่คนเดียว" },
    { emoji: "🛶", yes: "D", no: "H", s: "You say 'yes' to spontaneous road trips before asking where you're going.", sTh: "คุณตอบตกลงไปโรดทริปแบบกะทันหันก่อนจะถามซะอีกว่าจะไปที่ไหน" },
    { emoji: "📚", yes: "H", no: "D", s: "A 'wild night' for you involves a book, tea, and no human contact.", sTh: "คืนที่แสนเหวี่ยงวายของคุณคือการอยู่กับหนังสือ ชา และการไม่เจอใครเลย" },
    { emoji: "🚆", yes: "D", no: "H", s: "You enjoy the journey more than the destination, even if the train is late.", sTh: "คุณสนุกกับระหว่างทางมากกว่าจุดหมายปลายทาง ถึงแม้รถไฟจะเลทก็ตาม" },
    { emoji: "🌧️", yes: "H", no: "D", s: "Rainy days are just an excuse for you to stay in your pajamas all day.", sTh: "วันที่ฝนตกคือข้ออ้างชั้นดีที่คุณจะได้ใส่ชุดนอนอยู่บ้านทั้งวัน" }
  ],
  bn: [
    { emoji: "🧠", yes: "B", no: "N", s: "You overthink a text for 20 minutes and then just reply with 'K'.", sTh: "คุณคิดมากเรื่องการตอบแชทอยู่ 20 นาที แล้วสุดท้ายก็ตอบกลับไปแค่ 'เค'" },
    { emoji: "🧊", yes: "N", no: "B", s: "Your brain is currently 'no thoughts, head empty'—just elevator music.", sTh: "สมองคุณตอนนี้คือ 'ไม่มีความคิด หัวว่างเปล่า' มีแค่เพลงในลิฟต์วนอยู่ในหัว" },
    { emoji: "🧐", yes: "B", no: "N", s: "You can't watch a movie without looking up the actors' entire Wikipedia.", sTh: "คุณดูหนังไม่ได้เลยถ้าไม่ได้เปิดดูวิกิพีเดียของนักแสดงทุกคนในเรื่อง" },
    { emoji: "🍦", yes: "N", no: "B", s: "You forget why you walked into a room at least three times a day.", sTh: "คุณลืมว่าเดินเข้ามาในห้องนี้ทำไม อย่างน้อยวันละ 3 รอบ" },
    { emoji: "🔬", yes: "B", no: "N", s: "You have strong opinions on things that literally don't matter.", sTh: "คุณมีความเห็นที่หนักแน่นมากกับเรื่องที่จริงๆ แล้วไม่ได้สลักสำคัญอะไรเลย" },
    { emoji: "🪁", yes: "N", no: "B", s: "You're the person who laughs 5 minutes after the joke was told.", sTh: "คุณคือคนที่ขำหลังจากที่เขายิงมุกกันจบไปแล้ว 5 นาที" },
    { emoji: "📜", yes: "B", no: "N", s: "You read the terms and conditions because you're suspicious of 'free'.", sTh: "คุณอ่านข้อตกลงและเงื่อนไข เพราะคุณระแวงคำว่า 'ฟรี'" },
    { emoji: "😵‍💫", yes: "N", no: "B", s: "You've looked for your phone while you were literally holding it.", sTh: "คุณเคยเดินหามือถือทั้งๆ ที่มือถือก็คามือคุณอยูั่นแหละ" },
    { emoji: "🧩", yes: "B", no: "N", s: "You solve puzzles in your head while people are talking to you.", sTh: "คุณแอบแก้โจทย์ในหัวขณะที่คนอื่นกำลังคุยกับคุณอยู่" },
    { emoji: "🍭", yes: "N", no: "B", s: "You're easily distracted by a shiny object or a passing dog.", sTh: "คุณวอกแวกได้ง่ายๆ แค่เห็นของเงาๆ หรือหมาที่เดินผ่านไป" },
    { emoji: "🕵️", yes: "B", no: "N", s: "You find the social media of someone you met once in 30 seconds.", sTh: "คุณสามารถหาโซเชียลมีเดียของคนที่เคยเจอแค่ครั้งเดียวได้ภายใน 30 วินาที" },
    { emoji: "🫧", yes: "N", no: "B", s: "You think the best solution to a problem is to take a nap.", sTh: "คุณคิดว่าทางออกที่ดีที่สุดของทุกปัญหาคือการไปนอนงีบ" },
    { emoji: "⚖️", yes: "B", no: "N", s: "You spend hours debating the 'lore' of a fictional universe.", sTh: "คุณใช้เวลาเป็นชั่วโมงๆ ถกเถียงเรื่องปูมหลังของจักรวาลในหนังหรือเกม" },
    { emoji: "🎈", yes: "N", no: "B", s: "You've walked into a door frame because you were daydreaming.", sTh: "คุณเคยเดินชนขอบประตูเพราะมัวแต่เหม่อลอย" },
    { emoji: "🔍", yes: "B", no: "N", s: "You're the designated person to explain things to the group chat.", sTh: "คุณคือคนที่ได้รับมอบหมายให้คอยอธิบายเรื่องต่างๆ ในกลุ่มแชทเสมอ" }
  ],
  rf: [
    { emoji: "💸", yes: "F", no: "R", s: "You buy things because 'I deserve a little treat' for existing.", sTh: "คุณซื้อของเพราะคิดว่า 'ฉันควรได้รับรางวัลเล็กๆ น้อยๆ' แค่เพราะยังมีชีวิตอยู่" },
    { emoji: "📊", yes: "R", no: "F", s: "You check your bank account before every purchase, even a coffee.", sTh: "คุณเช็คยอดเงินในบัญชีก่อนซื้อของทุกครั้ง แม้แต่ตอนจะซื้อกาแฟแค่แก้วเดียว" },
    { emoji: "💅", yes: "F", no: "R", s: "Your aesthetic is more important than your actual comfort.", sTh: "ความสวยงาม (Aesthetic) สำคัญกว่าความสบายที่แท้จริงของคุณ" },
    { emoji: "🛠️", yes: "R", no: "F", s: "You fix things with duct tape and hope instead of calling a pro.", sTh: "คุณซ่อมของด้วยเทปกาวและความหวัง แทนที่จะเรียกช่างมืออาชีพมาซ่อม" },
    { emoji: "🕯️", yes: "F", no: "R", s: "You buy expensive candles you are too afraid to actually light.", sTh: "คุณซื้อเทียนหอมราคาแพงมาตั้งโชว์ แต่ดันไม่กล้าจุดใช้งานจริง" },
    { emoji: "🕰️", yes: "R", no: "F", s: "You value things that are 'built to last' over things that look cool.", sTh: "คุณให้คุณค่ากับของที่ 'ทนทาน' มากกว่าของที่ดูเท่แต่พังง่าย" },
    { emoji: "✨", yes: "F", no: "R", s: "You believe the 'vibes' of a room can change your entire personality.", sTh: "คุณเชื่อว่า 'Vibe' ของห้องสามารถเปลี่ยนบุคลิกภาพทั้งหมดของคุณได้" },
    { emoji: "🥔", yes: "R", no: "F", s: "You'd rather wear the same hoodie for 5 years than follow a trend.", sTh: "คุณยอมใส่เสื้อฮู้ดตัวเดิมไป 5 ปี ดีกว่าต้องคอยวิ่งตามเทรนด์แฟชั่น" },
    { emoji: "🎀", yes: "F", no: "R", s: "You collect things just because the packaging was 'so cute'.", sTh: "คุณสะสมของเพียงเพราะว่าบรรจุภัณฑ์มัน 'น่ารักเกินปุยมุ้ย'" },
    { emoji: "🧯", yes: "R", no: "F", s: "You always know where the nearest exit or fire extinguisher is.", sTh: "คุณมักจะรู้เสมอว่าทางออกหนีไฟหรือถังดับเพลิงที่ใกล้ที่สุดอยู่ที่ไหน" },
    { emoji: "🦢", yes: "F", no: "R", s: "You spend more on skincare than you do on actual groceries.", sTh: "คุณจ่ายเงินกับสกินแคร์มากกว่าค่ากับข้าวในแต่ละเดือนซะอีก" },
    { emoji: "🧱", yes: "R", no: "F", s: "You prefer a hard truth over a beautiful lie any day.", sTh: "คุณเลือกที่จะฟังความจริงที่โหดร้าย มากกว่าคำโกหกที่สวยหรู" },
    { emoji: "🎠", yes: "F", no: "R", s: "You live in a Pinterest board—reality is just a suggestion.", sTh: "คุณใช้ชีวิตอยู่ในบอร์ด Pinterest... ส่วนโลกความจริงน่ะเหรอ ก็แค่คำแนะนำสั้นๆ" },
    { emoji: "🍳", yes: "R", no: "F", s: "You follow the recipe exactly because 'chaos' is for bad cooks.", sTh: "คุณทำตามสูตรอาหารเป๊ะๆ เพราะ 'ความมั่ว' มีไว้สำหรับคนทำอาหารไม่เป็นเท่านั้น" },
    { emoji: "🎭", yes: "F", no: "R", s: "You romanticize your life by pretending you're in a movie montage.", sTh: "คุณทำให้ชีวิตดูโรแมนติกด้วยการแกล้งทำเหมือนตัวเองอยู่ในฉากมอนทาจของหนัง" }
  ]
};

// For Short Mode: Take first 3 from each axis
const CAT_SHORT_STATEMENTS = [
    ...CAT_QUESTIONS.cs.slice(0, 3),
    ...CAT_QUESTIONS.hd.slice(0, 3),
    ...CAT_QUESTIONS.bn.slice(0, 3),
    ...CAT_QUESTIONS.rf.slice(0, 3)
];

const CAT_DEEP_STATEMENTS = [
    ...CAT_QUESTIONS.cs,
    ...CAT_QUESTIONS.hd,
    ...CAT_QUESTIONS.bn,
    ...CAT_QUESTIONS.rf
];

const HUMAN_SHORT_STATEMENTS = [
    ...HUMAN_QUESTIONS.cs.slice(0, 3),
    ...HUMAN_QUESTIONS.hd.slice(0, 3),
    ...HUMAN_QUESTIONS.bn.slice(0, 3),
    ...HUMAN_QUESTIONS.rf.slice(0, 3)
];

const HUMAN_DEEP_STATEMENTS = [
    ...HUMAN_QUESTIONS.cs,
    ...HUMAN_QUESTIONS.hd,
    ...HUMAN_QUESTIONS.bn,
    ...HUMAN_QUESTIONS.rf
];

window.MeowQuestions = {
    short: CAT_SHORT_STATEMENTS,
    deep: CAT_DEEP_STATEMENTS,
    humanShort: HUMAN_SHORT_STATEMENTS,
    humanDeep: HUMAN_DEEP_STATEMENTS
};
