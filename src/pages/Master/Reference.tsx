
import { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faAdd } from '@fortawesome/free-solid-svg-icons';
import AddReferenceForm from './AddReferenceForm';
import EditReference from './EditReference';

const Reference = () => {
  const [reference, setReference] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddSourcePopup, setShowAddSourcePopup] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);
  const [sourceName, setSourceName] = useState('');
  const [sourceFeedback, setSourceFeedback] = useState('');
  const [sourceList, setSourceList] = useState([]);

  // Fetch reference list
  const loadReference = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/reference');
      setReference(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching reference:', error);
    }
  };

  useEffect(() => {
    loadReference();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this reference?',
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}api/reference/${id}`);
      const updated = reference.filter((item) => item.reference_id !== id);
      setReference(updated);
      setFilteredData(updated);
      alert('Reference deleted successfully!');
    } catch (error) {
      console.error('Error deleting reference:', error);
      alert('Failed to delete reference.');
    }
  };

  // Search filter
  const handleSearch = () => {
    const filtered = reference.filter((ref) =>
      Object.values(ref).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setFilteredData(filtered);
  };

  // Add Source Submit Handler
  const handleAddSource = async (e) => {
    e.preventDefault();

    const data = {
      source_name: sourceName,
      reference_id: selectedReference.reference_id,
    };

    try {
      await axios.post(`${BASE_URL}api/addsource`, data, {
        withCredentials: true,
      });

      setSourceFeedback('Source added successfully!');

      setTimeout(() => {
        setSourceFeedback('');
        setSourceName('');
        setShowAddSourcePopup(false);
        loadReference();
      }, 1200);
    } catch (error) {
      console.error('Error adding source:', error);
      setSourceFeedback('Failed to add source');
    }
  };

  useEffect(() => {
    if (selectedReference && showAddSourcePopup) {
      fetchSources(selectedReference.reference_id);
    }
  }, [selectedReference, showAddSourcePopup]);

  const fetchSources = async (referenceId) => {
    try {
      const response = await axios.get(`${BASE_URL}api/source/${referenceId}`, {
        withCredentials: true,
      });

      setSourceList(response.data.sources || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Manage References" />

      <div className="flex justify-between">
        <div className="mb-4 mr-5">
          <button
            onClick={() => {
              setSelectedReference(null);
              setShowPopup(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Reference
          </button>
        </div>

        <div className="flex mb-5">
          <input
            type="text"
            className="border rounded px-4 py-2 mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* Add / Edit Reference Popup */}
      {showPopup && selectedReference === null && (
        <AddReferenceForm
          onClose={() => setShowPopup(false)}
          onReferenceAdded={loadReference}
        />
      )}

      {showPopup && selectedReference !== null && (
        <EditReference
          referenceToEdit={selectedReference}
          onClose={() => {
            setShowPopup(false);
            setSelectedReference(null);
          }}
          onReferenceUpdated={loadReference}
        />
      )}

      {showAddSourcePopup && selectedReference && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              Add Source for:
              <span className="text-green-700">
                {' '}
                {selectedReference.reference_name}
              </span>
            </h2>

            {/* -------- Existing Sources -------- */}
            <div className="mb-4 border rounded p-3 bg-gray-50 max-h-48 overflow-y-auto">
              <h3 className="font-medium mb-2">Existing Sources:</h3>

              {sourceList.length > 0 ? (
                <ul className="space-y-1">
                  {sourceList.map((src) => (
                    <li
                      key={src.source_id}
                      className="px-3 py-1 bg-gray-200 rounded text-sm"
                    >
                      {src.source_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No sources yet.</p>
              )}
            </div>

            {/* -------- Add New Source -------- */}
            <form onSubmit={handleAddSource}>
              <label className="block mb-2 font-medium">Source Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-3"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="Enter source name"
                required
              />

              {sourceFeedback && (
                <p className="text-green-600 mb-2">{sourceFeedback}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => {
                    setShowAddSourcePopup(false);
                    setSelectedReference(null);
                    setSourceName('');
                    setSourceList([]);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="max-w-full mt-2 overflow-hidden rounded border bg-white shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4">Reference ID</th>
              <th className="py-4 px-4">Reference From</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.reference_id}>
                  <td className="border-b py-3 px-4">{item.reference_id}</td>
                  <td className="border-b py-3 px-4">{item.reference_name}</td>
                  <td className="border-b py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        item.status === 'active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="border-b py-3 px-4">
                    <div className="flex items-center gap-2">
                      {/* ADD SOURCE */}
                      <button
                        className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => {
                          setSelectedReference(item);
                          setShowAddSourcePopup(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faAdd} />
                      </button>

                      {/* EDIT */}
                      <button
                        className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => {
                          setSelectedReference(item);
                          setShowPopup(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      {/* DELETE */}
                      <button
                        className="py-1 px-3 bg-black text-white rounded hover:bg-gray-800"
                        onClick={() => handleDelete(item.reference_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-5">
                  No reference found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reference;