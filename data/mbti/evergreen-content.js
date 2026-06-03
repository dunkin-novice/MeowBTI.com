// MeowBTI MBTI evergreen content registry.
// Add future content here before creating the matching /mbti/{slug}/ route.
(function () {
    const CONTENT_TYPES = {
        personality: {
            label: { en: 'Personality page', th: 'หน้าบุคลิกภาพ' },
            sections: ['overview', 'strengths', 'challenges', 'relationships', 'growth', 'faq'],
            exampleSlugs: ['intj', 'enfp']
        },
        compatibility: {
            label: { en: 'Compatibility page', th: 'หน้าความเข้ากัน' },
            sections: ['overview', 'whyAttract', 'conflicts', 'communication', 'longTerm', 'faq'],
            exampleSlugs: ['intj-enfp']
        },
        career: {
            label: { en: 'Career page', th: 'หน้าอาชีพ' },
            sections: ['overview', 'workStyle', 'bestFits', 'watchouts', 'growth', 'faq'],
            exampleSlugs: ['intj-careers']
        },
        friendship: {
            label: { en: 'Friendship page', th: 'หน้ามิตรภาพ' },
            sections: ['overview', 'friendshipStyle', 'strengths', 'friction', 'careTips', 'faq'],
            exampleSlugs: ['infj-friendship']
        },
        growth: {
            label: { en: 'Growth page', th: 'หน้าการเติบโต' },
            sections: ['overview', 'pattern', 'whyItHappens', 'gentlePractice', 'relatedTypes', 'faq'],
            exampleSlugs: ['why-infj-disappear']
        }
    };

    const PILOT_PAGES = {
        intj: { type: 'personality', title: 'INTJ Personality Guide', related: ['enfp', 'intj-enfp'], route: '/mbti/intj/' },
        enfp: { type: 'personality', title: 'ENFP Personality Guide', related: ['intj', 'intj-enfp'], route: '/mbti/enfp/' },
        'intj-enfp': { type: 'compatibility', title: 'INTJ and ENFP Compatibility', related: ['intj', 'enfp'], route: '/mbti/intj-enfp/' }
    };

    window.MeowMBTIEvergreen = { CONTENT_TYPES, PILOT_PAGES };
})();
