(function() {
    const QUESTIONS = [
        { id: 1, type: 1, text: { en: "I often feel a strong internal drive to do things the right way.", th: "ฉันมักรู้สึกถึงแรงผลักดันภายในอย่างรุนแรงที่จะทำสิ่งต่างๆ ให้ถูกต้อง" } },
        { id: 2, type: 1, text: { en: "I am very critical of my own mistakes and shortcomings.", th: "ฉันมักจะวิพากษ์วิจารณ์ความผิดพลาดและข้อบกพร่องของตัวเองอย่างมาก" } },
        { id: 3, type: 1, text: { en: "I value order, structure, and following established rules.", th: "ฉันให้คุณค่ากับความเป็นระเบียบ โครงสร้าง และการปฏิบัติตามกฎเกณฑ์" } },

        { id: 4, type: 2, text: { en: "I often put the needs of others before my own.", th: "ฉันมักจะให้ความสำคัญกับความต้องการของคนอื่นก่อนตัวเองเสมอ" } },
        { id: 5, type: 2, text: { en: "I feel a deep sense of satisfaction when I can help someone.", th: "ฉันรู้สึกพึงพอใจอย่างมากเมื่อได้ช่วยเหลือใครบางคน" } },
        { id: 6, type: 2, text: { en: "I sometimes worry that people won't like me if I don't help them.", th: "บางครั้งฉันกังวลว่าคนอื่นจะไม่ชอบฉันถ้าฉันไม่ได้ช่วยเหลือพวกเขา" } },

        { id: 7, type: 3, text: { en: "Success and being perceived as successful are very important to me.", th: "ความสำเร็จและการถูกมองว่าเป็นคนประสบความสำเร็จมีความสำคัญมากสำหรับฉัน" } },
        { id: 8, type: 3, text: { en: "I am very driven to achieve my goals and be the best at what I do.", th: "ฉันมีความทะเยอทะยานสูงที่จะบรรลุเป้าหมายและเป็นคนที่เก่งที่สุดในสิ่งที่ทำ" } },
        { id: 9, type: 3, text: { en: "I often adjust my image to fit what is expected of me in a situation.", th: "ฉันมักจะปรับภาพลักษณ์ของตัวเองให้เข้ากับสิ่งที่คนอื่นคาดหวังในสถานการณ์นั้นๆ" } },

        { id: 10, type: 4, text: { en: "I often feel that I am fundamentally different from other people.", th: "ฉันมักจะรู้สึกว่าตัวเองมีความแตกต่างจากคนอื่นอย่างสิ้นเชิง" } },
        { id: 11, type: 4, text: { en: "I experience my emotions very deeply and intensely.", th: "ฉันสัมผัสถึงอารมณ์ของตัวเองได้อย่างลึกซึ้งและเข้มข้นมาก" } },
        { id: 12, type: 4, text: { en: "Authenticity and self-expression are crucial to my sense of self.", th: "ความจริงใจและการได้แสดงตัวตนออกมามีความสำคัญอย่างยิ่งต่อความรู้สึกในตัวเองของฉัน" } },

        { id: 13, type: 5, text: { en: "I have a strong desire to understand how the world works in detail.", th: "ฉันมีความปรารถนาอย่างแรงกล้าที่จะเข้าใจว่าโลกนี้ทำงานอย่างไรอย่างละเอียด" } },
        { id: 14, type: 5, text: { en: "I value my privacy and need significant time alone to process my thoughts.", th: "ฉันให้ความสำคัญกับความเป็นส่วนตัวและต้องการเวลาอยู่ลำพังมากเพื่อประมวลผลความคิด" } },
        { id: 15, type: 5, text: { en: "I prefer to observe and analyze a situation before getting involved.", th: "ฉันชอบที่จะสังเกตและวิเคราะห์สถานการณ์ก่อนที่จะเข้าไปมีส่วนร่วม" } },

        { id: 16, type: 6, text: { en: "I am often very aware of potential risks and what could go wrong.", th: "ฉันมักจะตระหนักถึงความเสี่ยงที่อาจเกิดขึ้นและสิ่งที่อาจจะผิดพลาดได้เสมอ" } },
        { id: 17, type: 6, text: { en: "Loyalty and belonging to a reliable group are very important to me.", th: "ความซื่อสัตย์และการได้เป็นส่วนหนึ่งของกลุ่มที่พึ่งพาได้มีความสำคัญมากสำหรับฉัน" } },
        { id: 18, type: 6, text: { en: "I often seek reassurance or guidance from people I trust.", th: "ฉันมักจะแสวงหาคำยืนยันหรือคำแนะนำจากคนที่ฉันไว้วางใจ" } },

        { id: 19, type: 7, text: { en: "I am always looking for new and exciting experiences.", th: "ฉันมักจะมองหาประสบการณ์ใหม่ๆ ที่น่าตื่นเต้นอยู่เสมอ" } },
        { id: 20, type: 7, text: { en: "I find it difficult to stay focused on one thing for a long time.", th: "ฉันรู้สึกว่ามันยากที่จะจดจ่อกับสิ่งเดียวเป็นเวลานานๆ" } },
        { id: 21, type: 7, text: { en: "I tend to avoid negative emotions and focus on the positive possibilities.", th: "ฉันมักจะหลีกเลี่ยงอารมณ์ด้านลบและจดจ่อกับความเป็นไปได้ในเชิงบวกแทน" } },

        { id: 22, type: 8, text: { en: "I value strength, independence, and being in control of my own life.", th: "ฉันให้คุณค่ากับความแข็งแกร่ง ความเป็นอิสระ และการได้ควบคุมชีวิตของตัวเอง" } },
        { id: 23, type: 8, text: { en: "I am not afraid of conflict and will stand up for what I believe in.", th: "ฉันไม่กลัวความขัดแย้งและจะลุกขึ้นสู้เพื่อสิ่งที่ฉันเชื่อมั่น" } },
        { id: 24, type: 8, text: { en: "I have a strong protective instinct for the people I care about.", th: "ฉันมีสัญชาตญาณในการปกป้องที่รุนแรงสำหรับคนที่ฉันห่วงใย" } },

        { id: 25, type: 9, text: { en: "Harmony and avoiding conflict are very important to me.", th: "ความปรองดองและการหลีกเลี่ยงความขัดแย้งมีความสำคัญมากสำหรับฉัน" } },
        { id: 26, type: 9, text: { en: "I often go along with what others want to keep the peace.", th: "ฉันมักจะเออออไปกับสิ่งที่คนอื่นต้องการเพื่อรักษาความสงบสุข" } },
        { id: 27, type: 9, text: { en: "I find it easy to see many different perspectives on an issue.", th: "ฉันรู้สึกว่ามันง่ายที่จะมองเห็นมุมมองที่หลากหลายในปัญหาหนึ่งๆ" } }
    ];

    window.MeowEnneaQuestions = QUESTIONS;
})();