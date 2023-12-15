import express from 'express';
import { doLogin, doRegister } from '../controllers/user.controller';
import configs from '../configs';

const userRouter = express.Router();
const { path } = configs;

userRouter.post(path.LOGIN_PREFIX, doLogin);
userRouter.post(path.REGISTER_PREFIX, doRegister);

export default userRouter;