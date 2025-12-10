// routes/assignmentRoutes.js
import express from 'express';
import * as assignmentController from '../controllers/teleAssignmentController.js';

const router = express.Router();

// GET /api/assignments
router.get('/assignments', assignmentController.getUserAssignments);

export default router;
