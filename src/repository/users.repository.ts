import { User } from '../entities/user';
import { HttpError } from '../types/error';
import { Repository } from './repository';
import { UserModel } from './users.model';

export class UsersRepository implements Repository<User> {
  async getAll(): Promise<User[]> {
    const data = await UserModel.find()
      .populate('booksReaded', { title: 1 })
      .populate('booksToRead', { title: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('booksReaded', { title: 1 })
      .populate('booksToRead', { title: 1 })
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not found', 'User not found in the system', {
        cause: 'Trying getByID method',
      });
    }
    return data;
  }

  async create(newData: Omit<User, 'id'>): Promise<User> {
    const data = await UserModel.create(newData);
    return data;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, { new: true })
      .populate('booksReaded', { title: 1 })
      .populate('booksToRead', { title: 1 })
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not found', 'User not found in the system', {
        cause: 'Trying update method',
      });
    }
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await UserModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'User not found', {
        cause: 'Trying delete method',
      });
  }

  async search({ key, value }: { key: string; value: unknown }): Promise<User> {
    const data = await UserModel.findOne({ [key]: value }).exec();
    if (!data) {
      throw new HttpError(404, 'Not found', 'User not found', {
        cause: 'Trying login method',
      });
    }
    return data;
  }
}
