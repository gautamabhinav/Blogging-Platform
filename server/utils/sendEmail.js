// import nodemailer from "nodemailer";

// // async..await is not allowed in global scope, must use a wrapper
// const sendEmail = async function (email, subject, message) {
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   // send mail with defined transport object
//   await transporter.sendMail({
//     from: process.env.SMTP_FROM_EMAIL, // sender address
//     to: email, // user email
//     subject: subject, // Subject line
//     html: message, // html body
//   });
// };

// export default sendEmail;





// import nodemailer from "nodemailer";

// // async..await is not allowed in global scope, must use a wrapper
// const sendEmail = async function (email, subject, message) {
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     // secure: false, // true for 465, false for other ports
//     secure: true,
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   // send mail with defined transport object
//   await transporter.sendMail({
//     from: process.env.SMTP_FROM_EMAIL, // sender address
//     to: email, // user email
//     subject: subject, // Subject line
//     html: message, // html body
//   });
// };

// export default sendEmail;




import 'dotenv/config';
import nodemailer from 'nodemailer';

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // Convert environment variable to boolean
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000, // 10 seconds

  logger: true,
  debug: true,
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL, // Sender address
      to, // Recipient address
      subject,
      text,
      html,
    });

    // console.log('Message sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;

  } catch (error) {
    console.error('Error sending email:', error);
    // Rethrow so callers can handle failures and return appropriate responses
    throw error;
  }
};

export default sendEmail;


// // Example usage
// sendEmail(
//   'recipient@example.com',
//   'Subject of the Email',
//   'Plain text content',
//   '<b>HTML</b> content'
// );