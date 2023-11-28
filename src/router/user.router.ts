import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { AuthInterceptor } from '../middleware/auth.interceptor';
import { FilesInterceptor } from '../middleware/files.interceptor';
import { UsersRepository } from '../repository/users.repository';

const repository = new UsersRepository();
const userController = new UserController(repository);
const filesInterceptor = new FilesInterceptor();
export const userRouter = Router();
const authInterceptor = new AuthInterceptor();

userRouter.get('/', userController.getAll.bind(userController));

userRouter.post(
  '/register',
  filesInterceptor.singleFileStore('avatar').bind(userController),
  userController.register.bind(userController),
  (req, res, _next) => {
    res.json(req.body);
  }
);

userRouter.patch('/login', userController.login.bind(userController));
userRouter.delete(
  '/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  userController.delete.bind(userController)
);
