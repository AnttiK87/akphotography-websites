import express, { Request, Response } from 'express';

import { ContactFormInput } from '../types/types.js';

import { validateContactFormInput } from '../middleware/validateInput.js';

import {
  sendContactNotification,
  sendAutoReply,
} from '../services/emailService.js';

const router = express.Router();

// POST /api/contact
// route for sending emails with content from the contact form
// Middlewares used:
// - validateContactFormInput: validates body input
router.post(
  '/',
  validateContactFormInput,
  async (req: Request<object, object, ContactFormInput>, res: Response) => {
    const { name, email, message, contactMe, language } = req.body;

    // Sending email is handled at the file `utils/emailService.js`
    await sendContactNotification(name, email, message, contactMe);
    await sendAutoReply(name, email, contactMe, language);

    res.json({
      messageEn: 'Message sent successfully!',
      messageFi: 'Viesti lähetetty onnistuneesti!',
    });
  },
);

export default router;
