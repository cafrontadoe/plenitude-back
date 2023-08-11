import express, { Application } from 'express';
import bodyParser from 'body-parser';
import contactsRouter from './routes/contact.route';
import paymentsRouter from './routes/payments.route';
import connectDB from './config/database';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.app.use(compression()); // Enable gzip compression, reduce the responses size
    connectDB();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(bodyParser.json({
      verify: function (req: any, res, buf) {
        var url = req.originalUrl;
        if (url.includes('/webhook')) {
          req.rawBody = buf.toString()
        }
      }
    }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.app.use('/api/v1/contacts', contactsRouter);
    this.app.use('/api/v1/payments', paymentsRouter);
  }

  public start(): void {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default new App().start();
