import Router from 'express';

import multer from 'multer';
import multerConfig from './config/multer';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import FinishDeliveryController from './app/controllers/FinishDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import ProblemController from './app/controllers/ProblemController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/session', SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);

routes.put(
  '/deliveryman/:deliveryman_id/start-delivery/:order_id',
  StartDeliveryController.update
);

routes.put(
  '/deliveryman/:deliveryman_id/finish-delivery/:order_id',
  FinishDeliveryController.update
);

routes.get('/delivery/:order_id/problems', DeliveryProblemController.index);
routes.post('/delivery/:order_id/problems', DeliveryProblemController.store);

routes.use(authMiddleware);

routes.get('/delivery/problems', ProblemController.index);
routes.put('/problem/:id/cancel-delivery', ProblemController.update);

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

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
