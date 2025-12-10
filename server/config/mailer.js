
const nodemailer = require('nodemailer');
require('dotenv').config();

const transportConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '1025', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: undefined,
};

if (process.env.SMTP_USER) {
  transportConfig.auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };
}

const transporter = nodemailer.createTransport(transportConfig);

module.exports = transporter;
