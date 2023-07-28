import { Router } from 'express';
import ContactsController from '../controllers/contact.controller';

const contactsRouter = Router();
const controller = new ContactsController();

contactsRouter.get('/', controller.getAllContacts);
contactsRouter.get('/test', controller.getAllContacts);
// contactsRouter.post('/', controller.createContact);

export default contactsRouter;
