import { mockBook } from '../mocks/mocks';
import { BookModel } from './books.model';
import { BooksRepository } from './books.repository';

jest.mock('./books.model');

describe('Given the repository BooksRepository', () => {
  describe('When we instantiate it without errors', () => {
    let repository: BooksRepository;
    beforeEach(() => {
      repository = new BooksRepository();
    });

    test('Then, method getAll should be called return data', async () => {
      const mockExec = jest
        .fn()
        .mockReturnValueOnce([{ author: 'Luffy', id: '001' }]);

      BookModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      await repository.getAll();
      expect(mockExec).toHaveBeenCalled();
    });

    test('Then, method getById should be called and return unique data', async () => {
      const mockExec = jest.fn().mockReturnValueOnce(mockBook);

      BookModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      const result = await repository.getById(mockBook.id);
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });

    test('Then, method create should be called and return data', async () => {
      BookModel.create = jest.fn().mockReturnValue(mockBook);
      await repository.create(mockBook);
      expect(BookModel.create).toHaveBeenCalledWith(mockBook);
    });

    test('Then, method update should be called and return new data', async () => {
      const mockExec = jest
        .fn()
        .mockReturnValueOnce({ title: 'Test in jest', id: '001' });

      BookModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      await repository.update(mockBook.id, mockBook);
      expect(mockExec).toHaveBeenCalled();
    });
    test('Then method delete should return any data', async () => {
      BookModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockBook),
      });

      const result = await repository.delete(mockBook.id);

      expect(result).toEqual(undefined);
      expect(BookModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then, method search should be called and return data', async () => {
      const mockExec = jest.fn().mockReturnValueOnce([mockBook]);

      BookModel.find = jest.fn().mockReturnValue({ exec: mockExec });
      await repository.search('title', 'test');
      expect(mockExec).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with errors', () => {
    let repository: BooksRepository;
    beforeEach(() => {
      repository = new BooksRepository();
    });
    test('Then, method getById should return an error', async () => {
      BookModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(null) }),
      });
      expect(repository.getById('01')).rejects.toThrow();
    });

    test('Then, method update should return an error', async () => {
      BookModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(null) }),
      });
      expect(repository.update('01', {})).rejects.toThrow();
    });

    test('Then, method delete should return an error', async () => {
      BookModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      expect(repository.delete('')).rejects.toThrow();
    });

    test('Then, method search should return an error', async () => {
      (BookModel.findOne = jest.fn().mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      })),
        expect(repository.search('title', 'test')).rejects.toThrow();
    });
  });
});
