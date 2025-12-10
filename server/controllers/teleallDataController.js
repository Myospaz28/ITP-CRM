// controllers/dashboardController.js
import db from '../database/db.js';

// Controller to fetch dashboard product data
export const fetchDashboardData = async (req, res) => {
  const assignedToUserId = req.query.user_id;

  if (!assignedToUserId) {
    return res.status(400).json({ error: 'Missing user_id in query' });
  }

  const query = `
    SELECT 
      p.product_name,
      a.assign_date,
      a.target_date,
      a.lead_count,
      c.cat_name
    FROM assignments a
    LEFT JOIN raw_data r ON r.assign_id = a.assign_id
    LEFT JOIN category c ON r.cat_id = c.cat_id
    LEFT JOIN product p ON c.cat_id = p.cat_id
    WHERE a.assigned_to_user_id = ?
      AND p.status = 'active'
      AND c.status = 'active'
    GROUP BY a.assign_id
    ORDER BY a.assign_id ASC
  `;

  try {
    const [results] = await db.query(query, [assignedToUserId]);
    res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
