import { Request, Response } from 'express';
import Contact from '../models/contact.model';

class ContactsController {
  public async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
      console.log('llega');
      const contacts = await Contact.find();
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getTest(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json("hey");
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }


}

export default ContactsController;
