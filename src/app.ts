import express, { Application } from 'express';
import bodyParser from 'body-parser';
import contactsRouter from './routes/contact.route';
import paymentsRouter from './routes/payments.route';
import connectDB from './config/database';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import loginRouter from './routes/login.route';
import { protectedMiddleware } from './controllers/login.controller';
import { gobalErrorController } from './controllers/error.controller';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import webhookRouter from './routes/webhook.route';



dotenv.config();

class App {
  private app: Application;

  constructor() {
    this.app = express();
    // set security headers
    this.app.use(helmet());
    const corsOptions = {
      origin: 'https://plenitude-sitever.vercel.app', // Replace with your Angular app's URL
      credentials: true, // Enable cookie sharing
    };
    this.app.use(cors(corsOptions))
    // this.app.use(express.json({ limit: '10kb' }));
    // this.app.use(cookieParser())
    // improve performance
    this.app.use(compression()); // Enable gzi  p compression, reduce the responses size
    // Data sanitization against NoSQL query injection
    // this.app.use(ExpressMongoSanitize());
    // Middleware to sanitize user input to prevent XSS attacks 
    // this.app.use((req, res, next) => {
    //   if (req.body) {
    //     // Sanitize request body
    //     req.body = sanitizeObject(req.body);
    //   }
    // next();
    // });
    // http prevent parameter polution
    // this.app.use(hpp());
    // test middleware
    // this.app.use((req: any, res, next) => {
    //   req.requestTime = new Date().toISOString();
    //   console.log(req.cookies);
    //   next();
    // });
    connectDB();
    this.config();
    this.routes();

   
  }

  private config(): void {
    console.log('config');
    this.app.use(bodyParser.json({
      verify: function (req: any, res, buf) {
        var url = req.originalUrl;
        console.log('rls',url);
        if (url.includes('/webhook')) {
          console.log('buf.toString()', buf.toString());
          req.rawBody = buf.toString();
        }
      }
    }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(gobalErrorController); 
  }

  private routes(): void {
    this.app.use('/api/v1/contacts', protectedMiddleware, contactsRouter);
    this.app.use('/api/v1/payments', protectedMiddleware,  paymentsRouter);
    this.app.use('/api/v1/webhook',  webhookRouter);
    this.app.use('/api/v1/login', loginRouter);
    // this.app.use('/', (req, res) => { res.status(200).send() }); // aws health
  
    
  }

  public start(): void {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

// Sanitize an object recursively
function sanitizeObject(obj: any): any {
  const sanitizedObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        sanitizedObj[key] = sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        // Use xss to sanitize the string
        sanitizedObj[key] = xss(obj[key]);
      } else {
        sanitizedObj[key] = obj[key];
      }
    }
  }
  return sanitizedObj;
}

export default new App().start();
