import { Router, raw } from 'express';

import PaymentsController from '../controllers/payments.controller';

const webhookRouter = Router();
const controller = new PaymentsController();

webhookRouter.post('/webhook', raw({ type: 'application/json' }), controller.webhook);

export default webhookRouter;
