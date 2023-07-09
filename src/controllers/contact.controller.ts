import { Request, Response } from 'express';
import Contact from '../models/contact.model';

class ContactsController {
  public async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await Contact.find({}).sort({createdAt: -1})
      res.status(200).json(contacts)
      // const contacts = await Contact.find();
      // res.status(200).json("mileto");
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // public async createContact(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { name, email, phone } = req.body;
  //     const contact = new Contact({ name, email, phone });
  //     await contact.save();
  //     res.status(201).json(contact);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // }
}

export default ContactsController;
