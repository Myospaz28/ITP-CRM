import { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import DocumentUpload from './DocumentUpload';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();
  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(BASE_URL + 'api/product');
        setProducts(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?',
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}api/product/${id}`);
      const updatedProducts = products.filter(
        (product) => product.product_id !== id,
      );
      setProducts(updatedProducts);
      setFilteredData(updatedProducts);
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditPopup(true);
  };

  const handleSearch = () => {
    const filtered = products.filter((product) =>
      Object.values(product).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <Breadcrumb pageName="Manage Products" />

      <div className="flex justify-between items-start mb-4">
        {/* Left side: Add Product button + Search bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <button
            onClick={() => setShowAddPopup(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Product
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-4 py-2"
              placeholder="Search products..."
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Popup Form for Adding Product */}
      {showAddPopup && (
        <AddProductForm
          onClose={() => setShowAddPopup(false)}
          onProductAdded={() => {
            axios.get(BASE_URL + 'api/product').then((response) => {
              setProducts(response.data);
              setFilteredData(response.data);
            });
          }}
        />
      )}

      {/* Product List Table */}
      <div className="mt-2 overflow-hidden rounded-sm border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              <th className="py-3 px-4 font-medium text-black dark:text-white">
                Sr. No.
              </th>
              <th className="py-3 px-4 font-medium text-black dark:text-white">
                Product Name
              </th>
              <th className="py-3 px-4 font-medium text-black dark:text-white">
                Product Description
              </th>
              <th className="py-3 px-4 font-medium text-black dark:text-white">
                Category
              </th>
              <th className="py-3 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-3 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((product, index) => (
                <tr
                  key={product.product_id}
                  className="border-b border-[#eee] dark:border-strokedark"
                >
                  <td className="py-3 px-4 text-black dark:text-white">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 text-black dark:text-white">
                    {product.product_name}
                  </td>
                  <td className="py-3 px-4 text-black dark:text-white">
                    {product.product_description}
                  </td>
                  <td className="py-3 px-4 text-black dark:text-white">
                    {product.cat_name}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                        product.status === 'active'
                          ? 'bg-green-500 text-green-600'
                          : 'bg-red-500 text-red-600'
                      }`}
                    >
                      {product.status.charAt(0).toUpperCase() +
                        product.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center justify-center rounded-md px-3 py-1 text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleEdit(product)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md px-3 py-1 text-white bg-black hover:bg-opacity-75"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md px-3 py-1 text-white bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          navigate(`/upload-document/${product.product_id}`)
                        }
                      >
                        <FontAwesomeIcon icon={faUpload} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-5 text-gray-600 dark:text-gray-300"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;

{
  /* <div className="max-w-full mt-2 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              <th className=" py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Sr. No.
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Product Name
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Product Description
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Category{' '}
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Status{' '}
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((product, index) => (
                <tr key={product.product_id}>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {index + 1}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {product.product_name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {product.product_description}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {product.cat_name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium justify-content-center align-items-center ${
                        product.status === 'active'
                          ? 'bg-success text-success'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {product.status.charAt(0).toUpperCase() +
                        product.status.slice(1)}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-3 px-5 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-blue-600 hover:bg-blue-700"
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleEdit(product)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-white"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-5">
                  No products found
                </td>
              </tr>
            )}

            {showEditPopup && selectedProduct && (
              <EditProductForm
                product={selectedProduct}
                onClose={() => setShowEditPopup(false)}
                onProductUpdated={() => {
                  // Refetch products after updating
                  axios.get(BASE_URL + 'api/product').then((response) => {
                    setProducts(response.data);
                    setFilteredData(response.data);
                  });
                }}
              />
            )}
          </tbody>
        </table>
      </div> */
}
