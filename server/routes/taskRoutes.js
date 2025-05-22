import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import taskController from '../controllers/taskController.js';

const {
  createTask,
  fetchProjects,
  fetchTasks,
  openFile,
  openFolder,
  fetchUsers,
  updateTaskStatus,
  updateTaskDetails,
  fetchTaskUserHistory,
  removeUserFromTask,
  fetchPendingTasks,
  fetchInProgressTasks,
  fetchOnHoldTasks,
  fetchCompletedTasks,
  fetchUnderReviewTasks,
  addUserToTask,
  updateTaskUsers,
  getTaskActivityLogs,
  getPendingTaskCount,
  fetchTaskStatusActivity
} = taskController;

const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  next();
};

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/create-task', upload.single('file'), createTask);
router.get('/projects', fetchProjects);
router.get('/tasks',  fetchTasks);
// router.get('/tasks', authMiddleware, fetchTasks);
router.get('/users', fetchUsers);
router.get('/open-file/:projectName/:taskName', openFile);
router.get('/open-folder/:projectName', openFolder);
router.patch('/tasks/status', updateTaskStatus);
router.put('/tasks/:task_id', updateTaskDetails);
router.get('/tasks/:taskId/user-history', fetchTaskUserHistory);

// Route to add a user to a task
router.post('/tasks/:taskId/users', addUserToTask);
// Route to remove a user from a task
router.delete('/tasks/:taskId/users/:userId', removeUserFromTask);
// Route to update users of a task (add and remove multiple users)
router.put('/tasks/:taskId/users', updateTaskUsers);
router.get('/task/:taskId/activity-logs', getTaskActivityLogs);

router.get('/tasks/pending', fetchPendingTasks);
router.get('/tasks/inProgress', fetchInProgressTasks);
router.get('/tasks/onHold', fetchOnHoldTasks);
router.get('/tasks/completed', fetchCompletedTasks);
router.get('/tasks/underReview', fetchUnderReviewTasks);
router.get('/tasks/pending-count', getPendingTaskCount);

router.get('/tasks/:taskId/status-activity', fetchTaskStatusActivity);

export default router;
