// controllers/ActivityCard.js
import db from '../database/db.js';

// ====================== GET USER LEAD COUNT ==========================
export const getUserLeadCount = async (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      u.user_id, 
      u.name, 
      SUM(a.lead_count) AS total_leads,

      -- Rejected count: Not Answered or Invalid
      (
        SELECT COUNT(*)
        FROM assignments a2
        JOIN raw_data r2 ON a2.assign_id = r2.assign_id
        JOIN tele_caller_table tc ON r2.master_id = tc.master_id
        WHERE a2.assigned_to_user_id = u.user_id
        AND tc.tc_status IN ('Not Answered', 'Invalid')
      ) AS rejected_count,

      -- Positive count: Interested, Not Interested, Not answered
      (
        SELECT COUNT(*)
        FROM assignments a3
        JOIN raw_data r3 ON a3.assign_id = r3.assign_id
        JOIN tele_caller_table tc ON r3.master_id = tc.master_id
        WHERE a3.assigned_to_user_id = u.user_id
        AND tc.tc_status IN ('Interested', 'Not Interested', 'Not answered')
      ) AS positive_count

    FROM users u
    JOIN assignments a ON u.user_id = a.assigned_to_user_id
    WHERE u.user_id = ?
    GROUP BY u.user_id, u.name
  `;

  try {
    const [results] = await db.query(query, [userId]);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No lead data found for this user.' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching lead counts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ====================== SEARCH CATEGORIES ==========================
export const searchCategories = async (req, res) => {
  const searchTerm = req.query.search || '';
  const sql = `
    SELECT * FROM category 
    WHERE cat_name LIKE ?
    ORDER BY created_at DESC
  `;
  const values = [`%${searchTerm}%`];

  try {
    const [results] = await db.query(sql, values);
    res.json(results);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
