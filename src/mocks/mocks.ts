import { Book } from '../entities/book';
import { Comment } from '../entities/comment';
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
  comments: [],
} as unknown as Book;

export const mockComment = {
  user: mockUser,
  book: mockBook,
  text: 'I liked it',
  date: new Date('2024-01-01'),
  id: '0001',
} as unknown as Comment;
