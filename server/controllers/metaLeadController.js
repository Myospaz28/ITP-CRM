// import axios from "axios";
// import db from "../database/db.js";
// import dotenv from "dotenv";
// dotenv.config();

// /**
//  * Fetch all lead forms for a page and optionally store in DB
//  */
// export const fetchAndStoreForms = async (page_id, access_token, options = { store: true }) => {
//   try {
//     const url = `https://graph.facebook.com/v22.0/${page_id}/leadgen_forms?access_token=${access_token}`;
//     const response = await axios.get(url);
//     const forms = response.data.data;

//     if (options.store) {
//       for (const form of forms) {
//         const { id, name, status, locale } = form;
//         const sql = `
//           INSERT INTO lead_forms (form_id, form_name, status, locale, page_id)
//           VALUES (?, ?, ?, ?, ?)
//           ON DUPLICATE KEY UPDATE form_name=?, status=?, locale=?`;
//         db.query(sql, [id, name, status, locale, page_id, name, status, locale]);
//       }
//     }

//     return forms;
//   } catch (err) {
//     console.error("Error fetching forms:", err.response?.data || err.message);
//     return [];
//   }
// };

// /**
//  * Fetch leads for a given form and insert into raw_data
//  */
// export const fetchAndStoreLeads = async (form_id, page_id, access_token) => {
//   try {
//     const url = `https://graph.facebook.com/v22.0/${form_id}/leads?access_token=${access_token}`;
//     const response = await axios.get(url);
//     const leads = response.data.data;

//     for (const lead of leads) {
//       const fb_lead_id = lead.id;
//       const created_time = lead.created_time;

//       const data = {};
//       lead.field_data?.forEach((field) => {
//         data[field.name] = field.values?.[0] || null;
//       });

//       // Mapping for RAW_DATA Table
//       const name = data["full_name"] || null;
//       const number = data["phone_number"] || data["whatsapp_number"] || null;
//       const email = data["email"] || null;
//       const address = data["city"] || data["your_city"] || null;
//       const area_id = data["select_itpreneur_centre"] || null;
//       const qualification = data["what_is_your_highest_qualification?"] || null;
//       const passout_year = data["what_is_your_graduation_pass-out_year?"] || data["passout_year"] || null;

//       const course =
//         data["select_your_preferred_course"] ||
//         data["course"] ||
//         data["what_course_you_want"] ||
//         null;

//       const cat_id = course; // varchar → store course text directly

//       const sql = `
//         INSERT INTO raw_data
//         (name, number, email, address, area_id, qualification, passout_year, fb_lead_id, form_id, page_id, cat_id, reference_id, created_by_user, created_at)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         ON DUPLICATE KEY UPDATE
//           name = VALUES(name),
//           number = VALUES(number),
//           email = VALUES(email),
//           address = VALUES(address),
//           area_id = VALUES(area_id),
//           qualification = VALUES(qualification),
//           passout_year = VALUES(passout_year),
//           cat_id = VALUES(cat_id)
//       `;

//       db.query(sql, [
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
//         1, // reference_id default
//         0, // created_by_user = system
//         created_time
//       ]);
//     }

//     return { message: "Leads stored successfully in raw_data" };
//   } catch (err) {
//     console.error("Error fetching leads:", err.response?.data || err.message);
//     return [];
//   }
// };

// /**
//  * Master function to fetch all forms and leads for a page
//  */
// export const fetchFormsAndLeadsForPage = async (page_id, access_token) => {
//   const forms = await fetchAndStoreForms(page_id, access_token);

//   const allLeads = [];
//   for (const form of forms) {
//     const leads = await fetchAndStoreLeads(form.id, page_id, access_token);
//     allLeads.push({ form_id: form.id, form_name: form.name, leads });
//   }

//   return { message: "All forms + leads fetched and stored", forms, allLeads };
// };

import axios from 'axios';
import db from '../database/db.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Fetch All Lead Forms for a Page & Store in DB
 */
export const fetchAndStoreForms = async (
  page_id,
  access_token,
  options = { store: true },
) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${page_id}/leadgen_forms?access_token=${access_token}`;
    const response = await axios.get(url);
    const forms = response.data.data;

    if (options.store && forms) {
      for (const form of forms) {
        const { id, name, status, locale } = form;

        const sql = `
          INSERT INTO lead_forms (form_id, form_name, status, locale, page_id)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE form_name=?, status=?, locale=?
        `;

        await db.query(sql, [
          id,
          name,
          status,
          locale,
          page_id,
          name,
          status,
          locale,
        ]);
      }
    }

    return forms;
  } catch (err) {
    console.error('Error fetching forms:', err.response?.data || err.message);
    return [];
  }
};

/**
 * Fetch leads for a given form and insert into raw_data with area mapping
 */
// export const fetchAndStoreLeads = async (form_id, page_id, access_token) => {
//   try {
//     const url = `https://graph.facebook.com/v22.0/${form_id}/leads?access_token=${access_token}`;
//     const response = await axios.get(url);
//     const leads = response.data.data;

//     for (const lead of leads) {
//       const fb_lead_id = lead.id;
//       const created_time = lead.created_time;

//       const data = {};
//       lead.field_data?.forEach((field) => {
//         data[field.name] = field.values?.[0] || null;
//       });

//       // Extracting lead details
//       const name = data['full_name'] || null;
//       const number = data['phone_number'] || data['whatsapp_number'] || null;
//       const email = data['email'] || null;
//       const address = data['city'] || data['your_city'] || null;
//       const qualification = data['what_is_your_highest_qualification?'] || null;
//       const passout_year =
//         data['what_is_your_graduation_pass-out_year?'] ||
//         data['passout_year'] ||
//         null;
//       const course =
//         data['select_your_preferred_course'] ||
//         data['course'] ||
//         data['what_course_you_want'] ||
//         null;

//       let cat_id = null;
//       if (course) {
//         try {
//           const [catRows] = await db.query(
//             'SELECT cat_id FROM category WHERE cat_name = ? LIMIT 1',
//             [course],
//           );

//           if (catRows.length > 0) {
//             cat_id = catRows[0].cat_id;
//           } else {
//             const [insertCat] = await db.query(
//               'INSERT INTO category (cat_name, status, created_by_user) VALUES (?, ?, ?)',
//               [course, 'active', 0],
//             );
//             cat_id = insertCat.insertId;
//             console.log(`New Category Added: ${course} = ${cat_id}`);
//           }
//         } catch (error) {
//           console.error('Category Insert Error:', error.message);
//         }
//       }

//       // AREA LOGIC ✔ store and map ID
//       const areaText = data['select_itpreneur_centre'] || null;
//       let area_id = null;

//       if (areaText) {
//         try {
//           const [rows] = await db.query(
//             'SELECT area_id FROM area WHERE area_name = ? LIMIT 1',
//             [areaText],
//           );

//           if (rows.length > 0) {
//             area_id = rows[0].area_id;
//           } else {
//             const [insertResult] = await db.query(
//               'INSERT INTO area (area_name, created_by_user) VALUES (?, ?)',
//               [areaText, 0],
//             );
//             area_id = insertResult.insertId;
//             console.log(`New Area Added: ${areaText} = ${area_id}`);
//           }
//         } catch (err) {
//           console.error('Area Insert Error:', err.message);
//         }
//       }

//       const sql = `
// INSERT INTO raw_data
// (name, number, email, address, area_id, qualification, passout_year,
// fb_lead_id, form_id, page_id, cat_id, reference_id, created_by_user, created_at, source_id)
// VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// ON DUPLICATE KEY UPDATE
//   name = VALUES(name),
//   number = VALUES(number),
//   email = VALUES(email),
//   address = VALUES(address),
//   area_id = VALUES(area_id),
//   qualification = VALUES(qualification),
//   passout_year = VALUES(passout_year),
//   cat_id = VALUES(cat_id),
//   source_id = VALUES(source_id),
//   created_by_user = VALUES(created_by_user)
// `;

//       await db.query(sql, [
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
//         1, // reference_id always 1
//         9, // created_by_user = 9
//         created_time,
//         2, // source_id = Meta Ads
//       ]);
//     }

//     return { success: true, message: 'Leads stored successfully' };
//   } catch (err) {
//     console.error('Error fetching leads:', err.response?.data || err.message);
//     return [];
//   }
// };


// export const fetchAndStoreLeads = async (form_id, page_id, access_token) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     const url = `https://graph.facebook.com/v22.0/${form_id}/leads?access_token=${access_token}`;
//     const response = await axios.get(url);
//     const leads = response.data.data || [];

//     const insertedMasterIds = [];

//     for (const lead of leads) {
//       const fb_lead_id = lead.id;
//       const created_time = lead.created_time;

//       const data = {};
//       lead.field_data?.forEach((field) => {
//         data[field.name] = field.values?.[0] || null;
//       });

//       const name = data["full_name"] || null;
//       const number = data["phone_number"] || data["whatsapp_number"] || null;
//       const email = data["email"] || null;
//       const address = data["city"] || data["your_city"] || null;
//       const qualification = data["what_is_your_highest_qualification?"] || null;
//       const passout_year =
//         data["what_is_your_graduation_pass-out_year?"] ||
//         data["passout_year"] ||
//         null;
//       const course =
//         data["select_your_preferred_course"] ||
//         data["course"] ||
//         data["what_course_you_want"] ||
//         null;

//       let cat_id = null;
//       if (course) {
//         let [catRows] = await connection.query(
//           "SELECT cat_id FROM category WHERE cat_name = ? LIMIT 1",
//           [course]
//         );
//         if (catRows.length > 0) cat_id = catRows[0].cat_id;
//         else {
//           const [insertCat] = await connection.query(
//             "INSERT INTO category (cat_name, status, created_by_user) VALUES (?, ?, ?)",
//             [course, "active", 0]
//           );
//           cat_id = insertCat.insertId;
//         }
//       }

//       // 🔥 Area removed — based on your new requirement
//       const area_id = null;

//       const sql = `
//         INSERT INTO raw_data
//         (name, number, email, address, area_id, qualification, passout_year,
//         fb_lead_id, form_id, page_id, cat_id, reference_id, created_by_user, created_at, source_id, status)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Not Assigned')
//         ON DUPLICATE KEY UPDATE
//           name = VALUES(name),
//           number = VALUES(number),
//           email = VALUES(email),
//           address = VALUES(address),
//           qualification = VALUES(qualification),
//           passout_year = VALUES(passout_year),
//           cat_id = VALUES(cat_id),
//           source_id = VALUES(source_id)
//       `;

//       const [insert] = await connection.query(sql, [
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
//         1,
//         9,
//         created_time,
//         2,
//       ]);

//       insertedMasterIds.push(insert.insertId);
//     }

//     // ************** AUTO ASSIGN **************
//     if (insertedMasterIds.length > 0) {
//       const [telecallers] = await connection.query(
//         "SELECT user_id, name FROM users WHERE role='tele-caller' ORDER BY user_id ASC"
//       );

//       let index = 0;
//       for (const masterId of insertedMasterIds) {
//         const tc = telecallers[index];

//         const [assign] = await connection.query(
//           `INSERT INTO assignments
//           (created_by_user, assigned_to_user_id, assigned_to, mode,
//            cat_id, created_at, lead_count, assign_type)
//           VALUES (?, ?, ?, ?, ?, NOW(), 1, ?)`,
//           [9, tc.user_id, tc.name, "Auto", null, "auto"]
//         );

//         await connection.query(
//           "UPDATE raw_data SET status='Assigned', assign_id=? WHERE master_id=?",
//           [assign.insertId, masterId]
//         );

//         index = (index + 1) % telecallers.length;
//       }
//     }

//     await connection.commit();
//     return { success: true, message: "Leads stored & auto-assigned" };
//   } catch (err) {
//     await connection.rollback();
//     console.error("Error fetching leads:", err.response?.data || err.message);
//     return { success: false, error: err.message };
//   } finally {
//     connection.release();
//   }
// };



export const fetchAndStoreLeads = async (form_id, page_id, access_token) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const url = `https://graph.facebook.com/v22.0/${form_id}/leads?access_token=${access_token}`;
    const response = await axios.get(url);
    const leads = response.data.data || [];

    const insertedMasterIds = [];

    for (const lead of leads) {
      const fb_lead_id = lead.id;
      const created_time = lead.created_time;

      const data = {};
      lead.field_data?.forEach((field) => {
        data[field.name] = field.values?.[0] || null;
      });

      const name = data["full_name"] || null;
      const number = data["phone_number"] || data["whatsapp_number"] || null;
      const email = data["email"] || null;
      const address = data["city"] || data["your_city"] || null;
      const qualification = data["what_is_your_highest_qualification?"] || null;
      const passout_year =
        data["what_is_your_graduation_pass-out_year?"] ||
        data["passout_year"] ||
        null;
      const course =
        data["select_your_preferred_course"] ||
        data["course"] ||
        data["what_course_you_want"] ||
        null;

      // CATEGORY LOGIC
      let cat_id = null;
      if (course) {
        let [catRows] = await connection.query(
          "SELECT cat_id FROM category WHERE cat_name = ? LIMIT 1",
          [course]
        );
        if (catRows.length > 0) {
          cat_id = catRows[0].cat_id;
        } else {
          const [insertCat] = await connection.query(
            "INSERT INTO category (cat_name, status, created_by_user) VALUES (?, 'active', ?)",
            [course, 0]
          );
          cat_id = insertCat.insertId;
        }
      }

      // AREA LOGIC
      const areaText = data["select_itpreneur_centre"] || null;
      let area_id = null;

      if (areaText) {
        let [areaRows] = await connection.query(
          "SELECT area_id FROM area WHERE area_name = ? LIMIT 1",
          [areaText]
        );
        if (areaRows.length > 0) {
          area_id = areaRows[0].area_id;
        } else {
          const [insertArea] = await connection.query(
            "INSERT INTO area (area_name, created_by_user) VALUES (?, ?)",
            [areaText, 0]
          );
          area_id = insertArea.insertId;
        }
      }

      const sql = `
        INSERT INTO raw_data
        (name, number, email, address, area_id, qualification, passout_year,
         fb_lead_id, form_id, page_id, cat_id, reference_id, created_by_user,
         created_at, source_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Not Assigned')
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          number = VALUES(number),
          email = VALUES(email),
          address = VALUES(address),
          area_id = VALUES(area_id),
          qualification = VALUES(qualification),
          passout_year = VALUES(passout_year),
          cat_id = VALUES(cat_id),
          source_id = VALUES(source_id)
      `;

      const [insert] = await connection.query(sql, [
        name,
        number,
        email,
        address,
        area_id,
        qualification,
        passout_year,
        fb_lead_id,
        form_id,
        page_id,
        cat_id,
        1,
        9,
        created_time,
        2,
      ]);

      // GET MASTER ID EVEN IF DUPLICATE
      let masterId = insert.insertId;
      if (masterId === 0) {
        const [existing] = await connection.query(
          "SELECT master_id FROM raw_data WHERE fb_lead_id = ? LIMIT 1",
          [fb_lead_id]
        );
        masterId = existing[0]?.master_id || null;
      }

      if (masterId) {
        insertedMasterIds.push({ masterId, cat_id, area_id });
      }
    }

    // ================= AUTO ASSIGN START =================
    if (insertedMasterIds.length > 0) {
      const [telecallers] = await connection.query(
        "SELECT user_id, name FROM users WHERE role='tele-caller' ORDER BY user_id ASC"
      );

      if (telecallers.length > 0) {
        let index = 0;

        for (const lead of insertedMasterIds) {
          const tc = telecallers[index];
          const { masterId, cat_id, area_id } = lead;

          const [assign] = await connection.query(
            `INSERT INTO assignments
            (created_by_user, assigned_to_user_id, assigned_to, mode,
             cat_id, area_id, created_at, lead_count, assign_type)
            VALUES (?, ?, ?, 'Auto', ?, ?, NOW(), 1, 'auto')`,
            [9, tc.user_id, tc.name, cat_id, area_id]
          );

          await connection.query(
            "UPDATE raw_data SET status='Assigned', assign_id=? WHERE master_id=?",
            [assign.insertId, masterId]
          );

          index = (index + 1) % telecallers.length;
        }
      }
    }
    // ================= AUTO ASSIGN END =================

    await connection.commit();
    return { success: true, message: "Leads stored & auto-assigned (with area & category)" };
  } catch (err) {
    await connection.rollback();
    console.error("Error:", err.response?.data || err.message);
    return { success: false, error: err.message };
  } finally {
    connection.release();
  }
};



/**
 * Master Function: Fetch all forms + leads for page
 */
export const fetchFormsAndLeadsForPage = async (page_id, access_token) => {
  const forms = await fetchAndStoreForms(page_id, access_token);

  const allLeads = [];
  for (const form of forms) {
    const leads = await fetchAndStoreLeads(form.id, page_id, access_token);
    allLeads.push({ form_id: form.id, form_name: form.name, leads });
  }

  return {
    message: 'All forms + leads fetched successfully',
    forms,
    allLeads,
  };
};

export const fetchAndStorePages = async (req, res) => {
  try {
    const userAccessToken = process.env.META_ACCESS_TOKEN;

    if (!userAccessToken) {
      return res
        .status(500)
        .json({ message: 'USER_ACCESS_TOKEN missing in .env' });
    }

    const url = `https://graph.facebook.com/v22.0/me/accounts?access_token=${userAccessToken}`;
    const response = await axios.get(url);

    const pages = response.data.data;
    if (!pages.length) {
      return res.json({ message: 'No pages found', pages: [] });
    }

    // Store pages in DB
    pages.forEach((p) => {
      const sql = `
        INSERT INTO fb_pages (page_id, page_name, page_access_token, category)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          page_name = VALUES(page_name),
          page_access_token = VALUES(page_access_token),
          category = VALUES(category)
      `;
      db.query(sql, [p.id, p.name, p.access_token, p.category]);
    });

    return res.json({
      message: 'Pages fetched & stored successfully',
      total_pages: pages.length,
      pages,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({
      message: 'Error storing pages',
      error: err.response?.data || err.message,
    });
  }
};
