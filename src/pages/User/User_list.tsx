import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import EditUserForm from "./EditUserForm"; 
import { BASE_URL } from '../../../public/config.js';

const User_list = () => {
  type User = {
    id: number;
    name: string;
    contact: string;
    email: string;
    address: string;
    role: string;
    status: string;
  };
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState<User | null>(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(BASE_URL + "api/users");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const formattedData = data.map((user: any) => ({
          id: user.id,
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
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search functionality
  const handleSearch = () => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  // Handle opening the edit popup
  const openEditPopup = (user: User) => {
    setCurrentEditUser(user);
    setIsEditPopupOpen(true);
  };

  // Handle closing the edit popup
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
        BASE_URL + `api/users/${updatedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update user");

      // Update frontend data
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setFilteredData((prevFiltered) =>
        prevFiltered.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      alert("User updated successfully!");
      closeEditPopup();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  // Handle deleting a user
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(BASE_URL + `api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      // Update frontend data
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      setFilteredData(updatedUsers);

      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
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
              <th className="py-4 px-4 font-medium text-black dark:text-white">Role</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Contact No.</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <tr key={user.id}>
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
                        user.status === "active"
                          ? "bg-success text-success"
                          : "bg-danger text-danger"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-white" />
                      </button>
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
        <EditUserForm
          user={currentEditUser}
          onClose={closeEditPopup}
          onSave={handleUpdateUser}
        />
      )}                            
    </div>
  );
};

export default User_list;



