// https://en.wikipedia.org/wiki/List_of_ethnic_groups_in_China

const ETHNIC_GROUP_CONSTANTS = {
  en: [
    'Zhuang',
    'Hui',
    'Han',
    'Manchu',
    'Uyghur',
    'Miao',
    'Yi',
    'Tujia',
    'Tibetan',
    'Mongol',
    'Dong',
    'Bouyei',
    'Yao',
    'Bai',
    'Joseonjok',
    'Hani',
    'Li',
    'Kazakh',
    'Dai',
    'She',
    'Lisu',
    'Dongxiang',
    'Gelao',
    'Lahu',
    'Wa',
    'Sui',
    'Nakhi',
    'Qiang',
    'Tu',
    'Mulao',
    'Xibe',
    'Kyrgyz',
    'Jingpo',
    'Daur',
    'Salar',
    'Blang',
    'Maonan',
    'Tajik',
    'Pumi',
    'Achang',
    'Nu',
    'Evenki',
    'Vietnamese',
    'Jino',
    'De ang',
    'Bonan',
    'Russian',
    'Yugur',
    'Uzbek',
    'Monba',
    'Oroqen',
    'Derung',
    'Hezhen',
    'Gaoshan',
    'Lhoba',
    'Tatars',
    'Undistinguished',
    'Naturalized Citizen',
  ],
  en_cn: {
    'Han':'汉族',
    'Zhuang':'壮族'
  },
  cn: [
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
    '未知',
  ],
};

const LIST_OF_GENDER = {
  en: ['Male', 'Female'],
  cn: ['男性', '女性'],
};

const LIST_OF_STATUS = {
  en: ['Alive', 'Deceased', 'Unknown'],
  cn: ['活', '死者', '未知'],
};

const ObJ_OF_STATUS = {
  en: {
    'Alive': '活',
    'Deceased': '死者',
    'Unknown': '未知',
  },
  cn: {
    '活': 'Alive',
    '死者': 'Deceased',
    '未知': 'Unknown',
  }
}

const ObJ_OF_GENDERS = {
  en: {
    'Male': '男性',
    'Female': '女性',
  },
  cn: {
    '男性': 'Male',
    '女性': 'Female'
  }
}

const LIST_OF_IMAGE_CATEGORIES = {
  en: ['People', 'Media', 'Camps', 'Other'],
  cn: ['人们', '媒体', '营地', '其他'],
};

const LIST_OF_JOB = [
  'Deputy',
  'Director',
  'Professor',
  'Worker',
  'Actress',
  'Agent',
  'Assistant',
  'Editor-in-Chief',
  'Assistant Lieutenant',
  'Assistant Professor',
  'Associate Professor',
  'Cadre',
  'Chairman',
  'Chief',
  'Chief Engineer',
  'Christian Priest',
  'Clerk',
  'Deputy Director',
  'Deputy Secretary',
  'Deputy Secretary General',
];

export {
  ETHNIC_GROUP_CONSTANTS,
  LIST_OF_JOB,
  LIST_OF_GENDER,
  LIST_OF_STATUS,
  LIST_OF_IMAGE_CATEGORIES,
  ObJ_OF_STATUS,
  ObJ_OF_GENDERS
};
