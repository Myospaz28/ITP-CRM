import bcrypt from 'bcrypt';
import { getUserByUsername } from '../models/signinModel.js';

import db from '../database/db.js';
import crypto from 'crypto';

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide both username and password' });
    }

    // Fetch user from the database
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Set session data
    req.session.user = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };

    console.log('session:', req.session.user);

    res.status(200).json({ message: 'Sign-in successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkSession = (req, res) => {
  if (req.session.user) {
    res
      .status(200)
      .json({ isAuthenticated: true, role: req.session.user.role });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/signin');
  });
};

// export const getUserRole = (req, res) => {
//   if (req.session.user) {
//     return res.status(200).json({ role: req.session.user.role });
//   } else {
//     return res.status(401).json({ message: 'Not authenticated' });
//   }
// };

export const getUserRole = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({
      id: req.session.user.id,
      role: req.session.user.role,
      username: req.session.user.username,
    });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

export const getUserName = (req, res) => {
  if (req.session.user) {
    console.log('req.session:', req.session.user);
    return res.status(200).json({
      name: req.session.user.name,
      username: req.session.user.username,
      role: req.session.user.role,
    });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

export const sendForgetPasswordOtp = async (req, res) => {
  try {
    const { contact_no } = req.body;

    // 1️⃣ Validation
    if (!contact_no) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    // 2️⃣ Check user
    const [users] = await db.query(
      'SELECT user_id FROM users WHERE contact_no = ?',
      [contact_no],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mobile number is not registered',
      });
    }

    // 3️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4️⃣ OTP expiry (10 minutes)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // 5️⃣ Save OTP
    await db.query(
      'UPDATE users SET otp = ?, otp_expiry = ? WHERE contact_no = ?',
      [otp, otpExpiry, contact_no],
    );

    console.log(`✅ OTP for ${contact_no}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('❌ Send OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { contact_no, otp, new_password } = req.body;

    if (!contact_no || !otp || !new_password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get user
    const [users] = await db.query(
      `SELECT user_id, otp, otp_expiry 
       FROM users 
       WHERE contact_no = ?`,
      [contact_no],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check expiry
    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password & clear OTP
    await db.query(
      `UPDATE users 
       SET password = ?, otp = NULL, otp_expiry = NULL 
       WHERE user_id = ?`,
      [hashedPassword, user.user_id],
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('❌ Reset Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const getUserName = (req) => {
//   if (req.session.user) {
//     console.log('req.session:', req.session.user);
//     return {
//       name: req.session.user.name,
//       username: req.session.user.username,
//       role: req.session.user.role,
//     };
//   }
//   throw new Error('Not authenticated');
// };
