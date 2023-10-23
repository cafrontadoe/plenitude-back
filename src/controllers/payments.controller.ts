
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY || '', {
  apiVersion: '2022-11-15'
});

const urlSuccess = process.env.URL_SUCCESS || 'http://localhost:4200/public/success-donation';
const urlCancel = process.env.URL_CANCEL || 'http://localhost:4200/public/donations';
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


}

export default PaymentsController;