import { WithId } from '../types/id.js';
import { Comment } from './comment.js';
import { User } from './user.js';

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
  comments: Comment[];
};
