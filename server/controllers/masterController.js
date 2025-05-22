import { addCategory, getCategories, deleteCategory, addReference ,addProduct, getProducts,getReferences,  deleteReference} from '../models/mastermodel.js'


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


// category list controller
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


// Add productController.js
export const addProductController = async (req, res) => {
  const { product_name, cat_id } = req.body;

  if (!product_name || !cat_id) {
    return res.status(400).json({ error: 'Product name and category ID are required' });
  }

  try {
    const result = await addProduct(product_name, cat_id);
    res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
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
  const { reference_name } = req.body;
  try {
    const referenceId = await addReference(reference_name);
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
};1

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




