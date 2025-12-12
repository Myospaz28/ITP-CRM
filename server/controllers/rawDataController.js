import XLSX from 'xlsx';
// import {  getRawData } from "../models/rawDataModel.js";
import db from '../database/db.js';

// ========== INSERT FUNCTION (MISSING IN YOUR CODE) ==========
const insertRawData = async (formattedData) => {
  const values = formattedData.map((row) => [
    row.name,
    row.number,
    row.email,
    row.address,
    row.area_id,
    row.cat_id,
    row.reference_id,
    row.created_by_user,
  ]);

  const sql = `
      INSERT INTO raw_data 
      (name, number, email, address, area_id, cat_id, reference_id, created_by_user)
      VALUES ?
  `;

  return db.query(sql, [values]);
};

// ========== MAIN IMPORT CONTROLLER ==========
// export const importRawData = async (req, res) => {
//   const connection = await db.getConnection();

//   // === DATE PARSER (support numeric Excel date & string date) ===
//   const formatDateForMySQL = (value) => {
//     if (!value) return null;

//     // If Excel numeric date
//     if (typeof value === "number") {
//       const d = new Date((value - 25569) * 86400 * 1000);
//       return d.toISOString().slice(0, 19).replace("T", " ");
//     }

//     // If string date
//     const d = new Date(value);
//     if (isNaN(d)) return null;

//     return d.toISOString().slice(0, 19).replace("T", " ");
//   };

//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: "Unauthorized. Please log in." });
//     }

//     await connection.beginTransaction();

//     const file = req.file;
//     const {
//       cat_id,
//       reference,
//       area_id,
//       source_id,
//       assignType,
//       mode,
//       assignedTo,
//       assignDate,
//       targetDate,
//       remark,
//       leadCount,
//     } = req.body;

//     const created_by_user = req.session.user.id;
//     const assignedToUserId = Number(assignedTo);

//     if (!file || !cat_id || !reference || !area_id || !source_id) {
//       return res.status(400).json({ message: "All fields are required!" });
//     }

//     const isAssigning = assignType && mode;

//     if (isAssigning && assignType === "manual") {
//       if (!assignedToUserId) {
//         return res.status(400).json({ message: "Assigned user not valid!" });
//       }
//     }

//     // === READ EXCEL ===
//     const workbook = XLSX.read(file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     const formattedData = rows
//       .filter((r) => r.name && r.contact && r.email)
//       .map((r) => ({
//         name: r.name,
//         number: r.contact,
//         email: r.email,
//         address: r.address || "",
//         qualification: r.qualification || "",
//         passout_year: r.passout_year || "",
//         created_at:
//           formatDateForMySQL(r.created_at) ||
//           formatDateForMySQL(new Date()) // fallback
//       }));

//     if (!formattedData.length) {
//       return res.status(400).json({ message: "Invalid file format!" });
//     }

//     // === DUPLICATE CHECK ===
//     const duplicates = [];
//     for (let i = 0; i < formattedData.length; i++) {
//       const row = formattedData[i];
//       const [exist] = await connection.query(
//         `SELECT master_id FROM raw_data WHERE email=? OR number=? LIMIT 1`,
//         [row.email, row.number]
//       );
//       if (exist.length) {
//         duplicates.push({
//           row: i + 2,
//           name: row.name,
//           email: row.email,
//           number: row.number,
//         });
//       }
//     }

//     if (duplicates.length) {
//       await connection.rollback();
//       return res.status(400).json({ message: "Duplicates found", duplicates });
//     }

//     // === INSERT RAW DATA ===
//     const bulkValues = formattedData.map((row) => [
//       row.name,
//       row.number,
//       row.email,
//       row.address,
//       row.qualification,
//       row.passout_year,
//       row.created_at,
//       area_id,
//       cat_id,
//       reference,
//       source_id,
//       created_by_user,
//       "Not Assigned",
//     ]);

//     await connection.query(
//       `INSERT INTO raw_data
//        (name, number, email, address, qualification, passout_year, created_at,
//         area_id, cat_id, reference_id, source_id, created_by_user, status)
//        VALUES ?`,
//       [bulkValues]
//     );

//     const [last] = await connection.query(
//       "SELECT MAX(master_id) AS lastId FROM raw_data"
//     );
//     const lastInsertedId = last[0].lastId;
//     const insertedLeadIds = Array.from(
//       { length: formattedData.length },
//       (_, i) => lastInsertedId - formattedData.length + 1 + i
//     );

//     // === ASSIGNMENT ===
//     let totalAssigned = 0;

//     if (isAssigning) {
//       const leads = insertedLeadIds.slice(0, Number(leadCount));
//       totalAssigned = leads.length;

//       if (assignType === "manual") {
//         const [user] = await connection.query(
//           "SELECT name FROM users WHERE user_id = ? LIMIT 1",
//           [assignedToUserId]
//         );

//         const assignedUserName = user[0]?.name || null;

//         const [assignRes] = await connection.query(
//           `INSERT INTO assignments
//           (created_by_user, assigned_to_user_id, assigned_to, mode,
//            cat_id, area_id, assign_date, target_date, remark,
//            created_at, lead_count, assign_type)
//           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
//           [
//             created_by_user,
//             assignedToUserId,
//             assignedUserName,
//             mode,
//             cat_id,
//             area_id,
//             assignDate,
//             targetDate,
//             remark || "",
//             leads.length,
//             assignType,
//           ]
//         );

//         await connection.query(
//           `UPDATE raw_data
//            SET status='Assigned', assign_id=?
//            WHERE master_id IN (?)`,
//           [assignRes.insertId, leads]
//         );
//       } else {
//         const [telecallers] = await connection.query(
//           `SELECT user_id, name FROM users WHERE role='tele-caller' ORDER BY user_id ASC`
//         );

//         let idx = 0;

//         for (const id of leads) {
//           const tc = telecallers[idx];

//           const [assignRes] = await connection.query(
//             `INSERT INTO assignments
//             (created_by_user, assigned_to_user_id, assigned_to, mode,
//              cat_id, area_id, assign_date, target_date, remark,
//              created_at, lead_count, assign_type)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1, ?)`,
//             [
//               created_by_user,
//               tc.user_id,
//               tc.name,
//               mode,
//               cat_id,
//               area_id,
//               assignDate,
//               targetDate,
//               remark || "",
//               assignType,
//             ]
//           );

//           await connection.query(
//             `UPDATE raw_data
//              SET status='Assigned', assign_id=?
//              WHERE master_id=?`,
//             [assignRes.insertId, id]
//           );

//           idx = (idx + 1) % telecallers.length;
//         }
//       }
//     }

//     await connection.commit();

//     return res.status(200).json({
//       message: "Data imported successfully!",
//       totalInserted: formattedData.length,
//       totalAssigned,
//     });
//   } catch (err) {
//     await connection.rollback();
//     console.error("Import Error:", err);
//     return res.status(500).json({ message: err.message });
//   } finally {
//     connection.release();
//   }
// };

export const importRawData = async (req, res) => {
  const connection = await db.getConnection();

  const formatDateForMySQL = (value) => {
    if (!value) return null;
    if (typeof value === 'number') {
      const d = new Date((value - 25569) * 86400 * 1000);
      return d.toISOString().slice(0, 19).replace('T', ' ');
    }
    const d = new Date(value);
    if (isNaN(d)) return null;
    return d.toISOString().slice(0, 19).replace('T', ' ');
  };

  try {
    if (!req.session.user)
      return res.status(401).json({ message: 'Unauthorized!' });

    const file = req.file;
    const {
      cat_id,
      reference,
      source_id,
      assignedTo,
      remark,
      assignType,
      lead_stage,
      lead_sub_stage,
    } = req.body;
    const created_by_user = req.session.user.id;

    if (!file || !cat_id || !reference || !source_id || !assignType) {
      return res.status(400).json({ message: 'Required fields missing!' });
    }

    await connection.beginTransaction();

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = rows
      .filter((r) => r.name && r.contact && r.email)
      .map((r) => ({
        name: r.name,
        number: r.contact,
        email: r.email,
        address: r.address || '',
        qualification: r.qualification || '',
        passout_year: r.passout_year || '',
        created_at:
          formatDateForMySQL(r.created_at) || formatDateForMySQL(new Date()),
      }));

    if (!formattedData.length) {
      return res.status(400).json({ message: 'Invalid file format!' });
    }

    // Duplicate Check
    for (let row of formattedData) {
      const [exist] = await connection.query(
        'SELECT master_id FROM raw_data WHERE email=? OR number=? LIMIT 1',
        [row.email, row.number],
      );
      if (exist.length) {
        await connection.rollback();
        return res.status(400).json({ message: 'Duplicate lead found!', row });
      }
    }

    // Insert Raw Data
    const bulkValues = formattedData.map((row) => [
      row.name,
      row.number,
      row.email,
      row.address,
      row.qualification,
      row.passout_year,
      row.created_at,
      cat_id,
      reference,
      source_id,
      created_by_user,
      'Not Assigned', // Default before assignment
      lead_stage, // 👍 ID save hoga
      lead_sub_stage,
    ]);

    await connection.query(
      `INSERT INTO raw_data 
      (name, number, email, address, qualification, passout_year, created_at,
       cat_id, reference_id, source_id, created_by_user, status,lead_stage_id, lead_sub_stage_id)
      VALUES ?`,
      [bulkValues],
    );

    const [last] = await connection.query(
      'SELECT MAX(master_id) AS lastId FROM raw_data',
    );
    const lastId = last[0].lastId;
    const ids = Array.from(
      { length: formattedData.length },
      (_, i) => lastId - formattedData.length + 1 + i,
    );

    // ---------------------------------------------------
    // 🔥 AUTO ASSIGN (using assign_id)
    // ---------------------------------------------------
    // 🔥 AUTO ASSIGN
    if (assignType === 'auto') {
      const [telecallers] = await connection.query(
        `SELECT user_id, name FROM users WHERE role='tele-caller'`,
      );

      if (!telecallers.length) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: 'No telecallers available for auto assign!' });
      }

      // Round-robin assign
      let index = 0;
      for (let mid of ids) {
        const tc = telecallers[index];

        // Update raw_data with assigned telecaller
        await connection.query(
          `UPDATE raw_data SET assign_id=?, status='Assigned' WHERE master_id=?`,
          [tc.user_id, mid],
        );

        // Insert single entry in assignments table for each lead
        await connection.query(
          `INSERT INTO assignments
        (created_by_user, assigned_to_user_id, assigned_to, cat_id, remark, created_at, lead_count)
       VALUES (?, ?, ?, ?, ?, NOW(), 1)`,
          [created_by_user, tc.user_id, tc.name, cat_id, remark || ''],
        );

        index = (index + 1) % telecallers.length; // round-robin
      }
    }

    // 🔥 MANUAL ASSIGN
    if (assignType === 'manual') {
      if (!assignedTo) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: 'assignedTo required for manual assignment!' });
      }

      const assignedToUserId = Number(assignedTo);
      const [user] = await connection.query(
        'SELECT name FROM users WHERE user_id = ?',
        [assignedToUserId],
      );
      const assignedName = user[0]?.name;

      for (let mid of ids) {
        await connection.query(
          `UPDATE raw_data SET assign_id=?, status='Assigned' WHERE master_id=?`,
          [assignedToUserId, mid],
        );

        await connection.query(
          `INSERT INTO assignments
        (created_by_user, assigned_to_user_id, assigned_to, cat_id, remark, created_at, lead_count)
       VALUES (?, ?, ?, ?, ?, NOW(), 1)`,
          [
            created_by_user,
            assignedToUserId,
            assignedName,
            cat_id,
            remark || '',
          ],
        );
      }
    }

    await connection.commit();
    return res.status(200).json({
      message: 'Data imported successfully!',
      inserted: formattedData.length,
      assigned: assignType,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Import Error:', err);
    return res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
};

export const updateRawData = async (req, res) => {
  try {
    const { master_id } = req.params;

    if (!master_id) {
      return res.status(400).json({ message: 'master_id is required' });
    }

    // Only fields from frontend form
    const {
      name,
      number,
      email,
      address,
      qualification,
      passout_year,
      cat_id,
      reference_id,
      source_id,
      area_id,
    } = req.body;

    const updateFields = [];
    const values = [];

    const addField = (field, value) => {
      if (value !== undefined && value !== null && value !== '') {
        updateFields.push(`${field} = ?`);
        values.push(value);
      }
    };

    // Only updating fields that exist in frontend
    addField('name', name);
    addField('number', number);
    addField('email', email);
    addField('address', address);
    addField('qualification', qualification);
    addField('passout_year', passout_year);
    addField('cat_id', cat_id);
    addField('reference_id', reference_id);
    addField('source_id', source_id);
    addField('area_id', area_id);

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const query = `
      UPDATE raw_data SET ${updateFields.join(', ')}
      WHERE master_id = ?
    `;

    values.push(master_id);

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    return res.status(200).json({ message: 'Client updated successfully!' });
  } catch (error) {
    console.error('❌ Update Error:', error);
    return res
      .status(500)
      .json({ message: 'Server error while updating client' });
  }
};

export const deleteClient = async (req, res) => {
  const { master_id } = req.params;

  try {
    await db.query('DELETE FROM raw_data WHERE master_id = ?', [master_id]);
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting client' });
  }
};

// delete raw datat entries from raw data table
export const deleteMultipleClients = async (req, res) => {
  const { ids } = req.body; // Corrected: use req.body, not req.params

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No client IDs provided' });
  }

  try {
    const placeholders = ids.map(() => '?').join(',');
    await db.query(
      `DELETE FROM raw_data WHERE master_id IN (${placeholders})`,
      ids,
    );
    res.json({ message: 'Selected entries deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting the selected entries' });
  }
};

export const getAllRawData = async (req, res) => {
  try {
    const query = `
      SELECT 
        rd.*,
        a.area_name,
        c.cat_name,
        r.reference_name
      FROM raw_data rd
      LEFT JOIN area a ON rd.area_id = a.area_id
      LEFT JOIN category c ON rd.cat_id = c.cat_id
      LEFT JOIN reference r ON rd.reference_id = r.reference_id
      WHERE TRIM(LOWER(rd.status)) = 'not assigned'
      ORDER BY rd.master_id ASC
    `;

    const [raw_data] = await db.query(query);
    res.status(200).json(raw_data);
  } catch (error) {
    console.error('❌ Error fetching Master Data:', error);
    res.status(500).json({ error: 'Failed to fetch Master Data' });
  }
};

export const addSingleRawData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const {
      name,
      number,
      email,
      address,
      qualification = null,
      passout_year = null,
      cat_id,
      reference_id,
      source_id = null,
      area_id,
      assigned_to_user_id,
    } = req.body;

    const created_by_user = req.session.user.id;

    if (
      !name ||
      !number ||
      !email ||
      !address ||
      !cat_id ||
      !reference_id ||
      !assigned_to_user_id
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be filled!' });
    }

    const [emailExists] = await db.query(
      'SELECT master_id FROM raw_data WHERE email = ?',
      [email],
    );
    const [contactExists] = await db.query(
      'SELECT master_id FROM raw_data WHERE number = ?',
      [number],
    );

    if (emailExists.length > 0 || contactExists.length > 0) {
      return res.status(409).json({ message: 'Duplicate entry found' });
    }

    // INSERT RAW DATA (assign_id will be updated later)
    const rawQuery = `
      INSERT INTO raw_data (
        name, number, email, address, qualification, passout_year,
        cat_id, reference_id, source_id, area_id, created_by_user, status, lead_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Assigned', 'Inactive')
    `;

    const [rawRes] = await db.query(rawQuery, [
      name,
      number,
      email,
      address,
      qualification,
      passout_year,
      cat_id,
      reference_id,
      source_id,
      area_id,
      created_by_user,
    ]);

    const master_id = rawRes.insertId;

    // GET ASSIGNED USER NAME
    const [userRows] = await db.query(
      'SELECT name FROM users WHERE user_id = ?',
      [assigned_to_user_id],
    );

    const assigned_to_name = userRows.length ? userRows[0].name : null;

    // INSERT ASSIGNMENT ENTRY
    const assignQuery = `
      INSERT INTO assignments (
        created_by_user, mode, cat_id, assign_date, target_date, remark,
        assigned_to, assigned_to_user_id, lead_count, assign_type, area_id
      )
      VALUES (?, 'single', ?, CURDATE(), NULL, NULL, ?, ?, 1, 'manual', ?)
    `;

    const [assignRes] = await db.query(assignQuery, [
      created_by_user,
      cat_id,
      assigned_to_name,
      assigned_to_user_id,
      area_id,
    ]);

    const assign_id = assignRes.insertId;

    // UPDATE RAW DATA WITH assign_id
    await db.query(`UPDATE raw_data SET assign_id = ? WHERE master_id = ?`, [
      assign_id,
      master_id,
    ]);

    return res.status(200).json({
      message: 'Client added & assigned successfully!',
      master_id,
      assign_id,
    });
  } catch (error) {
    console.error('❌ Error adding client:', error);
    return res
      .status(500)
      .json({ message: 'Server error while adding client.' });
  }
};

export const getLeadStageLogsWithAssignment = async (req, res) => {
  const { master_id } = req.params;

  try {
    // 1️⃣ Fetch main lead info from raw_data
    const [[leadInfo]] = await db.query(
      `SELECT 
          rd.master_id,
          rd.name,
          rd.number,
          rd.email,
          rd.lead_status,
          rd.lead_stage_id,
          rd.lead_sub_stage_id,
          ls.stage_name AS current_stage_name,
          lss.lead_sub_stage_name AS current_sub_stage_name
       FROM raw_data rd
       LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
       LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
       WHERE rd.master_id = ?`,
      [master_id],
    );

    if (!leadInfo) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // 2️⃣ Fetch stage change logs
    const [logs] = await db.query(
      `SELECT 
          leadlog_id,
          previous_leads,
          previous_sub_leads,
          new_leads,
          new_sub_leads,
          remark,
          updated_at
       FROM lead_stage_logs
       WHERE master_id = ?
       ORDER BY updated_at DESC`,
      [master_id],
    );

    // 3️⃣ Fetch assignment details
    const [[assignment]] = await db.query(
      `SELECT 
          a.assign_id,
          a.assigned_to,
          a.assigned_to_user_id,
          a.assign_date,
          a.target_date,
          a.mode,
          a.cat_id,
          a.remark AS assign_remark
       FROM assignments a
       WHERE a.assign_id = (
           SELECT assign_id FROM raw_data WHERE master_id = ?
       )`,
      [master_id],
    );

    return res.json({
      success: true,
      lead: leadInfo,
      logs: logs,
      assignment: assignment || null,
    });
  } catch (error) {
    console.error('Error fetching lead logs:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllWinRawData = async (req, res) => {
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
        AND rd.lead_status = 'Win'
        ${role === 'tele-caller' ? 'AND asg.assigned_to_user_id = ?' : ''}

      GROUP BY rd.master_id
      ORDER BY rd.master_id DESC
    `;

    const params = role === 'tele-caller' ? [userId] : [];
    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('❌ getAllActiveAssignedRawData Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//lose Leads
export const getAllLoseRawData = async (req, res) => {
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
        AND rd.lead_status = 'Lose'
        ${role === 'tele-caller' ? 'AND asg.assigned_to_user_id = ?' : ''}

      GROUP BY rd.master_id
      ORDER BY rd.master_id DESC
    `;

    const params = role === 'tele-caller' ? [userId] : [];
    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('❌ getAllActiveAssignedRawData Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//invalid leads
export const getAllInvalidRawData = async (req, res) => {
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
        AND rd.lead_status = 'Invalid'
        ${role === 'tele-caller' ? 'AND asg.assigned_to_user_id = ?' : ''}

      GROUP BY rd.master_id
      ORDER BY rd.master_id DESC
    `;

    const params = role === 'tele-caller' ? [userId] : [];
    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('❌ getAllActiveAssignedRawData Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateLeadWithStageLogs = async (req, res) => {
  const {
    name,
    number,
    email,
    address,
    area_id,
    qualification,
    passout_year,
    cat_id,
    reference_id,
    source_id,
    lead_status, // coming from frontend
    lead_stage_id,
    lead_sub_stage_id,
    remark,
    call_duration,
    call_remark,
  } = req.body;

  const { master_id } = req.params;

  try {
    // Fetch existing lead info BEFORE update
    const [oldLead] = await db.query(
      `SELECT rd.lead_stage_id, rd.lead_sub_stage_id,
              ls.stage_name AS previous_stage_name,
              lss.lead_sub_stage_name AS previous_sub_stage_name
       FROM raw_data rd
       LEFT JOIN lead_stage ls ON rd.lead_stage_id = ls.stage_id
       LEFT JOIN lead_sub_stage lss ON rd.lead_sub_stage_id = lss.lead_sub_stage_id
       WHERE rd.master_id = ?`,
      [master_id],
    );

    if (!oldLead.length)
      return res.status(404).json({ message: 'Lead not found' });

    const previousStageId = oldLead[0].lead_stage_id;
    const previousSubStageId = oldLead[0].lead_sub_stage_id;
    const previousStageName = oldLead[0].previous_stage_name;
    const previousSubStageName = oldLead[0].previous_sub_stage_name;

    // ------------------------------
    // 1️⃣ Update raw_data table
    // ------------------------------
    await db.query(
      `UPDATE raw_data SET 
        name = ?, number = ?, email = ?, address = ?, area_id = ?, 
        qualification = ?, passout_year = ?, cat_id = ?, reference_id = ?, 
        source_id = ?, lead_status = ?, lead_stage_id = ?, lead_sub_stage_id = ?, 
        call_remark = ?, call_duration = ?
       WHERE master_id = ?`,
      [
        name,
        number,
        email,
        address,
        area_id,
        qualification,
        passout_year,
        cat_id,
        reference_id,
        source_id,
        lead_status, // updated even if only lead_status changes
        lead_stage_id,
        lead_sub_stage_id,
        call_remark || remark || null,
        call_duration || null,
        master_id,
      ],
    );

    // ------------------------------
    // 2️⃣ Insert into lead_stage_logs ONLY if stage/sub-stage changed
    // ------------------------------
    if (
      previousStageId !== lead_stage_id ||
      previousSubStageId !== lead_sub_stage_id
    ) {
      // Fetch human-readable stage names
      const [[newStage]] = await db.query(
        `SELECT stage_name FROM lead_stage WHERE stage_id = ?`,
        [lead_stage_id],
      );
      const [[newSubStage]] = await db.query(
        `SELECT lead_sub_stage_name FROM lead_sub_stage WHERE lead_sub_stage_id = ?`,
        [lead_sub_stage_id],
      );

      await db.query(
        `INSERT INTO lead_stage_logs 
         (master_id, previous_leads, previous_sub_leads, new_leads, new_sub_leads, remark) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          master_id,
          previousStageName || previousStageId.toString(),
          previousSubStageName || previousSubStageId.toString(),
          newStage?.stage_name || lead_stage_id.toString(),
          newSubStage?.lead_sub_stage_name || lead_sub_stage_id.toString(),
          call_remark || remark || null,
        ],
      );
    }

    return res.json({
      success: true,
      message: 'Lead updated successfully',
      logs_added:
        previousStageId !== lead_stage_id ||
        previousSubStageId !== lead_sub_stage_id,
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
