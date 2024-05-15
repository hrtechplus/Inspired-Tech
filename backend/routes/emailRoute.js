import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Configure nodemailer with your email service and credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your email address from environment variable
    pass: process.env.PASSWORD // Your email password from environment variable
  }
});

// Endpoint to send an email with a PDF attachment
router.post('/send-pdf', async (req, res) => {
  const { to, subject, text, pdfBase64 } = req.body;

  // Validate request body
  if (!to || !subject || !text || !pdfBase64) {
    return res.status(400).send('Missing required fields: to, subject, text, pdfBase64');
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: 'cart-summary.pdf',
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf'
        }
      ]
    };
  
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return res.status(200).send(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).send(`Error sending email: ${error.message}`);
  }
});

export default router;
