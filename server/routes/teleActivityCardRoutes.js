// routes/ActivityRoutes.js
import express from 'express';
import { getUserLeadCount, searchCategories } from '../controllers/teleActivityCard.js';

const router = express.Router();

// ✅ Route to get user lead count
router.get('/leadcount/:userId', getUserLeadCount);

// ✅ Route to search categories by name
router.get('/categories', searchCategories);

export default router;
