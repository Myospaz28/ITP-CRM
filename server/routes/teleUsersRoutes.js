// routes/userRoutes.js

import express from 'express';
import { login, getAllUsers } from '../controllers/teleUserController.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Get all users
router.get('/users', getAllUsers);

export default router;
