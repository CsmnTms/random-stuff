import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import { catchAsync } from '../utils/catchAsync.js';

const userRouter = Router();

userRouter.route('/signup')
  .post(catchAsync(authController.signUp));

userRouter.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter.route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

export default userRouter;