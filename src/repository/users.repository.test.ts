import { mockUser } from '../mocks/mocks';
import { UserModel } from './users.model';
import { UsersRepository } from './users.repository';

jest.mock('./users.model');

describe('Given the repository UsersRepository', () => {
  describe('When we instantiate it without errors', () => {
    let repository: UsersRepository;
    beforeEach(() => {
      repository = new UsersRepository();
    });

    test('Then, method getAll should be called return data', async () => {
      const mockExec = jest
        .fn()
        .mockReturnValueOnce([{ userName: 'Luffy', id: '01' }]);

      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({ exec: mockExec }),
        }),
      });
      await repository.getAll();
      expect(mockExec).toHaveBeenCalled();
    });

    test('Then, method getById should be called and return unique data', async () => {
      const mockExec = jest.fn().mockReturnValueOnce(mockUser);

      UserModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({ exec: mockExec }),
        }),
      });
      const result = await repository.getById(mockUser.id);
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then, method create should be called and return data', async () => {
      UserModel.create = jest.fn().mockReturnValue(mockUser);
      await repository.create(mockUser);
      expect(UserModel.create).toHaveBeenCalledWith(mockUser);
    });

    test('Then, method update should be called and return new data', async () => {
      const mockExec = jest
        .fn()
        .mockReturnValueOnce({ userName: 'Zoro', id: '01' });

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({ exec: mockExec }),
        }),
      });
      await repository.update(mockUser.id, mockUser);
      expect(mockExec).toHaveBeenCalled();
    });
    test('Then, method delete should be called', async () => {
      const mockExec = jest
        .fn()
        .mockReturnValueOnce({ userName: 'Luffy', id: '01' });
      UserModel.findByIdAndDelete = jest
        .fn()
        .mockReturnValue({ exec: mockExec });

      await repository.delete(mockUser.id);
      expect(mockExec).toHaveBeenCalled();
    });

    test('Then, method search should be called and return data', async () => {
      const mockExec = jest.fn().mockReturnValueOnce(mockUser);

      UserModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });
      await repository.search({ key: 'userName', value: 'Luffy' });
      expect(mockExec).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with errors', () => {
    let repository: UsersRepository;
    beforeEach(() => {
      repository = new UsersRepository();
    });
    test('Then, method getById should return an error', async () => {
      UserModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest
            .fn()
            .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(null) }),
        }),
      });
      expect(repository.getById('01')).rejects.toThrow();
    });

    test('Then, method update should return an error', async () => {
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest
            .fn()
            .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(null) }),
        }),
      });
      expect(repository.update('01', {})).rejects.toThrow();
    });

    test('Then, method delete should return an error', async () => {
      (UserModel.findByIdAndDelete = jest
        .fn()
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(null) })),
        expect(repository.delete('01')).rejects.toThrow();
    });

    test('Then, method search should return an error', async () => {
      (UserModel.findOne = jest.fn().mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      })),
        expect(repository.search({ key: '01', value: 'id' })).rejects.toThrow();
    });
  });
});
