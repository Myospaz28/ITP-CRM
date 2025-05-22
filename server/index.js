// server/index.js

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import clientRoutes from './routes/clientRoutes.js'
import dotenv from 'dotenv'; 
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import masterRoutes from './routes/masterRoutes.js'
import marketingRoutes from './routes/marketingRoutes.js';
import rawDataRoutes from "./routes/rawDataRoutes.js";
import assignRoutes from "./routes/assignRoutes.js";
// import dashboardRoutes from './routes/dashboardRoutes.js' ;
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:5173', 'https://akash.myospaz.in'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRETE, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));



resave: false,

app.use('/api', userRoutes); 
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', clientRoutes);
app.use('/auth', authRoutes);
// app.use('/api', dashboardRoutes);
app.use('/api', masterRoutes);
app.use('/api', marketingRoutes);
app.use("/api", rawDataRoutes);
app.use('/api', assignRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


