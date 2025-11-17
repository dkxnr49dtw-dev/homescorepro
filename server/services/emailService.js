const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Configure email service
let emailService;

if (process.env.SENDGRID_API_KEY) {
  // Use SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  emailService = 'sendgrid';
} else {
  // Fallback to nodemailer (for development)
  emailService = 'nodemailer';
  console.warn('SENDGRID_API_KEY not set, using nodemailer fallback');
}

// Send email using SendGrid
async function sendEmailSendGrid({ to, subject, html, text }) {
  const msg = {
    to,
    from: {
      email: process.env.EMAIL_FROM || 'noreply@homescorepro.com',
      name: process.env.EMAIL_FROM_NAME || 'HomeScorePro'
    },
    subject,
    text,
    html
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    throw error;
  }
}

// Send email using nodemailer (development fallback)
async function sendEmailNodemailer({ to, subject, html, text }) {
  // For development, just log the email
  console.log('Email (nodemailer):', { to, subject, text });
  return true;
}

// Main send email function
async function sendEmail({ to, subject, html, text }) {
  if (emailService === 'sendgrid') {
    return await sendEmailSendGrid({ to, subject, html, text });
  } else {
    return await sendEmailNodemailer({ to, subject, html, text });
  }
}

// Email verification
async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const html = `
    <h2>Verify Your Email</h2>
    <p>Thank you for signing up for HomeScorePro!</p>
    <p>Please click the link below to verify your email address:</p>
    <p><a href="${verificationUrl}">Verify Email</a></p>
    <p>If the link doesn't work, copy and paste this URL into your browser:</p>
    <p>${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
  `;

  const text = `Verify your email: ${verificationUrl}`;

  return await sendEmail({
    to: email,
    subject: 'Verify Your HomeScorePro Email',
    html,
    text
  });
}

// Password reset email
async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const html = `
    <h2>Reset Your Password</h2>
    <p>You requested a password reset for your HomeScorePro account.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>If the link doesn't work, copy and paste this URL into your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  const text = `Reset your password: ${resetUrl}`;

  return await sendEmail({
    to: email,
    subject: 'Reset Your HomeScorePro Password',
    html,
    text
  });
}

// Welcome email
async function sendWelcomeEmail(email, firstName) {
  const html = `
    <h2>Welcome to HomeScorePro!</h2>
    <p>Hi ${firstName || 'there'},</p>
    <p>Thank you for joining HomeScorePro! We're excited to help you find your perfect property.</p>
    <p>Get started by:</p>
    <ul>
      <li>Exploring suburbs with our A-Score calculator</li>
      <li>Evaluating properties with our B-Score calculator</li>
      <li>Saving your favorite properties</li>
    </ul>
    <p>If you have any questions, feel free to contact us.</p>
    <p>Happy house hunting!</p>
    <p>The HomeScorePro Team</p>
  `;

  const text = `Welcome to HomeScorePro! Get started by exploring suburbs and evaluating properties.`;

  return await sendEmail({
    to: email,
    subject: 'Welcome to HomeScorePro!',
    html,
    text
  });
}

// Subscription confirmation
async function sendSubscriptionConfirmation(email, plan, amount) {
  const html = `
    <h2>Subscription Confirmed</h2>
    <p>Thank you for subscribing to HomeScorePro ${plan}!</p>
    <p>Your subscription details:</p>
    <ul>
      <li>Plan: ${plan}</li>
      <li>Amount: $${amount} AUD</li>
    </ul>
    <p>You now have access to all premium features.</p>
    <p>Thank you for your support!</p>
  `;

  const text = `Your ${plan} subscription has been confirmed. Amount: $${amount} AUD`;

  return await sendEmail({
    to: email,
    subject: 'HomeScorePro Subscription Confirmed',
    html,
    text
  });
}

// Contact form notification (to admin)
async function sendContactNotification(name, email, subject, message) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
  
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  const text = `New contact from ${name} (${email}): ${subject}\n\n${message}`;

  return await sendEmail({
    to: adminEmail,
    subject: `Contact Form: ${subject}`,
    html,
    text
  });
}

// Contact form auto-reply
async function sendContactAutoReply(email, name) {
  const html = `
    <h2>Thank You for Contacting HomeScorePro</h2>
    <p>Hi ${name},</p>
    <p>We've received your message and will get back to you within 24-48 hours.</p>
    <p>In the meantime, feel free to explore our website and try out our property scoring tools.</p>
    <p>Best regards,<br>The HomeScorePro Team</p>
  `;

  const text = `Thank you for contacting us. We'll get back to you within 24-48 hours.`;

  return await sendEmail({
    to: email,
    subject: 'We Received Your Message - HomeScorePro',
    html,
    text
  });
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendSubscriptionConfirmation,
  sendContactNotification,
  sendContactAutoReply
};


