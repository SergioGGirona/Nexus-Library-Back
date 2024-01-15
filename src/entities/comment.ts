import { WithId } from '../types/id.js';
import { Book } from './book.js';
import { User } from './user.js';

export type CommentNoId = {
  user: User;
  book: Book;
  text: string;
  date: Date;
};
export type Comment = WithId & CommentNoId;
