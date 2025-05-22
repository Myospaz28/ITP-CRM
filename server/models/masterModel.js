import db from '../database/db.js';

// Function to add a category to the database
export const addCategory = async (data) => {
  const query = 'INSERT INTO category (cat_name, user_id) VALUES (?, ?)';
  const [result] = await db.query(query, data);
  return result;
};


// Function to fetch users from the database
export const getCategories = async () => {
  const query = 'SELECT cat_id, cat_name FROM category ORDER BY cat_id';
  const [rows] = await db.query(query);
   return rows;
};


// delete category 
export const deleteCategory = async (cat_id) => {
  const query = 'DELETE FROM category WHERE cat_id = ?';
  const [result] = await db.query(query, [cat_id]);
  return result;
};
  

// ------------------------------ Product ---------------------------------------------


// Add a new product to the database
export const addProduct = async (product_name, cat_id) => {
  const query = 'INSERT INTO product (product_name, cat_id) VALUES (?, ?)';
  const result = await db.query(query, [product_name, cat_id]);
  return result;
};

// Fetch products with their category names
export const getProducts = async () => {
  const query = `
    SELECT p.product_id, p.product_name, c.cat_name
    FROM product p
    JOIN category c ON p.cat_id = c.cat_id
    ORDER BY p.product_id;
  `;
  const [rows] = await db.query(query);
  return rows;
};
// ------------------------------ Reference  ---------------------------------------------

// Add a new reference
export const addReference = async (reference_name) => {
  const query = 'INSERT INTO reference (reference_name) VALUES (?)';
  const [result] = await db.query(query, [reference_name]);
  return result.insertId;  // Return the ID of the newly inserted reference
};

// Fetch all references
export const getReferences = async () => {
  const query = 'SELECT reference_id, reference_name FROM reference ORDER BY reference_id';
  const [rows] = await db.query(query);
  return rows;
};

// Delete a reference by ID
export const deleteReference = async (id) => {
  const query = 'DELETE FROM reference WHERE reference_id = ?';
  await db.query(query, [id]);
};