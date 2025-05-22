import express from "express";
import multer from "multer";
import { getAllRawData, importRawData } from "../controllers/rawDataController.js";

const router = express.Router();
const upload = multer();

// Add route for fetching users
router.get('/raw-data', getAllRawData);
router.post("/rawdata/import", upload.single("file"), importRawData);

export default router;


