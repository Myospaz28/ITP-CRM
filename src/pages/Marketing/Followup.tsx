
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import PopupForm from './EditFollowpForm';

interface Followup {
followup_id:number;
client_name:string;
client_contact:number;
followup_date:string;
status: string
}


const Followup: React.FC = () => {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFollowups, setFilteredFollowups] = useState<Followup[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Followup | null>(null);

  const fetchFollowup = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/followup');
      const sortedData = response.data.sort((a: Followup, b: Followup) => b.followup_id - a.followup_id);
      setFollowups(sortedData);
      setFilteredFollowups(sortedData);
    } catch (error) {
      console.error("Error fetching followup data:", error);
    }
  };


  useEffect(() => {
    fetchFollowup();
  }, []);


  const handleSearch = () => {
    const results = followups.filter(
      (followup) =>
        followup.followup_id.toString().includes(searchTerm) ||
        followup.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        followup.client_contact.toString().includes(searchTerm)||
        followup.followup_date.includes(searchTerm) ||
        followup.status.includes(searchTerm.toLowerCase())
    );
    setFilteredFollowups(results);
  };

  const openEditPopup = (followup: Followup) => {
    setSelectedProduct(followup);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = (updatedProduct: Followup) => {
    const updatedfollowups = followups.map((product) =>
      product.followup_id === updatedProduct.followup_id ? updatedProduct : product
    );
    setFollowups(updatedfollowups);
    setFilteredFollowups(updatedfollowups);
    handlePopupClose();
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Follow-up List" />
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
              <th className="py-4 px-4 font-medium text-black dark:text-white">Client contact</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Follow-up Date</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowups.map((followup) => (
              <tr key={followup.followup_id}>
                <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{followup.client_name}</h5>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">{followup.client_contact}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">{new Date(followup.followup_date).toLocaleDateString()}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          followup.status === "meeting schedule"
                        ? "bg-gray-500 text-gray-500"
                        : followup.status === "interested"
                        ? "bg-blue-300 text-blue-600"
                        : followup.status === "hold"
                        ? "bg-yellow-300 text-yellow-600"
                        : followup.status === "follow up"
                        ? "bg-orange-300 text-orange-600"
                        : followup.status === "win"
                        ? "bg-green-300 text-green-600"
                        : "bg-danger text-danger"
                    }`}
                >
                    {followup.status.charAt(0).toUpperCase() + followup.status.slice(1)}
                </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditPopup(followup)}
                      className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-meta-3"
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

export default Followup;


