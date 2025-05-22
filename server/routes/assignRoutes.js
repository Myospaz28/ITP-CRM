// routes/assignRoutes.js
import express from 'express';
import { assignLeads } from '../controllers/assignController.js';

const router = express.Router();

router.post('/assign', assignLeads);

export default router;