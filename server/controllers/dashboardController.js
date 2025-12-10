
import db from '../database/db.js';


//get adssign leads
export const getTotalLeadCount = async (req, res) => {
  try {
     const { id: userId, role } = req.session.user;
    const query = `SELECT COUNT(*) AS lead_count FROM raw_data`;
     const conditions = [];
    const params = [];

    if (role === 'tele-caller') {
      conditions.push(`a.assigned_to_user_id = ?`);
      params.push(userId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY rd.master_id';
    const [rows] = await db.query(query);
    console.log("lead rows: ", rows);
    res.json(rows[0]); // returns { lead_count: number }
  } catch (error) {
    console.error("Error fetching leads count:", error);
    res.status(500).json({ error: "Failed to fetch leads count" });
  }
};

export const getAssignedLeadCount = async (req, res) => {
  try {
    const { id: userId, role } = req.session.user;
    console.log("Session user:", req.session.user);

    let query = `
      SELECT COUNT(*) AS assigned_count
      FROM raw_data rd
    `;
    const params = [];

    if (role === 'tele-caller') {
      query += `
        JOIN assignments a ON rd.assign_id = a.assign_id
        WHERE rd.status = 'Assigned' AND a.assigned_to_user_id = ?
      `;
      params.push(userId);
    } else {
      // for admin or other roles
      query += ` WHERE rd.status = 'Assigned'`;
    }

    const [rows] = await db.query(query, params);
    console.log("Assigned rows:", rows);

    res.json(rows[0] || { assigned_count: 0 });
  } catch (error) {
    console.error("Error fetching assigned leads count:", error);
    res.status(500).json({ error: "Failed to fetch assigned leads count" });
  }
};




// followups 
export const getfollowups = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS followup_count FROM followup`;
    const [rows] = await db.query(query);
   console.log("followup rows: ", rows);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching Followups count:", error);
    res.status(500).json({ error: "Failed to fetch followups count" });
  }
}


// meeting scheduled
export const getMeetingScheduled = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS meeting_count FROM meeting_schedule`;
    const [rows] = await db.query(query);
   console.log("Meeting rows: ", rows);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching Meeting count:", error);
    res.status(500).json({ error: "Failed to fetch Meeting count" });
  }
}


// Category
export const getcategory = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS category_count FROM category`;
    const [rows] = await db.query(query);
   console.log("category rows: ", rows);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching category count:", error);
    res.status(500).json({ error: "Failed to fetch category count" });
  }
}


// Category
export const getProducts = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS product_count FROM product`;
    const [rows] = await db.query(query);
   console.log("product rows: ", rows);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({ error: "Failed to fetch product count" });
  }
}

// 


// Category
export const getConvertedLeads = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS converted_count FROM raw_data WHERE status= 'lead Converted'`;
    const [rows] = await db.query(query);
   console.log("converted rows: ", rows);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching cnverted count:", error);
    res.status(500).json({ error: "Failed to fetch converted count" });
  }
}


export const getTotalCampaignCount = async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS campaign_count FROM campaigns`;

    const [rows] = await db.query(query);

    res.json({ campaign_count: rows[0].campaign_count || 0 });
  } catch (error) {
    console.error("Error fetching campaign count:", error);
    res.status(500).json({ error: "Failed to fetch campaign count" });
  }
};


// Category
// export const getConvertedLeads = async (req, res) => {
//   try {
//     const query = `SELECT COUNT(*) AS converted_count FROM raw_data WHERE status= 'lead Converted'`;
//     const [rows] = await db.query(query);
//    console.log("converted rows: ", rows);
//     res.json(rows[0]);
//   } catch (error) {
//     console.error("Error fetching cnverted count:", error);
//     res.status(500).json({ error: "Failed to fetch converted count" });
//   }
// }