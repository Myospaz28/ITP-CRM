
import express from 'express';
import { categoryList, createCategory,updateCategoryController, removeCategory , addProductController,updateProductController, getProductsController,getReferencesController, addReferenceController, deleteReferenceController, removeProductController, updateReferenceController, addAreaController,getAreaController,deleteAreaController,updateAreaController, addSourceController, getSourcesByCategory, addLeadStage, getLeadStages, updateLeadStageController, deleteLeadStageController, addLeadSubStageController, getSubStagesController, getSources} from '../controllers/masterController.js';
const router = express.Router();


// ---------------------------- Category -------------------------------

router.post('/category', createCategory);
router.get('/category', categoryList);
router.delete('/category/:cat_id', removeCategory);
router.put("/category/:cat_id", updateCategoryController);


// --------------------------- Product ---------------------------

router.post('/product', addProductController);
router.get('/product', getProductsController);
router.put("/product/:product_id", updateProductController);
router.delete('/product/:product_id', removeProductController);


// --------------------- References -------------------------- 

router.post('/reference', addReferenceController); // Add reference
router.get('/reference', getReferencesController); // Fetch references
router.delete('/reference/:id', deleteReferenceController); // Delete reference
router.put("/reference/:id", updateReferenceController); //Update reference


// --------------------- Area -------------------------- 

router.post('/area', addAreaController); // Add Area
router.get('/area', getAreaController); // Fetch Area
router.delete('/area/:id', deleteAreaController); // Delete Area
router.put('/area/:id', updateAreaController); //Update Area



// --------------------- Source -------------------------- 
router.post("/addsource", addSourceController);
router.get("/source", getSources);


router.get('/source/:reference_id', getSourcesByCategory);

router.post("/leadstage", addLeadStage);
router.get("/leadstages", getLeadStages);
router.put("/leadstage/:id", updateLeadStageController);
router.delete("/leadstage/:id", deleteLeadStageController);

router.post("/lead-sub-stage", addLeadSubStageController);
router.get('/lead-sub-stages/:stage_ref_id', getSubStagesController);

export default router;