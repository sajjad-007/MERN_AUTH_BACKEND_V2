const nodemailer = require('nodemailer');

const sendVerificationEmail = async (
  email,
  subject,
  emailTemplate,
  textMessage
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: email,
    subject: subject,
    html: emailTemplate || '',
    text: textMessage || '',
  });

  return info.messageId;
};

module.exports = { sendVerificationEmail };
