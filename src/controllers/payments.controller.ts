import { Request, Response } from 'express';
import Stripe from 'stripe';
import PaymentModel from '../models/payment.model';
import { PaymentStatus } from '../models/payment-status.enum';
const stripe = new Stripe('sk_test_51NZ2JSHKFQRDDHcmpDv7iWS9mUvse3Hcbb2bDrMJSMOrOyo5xCNiZtV7tK17UiWdOwIzoQwfHhhTgwHqtnOyKWP500SKrCQk8Z', {
  apiVersion: '2022-11-15'
});
const endpointSecret = "whsec_gp73lZRMwUHJIlFeeg2N7R99CBonEdS8";



class PaymentsController {

  public async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1NZ2jQHKFQRDDHcmwFVgRov4',
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: 'http://localhost:4200/success_payment',
        cancel_url: 'http://localhost:4200/cancel_payment'
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

    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        break;
      case 'checkout.session.async_payment_succeeded':
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        console.log(checkoutSessionAsyncPaymentSucceeded);
        break;
      case 'checkout.session.completed':
        const data = event.data.object as any;
        //console.log(checkoutSessionCompleted);
        //PaymentsController.createPayment(PaymentStatus.COMPLETED, checkoutSessionCompleted);
        // Then define and call a function to handle the event checkout.session.completed
        console.log(data);
        await PaymentModel.create({
          stripe_id: data.id,
          name: data.customer_details.name,
          email: data.customer_details.email,
          amount: data.amount_total,
          status: PaymentStatus.COMPLETED
        });
        break;
      case 'checkout.session.expired':
        const checkoutSessionExpired = event.data.object;
        // Then define and call a function to handle the event checkout.session.expired
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