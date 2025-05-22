// AssignController.js
import db from '../database/db.js';// 



export const assignLeads = async (req, res) => {
  // Check session
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
  const {
    mode,
    assignedTo,
    assignDate,
    targetDate,
    remark,
    leadCount,
  } = req.body;

  const userId = req.session.user.id;
  console.log(userId);

  if (!mode || !assignedTo || !assignDate || !targetDate || !leadCount || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const connection = await db.getConnection(); // use promise-based connection pool

  try {
    await connection.beginTransaction();

    // Step 1: Get N unassigned leads
    const [leads] = await connection.query(
      `SELECT master_id FROM raw_data WHERE status = 'Not assigned' ORDER BY master_id ASC LIMIT ?`,
      [Number(leadCount)]
    );

    if (leads.length === 0) {
      throw new Error("No unassigned leads available.");
    }

    const leadIds = leads.map(lead => lead.master_id);

    // Step 2: Insert into assignments table
    const [assignmentResult] = await connection.query(
      `INSERT INTO assignments (user_id, mode, assign_date, target_date, remark, created_at, assigned_to, lead_count)
       VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [userId, mode, assignDate, targetDate, remark, assignedTo, leadIds.length]
    );

    const newAssignId = assignmentResult.insertId;

    // Step 3: Update selected leads in raw_data
    await connection.query(
      `UPDATE raw_data SET status = 'Assigned', assign_id = ? WHERE master_id IN (?)`,
      [newAssignId, leadIds]
    );

    await connection.commit();
    res.status(200).json({ message: 'Leads assigned successfully.', assign_id: newAssignId });

  } catch (error) {
    await connection.rollback();
    console.error("Assignment error:", error);
    res.status(500).json({ message: 'Failed to assign leads.', error: error.message });
  } finally {
    connection.release();
  }
};

