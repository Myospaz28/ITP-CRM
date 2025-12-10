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
//   try {
//     // CHECK LOGIN SESSION
//     if (!req.session.user) {
//       return res.status(401).json({ message: "Unauthorized. Please log in." });
//     }

//     const file = req.file;
//     const { cat_id, reference, area_id } = req.body;
//     const created_by_user = req.session.user.id;

//     // VALIDATION
//     if (!file || !cat_id || !reference || !area_id || !created_by_user) {
//       return res.status(400).json({ message: "All fields are required!" });
//     }

//     // READ EXCEL FILE
//     const workbook = XLSX.read(file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     // FORMAT DATA
//     const formattedData = data
//       .filter(row => row.name && row.contact && row.email && row.address)
//       .map(row => ({
//         name: row.name,
//         number: row.contact,
//         email: row.email,
//         address: row.address,
//         area_id,
//         cat_id,
//         reference_id: reference,
//         created_by_user
//       }));

//     if (formattedData.length === 0) {
//       return res.status(400).json({ message: "No valid rows found in file." });
//     }

//     // STEP 1 — CHECK DUPLICATES
//     for (let i = 0; i < formattedData.length; i++) {
//       const row = formattedData[i];

//       const [existing] = await db.query(
//         `SELECT master_id FROM raw_data
//          WHERE email = ? OR number = ? LIMIT 1`,
//         [row.email, row.number]
//       );

//       if (existing.length > 0) {
//         return res.status(400).json({
//           message: "Duplicate entries found",
//           duplicates: [
//             {
//               row: i + 2,
//               name: row.name,
//               email: row.email,
//               number: row.number,
//               issue: "Email or Contact already exists"
//             }
//           ]
//         });
//       }
//     }

//     // STEP 2 — INSERT DATA
//     await insertRawData(formattedData);

//     res.status(200).json({ message: "Data imported successfully!" });

//   } catch (error) {
//     console.error("Error importing data:", error);
//     res.status(500).json({ message: "Server error while importing data." });
//   }
// };

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
    const { cat_id, reference, source_id, assignedTo, remark, assignType } =
      req.body;
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
    ]);

    await connection.query(
      `INSERT INTO raw_data 
      (name, number, email, address, qualification, passout_year, created_at,
       cat_id, reference_id, source_id, created_by_user, status)
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

    // VALIDATION
    if (
      !name ||
      !number ||
      !email ||
      !address ||
      !cat_id ||
      !reference_id ||
      !area_id ||
      !assigned_to_user_id
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be filled!' });
    }

    // CHECK DUPLICATES
    const [emailExists] = await db.query(
      'SELECT master_id FROM raw_data WHERE email = ?',
      [email],
    );
    const [contactExists] = await db.query(
      'SELECT master_id FROM raw_data WHERE number = ?',
      [number],
    );

    if (emailExists.length > 0 || contactExists.length > 0) {
      return res.status(409).json({
        message: 'Duplicate entry found',
      });
    }

    // INSERT INTO RAW_DATA
    const insertRawQuery = `
      INSERT INTO raw_data (
        name, number, email, address, qualification, passout_year,
        cat_id, reference_id, source_id, area_id, created_by_user
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const rawValues = [
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
    ];

    const [rawResult] = await db.query(insertRawQuery, rawValues);
    const insertedRawId = rawResult.insertId; // <-- needed for assignment table

    // INSERT INTO ASSIGNMENT TABLE
    const assignQuery = `
      INSERT INTO assignments (
        created_by_user, mode, cat_id, assign_date, target_date,
        remark, assigned_to, assigned_to_user_id, lead_count, assign_type, area_id
      )
      VALUES (?, ?, ?, CURDATE(), NULL, NULL, NULL, ?, 1, 'manual', ?)
    `;

    const assignValues = [
      created_by_user,
      'single', // mode for single insert
      cat_id,
      assigned_to_user_id,
      area_id,
    ];

    await db.query(assignQuery, assignValues);

    return res.status(200).json({
      message: 'Client added & assigned successfully!',
      raw_id: insertedRawId,
    });
  } catch (error) {
    console.error('❌ Error adding client:', error);
    return res
      .status(500)
      .json({ message: 'Server error while adding client.' });
  }
};

// export const getAllRawData = async (req, res) => {
//   try {
//     const raw_data = await getRawData();
//     res.status(200).json(raw_data);
//   } catch (error) {
//     console.error('Error fetching Master Data:', error);
//     res.status(500).json({ error: 'Failed to fetch Master Data' });
//   }
// };

export const getAllRawData = async (req, res) => {
  try {
    const query = `
      SELECT 
        rd.*,
        a.area_name,
        c.cat_name,
        r.reference_name,
        s.source_name,
       u.username AS created_by_username
      FROM raw_data rd
      LEFT JOIN area a ON rd.area_id = a.area_id
      LEFT JOIN category c ON rd.cat_id = c.cat_id
      LEFT JOIN reference r ON rd.reference_id = r.reference_id
      LEFT JOIN source s ON rd.source_id = s.source_id
      LEFT JOIN users u ON rd.created_by_user = u.user_id
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

// update controller
// export const updateRawData = async (req, res) => {
//   const master_id = req.params.master_id;
//   console.log("master", master_id)

//   const {
//     name = null,
//     number = null,
//     email = null,
//     address = null
//   } = req.body;

//   console.log("request body", req.body)

//   if (!master_id) {
//     return res.status(400).json({ message: 'master_id is required' });
//   }

//   try {
//     const updateQuery = `
//       UPDATE raw_data SET
//         name = ?, number = ?, email = ?, address = ?
//       WHERE master_id = ?
//     `;

//     const values = [name, number, email, address, master_id];

//     console.log("data", values)

//     const [result] = await db.execute(updateQuery, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'No matching record found to update' });
//     }

//     res.status(200).json({ message: 'Raw data updated successfully' });
//   } catch (error) {
//     console.error('Error updating raw_data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const updateRawData = async (req, res) => {
  try {
    const { master_id } = req.params;

    if (!master_id) {
      return res.status(400).json({ message: 'master_id is required' });
    }

    const {
      name,
      number,
      email,
      address,
      area_id,
      cat_id,
      reference_id,
      city,
      location_link,
      room_dimension,
      p_type,
      budget_range,
      current_stage,
      room_ready,
      time_to_complete,
      site_visit_date,
      demo_date,
      ar_number,
      ca_number,
      e_number,
      sm_number,
      pop_number,
      other_number,
      lead_stage,
      quick_remark,
      detailed_remark,
      status,
      lead_status,
    } = req.body;

    const updateFields = [];
    const values = [];

    const addField = (field, value) => {
      if (value !== undefined && value !== null && value !== '') {
        updateFields.push(`${field} = ?`);
        values.push(value);
      }
    };

    addField('name', name);
    addField('number', number);
    addField('email', email);
    addField('address', address);
    addField('area_id', area_id);
    addField('cat_id', cat_id);
    addField('reference_id', reference_id);
    addField('city', city);
    addField('location_link', location_link);
    addField('room_dimension', room_dimension);
    addField('p_type', p_type);
    addField('budget_range', budget_range);
    addField('current_stage', current_stage);
    addField('room_ready', room_ready);
    addField('time_to_complete', time_to_complete);
    addField('site_visit_date', site_visit_date);
    addField('demo_date', demo_date);
    addField('ar_number', ar_number);
    addField('ca_number', ca_number);
    addField('e_number', e_number);
    addField('sm_number', sm_number);
    addField('pop_number', pop_number);
    addField('other_number', other_number);
    addField('lead_stage', lead_stage);
    addField('quick_remark', quick_remark);
    addField('detailed_remark', detailed_remark);

    // 👇 Only update status fields if explicitly provided by the user
    addField('status', status);
    addField('lead_status', lead_status);

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

    return res.status(200).json({ message: 'Raw Data updated successfully!' });
  } catch (error) {
    console.error('❌ Update Error:', error);
    return res
      .status(500)
      .json({ message: 'Server error while updating data' });
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
