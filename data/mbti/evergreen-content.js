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

    const EVERGREEN_PAGES = {
        'enfj': { type: 'personality', title: 'ENFJ Personality Guide', related: ['infj', 'enfp', 'esfj'], route: '/mbti/enfj/' },
        'enfp': { type: 'personality', title: 'ENFP Personality Guide', related: ['intj', 'intj-enfp'], route: '/mbti/enfp/' },
        'entj': { type: 'personality', title: 'ENTJ Personality Guide', related: ['intj', 'entp', 'estj'], route: '/mbti/entj/' },
        'entp': { type: 'personality', title: 'ENTP Personality Guide', related: ['intp', 'enfp', 'entj'], route: '/mbti/entp/' },
        'esfj': { type: 'personality', title: 'ESFJ Personality Guide', related: ['isfj', 'enfj', 'estj'], route: '/mbti/esfj/' },
        'esfp': { type: 'personality', title: 'ESFP Personality Guide', related: ['isfp', 'estp', 'enfp'], route: '/mbti/esfp/' },
        'estj': { type: 'personality', title: 'ESTJ Personality Guide', related: ['istj', 'entj', 'esfj'], route: '/mbti/estj/' },
        'estp': { type: 'personality', title: 'ESTP Personality Guide', related: ['istp', 'esfp', 'entp'], route: '/mbti/estp/' },
        'infj': { type: 'personality', title: 'INFJ Personality Guide', related: ['intj', 'infp', 'enfj'], route: '/mbti/infj/' },
        'infp': { type: 'personality', title: 'INFP Personality Guide', related: ['infj', 'enfp', 'isfp'], route: '/mbti/infp/' },
        'intj': { type: 'personality', title: 'INTJ Personality Guide', related: ['enfp', 'intj-enfp'], route: '/mbti/intj/' },
        'intj-enfp': { type: 'compatibility', title: 'INTJ and ENFP Compatibility', related: ['intj', 'enfp'], route: '/mbti/intj-enfp/' },
        'intp': { type: 'personality', title: 'INTP Personality Guide', related: ['intj', 'entp', 'infp'], route: '/mbti/intp/' },
        'isfj': { type: 'personality', title: 'ISFJ Personality Guide', related: ['esfj', 'istj', 'infj'], route: '/mbti/isfj/' },
        'isfp': { type: 'personality', title: 'ISFP Personality Guide', related: ['esfp', 'infp', 'istp'], route: '/mbti/isfp/' },
        'istj': { type: 'personality', title: 'ISTJ Personality Guide', related: ['estj', 'isfj', 'intj'], route: '/mbti/istj/' },
        'istp': { type: 'personality', title: 'ISTP Personality Guide', related: ['estp', 'intp', 'isfp'], route: '/mbti/istp/' }
    };

    window.MeowMBTIEvergreen = { CONTENT_TYPES, EVERGREEN_PAGES, PILOT_PAGES: EVERGREEN_PAGES };
})();
