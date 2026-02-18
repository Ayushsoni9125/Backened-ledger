
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"backened-ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegisterEmail(userEmail, name) {
  const subject = 'Welcome to backened-ledger!';
  const text = `Hi ${name},\n\nThank you for registering with backened-ledger. We're excited to have you on board!\n\nBest regards,\nThe backened-ledger Team`;
  const html = `<p>Hi ${name},</p><p>Thank you for registering with backened-ledger. We're excited to have you on board!</p><p>Best regards,<br>The backened-ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}


async function sendTranscationEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Alert from backened-ledger';
  const text = `Hi ${name},\n\nYou have successfully transferred $${amount} to account ${toAccount}.\n\nBest regards,\nThe backened-ledger Team`;
  const html = `<p>Hi ${name},</p><p>You have successfully transferred $${amount} to account ${toAccount}.</p><p>Best regards,<br>The backened-ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Failure Alert from backened-ledger';
  const text = `Hi ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please check your account balance and try again.\n\nBest regards,\nThe backened-ledger Team`;
  const html = `<p>Hi ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please check your account balance and try again.</p><p>Best regards,<br>The backened-ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegisterEmail,
  sendTranscationEmail,
  sendTransactionFailureEmail
}