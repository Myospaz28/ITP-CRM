import express from 'express';
import multer from 'multer';
import {
  getAllRawData,
  importRawData,
  updateRawData,
  deleteClient, deleteMultipleClients  ,addSingleRawData 
} from '../controllers/rawDataController.js';

const router = express.Router();
const upload = multer();

// Add route for fetching users
router.get('/master-data', getAllRawData);
router.post('/master-data/import', upload.single('file'), importRawData);
router.put('/master-data/:master_id', updateRawData);
router.delete('/master-data/:master_id', deleteClient);
router.post('/master-data/delete-multiple', deleteMultipleClients);

router.post('/master-data/add-single', addSingleRawData);


export default router;
