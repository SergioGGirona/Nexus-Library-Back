import { User } from '../entities/user';

export const mockUser = {
  email: 'luffy@test.com',
  password: 'NexusUser23',
  userName: 'Luffy',
  isAdult: true,
  booksReaded: [],
  booksToRead: [],
  id: '01',
} as unknown as User;
