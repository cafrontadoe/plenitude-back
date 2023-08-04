import { Router } from 'express';
import StripeController from '../controllers/stripe.controller';

const stripeRouter = Router();
const controller = new StripeController();

stripeRouter.post('/', controller.createPaymentIntent);

export default stripeRouter;
