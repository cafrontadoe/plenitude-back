import { Router, raw } from 'express';

import WebhookController from '../controllers/webhook.controller';

const webhookRouter = Router();
const controller = new WebhookController();

webhookRouter.post('/webhook', raw({ type: 'application/json' }), controller.webhook);

export default webhookRouter;
