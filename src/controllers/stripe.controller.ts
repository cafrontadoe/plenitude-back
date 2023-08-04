import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();


class StripeController {


  public async createPaymentIntent(req: Request, res: Response): Promise<void> {
    // try {
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: req.body.amount,
    //     currency: 'usd',
    //   });
      res.status(200).json({ response: 'great!!' });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: 'An error occurred' });
    // }
  }



}

export default StripeController;
