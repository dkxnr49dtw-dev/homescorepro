const express = require('express');
const { body } = require('express-validator');
const { ContactSubmission } = require('../database/models');
const { contactLimiter, handleValidationErrors } = require('../middleware/security');
const { sendContactNotification, sendContactAutoReply } = require('../services/emailService');

const router = express.Router();

// Submit contact form
router.post('/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('subject').optional().trim().escape(),
    body('message').trim().notEmpty().withMessage('Message is required').escape()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Save submission to database
      const submission = await ContactSubmission.create({
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        status: 'new'
      });

      // Send notification email to admin
      await sendContactNotification(name, email, subject, message);

      // Send auto-reply to user
      await sendContactAutoReply(email, name);

      res.json({ 
        message: 'Thank you for your message. We will get back to you soon.',
        submissionId: submission.id
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Failed to submit contact form' });
    }
  }
);

module.exports = router;


