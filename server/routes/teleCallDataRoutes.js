// routes/callDataRoutes.js
import express from 'express';
import { fetchDashboardData } from '../controllers/teleallDataController.js';

const router = express.Router();

// Route to fetch dashboard data
router.get('/dashboarddata', fetchDashboardData);

export default router;
