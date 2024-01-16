import { Book } from '../entities/book.js';
import { HttpError } from '../types/error.js';
import { BookModel } from './books.model.js';
import { Repository } from './repository.js';

export class BooksRepository implements Repository<Book> {
  async getAll(): Promise<Book[]> {
    const data = await BookModel.find()
      .populate('readers', { email: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<Book> {
    const data = await BookModel.findById(id)
      .populate('readers', { email: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'Error searching the book.');
    return data;
  }

  async create(newBook: Omit<Book, 'id'>): Promise<Book> {
    const data = await BookModel.create(newBook);
    return data;
  }

  async update(id: string, newData: Partial<Book>): Promise<Book> {
    const data = await BookModel.findByIdAndUpdate(id, newData, { new: true })
      .populate('readers', { email: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'Error searching the book.', {
        cause: 'Trying update method',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await BookModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'Error searching the book.', {
        cause: 'Trying delete method',
      });
  }

  async search(key: string, value: unknown): Promise<Book[]> {
    const data = await BookModel.find({ [key]: value }).exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'Error searching the book.');
    return data;
  }
}
