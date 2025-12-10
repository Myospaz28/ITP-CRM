// controllers/authController.js

import crypto from 'crypto';
import db from '../database/db.js';
import bcrypt from 'bcryptjs';
import sendOtpEmail from '../utils/sendOtpEmail.js';

// ====================== FORGOT PASSWORD ==========================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(200).json({ message: 'If email exists, OTP has been sent.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save OTP and expiry in DB (make sure otp & otp_expiry columns exist in users table)
    await db.query(
      'UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?',
      [otp, otpExpiry, email]
    );

    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ message: 'Server error. Try again later.' });
  }
};

// ====================== RESET PASSWORD ==========================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP and new password are required' });
    }

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND otp = ?',
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid OTP or email' });
    }

    const user = rows[0];

    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Hash new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    await db.query(
      'UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ message: 'Server error. Try again later.' });
  }
};
