import { Router } from 'express';
import authMiddleware from '../../../youme/src/middlewares/auth';
import FriendsController from '../../../youme/src/app/controllers/FriendsController';


const friendsRoutes = new Router();

friendsRoutes.get('/', authMiddleware, FriendsController.index);
friendsRoutes.post('/:friendId', authMiddleware, FriendsController.store);
friendsRoutes.put('/:friendId', authMiddleware, FriendsController.update);

export default friendsRoutes;
