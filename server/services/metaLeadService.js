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

export const fetchAndStoreLeads1 = async (form_id, page_id, access_token) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    /* ------------------------------------------------
       0️⃣ Get default lead stage IDs
    ------------------------------------------------ */
    const [[leadStage]] = await connection.query(
      `SELECT stage_id FROM lead_stage WHERE stage_name = 'New Lead' LIMIT 1`,
    );

    const [[leadSubStage]] = await connection.query(
      `SELECT lead_sub_stage_id
       FROM lead_sub_stage
       WHERE lead_sub_stage_name = 'Auto-Import'
       LIMIT 1`,
    );

    const default_lead_stage_id = leadStage?.stage_id || null;
    const default_lead_sub_stage_id = leadSubStage?.lead_sub_stage_id || null;

    /* ------------------------------------------------
       1️⃣ Fetch Facebook leads
    ------------------------------------------------ */
    const url = `https://graph.facebook.com/v22.0/${form_id}/leads?access_token=${access_token}`;

    const response = await axios.get(url);
    const leads = response.data.data || [];

    for (const lead of leads) {
      const fb_lead_id = lead.id;
      const created_time = lead.created_time;

      const data = {};
      lead.field_data?.forEach((field) => {
        data[field.name] = field.values?.[0] || null;
      });

      const name = data['full_name'] || null;
      const number = data['phone_number'] || data['whatsapp_number'] || null;
      const email = data['email'] || null;
      const address = data['city'] || data['your_city'] || null;
      const qualification = data['what_is_your_highest_qualification?'] || null;
      const passout_year =
        data['what_is_your_graduation_pass-out_year?'] ||
        data['passout_year'] ||
        null;

      const course =
        data['select_your_preferred_course'] ||
        data['course'] ||
        data['what_course_you_want'] ||
        null;

      /* ===== CATEGORY ===== */
      let cat_id = null;
      if (course) {
        const [catRows] = await connection.query(
          `SELECT cat_id FROM category WHERE cat_name=? LIMIT 1`,
          [course],
        );

        if (catRows.length) {
          cat_id = catRows[0].cat_id;
        } else {
          const [insertCat] = await connection.query(
            `INSERT INTO category (cat_name, status, created_by_user)
             VALUES (?, 'active', ?)`,
            [course, 0],
          );
          cat_id = insertCat.insertId;
        }
      }

      /* ===== AREA ===== */
      let area_id = null;
      const areaText = data['select_itpreneur_centre'] || null;

      if (areaText) {
        const [areaRows] = await connection.query(
          `SELECT area_id FROM area WHERE area_name=? LIMIT 1`,
          [areaText],
        );

        if (areaRows.length) {
          area_id = areaRows[0].area_id;
        } else {
          const [insertArea] = await connection.query(
            `INSERT INTO area (area_name, created_by_user)
             VALUES (?, ?)`,
            [areaText, 0],
          );
          area_id = insertArea.insertId;
        }
      }

      /* ------------------------------------------------
         2️⃣ INSERT INTO meta_data WITH DEFAULT STAGE
      ------------------------------------------------ */
      const sql = `
        INSERT INTO meta_data
        (
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
          lead_stage_id,
          lead_sub_stage_id,
          reference_id,
          source_id,
          created_by_user,
          created_at,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Not Assigned')
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          number = VALUES(number),
          email = VALUES(email),
          address = VALUES(address),
          area_id = VALUES(area_id),
          qualification = VALUES(qualification),
          passout_year = VALUES(passout_year),
          cat_id = VALUES(cat_id),
          lead_stage_id = VALUES(lead_stage_id),
          lead_sub_stage_id = VALUES(lead_sub_stage_id),
          source_id = VALUES(source_id)
      `;

      await connection.query(sql, [
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
        default_lead_stage_id,
        default_lead_sub_stage_id,
        1,
        2,
        9,
        created_time,
      ]);
    }

    await connection.commit();
    return {
      success: true,
      message: 'Leads imported with default stage',
    };
  } catch (err) {
    await connection.rollback();
    console.error('❌ FB Lead Import Error:', err);
    return { success: false, error: err.message };
  } finally {
    connection.release();
  }
};
export const fetchAndStoreLeads = async (form_id, page_id, access_token) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    /* ------------------------------------------------
       0️⃣ Get default lead stage IDs
    ------------------------------------------------ */
    const [[leadStage]] = await connection.query(
      `SELECT stage_id FROM lead_stage WHERE stage_name = 'New Lead' LIMIT 1`,
    );

    const [[leadSubStage]] = await connection.query(
      `SELECT lead_sub_stage_id
       FROM lead_sub_stage
       WHERE lead_sub_stage_name = 'Auto-Import'
       LIMIT 1`,
    );

    const default_lead_stage_id = leadStage?.stage_id || null;
    const default_lead_sub_stage_id = leadSubStage?.lead_sub_stage_id || null;

    /* ------------------------------------------------
       1️⃣ Fetch Facebook leads
    ------------------------------------------------ */
    const url = `https://graph.facebook.com/v22.0/${form_id}/leads?access_token=${access_token}`;
    const response = await axios.get(url);
    const leads = response.data.data || [];

    for (const lead of leads) {
      const fb_lead_id = lead.id;
      const created_time = lead.created_time;

      /* ------------------------------------------------
         🔍 CHECK BOTH raw_data AND meta_data
      ------------------------------------------------ */
      const [[exists]] = await connection.query(
        `
        SELECT 1 FROM raw_data WHERE fb_lead_id = ?
        UNION
        SELECT 1 FROM meta_data WHERE fb_lead_id = ?
        LIMIT 1
        `,
        [fb_lead_id, fb_lead_id],
      );

      if (exists) {
        // Lead already exists in raw_data or meta_data → SKIP
        continue;
      }

      /* ------------------------------------------------
         Extract Facebook field data
      ------------------------------------------------ */
      const data = {};
      lead.field_data?.forEach((field) => {
        data[field.name] = field.values?.[0] || null;
      });

      const name = data['full_name'] || null;
      const number = data['phone_number'] || data['whatsapp_number'] || null;
      const email = data['email'] || null;
      const address = data['city'] || data['your_city'] || null;

      const qualification = data['what_is_your_highest_qualification?'] || null;

      const passout_year =
        data['what_is_your_graduation_pass-out_year?'] ||
        data['passout_year'] ||
        null;

      const course =
        data['select_your_preferred_course'] ||
        data['course'] ||
        data['what_course_you_want'] ||
        null;

      /* ------------------------------------------------
         CATEGORY
      ------------------------------------------------ */
      let cat_id = null;
      if (course) {
        const [catRows] = await connection.query(
          `SELECT cat_id FROM category WHERE cat_name = ? LIMIT 1`,
          [course],
        );

        if (catRows.length) {
          cat_id = catRows[0].cat_id;
        } else {
          const [insertCat] = await connection.query(
            `INSERT INTO category (cat_name, status, created_by_user)
             VALUES (?, 'active', ?)`,
            [course, 0],
          );
          cat_id = insertCat.insertId;
        }
      }

      /* ------------------------------------------------
         AREA
      ------------------------------------------------ */
      let area_id = null;
      const areaText = data['select_itpreneur_centre'] || null;

      if (areaText) {
        const [areaRows] = await connection.query(
          `SELECT area_id FROM area WHERE area_name = ? LIMIT 1`,
          [areaText],
        );

        if (areaRows.length) {
          area_id = areaRows[0].area_id;
        } else {
          const [insertArea] = await connection.query(
            `INSERT INTO area (area_name, created_by_user)
             VALUES (?, ?)`,
            [areaText, 0],
          );
          area_id = insertArea.insertId;
        }
      }

      /* ------------------------------------------------
         2️⃣ INSERT INTO meta_data
      ------------------------------------------------ */
      const sql = `
        INSERT INTO meta_data
        (
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
          lead_stage_id,
          lead_sub_stage_id,
          reference_id,
          source_id,
          created_by_user,
          created_at,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Not Assigned')
      `;

      await connection.query(sql, [
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
        default_lead_stage_id,
        default_lead_sub_stage_id,
        1, // reference_id (Facebook)
        2, // source_id (Facebook)
        9, // system user
        created_time,
      ]);
    }

    await connection.commit();
    return {
      success: true,
      message: 'Leads imported (checked in raw_data & meta_data)',
    };
  } catch (err) {
    await connection.rollback();
    console.error('❌ FB Lead Import Error:', err);
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
