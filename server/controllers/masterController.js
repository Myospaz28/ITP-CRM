import { addCategory, getCategories,updateCategory, deleteCategory, deleteProduct, addReference ,addProduct,updateProduct, getProducts,getReferences,  deleteReference,updateReference, deleteArea, addArea, getArea} from '../models/mastermodel.js'
import db from '../database/db.js';

// Add Category
export const createCategory = async (req, res) => {
  const { cat_name } = req.body;
  // Check session
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  const userId = req.session.user.id;
  console.log("userId : ",userId);

  try {
    const result = await addCategory([cat_name, userId]);
    res.status(201).json({ message: 'Category added successfully!', cat_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the category' });
  }
};


// show category list controller
export const categoryList = async (req, res) => {
  try {
    const category = await getCategories();
    // console.log('Users fetched from DB:', category); 
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching categories:', error); 
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};


// update category 
export const updateCategoryController = async (req, res) => {
  const { cat_id } = req.params;
  const { cat_name, status } = req.body;

  if (!cat_name || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await updateCategory(cat_id, cat_name, status);
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  
// remove category controller
export const removeCategory = async (req, res) => {
  const { cat_id } = req.params;
  console.log('Received cat_id:', cat_id);

  try {
    // Ensure the deleteCategory model is called
    const result = await deleteCategory(cat_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete Category' });
  }
};


// ------------------------------ product --------------------------------

// add product controller
export const addProductController = async (req, res) => {
  const { product_name, cat_id, product_description } = req.body;
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  if (!product_name || !cat_id || !product_description) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const createdByUser  = req.session.user.id;
  console.log("createdByUser : ", createdByUser)
  const createdAt = new Date(); // Get the current timestamp
  const status = 'active'; // Default status
  try {
    const result = await addProduct(product_name, cat_id, product_description, createdByUser , createdAt, status);
    res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// Update product controller
   export const updateProductController = async (req, res) => {
     const { product_id } = req.params;
     const { product_name, product_description, status, cat_id } = req.body;

     console.log('Received data:', req.body); // Log the request body

     if (!product_name || !product_description || !status || !cat_id) {
       return res.status(400).json({ message: "Missing required fields" });
     }

     try {
       await updateProduct(product_id, product_name, product_description, status, cat_id);
       res.status(200).json({ message: "Product updated successfully" });
     } catch (error) {
       console.error("Error updating product:", error);
       res.status(500).json({ message: "Internal server error" });
     }
   };
    


// remove Product controller
export const removeProductController = async (req, res) => {
  const { product_id } = req.params;
  console.log('Received product_id:', product_id);

  try {
    // Ensure the deleteProduct model is called
    const result = await deleteProduct(product_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting Product:', error);
    res.status(500).json({ error: 'Failed to delete Product' });
  }
};


// Fetch products with category names
export const getProductsController = async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json(products); // Return products with category names
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


// ------------------------------ References ------------------------------

// Add new reference
export const addReferenceController = async (req, res) => {
  console.log('Session:', req.session); // Log the session to see its contents
  const { reference_name } = req.body;
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  if (!reference_name) {
    return res.status(400).json({ error: 'Reference name is required' });
  }

  const createdByUser  = req.session.user.id; // Assuming you have user ID in session
  const createdAt = new Date(); // Get the current timestamp
  const status = 'active'; // Default status

  try {
    const referenceId = await addReference(reference_name, createdByUser , createdAt, status);
    res.status(201).json({ reference_id: referenceId, reference_name });
  } catch (error) {
    console.error("Error adding reference:", error);
    res.status(500).json({ error: 'Failed to add reference' });
  }
};


// Fetch references
export const getReferencesController = async (req, res) => {
  try {
    const references = await getReferences();
    res.status(200).json(references);
  } catch (error) {
    console.error("Error fetching references:", error);
    res.status(500).json({ error: 'Failed to fetch references' });
  }
};

// Delete reference
export const deleteReferenceController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteReference(id);
    res.status(200).json({ message: 'Reference deleted successfully' });
  } catch (error) {
    console.error("Error deleting reference:", error);
    res.status(500).json({ error: 'Failed to delete reference' });
  }
};

// uodate reference
export const updateReferenceController = async (req, res) => {
  const id = req.params.id;
  const { reference_name, status } = req.body;

  if (!reference_name && !status) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  const updateData = {};
  if (reference_name) updateData.reference_name = reference_name;
  if (status) updateData.status = status;

  try {
    const [result] = await db.query(
      "UPDATE reference SET ? WHERE reference_id = ?",
      [updateData, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reference not found" });
    }

    res.status(200).json({ message: "Reference updated successfully" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Error updating reference" });
  }
};



// ------------------------------ Area ------------------------------

// Add new area controller
export const addAreaController = async (req, res) => {
  console.log('Session:', req.session); // Log the session to see its contents
  const { area_name } = req.body;
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  if (!area_name) {
    return res.status(400).json({ error: 'Area name is required' });
  }

  const createdByUser  = req.session.user.id; // Assuming you have user ID in session
  const createdAt = new Date(); // Get the current timestamp

  try {
    const areaId = await addArea(area_name, createdByUser , createdAt);
    res.status(201).json({ area_id: areaId, area_name });
  } catch (error) {
    console.error("Error adding Area:", error);
    res.status(500).json({ error: 'Failed to add Area' });
  }
};


// Fetch references
export const getAreaController = async (req, res) => {
  try {
    const area = await getArea();
    res.status(200).json(area);
  } catch (error) {
    console.error("Error fetching Area:", error);
    res.status(500).json({ error: 'Failed to fetch Area' });
  }
};

// Delete area
export const deleteAreaController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteArea(id);
    res.status(200).json({ message: 'Area deleted successfully' });
  } catch (error) {
    console.error("Error deleting Area:", error);
    res.status(500).json({ error: 'Failed to delete Area' });
  }
};

// update area
export const updateAreaController = async (req, res) => {
  const id = req.params.id;
  const { area_name } = req.body;

  if (!area_name) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  const updateData = {};
  if (area_name) updateData.area_name = area_name;

  try {
    const [result] = await db.query(
      "UPDATE area SET ? WHERE area_id = ?",
      [updateData, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Area not found" });
    }

    res.status(200).json({ message: "Area updated successfully" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Error updating area" });
  }
};







// ------------------------------ Sources ---------------------------------------------

// sourceController.js


export const addSourceController = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { source_name, reference_id } = req.body;

  if (!source_name) {
    return res.status(400).json({ error: "Source name is required" });
  }

  if (!reference_id) {
    return res.status(400).json({ error: "Reference ID is required" });
  }

  const createdByUser = req.session.user.id;
  const createdAt = new Date();

  try {
    const sql = `
      INSERT INTO source (source_name, reference_id, created_by, created_at) 
      VALUES (?, ?, ?, ?)
    `;

    const values = [source_name, reference_id, createdByUser, createdAt];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      message: "Source added successfully",
      source_id: result.insertId,
      source_name,
      reference_id
    });
  } catch (error) {
    console.error("Error adding source:", error);
    res.status(500).json({ error: "Failed to add source" });
  }
};


export const getSources = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT source_id, source_name, reference_id FROM source ORDER BY source_id ASC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching sources:", error);
    res.status(500).json({ message: "Failed to fetch sources" });
  }
};


export const getSourcesByCategory = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { reference_id } = req.params; // coming from route: /source/:reference_id

  if (!reference_id) {
    return res.status(400).json({ error: "Reference ID is required" });
  }

  try {
    const sql = `
      SELECT source_id, source_name, reference_id, created_by, created_at
      FROM source
      WHERE reference_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [reference_id]);

    res.status(200).json({
      message: "Sources fetched successfully",
      total: rows.length,
      sources: rows
    });
  } catch (error) {
    console.error("Error fetching sources:", error);
    res.status(500).json({ error: "Failed to fetch sources" });
  }
};



// ------------------------------ Leadstage ---------------------------------------------

export const addLeadStage = async (req, res) => {
  const { stage_name } = req.body;


  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }


  if (!stage_name || stage_name.trim() === "") {
    return res.status(400).json({ error: "Stage name is required" });
  }

  const createdBy = req.session.user.id;

  try {
    const sql = `
      INSERT INTO lead_stage (stage_name, created_by)
      VALUES (?, ?)
    `;

    const values = [stage_name, createdBy];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      message: "Lead stage added successfully",
      stage_id: result.insertId,
      stage_name
    });

  } catch (error) {
    console.error("Error adding lead stage:", error);
    res.status(500).json({ error: "Failed to add lead stage" });
  }
};

export const getLeadStages = async (req, res) => {
  try {
    // Check session
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const sql = "SELECT * FROM lead_stage ORDER BY stage_id ASC";

    const [rows] = await db.query(sql);

    res.status(200).json({
      message: "Lead stages fetched successfully",
      data: rows
    });

  } catch (error) {
    console.error("Error fetching lead stages:", error);
    res.status(500).json({ error: "An error occurred while fetching lead stages" });
  }
};


// Update  lead stage
export const updateLeadStageController = async (req, res) => {
  const id = req.params.id; 
  const { stage_name } = req.body;

  if (!stage_name || stage_name.trim() === "") {
    return res.status(400).json({ message: "Stage name is required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE lead_stage SET stage_name = ? WHERE stage_id = ?",
      [stage_name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lead stage not found" });
    }

    res.status(200).json({ message: "Lead stage updated successfully" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Error updating lead stage" });
  }
};


//delete

export const deleteLeadStageController = async (req, res) => {
  const { id } = req.params; 

  try {
    const [result] = await db.query("DELETE FROM lead_stage WHERE stage_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lead stage not found" });
    }
 
    res.status(200).json({ message: "Lead stage deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead stage:", error);
    res.status(500).json({ error: "Failed to delete lead stage" });
  }
};


//lead sub stage
export const addLeadSubStageController = async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { lead_sub_stage_name, stage_ref_id } = req.body;

 
  if (!lead_sub_stage_name) {
    return res.status(400).json({ error: "Sub-stage name is required" });
  }

  if (!stage_ref_id) {
    return res.status(400).json({ error: "Lead stage ID is required" });
  }

  const createdByUser = req.session.user.id;
  const createdAt = new Date();

  try {
    const sql = `
      INSERT INTO lead_sub_stage 
        (lead_sub_stage_name, stage_ref_id, created_by, created_at)
      VALUES (?, ?, ?, ?)
    `;

    const values = [lead_sub_stage_name, stage_ref_id, createdByUser, createdAt];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      message: "Lead sub-stage added successfully",
      lead_sub_stage_id: result.insertId,
      lead_sub_stage_name,
      stage_ref_id,
    });
  } catch (error) {
    console.error("Error adding lead sub-stage:", error);
    res.status(500).json({ error: "Failed to add lead sub-stage" });
  }
};



// Get sub lead stage
export const getSubStagesController = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { stage_ref_id } = req.params;

  if (!stage_ref_id) {
    return res.status(400).json({ error: "Lead stage ID is required" });
  }

  try {
    const sql = `
      SELECT lead_sub_stage_id, lead_sub_stage_name, stage_ref_id, created_by, created_at
      FROM lead_sub_stage
      WHERE stage_ref_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [stage_ref_id]);

    res.status(200).json({
      message: "Lead sub-stages fetched successfully",
      total: rows.length,
      sub_stages: rows
    });
  } catch (error) {
    console.error("Error fetching lead sub-stages:", error);
    res.status(500).json({ error: "Failed to fetch lead sub-stages" });
  }
};