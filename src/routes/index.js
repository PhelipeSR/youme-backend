import { Router } from 'express';
import userRoutes from './user';
import authRoutes from './auth';
// import friendsRoutes from './friends.routes'


const routes = new Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
// routes.use('/friends', friendsRoutes);

export default routes;
