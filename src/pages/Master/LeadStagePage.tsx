import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faAdd } from '@fortawesome/free-solid-svg-icons';

const LeadStagePage = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editStagePopup, setEditStagePopup] = useState(false);
  const [showAddSubStagePopup, setShowAddSubStagePopup] = useState(false);

  const [stageName, setStageName] = useState('');
  const [subStageName, setSubStageName] = useState('');
  const [stageList, setStageList] = useState([]);
  const [subStageList, setSubStageList] = useState([]);
  const [selectedStage, setSelectedStage] = useState<any>(null);

  // Load stages
  const loadStages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/leadstages`, {
        withCredentials: true,
      });
      setStageList(res.data.data);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  // Load sub-stages for a lead stage
  const loadSubStages = async (stageId: number) => {
    try {
      const res = await axios.get(`${BASE_URL}api/lead-sub-stages/${stageId}`, {
        withCredentials: true,
      });
      setSubStageList(res.data.sub_stages);
    } catch (err) {
      console.error('Error fetching sub-stages:', err);
    }
  };

  useEffect(() => {
    loadStages();
  }, []);

  // Add Stage
  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}api/leadstage`,
        { stage_name: stageName },
        { withCredentials: true },
      );
      setStageName('');
      setShowAddPopup(false);
      loadStages();
    } catch (error) {
      console.error('Error adding stage:', error);
    }
  };

  // Edit Stage
  const handleEditStage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}api/leadstage/${selectedStage.stage_id}`,
        { stage_name: stageName },
        { withCredentials: true },
      );
      setStageName('');
      setEditStagePopup(false);
      setSelectedStage(null);
      loadStages();
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  // Delete Stage
  const handleDeleteStage = async (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this stage?',
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}api/leadstage/${id}`, {
        withCredentials: true,
      });
      loadStages();
    } catch (error) {
      console.error('Error deleting stage:', error);
    }
  };

  // Add Sub-Stage
  const handleAddSubStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStage) return;

    try {
      await axios.post(
        `${BASE_URL}api/lead-sub-stage`,
        { lead_sub_stage_name: subStageName, stage_ref_id: selectedStage.stage_id },
        { withCredentials: true },
      );
      setSubStageName('');
      setShowAddSubStagePopup(false);
      loadSubStages(selectedStage.stage_id);
    } catch (err) {
      console.error('Error adding sub-stage:', err);
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Manage Lead Stages" />

      {/* Add Lead Stage Button */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowAddPopup(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Lead Stage
        </button>
      </div>

      {/* Add Stage Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Add Lead Stage</h2>
            <form onSubmit={handleAddStage}>
              <label className="block mb-2 font-medium">Stage Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-3"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Enter stage name"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => {
                    setShowAddPopup(false);
                    setStageName('');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stage Popup */}
      {editStagePopup && selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Lead Stage</h2>
            <form onSubmit={handleEditStage}>
              <label className="block mb-2 font-medium">Stage Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-3"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Enter stage name"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => {
                    setEditStagePopup(false);
                    setSelectedStage(null);
                    setStageName('');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Stages Table */}
      <div className="max-w-full mt-2 overflow-hidden rounded border bg-white shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4">Stage ID</th>
              <th className="py-4 px-4">Stage Name</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stageList.length > 0 ? (
              stageList.map((stage) => (
                <tr key={stage.stage_id}>
                  <td className="border-b py-3 px-4">{stage.stage_id}</td>
                  <td className="border-b py-3 px-4">{stage.stage_name}</td>
                  <td className="border-b py-3 px-4 flex gap-2">
                    {/* Add Sub-Stage */}
                    <button
                      className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => {
                        setSelectedStage(stage);
                        setShowAddSubStagePopup(true);
                        loadSubStages(stage.stage_id);
                      }}
                    >
                      <FontAwesomeIcon icon={faAdd} />
                    </button>

                    {/* Edit Stage */}
                    <button
                      className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => {
                        setSelectedStage(stage);
                        setStageName(stage.stage_name);
                        setEditStagePopup(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    {/* Delete Stage */}
                    <button
                      className="py-1 px-3 bg-black text-white rounded hover:bg-gray-800"
                      onClick={() => handleDeleteStage(stage.stage_id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-5">
                  No stages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Sub-Stage Popup */}
      {showAddSubStagePopup && selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              Add Sub-Stage for: <span className="text-green-700">{selectedStage.stage_name}</span>
            </h2>

            {/* Existing Sub-Stages */}
            <div className="mb-4 border rounded p-3 bg-gray-50 max-h-48 overflow-y-auto">
              <h3 className="font-medium mb-2">Existing Sub-Stages:</h3>
              {subStageList.length > 0 ? (
                <ul className="space-y-1">
                  {subStageList.map((sub) => (
                    <li key={sub.lead_sub_stage_id} className="px-3 py-1 bg-gray-200 rounded text-sm">
                      {sub.lead_sub_stage_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No sub-stages yet.</p>
              )}
            </div>

            {/* Add New Sub-Stage */}
            <form onSubmit={handleAddSubStage}>
              <label className="block mb-2 font-medium">Sub-Stage Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-3"
                value={subStageName}
                onChange={(e) => setSubStageName(e.target.value)}
                placeholder="Enter sub-stage name"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => {
                    setShowAddSubStagePopup(false);
                    setSelectedStage(null);
                    setSubStageName('');
                    setSubStageList([]);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadStagePage;