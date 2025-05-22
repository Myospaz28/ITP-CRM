import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import PopupForm from './EditMktProduct';

interface MarketingProduct {
  mkt_id: number;
  client_name: string;
  client_contact: number;
  cat_name: string;
  product_name: string;
  status: string;
}

const MarketingProducts: React.FC = () => {
  const [products, setProducts] = useState<MarketingProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<MarketingProduct[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MarketingProduct | null>(null);

  const fetchMarketingProducts = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/marketing-product');
      const sortedData = response.data.sort((a: MarketingProduct, b: MarketingProduct) => b.mkt_id - a.mkt_id);
      setProducts(sortedData);
      setFilteredProducts(sortedData);
    } catch (error) {
      console.error("Error fetching marketing product data:", error);
    }
  };

  useEffect(() => {
    fetchMarketingProducts();
  }, []);

  const handleSearch = () => {
    const results = products.filter(
      (product) =>
        product.mkt_id.toString().includes(searchTerm) ||
        product.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.client_contact.toString().includes(searchTerm) ||
        product.cat_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  };

  const openEditPopup = (product: MarketingProduct) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = (updatedProduct: MarketingProduct) => {
    const updatedProducts = products.map((product) =>
      product.mkt_id === updatedProduct.mkt_id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    handlePopupClose();
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Marketing Product List" />
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search"
          className="p-2 border border-gray-300 rounded w-half mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">Client Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Client Contact</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Category</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Product Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.mkt_id}>
                <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{product.client_name}</h5>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">{product.client_contact}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">{product.cat_name}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">{product.product_name}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                     product.status === "meeting schedule"
                        ? "bg-gray-500 text-gray-500"
                        : product.status === "interested"
                        ? "bg-blue-300 text-blue-600"
                        : product.status === "hold"
                        ? "bg-yellow-300 text-yellow-600"
                        : product.status === "follow up"
                        ? "bg-orange-300 text-orange-600"
                        : product.status === "win"
                        ? "bg-green-300 text-green-600"
                        : "bg-danger text-danger"
                    }`}
                  >
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-meta-3"
                      onClick={() => openEditPopup(product)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && selectedProduct && (
        <PopupForm
          product={selectedProduct}
          onClose={handlePopupClose}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default MarketingProducts;
