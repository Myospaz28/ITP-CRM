import express from 'express';
import { fetchTaleCallerData, updateTaleCallerData, getTeleCallerStatus, getCategories, 
    getProductsByCategory, getRawDataStatus, 
    getAllCombinedRawData,
    getAllActiveAssignedRawData} from '../controllers/teleCallerController.js';

const router = express.Router();

router.get('/talecallerdata', fetchTaleCallerData);

router.get('/tcstatus', getTeleCallerStatus);

router.put('/edittelecaller', updateTaleCallerData);

router.get('/categories', getCategories);

router.get('/products/:cat_id', getProductsByCategory);

router.get('/rawdatastatus', getRawDataStatus);

router.get("/combined-rawdata", getAllCombinedRawData);

router.get("/rawdata/active", getAllActiveAssignedRawData);

export default router;
