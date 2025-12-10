import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';

const EditProductForm = ({ product, onClose, onProductUpdated }) => {
  const [productName, setProductName] = useState(product.product_name);
  const [productDescription, setProductDescription] = useState(product.product_description);
  const [status, setStatus] = useState(product.status);
  const [catId, setCatId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/category`);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);



  useEffect(() => {
    console.log('Setting catId from product.cat_id:', product.cat_id);
    if (product.cat_id !== undefined && product.cat_id !== null) {
      setCatId(String(product.cat_id));
    }
  }, [product.cat_id]);




  useEffect(() => {
  if (categories.length > 0 && product.cat_name) {
    const matchedCategory = categories.find(cat => cat.cat_name === product.cat_name);
    if (matchedCategory) {
      setCatId(String(matchedCategory.cat_id));
    }
  }
}, [categories, product.cat_name]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericCatId = parseInt(catId, 10);

    if (!productName || !productDescription || !status || isNaN(numericCatId)) {
      alert('Please fill all fields correctly.');
      return;
    }

    const payload = {
      product_name: productName,
      product_description: productDescription,
      status,
      cat_id: numericCatId,
    };



    try {
      await axios.put(`${BASE_URL}api/product/${product.product_id}`, payload);
      alert('Product updated successfully');
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error(
        'Update failed:',
        error.response ? error.response.data : error.message,
      );
      alert('Failed to update product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Product Name</label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border w-full p-2 mb-4"
            required
          />

          <label className="block mb-2">Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="border w-full p-2 mb-4"
            required
          />

          <label className="block mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border w-full p-2 mb-4"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <label className="block mb-2">Category</label>
          <select
            value={catId}
            onChange={(e) => setCatId(e.target.value)}
            required
            className="border w-full p-2 mb-4"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.cat_id} value={String(cat.cat_id)}>
                {cat.cat_name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
