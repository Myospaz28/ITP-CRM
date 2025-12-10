
// server/controllers/userController.js

import {
  addUser,
  getUsers as getAllUsers,
  deleteUser,
  editUser
} from '../models/userModel.js';
import db from '../database/db.js';
import bcrypt from 'bcrypt';




//bcrypted create user
export const createUser = async (req, res) => {
  const { name, contact, email, address, role, status, username, password } = req.body;

  try {
    // Hash the password before saving it
    const saltRounds = 10; // You can adjust the salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await addUser([
      name,
      contact,
      email,
      address,
      role,
      status,
      username,
      hashedPassword, // Store the hashed password
    ]);

    res.status(201).json({ message: 'User added successfully!', user_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the user.' });
  }
};




export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    // console.log('Users fetched from DB:', users); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error); 
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};




//update user
export const updateUser  = async (req, res) => {
  const { user_id } = req.params; // Ensure this matches the route parameter

  console.log("user_id :", user_id)
  const { name, contact, address, email, role, status } = req.body;
  console.log("Updating user with data:", { user_id, name, contact, address, email, role, status });
  try {
    const result = await editUser (user_id, { name, contact, address, email, role, status });
    res.json({ message: 'User  updated successfully', result });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};



//delete user
export const removeUser = async (req, res) => {
  const { user_id } = req.params;
  const query = 'select name FROM users WHERE user_id = ?';
  const [result] = await db.query(query, [user_id]);
  // console.log('name is :', result);
  // console.log(' user_id :', user_id);

  try {
    const result = await deleteUser(user_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};





// ========= non bcrypted create user =================

// export const createUser = async (req, res) => {
//   const { name, contact, email, address, role, status, username, password } =
//     req.body;

//   try {
//     // Directly use the password without hashing
//     const result = await addUser([
//       name,
//       contact,
//       email,
//       address,
//       role,
//       status,
//       username,
//       password,
//     ]);
//     res
//       .status(201)
//       .json({ message: 'User added successfully!', user_id: result.insertId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while adding the user.' });
//   }
// };
