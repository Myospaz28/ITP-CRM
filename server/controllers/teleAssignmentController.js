// controllers/assignmentController.js

import db from '../database/db.js';

// ====================== GET USER ASSIGNMENTS ==========================
export const getUserAssignments = async (req, res) => {
  const userId = req.query.user_id;

  let query = `
    SELECT 
      a.assign_id,
      a.cat_id,
      c.cat_name,
      c.status AS category_status,
      a.assign_date,
      a.lead_count,
      a.target_date,
      ar.area_name,
      IFNULL(tc.entry_count, 0) AS entries_made,
      ROUND((IFNULL(tc.entry_count, 0) / a.lead_count) * 100, 2) AS progress_percent,
      (
        SELECT COUNT(*) 
        FROM raw_data rd
        LEFT JOIN tele_caller_table tct ON rd.master_id = tct.master_id
        WHERE rd.assign_id = a.assign_id 
          AND tct.tc_status IN ('Interested', 'Not Interested', 'Not answered')
      ) AS green_count
    FROM 
      users u
    INNER JOIN 
      assignments a ON u.user_id = a.assigned_to_user_id
    INNER JOIN 
      category c ON a.cat_id = c.cat_id
    LEFT JOIN 
      area ar ON a.area_id = ar.area_id
    LEFT JOIN (
      SELECT cat_id, COUNT(*) AS entry_count
      FROM tele_caller_table
      GROUP BY cat_id
    ) AS tc ON tc.cat_id = a.cat_id
    WHERE 
      u.status = 'active' AND c.status = 'active'
  `;

  const params = [];
  if (userId) {
    query += ` AND u.user_id = ?`;
    params.push(userId);
  }

  query += ` ORDER BY a.assign_id ASC`;

  try {
    const [results] = await db.query(query, params);
    return res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};
