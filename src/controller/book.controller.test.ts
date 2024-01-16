import { NextFunction, Request, Response } from 'express';
import { mockBook } from '../mocks/mocks';
import { BooksRepository } from '../repository/books.repository';
import { UsersRepository } from '../repository/users.repository';
import { BookController } from './book.controller';

jest.mock('../services/auth.js');
jest.mock('./user.controller.js');

describe('Given the class BookController', () => {
  describe('When we intantiate it without errors', () => {
    let mockRepository: BooksRepository;
    let bookController: BookController;
    let userRepo: UsersRepository;
    beforeEach(() => {
      mockRepository = {
        getAll: jest.fn().mockResolvedValueOnce([mockBook]),
        getById: jest.fn().mockResolvedValueOnce(mockBook),
        create: jest.fn().mockResolvedValueOnce(mockBook),
        update: jest.fn().mockResolvedValueOnce(mockBook),
        delete: jest.fn(),
      } as unknown as BooksRepository;
      bookController = new BookController(mockRepository);
      userRepo = new UsersRepository();
    });

    const mockRequest = {
      params: { id: '0001' },
      body: {
        title: 'Nexus',
        id: '0001',
        validatedId: '0001',
      },
    } as unknown as Request;

    const mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;

    const mockNextFunction = jest.fn() as NextFunction;

    test('Then, it should call getAll method from father and return data', async () => {
      await bookController.getAll(mockRequest, mockResponse, mockNextFunction);
      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([mockBook]);
    });

    test('Then, it should call getById method from father and return data', async () => {
      await bookController.getById(mockRequest, mockResponse, mockNextFunction);
      expect(mockRepository.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });

    test.only('Then, it should call delete method', async () => {
      const user = await userRepo.getById(mockRequest.body.validatedId);

      await bookController.delete(mockRequest, mockResponse, mockNextFunction);
      expect(mockRepository.delete).toHaveBeenCalled();
    });
  });
  describe('When we instantiate it with errors', () => {
    let mockErrorRepository: BooksRepository;
    let bookController: BookController;
    beforeEach(() => {
      mockErrorRepository = {
        getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
        getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
        create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
      } as unknown as BooksRepository;
      bookController = new BookController(mockErrorRepository);
    });

    const mockRequest = {
      params: { id: '01' },
      body: {
        email: 'luffy@nexus.com',
        userName: 'Luffy',
        password: 'NexusUser23',
      },
    } as unknown as Request;

    const mockResponse = {
      json: jest.fn(),
    } as unknown as Response;
    const mockNextFunction = jest.fn() as NextFunction;

    test('Then, nextFunction should call error in getAll method', async () => {
      await bookController.getAll(mockRequest, mockResponse, mockNextFunction);
      expect(mockErrorRepository.getAll).toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(new Error('GetAll Error'));
    });

    test('Then, nextFunction should call error in getById method', async () => {
      await bookController.getById(mockRequest, mockResponse, mockNextFunction);
      expect(mockErrorRepository.getById).toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(new Error('GetById Error'));
    });

    test('Then, nextFunction should call error in delete method', async () => {
      const errorRequest = {} as unknown as Request;
      await bookController.delete(errorRequest, mockResponse, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });
});
