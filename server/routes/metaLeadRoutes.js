import express from "express";
import { fetchAndStorePages, fetchFormsAndLeadsForPage, } from "../controllers/metaLeadController.js";

const router = express.Router();

/**
 * Body params: page_id, access_token
 */
router.post("/fetchAll", async (req, res) => {
  const { page_id, access_token } = req.body;

  if (!page_id || !access_token) {
    return res.status(400).json({ message: "page_id & access_token required" });
  }

  try {
    const result = await fetchFormsAndLeadsForPage(page_id, access_token);
    return res.json({ message: "Forms and leads fetched successfully", result });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching data", error: err.message });
  }
});



router.get("/syncpages", fetchAndStorePages); 

export default router;

