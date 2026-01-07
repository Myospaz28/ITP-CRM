import db from '../database/db.js';

//get adssign leads
export const getTotalLeadCount = async (req, res) => {
  try {
    const { id: userId, role } = req.session.user;
    const query = `SELECT COUNT(*) AS lead_count FROM raw_data`;
    const conditions = [];
    const params = [];

    if (role === 'tele-caller') {
      conditions.push(`a.assigned_to_user_id = ?`);
      params.push(userId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY rd.master_id';
    const [rows] = await db.query(query);
    console.log('lead rows: ', rows);
    res.json(rows[0]); // returns { lead_count: number }
  } catch (error) {
    console.error('Error fetching leads count:', error);
    res.status(500).json({ error: 'Failed to fetch leads count' });
  }
};

export const getAssignedLeadCount1 = async (req, res) => {
  try {
    const { id: userId, role } = req.session.user;
    console.log('Session user:', req.session.user);

    let query = `
      SELECT COUNT(*) AS assigned_count
      FROM raw_data rd
    `;
    const params = [];

    if (role === 'tele-caller') {
      query += `
        JOIN assignments a ON rd.assign_id = a.assign_id
        WHERE rd.status = 'Assigned' AND a.assigned_to_user_id = ?
      `;
      params.push(userId);
    } else {
      // for admin or other roles
      query += ` WHERE rd.status = 'Assigned'`;
    }

    const [rows] = await db.query(query, params);
    console.log('Assigned rows:', rows);

    res.json(rows[0] || { assigned_count: 0 });
  } catch (error) {
    console.error('Error fetching assigned leads count:', error);
    res.status(500).json({ error: 'Failed to fetch assigned leads count' });
  }
};

export const getAssignedLeadCount = async (req, res) => {
  try {
    const { id: userId, role } = req.session.user;

    let query = `
      SELECT COUNT(*) AS assigned_count
      FROM raw_data rd
      JOIN assignments a ON rd.assign_id = a.assign_id
    `;
    const params = [];

    // ================= TELECALLER =================
    if (role === 'tele-caller') {
      query += `
        WHERE rd.status = 'Assigned'
          AND rd.lead_status = 'Inactive'
          AND a.assigned_to_user_id = ?
      `;
      params.push(userId);
    }

    // ================= TEAM LEAD =================
    else if (role === 'team lead') {
      // Get telecallers under this team lead
      const [rows] = await db.query(
        `
        SELECT tele_caller_id
        FROM team_lead_assignment
        WHERE lead_id = ?
        `,
        [userId],
      );

      // telecallers + team lead itself
      const userIds = [userId, ...rows.map((r) => r.tele_caller_id)];

      query += `
        WHERE rd.status = 'Assigned'
          AND rd.lead_status = 'Inactive'
          AND a.assigned_to_user_id IN (${userIds.map(() => '?').join(',')})
      `;

      params.push(...userIds);
    }

    // ================= ADMIN / OTHERS =================
    else {
      query += `
        WHERE rd.status = 'Assigned'
          AND rd.lead_status = 'Inactive'
      `;
    }

    const [result] = await db.query(query, params);

    res.json({
      assigned_count: result[0]?.assigned_count || 0,
    });
  } catch (error) {
    console.error('❌ Error fetching assigned leads count:', error);
    res.status(500).json({
      error: 'Failed to fetch assigned leads count',
    });
  }
};

// followups
export const getfollowups1 = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS followup_count FROM followup`;
    const [rows] = await db.query(query);
    console.log('followup rows: ', rows);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching Followups count:', error);
    res.status(500).json({ error: 'Failed to fetch followups count' });
  }
};

export const getfollowups = async (req, res) => {
  try {
    const { id: userId, role } = req.session.user;

    let query = `
      SELECT COUNT(*) AS active_count
      FROM raw_data rd
      JOIN assignments a ON rd.assign_id = a.assign_id
    `;
    const params = [];

    // ================= TELECALLER =================
    if (role === 'tele-caller') {
      query += `
        WHERE rd.status = 'Assigned'
          AND rd.lead_status = 'Active'
          AND a.assigned_to_user_id = ?
      `;
      params.push(userId);
    }

    // ================= TEAM LEAD =================
    else if (role === 'team lead') {
      // fetch telecallers under this team lead
      const [rows] = await db.query(
        `
        SELECT tele_caller_id
        FROM team_lead_assignment
        WHERE lead_id = ?
        `,
        [userId],
      );

      // include team lead + telecallers
      const userIds = [userId, ...rows.map((r) => r.tele_caller_id)];

      query += `
        WHERE rd.status = 'Assigned'
          AND rd.lead_status = 'Active'
          AND a.assigned_to_user_id IN (${userIds.map(() => '?').join(',')})
      `;

      params.push(...userIds);
    }

    // ================= ADMIN / OTHERS =================
    else {
      query += `
        WHERE rd.status = 'Assigned'
          AND rd.lead_status = 'Active'
      `;
    }

    const [result] = await db.query(query, params);

    res.json({
      active_count: result[0]?.active_count || 0,
    });
  } catch (error) {
    console.error('❌ Error fetching followups count:', error);
    res.status(500).json({
      error: 'Failed to fetch followups count',
    });
  }
};

// meeting scheduled
export const getMeetingScheduled = async (req, res) => {
  try {
    const { id: userId, role } = req.session.user;

    let query = `
      SELECT COUNT(*) AS win_count
      FROM raw_data rd
      JOIN assignments a ON rd.assign_id = a.assign_id
    `;
    const params = [];

    // ================= TELECALLER =================
    if (role === 'tele-caller') {
      query += `
        WHERE rd.lead_status = 'Win'
          AND rd.status = 'Assigned'
          AND a.assigned_to_user_id = ?
      `;
      params.push(userId);
    }

    // ================= TEAM LEAD =================
    else if (role === 'team lead') {
      // fetch telecallers under this team lead
      const [rows] = await db.query(
        `
        SELECT tele_caller_id
        FROM team_lead_assignment
        WHERE lead_id = ?
        `,
        [userId],
      );

      // include team lead itself + telecallers
      const userIds = [userId, ...rows.map((r) => r.tele_caller_id)];

      query += `
        WHERE rd.lead_status = 'Win'
          AND rd.status = 'Assigned'
          AND a.assigned_to_user_id IN (${userIds.map(() => '?').join(',')})
      `;

      params.push(...userIds);
    }

    // ================= ADMIN / OTHERS =================
    else {
      query += `
        WHERE rd.lead_status = 'Win'
          AND rd.status = 'Assigned'
      `;
    }

    const [result] = await db.query(query, params);

    res.json({
      win_count: result[0]?.win_count || 0,
    });
  } catch (error) {
    console.error('❌ Error fetching win leads count:', error);
    res.status(500).json({
      error: 'Failed to fetch win leads count',
    });
  }
};

// Category
export const getcategory = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS category_count FROM category`;
    const [rows] = await db.query(query);
    console.log('category rows: ', rows);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching category count:', error);
    res.status(500).json({ error: 'Failed to fetch category count' });
  }
};

export const getLoseLeadCount = async (req, res) => {
  try {
    const { id: userId, role } = req.session.user;

    let query = `
      SELECT COUNT(*) AS lose_count
      FROM raw_data rd
      JOIN assignments a ON rd.assign_id = a.assign_id
    `;
    const params = [];

    // ================= TELECALLER =================
    if (role === 'tele-caller') {
      query += `
        WHERE rd.lead_status = 'Lose'
          AND a.assigned_to_user_id = ?
      `;
      params.push(userId);
    }

    // ================= TEAM LEAD =================
    else if (role === 'team lead') {
      const [rows] = await db.query(
        `
        SELECT tele_caller_id
        FROM team_lead_assignment
        WHERE lead_id = ?
        `,
        [userId],
      );

      const userIds = [userId, ...rows.map((r) => r.tele_caller_id)];

      query += `
        WHERE rd.lead_status = 'Lose'
          AND a.assigned_to_user_id IN (${userIds.map(() => '?').join(',')})
      `;

      params.push(...userIds);
    }

    // ================= ADMIN / OTHERS =================
    else {
      query += `
        WHERE rd.lead_status = 'Lose'
      `;
    }

    const [result] = await db.query(query, params);

    res.json({
      lose_count: result[0]?.lose_count || 0,
    });
  } catch (error) {
    console.error('❌ Error fetching lose leads count:', error);
    res.status(500).json({
      error: 'Failed to fetch lose leads count',
    });
  }
};

export const getInvalidLeadCount = async (req, res) => {
  try {
    const { id: userId, role } = req.session.user;

    let query = `
      SELECT COUNT(*) AS invalid_count
      FROM raw_data rd
      JOIN assignments a ON rd.assign_id = a.assign_id
    `;
    const params = [];

    // ================= TELECALLER =================
    if (role === 'tele-caller') {
      query += `
        WHERE rd.lead_status = 'Invalid'
          AND a.assigned_to_user_id = ?
      `;
      params.push(userId);
    }

    // ================= TEAM LEAD =================
    else if (role === 'team lead') {
      const [rows] = await db.query(
        `
        SELECT tele_caller_id
        FROM team_lead_assignment
        WHERE lead_id = ?
        `,
        [userId],
      );

      const userIds = [userId, ...rows.map((r) => r.tele_caller_id)];

      query += `
        WHERE rd.lead_status = 'Invalid'
          AND a.assigned_to_user_id IN (${userIds.map(() => '?').join(',')})
      `;

      params.push(...userIds);
    }

    // ================= ADMIN / OTHERS =================
    else {
      query += `
        WHERE rd.lead_status = 'Invalid'
      `;
    }

    const [result] = await db.query(query, params);

    res.json({
      invalid_count: result[0]?.invalid_count || 0,
    });
  } catch (error) {
    console.error('❌ Error fetching invalid leads count:', error);
    res.status(500).json({
      error: 'Failed to fetch invalid leads count',
    });
  }
};

// Category
export const getProducts = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS product_count FROM product`;
    const [rows] = await db.query(query);
    console.log('product rows: ', rows);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product count:', error);
    res.status(500).json({ error: 'Failed to fetch product count' });
  }
};

//

// Category
export const getConvertedLeads = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS converted_count FROM raw_data WHERE status= 'lead Converted'`;
    const [rows] = await db.query(query);
    console.log('converted rows: ', rows);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching cnverted count:', error);
    res.status(500).json({ error: 'Failed to fetch converted count' });
  }
};

export const getTotalCampaignCount = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS campaign_count FROM campaigns`;

    const [rows] = await db.query(query);

    res.json({ campaign_count: rows[0].campaign_count || 0 });
  } catch (error) {
    console.error('Error fetching campaign count:', error);
    res.status(500).json({ error: 'Failed to fetch campaign count' });
  }
};

export const getTotalUsersCount = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS total_users FROM users`;

    const [rows] = await db.query(query);

    res.json({ total_users: rows[0].total_users });
  } catch (error) {
    console.error('Error fetching users count:', error);
    res.status(500).json({ error: 'Failed to fetch users count' });
  }
};

// Get assigned tele-caller count for logged-in team lead
export const getAssignedTeleCallerCountForTeamLead = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id: leadId, role } = req.session.user;

    if (role !== 'team lead') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const query = `
      SELECT 
        tla.lead_id,
        COUNT(DISTINCT tla.tele_caller_id) AS tele_caller_count,
        GROUP_CONCAT(DISTINCT u.name ORDER BY u.name SEPARATOR ', ') AS tele_caller_names
      FROM team_lead_assignment tla
      LEFT JOIN users u 
        ON u.user_id = tla.tele_caller_id
      WHERE tla.lead_id = ?
      GROUP BY tla.lead_id
    `;

    const [rows] = await db.query(query, [leadId]);

    res.status(200).json(
      rows[0] || {
        lead_id: leadId,
        tele_caller_count: 0,
        tele_caller_names: '',
      },
    );
  } catch (error) {
    console.error('❌ getAssignedTeleCallerCountForTeamLead Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getNewLeadCount = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ new_lead_count: 0 });
    }

    const query = `
      SELECT COUNT(*) AS new_lead_count
      FROM meta_data
      WHERE status = 'Not Assigned'
    `;

    const [rows] = await db.query(query);

    res.json(rows[0] || { new_lead_count: 0 });
  } catch (error) {
    console.error('Error fetching new leads count:', error);
    res.status(500).json({ error: 'Failed to fetch new leads count' });
  }
};
