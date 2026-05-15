(function() {
    const QUESTIONS = [
        // E / I
        { id: 1, axis: 'EI', text: { en: "You feel energized after spending time with a large group of people.", th: "คุณรู้สึกมีพลังหลังจากได้ใช้เวลากับคนกลุ่มใหญ่" } },
        { id: 2, axis: 'EI', text: { en: "You prefer to think before you speak.", th: "คุณชอบคิดก่อนที่จะพูด" }, reverse: true },
        { id: 3, axis: 'EI', text: { en: "You are often the first one to start a conversation in a group.", th: "คุณมักจะเป็นคนแรกที่เริ่มบทสนทนาในกลุ่ม" } },
        { id: 4, axis: 'EI', text: { en: "You need significant alone time to recharge your battery.", th: "คุณต้องการเวลาอยู่คนเดียวเพื่อชาร์จพลังงาน" }, reverse: true },
        { id: 5, axis: 'EI', text: { en: "You enjoy being at the center of attention.", th: "คุณมีความสุขที่ได้เป็นจุดสนใจ" } },
        { id: 6, axis: 'EI', text: { en: "You prefer working in a quiet, independent space.", th: "คุณชอบทำงานในพื้นที่ที่เงียบสงบและเป็นอิสระ" }, reverse: true },
        { id: 7, axis: 'EI', text: { en: "You find it easy to approach strangers and strike up a chat.", th: "คุณรู้สึกว่าการเข้าหาคนแปลกหน้าและเริ่มคุยเป็นเรื่องง่าย" } },
        { id: 8, axis: 'EI', text: { en: "You usually process your thoughts internally rather than out loud.", th: "คุณมักจะประมวลผลความคิดในใจมากกว่าการพูดออกมา" }, reverse: true },

        // S / N
        { id: 9, axis: 'SN', text: { en: "You focus more on what is happening right now than on future possibilities.", th: "คุณจดจ่อกับสิ่งที่เกิดขึ้นตอนนี้มากกว่าความเป็นไปได้ในอนาคต" }, reverse: true },
        { id: 10, axis: 'SN', text: { en: "You often find yourself daydreaming about 'what if' scenarios.", th: "คุณมักจะพบว่าตัวเองกำลังฝันกลางวันถึงสถานการณ์ 'จะเกิดอะไรขึ้นถ้า...'" } },
        { id: 11, axis: 'SN', text: { en: "You prefer concrete facts and data over abstract theories.", th: "คุณชอบข้อเท็จจริงและข้อมูลที่จับต้องได้มากกว่าทฤษฎีนามธรรม" }, reverse: true },
        { id: 12, axis: 'SN', text: { en: "You are more interested in the 'big picture' than in small details.", th: "คุณสนใจ 'ภาพรวม' มากกว่ารายละเอียดเล็กๆ น้อยๆ" } },
        { id: 13, axis: 'SN', text: { en: "You rely more on your past experiences than on your gut feelings.", th: "คุณพึ่งพาประสบการณ์ในอดีตมากกว่าความรู้สึกจากสัญชาตญาณ" }, reverse: true },
        { id: 14, axis: 'SN', text: { en: "You enjoy exploring complex, metaphorical ideas.", th: "คุณสนุกกับการสำรวจไอเดียที่ซับซ้อนและเชิงเปรียบเทียบ" } },
        { id: 15, axis: 'SN', text: { en: "You like instructions to be clear and practical.", th: "คุณชอบให้คำแนะนำมีความชัดเจนและนำไปใช้ได้จริง" }, reverse: true },
        { id: 16, axis: 'SN', text: { en: "You often notice patterns and connections that others miss.", th: "คุณมักจะสังเกตเห็นรูปแบบและความเชื่อมโยงที่คนอื่นมองข้าม" } },

        // T / F
        { id: 17, axis: 'TF', text: { en: "You prioritize logic and objective truth when making decisions.", th: "คุณให้ความสำคัญกับตรรกะและความจริงที่เป็นกลางเมื่อต้องตัดสินใจ" }, reverse: true },
        { id: 18, axis: 'TF', text: { en: "You are deeply affected by the emotions of those around you.", th: "คุณได้รับอิทธิพลอย่างมากจากอารมณ์ของคนรอบข้าง" } },
        { id: 19, axis: 'TF', text: { en: "You value being direct and honest, even if it might hurt someone's feelings.", th: "คุณเห็นคุณค่าของการตรงไปตรงมาและซื่อสัตย์ แม้ว่ามันอาจจะทำร้ายความรู้สึกใครบางคน" }, reverse: true },
        { id: 20, axis: 'TF', text: { en: "You often prioritize harmony and cooperation over being 'right.'", th: "คุณมักจะให้ความสำคัญกับความปรองดองและความร่วมมือมากกว่าการเป็นฝ่าย 'ถูก'" } },
        { id: 21, axis: 'TF', text: { en: "You believe that 'fairness' means treating everyone exactly the same.", th: "คุณเชื่อว่า 'ความยุติธรรม' คือการปฏิบัติต่อทุกคนเหมือนกันทุกประการ" }, reverse: true },
        { id: 22, axis: 'TF', text: { en: "You tend to follow your heart more than your head.", th: "คุณมีแนวโน้มที่จะทำตามหัวใจมากกว่าเหตุผลในหัว" } },
        { id: 23, axis: 'TF', text: { en: "You are good at staying detached and analytical in high-pressure situations.", th: "คุณเก่งในการวางตัวเป็นกลางและวิเคราะห์ในสถานการณ์ที่กดดัน" }, reverse: true },
        { id: 24, axis: 'TF', text: { en: "You go out of your way to make sure everyone feels included and valued.", th: "คุณพยายามอย่างเต็มที่เพื่อให้แน่ใจว่าทุกคนรู้สึกเป็นส่วนหนึ่งและมีคุณค่า" } },

        // J / P
        { id: 25, axis: 'JP', text: { en: "You prefer to have a detailed plan for your day.", th: "คุณชอบที่จะมีแผนการที่ละเอียดสำหรับวันของคุณ" }, reverse: true },
        { id: 26, axis: 'JP', text: { en: "You enjoy being spontaneous and going with the flow.", th: "คุณสนุกกับการทำตามใจตัวเองในขณะนั้นและปล่อยไปตามสถานการณ์" } },
        { id: 27, axis: 'JP', text: { en: "You feel better once a decision has been made and finalized.", th: "คุณรู้สึกดีขึ้นเมื่อการตัดสินใจสิ้นสุดลงและได้ข้อสรุปแล้ว" }, reverse: true },
        { id: 28, axis: 'JP', text: { en: "You like to keep your options open as long as possible.", th: "คุณชอบเปิดตัวเลือกทิ้งไว้ให้นานที่สุดเท่าที่จะเป็นไปได้" } },
        { id: 29, axis: 'JP', text: { en: "You are often described as organized and disciplined.", th: "คุณมักถูกอธิบายว่าเป็นคนที่มีระเบียบและวินัย" }, reverse: true },
        { id: 30, axis: 'JP', text: { en: "You find it easy to adapt when your plans suddenly change.", th: "คุณรู้สึกว่าการปรับตัวเมื่อแผนเปลี่ยนกะทันหันเป็นเรื่องง่าย" } },
        { id: 31, axis: 'JP', text: { en: "You prefer to finish one task before starting another.", th: "คุณชอบทำงานชิ้นหนึ่งให้เสร็จก่อนที่จะเริ่มงานอื่น" }, reverse: true },
        { id: 32, axis: 'JP', text: { en: "You often work in bursts of energy rather than a steady, planned pace.", th: "คุณมักจะทำงานเป็นช่วงๆ ตามแรงขับเคลื่อนมากกว่าจังหวะที่วางแผนไว้อย่างสม่ำเสมอ" } }
    ];

    window.MeowMBTIQuestions = QUESTIONS;
})();