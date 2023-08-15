
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import Stripe from 'stripe';
import PaymentModel from '../models/payment.model';
import { PaymentStatus } from '../models/payment-status.enum';
const stripe = new Stripe(process.env.STRIPE_KEY || '', {
  apiVersion: '2022-11-15'
});
const endpointSecret = process.env.WEBHOOK_SECRET || '';
const urlSuccess = process.env.URL_SUCCESS || 'http://localhost:4200/success_payment';
const urlCancel = process.env.URL_CANCEL || 'http://localhost:4200/cancel_payment';
const stripePriceId = process.env.PRICE_ID || '';

class PaymentsController {

  public async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: stripePriceId,
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: urlSuccess,
        cancel_url: urlCancel
      });

      res.status(200).json({
        url: session.url
      });
    } catch (err) {
      res.status(500).json({
        msg: 'Error trying to create the checkout session',
        error: err
      })
    }
  }

  public async webhook(request: any, response: Response): Promise<void> {
    const sig = request.headers['stripe-signature'] as any;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
    } catch (err: any) {
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const paymentData = event.data.object as any;
    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        await PaymentModel.create({
          stripe_id: paymentData.id,
          name: paymentData.customer_details.name,
          email: paymentData.customer_details.email,
          amount: paymentData.amount_total,
          currency: paymentData.currency,
          status: PaymentStatus.FAILED
        });
        break;
      case 'checkout.session.async_payment_succeeded':
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        console.log(checkoutSessionAsyncPaymentSucceeded);
        break;
      case 'checkout.session.completed':
        //console.log(checkoutSessionCompleted);
        //PaymentsController.createPayment(PaymentStatus.COMPLETED, checkoutSessionCompleted);
        // Then define and call a function to handle the event checkout.session.completed
        await PaymentModel.create({
          stripe_id: paymentData.id,
          name: paymentData.customer_details.name,
          email: paymentData.customer_details.email,
          amount: paymentData.amount_total,
          currency: paymentData.currency,
          status: PaymentStatus.COMPLETED
        });
        break;
      case 'checkout.session.expired':
        await PaymentModel.create({
          stripe_id: paymentData.id,
          name: paymentData.customer_details.name,
          email: paymentData.customer_details.email,
          amount: paymentData.amount_total,
          currency: paymentData.currency,
          status: PaymentStatus.EXPIRED
        });
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
  }

  static async createPayment(status: string, data: any) {
    await PaymentModel.create({
      stripe_id: data.id,
      name: data.name,
      email: data.email,
      amount: data.amount,
      status
    });
  }

}

export default PaymentsController;