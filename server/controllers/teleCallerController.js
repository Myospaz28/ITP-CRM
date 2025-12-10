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


export const updateTaleCallerData = async (req, res) => {
  const {
    master_id,
    cat_id,
    tc_status,
    tc_remark,
    tc_call_duration,
    client_name,
    tc_next_followup_date,
    selected_products = [],
    selected_raw_status,
  } = req.body;

  const created_by_user = req.session?.user?.id || req.body.created_by_user;

  if (!created_by_user || isNaN(parseInt(created_by_user))) {
    return res.status(400).json({ message: 'Invalid or missing user ID' });
  }

  try {
    const callDuration =
      tc_call_duration === '' ? null : parseInt(tc_call_duration, 10);
    const product_id =
      selected_products.length > 0 ? selected_products[0] : null;

    const [existingTeleCaller] = await db.query(
      `SELECT * FROM tele_caller_table WHERE master_id = ?`,
      [master_id],
    );

    if (tc_status === 'Not Interested') {
      if (existingTeleCaller.length > 0) {
        await db.query(
          `UPDATE tele_caller_table
           SET cat_id = ?, product_id = ?, tc_status = ?, tc_remark = ?, tc_call_duration = ?, tc_next_followup_date = ?
           WHERE master_id = ?`,
          [
            cat_id,
            null,
            tc_status,
            tc_remark,
            callDuration,
            tc_next_followup_date,
            master_id,
          ],
        );
      } else {
        await db.query(
          `INSERT INTO tele_caller_table
           (master_id, cat_id, product_id, tc_status, tc_remark, tc_call_duration, tc_next_followup_date)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            master_id,
            cat_id,
            null,
            tc_status,
            tc_remark,
            callDuration,
            tc_next_followup_date,
          ],
        );
      }

      await db.query(
        `UPDATE raw_data SET name = ?, status = ?, lead_status = ? WHERE master_id = ?`,
        [client_name, 'Lead Cancelled', 'Inactive', master_id],
      );

      return res
        .status(200)
        .json({ message: 'Not Interested data saved successfully' });
    }

    let finalStatus = 'Assigned';
    let leadStatus = 'Inactive';

    if (tc_status === 'Interested') {
      if (!selected_raw_status) {
        return res
          .status(400)
          .json({ message: 'Please select a status for Interested' });
      }
      finalStatus = selected_raw_status;
      leadStatus = 'Active';
    } else if (tc_status === 'Follow-Up') {
      finalStatus = 'Follow-Up';
    }

    if (existingTeleCaller.length > 0) {
      await db.query(
        `UPDATE tele_caller_table
         SET cat_id = ?, product_id = ?, tc_status = ?, tc_remark = ?, tc_call_duration = ?, tc_next_followup_date = ?
         WHERE master_id = ?`,
        [
          cat_id,
          product_id,
          tc_status,
          tc_remark,
          callDuration,
          tc_next_followup_date,
          master_id,
        ],
      );
    } else {
      await db.query(
        `INSERT INTO tele_caller_table
         (master_id, cat_id, product_id, tc_status, tc_remark, tc_call_duration, tc_next_followup_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          master_id,
          cat_id,
          product_id,
          tc_status,
          tc_remark,
          callDuration,
          tc_next_followup_date,
        ],
      );
    }

    await db.query(
      `UPDATE raw_data SET name = ?, status = ?, lead_status = ? WHERE master_id = ?`,
      [client_name, finalStatus, leadStatus, master_id],
    );

    if (
      ['Follow-Up', 'Meeting Scheduled', 'Lead Converted'].includes(finalStatus)
    ) {
      await db.query(
        `UPDATE raw_data SET lead_activity = IFNULL(lead_activity, 0) + 1 WHERE master_id = ?`,
        [master_id],
      );
    }

    if (finalStatus === 'Follow-Up') {
      const followupStatus = 'next follow up';

      const [rawDataResult] = await db.query(
        'SELECT number FROM raw_data WHERE master_id = ?',
        [master_id],
      );
      const client_number =
        rawDataResult.length > 0 ? rawDataResult[0].number : '';

      const [existingFollowup] = await db.query(
        `SELECT * FROM followup WHERE master_id = ?`,
        [master_id],
      );

      if (existingFollowup.length > 0) {
        await db.query(
          `UPDATE followup
           SET client_name = ?, client_contact = ?, followup_date = ?, remark = ?, status = ?, created_by_user = ?
           WHERE master_id = ?`,
          [
            client_name,
            client_number,
            tc_next_followup_date,
            tc_remark,
            followupStatus,
            created_by_user,
            master_id,
          ],
        );
      } else {
        await db.query(
          `INSERT INTO followup
           (master_id, client_name, client_contact, followup_date, remark, status, created_by_user)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            master_id,
            client_name,
            client_number,
            tc_next_followup_date,
            tc_remark,
            followupStatus,
            created_by_user,
          ],
        );
      }
    }

    if (tc_status === 'Interested') {
      for (const product_id of selected_products) {
        if (!product_id) continue;

        const [productData] = await db.query(
          `SELECT cat_id FROM product WHERE product_id = ?`,
          [product_id],
        );
        if (productData.length === 0) continue;

        const realCatId = productData[0].cat_id;
        const [existing] = await db.query(
          `SELECT * FROM product_mapping WHERE master_id = ? AND product_id = ?`,
          [master_id, product_id],
        );

        if (existing.length === 0) {
          await db.query(
            `INSERT INTO product_mapping
             (master_id, product_id, cat_id, created_by_user)
             VALUES (?, ?, ?, ?)`,
            [master_id, product_id, realCatId, created_by_user],
          );
        }
      }
    }

    res.status(200).json({ message: 'Tele-caller data updated successfully' });
  } catch (error) {
    console.error('Error updating tele-caller data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const getAllCombinedRawData = async (req, res) => {
  try {
    // Check session
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized: No session" });
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
        rd.fb_lead_id,
        rd.form_id,
        rd.page_id,
        rd.cat_id,
        rd.reference_id,
        rd.source_id,
        rd.status,
        rd.lead_status,
        rd.assign_id,
        rd.created_by_user,
        rd.created_at,
        rd.lead_activity,

        -- Area & Category
        a.area_name,
        c.cat_name,
        r.reference_name,

        -- Assignment
        asg.assign_date,
        asg.target_date,
        COALESCE(u.name, asg.assigned_to, 'Not Assigned') AS assigned_user_name,

        -- Source
        s.source_name,

        -- Lead Stage & Sub Stage
        ls.stage_id,
        ls.stage_name,
        lss.lead_sub_stage_id,
        lss.lead_sub_stage_name,

        -- Telecaller
        MAX(tct.tc_remark) AS call_remark,
        MAX(tct.tc_call_duration) AS call_duration,

        -- Products
        GROUP_CONCAT(DISTINCT p.product_name) AS products

      FROM raw_data rd
      LEFT JOIN area a ON rd.area_id = a.area_id
      LEFT JOIN category c ON rd.cat_id = c.cat_id
      LEFT JOIN reference r ON rd.reference_id = r.reference_id
      LEFT JOIN assignments asg ON rd.assign_id = asg.assign_id
      LEFT JOIN users u ON asg.assigned_to_user_id = u.user_id
      LEFT JOIN source s ON rd.source_id = s.source_id
      LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
      LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
      LEFT JOIN tele_caller_table tct ON rd.master_id = tct.master_id
      LEFT JOIN product_mapping pm ON rd.master_id = pm.master_id
      LEFT JOIN product p ON pm.product_id = p.product_id

      WHERE 1 = 1
      ${role === "tele-caller" ? "AND asg.assigned_to_user_id = ?" : ""}

      GROUP BY rd.master_id
      ORDER BY rd.master_id ASC
    `;

    const params = role === "tele-caller" ? [userId] : [];

    const [results] = await db.query(query, params);

    res.status(200).json(results);

  } catch (error) {
    console.error("❌ Error in getAllCombinedRawData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};