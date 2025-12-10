import React, { useState, useEffect } from 'react';
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

interface InsertDataModalProps {
  showAddPopup: boolean;
  setShowAddPopup: (show: boolean) => void;
  singleFormData: {
    name: string;
    number: string;
    email: string;
    address: string;
    qualification?: string;
    passout_year?: string;
    cat_id: string;
    reference_id: string;
    source_id?: string;
    area_id: string;
    user_id: string;
    showDuplicateModal: boolean;
    duplicateEntries: any[];

  };
  setSingleFormData: (data: any) => void;
  categories: Category[];
  references: Reference[];       // <-- ADDED
  area: Area[];
  fetchRawData: () => void;
  setError: (error: string) => void;
  setDuplicateEntries: (entries: any[]) => void;
  setShowDuplicateModal: (show: boolean) => void;
}

const InsertDataModal: React.FC<InsertDataModalProps> = ({
  showAddPopup,
  setShowAddPopup,
  singleFormData,
  setSingleFormData,
  categories,
  references,
  area,
  fetchRawData,
  setError,
  setDuplicateEntries,
  setShowDuplicateModal,
  showDuplicateModal,      
  duplicateEntries   
}) => {

  const handleSingleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "reference_id") {
      setSingleFormData((prev) => ({
        ...prev,
        reference_id: value,
        source_id: "",
      }));
      fetchSourcesByReference(value);
      return;
    }

    setSingleFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const [sourceList, setSourceList] = useState([]);
  const [users, setUsers] = useState([]);
  // const [references, setReferences] = useState<Reference[]>([]);

  const handleAddSingleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}api/master-data/add-single`,
        {
          name: singleFormData.name,
          number: singleFormData.number,
          email: singleFormData.email,
          address: singleFormData.address,
          qualification: singleFormData.qualification,
          passout_year: singleFormData.passout_year,
          cat_id: singleFormData.cat_id,
          reference_id: singleFormData.reference_id,
          source_id: singleFormData.source_id,
          area_id: singleFormData.area_id,
          assigned_to_user_id: singleFormData.user_id,
        },
        { withCredentials: true },
      );

      if (response.status === 200) {
        alert('Client added successfully.');

        setSingleFormData({
          name: '',
          number: '',
          email: '',
          address: '',
          qualification: '',
          passout_year: '',
          cat_id: '',
          reference_id: '',
          source_id: '',
          area_id: '',
          user_id: '',
        });
        setShowAddPopup(false);
        fetchRawData();
      }
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.message || 'Failed to add client.';
      const duplicates = err.response?.data?.duplicates || [];

      if (duplicates.length > 0) {
        setShowAddPopup(false);
        setDuplicateEntries(duplicates);
        setShowDuplicateModal(true);
      } else {
        setError(backendMessage);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/users`);

      // console.log('Users response:', res.data);

      setUsers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

useEffect(() => {
  fetchUsers();
}, []);


  const fetchSources = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/sources`);
      // console.log("Sources API:", res.data);

      setSourceList(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch sources:', error);
    }
  };

 
const fetchSourcesByReference = async (referenceId: string) => {
  if (!referenceId) {
    setSourceList([]);
    return;
  }

  try {
    const res = await axios.get(`${BASE_URL}api/source/${referenceId}`, {
      withCredentials: true,  
    });

    // console.log("sources", res);
    setSourceList(res.data.sources || []);
  } catch (err) {
    console.error("Error fetching sources", err);
  }
};

const handleDuplicateModalClose = () => {
  setShowDuplicateModal(false);
  setDuplicateEntries([]);
};



  if (!showAddPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto dark:border-strokedark dark:bg-boxdark ml-20">
        <div className="flex justify-between items-center border-b-2 mb-6 pb-3 dark:border-strokedark">
          <h2 className="text-xl font-bold dark:text-white">Insert Data</h2>
          <button
            onClick={() => setShowAddPopup(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddSingleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-semibold mb-3 dark:text-white border-b pb-2">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={singleFormData.name}
                      onChange={handleSingleFormChange}
                      required
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      WhatsApp Number *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={singleFormData.number}
                      onChange={handleSingleFormChange}
                      required
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={singleFormData.email}
                      onChange={handleSingleFormChange}
                      required
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={singleFormData.address}
                      onChange={handleSingleFormChange}
                      rows={2}
                      required
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={singleFormData.qualification || ''}
                      onChange={handleSingleFormChange}
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
                      value={singleFormData.passout_year || ''}
                      onChange={handleSingleFormChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-semibold mb-3 dark:text-white border-b pb-2">
                  Category & Sources
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Category *
                    </label>
                    <select
                      name="cat_id"
                      value={singleFormData.cat_id}
                      onChange={handleSingleFormChange}
                      required
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select category</option>
                      {(categories || []).map((cat) => (
                        <option key={cat.cat_id} value={cat.cat_id}>
                          {cat.cat_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Reference *
                    </label>
                    <select
                      name="reference_id"
                      value={singleFormData.reference_id}
                      onChange={handleSingleFormChange}
                      required
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select reference</option>
                      {(references || []).map((ref) => (
                        <option key={ref.reference_id} value={ref.reference_id}>
                          {ref.reference_name}
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
                      value={singleFormData.source_id || ''}
                      onChange={handleSingleFormChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select source</option>

                      {sourceList.map((source) => (
                        <option key={source.source_id} value={source.source_id}>
                          {source.source_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Area *
                    </label>
                    <select
                      name="area_id"
                      value={singleFormData.area_id}
                      onChange={handleSingleFormChange}
                      required
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select area</option>
                      {(area || []).map((a) => (
                        <option key={a.area_id} value={a.area_id}>
                          {a.area_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Assign User
                    </label>

                    <select
                      name="user_id"
                      value={singleFormData.user_id || ''}
                      onChange={handleSingleFormChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select user</option>

                      {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-strokedark">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowAddPopup(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

           {/* Duplicate Entries Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[75vh] overflow-auto 
      dark:border-strokedark dark:bg-boxdark"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b mb-4 pb-2 dark:border-strokedark">
              <h2 className="text-xl font-bold dark:text-white">
                Duplicate Entries Found
              </h2>
              <button
                onClick={handleDuplicateModalClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            {/* Message */}
            <p className="text-red-600 dark:text-red-400 font-semibold mb-4">
              {duplicateEntries.length} duplicate entries found in your import
              file. Please review the duplicates:
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-sm">
                    <th className="border px-3 py-2">Row</th>
                    <th className="border px-3 py-2">Name</th>
                    <th className="border px-3 py-2">Email</th>
                    <th className="border px-3 py-2">Contact</th>
                    <th className="border px-3 py-2">Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicateEntries.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="border px-3 py-2">
                        {entry.row || index + 1}
                      </td>
                      <td className="border px-3 py-2">
                        {entry.name || 'N/A'}
                      </td>
                      <td className="border px-3 py-2">
                        {entry.email ? (
                          <span className="text-red-600 font-semibold">
                            {entry.email}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="border px-3 py-2">
                        {entry.number || entry.contact ? (
                          <span className="text-red-600 font-semibold">
                            {entry.number || entry.contact}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="border px-3 py-2">
                        {entry.email && entry.number ? (
                          <span className="text-red-600 font-semibold">
                            Email & Contact both exist
                          </span>
                        ) : entry.email ? (
                          <span className="text-orange-600">Email exists</span>
                        ) : (
                          <span className="text-orange-600">
                            Contact exists
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelImport}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel Import
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default InsertDataModal;