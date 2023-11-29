import { WithId } from '../types/id';
import { User } from './user';

export type Book = WithId & {
  title: string;
  author: string;
  publishYear: number;
  publishHouse: string;
  overview: string;
  mainCategory: string;
  secondCategories: string[];
  readers: User[];
  averageRate: number;
};
