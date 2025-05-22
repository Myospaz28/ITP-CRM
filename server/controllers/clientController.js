import { addClient, addFollowup, addMarketing, getProductsByCategory } from '../models/clientModel.js';

export const createClient = async (req, res) => {
  try {
    const {
      clientName,
      clientContact,
      contactPersonName,
      contactPersonContact,
      contactPersonEmail,
      status,
      category,
      product,
      followupDate,
      remark,
      mode,
      reference,
    } = req.body;

    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log('Session Data:', req.session);

    const userId = req.session.user.id;
    console.log('User ID from session:', userId);

    // Validate required fields
    if (!clientName || !clientContact || !contactPersonName || !contactPersonContact || !contactPersonEmail || !status || !category || !product || !followupDate || !reference) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Insert data into client table
    const clientResult = await addClient({
      clientName,
      clientContact,
      contactPersonName,
      contactPersonContact,
      contactPersonEmail,
      userId,
    });

    const clientId = clientResult.insertId; // Get the inserted client ID


    // Insert data into followup table
    await addFollowup({
      clientId,
      clientName,
      clientContact,
      followupDate,
      remark,
      status,
      userId,
    });

    // Insert data into marketing table
    await addMarketing({
      clientId,
      clientName,
      category,
      product,
      status,
      mode,
      reference,
      userId,
    });

    return res.status(201).json({ message: 'Client added successfully' });
  } catch (error) {
    console.error('Error adding client:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};




// Get products by category ID
export const getProductsByCategoryId = async (req, res) => {
  const { cat_id } = req.params;  // Get category ID from the URL parameters

  console.log('Received category ID:', cat_id);  // Log received cat_id

  // Validate the cat_id
  if (!cat_id) {
    console.log('Category ID is missing.');
    return res.status(400).json({ message: 'Category ID is required' });
  }

  try {
    // Convert cat_id to a number for the query
    const categoryId = parseInt(cat_id, 10);

    // Check if the categoryId is a valid number
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid Category ID' });
    }

    // Fetch products by category ID from the model
    const products = await getProductsByCategory(categoryId);

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for the given category' });
    }

    // Send the products as the response
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error.message);  // Log error
    res.status(500).json({ message: 'Internal server error' });
  }
};


