
import express from "express";
import { getTotalLeadCount, getAssignedLeadCount, getfollowups, getMeetingScheduled, getcategory, getProducts,getConvertedLeads, getTotalCampaignCount } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/dashboard/lead-count", getTotalLeadCount);
router.get("/master-data/assigned-count", getAssignedLeadCount);
router.get("/master-data/fllowups", getfollowups);
router.get("/master-data/meeting-scheduled", getMeetingScheduled);
router.get("/master-data/category", getcategory);
router.get("/master-data/product", getProducts);
router.get("/master-data/converted-leads", getConvertedLeads);

router.get("/master-data/campaign-count", getTotalCampaignCount);




export default router;















// import express from 'express';
// import { getClients, getParts, getProducts, getCompletedParts,getPartsInProgress, getPartsOnHold, getPartsUnderReview, getPendingParts } from './../controllers/dashboardController.js';

// const router = express.Router();

// router.get('/total-clients', getClients);
// router.get('/total-parts', getParts);
// router.get('/total-products', getProducts);
// router.get('/completed-parts', getCompletedParts);
// router.get('/pending-parts', getPendingParts);
// router.get('/parts-under-review', getPartsUnderReview);
// router.get('/parts-in-progress', getPartsInProgress);
// router.get('/parts-on-hold', getPartsOnHold);




// export default router;
