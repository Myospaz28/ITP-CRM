import express from 'express';
import {
  getTotalLeadCount,
  getAssignedLeadCount,
  getfollowups,
  getMeetingScheduled,
  getcategory,
  getProducts,
  getConvertedLeads,
  getTotalCampaignCount,
  getTotalUsersCount,
  getLoseLeadCount,
  getInvalidLeadCount,
  getAssignedTeleCallerCountForTeamLead,
  getNewLeadCount,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/dashboard/lead-count', getTotalLeadCount);
router.get('/master-data/assigned-count', getAssignedLeadCount);
router.get('/master-data/fllowups', getfollowups);
router.get('/master-data/meeting-scheduled', getMeetingScheduled);
router.get('/master-data/category', getcategory);
router.get('/master-data/loose-leads', getLoseLeadCount);
router.get('/master-data/invalid-leads', getInvalidLeadCount);
router.get('/master-data/product', getProducts);
router.get('/master-data/converted-leads', getConvertedLeads);

router.get('/master-data/campaign-count', getTotalCampaignCount);

router.get('/users/count', getTotalUsersCount);

router.get('/team-lead/count', getAssignedTeleCallerCountForTeamLead);

router.get('/new-leads-count', getNewLeadCount);

export default router;
