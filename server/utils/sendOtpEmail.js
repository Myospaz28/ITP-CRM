import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Password Reset OTP',
    text: `Hi,\n\nYour OTP to reset your password is: ${otp}\n\nThis code will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP email sent to ${to}`);
}

export default sendOtpEmail;
