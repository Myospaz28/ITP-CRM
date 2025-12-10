// controllers/reportController.js

import db from '../database/db.js';

// ====================== GET USER REPORT ==========================
export const getUserReport = async (req, res) => {
  const { user_id, assign_id, filter } = req.query;

  if (!user_id || !assign_id) {
    return res.status(400).json({ error: 'Missing user_id or assign_id in query' });
  }

  let query = `
    SELECT 
      u.user_id,
      a.assigned_to_user_id,
      a.lead_count,
      a.assign_id,
      a.cat_id,
      a.target_date,
      a.assign_date,
      c.cat_name,
      c.status AS category_status,
      GROUP_CONCAT(p.product_name) AS product_names,
      r.master_id,
      r.name,
      r.number,
      r.email,
      r.status AS raw_status,
      r.lead_status,
      r.lead_activity,
      tct.tc_status,
      CASE 
        WHEN tct.master_id IS NOT NULL AND tct.tc_status IN ('Interested','Not Interested','Not answered') THEN 'Green'
        WHEN tct.master_id IS NOT NULL THEN 'Orange'
        ELSE 'Orange'
      END AS status_color
    FROM users u
    JOIN assignments a ON u.user_id = a.assigned_to_user_id
    JOIN category c ON a.cat_id = c.cat_id
    LEFT JOIN raw_data r ON a.assign_id = r.assign_id
    LEFT JOIN product p ON c.cat_id = p.cat_id
    LEFT JOIN tele_caller_table tct ON r.master_id = tct.master_id
    WHERE u.user_id = ? AND a.assign_id = ?
  `;

  if (filter === 'true') {
    query += `
      AND r.status IN ('Follow-Up', 'Meeting Scheduled', 'lead Converted', 'Lead Cancelled')
    `;
  }

  query += `
    GROUP BY u.user_id, a.assign_id, r.master_id, tct.master_id
  `;

  try {
    const [results] = await db.query(query, [user_id, assign_id]);
    return res.json(results);
  } catch (err) {
    console.error('Error fetching report:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ====================== GET TELECALLER STATUS ==========================
export const getTeleCallerStatus = async (req, res) => {
  const query = "SHOW COLUMNS FROM tele_caller_table WHERE Field = 'tc_status'";

  try {
    const [rows] = await db.query(query);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Field not found' });
    }

    const enumStr = rows[0].Type;
    const allValues = enumStr
      .match(/enum\((.*)\)/)[1]
      .split(',')
      .map(value => value.trim().replace(/^'(.*)'$/, '$1'));

    const selectedValues = allValues.filter(status =>
      ['Interested', 'Not Interested', 'Not answered', 'Invalid'].includes(status)
    );

    return res.status(200).json(selectedValues);
  } catch (err) {
    console.error('Error fetching enum options:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ====================== GET RAW DATA STATUS ==========================
export const getRawDataStatus = async (req, res) => {
  const query = `
    SELECT COLUMN_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'raw_data' AND COLUMN_NAME = 'status'
  `;

  try {
    const [rows] = await db.query(query);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const allowedStatuses = [
      'Follow-Up',
      'Meeting Scheduled',
      'lead Converted',
      'Lead Cancelled'
    ];

    return res.status(200).json(allowedStatuses);
  } catch (err) {
    console.error('Error fetching status enum values:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ====================== GET PRODUCTS BY MASTER ==========================
export const getProductsByMaster = async (req, res) => {
  const { master_id } = req.query;

  if (!master_id) {
    return res.status(400).json({ error: 'Missing master_id in query' });
  }

  const query = `
    SELECT p.product_id, p.product_name, p.cat_id
    FROM product p
    WHERE p.cat_id = (
      SELECT rd.cat_id
      FROM raw_data rd
      WHERE rd.master_id = ?
      LIMIT 1
    )
  `;

  try {
    const [results] = await db.query(query, [master_id]);
    return res.json({ master_id, products: results });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ====================== UPDATE TELE CALLER DATA ==========================
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
    const callDuration = tc_call_duration === '' ? null : parseInt(tc_call_duration, 10);
    const product_id = selected_products.length > 0 ? selected_products[0] : null;

    const [existingTeleCaller] = await db.query(
      `SELECT * FROM tele_caller_table WHERE master_id = ?`,
      [master_id]
    );

    // ---------------------- Not Interested Logic ----------------------
    if (tc_status === 'Not Interested') {
      if (existingTeleCaller.length > 0) {
        await db.query(
          `UPDATE tele_caller_table
           SET cat_id = ?, product_id = ?, tc_status = ?, tc_remark = ?, tc_call_duration = ?, tc_next_followup_date = ?
           WHERE master_id = ?`,
          [cat_id, null, tc_status, tc_remark, callDuration, tc_next_followup_date, master_id]
        );
      } else {
        await db.query(
          `INSERT INTO tele_caller_table
           (master_id, cat_id, product_id, tc_status, tc_remark, tc_call_duration, tc_next_followup_date)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [master_id, cat_id, null, tc_status, tc_remark, callDuration, tc_next_followup_date]
        );
      }

      await db.query(
        `UPDATE raw_data SET name = ?, status = 'Lead Cancelled', lead_status = 'Inactive' WHERE master_id = ?`,
        [client_name, master_id]
      );

      return res.status(200).json({ message: 'Not Interested data saved successfully' });
    }

    // ---------------------- Interested Logic ----------------------
    let finalStatus = 'Assigned';
    let leadStatus = 'Inactive';

    if (tc_status === 'Interested') {
      if (!selected_raw_status) {
        return res.status(400).json({ message: 'Please select a status for Interested' });
      }

      const allowedStatuses = ['Follow-Up', 'Meeting Scheduled', 'lead Converted', 'Lead Cancelled'];
      if (!allowedStatuses.includes(selected_raw_status)) {
        return res.status(400).json({ message: 'Invalid status selected' });
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
        [cat_id, product_id, tc_status, tc_remark, callDuration, tc_next_followup_date, master_id]
      );
    } else {
      await db.query(
        `INSERT INTO tele_caller_table
         (master_id, cat_id, product_id, tc_status, tc_remark, tc_call_duration, tc_next_followup_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [master_id, cat_id, product_id, tc_status, tc_remark, callDuration, tc_next_followup_date]
      );
    }

    await db.query(
      `UPDATE raw_data SET name = ?, status = ?, lead_status = ? WHERE master_id = ?`,
      [client_name, finalStatus, leadStatus, master_id]
    );

    if (['Follow-Up', 'Meeting Scheduled', 'lead Converted'].includes(finalStatus)) {
      await db.query(
        `UPDATE raw_data SET lead_activity = IFNULL(lead_activity, 0) + 1 WHERE master_id = ?`,
        [master_id]
      );
    }

    if (finalStatus === 'Follow-Up') {
      const followupStatus = 'next follow up';

      const [rawDataResult] = await db.query(
        'SELECT number FROM raw_data WHERE master_id = ?',
        [master_id]
      );
      const client_number = rawDataResult.length > 0 ? rawDataResult[0].number : '';

      const [existingFollowup] = await db.query(
        `SELECT * FROM followup WHERE master_id = ?`,
        [master_id]
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
          ]
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
          ]
        );
      }
    }

    // Save Product Mapping (For Interested)
    if (tc_status === 'Interested') {
      for (const product_id of selected_products) {
        if (!product_id) continue;

        const [productData] = await db.query(
          `SELECT cat_id FROM product WHERE product_id = ?`,
          [product_id]
        );
        if (productData.length === 0) continue;

        const realCatId = productData[0].cat_id;

        const [existing] = await db.query(
          `SELECT * FROM product_mapping WHERE master_id = ? AND product_id = ?`,
          [master_id, product_id]
        );

        if (existing.length === 0) {
          await db.query(
            `INSERT INTO product_mapping
             (master_id, product_id, cat_id, created_by_user)
             VALUES (?, ?, ?, ?)`,
            [master_id, product_id, realCatId, created_by_user]
          );
        }
      }
    }

    return res.status(200).json({ message: 'Tele-caller data updated successfully' });
  } catch (error) {
    console.error('Error updating tele-caller data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ====================== GET EDIT TELECALLER DATA ==========================
export const getEditTeleCallerData = async (req, res) => {
  const { master_id } = req.query;

  if (!master_id) {
    return res.status(400).json({ error: 'Missing master_id in query' });
  }

  try {
    const [teleCallerData] = await db.query(
      `SELECT 
        t.master_id,
        t.cat_id,
        t.tc_status,
        t.tc_remark,
        t.tc_call_duration,
        t.tc_next_followup_date,
        r.name AS client_name,
        r.status AS lead_status,
        r.lead_status AS raw_lead_status
       FROM tele_caller_table t
       LEFT JOIN raw_data r ON t.master_id = r.master_id
       WHERE t.master_id = ?`,
      [master_id]
    );

    const [selectedProducts] = await db.query(
      `SELECT product_id FROM product_mapping WHERE master_id = ?`,
      [master_id]
    );

    const selectedProductIds = selectedProducts.map(p => p.product_id);

    return res.status(200).json({
      ...teleCallerData[0],
      selected_products: selectedProductIds
    });
  } catch (error) {
    console.error('Error fetching tele-caller edit data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ====================== EXPORTS ==========================
