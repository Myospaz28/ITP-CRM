import db from '../database/db.js';

export const fetchTaleCallerData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized: No session' });
    }

    const { id: userId, role } = req.session.user;

    let query = `
      SELECT 
        rd.master_id,
        rd.name AS client_name,
        c.cat_name AS category,
        GROUP_CONCAT(p.product_name) AS products,
        a.assign_id,
        a.assign_date,
        a.target_date,
        rd.status AS call_status,
        MAX(tct.tc_remark) AS call_remark,
        MAX(tct.tc_call_duration) AS call_duration
      FROM raw_data rd
      INNER JOIN assignments a ON rd.assign_id = a.assign_id
      LEFT JOIN category c ON rd.cat_id = c.cat_id
      LEFT JOIN tele_caller_table tct ON rd.master_id = tct.master_id
      LEFT JOIN product_mapping pm ON rd.master_id = pm.master_id
      LEFT JOIN product p ON p.product_id = pm.product_id
      WHERE rd.status = 'Assigned'
    `;

    const params = [];

    if (role === 'tele-caller') {
      query += ` AND a.assigned_to_user_id = ?`;
      params.push(userId);
    }

    query += ' GROUP BY rd.master_id';

    const [results] = await db.query(query, params);

    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error in fetchTaleCallerData:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//get status from telecaller table

export const getTeleCallerStatus = async (req, res) => {
  try {
    const query = `SHOW COLUMNS FROM tele_caller_table WHERE Field = 'tc_status'`;
    const [rows] = await db.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Field not found' });
    }

    const enumStr = rows[0].Type;

    const values = enumStr
      .match(/enum\((.*)\)/)[1]
      .split(',')
      .map((value) => value.trim().replace(/^'(.*)'$/, '$1'));

    res.status(200).json(values);
  } catch (error) {
    console.error('Error fetching enum options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//get category from category table

export const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM category');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//get product from product table

export const getProductsByCategory = async (req, res) => {
  const { cat_id } = req.params;

  if (!cat_id) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT product_id, product_name FROM product WHERE cat_id = ? AND status = "active"',
      [cat_id],
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

//get status from raw data table

export const getRawDataStatus = async (req, res) => {
  try {
    const query = `
      SELECT COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'raw_data' AND COLUMN_NAME = 'status'
    `;

    const [result] = await db.query(query);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const enumStr = result[0].COLUMN_TYPE;
    const statusValues = enumStr
      .replace(/^enum\(/, '')
      .replace(/\)$/, '')
      .split(',')
      .map((val) => val.trim().replace(/^'/, '').replace(/'$/, ''));

    res.status(200).json(statusValues);
  } catch (error) {
    console.error('Error fetching status enum values:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//update telecaller

export const getAllCombinedRawData1 = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id: userId, role } = req.session.user;

    const query = `
      SELECT 
        rd.master_id,
        rd.name,
        rd.number,
        rd.email,
        rd.address,
        rd.area_id,
        rd.qualification,
        rd.passout_year,
        rd.cat_id,
        rd.reference_id,
        rd.source_id,
        rd.status,
        rd.lead_status,
        rd.assign_id,
        rd.created_by_user,
        rd.created_at,
        rd.lead_activity,

        a.area_name,
        c.cat_name,
        r.reference_name,
        s.source_name,

        ls.stage_id,
        ls.stage_name,
        lss.lead_sub_stage_id,
        lss.lead_sub_stage_name,

        -- ASSIGNMENT DETAILS
        asg.mode,
        asg.assign_date,
        asg.target_date,
        asg.assigned_to,
        asg.assigned_to_user_id,

        GROUP_CONCAT(DISTINCT p.product_name) AS products

      FROM raw_data rd
      LEFT JOIN assignments asg ON rd.assign_id = asg.assign_id
      LEFT JOIN area a ON rd.area_id = a.area_id
      LEFT JOIN category c ON rd.cat_id = c.cat_id
      LEFT JOIN reference r ON rd.reference_id = r.reference_id
      LEFT JOIN source s ON rd.source_id = s.source_id
      LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
      LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
      LEFT JOIN product_mapping pm ON pm.master_id = rd.master_id
      LEFT JOIN product p ON p.product_id = pm.product_id

      WHERE rd.status = 'Assigned'
        AND rd.lead_status = 'Inactive'
        ${role === 'tele-caller' ? 'AND asg.assigned_to_user_id = ?' : ''}

      GROUP BY rd.master_id
      ORDER BY rd.master_id DESC
    `;

    const params = role === 'tele-caller' ? [userId] : [];
    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('❌ getAllCombinedRawData Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// export const getAllCombinedRawData = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { id: userId, role } = req.session.user;

//     // Base query
//     let query = `
//       SELECT
//         rd.master_id,
//         rd.name,
//         rd.number,
//         rd.email,
//         rd.address,
//         rd.area_id,
//         rd.qualification,
//         rd.passout_year,
//         rd.cat_id,
//         rd.reference_id,
//         rd.source_id,
//         rd.status,
//         rd.lead_status,
//         rd.assign_id,
//         rd.created_by_user,
//         rd.created_at,
//         rd.lead_activity,

//         a.area_name,
//         c.cat_name,
//         r.reference_name,
//         s.source_name,

//         ls.stage_id,
//         ls.stage_name,
//         lss.lead_sub_stage_id,
//         lss.lead_sub_stage_name,

//         -- ASSIGNMENT DETAILS
//         asg.mode,
//         asg.assign_date,
//         asg.target_date,
//         asg.assigned_to,
//         asg.assigned_to_user_id,

//         GROUP_CONCAT(DISTINCT p.product_name) AS products

//       FROM raw_data rd
//       LEFT JOIN assignments asg ON rd.assign_id = asg.assign_id
//       LEFT JOIN area a ON rd.area_id = a.area_id
//       LEFT JOIN category c ON rd.cat_id = c.cat_id
//       LEFT JOIN reference r ON rd.reference_id = r.reference_id
//       LEFT JOIN source s ON rd.source_id = s.source_id
//       LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
//       LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
//       LEFT JOIN product_mapping pm ON pm.master_id = rd.master_id
//       LEFT JOIN product p ON p.product_id = pm.product_id

//       WHERE rd.status = 'Assigned'
//         AND rd.lead_status = 'Inactive'
//     `;

//     const params = [];

//     if (role === 'tele-caller') {
//       query += ' AND asg.assigned_to_user_id = ?';
//       params.push(userId);
//     } else if (role === 'team lead') {
//       // Get tele-caller IDs assigned to this team lead
//       const [assignedTeleCallers] = await db.query(
//         'SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?',
//         [userId]
//       );

//       const teleCallerIds = assignedTeleCallers.map(row => row.tele_caller_id);

//       if (teleCallerIds.length === 0) {
//         return res.json([]); // No assigned tele-callers
//       }

//       query += ` AND asg.assigned_to_user_id IN (${teleCallerIds.map(() => '?').join(',')})`;
//       params.push(...teleCallerIds);
//     }
//     // Admin sees all, no filter needed

//     query += `
//       GROUP BY rd.master_id
//       ORDER BY rd.master_id DESC
//     `;

//     const [rows] = await db.query(query, params);

//     res.json(rows);
//   } catch (error) {
//     console.error('❌ getAllCombinedRawData Error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

export const getAllCombinedRawData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id: userId, role } = req.session.user;

    let query = `
      SELECT 
        rd.master_id,
        rd.name,
        rd.number,
        rd.email,
        rd.address,
        rd.area_id,
        rd.qualification,
        rd.passout_year,
        rd.cat_id,
        rd.reference_id,
        rd.source_id,
        rd.status,
        rd.lead_status,
        rd.assign_id,
        rd.created_by_user,
        rd.created_at,
        rd.lead_activity,

        a.area_name,
        c.cat_name,
        r.reference_name,
        s.source_name,

        ls.stage_id,
        ls.stage_name,
        lss.lead_sub_stage_id,
        lss.lead_sub_stage_name,

        -- ASSIGNMENT DETAILS
        asg.mode,
        asg.assign_date,
        asg.target_date,
        asg.assigned_to,
        asg.assigned_to_user_id,

        GROUP_CONCAT(DISTINCT p.product_name) AS products

      FROM raw_data rd
      LEFT JOIN assignments asg ON rd.assign_id = asg.assign_id
      LEFT JOIN area a ON rd.area_id = a.area_id
      LEFT JOIN category c ON rd.cat_id = c.cat_id
      LEFT JOIN reference r ON rd.reference_id = r.reference_id
      LEFT JOIN source s ON rd.source_id = s.source_id
      LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
      LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
      LEFT JOIN product_mapping pm ON pm.master_id = rd.master_id
      LEFT JOIN product p ON p.product_id = pm.product_id

      WHERE rd.status = 'Assigned'
        AND rd.lead_status = 'Inactive'
    `;

    const params = [];

    if (role === 'tele-caller') {
      query += ' AND asg.assigned_to_user_id = ?';
      params.push(userId);
    } else if (role === 'team lead') {
      const [assignedTeleCallers] = await db.query(
        'SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?',
        [userId],
      );

      const teleCallerIds = assignedTeleCallers.map(
        (row) => row.tele_caller_id,
      );

      teleCallerIds.push(userId);

      query += ` AND asg.assigned_to_user_id IN (${teleCallerIds
        .map(() => '?')
        .join(',')})`;
      params.push(...teleCallerIds);
    }

    query += `
      GROUP BY rd.master_id
      ORDER BY rd.master_id DESC
    `;

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('❌ getAllCombinedRawData Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// export const getAllActiveAssignedRawData = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { id: userId, role } = req.session.user;

//     // Base query
//     let query = `
//       SELECT
//         rd.master_id,
//         rd.name,
//         rd.number,
//         rd.email,
//         rd.address,
//         rd.area_id,
//         rd.qualification,
//         rd.passout_year,
//         rd.cat_id,
//         rd.reference_id,
//         rd.source_id,
//         rd.status,
//         rd.lead_status,
//         rd.assign_id,
//         rd.created_by_user,
//         rd.created_at,
//         rd.lead_activity,
//         rd.call_remark,
//         rd.call_duration,

//         a.area_name,
//         c.cat_name,
//         r.reference_name,
//         s.source_name,

//         ls.stage_id,
//         ls.stage_name,
//         lss.lead_sub_stage_id,
//         lss.lead_sub_stage_name,

//         -- ASSIGNMENT DETAILS
//         asg.mode,
//         asg.assign_date,
//         asg.target_date,
//         asg.assigned_to,
//         asg.assigned_to_user_id,

//         GROUP_CONCAT(DISTINCT p.product_name) AS products

//       FROM raw_data rd
//       LEFT JOIN assignments asg ON rd.assign_id = asg.assign_id
//       LEFT JOIN area a ON rd.area_id = a.area_id
//       LEFT JOIN category c ON rd.cat_id = c.cat_id
//       LEFT JOIN reference r ON rd.reference_id = r.reference_id
//       LEFT JOIN source s ON rd.source_id = s.source_id
//       LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
//       LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
//       LEFT JOIN product_mapping pm ON pm.master_id = rd.master_id
//       LEFT JOIN product p ON p.product_id = pm.product_id

//       WHERE rd.status = 'Assigned'
//         AND rd.lead_status = 'Active'
//     `;

//     const params = [];

//     if (role === 'tele-caller') {
//       // Tele-caller sees only their own assignments
//       query += ' AND asg.assigned_to_user_id = ?';
//       params.push(userId);
//     } else if (role === 'team lead') {
//       // Team lead sees only tele-callers assigned to them
//       const [assignedTeleCallers] = await db.query(
//         'SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?',
//         [userId]
//       );

//       const teleCallerIds = assignedTeleCallers.map(row => row.tele_caller_id);

//       if (teleCallerIds.length === 0) {
//         return res.json([]); // No assigned tele-callers
//       }

//       query += ` AND asg.assigned_to_user_id IN (${teleCallerIds.map(() => '?').join(',')})`;
//       params.push(...teleCallerIds);
//     }
//     // Admin sees all, no filter needed

//     query += `
//       GROUP BY rd.master_id
//       ORDER BY rd.master_id DESC
//     `;

//     const [rows] = await db.query(query, params);

//     res.json(rows);
//   } catch (error) {
//     console.error('❌ getAllActiveAssignedRawData Error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// export const getAllActiveAssignedRawData = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { id: userId, role } = req.session.user;

//     // Base query
//     let query = `
//       SELECT
//         rd.master_id,
//         rd.name,
//         rd.number,
//         rd.email,
//         rd.address,
//         rd.area_id,
//         rd.qualification,
//         rd.passout_year,
//         rd.cat_id,
//         rd.reference_id,
//         rd.source_id,
//         rd.status,
//         rd.lead_status,
//         rd.assign_id,
//         rd.created_by_user,
//         rd.created_at,
//         rd.lead_activity,
//         rd.call_remark,
//         rd.call_duration,

//         a.area_name,
//         c.cat_name,
//         r.reference_name,
//         s.source_name,

//         ls.stage_id,
//         ls.stage_name,
//         lss.lead_sub_stage_id,
//         lss.lead_sub_stage_name,

//         -- ASSIGNMENT DETAILS
//         asg.mode,
//         asg.assign_date,
//         asg.target_date,
//         asg.assigned_to,
//         asg.assigned_to_user_id,

//         GROUP_CONCAT(DISTINCT p.product_name) AS products

//       FROM raw_data rd
//       LEFT JOIN assignments asg ON rd.assign_id = asg.assign_id
//       LEFT JOIN area a ON rd.area_id = a.area_id
//       LEFT JOIN category c ON rd.cat_id = c.cat_id
//       LEFT JOIN reference r ON rd.reference_id = r.reference_id
//       LEFT JOIN source s ON rd.source_id = s.source_id
//       LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
//       LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
//       LEFT JOIN product_mapping pm ON pm.master_id = rd.master_id
//       LEFT JOIN product p ON p.product_id = pm.product_id

//       WHERE rd.status = 'Assigned'
//         AND rd.lead_status = 'Active'
//     `;

//     const params = [];

//     if (role === 'tele-caller') {
//       // Tele-caller sees only their own assignments
//       query += ' AND asg.assigned_to_user_id = ?';
//       params.push(userId);
//     } else if (role === 'team lead') {
//       // Team lead sees tele-callers assigned to them + their own leads
//       const [assignedTeleCallers] = await db.query(
//         'SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?',
//         [userId],
//       );

//       const teleCallerIds = assignedTeleCallers.map(
//         (row) => row.tele_caller_id,
//       );

//       // Add the team lead's own userId to include self-assigned leads
//       teleCallerIds.push(userId);

//       query += ` AND asg.assigned_to_user_id IN (${teleCallerIds
//         .map(() => '?')
//         .join(',')})`;
//       params.push(...teleCallerIds);
//     }
//     // Admin sees all, no filter needed

//     query += `
//       GROUP BY rd.master_id
//       ORDER BY rd.master_id DESC
//     `;

//     const [rows] = await db.query(query, params);

//     res.json(rows);
//   } catch (error) {
//     console.error('❌ getAllActiveAssignedRawData Error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

export const getAllActiveAssignedRawData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id: userId, role } = req.session.user;

    let query = `
      SELECT 
        rd.master_id,
        rd.name,
        rd.number,
        rd.email,
        rd.address,
        rd.area_id,
        rd.qualification,
        rd.passout_year,
        rd.cat_id,
        rd.reference_id,
        rd.source_id,
        rd.status,
        rd.lead_status,
        rd.assign_id,
        rd.created_by_user,
        rd.created_at,
        rd.lead_activity,
        rd.call_remark,
        rd.call_duration,

        a.area_name,
        c.cat_name,
        r.reference_name,
        s.source_name,

        ls.stage_id,
        ls.stage_name,
        lss.lead_sub_stage_id,
        lss.lead_sub_stage_name,

        -- ASSIGNMENT DETAILS
        asg.mode,
        asg.assign_date,
        asg.target_date,
        asg.assigned_to,
        asg.assigned_to_user_id,

        GROUP_CONCAT(DISTINCT p.product_name) AS products,

        -- ✅ LAST MODIFIED DATE FROM LOGS
        MAX(lg.updated_at) AS last_modified_date

      FROM raw_data rd

      LEFT JOIN assignments asg 
        ON rd.assign_id = asg.assign_id

      LEFT JOIN area a 
        ON rd.area_id = a.area_id

      LEFT JOIN category c 
        ON rd.cat_id = c.cat_id

      LEFT JOIN reference r 
        ON rd.reference_id = r.reference_id

      LEFT JOIN source s 
        ON rd.source_id = s.source_id

      LEFT JOIN lead_stage ls 
        ON rd.lead_stage_id = ls.stage_id

      LEFT JOIN lead_sub_stage lss 
        ON rd.lead_sub_stage_id = lss.lead_sub_stage_id

      LEFT JOIN product_mapping pm 
        ON pm.master_id = rd.master_id

      LEFT JOIN product p 
        ON p.product_id = pm.product_id

      -- ✅ JOIN LOG TABLE
      LEFT JOIN lead_stage_logs lg
        ON lg.master_id = rd.master_id

      WHERE rd.status = 'Assigned'
        AND rd.lead_status = 'Active'
    `;

    const params = [];

    /* 🔐 ROLE BASED FILTER */
    if (role === 'tele-caller') {
      query += ' AND asg.assigned_to_user_id = ?';
      params.push(userId);
    } else if (role === 'team lead') {
      const [assignedTeleCallers] = await db.query(
        'SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?',
        [userId],
      );

      const teleCallerIds = assignedTeleCallers.map(
        (row) => row.tele_caller_id,
      );

      // include team lead himself
      teleCallerIds.push(userId);

      query += ` AND asg.assigned_to_user_id IN (${teleCallerIds
        .map(() => '?')
        .join(',')})`;

      params.push(...teleCallerIds);
    }
    // ✅ admin → no restriction

    query += `
      GROUP BY rd.master_id
      ORDER BY 
        MAX(lg.updated_at) DESC,
        rd.master_id DESC
    `;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('❌ getAllActiveAssignedRawData Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// export const updateTaleCallerData = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized: No session' });
//     }

//     const created_by_user = req.session.user.id;

//     const {
//       master_id,
//       cat_id,
//       client_name,
//       tc_status,
//       tc_remark,
//       tc_call_duration,
//       lead_stage_id,
//       lead_sub_stage_id,
//       selected_products = [],
//     } = req.body;

//     // ----------------------------
//     // 🔹 Get current lead record
//     // ----------------------------
//     const [[currentLead]] = await db.query(
//       `SELECT lead_stage_id, lead_sub_stage_id, status
//        FROM raw_data
//        WHERE master_id = ?`,
//       [master_id],
//     );

//     // ----------------------------
//     // 🔹 Determine Lead Status
//     // ----------------------------
//     let lead_status = 'Inactive';
//     if (currentLead?.status === 'Assigned') {
//       lead_status = 'Active';
//     }

//     // ----------------------------
//     // 🔹 Load previous stage names
//     // ----------------------------
//     let previous_leads = 'New Lead'; // default
//     let previous_sub_leads = 'Fresh Lead'; // default

//     if (currentLead?.lead_stage_id) {
//       const [[prevStage]] = await db.query(
//         `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
//         [currentLead.lead_stage_id],
//       );
//       previous_leads = prevStage?.stage_name || 'New Lead';
//     }

//     if (currentLead?.lead_sub_stage_id) {
//       const [[prevSubStage]] = await db.query(
//         `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
//         [currentLead.lead_sub_stage_id],
//       );
//       previous_sub_leads = prevSubStage?.lead_sub_stage_name || 'Fresh Lead';
//     }

//     // ----------------------------
//     // 🔹 Load new stage names
//     // ----------------------------
//     const [[newStage]] = await db.query(
//       `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
//       [lead_stage_id],
//     );
//     const new_leads = newStage?.stage_name || null;

//     const [[newSubStage]] = await db.query(
//       `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
//       [lead_sub_stage_id],
//     );
//     const new_sub_leads = newSubStage?.lead_sub_stage_name || null;

//     // ----------------------------
//     // 🔹 Update raw_data
//     // ----------------------------
//     await db.query(
//       `UPDATE raw_data SET
//           cat_id = ?,
//           name = ?,
//           call_remark = ?,
//           call_duration = ?,
//           lead_stage_id = ?,
//           lead_sub_stage_id = ?,
//           lead_status = ?
//        WHERE master_id = ?`,
//       [
//         cat_id,
//         client_name,
//         tc_remark,
//         tc_call_duration,
//         lead_stage_id,
//         lead_sub_stage_id,
//         lead_status,
//         master_id,
//       ],
//     );

//     // ----------------------------
//     // 🔹 Replace product mapping
//     // ----------------------------
//     await db.query(`DELETE FROM product_mapping WHERE master_id = ?`, [
//       master_id,
//     ]);

//     if (selected_products.length > 0) {
//       const mappingValues = selected_products.map((prodId) => [
//         master_id,
//         prodId,
//         cat_id,
//         created_by_user,
//       ]);

//       await db.query(
//         `INSERT INTO product_mapping
//          (master_id, product_id, cat_id, created_by_user)
//          VALUES ?`,
//         [mappingValues],
//       );
//     }

//     // ----------------------------
//     // 🔹 Insert log with correct previous/new values
//     // ----------------------------
//     await db.query(
//       `INSERT INTO lead_stage_logs
//         (master_id, previous_leads, previous_sub_leads, new_leads, new_sub_leads, remark)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [
//         master_id,
//         previous_leads,
//         previous_sub_leads,
//         new_leads,
//         new_sub_leads,
//         tc_remark || null,
//       ],
//     );

//     return res.json({
//       message: 'Telecaller updated successfully',
//       updated_master_id: master_id,
//       products_saved: selected_products.length,
//       log_inserted: true,
//       lead_status_updated: lead_status,
//     });
//   } catch (error) {
//     console.error('Update telecaller error:', error);
//     return res.status(500).json({
//       message: 'Internal server error',
//       error: error.message,
//     });
//   }
// };

// export const updateTaleCallerData = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized: No session' });
//     }

//     const created_by_user = req.session.user.id;

//     const {
//       master_id,
//       cat_id,
//       client_name,
//       tc_status,
//       tc_remark,
//       tc_call_duration,
//       lead_stage_id,
//       lead_sub_stage_id,
//       selected_products = [],
//     } = req.body;

//     /* ------------------------------------------------
//        1️⃣ Fetch current lead + assignment
//     ------------------------------------------------ */
//     const [[currentLead]] = await db.query(
//       `SELECT
//           rd.lead_stage_id,
//           rd.lead_sub_stage_id,
//           rd.status,
//           a.assigned_to_user_id
//        FROM raw_data rd
//        LEFT JOIN assignments a ON rd.assign_id = a.assign_id
//        WHERE rd.master_id = ?`,
//       [master_id],
//     );

//     if (!currentLead) {
//       return res.status(404).json({ message: 'Lead not found' });
//     }

//     const previousAssignedUserId = currentLead.assigned_to_user_id || null;

//     /* ------------------------------------------------
//        2️⃣ Determine lead_status
//     ------------------------------------------------ */
//     let lead_status = 'Inactive';
//     if (currentLead.status === 'Assigned') {
//       lead_status = 'Active';
//     }

//     /* ------------------------------------------------
//        3️⃣ Load previous stage names
//     ------------------------------------------------ */
//     let previous_leads = 'New Lead';
//     let previous_sub_leads = 'Fresh Lead';

//     if (currentLead.lead_stage_id) {
//       const [[prevStage]] = await db.query(
//         `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
//         [currentLead.lead_stage_id],
//       );
//       previous_leads = prevStage?.stage_name || previous_leads;
//     }

//     if (currentLead.lead_sub_stage_id) {
//       const [[prevSubStage]] = await db.query(
//         `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
//         [currentLead.lead_sub_stage_id],
//       );
//       previous_sub_leads =
//         prevSubStage?.lead_sub_stage_name || previous_sub_leads;
//     }

//     /* ------------------------------------------------
//        4️⃣ Load new stage names
//     ------------------------------------------------ */
//     const [[newStage]] = await db.query(
//       `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
//       [lead_stage_id],
//     );

//     const [[newSubStage]] = await db.query(
//       `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
//       [lead_sub_stage_id],
//     );

//     /* ------------------------------------------------
//        5️⃣ Update raw_data
//     ------------------------------------------------ */
//     await db.query(
//       `UPDATE raw_data SET
//           cat_id = ?,
//           name = ?,
//           call_remark = ?,
//           call_duration = ?,
//           lead_stage_id = ?,
//           lead_sub_stage_id = ?,
//           lead_status = ?
//        WHERE master_id = ?`,
//       [
//         cat_id,
//         client_name,
//         tc_remark,
//         tc_call_duration,
//         lead_stage_id,
//         lead_sub_stage_id,
//         lead_status,
//         master_id,
//       ],
//     );

//     /* ------------------------------------------------
//        6️⃣ Replace product mapping
//     ------------------------------------------------ */
//     await db.query(`DELETE FROM product_mapping WHERE master_id = ?`, [
//       master_id,
//     ]);

//     if (selected_products.length > 0) {
//       const mappingValues = selected_products.map((prodId) => [
//         master_id,
//         prodId,
//         cat_id,
//         created_by_user,
//       ]);

//       await db.query(
//         `INSERT INTO product_mapping
//          (master_id, product_id, cat_id, created_by_user)
//          VALUES ?`,
//         [mappingValues],
//       );
//     }

//     /* ------------------------------------------------
//        7️⃣ INSERT LOG (🔥 IMPORTANT CHANGE HERE)
//     ------------------------------------------------ */
//     await db.query(
//       `INSERT INTO lead_stage_logs
//         (
//           master_id,
//           previous_leads,
//           previous_sub_leads,
//           new_leads,
//           new_sub_leads,
//           remark,
//           previous_assigned_user_id
//         )
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [
//         master_id,
//         previous_leads,
//         previous_sub_leads,
//         newStage?.stage_name || null,
//         newSubStage?.lead_sub_stage_name || null,
//         tc_remark || null,
//         previousAssignedUserId,
//       ],
//     );

//     return res.json({
//       success: true,
//       message: 'Telecaller updated successfully',
//       updated_master_id: master_id,
//       products_saved: selected_products.length,
//       log_inserted: true,
//       previous_assigned_user_id: previousAssignedUserId,
//     });
//   } catch (error) {
//     console.error('❌ Update telecaller error:', error);
//     return res.status(500).json({
//       message: 'Internal server error',
//       error: error.message,
//     });
//   }
// };

export const fetchUnassignedTeleCallers = async (req, res) => {
  try {
    const query = `
      SELECT u.user_id, u.name
      FROM users u
      LEFT JOIN team_lead_assignment tla
        ON u.user_id = tla.tele_caller_id
      WHERE tla.tele_caller_id IS NULL
      AND u.role = 'tele-caller'
    `;

    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error fetching unassigned tele-callers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const assignTeleCallersToLead = async (req, res) => {
  try {
    const { lead_id, tele_caller_ids } = req.body;

    if (
      !lead_id ||
      !Array.isArray(tele_caller_ids) ||
      !tele_caller_ids.length
    ) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    // Prepare bulk insert values
    const values = tele_caller_ids.map((tcId) => [lead_id, tcId]);

    const query = `
      INSERT INTO team_lead_assignment (lead_id, tele_caller_id)
      VALUES ?
    `;

    await db.query(query, [values]);

    res.status(200).json({
      message: 'Tele-callers assigned successfully',
    });
  } catch (error) {
    console.error('❌ Error assigning tele-callers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeleCallerCountByLead = async (req, res) => {
  try {
    const { lead_id } = req.params;

    if (!lead_id) {
      return res.status(400).json({ message: 'lead_id is required' });
    }

    const query = `
      SELECT 
        u.user_id AS lead_id,
        u.name AS lead_name,
        COUNT(tla.tele_caller_id) AS tele_caller_count,
        GROUP_CONCAT(tc.name SEPARATOR ', ') AS tele_caller_names
      FROM team_lead_assignment tla
      INNER JOIN users u 
        ON u.user_id = tla.lead_id
      LEFT JOIN users tc
        ON tc.user_id = tla.tele_caller_id
      WHERE tla.lead_id = ?
      GROUP BY tla.lead_id
    `;

    const [results] = await db.query(query, [lead_id]);

    res.status(200).json(
      results[0] || {
        lead_id,
        lead_name: null,
        tele_caller_count: 0,
        tele_caller_names: '',
      },
    );
  } catch (error) {
    console.error('❌ Error fetching tele-caller count and names:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE removeTeleCallerFromLead

export const removeTeleCallerFromLead = async (req, res) => {
  try {
    const { tele_caller_id } = req.params;

    if (!tele_caller_id) {
      return res.status(400).json({ message: 'tele_caller_id is required' });
    }

    const query = `
      DELETE FROM team_lead_assignment
      WHERE tele_caller_id = ?
    `;

    const [result] = await db.query(query, [tele_caller_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Tele-caller removed successfully' });
  } catch (error) {
    console.error('❌ Error removing tele-caller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeamLeadWithTeleCallers = async (req, res) => {
  try {
    const { lead_id } = req.params;

    // Optional filter for a specific team lead
    let leadFilter = '';
    const params = [];
    if (lead_id) {
      leadFilter = 'WHERE u.user_id = ?';
      params.push(lead_id);
    }

    const query = `
      SELECT
        u.user_id AS lead_id,
        u.name AS lead_name,
        tc.user_id AS tele_caller_id,
        tc.name AS tele_caller_name,
        COUNT(a.assign_id) AS total_assigned_leads,
        SUM(CASE WHEN rd.lead_status = 'Active' THEN 1 ELSE 0 END) AS active_count,
        SUM(CASE WHEN rd.lead_status = 'Inactive' THEN 1 ELSE 0 END) AS inactive_count,
        SUM(CASE WHEN rd.lead_status = 'Lose' THEN 1 ELSE 0 END) AS lose_count,
        SUM(CASE WHEN rd.lead_status = 'Win' THEN 1 ELSE 0 END) AS win_count,
        SUM(CASE WHEN rd.lead_status = 'Invalid' THEN 1 ELSE 0 END) AS invalid_count
      FROM team_lead_assignment tla
      INNER JOIN users u ON u.user_id = tla.lead_id
      LEFT JOIN users tc ON tc.user_id = tla.tele_caller_id
      LEFT JOIN assignments a 
        ON a.assigned_to_user_id = tc.user_id
      LEFT JOIN raw_data rd 
        ON rd.assign_id = a.assign_id
        AND rd.status = 'Assigned'
        AND rd.lead_status IN ('Active','Inactive','Lose','Win','Invalid')
      ${leadFilter}
      GROUP BY u.user_id, tc.user_id
      ORDER BY u.user_id, tc.user_id
    `;

    const [results] = await db.query(query, params);

    // Transform results into nested structure: team lead -> tele-callers
    const leadMap = {};
    results.forEach((row) => {
      if (!leadMap[row.lead_id]) {
        leadMap[row.lead_id] = {
          lead_id: row.lead_id,
          lead_name: row.lead_name,
          tele_callers: [],
        };
      }

      if (row.tele_caller_id) {
        leadMap[row.lead_id].tele_callers.push({
          tele_caller_id: row.tele_caller_id,
          tele_caller_name: row.tele_caller_name,
          total_assigned_leads: Number(row.total_assigned_leads),
          active_count: Number(row.active_count),
          inactive_count: Number(row.inactive_count),
          lose_count: Number(row.lose_count),
          win_count: Number(row.win_count),
          invalid_count: Number(row.invalid_count),
        });
      }
    });

    res.status(200).json(Object.values(leadMap));
  } catch (error) {
    console.error('❌ Error fetching team leads with tele-callers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// export const updateTaleCallerData = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized: No session' });
//     }

//     const created_by_user = req.session.user.id;

//     const {
//       master_id,
//       cat_id,
//       client_name,
//       tc_status,
//       tc_remark,
//       tc_call_duration,
//       lead_stage_id,
//       lead_sub_stage_id,
//       selected_products = [],
//       follow_up_date,
//       follow_up_time,
//     } = req.body;

//     /* ------------------------------------------------
//        1️⃣ Fetch current lead + assignment
//     ------------------------------------------------ */
//     const [[currentLead]] = await db.query(
//       `SELECT
//           rd.lead_stage_id,
//           rd.lead_sub_stage_id,
//           rd.status,
//           a.assigned_to_user_id
//        FROM raw_data rd
//        LEFT JOIN assignments a ON rd.assign_id = a.assign_id
//        WHERE rd.master_id = ?`,
//       [master_id],
//     );

//     if (!currentLead) {
//       return res.status(404).json({ message: 'Lead not found' });
//     }

//     const previousAssignedUserId = currentLead.assigned_to_user_id || null;

//     /* ------------------------------------------------
//        2️⃣ Determine lead_status
//     ------------------------------------------------ */
//     let lead_status = 'Inactive';
//     if (currentLead.status === 'Assigned') {
//       lead_status = 'Active';
//     }

//     /* ------------------------------------------------
//        3️⃣ Load previous stage names
//     ------------------------------------------------ */
//     let previous_leads = 'New Lead';
//     let previous_sub_leads = 'Fresh Lead';

//     if (currentLead.lead_stage_id) {
//       const [[prevStage]] = await db.query(
//         `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
//         [currentLead.lead_stage_id],
//       );
//       previous_leads = prevStage?.stage_name || previous_leads;
//     }

//     if (currentLead.lead_sub_stage_id) {
//       const [[prevSubStage]] = await db.query(
//         `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
//         [currentLead.lead_sub_stage_id],
//       );
//       previous_sub_leads =
//         prevSubStage?.lead_sub_stage_name || previous_sub_leads;
//     }

//     /* ------------------------------------------------
//        4️⃣ Load new stage names (SAFE)
//     ------------------------------------------------ */
//     let newStageName = null;
//     let newSubStageName = null;

//     if (lead_stage_id) {
//       const [[newStage]] = await db.query(
//         `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
//         [lead_stage_id],
//       );
//       newStageName = newStage?.stage_name || null;
//     }

//     if (lead_sub_stage_id) {
//       const [[newSubStage]] = await db.query(
//         `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
//         [lead_sub_stage_id],
//       );
//       newSubStageName = newSubStage?.lead_sub_stage_name || null;
//     }

//     /* ------------------------------------------------
//        ✅ 5️⃣ SAFE VALUES (FK FIX)
//     ------------------------------------------------ */
//     const safeLeadStageId =
//       lead_stage_id && lead_stage_id !== '' ? lead_stage_id : null;

//     const safeLeadSubStageId =
//       lead_sub_stage_id && lead_sub_stage_id !== '' ? lead_sub_stage_id : null;

//     /* ------------------------------------------------
//        6️⃣ Update raw_data (FK SAFE)
//     ------------------------------------------------ */
//     await db.query(
//       `UPDATE raw_data SET
//           cat_id = ?,
//           name = ?,
//           call_remark = ?,
//           call_duration = ?,
//            follow_up_date = ?,
//            follow_up_time = ?,
//           lead_stage_id = ?,
//           lead_sub_stage_id = ?,
//           lead_status = ?
//        WHERE master_id = ?`,
//       [
//         cat_id || null,
//         client_name,
//         tc_remark || null,
//         tc_call_duration || null,
//         follow_up_date || null,
//         follow_up_time || null,
//         safeLeadStageId,
//         safeLeadSubStageId,
//         lead_status,
//         master_id,
//       ],
//     );

//     /* ------------------------------------------------
//        7️⃣ Replace product mapping
//     ------------------------------------------------ */
//     await db.query(`DELETE FROM product_mapping WHERE master_id = ?`, [
//       master_id,
//     ]);

//     if (selected_products.length > 0) {
//       const mappingValues = selected_products.map((prodId) => [
//         master_id,
//         prodId,
//         cat_id,
//         created_by_user,
//       ]);

//       await db.query(
//         `INSERT INTO product_mapping
//          (master_id, product_id, cat_id, created_by_user)
//          VALUES ?`,
//         [mappingValues],
//       );
//     }

//     /* ------------------------------------------------
//        8️⃣ Insert lead stage log
//     ------------------------------------------------ */
//     await db.query(
//       `INSERT INTO lead_stage_logs
//         (
//           master_id,
//           previous_leads,
//           previous_sub_leads,
//           new_leads,
//           new_sub_leads,
//           remark,
//           previous_assigned_user_id
//         )
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [
//         master_id,
//         previous_leads,
//         previous_sub_leads,
//         newStageName,
//         newSubStageName,
//         tc_remark || null,
//         previousAssignedUserId,
//       ],
//     );

//     return res.json({
//       success: true,
//       message: 'Telecaller updated successfully',
//       updated_master_id: master_id,
//       products_saved: selected_products.length,
//       log_inserted: true,
//       previous_assigned_user_id: previousAssignedUserId,
//     });
//   } catch (error) {
//     console.error('❌ Update telecaller error:', error);
//     return res.status(500).json({
//       message: 'Internal server error',
//       error: error.message,
//     });
//   }
// };

export const updateTaleCallerData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized: No session' });
    }

    const created_by_user = req.session.user.id;

    const {
      master_id,
      cat_id,
      client_name,
      tc_status,
      tc_remark,
      tc_call_duration,
      lead_stage_id,
      lead_sub_stage_id,
      selected_products = [],
      follow_up_date,
      follow_up_time,
    } = req.body;

    /* ------------------------------------------------
       ✅ DATE FORMATTER (TIMEZONE SAFE)
    ------------------------------------------------ */
    const formatDateForMySQL = (date) => {
      if (!date) return null;
      // Accepts: "YYYY-MM-DD" OR "YYYY-MM-DD HH:mm:ss"
      return date.split(' ')[0]; // always YYYY-MM-DD
    };

    /* ------------------------------------------------
       1️⃣ Fetch current lead + assignment
    ------------------------------------------------ */
    const [[currentLead]] = await db.query(
      `SELECT 
          rd.lead_stage_id,
          rd.lead_sub_stage_id,
          rd.status,
          a.assigned_to_user_id
       FROM raw_data rd
       LEFT JOIN assignments a ON rd.assign_id = a.assign_id
       WHERE rd.master_id = ?`,
      [master_id],
    );

    if (!currentLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const previousAssignedUserId = currentLead.assigned_to_user_id || null;

    /* ------------------------------------------------
       2️⃣ Determine lead_status
    ------------------------------------------------ */
    let lead_status = 'Inactive';
    if (currentLead.status === 'Assigned') {
      lead_status = 'Active';
    }

    /* ------------------------------------------------
       3️⃣ Load previous stage names
    ------------------------------------------------ */
    let previous_leads = 'New Lead';
    let previous_sub_leads = 'Fresh Lead';

    if (currentLead.lead_stage_id) {
      const [[prevStage]] = await db.query(
        `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
        [currentLead.lead_stage_id],
      );
      previous_leads = prevStage?.stage_name || previous_leads;
    }

    if (currentLead.lead_sub_stage_id) {
      const [[prevSubStage]] = await db.query(
        `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
        [currentLead.lead_sub_stage_id],
      );
      previous_sub_leads =
        prevSubStage?.lead_sub_stage_name || previous_sub_leads;
    }

    /* ------------------------------------------------
       4️⃣ Load new stage names
    ------------------------------------------------ */
    let newStageName = null;
    let newSubStageName = null;

    if (lead_stage_id) {
      const [[newStage]] = await db.query(
        `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
        [lead_stage_id],
      );
      newStageName = newStage?.stage_name || null;
    }

    if (lead_sub_stage_id) {
      const [[newSubStage]] = await db.query(
        `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
        [lead_sub_stage_id],
      );
      newSubStageName = newSubStage?.lead_sub_stage_name || null;
    }

    /* ------------------------------------------------
       5️⃣ SAFE FK VALUES
    ------------------------------------------------ */
    const safeLeadStageId =
      lead_stage_id && lead_stage_id !== '' ? lead_stage_id : null;

    const safeLeadSubStageId =
      lead_sub_stage_id && lead_sub_stage_id !== '' ? lead_sub_stage_id : null;

    /* ------------------------------------------------
       ✅ 6️⃣ UPDATE raw_data (DATE FIX APPLIED)
    ------------------------------------------------ */
    await db.query(
      `UPDATE raw_data SET 
          cat_id = ?, 
          name = ?, 
          call_remark = ?, 
          call_duration = ?, 
          follow_up_date = ?, 
          follow_up_time = ?,  
          lead_stage_id = ?, 
          lead_sub_stage_id = ?, 
          lead_status = ?
       WHERE master_id = ?`,
      [
        cat_id || null,
        client_name,
        tc_remark || null,
        tc_call_duration || null,
        formatDateForMySQL(follow_up_date), // ✅ FIXED
        follow_up_time || null,
        safeLeadStageId,
        safeLeadSubStageId,
        lead_status,
        master_id,
      ],
    );

    /* ------------------------------------------------
       7️⃣ Replace product mapping
    ------------------------------------------------ */
    await db.query(`DELETE FROM product_mapping WHERE master_id = ?`, [
      master_id,
    ]);

    if (selected_products.length > 0) {
      const mappingValues = selected_products.map((prodId) => [
        master_id,
        prodId,
        cat_id,
        created_by_user,
      ]);

      await db.query(
        `INSERT INTO product_mapping 
         (master_id, product_id, cat_id, created_by_user) 
         VALUES ?`,
        [mappingValues],
      );
    }

    /* ------------------------------------------------
       8️⃣ Insert lead stage log
    ------------------------------------------------ */
    await db.query(
      `INSERT INTO lead_stage_logs 
        (
          master_id,
          previous_leads,
          previous_sub_leads,
          new_leads,
          new_sub_leads,
          remark,
          previous_assigned_user_id
        )
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        master_id,
        previous_leads,
        previous_sub_leads,
        newStageName,
        newSubStageName,
        tc_remark || null,
        previousAssignedUserId,
      ],
    );

    return res.json({
      success: true,
      message: 'Telecaller updated successfully',
      updated_master_id: master_id,
      products_saved: selected_products.length,
      log_inserted: true,
      previous_assigned_user_id: previousAssignedUserId,
    });
  } catch (error) {
    console.error('❌ Update telecaller error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getAllMetaData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        md.meta_id,
        md.name,
        md.number,
        md.email,
        md.address,
        md.area_id,
        md.qualification,
        md.passout_year,
        md.fb_lead_id,
        md.form_id,
        md.page_id,
        md.cat_id,
        md.reference_id,
        md.source_id,
        s.source_name,         -- get source name
        md.status,
        md.lead_status,
        md.assign_id,
        md.created_by_user,
        md.created_at,
        md.lead_activity,
        md.call_duration,
        md.call_remark,

        -- stage info
        md.lead_stage_id,
        ls.stage_name,

        -- sub stage info
        md.lead_sub_stage_id,
        lss.lead_sub_stage_name

      FROM meta_data md
      LEFT JOIN lead_stage ls 
        ON md.lead_stage_id = ls.stage_id
      LEFT JOIN lead_sub_stage lss 
        ON md.lead_sub_stage_id = lss.lead_sub_stage_id
      LEFT JOIN source s
        ON md.source_id = s.source_id

      ORDER BY md.meta_id ASC
    `);

    return res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error('Error fetching meta_data:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch meta leads',
      error: err.message,
    });
  }
};

// export const assignLeads = async (req, res) => {
//   const connection = await db.getConnection();

//   try {
//     /* ===============================
//        AUTH CHECK
//     =============================== */
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { id: createdByUserId } = req.session.user;

//     const {
//       leadIds,
//       userId,
//       userName,
//       mode = 'manual',
//       assignType = 'single', // single | team
//       catId = null,
//       assignDate = null,
//       targetDate = null,
//       remark = '',
//     } = req.body;

//     if (!Array.isArray(leadIds) || !leadIds.length) {
//       return res.status(400).json({ message: 'No leads selected' });
//     }

//     await connection.beginTransaction();

//     /* ===============================
//        1️⃣ FETCH ASSIGNED USER
//     =============================== */
//     const [[assignedUser]] = await connection.query(
//       `SELECT user_id, name, role FROM users WHERE user_id = ?`,
//       [userId],
//     );

//     if (!assignedUser) {
//       throw new Error('Assigned user not found');
//     }

//     const isTeamLead = assignedUser.role === 'team lead';

//     /* ===============================
//        2️⃣ GET DEFAULT LEAD STAGE IDS
//     =============================== */
//     const [[leadStage]] = await connection.query(
//       `SELECT stage_id FROM lead_stage WHERE stage_name = 'New Lead' LIMIT 1`,
//     );

//     const [[leadSubStage]] = await connection.query(
//       `SELECT lead_sub_stage_id
//        FROM lead_sub_stage
//        WHERE lead_sub_stage_name = 'Auto-Import'
//        LIMIT 1`,
//     );

//     if (!leadStage || !leadSubStage) {
//       throw new Error('Lead stage or sub-stage not configured');
//     }

//     const leadStageId = leadStage.stage_id;
//     const leadSubStageId = leadSubStage.lead_sub_stage_id;

//     /* ===============================
//        3️⃣ BUILD ASSIGNMENT USER LIST
//     =============================== */
//     let assignmentUsers = [];

//     if (isTeamLead && assignType === 'team') {
//       const [telecallers] = await connection.query(
//         `
//         SELECT u.user_id, u.name
//         FROM team_lead_assignment tla
//         JOIN users u ON u.user_id = tla.tele_caller_id
//         WHERE tla.lead_id = ?
//         `,
//         [userId],
//       );

//       if (!telecallers.length) {
//         throw new Error('No telecallers assigned to this team lead');
//       }

//       assignmentUsers = [
//         { user_id: assignedUser.user_id, name: assignedUser.name },
//         ...telecallers,
//       ];
//     } else {
//       assignmentUsers = [
//         { user_id: assignedUser.user_id, name: assignedUser.name },
//       ];
//     }

//     /* ===============================
//        4️⃣ ASSIGN LEADS (ROUND ROBIN)
//     =============================== */
//     let userIndex = 0;

//     for (const metaId of leadIds) {
//       const assignee = assignmentUsers[userIndex % assignmentUsers.length];
//       userIndex++;

//       /* ---- INSERT INTO assignments ---- */
//       const [assignmentResult] = await connection.query(
//         `
//         INSERT INTO assignments
//         (
//           created_by_user, mode, cat_id, assign_date, target_date,
//           remark, assigned_to, assigned_to_user_id,
//           lead_count, assign_type
//         )
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
//         `,
//         [
//           createdByUserId,
//           mode,
//           catId,
//           assignDate,
//           targetDate,
//           remark,
//           assignee.name,
//           assignee.user_id,
//           assignType === 'team' ? 'team' : 'manual',
//         ],
//       );

//       const assignId = assignmentResult.insertId;

//       /* ---- MOVE meta_data → raw_data (❗ STAGE SAFE) ---- */
//       await connection.query(
//         `
//         INSERT INTO raw_data
//         (
//           name, number, email, address, area_id, qualification, passout_year,
//           fb_lead_id, form_id, page_id, cat_id, reference_id, source_id,
//           status, lead_status, assign_id, created_by_user, created_at,
//           lead_stage_id, lead_sub_stage_id
//         )
//         SELECT
//           name, number, email, address, area_id, qualification, passout_year,
//           fb_lead_id, form_id, page_id, cat_id, reference_id, source_id,
//           'Assigned',
//           'Inactive',
//           ?,                 -- assign_id
//           ?,                 -- created_by_user
//           NOW(),
//           COALESCE(lead_stage_id, ?),
//           COALESCE(lead_sub_stage_id, ?)
//         FROM meta_data
//         WHERE meta_id = ?
//         `,
//         [
//           assignId,
//           createdByUserId,
//           leadStageId, // fallback ONLY if NULL
//           leadSubStageId, // fallback ONLY if NULL
//           metaId,
//         ],
//       );

//       /* ---- DELETE FROM meta_data ---- */
//       await connection.query(`DELETE FROM meta_data WHERE meta_id = ?`, [
//         metaId,
//       ]);
//     }

//     await connection.commit();

//     return res.json({
//       success: true,
//       message:
//         assignType === 'team'
//           ? 'Leads distributed to Team Lead and Telecallers'
//           : 'Leads assigned successfully',
//       totalLeads: leadIds.length,
//     });
//   } catch (error) {
//     await connection.rollback();
//     console.error('❌ Assign leads error:', error);

//     return res.status(500).json({
//       success: false,
//       message: 'Assign leads failed',
//       error: error.message,
//     });
//   } finally {
//     connection.release();
//   }
// };

export const assignLeads = async (req, res) => {
  const connection = await db.getConnection();

  try {
    /* ===============================
       AUTH CHECK
    =============================== */
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id: createdByUserId } = req.session.user;

    const {
      leadIds,
      userIds = [], // ⭐ changed
      mode = 'manual',
      assignType = 'single', // single | team
      catId = null,
      assignDate = null,
      targetDate = null,
      remark = '',
    } = req.body;

    if (!Array.isArray(leadIds) || !leadIds.length) {
      return res.status(400).json({ message: 'No leads selected' });
    }

    if (!Array.isArray(userIds) || !userIds.length) {
      return res.status(400).json({ message: 'No users selected' });
    }

    await connection.beginTransaction();

    /* ===============================
       1️⃣ FETCH SELECTED USERS
    =============================== */
    const [selectedUsers] = await connection.query(
      `
      SELECT user_id, name, role
      FROM users
      WHERE user_id IN (?)
      `,
      [userIds],
    );

    if (!selectedUsers.length) {
      throw new Error('Selected users not found');
    }

    /* ===============================
       2️⃣ GET DEFAULT LEAD STAGE IDS
    =============================== */
    const [[leadStage]] = await connection.query(
      `SELECT stage_id FROM lead_stage WHERE stage_name = 'New Lead' LIMIT 1`,
    );

    const [[leadSubStage]] = await connection.query(
      `
      SELECT lead_sub_stage_id
      FROM lead_sub_stage
      WHERE lead_sub_stage_name = 'Auto-Import'
      LIMIT 1
      `,
    );

    if (!leadStage || !leadSubStage) {
      throw new Error('Lead stage or sub-stage not configured');
    }

    const leadStageId = leadStage.stage_id;
    const leadSubStageId = leadSubStage.lead_sub_stage_id;

    /* ===============================
       3️⃣ BUILD ASSIGNMENT USER LIST
       (MULTI TEAM SUPPORT)
    =============================== */
    let assignmentUsers = [];

    for (const user of selectedUsers) {
      if (user.role === 'team lead' && assignType === 'team') {
        const [telecallers] = await connection.query(
          `
          SELECT u.user_id, u.name
          FROM team_lead_assignment tla
          JOIN users u ON u.user_id = tla.tele_caller_id
          WHERE tla.lead_id = ?
          `,
          [user.user_id],
        );

        if (!telecallers.length) {
          throw new Error(`No telecallers assigned to team lead: ${user.name}`);
        }

        assignmentUsers.push(
          { user_id: user.user_id, name: user.name }, // team lead
          ...telecallers, // telecallers
        );
      } else {
        assignmentUsers.push({
          user_id: user.user_id,
          name: user.name,
        });
      }
    }

    // ❗ remove duplicates (if same telecaller in 2 teams)
    assignmentUsers = Array.from(
      new Map(assignmentUsers.map((u) => [u.user_id, u])).values(),
    );

    /* ===============================
       4️⃣ ASSIGN LEADS (ROUND ROBIN)
    =============================== */
    let userIndex = 0;

    for (const metaId of leadIds) {
      const assignee = assignmentUsers[userIndex % assignmentUsers.length];
      userIndex++;

      /* ---- INSERT INTO assignments ---- */
      const [assignmentResult] = await connection.query(
        `
        INSERT INTO assignments
        (
          created_by_user, mode, cat_id, assign_date, target_date,
          remark, assigned_to, assigned_to_user_id,
          lead_count, assign_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `,
        [
          createdByUserId,
          mode,
          catId,
          assignDate,
          targetDate,
          remark,
          assignee.name,
          assignee.user_id,
          assignType === 'team' ? 'team' : 'manual',
        ],
      );

      const assignId = assignmentResult.insertId;

      /* ---- MOVE meta_data → raw_data ---- */
      await connection.query(
        `
        INSERT INTO raw_data
        (
          name, number, email, address, area_id, qualification, passout_year,
          fb_lead_id, form_id, page_id, cat_id, reference_id, source_id,
          status, lead_status, assign_id, created_by_user, created_at,
          lead_stage_id, lead_sub_stage_id
        )
        SELECT
          name, number, email, address, area_id, qualification, passout_year,
          fb_lead_id, form_id, page_id, cat_id, reference_id, source_id,
          'Assigned',
          'Inactive',
          ?,
          ?,
          NOW(),
          COALESCE(lead_stage_id, ?),
          COALESCE(lead_sub_stage_id, ?)
        FROM meta_data
        WHERE meta_id = ?
        `,
        [assignId, createdByUserId, leadStageId, leadSubStageId, metaId],
      );

      /* ---- DELETE meta_data ---- */
      await connection.query(`DELETE FROM meta_data WHERE meta_id = ?`, [
        metaId,
      ]);
    }

    await connection.commit();

    return res.json({
      success: true,
      message:
        assignType === 'team'
          ? 'Leads distributed across selected teams'
          : 'Leads assigned successfully',
      totalLeads: leadIds.length,
      totalUsers: assignmentUsers.length,
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Assign leads error:', error);

    return res.status(500).json({
      success: false,
      message: 'Assign leads failed',
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// export const transferLeads = async (req, res) => {
//   const connection = await db.getConnection();

//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const {
//       leadIds,
//       userIds = [], // ⭐ changed
//       remark,
//       assignType = 'single',
//     } = req.body;

//     if (
//       !Array.isArray(leadIds) ||
//       !leadIds.length ||
//       !Array.isArray(userIds) ||
//       !userIds.length
//     ) {
//       return res.status(400).json({ message: 'Invalid request' });
//     }

//     await connection.beginTransaction();

//     /* ===============================
//        1️⃣ FETCH TARGET USERS
//     =============================== */
//     const [selectedUsers] = await connection.query(
//       `
//       SELECT user_id, name, role
//       FROM users
//       WHERE user_id IN (?)
//       `,
//       [userIds],
//     );

//     if (!selectedUsers.length) {
//       throw new Error('Target users not found');
//     }

//     /* ===============================
//        2️⃣ BUILD ASSIGNMENT USERS
//        (MULTI TEAM SUPPORT)
//     =============================== */
//     let assignmentUsers = [];

//     for (const user of selectedUsers) {
//       if (user.role === 'team lead' && assignType === 'team') {
//         const [telecallers] = await connection.query(
//           `
//           SELECT u.user_id, u.name
//           FROM team_lead_assignment tla
//           JOIN users u ON u.user_id = tla.tele_caller_id
//           WHERE tla.lead_id = ?
//           `,
//           [user.user_id],
//         );

//         assignmentUsers.push(
//           { user_id: user.user_id, name: user.name }, // team lead
//           ...telecallers, // telecallers
//         );
//       } else {
//         assignmentUsers.push({
//           user_id: user.user_id,
//           name: user.name,
//         });
//       }
//     }

//     // ❗ remove duplicate users (same telecaller in multiple teams)
//     assignmentUsers = Array.from(
//       new Map(assignmentUsers.map((u) => [u.user_id, u])).values(),
//     );

//     /* ===============================
//        3️⃣ ROUND ROBIN TRANSFER
//     =============================== */
//     let userIndex = 0;

//     for (const master_id of leadIds) {
//       const assignee = assignmentUsers[userIndex % assignmentUsers.length];
//       userIndex++;

//       const [rows] = await connection.query(
//         `
//         SELECT rd.assign_id, rd.lead_stage_id, rd.lead_sub_stage_id,
//                a.assigned_to_user_id
//         FROM raw_data rd
//         JOIN assignments a ON a.assign_id = rd.assign_id
//         WHERE rd.master_id = ?
//         `,
//         [master_id],
//       );

//       if (!rows.length) continue;
//       const lead = rows[0];

//       /* ---- LOG (unchanged) ---- */
//       if (lead.assigned_to_user_id) {
//         await connection.query(
//           `
//           INSERT INTO lead_stage_logs
//           (master_id, previous_assigned_user_id, remark)
//           VALUES (?, ?, ?)
//           `,
//           [master_id, lead.assigned_to_user_id, remark || 'Lead transferred'],
//         );
//       }

//       /* ---- UPDATE ASSIGNMENT ---- */
//       await connection.query(
//         `
//         UPDATE assignments
//         SET assigned_to = ?, assigned_to_user_id = ?
//         WHERE assign_id = ?
//         `,
//         [assignee.name, assignee.user_id, lead.assign_id],
//       );
//     }

//     await connection.commit();

//     res.json({
//       success: true,
//       message:
//         assignType === 'team'
//           ? 'Leads transferred using multi-team round robin'
//           : 'Leads transferred successfully',
//       totalLeads: leadIds.length,
//       totalUsers: assignmentUsers.length,
//     });
//   } catch (error) {
//     await connection.rollback();
//     console.error('❌ Transfer leads error:', error);
//     res.status(500).json({
//       message: 'Transfer failed',
//       error: error.message,
//     });
//   } finally {
//     connection.release();
//   }
// };

export const transferLeads = async (req, res) => {
  const connection = await db.getConnection();

  try {
    /* ===============================
       0️⃣ AUTH (MATCHING SESSION)
    =============================== */
    const sessionUser = req.session.user;

    console.log('Session User:', sessionUser);

    if (!sessionUser || !sessionUser.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const transferredBy = sessionUser.id;
    const transferredByName = sessionUser.username;

    /* ===============================
       1️⃣ BODY
    =============================== */
    const { leadIds, userIds = [], assignType = 'single' } = req.body;

    if (
      !Array.isArray(leadIds) ||
      !leadIds.length ||
      !Array.isArray(userIds) ||
      !userIds.length
    ) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    await connection.beginTransaction();

    /* ===============================
       2️⃣ FETCH USERS
    =============================== */
    const [selectedUsers] = await connection.query(
      `
      SELECT user_id, name, role
      FROM users
      WHERE user_id IN (?)
      `,
      [userIds],
    );

    if (!selectedUsers.length) {
      throw new Error('Target users not found');
    }

    /* ===============================
       3️⃣ BUILD ASSIGNMENT USERS
    =============================== */
    let assignmentUsers = [];

    for (const user of selectedUsers) {
      if (user.role === 'team lead' && assignType === 'team') {
        const [telecallers] = await connection.query(
          `
          SELECT u.user_id, u.name
          FROM team_lead_assignment tla
          JOIN users u ON u.user_id = tla.tele_caller_id
          WHERE tla.lead_id = ?
          `,
          [user.user_id],
        );

        assignmentUsers.push(
          { user_id: user.user_id, name: user.name },
          ...telecallers,
        );
      } else {
        assignmentUsers.push({
          user_id: user.user_id,
          name: user.name,
        });
      }
    }

    assignmentUsers = Array.from(
      new Map(assignmentUsers.map((u) => [u.user_id, u])).values(),
    );

    /* ===============================
       4️⃣ ROUND ROBIN
    =============================== */
    let userIndex = 0;

    for (const master_id of leadIds) {
      const assignee = assignmentUsers[userIndex % assignmentUsers.length];
      userIndex++;

      const [rows] = await connection.query(
        `
        SELECT rd.assign_id, a.assigned_to_user_id
        FROM raw_data rd
        JOIN assignments a ON a.assign_id = rd.assign_id
        WHERE rd.master_id = ?
        `,
        [master_id],
      );

      if (!rows.length) continue;
      const lead = rows[0];

      /* OLD LOG */
      if (lead.assigned_to_user_id) {
        await connection.query(
          `
          INSERT INTO lead_stage_logs
          (master_id, previous_assigned_user_id, remark)
          VALUES (?, ?, ?)
          `,
          [
            master_id,
            lead.assigned_to_user_id,
            `Lead transferred by ${transferredByName}`,
          ],
        );
      }

      /* UPDATE ASSIGNMENT */
      await connection.query(
        `
        UPDATE assignments
        SET assigned_to = ?, assigned_to_user_id = ?
        WHERE assign_id = ?
        `,
        [assignee.name, assignee.user_id, lead.assign_id],
      );

      /* 🔥 TRANSFER LOG */
      await connection.query(
        `
        INSERT INTO lead_transfer_logs
        (master_id, transferred_by, transferred_to, transfer_type, remark)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          master_id,
          transferredBy,
          assignee.user_id,
          assignType,
          `Transferred by ${transferredByName}`,
        ],
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Leads transferred successfully',
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Transfer leads error:', error);

    res.status(500).json({
      success: false,
      message: 'Transfer failed',
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

export const getMyTeleCallers = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id: teamLeadId, role } = req.session.user;

    if (role !== 'team lead') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const query = `
      SELECT u.user_id, u.name
      FROM team_lead_assignment tla
      JOIN users u ON u.user_id = tla.tele_caller_id
      WHERE tla.lead_id = ?
    `;

    const [rows] = await db.query(query, [teamLeadId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error fetching team telecallers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// export const getFollowUpLeads = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { id: userId, role } = req.session.user;

//     let whereClause = `
//       WHERE rd.follow_up_date IS NOT NULL
//         AND rd.lead_status = 'Active'
//     `;

//     const params = [];

//     // 🔐 ROLE BASED FILTER
//     if (role === 'tele-caller') {
//       whereClause += ' AND a.assigned_to_user_id = ?';
//       params.push(userId);
//     }

//     if (role === 'team lead') {
//       const [rows] = await db.query(
//         `SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?`,
//         [userId],
//       );

//       const teleCallerIds = rows.map((r) => r.tele_caller_id);
//       teleCallerIds.push(userId);

//       whereClause += ` AND a.assigned_to_user_id IN (${teleCallerIds
//         .map(() => '?')
//         .join(',')})`;
//       params.push(...teleCallerIds);
//     }

//     //     const query = `
//     //   SELECT
//     //     rd.master_id,
//     //     rd.name,
//     //     rd.number,
//     //     rd.follow_up_date,
//     //     rd.follow_up_time,          -- ✅ ADD
//     //     rd.created_at,

//     //     s.source_name,
//     //     u.name AS assigned_to,
//     //     ls.stage_name,
//     //     lss.lead_sub_stage_name,

//     //     -- 🔥 FOLLOW UP STATUS (DATE + TIME)
//     //     CASE
//     //       WHEN rd.follow_up_date IS NULL THEN NULL

//     //       WHEN
//     //         CONCAT(rd.follow_up_date, ' ', IFNULL(rd.follow_up_time, '23:59:59')) < NOW()
//     //         THEN 'overdue'

//     //       WHEN DATE(rd.follow_up_date) = CURDATE()
//     //         THEN 'today'

//     //       ELSE 'upcoming'
//     //     END AS follow_up_status

//     //   FROM raw_data rd
//     //   LEFT JOIN assignments a ON rd.assign_id = a.assign_id
//     //   LEFT JOIN users u ON u.user_id = a.assigned_to_user_id
//     //   LEFT JOIN source s ON s.source_id = rd.source_id
//     //   LEFT JOIN lead_stage ls ON ls.stage_id = rd.lead_stage_id
//     //   LEFT JOIN lead_sub_stage lss ON lss.lead_sub_stage_id = rd.lead_sub_stage_id

//     //   ${whereClause}
//     //   ORDER BY
//     //     CONCAT(rd.follow_up_date, ' ', IFNULL(rd.follow_up_time, '23:59:59')) ASC
//     // `;

//     const query = `
//   SELECT
//     rd.master_id,
//     rd.name,
//     rd.number,
//     rd.follow_up_date,
//     rd.follow_up_time,
//     rd.created_at,

//     s.source_name,
//     u.name AS assigned_to,
//     ls.stage_name,
//     lss.lead_sub_stage_name,

//     -- ✅ LAST MODIFIED DATE (from logs)
//     MAX(lg.updated_at) AS last_modified_date,

//     -- 🔥 FOLLOW UP STATUS (DATE + TIME)
//     CASE
//       WHEN rd.follow_up_date IS NULL THEN NULL

//       WHEN
//         CONCAT(rd.follow_up_date, ' ', IFNULL(rd.follow_up_time, '23:59:59')) < NOW()
//         THEN 'overdue'

//       WHEN DATE(rd.follow_up_date) = CURDATE()
//         THEN 'today'

//       ELSE 'upcoming'
//     END AS follow_up_status

//   FROM raw_data rd

//   LEFT JOIN assignments a
//     ON rd.assign_id = a.assign_id

//   LEFT JOIN users u
//     ON u.user_id = a.assigned_to_user_id

//   LEFT JOIN source s
//     ON s.source_id = rd.source_id

//   LEFT JOIN lead_stage ls
//     ON ls.stage_id = rd.lead_stage_id

//   LEFT JOIN lead_sub_stage lss
//     ON lss.lead_sub_stage_id = rd.lead_sub_stage_id

//   -- ✅ JOIN LOG TABLE
//   LEFT JOIN lead_stage_logs lg
//     ON lg.master_id = rd.master_id

//   ${whereClause}

//   GROUP BY rd.master_id

//   ORDER BY
//     MAX(lg.updated_at) DESC,
//     CONCAT(rd.follow_up_date, ' ', IFNULL(rd.follow_up_time, '23:59:59')) ASC
// `;

//     const [rows] = await db.query(query, params);
//     res.json(rows);
//   } catch (error) {
//     console.error('❌ getFollowUpLeads error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const getFollowUpLeads = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id: userId, role } = req.session.user;

    let whereClause = `
      WHERE rd.follow_up_date IS NOT NULL
        AND rd.lead_status = 'Active'
    `;

    const params = [];

    // 🔐 ROLE BASED FILTER
    if (role === 'tele-caller') {
      whereClause += ' AND a.assigned_to_user_id = ?';
      params.push(userId);
    }

    if (role === 'team lead') {
      const [rows] = await db.query(
        `SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?`,
        [userId],
      );

      const teleCallerIds = rows.map((r) => r.tele_caller_id);
      teleCallerIds.push(userId);

      whereClause += ` AND a.assigned_to_user_id IN (${teleCallerIds
        .map(() => '?')
        .join(',')})`;

      params.push(...teleCallerIds);
    }

    const query = `
      SELECT
        rd.master_id,
        rd.name,
        rd.number,

        -- ✅ SEND IST DATE TO FRONTEND (NO SHIFT ISSUE)
        DATE(CONVERT_TZ(rd.follow_up_date,'+00:00','+05:30')) AS follow_up_date,
        rd.follow_up_time,
        rd.created_at,

        s.source_name,
        u.name AS assigned_to,
        ls.stage_name,
        lss.lead_sub_stage_name,

        -- ✅ LAST MODIFIED DATE
        MAX(lg.updated_at) AS last_modified_date,

        -- 🔥 FOLLOW UP STATUS (IST SAFE)
        CASE
  WHEN rd.follow_up_date IS NULL THEN NULL

  WHEN
    TIMESTAMP(
      rd.follow_up_date,
      IFNULL(rd.follow_up_time, '23:59:59')
    ) < NOW()
  THEN 'overdue'

  WHEN
    DATE(rd.follow_up_date) = CURDATE()
  THEN 'today'

  ELSE 'upcoming'
END AS follow_up_status



      FROM raw_data rd

      LEFT JOIN assignments a 
        ON rd.assign_id = a.assign_id

      LEFT JOIN users u 
        ON u.user_id = a.assigned_to_user_id

      LEFT JOIN source s 
        ON s.source_id = rd.source_id

      LEFT JOIN lead_stage ls 
        ON ls.stage_id = rd.lead_stage_id

      LEFT JOIN lead_sub_stage lss 
        ON lss.lead_sub_stage_id = rd.lead_sub_stage_id

      LEFT JOIN lead_stage_logs lg
        ON lg.master_id = rd.master_id

      ${whereClause}

      GROUP BY rd.master_id

      ORDER BY 
        MAX(lg.updated_at) DESC,
        CONCAT(
          DATE(CONVERT_TZ(rd.follow_up_date,'+00:00','+05:30')),
          ' ',
          IFNULL(rd.follow_up_time, '23:59:59')
        ) ASC
    `;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('❌ getFollowUpLeads error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLeadById = async (req, res) => {
  const { id } = req.params;

  const [[lead]] = await db.query(
    `SELECT 
        rd.*,
        a.assigned_to_user_id
     FROM raw_data rd
     LEFT JOIN assignments a ON rd.assign_id = a.assign_id
     WHERE rd.master_id = ?`,
    [id],
  );

  res.json(lead);
};

// export const getAllRawData = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { id: userId, role } = req.session.user;

//     let query = `
//       SELECT
//         rd.master_id,
//         rd.name,
//         rd.number,
//         rd.email,
//         rd.address,
//         rd.area_id,
//         rd.qualification,
//         rd.passout_year,
//         rd.cat_id,
//         rd.reference_id,
//         rd.source_id,
//         rd.status,
//         rd.lead_status,
//         rd.assign_id,
//         rd.created_by_user,
//         rd.created_at,
//         rd.lead_activity,
//         rd.call_remark,
//         rd.call_duration,

//         a.area_name,
//         c.cat_name,
//         r.reference_name,
//         s.source_name,

//         ls.stage_id,
//         ls.stage_name,
//         lss.lead_sub_stage_id,
//         lss.lead_sub_stage_name,

//         asg.mode,
//         asg.assign_date,
//         asg.target_date,
//         asg.assigned_to,
//         asg.assigned_to_user_id,

//         GROUP_CONCAT(DISTINCT p.product_name) AS products

//       FROM raw_data rd
//       LEFT JOIN assignments asg ON rd.assign_id = asg.assign_id
//       LEFT JOIN area a ON rd.area_id = a.area_id
//       LEFT JOIN category c ON rd.cat_id = c.cat_id
//       LEFT JOIN reference r ON rd.reference_id = r.reference_id
//       LEFT JOIN source s ON rd.source_id = s.source_id
//       LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
//       LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
//       LEFT JOIN product_mapping pm ON pm.master_id = rd.master_id
//       LEFT JOIN product p ON p.product_id = pm.product_id

//       WHERE 1 = 1
//     `;

//     const params = [];

//     /* 🔐 ROLE BASED FILTER */
//     if (role === 'tele-caller') {
//       query += ' AND asg.assigned_to_user_id = ?';
//       params.push(userId);
//     } else if (role === 'team lead') {
//       const [assignedTeleCallers] = await db.query(
//         'SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?',
//         [userId],
//       );

//       const teleCallerIds = assignedTeleCallers.map(
//         (row) => row.tele_caller_id,
//       );

//       teleCallerIds.push(userId);

//       query += ` AND asg.assigned_to_user_id IN (${teleCallerIds
//         .map(() => '?')
//         .join(',')})`;
//       params.push(...teleCallerIds);
//     }
//     // ✅ admin → no restriction

//     query += `
//       GROUP BY rd.master_id
//       ORDER BY rd.master_id DESC
//     `;

//     const [rows] = await db.query(query, params);
//     res.json(rows);
//   } catch (error) {
//     console.error('❌ getAllRawData Error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };
// export const getAllRawData = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { id: userId, role } = req.session.user;

//     let query = `
//       SELECT
//         rd.master_id,
//         rd.name,
//         rd.number,
//         rd.email,
//         rd.address,
//         rd.area_id,
//         rd.qualification,
//         rd.passout_year,
//         rd.cat_id,
//         rd.reference_id,
//         rd.source_id,
//         rd.status,
//         rd.lead_status,
//         rd.assign_id,
//         rd.created_by_user,
//         rd.created_at,
//         rd.lead_activity,
//         rd.call_remark,
//         rd.call_duration,

//         a.area_name,
//         c.cat_name,
//         r.reference_name,
//         s.source_name,

//         ls.stage_id,
//         ls.stage_name,
//         lss.lead_sub_stage_id,
//         lss.lead_sub_stage_name,

//         asg.mode,
//         asg.assign_date,
//         asg.target_date,
//         asg.assigned_to,
//         asg.assigned_to_user_id,

//         GROUP_CONCAT(DISTINCT p.product_name) AS products,

//         -- ✅ LAST MODIFIED DATE FROM LOGS
//         MAX(lg.updated_at) AS last_modified_date

//       FROM raw_data rd

//       LEFT JOIN assignments asg
//         ON rd.assign_id = asg.assign_id

//       LEFT JOIN area a
//         ON rd.area_id = a.area_id

//       LEFT JOIN category c
//         ON rd.cat_id = c.cat_id

//       LEFT JOIN reference r
//         ON rd.reference_id = r.reference_id

//       LEFT JOIN source s
//         ON rd.source_id = s.source_id

//       LEFT JOIN lead_stage ls
//         ON rd.lead_stage_id = ls.stage_id

//       LEFT JOIN lead_sub_stage lss
//         ON rd.lead_sub_stage_id = lss.lead_sub_stage_id

//       LEFT JOIN product_mapping pm
//         ON pm.master_id = rd.master_id

//       LEFT JOIN product p
//         ON p.product_id = pm.product_id

//       -- ✅ JOIN LOG TABLE (IMPORTANT)
//       LEFT JOIN lead_stage_logs lg
//         ON lg.master_id = rd.master_id

//       WHERE 1 = 1
//     `;

//     const params = [];

//     /* 🔐 ROLE BASED FILTER */
//     if (role === 'tele-caller') {
//       query += ' AND asg.assigned_to_user_id = ?';
//       params.push(userId);
//     } else if (role === 'team lead') {
//       const [assignedTeleCallers] = await db.query(
//         'SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?',
//         [userId],
//       );

//       const teleCallerIds = assignedTeleCallers.map(
//         (row) => row.tele_caller_id,
//       );

//       teleCallerIds.push(userId);

//       query += ` AND asg.assigned_to_user_id IN (${teleCallerIds
//         .map(() => '?')
//         .join(',')})`;

//       params.push(...teleCallerIds);
//     }
//     // ✅ admin → no restriction

//     query += `
//       GROUP BY rd.master_id
//       ORDER BY
//         MAX(lg.updated_at) DESC,
//         rd.master_id DESC
//     `;

//     const [rows] = await db.query(query, params);
//     res.json(rows);
//   } catch (error) {
//     console.error('❌ getAllRawData Error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

export const getAllRawData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id: userId, role } = req.session.user;

    let query = `
      SELECT 
        rd.master_id,
        rd.name,
        rd.number,
        rd.email,
        rd.address,
        rd.area_id,
        rd.qualification,
        rd.passout_year,
        rd.cat_id,
        rd.reference_id,
        rd.source_id,
        rd.status,
        rd.lead_status,
        rd.assign_id,
        rd.created_by_user,
        rd.created_at,
        rd.lead_activity,
        rd.call_remark,
        rd.call_duration,

        a.area_name,
        c.cat_name,
        r.reference_name,
        s.source_name,

        ls.stage_id,
        ls.stage_name,
        lss.lead_sub_stage_id,
        lss.lead_sub_stage_name,

        asg.mode,
        asg.assign_date,
        asg.target_date,
        asg.assigned_to,
        asg.assigned_to_user_id,

        GROUP_CONCAT(DISTINCT p.product_name) AS products,

        -- ✅ FIXED: LAST MODIFIED DATE
        lg.last_modified_date

      FROM raw_data rd

      LEFT JOIN assignments asg 
        ON rd.assign_id = asg.assign_id

      LEFT JOIN area a 
        ON rd.area_id = a.area_id

      LEFT JOIN category c 
        ON rd.cat_id = c.cat_id

      LEFT JOIN reference r 
        ON rd.reference_id = r.reference_id

      LEFT JOIN source s 
        ON rd.source_id = s.source_id

      LEFT JOIN lead_stage ls 
        ON rd.lead_stage_id = ls.stage_id

      LEFT JOIN lead_sub_stage lss 
        ON rd.lead_sub_stage_id = lss.lead_sub_stage_id

      LEFT JOIN product_mapping pm 
        ON pm.master_id = rd.master_id

      LEFT JOIN product p 
        ON p.product_id = pm.product_id

      -- ✅ FIXED LOG JOIN (NO DUPLICATES)
      LEFT JOIN (
        SELECT master_id, MAX(updated_at) AS last_modified_date
        FROM lead_stage_logs
        GROUP BY master_id
      ) lg ON lg.master_id = rd.master_id

      WHERE 1 = 1
    `;

    const params = [];

    /* 🔐 ROLE BASED FILTER */
    if (role === 'tele-caller') {
      query += ' AND asg.assigned_to_user_id = ?';
      params.push(userId);
    } else if (role === 'team lead') {
      const [assignedTeleCallers] = await db.query(
        'SELECT tele_caller_id FROM team_lead_assignment WHERE lead_id = ?',
        [userId],
      );

      const teleCallerIds = assignedTeleCallers.map(
        (row) => row.tele_caller_id,
      );

      teleCallerIds.push(userId);

      query += ` AND asg.assigned_to_user_id IN (${teleCallerIds
        .map(() => '?')
        .join(',')})`;

      params.push(...teleCallerIds);
    }
    // ✅ admin → no restriction

    query += `
      GROUP BY rd.master_id
      ORDER BY 
        lg.last_modified_date DESC,
        rd.master_id DESC
    `;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('❌ getAllRawData Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const bulkDeleteLeads = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { leadIds } = req.body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: 'No leads selected' });
    }

    // 🔥 delete from raw_data
    await db.query(`DELETE FROM raw_data WHERE master_id IN (?)`, [leadIds]);

    // (optional) assignments / logs bhi delete karna ho to
    // await db.query(`DELETE FROM lead_logs WHERE master_id IN (?)`, [leadIds]);

    return res.status(200).json({
      message: `${leadIds.length} leads deleted successfully`,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =========================================
   GET LEAD TRANSFER LOGS
========================================= */
export const getLeadTransferLogs = async (req, res) => {
  try {
    const { role, user_id } = req.user;

    // ❌ Telecaller ko block (optional)
    if (role === 'tele-caller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    let sql = `
      SELECT
        l.id,
        u1.name AS transferred_by,
        u2.name AS transferred_to,
        l.transfer_type,
        l.lead_ids,
        l.remark,
        l.created_at
      FROM lead_transfer_logs l
      JOIN users u1 ON u1.user_id = l.transferred_by
      JOIN users u2 ON u2.user_id = l.transferred_to
    `;

    const params = [];

    // 🔐 Team lead sirf apne transfers dekhe
    if (role === 'team lead') {
      sql += ' WHERE l.transferred_by = ?';
      params.push(user_id);
    }

    sql += ' ORDER BY l.created_at DESC';

    const [rows] = await db.query(sql, params);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Get Transfer Logs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transfer logs',
    });
  }
};
