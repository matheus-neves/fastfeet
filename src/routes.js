import Router from 'express';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

export default routes;
