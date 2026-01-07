import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
// import taskRoutes from './routes/taskRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';
import rawDataRoutes from './routes/rawDataRoutes.js';
import assignRoutes from './routes/assignRoutes.js';
import teleCallerRoute from './routes/teleCallerRoute.js';
import followupRoute from './routes/followupRoute.js';
import meetingRoutes from './routes/meetingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import UploadRoutes from './routes/uploadRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import userRoutess from './routes/teleUsersRoutes.js';
import callDataRoutess from './routes/teleCallDataRoutes.js';
import assignmentRoutess from './routes/teleAssignmentRoutes.js';
import reportRoutess from './routes/teleReportRoutes.js';
import authRoutess from './routes/teleAuth.js';
import ActivityCardRoutess from './routes/teleActivityCardRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import metaLeadRoutes from './routes/metaLeadRoutes.js';
import './cron/fbLeadCron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(cors());
app.use(express.json());

app.use(
  '/uploads/documents',
  express.static(path.join(__dirname, '../uploads/documents')),
);

const uploadPath = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(
  cors({
    origin: [
      'https://react3.myospaz.in',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

// Routes
app.use('/api/meta', metaLeadRoutes);
app.use('/api', userRoutes);
app.use('/api', enquiryRoutes);
app.use('/api', projectRoutes);
// app.use('/api', taskRoutes);
app.use('/api', clientRoutes);
app.use('/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', masterRoutes);
app.use('/api', marketingRoutes);
app.use('/api', rawDataRoutes);
app.use('/api', assignRoutes);
app.use('/api', teleCallerRoute);
app.use('/api', followupRoute);
app.use('/api/meeting', meetingRoutes);
app.use('/api/report', reportRoutes);
app.use('/api', UploadRoutes);
app.use('/api/campaign', campaignRoutes);

//telecaller
app.use('/api', userRoutess);
app.use('/api/tele', callDataRoutess);
app.use('/api/tele', assignmentRoutess);
app.use('/api', reportRoutess);
app.use('/api', authRoutess);
app.use('/api', ActivityCardRoutess);

app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
