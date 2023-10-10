import { Request, Response } from 'express';
import Contact from '../models/contact.model';

class ContactsController {
  public async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
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

  public async createContact(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      console.log('data', data);
      const savedContact = await Contact.create({
        name: data.name,
        message: data.message,
        email: data.email
      });
      res.status(200).json(savedContact);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el contacto' });
    }
  }


}

export default ContactsController;
