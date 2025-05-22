

import db from "../database/db.js";


export const insertRawData = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO raw_data 
      (name, number, email, address, cat_name, reference_name, status, assign_id, user_id, created_at)
      VALUES ?
    `;

    // Append 'Pending' as status and NULL for assign_id
    const formattedData = data.map(row => [
      row.name,
      row.contact,
      row.email,
      row.address,
      row.cat_name,
      row.reference_name,
      'Not Assigned',      // status
      null,           // assign_id
      row.user_id,
      new Date()
    ]);

    db.query(sql, [formattedData], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};



/// retrieve raw data from database modal.
export const getRawData = async () => {
  const query = `SELECT master_id, name, number, email, address, cat_name, reference_name, status, assign_id, user_id
    FROM raw_data
    WHERE status = 'Not Assigned'
    ORDER BY master_id ASC`;
  const [rows] = await db.query(query);
  return rows;
};

