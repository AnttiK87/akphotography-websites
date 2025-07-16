import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

import User from '../models/user.js';

// Load environment variables from .env file
dotenv.config();

// configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getRecipients = async () => {
  const admins = await User.findAll({ where: { role: 'admin' } });
  const recipients = admins.map((admin) => admin.email);
  return recipients;
};

// Function to send email notification when a new comment is added
export const sendCommentNotification = async (
  username: string,
  pictureId: number,
  comment: string,
) => {
  const recipients = await getRecipients();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: 'New Comment on Your Picture',
    text: `You received a new comment from ${username} on pictureId ${pictureId}:\n\n${comment}`,
  };

  try {
    if (
      process.env.NODE_ENV != 'development' &&
      process.env.NODE_ENV != 'test'
    ) {
      await transporter.sendMail(mailOptions);
    }
    logger.info('Email notification sent');
<<<<<<< HEAD
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to send email notification:', errorMessage);
=======
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to send email notification: ', error.message);
    } else {
      logger.error('Failed to send email notification');
    }
>>>>>>> origin/main
  }
};

// function to send email notification when a new contact form submission is received
export const sendContactNotification = async (
  name: string,
  email: string,
  message: string,
  contactMe: boolean,
) => {
  const recipients = await getRecipients();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: 'New Contact Form Submission',
    text: `You received a new message from ${name} (${email}):\n\n${message}\n\nReply wanted: ${contactMe ? 'Yes' : 'No'}`,
  };

<<<<<<< HEAD
  try {
    if (
      process.env.NODE_ENV != 'development' &&
      process.env.NODE_ENV != 'test'
    ) {
      await transporter.sendMail(mailOptions);
    }
    logger.info('Email notification sent');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to send email notification:', errorMessage);
=======
  if (process.env.NODE_ENV != 'development' && process.env.NODE_ENV != 'test') {
    await transporter.sendMail(mailOptions);
>>>>>>> origin/main
  }
};

// Function to send an auto-reply email to the user after they submit the contact form
export const sendAutoReply = async (
  name: string,
  email: string,
  contactMe?: boolean,
  language: string = 'fin',
) => {
  const text =
    language === 'fin'
      ? contactMe
        ? `Moi ${name},\n\nMukavaa, että löysit tiesi verkkosivuilleni ja kiitos yhteydenotostasi! Olen vastaanottanut viestisi ja arvostan suuresti kaikkea saamaani palautetta. Pyrin vastaamaan sinulle mahdollisimman pian. \n\nTerveisin,\nAntti Kortelainen\n\nTämä on automaattinen viesti. Ethän vastaa tähän viestiin.`
        : `Moi ${name},\n\nMukavaa, että löysit tiesi verkkosivuilleni ja kiitos yhteydenotostasi! Olen vastaanottanut viestisi ja arvostan suuresti kaikkea saamaani palautetta. \n\nTerveisin,\nAntti Kortelainen\n\nTämä on automaattinen viesti. Ethän vastaa tähän viestiin.`
      : contactMe
        ? `Hi ${name},\n\nHow nice that you find your way to my web site and thank you for reaching out! I have received your message and I appreciate your feedback greatly. I will get back to you as soon as possible.\n\nBest regards,\nAntti Kortelainen\n\nThis is an automated message. Please do not reply to this message.`
        : `Hi ${name},\n\nHow nice that you find your way to my web site and thank you for reaching out! I have received your message and I appreciate your feedback greatly.\n\nBest regards,\nAntti Kortelainen\n\nThis is an automated message. Please do not reply to this message.`;

  const replyOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject:
      language === 'fin' ? 'Kiitos viestistäsi' : 'Thank you for your message!',
    text,
  };
<<<<<<< HEAD
  try {
    if (
      process.env.NODE_ENV != 'development' &&
      process.env.NODE_ENV != 'test'
    ) {
      await transporter.sendMail(replyOptions);
    }
    logger.info('Email notification sent');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to send email notification:', errorMessage);
=======

  if (process.env.NODE_ENV != 'development' && process.env.NODE_ENV != 'test') {
    await transporter.sendMail(replyOptions);
>>>>>>> origin/main
  }
};
