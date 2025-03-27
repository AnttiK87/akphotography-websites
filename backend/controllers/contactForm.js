const nodemailer = require('nodemailer')
const router = require('express').Router()
require('dotenv').config()

router.post('/', async (req, res) => {
  console.log(`Request body: ${JSON.stringify(req.body)}`)
  const { name, email, message, contactMe, language } = req.body

  // Tarkista, että kaikki pakolliset kentät on täytetty
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: 'Name, Email and message fields are required' })
  }

  // Luo nodemailer-kuljetin
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Käytä omaa sähköpostiosoitetta lähettäjänä
      to: 'anttikortelainenphotography@gmail.com',
      subject: 'New Contact Form Submission',
      text: `You received a new message from ${name} (${email}):\n\n${message}\n\nReply wanted: ${contactMe ? 'Yes' : 'No'}`,
    }

    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully to you')

    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Vastaanottaja on lomakkeen täyttäjä
      subject:
        language === 'fin'
          ? 'Kiitos viestistäsi'
          : 'Thank you for your message!',
      text:
        language === 'fin'
          ? contactMe
            ? `Moi ${name},\n\nMukavaa, että löysit tiesi verkkosivuilleni ja kiitos yhteydenotostasi! Olen vastaanottanut viestisi ja arvostan suuresti kaikkea saamaani palautetta. Pyrin vastaamaan sinulle mahdollisimman pian. \n\nTerveisin,\nAntti Kortelainen\n\nTämä on automaattinen viesti. Ethän vastaa tähän viestiin.`
            : `Moi ${name},\n\nMukavaa, että löysit tiesi verkkosivuilleni ja kiitos yhteydenotostasi! Olen vastaanottanut viestisi ja arvostan suuresti kaikkea saamaani palautetta. \n\nTerveisin,\nAntti Kortelainen\n\nTämä on automaattinen viesti. Ethän vastaa tähän viestiin.`
          : contactMe
            ? `Hi ${name},\n\nHow nice that you find your way to my web site and thank you for reaching out! I have received your message and I appreciate your feedback greatly. I will get back to you as soon as possible.\n\nBest regards,\nAntti Kortelainen\n\nThis is an automated message. Please do not reply to this message.`
            : `Hi ${name},\n\nHow nice that you find your way to my web site and thank you for reaching out! I have received your message and I appreciate your feedback greatly.\n\nBest regards,\nAntti Kortelainen\n\nThis is an automated message. Please do not reply to this message.`,
    }

    await transporter.sendMail(autoReplyOptions)
    console.log('Auto-reply sent successfully')

    res.json({ message: 'Email sent successfully!' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

module.exports = router
