// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config';

// interface User {
//   user_id: number;
//   name: string;
//   role: 'tele-caller' | 'team lead';
// }

// interface Props {
//   selectedLeadIds: number[];
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const AssignLeadPopup: React.FC<Props> = ({
//   selectedLeadIds,
//   onClose,
//   onSuccess,
// }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedRole, setSelectedRole] = useState<
//     'tele-caller' | 'team lead' | ''
//   >('');
//   const [selectedUser, setSelectedUser] = useState<number | ''>('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/users`);
//       setUsers(res.data || []);
//     } catch (error) {
//       console.error('Error fetching users', error);
//       setUsers([]);
//     }
//   };

//   /** Filter users only after role is selected */
//   const filteredUsers =
//     selectedRole === '' ? [] : users.filter((u) => u.role === selectedRole);

//   const handleAssign = async () => {
//     if (!selectedUser || selectedLeadIds.length === 0) {
//       alert('Please select leads and user');
//       return;
//     }

//     const selectedUserObj = users.find((u) => u.user_id === selectedUser);

//     if (!selectedUserObj) {
//       alert('Invalid user selected');
//       return;
//     }

//     try {
//       await axios.post(
//         `${BASE_URL}api/assign-leads`,
//         {
//           leadIds: selectedLeadIds,
//           userId: selectedUser,
//           userName: selectedUserObj.name, // ✅ FIX
//           mode: 'manual',
//         },
//         {
//           withCredentials: true,
//         },
//       );

//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error(error);
//       alert('Failed to assign leads');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//         <h2 className="text-lg font-semibold mb-4">
//           Assign Leads ({selectedLeadIds.length})
//         </h2>

//         {/* Role Selection */}
//         <div className="mb-4 flex gap-6">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={selectedRole === 'tele-caller'}
//               onChange={() => {
//                 setSelectedRole('tele-caller');
//                 setSelectedUser('');
//               }}
//             />
//             Telecaller
//           </label>

//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={selectedRole === 'team lead'}
//               onChange={() => {
//                 setSelectedRole('team lead');
//                 setSelectedUser('');
//               }}
//             />
//             Team Lead
//           </label>
//         </div>

//         {/* User Dropdown (always visible) */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium mb-1">Select User</label>
//           <select
//             value={selectedUser}
//             onChange={(e) =>
//               setSelectedUser(e.target.value ? Number(e.target.value) : '')
//             }
//             className="w-full border p-2 rounded"
//           >
//             <option value="">-- Select User --</option>

//             {filteredUsers.map((user) => (
//               <option key={user.user_id} value={user.user_id}>
//                 {user.name}
//               </option>
//             ))}
//           </select>

//           {selectedRole === '' && (
//             <p className="text-xs text-gray-500 mt-1">
//               Please select role first
//             </p>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleAssign}
//             disabled={!selectedUser || loading}
//             className={`px-4 py-2 text-white rounded ${
//               !selectedUser || loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Assigning...' : 'Assign'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignLeadPopup;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config';
// import { toast } from 'react-toastify';

// interface User {
//   user_id: number;
//   name: string;
//   role: 'tele-caller' | 'team lead';
// }

// interface Props {
//   selectedLeadIds: number[];
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const AssignLeadPopup: React.FC<Props> = ({
//   selectedLeadIds,
//   onClose,
//   onSuccess,
// }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedRole, setSelectedRole] = useState<
//     'tele-caller' | 'team lead' | ''
//   >('');
//   const [selectedUser, setSelectedUser] = useState<number | ''>('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/users`);
//       setUsers(res.data || []);
//     } catch (error) {
//       console.error('Error fetching users', error);
//       setUsers([]);
//     }
//   };

//   /** Filter users only after role is selected */
//   const filteredUsers =
//     selectedRole === ''
//       ? []
//       : selectedRole === 'tele-caller'
//       ? users.filter((u) => u.role === 'tele-caller' || u.role === 'team lead')
//       : users.filter((u) => u.role === 'team lead');

//   const handleAssign = async () => {
//     if (!selectedUser || selectedLeadIds.length === 0) {
//       toast.error('Please select leads and user');
//       return;
//     }

//     const selectedUserObj = users.find((u) => u.user_id === selectedUser);

//     if (!selectedUserObj) {
//       toast.error('Invalid user selected');
//       return;
//     }

//     // ⭐ KEY FIX
//     const assignType = selectedRole === 'team lead' ? 'team' : 'single';

//     try {
//       await axios.post(
//         `${BASE_URL}api/assign-leads`,
//         {
//           leadIds: selectedLeadIds,
//           userId: selectedUser,
//           userName: selectedUserObj.name,
//           mode: 'manual',
//           assignType,
//         },
//         { withCredentials: true },
//       );

//       toast.success('Leads assigned successfully');
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error('Telecallers are not assign leads to lead');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//         <h2 className="text-lg font-semibold mb-4">
//           Assign Leads ({selectedLeadIds.length})
//         </h2>

//         {/* Role Selection */}
//         <div className="mb-4 flex gap-6">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={selectedRole === 'tele-caller'}
//               onChange={() => {
//                 setSelectedRole('tele-caller');
//                 setSelectedUser('');
//               }}
//             />
//             Tele caller
//           </label>

//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={selectedRole === 'team lead'}
//               onChange={() => {
//                 setSelectedRole('team lead');
//                 setSelectedUser('');
//               }}
//             />
//             Team
//           </label>
//         </div>

//         {/* User Dropdown (always visible) */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium mb-1">Select User</label>
//           <select
//             value={selectedUser}
//             onChange={(e) =>
//               setSelectedUser(e.target.value ? Number(e.target.value) : '')
//             }
//             className="w-full border p-2 rounded"
//           >
//             <option value="">-- Select User --</option>

//             {filteredUsers.map((user) => (
//               <option key={user.user_id} value={user.user_id}>
//                 {user.name}
//               </option>
//             ))}
//           </select>

//           {selectedRole === '' && (
//             <p className="text-xs text-gray-500 mt-1">
//               Please select role first
//             </p>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleAssign}
//             disabled={!selectedUser || loading}
//             className={`px-4 py-2 text-white rounded ${
//               !selectedUser || loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Assigning...' : 'Assign'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignLeadPopup;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config';
import { toast } from 'react-toastify';

interface User {
  user_id: number;
  name: string;
  role: 'tele-caller' | 'team lead';
}

interface Props {
  selectedLeadIds: number[];
  onClose: () => void;
  onSuccess: () => void;
}

const AssignLeadPopup: React.FC<Props> = ({
  selectedLeadIds,
  onClose,
  onSuccess,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<
    'tele-caller' | 'team lead' | ''
  >('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/users`);
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users', error);
      setUsers([]);
    }
  };

  /** Filter users by role */
  const filteredUsers =
    selectedRole === ''
      ? []
      : selectedRole === 'tele-caller'
      ? users.filter((u) => u.role === 'tele-caller' || u.role === 'team lead')
      : users.filter((u) => u.role === 'team lead');

  /** checkbox toggle */
  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAssign = async () => {
    if (selectedUsers.length === 0 || selectedLeadIds.length === 0) {
      toast.error('Please select users and leads');
      return;
    }

    const assignType = selectedRole === 'team lead' ? 'team' : 'single';

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}api/assign-leads`,
        {
          leadIds: selectedLeadIds,
          userIds: selectedUsers, // ⭐ multiple users
          mode: 'manual',
          assignType,
        },
        { withCredentials: true },
      );

      toast.success('Leads assigned successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Assign Leads ({selectedLeadIds.length})
        </h2>

        {/* Role Selection */}
        <div className="mb-4 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedRole === 'tele-caller'}
              onChange={() => {
                setSelectedRole('tele-caller');
                setSelectedUsers([]);
              }}
            />
            Tele caller
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedRole === 'team lead'}
              onChange={() => {
                setSelectedRole('team lead');
                setSelectedUsers([]);
              }}
            />
            Team
          </label>
        </div>

        {/* User Checkbox List */}
        <div className="mb-6 max-h-48 overflow-y-auto border rounded p-3">
          {selectedRole === '' && (
            <p className="text-sm text-gray-500">Please select role first</p>
          )}

          {filteredUsers.map((user) => (
            <label
              key={user.user_id}
              className="flex items-center gap-2 mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.user_id)}
                onChange={() => toggleUser(user.user_id)}
              />
              {user.name}
            </label>
          ))}

          {selectedRole !== '' && filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500">No users found</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={selectedUsers.length === 0 || loading}
            className={`px-4 py-2 text-white rounded ${
              selectedUsers.length === 0 || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadPopup;
