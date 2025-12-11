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






export const getAllCombinedRawData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
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
        ${role === "tele-caller" ? "AND asg.assigned_to_user_id = ?" : ""}

      GROUP BY rd.master_id
      ORDER BY rd.master_id DESC
    `;

    const params = role === "tele-caller" ? [userId] : [];
    const [rows] = await db.query(query, params);

    res.json(rows);

  } catch (error) {
    console.error("❌ getAllCombinedRawData Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const getAllActiveAssignedRawData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
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
        AND rd.lead_status = 'Active'
        ${role === "tele-caller" ? "AND asg.assigned_to_user_id = ?" : ""}

      GROUP BY rd.master_id
      ORDER BY rd.master_id DESC
    `;

    const params = role === "tele-caller" ? [userId] : [];
    const [rows] = await db.query(query, params);

    res.json(rows);

  } catch (error) {
    console.error("❌ getAllActiveAssignedRawData Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const updateTaleCallerData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized: No session" });
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
      selected_products = []
    } = req.body;

    // ------------------------------------
    // 1️⃣ Determine lead_status
    // ------------------------------------
    const [currentLead] = await db.query(
      "SELECT status FROM raw_data WHERE master_id = ?",
      [master_id]
    );

    let lead_status = "Inactive";

    if (currentLead?.[0]?.status === "Assigned") {
      lead_status = "Active";
    }

    // ------------------------------------
    // 2️⃣ FETCH NEW STAGE NAME
    // ------------------------------------
    const [[stage]] = await db.query(
      "SELECT stage_name FROM lead_stage WHERE stage_id = ?",
      [lead_stage_id]
    );
    const newStageName = stage?.stage_name || null;

    // ------------------------------------
    // 3️⃣ FETCH NEW SUB-STAGE NAME
    // ------------------------------------
    const [[substage]] = await db.query(
      "SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?",
      [lead_sub_stage_id]
    );
    const newSubStageName = substage?.lead_sub_stage_name || null;

    // ------------------------------------
    // 4️⃣ UPDATE raw_data TABLE
    // ------------------------------------
    const updateRawDataQuery = `
      UPDATE raw_data
      SET 
        cat_id = ?, 
        name = ?, 
        call_remark = ?, 
        call_duration = ?, 
        lead_stage_id = ?, 
        lead_sub_stage_id = ?,
        lead_status = ?
      WHERE master_id = ?
    `;

    await db.query(updateRawDataQuery, [
      cat_id,
      client_name,
      tc_remark,
      tc_call_duration,
      lead_stage_id,
      lead_sub_stage_id,
      lead_status,
      master_id
    ]);

    // ------------------------------------
    // 5️⃣ DELETE OLD PRODUCT MAPPINGS
    // ------------------------------------
    await db.query("DELETE FROM product_mapping WHERE master_id = ?", [
      master_id,
    ]);

    // ------------------------------------
    // 6️⃣ INSERT NEW PRODUCTS
    // ------------------------------------
    if (selected_products.length > 0) {
      const insertMappingQuery = `
        INSERT INTO product_mapping (master_id, product_id, cat_id, created_by_user)
        VALUES ?
      `;

      const values = selected_products.map((prodId) => [
        master_id,
        prodId,
        cat_id,
        created_by_user
      ]);

      await db.query(insertMappingQuery, [values]);
    }

    // ------------------------------------
    // 7️⃣ INSERT INTO lead_stage_logs TABLE
    // previous_leads = "New Lead"
    // previous_sub_leads = "Fresh Lead"
    // ------------------------------------
    const insertLogQuery = `
      INSERT INTO lead_stage_logs 
      (master_id, previous_leads, previous_sub_leads, new_leads, new_sub_leads, remark)
      VALUES (?, 'New Lead', 'Fresh Lead', ?, ?, ?)
    `;

    await db.query(insertLogQuery, [
      master_id,
      newStageName,
      newSubStageName,
      tc_remark || null
    ]);

    // ------------------------------------
    // 8️⃣ Response
    // ------------------------------------
    return res.json({
      message: "Telecaller updated successfully",
      updated_master_id: master_id,
      products_saved: selected_products.length,
      log_inserted: true,
      lead_status_updated: lead_status
    });

  } catch (error) {
    console.error("Update telecaller error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};