import express from 'express';
import {
  fetchTaleCallerData,
  updateTaleCallerData,
  getTeleCallerStatus,
  getCategories,
  getProductsByCategory,
  getRawDataStatus,
  getAllCombinedRawData,
  getAllActiveAssignedRawData,
  fetchUnassignedTeleCallers,
  assignTeleCallersToLead,
  getTeleCallerCountByLead,
  removeTeleCallerFromLead,
  getTeamLeadWithTeleCallers,
  getAllMetaData,
  assignLeads,
  transferLeads,
  getMyTeleCallers,
  getFollowUpLeads,
  getLeadById,
  getAllRawData,
  bulkDeleteLeads,
  getLeadTransferLogs,
} from '../controllers/teleCallerController.js';

const router = express.Router();

router.get('/talecallerdata', fetchTaleCallerData);

router.get('/tcstatus', getTeleCallerStatus);

router.put('/edittelecaller', updateTaleCallerData);

router.get('/categories', getCategories);

router.get('/products/:cat_id', getProductsByCategory);

router.get('/rawdatastatus', getRawDataStatus);

router.get('/combined-rawdata', getAllCombinedRawData);

router.get('/rawdata/active', getAllActiveAssignedRawData);

router.get('/fetchUnassignedTeleCallers', fetchUnassignedTeleCallers);

router.post('/assignTeleCallersToLead', assignTeleCallersToLead);

router.get('/getTeleCallerCountByLead/:lead_id', getTeleCallerCountByLead);

router.delete('/removeTeleCaller/:tele_caller_id', removeTeleCallerFromLead);

router.get('/team-leads/:lead_id/telecallers', getTeamLeadWithTeleCallers);

router.get('/meta-data', getAllMetaData);

router.post('/assign-leads', assignLeads);

router.post('/transfer-leads', transferLeads);

router.get('/team-lead/telecallers', getMyTeleCallers);

router.get('/followup-leads', getFollowUpLeads);

router.get('/lead/:id', getLeadById);

router.get('/rawdata/all', getAllRawData);

router.post('/rawdata/bulk-delete', bulkDeleteLeads);

router.get('/lead-transfer-logs', getLeadTransferLogs);

export default router;
