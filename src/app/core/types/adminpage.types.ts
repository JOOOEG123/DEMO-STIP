export type Categories =
  | 'New Contributions'
  | 'Approved Contributions'
  | 'Rejected Contributions';

export type CategoryList = Record<Categories, Contribution[]>;

export type Gender = 'Male' | 'Female' | '男性' | '女性' | '';

export type Ethnicity =
  | 'Han'
  | 'Zhuang'
  | 'Hui'
  | 'Man'
  | 'Uygur'
  | 'Miao'
  | 'Yi'
  | 'Tujia'
  | 'Zang'
  | 'Mongol'
  | 'Dong'
  | 'Bouyei'
  | 'Yao'
  | 'Chosŏn'
  | 'Hani'
  | 'Li'
  | 'Kazak'
  | 'Dai'
  | 'She'
  | 'Lisu'
  | 'Dongxiang'
  | 'Gelao'
  | 'Lahu'
  | 'Wa'
  | 'Sui'
  | 'Naxi'
  | 'Qiang'
  | 'Tu'
  | 'Mulao'
  | 'Xibe'
  | 'Kirgiz'
  | 'Jingpo'
  | 'Daur'
  | 'Salar'
  | 'Blang'
  | 'Maonan'
  | 'Tajik'
  | 'Pumi'
  | 'Achang'
  | 'Nu'
  | 'Ewenki'
  | 'Gin'
  | 'Jino'
  | 'Deang'
  | 'Bonan'
  | 'Russ'
  | 'Yugur'
  | 'Uzbek'
  | 'Monba'
  | 'Oroqen'
  | 'Derung'
  | 'Hezhen'
  | 'Gaoshan'
  | 'Lhoba'
  | 'Tatar'
  | 'Bai'
  | ''

export type Status = 'Deceased' | 'Alive' | '活' | '死者' | 'Unknown' | '';

export type State = 'void' | 'removed';

export type Publish = 'new' | 'approved' | 'rejected'

export type Source = 'original' | 'contributed'

export interface Event {
  startYear: number;
  endYear: number;
  event: string;
}

export interface Memoir {
  memoirTitle: string;
  memoirContent: string;
  memoirAuthor: string;
}

export interface RightistSchema {
  rightistId: string,
  contributorId: string,
  imageId: string[],
  profileImageId: string,
  initial: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  birthYear: number;
  deathYear: number;
  rightistYear: number;
  status: Status,
  ethnicity: Ethnicity,
  job: string,
  detailJob: string,
  workplace: string,
  workplaceCombined: string,
  events: Event[],
  memoirs: Memoir[],
  reference: string,
  description: string,
  lastUpdatedAt: Date,
  source: Source
}

export interface Rightist extends RightistSchema {}

export interface RightistJson {
  [rightistId: string]: RightistSchema;
}

export interface ContributionSchema {
  contributionId: string; // set from the service when creating a new contribution
  contributorId: string; // set from the service when creating a new contribution
  rightist?: Rightist;
  rightistId: string;
  publish: Publish;
  contributedAt: Date; // set from the service when creating a new contribution
  approvedAt: Date; // set from the service when approving a contribution
  rejectedAt: Date; 
  notificationMessage?: string; // set from the service when approving a contribution
}

export interface Contribution extends ContributionSchema {
  state: State;
}

export interface ContributionJson {
  [contributionId: string]: ContributionSchema;
}

export interface OuterContributionJson {
  [contributorId: string]: ContributionJson;
}

export interface ImageSchema {
  imageId: string;
  rightistId: string;
  imagePath?: string;
  isGallery: boolean;
  galleryCategory: string;
  galleryTitle: string;
  galleryDetail: string;
  gallerySource: string;
}

export interface Image extends ImageSchema {
  opacity: number;
}

export interface ImageJson {
  [imageId: string]: ImageSchema;
}
