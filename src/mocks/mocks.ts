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
