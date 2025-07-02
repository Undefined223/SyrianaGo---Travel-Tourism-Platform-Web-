const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS, // This should be an app password, not your regular password
  },
});

const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"SyrianaGo" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
