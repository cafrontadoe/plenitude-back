import { Router } from 'express';
import LoginController from '../controllers/login.controller';

const loginRouter = Router();
const controller = new LoginController();

loginRouter.post('/', controller.login);

export default loginRouter;
