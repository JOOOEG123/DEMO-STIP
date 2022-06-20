export type Categories =
  | 'New Contributions'
  | 'Approved Contributions'
  | 'Rejected Contributions';

export type CategoryList = Record<Categories, Contribution[]>;

export interface Contribution {
  id: string;
  imgSrc: string;
  surname: string;
  occupation: string;
  ethnicGroup: string;
  gender: string;
  content: string;
  date: Date;
  state: string;
}
