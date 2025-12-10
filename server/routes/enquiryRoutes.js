import express from "express";
import { createInquiry, getInquiries } from "../controllers/enquiryController.js";
import apiAuth from "../middleware/apiAuth.js";

const router = express.Router();

// Protect this API with authentication
router.post("/inquiry", apiAuth, createInquiry);
router.get("/inquiry", apiAuth, getInquiries);

export default router;
