import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import PopupForm from './EditFollowpForm';
import ViewDetailsPopup from './ViewDetailsPopup';

interface Followup {
  followup_id: number;
  client_name: string;
  client_contact: number;
  followup_date: string;
  status: string;
  next_followup_date: string;
  remark: string;
  master_id: number;
  assignment_id: number;
  followup_status: string;
}

const Followup: React.FC = () => {
  const [followups, setFollowups] = useState<Followup[]>([]);

  const [filteredFollowups, setFilteredFollowups] = useState<Followup[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Followup | null>(null);
  const [viewFollowupId, setViewFollowupId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [followupDateFilter, setFollowupDateFilter] = useState('');
  const [refereshTrigger, setRefereshTrigger] = useState(0);
  const [fromFollowupDate, setFromFollowupDate] = useState('');
  const [toFollowupDate, setToFollowupDate] = useState('');

  const fetchFollowup = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/followups`, {
        withCredentials: true,
      });

      const followupArray = response.data.data;
      const sortedData = followupArray.sort(
        (a: Followup, b: Followup) => b.followup_id - a.followup_id,
      );

      setFollowups(sortedData);
      setFilteredFollowups(sortedData);
      setRefereshTrigger(refereshTrigger + 1);
    } catch (error) {
      console.error('Error fetching followup data:', error);
    }
  };

  useEffect(() => {
    fetchFollowup();
  }, [refereshTrigger]);

  const formatToLocalDate = (date: string | Date): string => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const results = followups.filter((followup) => {
      const followupDate = followup.followup_date
        ? formatToLocalDate(followup.followup_date)
        : '';

      const followupStatus = followup.followup_status?.toLowerCase() || '';
      const clientName = followup.client_name?.toLowerCase() || '';
      const clientContact = followup.client_contact?.toString() || '';
      const followupIdStr = followup.followup_id?.toString() || '';
      const assignIdStr = followup.assignment_id?.toString() || '';
      const masterIdStr = followup.master_id?.toString() || '';

      const matchesText =
        followupIdStr.includes(lowerSearch) ||
        clientName.includes(lowerSearch) ||
        clientContact.includes(lowerSearch) ||
        followupStatus.includes(lowerSearch) ||
        assignIdStr.includes(lowerSearch) ||
        masterIdStr.includes(lowerSearch);

      const matchesDateRange = (() => {
        if (!followupDate) return false;

        if (fromFollowupDate && toFollowupDate)
          return (
            followupDate >= fromFollowupDate && followupDate <= toFollowupDate
          );

        if (fromFollowupDate && !toFollowupDate)
          return followupDate >= fromFollowupDate;

        if (!fromFollowupDate && toFollowupDate)
          return followupDate <= toFollowupDate;

        return true;
      })();

      return matchesText && matchesDateRange;
    });

    setFilteredFollowups(results);
  }, [searchTerm, fromFollowupDate, toFollowupDate, followups]);

  const openEditPopup = (followup: Followup) => {
    setSelectedProduct(followup);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const openViewPopup = (followup: Followup) => {
    setViewFollowupId(followup.followup_id);
  };

  const closeViewPopup = () => {
    setViewFollowupId(null);
  };

  const handleUpdateProduct = (updatedProduct: Followup) => {
    const updatedfollowups = followups.map((product) =>
      product.followup_id === updatedProduct.followup_id
        ? updatedProduct
        : product,
    );
    setFollowups(updatedfollowups);
    setFilteredFollowups(updatedfollowups);
    handlePopupClose();
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Follow-up List" />

      <div className="mb-4">
        <div className="flex flex-wrap gap-4 items-end">
     
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Search by client name, category, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={fromFollowupDate}
              onChange={(e) => setFromFollowupDate(e.target.value)}
            />
          </div>

       
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={toFollowupDate}
              onChange={(e) => setToFollowupDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto min-w-[700px]">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
                Master Id
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
                Assign Id
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
                Client Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
                Client Contact
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
                Follow-up Date
              </th>

              <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowups.map((followup, index) => (
              <tr
                key={followup.followup_id}
                className="hover:bg-gray-50 dark:hover:bg-meta-3"
              >
                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {followup.master_id}
                </td>
                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {followup.assignment_id}
                </td>
                <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {followup.client_name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark whitespace-nowrap">
                  {followup.client_contact}
                </td>
                <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark whitespace-nowrap">
                  {followup.followup_date
                    ? new Date(followup.followup_date).toLocaleDateString(
                        'en-GB',
                      )
                    : '-'}
                </td>

                <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      followup.followup_status === 'Meeting Scheduled'
                        ? 'bg-gray-500 text-gray-500'
                        : followup.followup_status === 'next follow up'
                        ? 'bg-purple-300 text-purple-600'
                        : followup.followup_status === 'lead converted'
                        ? 'bg-green-300 text-green-600'
                        : followup.followup_status === 'lead cancelled'
                        ? 'bg-red-300 text-red-600'
                        : 'bg-green text-green'
                    }`}
                  >
                    {followup.followup_status
                      ? followup.followup_status.charAt(0).toUpperCase() +
                        followup.followup_status.slice(1)
                      : 'N/A'}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark text-center flex justify-center gap-2">
                  <button
                    onClick={() => openEditPopup(followup)}
                    className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-meta-3 hover:bg-opacity-75"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  <button
                    onClick={() => openViewPopup(followup)}
                    className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-blue-600 hover:bg-blue-700"
                    title="View Details"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
                {viewFollowupId && (
                  <ViewDetailsPopup
                    followupId={viewFollowupId}
                    onClose={closeViewPopup}
                  />
                )}
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
