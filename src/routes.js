import Router from 'express';

import multer from 'multer';
import multerConfig from './config/multer';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import ViewOrderController from './app/controllers/ViewOrderController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/order', OrderController.index);
routes.post('/order', OrderController.store);
routes.put('/order/:id', OrderController.update);
routes.delete('/order/:id', OrderController.delete);

routes.get('/deliveryman/:id/deliveries', ViewOrderController.index);
routes.get('/deliveryman/:id/delivered', ViewOrderController.indexDelivered);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
