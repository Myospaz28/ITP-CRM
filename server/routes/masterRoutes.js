
import express from 'express';
import { categoryList, createCategory, removeCategory , addProductController, getProductsController,getReferencesController, addReferenceController, deleteReferenceController} from '../controllers/masterController.js';

const router = express.Router();


// ---------------------------- Category -------------------------------

router.post('/category', createCategory);
router.get('/category', categoryList);
router.delete('/category/:cat_id', removeCategory);


// --------------------------- Product ---------------------------

router.post('/product', addProductController);
router.get('/product', getProductsController);


// --------------------- References -------------------------- 

router.post('/reference', addReferenceController); // Add reference
router.get('/reference', getReferencesController); // Fetch references
router.delete('/reference/:id', deleteReferenceController); // Delete reference


export default router;