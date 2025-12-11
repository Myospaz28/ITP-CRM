import db from "../database/db.js";

// export const createInquiry = async (req, res) => {
//   try {
//     const {
//       full_name,
//       city,
//       mobile,
//       email,
//       education_qualification,
//       passout_year,
//       itp_center,         
//       reference_name,     
//       course_interest,    
//       source_name,        
//     } = req.body;

    
//     const created_by_user = 1;

//     const sql = `
//       INSERT INTO raw_data (
//         name,
//         number,
//         email,
//         address,
//         area_id,
//         qualification,
//         passout_year,
//         fb_lead_id,
//         form_id,
//         page_id,
//         cat_id,
//         reference_id,
//         source_id,
//         status,
//         lead_status,
//         assign_id,
//         created_by_user,
//         lead_stage_id,
//         lead_sub_stage_id
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const params = [
//       full_name,
//       mobile,
//       email,
//       city,                   
//       itp_center,              
//       education_qualification,
//       passout_year,
//       null,                    
//       null,                    
//       null,                    
//       course_interest,         
//       reference_name,          
//       source_name,             
//       "Not Assigned",          
//       "Inactive",              
//       null,                    
//       created_by_user,
//       null,                    
//       null                     
//     ];

//     const [result] = await db.query(sql, params);

//     return res.status(200).json({
//       success: true,
//       message: "Raw data inquiry inserted successfully",
//       master_id: result.insertId
//     });

//   } catch (error) {
//     console.error("DB Error:", error);
//     return res.status(500).json({ success: false, message: "Database error", error });
//   }
// };


// export const createInquiry = async (req, res) => {
//   const connection = await db.getConnection();

//   try {
//     const {
//       full_name,
//       city,
//       mobile,
//       email,
//       education_qualification,
//       passout_year,
//       itp_center,
//       reference_name,
//       course_interest,
//       source_name,
//       remark
//     } = req.body;

//     const created_by_user = 1;

//     await connection.beginTransaction();

//     // ---------------------------------------
//     // 1️⃣ INSERT INTO raw_data
//     // ---------------------------------------
//     const rawSql = `
//       INSERT INTO raw_data (
//         name, number, email, address, area_id, qualification, passout_year,
//         fb_lead_id, form_id, page_id, cat_id, reference_id, source_id,
//         status, lead_status, assign_id, created_by_user, lead_stage_id, lead_sub_stage_id
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const rawParams = [
//       full_name,
//       mobile,
//       email,
//       city,
//       itp_center,  // <-- AREA ID
//       education_qualification,
//       passout_year,
//       null, null, null,
//       course_interest,
//       reference_name,
//       source_name,
//       "Not Assigned",
//       "Inactive",
//       null,
//       created_by_user,
//       null,
//       null
//     ];

//     const [rawInsert] = await connection.query(rawSql, rawParams);
//     const master_id = rawInsert.insertId;


//     // ---------------------------------------
//     // 2️⃣ GET TELECALLERS LIST
//     // ---------------------------------------
//     const [telecallers] = await connection.query(
//       `SELECT user_id, name FROM users WHERE role='tele-caller'`
//     );

//     if (!telecallers.length) {
//       await connection.rollback();
//       return res.status(400).json({ message: "No telecallers available!" });
//     }


//     // ---------------------------------------
//     // 3️⃣ AUTO ASSIGN LIKE importRawData
//     // ---------------------------------------
//     let index = 0;
//     const tc = telecallers[index];
//     index = (index + 1) % telecallers.length;


//     // ---------------------------------------
//     // 4️⃣ UPDATE assign_id IN raw_data
//     // ---------------------------------------
//     await connection.query(
//       `UPDATE raw_data SET assign_id=?, status='Assigned' WHERE master_id=?`,
//       [tc.user_id, master_id]
//     );


//     // ---------------------------------------
//     // 5️⃣ INSERT INTO assignments (NOW INCLUDING area_id + assign_type)
//     // ---------------------------------------
//     await connection.query(
//       `INSERT INTO assignments
//         (created_by_user, assigned_to_user_id, assigned_to, cat_id, remark, created_at, lead_count, area_id, assign_type)
//        VALUES (?, ?, ?, ?, ?, NOW(), 1, ?, ?)
//       `,
//       [
//         created_by_user,
//         tc.user_id,
//         tc.name,
//         course_interest,
//         remark || "",
//         itp_center,     // <-- AREA ID SAME AS raw_data
//         "auto"          // <-- assign_type auto
//       ]
//     );


//     await connection.commit();

//     return res.status(200).json({
//       success: true,
//       message: `Inquiry inserted & auto-assigned to ${tc.name}`,
//       assigned_to: tc.name,
//       master_id
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error("DB Error:", error);
//     return res.status(500).json({ success: false, message: "Database error", error });
//   } finally {
//     connection.release();
//   }
// };




export const createInquiry = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      full_name,
      city,
      mobile,
      email,
      education_qualification,
      passout_year,
      itp_center,
      reference_name,
      course_interest,
      source_name,
      remark
    } = req.body;

    const created_by_user = 1;

    await connection.beginTransaction();

    // ---------------------------------------
    // 1️⃣ INSERT INTO raw_data
    // ---------------------------------------
    const rawSql = `
      INSERT INTO raw_data (
        name, number, email, address, area_id, qualification, passout_year,
        fb_lead_id, form_id, page_id, cat_id, reference_id, source_id,
        status, lead_status, assign_id, created_by_user, lead_stage_id, lead_sub_stage_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const rawParams = [
      full_name,
      mobile,
      email,
      city,
      itp_center,
      education_qualification,
      passout_year,
      null, null, null,
      course_interest,
      reference_name,
      source_name,
      "Not Assigned",
      "Inactive",
      null,
      created_by_user,
      null,
      null
    ];

    const [rawInsert] = await connection.query(rawSql, rawParams);
    const master_id = rawInsert.insertId;

    // ---------------------------------------
    // 2️⃣ GET TELECALLERS
    // ---------------------------------------
    const [telecallers] = await connection.query(
      `SELECT user_id, name FROM users WHERE role='tele-caller'`
    );
    if (!telecallers.length) {
      await connection.rollback();
      return res.status(400).json({ message: "No telecallers!" });
    }

    // ---------------------------------------
    // 3️⃣ GET LAST ASSIGNED TELECALLER (ROUND ROBIN)
    // ---------------------------------------
    const [[settings]] = await connection.query(
      `SELECT last_assigned_tc FROM settings LIMIT 1`
    );

    let index = settings.last_assigned_tc || 0;

    const tc = telecallers[index]; // pick telecaller

    // NEXT INDEX
    const nextIndex = (index + 1) % telecallers.length;

    // UPDATE SETTINGS
    await connection.query(
      `UPDATE settings SET last_assigned_tc = ?`,
      [nextIndex]
    );

    // ---------------------------------------
    // 4️⃣ UPDATE RAW_DATA assign_id
    // ---------------------------------------
    await connection.query(
      `UPDATE raw_data SET assign_id=?, status='Assigned' WHERE master_id=?`,
      [tc.user_id, master_id]
    );

    // ---------------------------------------
    // 5️⃣ INSERT INTO ASSIGNMENTS
    // ---------------------------------------
    await connection.query(
      `INSERT INTO assignments
        (created_by_user, assigned_to_user_id, assigned_to, cat_id, remark, created_at, lead_count, area_id, assign_type)
       VALUES (?, ?, ?, ?, ?, NOW(), 1, ?, ?)
      `,
      [
        created_by_user,
        tc.user_id,
        tc.name,
        course_interest,
        remark || "",
        itp_center,
        "auto"
      ]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: `Inquiry assigned to ${tc.name}`,
      assigned_to: tc.name,
      master_id
    });

  } catch (error) {
    await connection.rollback();
    console.error("DB Error:", error);
    return res.status(500).json({ success: false, message: "Database error", error });
  } finally {
    connection.release();
  }
};


export const getInquiries = async (req, res) => {
  try {
    const sql = `SELECT * FROM inquiry ORDER BY id DESC`;
    const [rows] = await db.query(sql);

    return res.status(200).json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("DB Error:", error);
    return res.status(500).json({ success: false, message: "Database error", error });
  }
};
