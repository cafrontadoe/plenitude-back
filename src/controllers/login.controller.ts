import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Request, Response } from 'express'; // Import the appropriate types if using Express
import AppError from '../util/AppError';



dotenv.config();


class LoginController {


  public async login(req: Request, res: Response): Promise<void> {
    try {

      let secretKey =  process.env.PRIVATE_KEY;
      let iv = process.env.IV
      const privateMessage = req.body.privateMessage;
      const id = process.env.ID
      if (secretKey === undefined || privateMessage === undefined || iv === undefined) {
        res.status(500).json({ error: 'secret key and/or message not found' });
        return; 
      }
      
      // Decryption
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(privateMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    if (decrypted === id) {
      const jwtSecret = process.env.JWT_SECRET ?? 'secret';
      const expiresIn = process.env.JWT_EXPIRES_IN ?? '30m';
      const token = jwt.sign({id: req.body.id}, jwtSecret, {expiresIn: expiresIn});
 
      res.status(200).json({
        status: 'sucess',
        message: 'Login successful',
        token,
      });
    } else {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS'
      });
    }      
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}

export default LoginController;



export const protectedMiddleware = async(req: any, res: any, next: any) => {
  try {

  let token;
  
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
     token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are no logged to get access', 401));
  }
  const jwtSecret = process.env.JWT_SECRET ?? '';
  const decode = jwt.verify(token, jwtSecret);
  next();
} catch (error) {
  res.status(401).json({ error: error });
}
};
