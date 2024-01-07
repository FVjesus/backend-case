const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async (subject, text) => {
  const adminEmail = process.env.MAIL_ADMIN;
  await transporter.sendMail({
      from: 'systembackendcase@contact.com',
      to: adminEmail,
      subject,
      text,
  });
};

module.exports = {
  sendMail,
};