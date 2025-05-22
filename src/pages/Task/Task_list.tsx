// import React, { useState, useEffect } from 'react';
// import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faEye, faFile, faUsers, faClipboardList  } from '@fortawesome/free-solid-svg-icons';
// import EditTask from './EditTask';
// import { BASE_URL } from '../../../public/config.js';

// interface Task {
//   id: number;
//   taskName: string;
//   projectName: string;
//   startDate: string;
//   endDate: string;
//   priority: string;
//   status: string;
//   comments: string;
//   assignedUsers: string;
//   assignedRoles: string;
// }

// const VendorList: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isEditPopupOpen, setEditPopupOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isUsersPopupOpen, setUsersPopupOpen] = useState(false);
//   const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<string[]>([]);
//   const [availableUsers, setAvailableUsers] = useState<any[]>([]);
//   const [reassignedUsers, setReassignedUsers] = useState<string[]>([]);
//   const [isReadOnly, setIsReadOnly] = useState(false);
//   const [showAddUserDropdown, setShowAddUserDropdown] = useState(false);
//   const [activityLogs, setActivityLogs] = useState<any[]>([]);
//   const [showActivityLogPopup, setShowActivityLogPopup] = useState(false); 
//   const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
//   const [userRole, setUserRole] = useState<string>('');

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/tasks`, { withCredentials: true });
//       const data = response.data;
//       const sortedData = data.sort((a: Task, b: Task) => b.id - a.id);
//       setTasks(sortedData);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//     // Fetch logged-in user's role
//     useEffect(() => {
//       const fetchUserRole = async () => {
//         try {
//           const response = await axios.get(`${BASE_URL}auth/get-name`, { withCredentials: true });
//           const role = response.data.role;
//           console.log('Role :', role);
//           setUserRole(role);    
//         } catch (error) {
//           console.error('Error fetching user role:', error);
//         }
//       };
//       fetchUserRole();
//     }, []);
  
//   const fetchAvailableUsers = async () => {
//     try {
//       const response = await axios.get(BASE_URL + 'api/users');
//       setAvailableUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchActivityLogs = async (taskId: number) => {
//     try {
//       const response = await axios.get(BASE_URL + `api/task/${taskId}/activity-logs`);
//       setActivityLogs(response.data.logs);
//       setShowActivityLogPopup(true);
//     } catch (error) {
//       console.error('Error fetching activity logs:', error);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//     fetchAvailableUsers();
//   }, []);

//   const openFile = async (projectName: string, taskName: string) => {
//     try {
//       await axios.get(BASE_URL + `api/open-file/${encodeURIComponent(projectName)}/${encodeURIComponent(taskName)}`);
//     } catch (error) {
//       console.error('Error opening file:', error);
//     }
//   };

  
//   const handleViewActivityLogs = (taskId: number) => {
//     setSelectedTaskId(taskId);
//     fetchActivityLogs(taskId); 
//   };
//   const handleEdit = (task: Task) => {
//     const formattedStartDate = task.startDate ? task.startDate.slice(0, 10) : '';
//     const formattedEndDate = task.endDate ? task.endDate.slice(0, 10) : '';
//     setSelectedTask({  
//       ...task,
//       startDate: formattedStartDate,
//       endDate: formattedEndDate,
//     });
//     setEditPopupOpen(true);
//     setIsReadOnly(false);
//   };


//   const handleUpdateTask = async (updatedTask: Task) => {
//     try {
//       await axios.put(BASE_URL + `api/tasks/${updatedTask.id}`, updatedTask, { withCredentials: true });
//       await axios.patch(BASE_URL + `api/tasks/status`, {
//         id: updatedTask.id,
//         status: updatedTask.status,
//       });
//       setEditPopupOpen(false);
//       fetchTasks();
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     if (selectedTask) {
//       setSelectedTask({
//         ...selectedTask,
//         [e.target.name]: e.target.value,
//       });
//     }
//   };
//   const handleAssignedUsersClick = (assignedUsers: string, task: Task) => {
//     setSelectedTask(task);
//     setSelectedAssignedUsers(assignedUsers.split(',')); 
//     setReassignedUsers(assignedUsers.split(','));
//     setUsersPopupOpen(true);
//   };
//   const handleView = (task: Task) => {
//     const formattedStartDate = task.startDate ? task.startDate.slice(0, 10) : '';
//     const formattedEndDate = task.endDate ? task.endDate.slice(0, 10) : '';
//     setSelectedTask({  
//       ...task,
//       startDate: formattedStartDate,
//       endDate: formattedEndDate,
//     });
//     setEditPopupOpen (true); 
//     setIsReadOnly(true);
//   };
//   const addUser  = async (user: any) => {
//     try {
//       await axios.post(BASE_URL + `api/tasks/${selectedTask?.id}/users`, { userId: user.id });
//       setReassignedUsers((prev) => [...prev, user.name]);
//     } catch (error) {
//       console.error('Error adding user:', error);
//     }
//   };
//   const removeUser = async (user: string) => {
//     const userId = availableUsers.find((u) => u.name === user)?.id;
//     if (!selectedTask || !selectedTask.id) {
//       console.error("Error: selectedTask or its ID is undefined.");
//       return;
//     }
//     if (userId) {
//       try {
//         await axios.delete(BASE_URL + `api/tasks/${selectedTask.id}/users/${userId}`);
//         setReassignedUsers((prev) => prev.filter((assignedUser) => assignedUser !== user));
//       } catch (error) {
//         console.error("Error removing user:", error);
//       }
//     }
//   };
//   useEffect(() => {
//     console.log("Selected Task updated:", selectedTask);
//   }, [selectedTask]);
//   const handleSaveReassign = async () => {
//     try {
//       await axios.put(BASE_URL + `api/tasks/${selectedTask?.id}/users`, {
//         assignedUsers: reassignedUsers.join(','),
//       });
//       setUsersPopupOpen(false); 
//       fetchTasks(); 
//     } catch (error) {
//       console.error('Error saving reassigned users:', error);
//     }
//   };
//   const toggleAddUserDropdown = () => {
//     setShowAddUserDropdown((prev) => !prev);
//   };
//   const filteredTasks = tasks.filter(
//     (task) =>
//       task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.assignedUsers.includes(searchTerm.toLowerCase()) ||
//       task.assignedRoles.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Part List" />
//       <input
//         type="text"
//         placeholder="Search Parts"
//         className="p-2 border border-gray-300 rounded w-half mr-2"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Part Name</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Product Name</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">End Date</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Priority</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTasks.map((task) => (
//               <tr key={task.id}>
//                 <td className="border-b border-[#eee] py-3 px-0  dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{task.taskName}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0  dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{task.projectName}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{new Date(task.startDate).toLocaleDateString()}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strok edark">
//                   <p className="text-black dark:text-white ml-4">{new Date(task.endDate).toLocaleDateString()}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{task.priority}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className={`inline-flex rounded-full ml-4 bg-opacity-10 py-1 px-3 text-sm font-medium ${task.status === "pending" ? "bg-gray-300 text-gray-600" : task.status === "in progress" ? "bg-blue-300 text-blue-600" : task.status === "on hold" ? "bg-yellow-300 text-yellow-600" : task.status === "completed" ? "bg-green-300 text-green-600" : task.status === "under review" ? "bg-orange-300 text-orange-600" : "bg-danger text-danger"}`}>
//                     {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
//                   </p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <div className="flex items-center gap-2">
//                     <button className="bg-yellow-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600" onClick={() => openFile(task.projectName, task.taskName)}>
//                       <FontAwesomeIcon icon={faFile} />
//                     </button>
//                     <button className="bg-green-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75" onClick={() => handleView(task)}>
//                       <FontAwesomeIcon icon={faEye} className="text-white" />
//                     </button>
//                     <button className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600" onClick={() => handleAssignedUsersClick(task.assignedUsers, task)}>
//                       <FontAwesomeIcon icon={faUsers} className="text-white" />
//                     </button>
//                     {/* <button className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75" 
//                     onClick={() => handleEdit(task)}>
//                       <FontAwesomeIcon icon={faEdit} className="text-white" />
//                     </button> */}



//                     {/* {userRole !== 'designer' && ( */}
//                       <button
//                         className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                         onClick={() => handleEdit(task)}
//                       >
//                         <FontAwesomeIcon icon={faEdit} />
//                       </button>
//                     {/* )} */}



                    
//                     <td>
//                     <button className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                     onClick={() => handleViewActivityLogs(task.id)}>
//                       <FontAwesomeIcon icon={faClipboardList} className="text-white" />
//                       </button>
//               </td>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>


// {isUsersPopupOpen && (
//   <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm">
//     <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl max-w-lg w-full transform transition-transform duration-300 ease-in-out scale-100 hover:scale-105">
//       <h3 className="text-3xl font-bold text-center text-blue-700 mb-8">Reassign Users</h3>
//       <div className="max-h-72 overflow-y-auto mb-6 space-y-6">
//         <div>
//           <h4 className="text-xl font-semibold text-gray-800 mb-4">Assigned Users</h4>
//           <ul className="space-y-3">
//             {reassignedUsers.map((user, index) => (
//               <li
//                 key={index}
//                 className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md hover:bg-gray-100 transition duration-200"
//               >
//                 <span className="text-lg font-medium text-gray-700">{user}</span>
//                 {userRole !== 'designer' && (
//                 <button
//                   className="text-red-500 hover:text-red-700 font-medium transition"
//                   onClick={() => removeUser(user)}
//                   disabled={!selectedTask || !selectedTask.id}
//                 >
//                   Remove
//                 </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="flex flex-col md:flex-row items-center gap-4">
//         {userRole !== 'designer' && (
//           <button
//             onClick={toggleAddUserDropdown}
//             className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition"
//           >
//             Add User
//           </button>
//         )}
//           {showAddUserDropdown && (
//             <div className="relative flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
//               <select
//                 className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 onChange={(e) => {
//                   const selectedUser = availableUsers.find(
//                     (user) => user.id === parseInt(e.target.value)
//                   );
//                   if (selectedUser) addUser(selectedUser);
//                 }}
//                 defaultValue=""
//               >
//                 <option value="" disabled>
//                   Select a User
//                 </option>
//                 {availableUsers.map((user) => (
//                   <option key={user.id} value={user.id}>
//                     {user.name}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 className="bg-gray-500 text-white font-medium px-4 py-2 rounded-md hover:bg-gray-600 transition"
//                 onClick={toggleAddUserDropdown}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="flex justify-center gap-4 mt-8">
//         <button
//           className="bg-red-500 text-white font-medium py-2 px-6 rounded-md hover:bg-red-600 transition"
//           onClick={() => setUsersPopupOpen(false)}
//         >
//           Close
//         </button>
//         <button
//           className="bg-green-500 text-white font-medium py-2 px-6 rounded-md hover:bg-green-600 transition"
//           onClick={handleSaveReassign}
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//       {isEditPopupOpen && selectedTask && (
//         <EditTask
//           task={selectedTask}
//           onSave={handleUpdateTask}
//           onCancel={() => setEditPopupOpen(false)}
//           onInputChange={handleInputChange}
//           readOnly={isReadOnly}
//         />
//       )}
// {showActivityLogPopup && (
//   <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center ml-70 mt-10">
//     <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full overflow-hidden">
//       <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Activity Logs</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
//           <thead>
//             <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
//               <th className="py-3 px-4 border-b text-left">Name</th>
//               <th className="py-3 px-4 border-b text-left">Action</th>
//               <th className="py-3 px-4 border-b text-left">Timestamp</th>
//             </tr>
//           </thead>
//           <tbody className="text-sm text-gray-700">
//             {activityLogs.map((log, index) => (
//               <tr key={index} className="hover:bg-gray-50 transition-colors">
//                 <td className="py-3 px-4 border-b">{log.name}</td>
//                 <td className="py-3 px-4 border-b">{log.action}</td>
//                 <td className="py-3 px-4 border-b">{new Date(log.timestamp).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="flex justify-end mt-6">
//         <button 
//           className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200" 
//           onClick={() => setShowActivityLogPopup(false)}>
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default VendorList;














































// import React, { useState, useEffect } from 'react';
// import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faEye, faFile, faUsers, faClipboardList  } from '@fortawesome/free-solid-svg-icons';
// import EditTask from './EditTask';
// import { BASE_URL } from '../../../public/config.js';

// interface Task {
//   id: number;
//   taskName: string;
//   projectName: string;
//   startDate: string;
//   endDate: string;
//   priority: string;
//   status: string;
//   comments: string;
//   assignedUsers: string;
//   assignedRoles: string;
// }

// const VendorList: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isEditPopupOpen, setEditPopupOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isUsersPopupOpen, setUsersPopupOpen] = useState(false);
//   const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<string[]>([]);
//   const [availableUsers, setAvailableUsers] = useState<any[]>([]);
//   const [activityLogs, setActivityLogs] = useState<any[]>([]);
//   const [showActivityLogPopup, setShowActivityLogPopup] = useState(false);
//   const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/tasks`, { withCredentials: true });
//       const data = response.data;
//       const sortedData = data.sort((a: Task, b: Task) => b.id - a.id);
//       setTasks(sortedData);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const fetchActivityLogs = async (taskId: number) => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/tasks/${taskId}/status-activity`, { withCredentials: true });
//       setActivityLogs(response.data.data);
//       setShowActivityLogPopup(true);
//     } catch (error) {
//       console.error('Error fetching activity logs:', error);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const handleViewActivityLogs = (taskId: number) => {
//     setSelectedTaskId(taskId);
//     fetchActivityLogs(taskId); 
//   };

//   const handleClosePopup = () => {
//     setShowActivityLogPopup(false);
//   };

//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Part List" />
//       <input
//         type="text"
//         placeholder="Search Parts"
//         className="p-2 border border-gray-300 rounded w-half mr-2"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Part Name</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Product Name</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">End Date</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Priority</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Status Log</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((task) => (
//               <tr key={task.id}>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{task.taskName}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{task.projectName}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{new Date(task.startDate).toLocaleDateString()}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{new Date(task.endDate).toLocaleDateString()}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white ml-4">{task.priority}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className={`inline-flex rounded-full ml-4 bg-opacity-10 py-1 px-3 text-sm font-medium ${task.status === "pending" ? "bg-gray-300 text-gray-600" : task.status === "in progress" ? "bg-blue-300 text-blue-600" : task.status === "on hold" ? "bg-yellow-300 text-yellow-600" : task.status === "completed" ? "bg-green-300 text-green-600" : ""}`}>
//                     {task.status}
//                   </p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <button onClick={() => handleViewActivityLogs(task.id)} className="text-blue-600">View Status Log</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showActivityLogPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h2>Task Activity Logs</h2>
//             <table className="w-full table-auto">
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Previous Status</th>
//                   <th>Updated Status</th>
//                   <th>Timestamp</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {activityLogs.map((log) => (
//                   <tr key={log.activityId}>
//                     <td>{log.userName}</td>
//                     <td>{log.previousStatus}</td>
//                     <td>{log.updatedStatus}</td>
//                     <td>{new Date(log.timestamp).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <button onClick={handleClosePopup} className="mt-2">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VendorList;



























































































import React, { useState, useEffect } from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faFile, faUsers, faClipboardList, faHistory  } from '@fortawesome/free-solid-svg-icons';
import EditTask from './EditTask';
import { BASE_URL } from '../../../public/config.js';

interface Task {
  id: number;
  taskName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  comments: string;
  assignedUsers: string;
  assignedRoles: string;
}

const VendorList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUsersPopupOpen, setUsersPopupOpen] = useState(false);
  const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [reassignedUsers, setReassignedUsers] = useState<string[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showAddUserDropdown, setShowAddUserDropdown] = useState(false);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [showActivityLogPopup, setShowActivityLogPopup] = useState(false); 
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  const [statusActivityLogs, setStatusActivityLogs] = useState<any[]>([]);
  const [showStatusActivityLogPopup, setShowStatusActivityLogPopup] = useState(false); 

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/tasks`, { withCredentials: true });
      const data = response.data;
      const sortedData = data.sort((a: Task, b: Task) => b.id - a.id);
      setTasks(sortedData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

    // Fetch logged-in user's role
    useEffect(() => {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`${BASE_URL}auth/get-name`, { withCredentials: true });
          const role = response.data.role;
          console.log('Role :', role);
          setUserRole(role);    
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      };
      fetchUserRole();
    }, []);
  
  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/users');
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchActivityLogs = async (taskId: number) => {
    try {
      const response = await axios.get(BASE_URL + `api/task/${taskId}/activity-logs`);
      setActivityLogs(response.data.logs);
      setShowActivityLogPopup(true);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  const fetchStatusActivityLogs = async (taskId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}api/tasks/${taskId}/status-activity`, { withCredentials: true });
      setStatusActivityLogs(response.data.data);
      setShowStatusActivityLogPopup(true);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };



  useEffect(() => {
    fetchTasks();
    fetchAvailableUsers();
  }, []);

  const openFile = async (projectName: string, taskName: string) => {
    try {
      await axios.get(BASE_URL + `api/open-file/${encodeURIComponent(projectName)}/${encodeURIComponent(taskName)}`);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  
  const handleViewActivityLogs = (taskId: number) => {
    setSelectedTaskId(taskId);
    fetchActivityLogs(taskId); 
  };

  const handleVieStatuswActivityLogs = (taskId: number) => {
    setSelectedTaskId(taskId);
    fetchStatusActivityLogs(taskId); 
  };


  const handleEdit = (task: Task) => {
    const formattedStartDate = task.startDate ? task.startDate.slice(0, 10) : '';
    const formattedEndDate = task.endDate ? task.endDate.slice(0, 10) : '';
    setSelectedTask({  
      ...task,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    setEditPopupOpen(true);
    setIsReadOnly(false);
  };


  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await axios.put(BASE_URL + `api/tasks/${updatedTask.id}`, updatedTask, { withCredentials: true });
      await axios.patch(BASE_URL + `api/tasks/status`, {
        id: updatedTask.id,
        status: updatedTask.status,
      });
      setEditPopupOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (selectedTask) {
      setSelectedTask({
        ...selectedTask,
        [e.target.name]: e.target.value,
      });
    }
  };


  const handleAssignedUsersClick = (assignedUsers: string, task: Task) => {
    setSelectedTask(task);
    setSelectedAssignedUsers(assignedUsers.split(',')); 
    setReassignedUsers(assignedUsers.split(','));
    setUsersPopupOpen(true);
  };


  const handleView = (task: Task) => {
    const formattedStartDate = task.startDate ? task.startDate.slice(0, 10) : '';
    const formattedEndDate = task.endDate ? task.endDate.slice(0, 10) : '';
    setSelectedTask({  
      ...task,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    setEditPopupOpen (true); 
    setIsReadOnly(true);
  };

  
  const addUser  = async (user: any) => {
    try {
      await axios.post(BASE_URL + `api/tasks/${selectedTask?.id}/users`, { userId: user.id });
      setReassignedUsers((prev) => [...prev, user.name]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };


  const removeUser = async (user: string) => {
    const userId = availableUsers.find((u) => u.name === user)?.id;
    if (!selectedTask || !selectedTask.id) {
      console.error("Error: selectedTask or its ID is undefined.");
      return;
    }
    if (userId) {
      try {
        await axios.delete(BASE_URL + `api/tasks/${selectedTask.id}/users/${userId}`);
        setReassignedUsers((prev) => prev.filter((assignedUser) => assignedUser !== user));
      } catch (error) {
        console.error("Error removing user:", error);
      }
    }
  };


  useEffect(() => {
    console.log("Selected Task updated:", selectedTask);
  }, [selectedTask]);


  const handleSaveReassign = async () => {
    try {
      await axios.put(BASE_URL + `api/tasks/${selectedTask?.id}/users`, {
        assignedUsers: reassignedUsers.join(','),
      });
      setUsersPopupOpen(false); 
      fetchTasks(); 
    } catch (error) {
      console.error('Error saving reassigned users:', error);
    }
  };


  const toggleAddUserDropdown = () => {
    setShowAddUserDropdown((prev) => !prev);
  };

  const handleClosePopup = () => {
    setShowStatusActivityLogPopup(false);
  };


  const filteredTasks = tasks.filter(
    (task) =>
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedUsers.includes(searchTerm.toLowerCase()) ||
      task.assignedRoles.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="p-4">
      <Breadcrumb pageName="Part List" />
      <input
        type="text"
        placeholder="Search Parts"
        className="p-2 border border-gray-300 rounded w-half mr-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">Part Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Product Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">End Date</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Priority</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td className="border-b border-[#eee] py-3 px-0  dark:border-strokedark">
                  <p className="text-black dark:text-white ml-4">{task.taskName}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0  dark:border-strokedark">
                  <p className="text-black dark:text-white ml-4">{task.projectName}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white ml-4">{new Date(task.startDate).toLocaleDateString()}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strok edark">
                  <p className="text-black dark:text-white ml-4">{new Date(task.endDate).toLocaleDateString()}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white ml-4">{task.priority}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className={`inline-flex rounded-full ml-4 bg-opacity-10 py-1 px-3 text-sm font-medium ${task.status === "pending" ? "bg-gray-300 text-gray-600" : task.status === "in progress" ? "bg-blue-300 text-blue-600" : task.status === "on hold" ? "bg-yellow-300 text-yellow-600" : task.status === "completed" ? "bg-green-300 text-green-600" : task.status === "under review" ? "bg-orange-300 text-orange-600" : "bg-danger text-danger"}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <div className="flex items-center gap-2">
                    <button className="bg-yellow-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600" onClick={() => openFile(task.projectName, task.taskName)}>
                      <FontAwesomeIcon icon={faFile} />
                    </button>
                    <button className="bg-green-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75" onClick={() => handleView(task)}>
                      <FontAwesomeIcon icon={faEye} className="text-white" />
                    </button>
                    <button className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600" onClick={() => handleAssignedUsersClick(task.assignedUsers, task)}>
                      <FontAwesomeIcon icon={faUsers} className="text-white" />
                    </button>
                    {/* <button className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75" 
                    onClick={() => handleEdit(task)}>
                      <FontAwesomeIcon icon={faEdit} className="text-white" />
                    </button> */}



                    {/* {userRole !== 'designer' && ( */}
                      <button
                        className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => handleEdit(task)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    {/* )} */}



                    
                    <td>
                    <button className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                    onClick={() => handleViewActivityLogs(task.id)}>
                      <FontAwesomeIcon icon={faClipboardList} className="text-white" />
                      </button>
                  </td>

                  <td >
                  <button 
                  onClick={() => handleVieStatuswActivityLogs(task.id)} 
                  className="bg-red-400 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75">
                  <FontAwesomeIcon icon={faHistory} className="text-white" />
                    </button>
                </td>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


{isUsersPopupOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm">
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl max-w-lg w-full transform transition-transform duration-300 ease-in-out scale-100 hover:scale-105">
      <h3 className="text-3xl font-bold text-center text-blue-700 mb-8">Reassign Users</h3>
      <div className="max-h-72 overflow-y-auto mb-6 space-y-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Assigned Users</h4>
          <ul className="space-y-3">
            {reassignedUsers.map((user, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md hover:bg-gray-100 transition duration-200"
              >
                <span className="text-lg font-medium text-gray-700">{user}</span>
                {userRole !== 'designer' && (
                <button
                  className="text-red-500 hover:text-red-700 font-medium transition"
                  onClick={() => removeUser(user)}
                  disabled={!selectedTask || !selectedTask.id}
                >
                  Remove
                </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
        {userRole !== 'designer' && (
          <button
            onClick={toggleAddUserDropdown}
            className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition"
          >
            Add User
          </button>
        )}
          {showAddUserDropdown && (
            <div className="relative flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
              <select
                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => {
                  const selectedUser = availableUsers.find(
                    (user) => user.id === parseInt(e.target.value)
                  );
                  if (selectedUser) addUser(selectedUser);
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a User
                </option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                className="bg-gray-500 text-white font-medium px-4 py-2 rounded-md hover:bg-gray-600 transition"
                onClick={toggleAddUserDropdown}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button
          className="bg-red-500 text-white font-medium py-2 px-6 rounded-md hover:bg-red-600 transition"
          onClick={() => setUsersPopupOpen(false)}
        >
          Close
        </button>
        <button
          className="bg-green-500 text-white font-medium py-2 px-6 rounded-md hover:bg-green-600 transition"
          onClick={handleSaveReassign}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}



      {isEditPopupOpen && selectedTask && (
        <EditTask
          task={selectedTask}
          onSave={handleUpdateTask}
          onCancel={() => setEditPopupOpen(false)}
          onInputChange={handleInputChange}
          readOnly={isReadOnly}
        />
      )}


      


{showActivityLogPopup && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center ml-70 mt-10">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full overflow-hidden">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Activity Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Action</th>
              <th className="py-3 px-4 border-b text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {activityLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b">{log.name}</td>
                <td className="py-3 px-4 border-b">{log.action}</td>
                <td className="py-3 px-4 border-b">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <button 
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200" 
          onClick={() => setShowActivityLogPopup(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}





{showStatusActivityLogPopup && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
      <h2 className='text-3xl font-semibold text-gray-800 mb-6 text-center'>Status Activity Logs</h2>
      {statusActivityLogs.length === 0 ? (
        <p className="text-center text-gray-600">No activity yet.</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
              <th className="py-3 px-4 border-b text-left">User</th>
              <th className="py-3 px-4 border-b text-left">Role</th>
              <th className="py-3 px-4 border-b text-left">Previous Status</th>
              <th className="py-3 px-4 border-b text-left">Updated Status</th>
              <th className="py-3 px-4 border-b text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {statusActivityLogs.map((log) => (
              <tr key={log.activityId}  className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b">{log.userName}</td>
                <td className="py-3 px-4 border-b">{log.role}</td>
                <td className="py-3 px-4 border-b">{log.previousStatus}</td>
                <td className="py-3 px-4 border-b">{log.updatedStatus}</td>
                <td className="py-3 px-4 border-b">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) }
      <div className="flex justify-end mt-6">
      <button onClick={handleClosePopup} 
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200">
        Close
        </button>
    </div>
    </div>
  </div>
)}













    </div>
  );
};





export default VendorList;
