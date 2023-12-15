import express from 'express';
import authRouter from './auth.route';
import configs from '../configs';

const appRoutes = express();
const { path } = configs;

appRoutes.use(path.AUTH_PREFIX, authRouter);

export default appRoutes;