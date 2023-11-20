import { WithId } from '../types/id';
import { ImageData } from '../types/imageData';
import { Book } from './book';

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
