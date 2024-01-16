import { Router as createRouter } from 'express';
import { UserController } from '../controller/user.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { UsersRepository } from '../repository/users.repository.js';

const repository = new UsersRepository();
const userController = new UserController(repository);
const filesInterceptor = new FilesInterceptor();
export const userRouter = createRouter();
const authInterceptor = new AuthInterceptor();

userRouter.get('/', userController.getAll.bind(userController));
userRouter.get('/:id', userController.getById.bind(userController));

userRouter.post(
  '/register',
  filesInterceptor.singleFileStore('avatar').bind(userController),
  userController.register.bind(userController),
  (req, res, _next) => {
    res.json(req.body);
  }
);

userRouter.patch('/login', userController.login.bind(userController));
userRouter.patch(
  '/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  userController.update.bind(userController)
);

userRouter.delete(
  '/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  userController.delete.bind(userController)
);
