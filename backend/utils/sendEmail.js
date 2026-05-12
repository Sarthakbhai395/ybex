const nodemailer = require('nodemailer');

/**
 * Send an email via Gmail SMTP.
 *
 * SETUP REQUIRED in backend/.env:
 *   EMAIL_USER=yourgmail@gmail.com
 *   EMAIL_PASS=xxxx xxxx xxxx xxxx   ← Gmail App Password (16 chars, spaces ok)
 *
 * How to get a Gmail App Password:
 *   1. Go to https://myaccount.google.com/security
 *   2. Enable 2-Step Verification
 *   3. Go to App Passwords → select "Mail" → generate
 *   4. Paste the 16-char password into EMAIL_PASS
 */
const sendEmail = async ({ to, subject, html }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // Check if email credentials are configured
  if (!user || !pass || user === 'your_email@gmail.com' || pass === 'your_email_password' || user === 'yourgmail@gmail.com') {
    console.warn('⚠ EMAIL_USER and EMAIL_PASS are not configured in .env - email sending skipped');
    console.warn('⚠ To enable email sending, add your Gmail credentials in backend/.env');
    return; // Return gracefully instead of throwing error
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',          // uses Gmail's built-in settings (port 465 SSL)
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"YBEX Studio" <${user}>`,
      to,
      subject,
      html,
    });
    
    console.log('✅ Email sent successfully to:', to);
  } catch (error) {
    console.warn('⚠ Failed to send email:', error.message);
    // Don't throw error - log and continue gracefully
  }
};

module.exports = sendEmail;
