import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema({
  stripe_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  date_transaction: {
    type: Date,
    default: new Date()
  },
  currency: {
    type: String
  },
  status: {
    type: String,
    enum: ['completed', 'failed', 'pending', 'expired'],
    default: 'pending'
  }
});

const Payment = model('Payments', PaymentSchema);

export default Payment;
