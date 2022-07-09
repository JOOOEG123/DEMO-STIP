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
  event: string
}

interface Memoir {
  memoirId: string,
  memoir: string
}

export interface Rightist {
  rightistId: string,
  imagePath: string[];
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
  detailJob: string,
  workplace: string,
  events: Event[],
  memoirs: Memoir[],
  reference: string,
  description: string
}
 
export interface Contribution {
  contributionId: string;
  contributorId: string[];
  rightist: Rightist;
  contributedAt: string;
  publish: Publish;
  lastUpdatedAt: string;
  notificationMessage: string,
}

export interface ContributionJson {
  [contributionId: string]: [contribution: Contribution]
}

export interface RightistJson {
  [rightistId: string]: [rightist: Rightist]
}

export interface ImageSchema {
  imageId: string,
  rightistId: string,
  imagePath: string,
  isGallery: boolean,
  galleryTitle: string,
  galleryCaption: string,
  gallerySource: string
}

export interface ImageJson {
  [imageId: string]: [image: ImageSchema]
}
