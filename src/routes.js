import Router from 'express';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

export default routes;
