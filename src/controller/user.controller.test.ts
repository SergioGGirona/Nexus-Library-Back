import { NextFunction, Request, Response } from 'express';
import { mockUser } from '../mocks/mocks';
import { UsersRepository } from '../repository/users.repository';
import { Auth } from '../services/auth';
import { CloudinaryService } from '../services/media.files';
import { UserController } from './user.controller';

jest.mock('../services/auth.js');

describe('Given the class UserController', () => {
  describe('When we intantiate it without errors', () => {
    let mockRepository: UsersRepository;
    let userController: UserController;
    beforeEach(() => {
      mockRepository = {
        getAll: jest.fn().mockResolvedValue([mockUser]),
        getById: jest.fn().mockResolvedValue(mockUser),
        create: jest.fn().mockResolvedValue(mockUser),
        search: jest.fn().mockResolvedValue(mockUser),
        register: jest.fn(),
        delete: jest.fn(),
      } as unknown as UsersRepository;
      userController = new UserController(mockRepository);
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
      json: jest.fn().mockResolvedValue(mockUser),
      status: jest.fn(),
    } as unknown as Response;
    const mockNextFunction = jest.fn() as NextFunction;

    test('Then, it should call getAll method from father and return data', async () => {
      await userController.getAll(mockRequest, mockResponse, mockNextFunction);
      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([mockUser]);
    });

    test('Then, it should call getById method from father and return data', async () => {
      await userController.getById(mockRequest, mockResponse, mockNextFunction);
      expect(mockRepository.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    test('Then, it should call login method and return data', async () => {
      Auth.compare = jest.fn().mockResolvedValueOnce(true);
      Auth.signToken = jest.fn().mockResolvedValueOnce('token');

      await userController.login(mockRequest, mockResponse, mockNextFunction);
      expect(mockRepository.search).toHaveBeenCalledWith({
        key: 'email',
        value: 'luffy@nexus.com',
      });
    });

    test('Then, login method with wrong password should catch error', async () => {
      Auth.compare = jest.fn().mockResolvedValueOnce(false);
      await userController.login(mockRequest, mockResponse, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    test('Then, it should call register method and return data', async () => {
      Auth.encrypt = jest.fn().mockResolvedValueOnce('NexusUser23');
      const mockReq = {
        body: mockUser,
        file: { filename: 'filename', destination: 'destination' },
      } as unknown as Request;

      CloudinaryService.prototype.uploadPhoto = jest
        .fn()
        .mockResolvedValue(mockReq.body.avatar);
      await userController.register(mockReq, mockResponse, mockNextFunction);

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Then, it should call delete method', async () => {
      await userController.delete(mockRequest, mockResponse, mockNextFunction);
      expect(mockRepository.delete).toHaveBeenCalled();
    });
  });
  describe('When we instantiate it with errors', () => {
    let mockErrorRepository: UsersRepository;
    let userController: UserController;
    beforeEach(() => {
      mockErrorRepository = {
        getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
        getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
        create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
        search: jest.fn().mockResolvedValueOnce(false),
        suscribe: jest.fn().mockRejectedValueOnce(new Error('Suscribe Error')),
      } as unknown as UsersRepository;
      userController = new UserController(mockErrorRepository);
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
      await userController.getAll(mockRequest, mockResponse, mockNextFunction);
      expect(mockErrorRepository.getAll).toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(new Error('GetAll Error'));
    });

    test('Then, nextFunction should call error in getById method', async () => {
      await userController.getById(mockRequest, mockResponse, mockNextFunction);
      expect(mockErrorRepository.getById).toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(new Error('GetById Error'));
    });

    test('Then, nextFunction should call error in register method', async () => {
      await userController.register(
        mockRequest,
        mockResponse,
        mockNextFunction
      );

      expect(mockNextFunction).toHaveBeenCalled();
    });

    test('Then, nextFunction should call error in login method', async () => {
      await userController.login(mockRequest, mockResponse, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    test('Then, nextFunction should call error in delete method', async () => {
      const errorRequest = {} as unknown as Request;
      await userController.delete(errorRequest, mockResponse, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });

  describe('when we instantiate it with error in search repository', () => {
    let mockRepo: UsersRepository;
    let userController: UserController;
    beforeEach(() => {
      mockRepo = {} as unknown as UsersRepository;
      userController = new UserController(mockRepo);
    });

    const mockRequest = {
      body: { email: 'Luffy', password: '1234' },
    } as unknown as Request;
    const responseMock = {} as unknown as Response;
    const nextMocking = jest.fn() as NextFunction;

    test('then we should login with error and catch the error', async () => {
      await userController.login(mockRequest, responseMock, nextMocking);
      expect(nextMocking).toHaveBeenCalled();
    });
  });
});
