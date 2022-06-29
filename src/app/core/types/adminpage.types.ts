export type Categories =
  | 'New Contributions'
  | 'Approved Contributions'
  | 'Rejected Contributions';

export type CategoryList = Record<Categories, Contribution[]>;

type Gender = 'Male' | 'Female'
type Nationality = 
  'Han' | 'Zhuang' | 'Hui' | 'Man' | 'Uygur' | 'Miao' | 'Yi' | 'Tujia' | 'Zang' | 'Mongol' |
  'Dong' | 'Bouyei' | 'Yao' | 'Chosŏn' | 'Hani' | 'Li' | 'Kazak' | 'Dai' | 
  'She' | 'Lisu' | 'Dongxiang' | 'Gelao' | 'Lahu' | 'Wa' | 'Sui' |  'Naxi' |'Qiang' | 
  'Tu' |'Mulao' | 'Xibe' | 'Kirgiz' | 'Jingpo' | 'Daur' | 'Salar' | 'Blang' |
  'Maonan' | 'Tajik' | 'Pumi' |'Achang' | 'Nu' | 'Ewenki' | 'Gin' | 'Jino' | 'Deang' | 'Bonan' |
  'Russ' | 'Yugur' | 'Uzbek' | 'Monba' | 'Oroqen' | 'Derung' | 'Hezhen' | 'Gaoshan' | 'Lhoba' | 'Tatar'

type Status = 'Dead' | 'Alive' | 'Unknown'

type State = 'void' | 'removed'

type Publish = 'new' | 'approved' | 'rejected' | 'pending'

interface Event {
  startYear: number,
  endYear: number,
  content: string
}

export interface Victim {
  rightistId: string;
  imagePath: string;
  initial: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthYear: number;
  deathYear: number;
  rightistYear: number;
  status: Status,
  nationality: Nationality
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
  victim: Victim;
  contributedAt: Date;
  state: State,
  limit: number,
}

export interface ContributionSchema {
  contributionId: string;
  contributorId: string;
  victim: Victim;
  contributedAt: string;
  publish: Publish
}

// export interface ContributionJson {
//   [key: string]: ContributionSchema
// }
