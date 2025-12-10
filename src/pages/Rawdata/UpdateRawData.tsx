//updateRawData.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';

interface Category {
  cat_id: number;
  cat_name: string;
}

interface Reference {
  reference_id: number;
  reference_name: string;
}

interface Area {
  area_id: number;
  area_name: string;
}

interface Source {
  source_id: number;
  source_name: string;
  reference_id: string;
}

interface Client {
  master_id: number;
  name: string;
  number: string;
  email: string;
  address: string;
  area_id: string | number;
  qualification: string;
  passout_year: string;
  fb_lead_id: string;
  form_id: string;
  page_id: string;
  cat_id: string | number;
  reference_id: string | number;
  source_id: string | number;
  status: 'Not Assigned' | 'Assigned' | 'Completed' | 'Fol...';
  lead_status: 'Active' | 'Inactive' | 'Lose' | 'Win';
  assign_id: string | number;
  created_by_user: string | number;
  created_at: string;
  lead_activity: number;
}

interface UpdateDataModalProps {
  showEditPopup: boolean;
  editingClient: Client | null;
  setEditingClient: React.Dispatch<React.SetStateAction<Client | null>>;
  closeEditPopup: () => void;
  fetchRawData: () => void;
  categories: Category[];
  references: Reference[];
  area: Area[];
  sources: Source[];
}

const UpdateRawData: React.FC<UpdateDataModalProps> = ({
  showEditPopup,
  editingClient,
  setEditingClient,
  closeEditPopup,
  fetchRawData,
  categories,
  references,
  area,
  sources: parentSources = [],
}) => {
  console.log('UpdateRawData Props:', {
    showEditPopup,
    editingClient,
    categoriesCount: categories?.length,
    referencesCount: references?.length,
    areaCount: area?.length,

    editingClientData: editingClient,
  });
  const [sourceList, setSourceList] = useState<Source[]>(parentSources);

  const handleUpdateClient = async (editingClient: Client) => {
    try {
      const response = await axios.put(
        `${BASE_URL}api/master-data/${editingClient.master_id}`,
        {
          name: editingClient.name,
          email: editingClient.email,
          number: editingClient.number,
          address: editingClient.address,
          area_id: editingClient.area_id,
          qualification: editingClient.qualification,
          passout_year: editingClient.passout_year,
          fb_lead_id: editingClient.fb_lead_id,
          form_id: editingClient.form_id,
          page_id: editingClient.page_id,
          cat_id: editingClient.cat_id,
          reference_id: editingClient.reference_id,
          source_id: editingClient.source_id,
          status: editingClient.status,
          lead_status: editingClient.lead_status,
          assign_id: editingClient.assign_id,
          created_by_user: editingClient.created_by_user,
          lead_activity: editingClient.lead_activity,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        alert('Client updated successfully');
        fetchRawData();
        return { success: true, message: 'Client updated successfully' };
      } else {
        return { success: false, message: 'Failed to update client' };
      }
    } catch (error) {
      console.error('Update failed:', error);
      return { success: false, message: 'Failed to update client' };
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (editingClient) {
      let processedValue: any = value;

      // Convert IDs to numbers
      if (
        name.includes('_id') ||
        name === 'cat_id' ||
        name === 'reference_id' ||
        name === 'source_id' ||
        name === 'area_id' ||
        name === 'assign_id' ||
        name === 'created_by_user'
      ) {
        processedValue = value ? parseInt(value) : '';
      }

      if (name === 'lead_activity') {
        processedValue = value === '1' || value === 'true' ? 1 : 0;
      }

      setEditingClient({
        ...editingClient,
        [name]: processedValue,
        // Reset source_id if reference changes
        ...(name === 'reference_id' && { source_id: '' }),
      });

      // Fetch sources when reference changes
      if (name === 'reference_id') {
        fetchSourcesByReference(processedValue);
      }
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/sources`);
      setSourceList(res.data.data);
    } catch (error) {
      console.error('Failed to fetch sources:', error);
    }
  };

  const fetchSourcesByReference = async (referenceId: number | string) => {
    if (!referenceId) {
      setSourceList([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}api/source/${referenceId}`, {
        withCredentials: true, // important if backend uses session/auth
      });

      console.log('Filtered sources:', res.data.sources || []);
      setSourceList(res.data.sources || []);
    } catch (err) {
      console.error('Error fetching sources by reference', err);
    }
  };

  useEffect(() => {
    if (editingClient?.reference_id) {
      fetchSourcesByReference(editingClient.reference_id);
    }
  }, [editingClient?.reference_id]);

  if (!showEditPopup || !editingClient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto">
      {/* Adjusted width and reduced left margin */}
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto dark:border-strokedark dark:bg-boxdark ml-20">
        <div className="flex justify-between items-center border-b-2 mb-6 pb-3 dark:border-strokedark">
          <h2 className="text-xl font-bold dark:text-white">Edit </h2>
          <button
            onClick={closeEditPopup}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await handleUpdateClient(editingClient);
            if (result.success) {
              alert(result.message);
              closeEditPopup();
            } else {
              alert(result.message);
            }
          }}
          className="space-y-6"
        >
          {/* Two-column layout with proper spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-md font-semibold mb-3 dark:text-white border-b pb-2">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editingClient.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={editingClient.number}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editingClient.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={editingClient.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-sm dark:text-white">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={editingClient.qualification || ''}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm dark:text-white">
                        Passout Year
                      </label>
                      <input
                        type="text"
                        name="passout_year"
                        value={editingClient.passout_year || ''}
                        onChange={handleInputChange}
                        placeholder="YYYY"
                        className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Category & Sources */}
              <div>
                <h3 className="text-md font-semibold mb-3 dark:text-white border-b pb-2">
                  Category & Sources
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Category
                    </label>
                    <select
                      name="cat_id"
                      value={editingClient.cat_id || ''}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select category</option>
                      {categories?.map((category) => (
                        <option key={category.cat_id} value={category.cat_id}>
                          {category.cat_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Reference
                    </label>
                    <select
                      name="reference_id"
                      value={editingClient.reference_id || ''}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select reference</option>
                      {references?.map((reference) => (
                        <option
                          key={reference.reference_id}
                          value={reference.reference_id}
                        >
                          {reference.reference_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Source
                    </label>
                    <select
                      name="source_id"
                      value={editingClient?.source_id ?? ''}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select source</option>
                      {sourceList.map((source) => (
                        <option
                          key={source.source_id}
                          value={Number(source.source_id)}
                        >
                          {source.source_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Area
                    </label>
                    <select
                      name="area_id"
                      value={editingClient.area_id || ''}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select area</option>
                      {area?.map((areaItem) => (
                        <option key={areaItem.area_id} value={areaItem.area_id}>
                          {areaItem.area_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons - Centered and better spaced */}
          <div className="flex space-x-4 pt-6 border-t dark:border-strokedark ml-100">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded text-sm font-medium transition duration-200"
            >
              Update 
            </button>
            <button
              type="button"
              onClick={closeEditPopup}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-6 py-2.5 rounded text-sm font-medium transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRawData;