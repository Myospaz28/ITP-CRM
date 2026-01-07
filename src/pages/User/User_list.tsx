import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import EditUserForm from './EditUserForm';
import { BASE_URL } from '../../../public/config.js';
import axios from 'axios';

type TeleCaller = {
  id: number;
  name: string;
};

const User_list = () => {
  type User = {
    user_id: number;
    name: string;
    contact: string;
    email: string;
    address: string;
    role: string;
    status: string;
  };
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState<User | null>(null);
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const [teleCallers, setTeleCallers] = useState<TeleCaller[]>([]);
  const [assignedCount, setAssignedCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);
  const [assignedTeleCallers, setAssignedTeleCallers] = useState<
    { id: number; name: string }[]
  >([]);

  const [assignedNames, setAssignedNames] = useState<string>('');

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(BASE_URL + 'api/users');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('Fetched users data:', data);

        const formattedData = data.map((user: any) => ({
          user_id: user.user_id,
          name: user.name,
          role: user.role,
          email: user.email,
          address: user.address,
          contact: user.contact_no,
          status: user.status,
        }));

        setUsers(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setFilteredData(filtered);
  };

  const openEditPopup = (user: User) => {
    console.log('Opening edit popup for user:', user);
    setCurrentEditUser(user);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setCurrentEditUser(null);
  };

  // Handle updating a user
  const handleUpdateUser = async (updatedUser: User) => {
    try {
      // Map fields to match backend
      const payload = {
        ...updatedUser,
        contact_no: updatedUser.contact,
      };

      const response = await fetch(
        BASE_URL + `api/users/${updatedUser.user_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) throw new Error('Failed to update user');

      // Update frontend data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === updatedUser.user_id ? updatedUser : user,
        ),
      );
      setFilteredData((prevFiltered) =>
        prevFiltered.map((user) =>
          user.user_id === updatedUser.user_id ? updatedUser : user,
        ),
      );

      alert('User updated successfully!');
      closeEditPopup();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  // Handle deleting a user
  const handleDelete = async (user_id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?',
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(BASE_URL + `api/users/${user_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      // Update frontend data
      const updatedUsers = users.filter((user) => user.user_id !== user_id);
      setUsers(updatedUsers);
      setFilteredData(updatedUsers);

      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const openAssignPopup = (leadId: number) => {
    setSelectedLeadId(leadId);
    setSelectedUserIds([]);
    setIsAssignPopupOpen(true);
  };

  const handleCheckboxToggle = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  useEffect(() => {
    const fetchUnassignedTeleCallers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/fetchUnassignedTeleCallers`,
        );

        const formattedTeleCallers = response.data.map((u: any) => ({
          id: Number(u.user_id),
          name: u.name,
        }));

        setTeleCallers(formattedTeleCallers);
      } catch (error) {
        console.error('❌ Failed to fetch tele-callers:', error);
      }
    };

    fetchUnassignedTeleCallers();
  }, []);

  const handleAssignTeleCallers = async () => {
    try {
      await axios.post(`${BASE_URL}api/assignTeleCallersToLead`, {
        lead_id: selectedLeadId,
        tele_caller_ids: selectedUserIds,
      });

      alert('Tele-callers assigned successfully');

      // Close popup & reset
      setIsAssignPopupOpen(false);
      setSelectedUserIds([]);

      // Refresh unassigned tele-callers
      const res = await axios.get(`${BASE_URL}api/fetchUnassignedTeleCallers`);
      setTeleCallers(
        res.data.map((u: any) => ({
          id: Number(u.user_id),
          name: u.name,
        })),
      );
    } catch (error) {
      console.error('❌ Assignment failed:', error);
      alert('Failed to assign tele-callers');
    }
  };

  useEffect(() => {
    const fetchAssignedCount = async () => {
      if (!isAssignPopupOpen || !selectedLeadId) return;

      try {
        setLoadingCount(true);

        const response = await axios.get(
          `${BASE_URL}api/getTeleCallerCountByLead/${selectedLeadId}`,
        );

        const data = response.data;

        setAssignedCount(data.tele_caller_count || 0);
        setAssignedNames(data.tele_caller_names || '');
      } catch (error) {
        console.error('❌ Failed to fetch tele-caller count:', error);
        setAssignedCount(0);
        setAssignedNames('');
      } finally {
        setLoadingCount(false);
      }
    };

    fetchAssignedCount();
  }, [isAssignPopupOpen, selectedLeadId]);

  //ritesh changes
  const handleRemoveTeleCaller = async (teleCallerId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this tele-caller from the lead?',
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}api/removeTeleCaller/${teleCallerId}`);

      // Update frontend state
      setSelectedUserIds((prev) => prev.filter((id) => id !== teleCallerId));

      const res = await axios.get(
        `${BASE_URL}api/getTeleCallerCountByLead/${selectedLeadId}`,
      );
      setAssignedCount(res.data.tele_caller_count || 0);
      setAssignedNames(res.data.tele_caller_names || '');

      alert('Tele-caller removed successfully!');
    } catch (error) {
      console.error('❌ Failed to remove tele-caller:', error);
      alert('Failed to remove tele-caller.');
    }
  };

  return (
    <div>
      <Breadcrumb pageName="User List" />

      {/* Search Bar Section */}
      <div className="flex items-center mb-5 mt-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-10 py-2 mr-2"
          placeholder="Search users..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Role
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Contact No.
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <tr key={user.user_id}>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user.role}</p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user.email}</p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user.contact}</p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        user.status === 'active'
                          ? 'bg-success text-success'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditPopup(user)}
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-meta-3"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-white" />
                      </button>
                      {user.role === 'team lead' && (
                        <button
                          onClick={() => openAssignPopup(user.user_id)}
                          className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white bg-black hover:bg-opacity-75"
                        >
                          <FontAwesomeIcon icon={faAdd} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-5">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    
      {/* Render EditUserForm if edit popup is open */}
      {isEditPopupOpen && currentEditUser && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
          <EditUserForm
            user={currentEditUser}
            onClose={closeEditPopup}
            onSave={handleUpdateUser}
          />
        </div>
      )}

      {isAssignPopupOpen && selectedLeadId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-3">Assign Tele-Callers</h2>

            {/* Assigned Count */}
            <div className="mb-4 border rounded p-3 bg-gray-50">
              <h3 className="font-medium mb-1">Already Assigned</h3>

              {loadingCount ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : assignedCount ? (
                <div className="space-y-1">
                  {assignedNames.split(',').map((name, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm text-green-700"
                    >
                      <span>{name.trim()}</span>
                      {/* <button
            className="text-red-600 hover:underline px-2 py-1 text-xs"
            onClick={() => handleRemoveTeleCaller(name.trim())}
          >
            Remove
          </button> */}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No tele-callers assigned yet
                </p>
              )}
            </div>

            {/* Tele-caller List */}
            <div className="mb-4 border rounded p-3 bg-gray-50 max-h-48 overflow-y-auto">
              <h3 className="font-medium mb-2">Available Tele-Callers</h3>

              {teleCallers.length > 0 ? (
                <div className="space-y-2">
                  {teleCallers.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleCheckboxToggle(user.id)}
                      />
                      <span>{user.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No tele-callers available
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAssignPopupOpen(false);
                  setSelectedUserIds([]);
                  setAssignedCount(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>

              <button
                disabled={!selectedUserIds.length}
                onClick={handleAssignTeleCallers}
                className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User_list;
