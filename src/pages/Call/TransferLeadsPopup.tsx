// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config';
// import { toast } from 'react-toastify';

// interface Props {
//   show: boolean;
//   onClose: () => void;
//   selectedLeadIds: number[];
//   onSuccess?: () => void;
// }

// const TransferLeadsPopup: React.FC<Props> = ({
//   show,
//   onClose,
//   selectedLeadIds,
//   onSuccess,
// }) => {
//   const [users, setUsers] = useState<any[]>([]);
//   const [selectedUser, setSelectedUser] = useState('');
//   const [loading, setLoading] = useState(false);

//   // 🔹 Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/users`);
//       setUsers(res.data || []);
//     } catch (error) {
//       console.error('Error fetching users', error);
//       setUsers([]);
//     }
//   };

//   useEffect(() => {
//     if (show) {
//       fetchUsers();
//     }
//   }, [show]);

//   // 🔹 Transfer leads
//   const handleTransfer = async () => {
//     if (!selectedUser) {
//       alert('Please select a user');
//       return;
//     }

//     try {
//       setLoading(true);

//       await axios.post(
//         `${BASE_URL}api/transfer-leads`,
//         {
//           leadIds: selectedLeadIds,
//           userId: selectedUser,
//           userName: users.find((u) => u.user_id === selectedUser)?.name,
//           remark: 'Transferred by admin',
//         },
//         {
//           withCredentials: true,
//         },
//       );

//       toast.success('Leads transferred successfully');
//       // alert('Leads transferred successfully');

//       onClose();
//       onSuccess?.();
//     } catch (error) {
//       console.error('Transfer failed', error);
//       alert('Failed to transfer leads');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white dark:bg-boxdark w-[400px] rounded-lg shadow-lg p-6">
//         <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
//           Transfer Leads
//         </h3>

//         {/* User dropdown */}
//         <div className="mb-4">
//           <label className="block mb-2 text-sm font-medium">Select User</label>

//           <select
//             value={selectedUser}
//             onChange={(e) => setSelectedUser(e.target.value)}
//             className="w-full border rounded px-3 py-2 dark:bg-form-input"
//           >
//             <option value="">-- Select User --</option>

//             {users.map((user) => (
//               <option key={user.user_id} value={user.user_id}>
//                 {user.name} ({user.role})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Selected count */}
//         <p className="text-sm text-gray-500 mb-4">
//           Selected Leads: <b>{selectedLeadIds.length}</b>
//         </p>

//         {/* Actions */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleTransfer}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             {loading ? 'Transferring...' : 'Transfer'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransferLeadsPopup;

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
//   show: boolean;
//   onClose: () => void;
//   selectedLeadIds: number[];
//   onSuccess?: () => void;
// }

// const TransferLeadsPopup: React.FC<Props> = ({
//   show,
//   onClose,
//   selectedLeadIds,
//   onSuccess,
// }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedRole, setSelectedRole] = useState<
//     'tele-caller' | 'team lead' | ''
//   >('');
//   const [selectedUser, setSelectedUser] = useState<number | ''>('');
//   const [loading, setLoading] = useState(false);

//   // 🔹 Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/users`);
//       setUsers(res.data || []);
//     } catch (error) {
//       console.error('Error fetching users', error);
//       setUsers([]);
//     }
//   };

//   useEffect(() => {
//     if (show) {
//       fetchUsers();
//       setSelectedRole('');
//       setSelectedUser('');
//     }
//   }, [show]);

//   /** 🔹 Role based filtering (same as AssignLeadPopup) */
//   const filteredUsers =
//     selectedRole === ''
//       ? []
//       : selectedRole === 'tele-caller'
//       ? users.filter((u) => u.role === 'tele-caller' || u.role === 'team lead')
//       : users.filter((u) => u.role === 'team lead');

//   // 🔹 Transfer handler
//   const handleTransfer = async () => {
//     if (!selectedUser || selectedLeadIds.length === 0) {
//       toast.error('Please select user and leads');
//       return;
//     }

//     const selectedUserObj = users.find((u) => u.user_id === selectedUser);

//     if (!selectedUserObj) {
//       toast.error('Invalid user selected');
//       return;
//     }

//     try {
//       setLoading(true);

//       await axios.post(
//         `${BASE_URL}api/transfer-leads`,
//         {
//           leadIds: selectedLeadIds,
//           userId: selectedUser,
//           userName: selectedUserObj.name,
//           remark: 'Transferred by admin',
//           assignType: selectedRole === 'team lead' ? 'team' : 'single',
//         },
//         { withCredentials: true },
//       );

//       toast.success('Leads transferred successfully');
//       onClose();
//       onSuccess?.();
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to transfer leads');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//         <h2 className="text-lg font-semibold mb-4">
//           Transfer Leads ({selectedLeadIds.length})
//         </h2>

//         {/* 🔹 Role Selection */}
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

//         {/* 🔹 User dropdown */}
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

//         {/* 🔹 Actions */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleTransfer}
//             disabled={!selectedUser || loading}
//             className={`px-4 py-2 text-white rounded ${
//               !selectedUser || loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Transferring...' : 'Transfer'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransferLeadsPopup;

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
//   show: boolean;
//   onClose: () => void;
//   selectedLeadIds: number[];
//   onSuccess?: () => void;
// }

// const TransferLeadsPopup: React.FC<Props> = ({
//   show,
//   onClose,
//   selectedLeadIds,
//   onSuccess,
// }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedRole, setSelectedRole] = useState<
//     'tele-caller' | 'team lead' | ''
//   >('');
//   const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);

//   /* 🔹 Fetch users */
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/users`);
//       setUsers(res.data || []);
//     } catch (error) {
//       console.error('Error fetching users', error);
//       setUsers([]);
//     }
//   };

//   useEffect(() => {
//     if (show) {
//       fetchUsers();
//       setSelectedRole('');
//       setSelectedUsers([]);
//     }
//   }, [show]);

//   /* 🔹 Role based filtering */
//   const filteredUsers =
//     selectedRole === ''
//       ? []
//       : selectedRole === 'tele-caller'
//       ? users.filter((u) => u.role === 'tele-caller' || u.role === 'team lead')
//       : users.filter((u) => u.role === 'team lead');

//   /* 🔹 Checkbox toggle */
//   const toggleUser = (userId: number) => {
//     setSelectedUsers((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId],
//     );
//   };

//   /* 🔹 Transfer handler */
//   const handleTransfer = async () => {
//     if (selectedUsers.length === 0 || selectedLeadIds.length === 0) {
//       toast.error('Please select users and leads');
//       return;
//     }

//     try {
//       setLoading(true);

//       await axios.post(
//         `${BASE_URL}api/transfer-leads`,
//         {
//           leadIds: selectedLeadIds,
//           userIds: selectedUsers, // ⭐ multiple users
//           remark: 'Transferred by admin',
//           assignType: selectedRole === 'team lead' ? 'team' : 'single',
//         },
//         { withCredentials: true },
//       );

//       toast.success('Leads transferred successfully');
//       onClose();
//       onSuccess?.();
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to transfer leads');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//         <h2 className="text-lg font-semibold mb-4">
//           Transfer Leads ({selectedLeadIds.length})
//         </h2>

//         {/* 🔹 Role Selection */}
//         <div className="mb-4 flex gap-6">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={selectedRole === 'tele-caller'}
//               onChange={() => {
//                 setSelectedRole('tele-caller');
//                 setSelectedUsers([]);
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
//                 setSelectedUsers([]);
//               }}
//             />
//             Team
//           </label>
//         </div>

//         {/* 🔹 Checkbox User List */}
//         <div className="mb-6 max-h-48 overflow-y-auto border rounded p-3">
//           {selectedRole === '' && (
//             <p className="text-sm text-gray-500">Please select role first</p>
//           )}

//           {filteredUsers.map((user) => (
//             <label
//               key={user.user_id}
//               className="flex items-center gap-2 mb-2 cursor-pointer"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedUsers.includes(user.user_id)}
//                 onChange={() => toggleUser(user.user_id)}
//               />
//               {user.name}
//             </label>
//           ))}

//           {selectedRole !== '' && filteredUsers.length === 0 && (
//             <p className="text-sm text-gray-500">No users found</p>
//           )}
//         </div>

//         {/* 🔹 Actions */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleTransfer}
//             disabled={selectedUsers.length === 0 || loading}
//             className={`px-4 py-2 text-white rounded ${
//               selectedUsers.length === 0 || loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Transferring...' : 'Transfer'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransferLeadsPopup;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config';
import { toast } from 'react-toastify';

interface User {
  user_id: number;
  name: string;
  role?: 'tele-caller' | 'team lead';
}

interface Props {
  show: boolean;
  onClose: () => void;
  selectedLeadIds: number[];
  onSuccess?: () => void;
}

const TransferLeadsPopup: React.FC<Props> = ({
  show,
  onClose,
  selectedLeadIds,
  onSuccess,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<
    'tele-caller' | 'team lead' | ''
  >('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  /* 🔹 Fetch login user role */
  useEffect(() => {
    axios
      .get(`${BASE_URL}auth/get-role`, { withCredentials: true })
      .then((res) => setUserRole(res.data.role))
      .catch(() => console.error('Failed to fetch user role'));
  }, []);

  /* 🔹 Fetch users (ADMIN CASE) */
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/users`, {
        withCredentials: true,
      });
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users', error);
      setUsers([]);
    }
  };

  /* 🔹 Fetch ONLY team lead telecallers */
  const fetchMyTeleCallers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/team-lead/telecallers`, {
        withCredentials: true,
      });

      // response already clean
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching team telecallers', error);
      setUsers([]);
    }
  };

  /* 🔹 On popup open */
  useEffect(() => {
    if (!show) return;

    setSelectedUsers([]);
    setSelectedRole('');

    if (userRole === 'team lead') {
      fetchMyTeleCallers(); // ⭐ ONLY OWN TELECALLERS
    } else {
      fetchAllUsers(); // ADMIN
    }
  }, [show, userRole]);

  /* 🔹 Role based filtering (ADMIN ONLY) */
  const filteredUsers =
    userRole === 'team lead'
      ? users // already filtered by backend
      : selectedRole === ''
      ? []
      : selectedRole === 'tele-caller'
      ? users.filter((u) => u.role === 'tele-caller' || u.role === 'team lead')
      : users.filter((u) => u.role === 'team lead');

  /* 🔹 Checkbox toggle */
  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  /* 🔹 Transfer handler */
  const handleTransfer = async () => {
    if (selectedUsers.length === 0 || selectedLeadIds.length === 0) {
      toast.error('Please select users and leads');
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}api/transfer-leads`,
        {
          leadIds: selectedLeadIds,
          userIds: selectedUsers,
          remark: '',
          assignType:
            userRole === 'team lead'
              ? 'single'
              : selectedRole === 'team lead'
              ? 'team'
              : 'single',
        },
        { withCredentials: true },
      );

      toast.success('Leads transferred successfully');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('Failed to transfer leads');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Transfer Leads ({selectedLeadIds.length})
        </h2>

        {/* 🔹 Role Selection (ADMIN ONLY) */}
        {userRole !== 'team lead' && (
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
        )}

        {/* 🔹 Checkbox User List */}
        <div className="mb-6 max-h-48 overflow-y-auto border rounded p-3">
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

          {filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500">No users found</p>
          )}
        </div>

        {/* 🔹 Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleTransfer}
            disabled={selectedUsers.length === 0 || loading}
            className={`px-4 py-2 text-white rounded ${
              selectedUsers.length === 0 || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Transferring...' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferLeadsPopup;
