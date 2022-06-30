export type Categories =
  | 'New Contributions'
  | 'Approved Contributions'
  | 'Rejected Contributions';

export type CategoryList = Record<Categories, Contribution[]>;

type Gender = 'Male' | 'Female'
type Ethnicity = 
  'Han' | 'Zhuang' | 'Hui' | 'Man' | 'Uygur' | 'Miao' | 'Yi' | 'Tujia' | 'Zang' | 'Mongol' |
  'Dong' | 'Bouyei' | 'Yao' | 'Chosŏn' | 'Hani' | 'Li' | 'Kazak' | 'Dai' | 
  'She' | 'Lisu' | 'Dongxiang' | 'Gelao' | 'Lahu' | 'Wa' | 'Sui' |  'Naxi' |'Qiang' | 
  'Tu' |'Mulao' | 'Xibe' | 'Kirgiz' | 'Jingpo' | 'Daur' | 'Salar' | 'Blang' |
  'Maonan' | 'Tajik' | 'Pumi' |'Achang' | 'Nu' | 'Ewenki' | 'Gin' | 'Jino' | 'Deang' | 'Bonan' |
  'Russ' | 'Yugur' | 'Uzbek' | 'Monba' | 'Oroqen' | 'Derung' | 'Hezhen' | 'Gaoshan' | 'Lhoba' | 'Tatar'

export type Status = 'Dead' | 'Alive' | 'Unknown'

export type State = 'void' | 'removed'

export type Publish = 'new' | 'approved' | 'rejected'

interface Event {
  eventId: string,
  startYear: number,
  endYear: number,
  content: string
}

export interface Rightist {
  rightistId: string,
  imagePath: string;
  initial: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthYear: number;
  deathYear: number;
  rightistYear: number;
  status: Status,
  ethnicity: Ethnicity
  publish: string,
  job: string,
  workplace: string,
  events: Event[],
  memoirs: string[],
  reference: string,
  description: string
}
 
export interface Contribution {
  contributionId: string;
  contributorId: string;
  rightist: Rightist;
  contributedAt: Date;
  state: State,
}

export interface ContributionSchema {
  [contributionId: string]: {
    contributorId: string;
    rightist: Rightist;
    contributedAt: string;
    publish: Publish
  }
}

export interface RightistSchema {
  [rightistId: string]: {
    imagePath: string;
    initial: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    birthYear: number;
    deathYear: number;
    rightistYear: number;
    status: Status,
    ethnicity: Ethnicity
    publish: string,
    job: string,
    workplace: string,
    events: Event[],
    memoirs: string[],
    reference: string,
    description: string
  }
}

export interface Image {
  [imageId: string]: {
    imagePath: string,
    rightistId: string,
  }
}

// export interface ContributionJson {
//   [key: string]: ContributionSchema
// }
