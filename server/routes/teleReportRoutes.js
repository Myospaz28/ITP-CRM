import express from 'express';
const router = express.Router();

import {
  getUserReport,
  getTeleCallerStatus,
  getRawDataStatus,
  getProductsByMaster,
  updateTaleCallerData,
  getEditTeleCallerData
} from '../controllers/teleReportController.js';

// Existing Routes
router.get('/userreport', getUserReport);
router.get('/telecallerstatus', getTeleCallerStatus);
router.get('/rawdatastatus', getRawDataStatus);
router.get('/getProductsByMaster', getProductsByMaster);
router.post('/updateTeleCaller', updateTaleCallerData);

// New Route for Editing Data
router.get('/edittelecaller', getEditTeleCallerData);

export default router;
