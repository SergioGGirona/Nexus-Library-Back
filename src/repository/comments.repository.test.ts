import { mockComment, mockUser } from '../mocks/mocks';
import { CommentModel } from './comments.model';
import { CommentsRepository } from './comments.repository';

jest.mock('./comments.model');

describe('Given the repository CommentsRepository', () => {
  describe('When we instantiate it without errors', () => {
    let repository: CommentsRepository;
    beforeEach(() => {
      repository = new CommentsRepository();
    });

    test('Then, method getAll should be called return data', async () => {
      const mockExec = jest
        .fn()
        .mockReturnValueOnce([{ user: 'Luffy', id: '01' }]);

      CommentModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      await repository.getAll();
      expect(mockExec).toHaveBeenCalled();
    });

    test('Then, method getById should be called and return unique data', async () => {
      const mockExec = jest.fn().mockReturnValueOnce(mockUser);

      CommentModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      const result = await repository.getById(mockUser.id);
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then, method create should be called and return data', async () => {
      CommentModel.create = jest.fn().mockReturnValue(mockComment);
      await repository.create(mockComment);
      expect(CommentModel.create).toHaveBeenCalledWith(mockComment);
    });

    test('Then, method update should be called and return new data', async () => {
      const mockExec = jest
        .fn()
        .mockReturnValueOnce({ user: 'Zoro', id: '0002' });

      CommentModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      await repository.update(mockComment.id, mockComment);
      expect(mockExec).toHaveBeenCalled();
    });
    test('Then, method delete should be called', async () => {
      const mockExec = jest
        .fn()
        .mockReturnValueOnce({ user: 'Luffy', id: '0001' });
      CommentModel.findByIdAndDelete = jest
        .fn()
        .mockReturnValue({ exec: mockExec });

      await repository.delete(mockComment.id);
      expect(mockExec).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with errors', () => {
    let repository: CommentsRepository;
    beforeEach(() => {
      repository = new CommentsRepository();
    });
    test('Then, method getById should return an error', async () => {
      CommentModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(null) }),
      });
      expect(repository.getById('0001')).rejects.toThrow();
    });

    test('Then, method update should return an error', async () => {
      CommentModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(null) }),
      });
      expect(repository.update('0001', {})).rejects.toThrow();
    });

    test('Then, method delete should return an error', async () => {
      (CommentModel.findByIdAndDelete = jest
        .fn()
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(null) })),
        expect(repository.delete('01')).rejects.toThrow();
    });
  });
});
