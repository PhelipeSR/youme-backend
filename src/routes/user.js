import { Router } from 'express';
import UserController from '../app/controllers/UserController';
import authMiddleware from '../app/middlewares/auth';


const userRoutes = new Router();

userRoutes.get('/', authMiddleware, UserController.index);
userRoutes.post('/', UserController.store);
userRoutes.put('/:id', authMiddleware, UserController.update);
userRoutes.delete('/:id', authMiddleware, UserController.delete);

export default userRoutes;
