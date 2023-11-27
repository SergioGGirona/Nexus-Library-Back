import { Book } from '../entities/book';
import { User } from '../entities/user';

export const mockUser = {
  email: 'luffy@nexus.com',
  password: 'NexusUser23',
  userName: 'Luffy',
  isAdult: true,
  booksReaded: [],
  booksToRead: [],
  id: '01',
  avatar: {},
} as unknown as User;

export const mockBook = {
  title: 'Test in jest',
  author: 'Luffy',
  publishHouse: 'Javascript',
  overview: 'Little mock to test',
  mainCategory: 'Educational',
  readers: [],
  id: '001',
} as unknown as Book;
