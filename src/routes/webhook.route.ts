import { Router, raw } from 'express';

import PaymentsController from '../controllers/payments.controller';

const paymentsRouter = Router();
const controller = new PaymentsController();

paymentsRouter.post('/webhook', raw({ type: 'application/json' }), controller.webhook);

export default paymentsRouter;
