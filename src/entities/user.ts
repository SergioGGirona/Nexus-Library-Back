import { WithId } from '../types/id.js';
import { ImageData } from '../types/imageData.js';
import { Book } from './book.js';

export type UserLogin = {
  email: string;
  password: string;
};
export type UserNoId = UserLogin & {
  userName: string;
  userSurnames: string;
  isAdult: boolean;
  avatar: ImageData;
  booksReaded: Book[];
  booksToRead: Book[];
};

export type User = UserNoId & WithId;
