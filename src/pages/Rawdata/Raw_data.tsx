// import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faEdit,
//   faTrash,
//   faDownload,
//   faPlus,
//   faFileImport,
//   faPhone,
//   faLocation,
// } from '@fortawesome/free-solid-svg-icons';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// import { BASE_URL } from '../../../public/config.js';
// import axios from 'axios';
// import InsertDataModal from '../Rawdata/InsertDataModal';

// const RawData = () => {
//   // FIXED TYPE DEFINITIONS
//   type Data = {
//     id: number;
//     master_id: number;
//     name: string;
//     number: string; // Changed from contact to number
//     email: string;
//     address: string;
//     area: string;
//     area_id: string;
//     status: string;
//     cat_name: string;
//     cat_id: number;
//     reference_name: string;
//   };

//   type Client = {
//     id: number;
//     master_id: number;
//     name: string;
//     number: string; // Changed from phone to number
//     email: string;
//     address: string;
//     area: string;
//     area_id: string;
//     status: string;
//     cat_name: string;
//     cat_id: number;
//     reference_name: string;
//   };

//   interface Category {
//     cat_id: number;
//     cat_name: string;
//   }

//   interface Reference {
//     reference_id: number;
//     reference_name: string;
//   }

//   interface Area {
//     area_id: number;
//     area_name: string;
//   }

//   ////// 1
//   type User = {
//     id: number;
//     name: string;
//     contact: string;
//     email: string;
//     address: string;
//     role: string;
//     status: string;
//     category: string;
//   };

//   interface Props {
//     assignData: { assignedTo: string };
//     handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   }
//   ////// 1
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/users`);
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const today = new Date().toISOString().split('T')[0];

//   const [users, setUsers] = useState<User[]>([]);
//   const [formData, setFormData] = useState({
//     cat_id: '',
//     reference: '',
//     area_id: '',
//   });
//   const [rawData, setRawData] = useState<Data[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [references, setReferences] = useState<Reference[]>([]);
//   const [area, setArea] = useState<Area[]>([]);
//   const [error, setError] = useState('');
//   const [file, setFile] = useState<File | null>(null);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showImportPopup, setShowImportPopup] = useState(false);
//   const [showAssignPopup, setShowAssignPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [editingClient, setEditingClient] = useState<Client | null>(null);
//   const [selectedClients, setSelectedClients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [availableOptions, setAvailableOptions] = useState<
//     { cat_id: number; area_id: number }[]
//   >([]);
//   const [errorDetails, setErrorDetails] = useState<any[]>([]);

//   const [showDuplicateModal, setShowDuplicateModal] = useState(false);
//   const [duplicateEntries, setDuplicateEntries] = useState<any[]>([]);

//   const [showAddPopup, setShowAddPopup] = useState(false);
//   const [singleFormData, setSingleFormData] = useState({
//     name: '',
//     contact: '',
//     email: '',
//     address: '',
//     cat_id: '',
//     reference: '',
//     area_id: '',
//   });

//   // SEARCH BAR - FIXED VERSION
//   useEffect(() => {
//     const lowerSearch = searchTerm.toLowerCase();

//     const results = rawData.filter((client) => {
//       const name = client.name?.toLowerCase() || '';
//       const number = client.number?.toString() || '';
//       const email = client.email?.toLowerCase() || '';
//       const address = client.address?.toLowerCase() || '';
//       const areaName = client.area?.toLowerCase() || '';
//       const catName = client.cat_name?.toLowerCase() || '';
//       const masterIdStr = client.master_id?.toString() || '';

//       return (
//         name.includes(lowerSearch) ||
//         number.includes(lowerSearch) ||
//         email.includes(lowerSearch) ||
//         address.includes(lowerSearch) ||
//         areaName.includes(lowerSearch) ||
//         catName.includes(lowerSearch) ||
//         masterIdStr.includes(lowerSearch)
//       );
//     });

//     setFilteredClients(results);
//   }, [searchTerm, rawData]);

//   const fetchClients = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/clients`);
//       setFilteredClients(response.data);
//     } catch (error) {
//       console.error('Failed to fetch clients:', error);
//     }
//   };
//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isChecked = e.target.checked;
//     const currentEntries = filteredClients.slice(
//       (currentPage - 1) * entriesPerPage,
//       currentPage * entriesPerPage,
//     );
//     const currentIds = currentEntries.map((client) => client.id);

//     if (isChecked) {
//       setSelectedClients((prev) => {
//         const combined = [...prev, ...currentIds];
//         // Remove duplicates manually instead of using Set
//         return combined.filter((id, index) => combined.indexOf(id) === index);
//       });
//     } else {
//       setSelectedClients((prev) =>
//         prev.filter((id) => !currentIds.includes(id)),
//       );
//     }
//   };

//   // FIXED: Added proper type
//   const handleSelect = (clientId: number) => {
//     setSelectedClients((prev) =>
//       prev.includes(clientId)
//         ? prev.filter((id) => id !== clientId)
//         : [...prev, clientId],
//     );
//   };
//   //edit data
//   const handleEditClick = (client: Client) => {
//     setEditingClient(client);
//     setShowEditPopup(true);
//   };

//   const closeEditPopup = () => {
//     setEditingClient(null);
//     setShowEditPopup(false);
//   };

//   //assign data
//   const [assignData, setAssignData] = useState({
//     assignType: '',
//     mode: '',
//     assignedTo: '',
//     assignDate: today,
//     targetDate: today,
//     remark: '',
//     leadCount: '',
//   });

//   //pagination
//   const entriesPerPage = 50;
//   const totalPages = Math.ceil(filteredClients.length / entriesPerPage);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   //import data
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   // import
//   // FIXED handleChange function - add HTMLTextAreaElement
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value } = e.target;

//     // Convert certain fields to numbers
//     const numericFields = ['cat_id', 'area_id', 'leadCount'];
//     const parsedValue = numericFields.includes(name) ? Number(value) : value;

//     setFormData({ ...formData, [name]: parsedValue });
//     setAssignData({ ...assignData, [name]: parsedValue });

//     console.log('assigned lead :', name, parsedValue);
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!file) {
//       console.error('No file selected');
//       return;
//     }

//     const formData1 = new FormData();
//     formData1.append('file', file);
//     formData1.append('cat_id', formData.cat_id);
//     formData1.append('reference', formData.reference);
//     formData1.append('area_id', formData.area_id);

//     try {
//       const response = await axios.post(
//         `${BASE_URL}api/master-data/import`,
//         formData1,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           withCredentials: true,
//         },
//       );

//       if (response.status === 200) {
//         alert('Data imported successfully.');
//         setError('');
//         setErrorDetails([]);
//         setFile(null);
//         setFormData({ cat_id: '', reference: '', area_id: '' });
//         setShowImportPopup(false);
//         fetchRawData(); // Refresh the data after successful import
//       }
//     } catch (err: any) {
//       const backendMessage =
//         err.response?.data?.message || 'Failed to import file.';
//       const duplicates = err.response?.data?.duplicates || [];

//       // If duplicates found → show duplicate modal only
//       if (duplicates.length > 0) {
//         setShowImportPopup(false); // CLOSE MAIN IMPORT POPUP
//         setDuplicateEntries(duplicates); // STORE DUPLICATES
//         setShowDuplicateModal(true); // OPEN DUPLICATE MODAL
//         setError(''); // DO NOT SHOW RED ERROR BOX
//         return; // EXIT
//       }

//       // Other errors (if no duplicates exist)
//       setError(backendMessage);
//       setErrorDetails([]);
//     }
//   };

//   // Function to handle duplicate modal close
//   const handleDuplicateModalClose = () => {
//     setShowDuplicateModal(false);
//     setDuplicateEntries([]);
//     setError('');
//   };

//   // Function to proceed with import despite duplicates (if your backend supports it)
//   const handleForceImport = async () => {
//     if (!file) return;

//     const formData1 = new FormData();
//     formData1.append('file', file);
//     formData1.append('cat_id', formData.cat_id);
//     formData1.append('reference', formData.reference);
//     formData1.append('area_id', formData.area_id);
//     formData1.append('force_import', 'true'); // Add flag to force import

//     try {
//       const response = await axios.post(
//         `${BASE_URL}api/master-data/import`,
//         formData1,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           withCredentials: true,
//         },
//       );

//       if (response.status === 200) {
//         alert('Data imported successfully (duplicates skipped).');
//         setShowDuplicateModal(false);
//         setDuplicateEntries([]);
//         setError('');
//         setFile(null);
//         setFormData({ cat_id: '', reference: '', area_id: '' });
//         setShowImportPopup(false);
//         fetchRawData(); // Refresh the data
//       }
//     } catch (err: any) {
//       const errorMessage =
//         err.response?.data?.message || 'Failed to import file.';
//       setError(errorMessage);
//     }
//   };

//   // Function to cancel and close everything
//   const handleCancelImport = () => {
//     setShowDuplicateModal(false);
//     setDuplicateEntries([]);
//     setShowImportPopup(false);
//     setFile(null);
//     setFormData({ cat_id: '', reference: '', area_id: '' });
//     setError('');
//   };

//   // Add function to proceed with import despite duplicates
//   const handleProceedWithImport = async () => {
//     // You might want to send a flag to backend to proceed with duplicates
//     // or handle this differently based on your backend API
//     setShowDuplicateModal(false);
//     setDuplicateEntries([]);
//     setShowImportPopup(false);

//     // Optionally clear the form
//     setFile(null);
//     setFormData({ cat_id: '', reference: '', area_id: '' });

//     alert(
//       'Please review the duplicate entries and try again with corrected data.',
//     );
//   };

//   //fetch master data
//   //fetch master data - FIXED VERSION
//   const fetchRawData = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}api/master-data`);
//       if (!response.ok) throw new Error('Network response was not ok');
//       const data = await response.json();

//       // Map the API response to your frontend structure
//       const formattedData = data.map((item: any) => ({
//         id: item.master_id,
//         master_id: item.master_id,
//         name: item.name,
//         number: item.number,
//         email: item.email,
//         address: item.address,
//         area: item.area_name,
//         area_id: item.area_id,
//         status: item.status,
//         cat_name: item.cat_name,
//         cat_id: item.cat_id,
//         reference_name: item.reference_name || 'N/A', // ✅ NEW FIELD
//       }));

//       setRawData(formattedData);
//       setFilteredClients(formattedData);
//     } catch (error) {
//       console.error('Error fetching Master Data:', error);
//     }
//   };

//   // Call this in useEffect
//   useEffect(() => {
//     fetchRawData();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/category`);
//         setCategories(response.data);
//       } catch (error) {
//         setCategories([]);
//       }
//     };
//     fetchCategories();
//   }, []);

//   //import reference
//   useEffect(() => {
//     const fetchReferences = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/reference`);
//         setReferences(response.data);
//       } catch (err) {
//         setError('Failed to load references.');
//       }
//     };
//     fetchReferences();
//   }, []);

//   // import  Fetch Area
//   useEffect(() => {
//     const fetchArea = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/area`);
//         setArea(response.data);
//       } catch (error) {
//         console.error('Error fetching Area:', error);
//       }
//     };
//     fetchArea();
//   }, []);

//   //ASSIGN
//   const handleAssignSubmit = async (e) => {
//     e.preventDefault();

//     console.log('📤 Sending assignment data to backend:', assignData);

//     try {
//       const response = await fetch(`${BASE_URL}api/assign`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(assignData), // cat_id / area_id removed from assignData
//       });

//       const result = await response.json();

//       console.log('📩 Backend response:', result);

//       if (response.ok) {
//         alert('✅ Leads assigned successfully!');
//         fetchRawData();

//         // Reset data (without cat_id and area_id)
//         setAssignData({
//           mode: '',
//           assignedTo: '',
//           assignDate: '',
//           targetDate: '',
//           remark: '',
//           leadCount: '',
//           assignType: 'manual',
//         });

//         setShowAssignPopup(false);
//       } else {
//         console.error('🚨 Error:', result.error || result);
//         alert(`❌ Error: ${result.message}`);
//       }
//     } catch (error) {
//       console.error('❌ Network error:', error);
//       alert('Something went wrong while submitting the assignment.');
//     }
//   };

//   //bulk delete function
//   const handleBulkDelete = async () => {
//     if (window.confirm('Are you sure you want to delete selected clients?')) {
//       try {
//         await axios.post(`${BASE_URL}api/master-data/delete-multiple`, {
//           ids: selectedClients,
//         });
//         setSelectedClients([]);
//         alert('Selected Entry deleted successfully.');
//         fetchClients();
//       } catch (error) {
//         console.error(error);
//         alert('Failed to delete selected entry.');
//       }
//     }
//   };

//   //Single delete function
//   const handleSingleDelete = async (Id) => {
//     if (window.confirm('Are you sure you want to delete this entry?')) {
//       try {
//         await axios.delete(`${BASE_URL}api/master-data/${Id}`);
//         alert('Entry deleted successfully.');
//         setSelectedClients([]); // clear selected checkboxes
//         fetchClients();
//       } catch (error) {
//         console.error(error);
//         alert('Failed to delete entry.');
//       }
//     }
//   };

//   //update raw data -
//   const handleUpdateClient = async (editingClient: Client) => {
//     try {
//       const response = await axios.put(
//         `${BASE_URL}api/master-data/${editingClient.id}`,
//         {
//           name: editingClient.name,
//           email: editingClient.email,
//           number: editingClient.number, // Changed from contact to number
//           address: editingClient.address,
//         },
//         {
//           withCredentials: true,
//         },
//       );

//       if (response.status === 200) {
//         alert('Client updated successfully');
//         fetchRawData(); // Refresh the data
//         return { success: true, message: 'Client updated successfully' };
//       } else {
//         return { success: false, message: 'Failed to update client' };
//       }
//     } catch (error) {
//       console.error('Update failed:', error);
//       return { success: false, message: 'Failed to update client' };
//     }
//   };

//   const handleSingleFormChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setSingleFormData({ ...singleFormData, [name]: value });
//   };

//   useEffect(() => {
//     const fetchAvailableOptions = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/available-cat-area`);
//         setAvailableOptions(response.data);
//       } catch (error) {
//         console.error('Error fetching available category/area:', error);
//       }
//     };
//     fetchAvailableOptions();
//   }, []);

//   return (
//     <div>
//       <Breadcrumb pageName="Master Data" />

//       {/* Text search input */}
//       <div className="w-full sm:w-1/3">
//         <label className="block text-sm font-medium mb-1">Search</label>
//         <input
//           type="text"
//           className="w-full p-2 border border-gray-300 rounded"
//           placeholder="Search by name, category, status, etc..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
//       <div className="flex justify-end gap-4 my-4">
//         {selectedClients.length > 0 && (
//           <div className="">
//             <button
//               className="bg-red-600 text-white px-4 py-2 rounded"
//               onClick={handleBulkDelete}
//             >
//               Delete Selected
//             </button>
//           </div>
//         )}
//         <button
//           onClick={() => setShowAddPopup(true)}
//           className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
//         >
//           <FontAwesomeIcon icon={faPlus} />
//           Add
//         </button>

//         <button
//           onClick={() => setShowImportPopup(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Import
//         </button>
//         <button
//           onClick={() => setShowAssignPopup(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Assign
//         </button>
//       </div>
//       {/* import data complete code */}

//       {showImportPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-md w-1/2 dark:border-strokedark dark:bg-boxdark">
//             <div className="flex text-center border-b-2 mb-3 dark:border-strokedark">
//               <h2 className="text-2xl font-bold flex dark:text-white">
//                 Import Bulk Data
//               </h2>
//             </div>

//             {error && !showDuplicateModal && (
//               <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//                 <strong>Error:</strong> {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               {/* ... your existing import form content ... */}
//               <div className="flex justify-end">
//                 <button className="border px-1 rounded mb-0 px-1 h-10 bg-blue-500 ">
//                   <a
//                     href="/documents/data_import_format.xlsx"
//                     download
//                     className="text-blue-600 flex items-center text-white gap-2 text-sm "
//                   >
//                     <FontAwesomeIcon icon={faDownload} /> Download Sample File
//                   </a>
//                 </button>
//               </div>

//               <div className="flex">
//                 <select
//                   name="cat_id"
//                   value={formData.cat_id}
//                   onChange={handleChange}
//                   required
//                   className="w-full m-3 ml-0 p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                 >
//                   <option value="">Select category</option>
//                   {categories.map((category) => (
//                     <option key={category.cat_id} value={category.cat_id}>
//                       {category.cat_name}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   name="reference"
//                   value={formData.reference}
//                   onChange={handleChange}
//                   required
//                   className="w-full  m-3 p-3 mr-0 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                 >
//                   <option value="">Select reference</option>
//                   {references.map((reference) => (
//                     <option
//                       key={reference.reference_id}
//                       value={reference.reference_id}
//                     >
//                       {reference.reference_name}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   name="area_id"
//                   value={formData.area_id}
//                   onChange={handleChange}
//                   required
//                   className="w-full  m-3 p-3 mr-0 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                 >
//                   <option value="">Select area</option>
//                   {area.map((area) => (
//                     <option key={area.area_id} value={area.area_id}>
//                       {area.area_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <input
//                 type="file"
//                 accept=".xlsx, .csv"
//                 onChange={handleFileChange}
//                 required
//                 className="mb-4 "
//               />

//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="bg-green-500 text-white px-4 py-2 rounded"
//                 >
//                   Submit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowImportPopup(false)}
//                   className="ml-4 text-white bg-red-500 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* assign data complete code */}
//       {showAssignPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 border-2 dark:border-strokedark dark:bg-boxdark">
//             {/* Header */}
//             <div className="flex justify-between items-center border-b-2 pb-2 mb-3 dark:border-strokedark">
//               <h2 className="text-2xl font-bold dark:text-white">
//                 Assign Task
//               </h2>

//               {/* Assign Type Dropdown (Moved up + bigger border) */}
//               <select
//                 name="assignType"
//                 value={assignData.assignType}
//                 onChange={handleChange}
//                 className="border-2 p-2 rounded w-[300px] dark:bg-form-input dark:text-white"
//               >
//                 <option value="" disabled>
//                   Assign Type
//                 </option>

//                 <option value="manual">Manual Assign</option>
//                 <option value="auto">Auto Assign</option>
//               </select>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleAssignSubmit}>
//               <div className="flex gap-2">
//                 {/* Mode */}
//                 <select
//                   name="mode"
//                   value={assignData.mode}
//                   onChange={handleChange}
//                   required
//                   className="border-2 p-2 m-1 w-full rounded dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                 >
//                   <option value="">Select Mode</option>
//                   <option value="call">Call</option>
//                   <option value="visit">Visit</option>
//                 </select>

//                 {/* Assign To */}
//                 <select
//                   name="assignedTo"
//                   value={assignData.assignedTo}
//                   onChange={handleChange}
//                   required
//                   disabled={assignData.assignType === 'auto'}
//                   className={`border-2 p-2 m-1 w-full rounded dark:border-form-strokedark dark:bg-form-input dark:text-white
//               ${
//                 assignData.assignType === 'auto'
//                   ? 'bg-gray-300 cursor-not-allowed'
//                   : ''
//               }`}
//                 >
//                   <option value="">Assign To</option>
//                   {users.map((user) => (
//                     <option key={user.id} value={`${user.name} (${user.role})`}>
//                       {user.name} ({user.role})
//                     </option>
//                   ))}
//                 </select>

//                 {/* Lead Count (Visible in both – disabled only in auto) */}
//                 <input
//                   type="number"
//                   name="leadCount"
//                   placeholder="Enter lead count"
//                   value={assignData.leadCount}
//                   onChange={handleChange}
//                   className="border-2 p-2 m-1 w-full rounded dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                 />
//               </div>

//               {/* Dates */}
//               <div className="flex gap-3 w-full mt-2">
//                 <div className="w-full">
//                   <label className="block mb-1 font-medium dark:text-white">
//                     Assigned Date
//                   </label>
//                   <input
//                     type="date"
//                     name="assignDate"
//                     value={assignData.assignDate}
//                     onChange={handleChange}
//                     className="w-full border-2 rounded px-2 py-1 dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                   />
//                 </div>

//                 <div className="w-full">
//                   <label className="block mb-1 font-medium dark:text-white">
//                     Target Date
//                   </label>
//                   <input
//                     type="date"
//                     name="targetDate"
//                     value={assignData.targetDate}
//                     onChange={handleChange}
//                     required
//                     className="w-full border-2 rounded px-2 py-1 dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                   />
//                 </div>
//               </div>

//               {/* Remark */}
//               <label className="block mt-3 mb-1 font-medium dark:text-white">
//                 Remark
//               </label>
//               <textarea
//                 id="remark"
//                 name="remark"
//                 value={assignData.remark}
//                 onChange={handleChange}
//                 placeholder="Remark"
//                 className="w-full border-2 rounded px-2 py-1 dark:border-form-strokedark dark:bg-form-input dark:text-white"
//               />

//               {/* Buttons */}
//               <div className="flex justify-end mt-4">
//                 <button
//                   type="submit"
//                   className="bg-green-500 text-white px-6 py-2 rounded font-medium"
//                 >
//                   Submit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowAssignPopup(false)}
//                   className="ml-4 bg-red-500 text-white px-6 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* update raw data  */}
//       {showEditPopup && editingClient && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-md w-1/2 dark:border-strokedark dark:bg-boxdark">
//             <div className="flex text-center border-b-2 mb-3 dark:border-strokedark">
//               <h2 className="text-2xl font-bold dark:text-white">
//                 Edit Client
//               </h2>
//             </div>

//             <form
//               onSubmit={async (e) => {
//                 e.preventDefault();
//                 const result = await handleUpdateClient(editingClient);
//                 if (result.success) {
//                   alert(result.message);
//                   closeEditPopup();
//                   // optionally refresh or update your client list state here
//                 } else {
//                   alert(result.message);
//                 }
//               }}
//             >
//               <div className="mb-3">
//                 <label className="block mb-1 dark:text-white">Name</label>
//                 <input
//                   type="text"
//                   value={editingClient.name}
//                   onChange={(e) =>
//                     setEditingClient({ ...editingClient, name: e.target.value })
//                   }
//                   className="w-full p-2 border dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="block mb-1 dark:text-white">Email</label>
//                 <input
//                   type="email"
//                   value={editingClient.email}
//                   onChange={(e) =>
//                     setEditingClient({
//                       ...editingClient,
//                       email: e.target.value,
//                     })
//                   }
//                   className="w-full p-2 border dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="block mb-1 dark:text-white">Phone</label>
//                 <input
//                   type="text"
//                   value={editingClient.number}
//                   onChange={(e) =>
//                     setEditingClient({
//                       ...editingClient,
//                       number: e.target.value,
//                     })
//                   }
//                   className="w-full p-2 border dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="block mb-1 dark:text-white">Address</label>
//                 <input
//                   type="text"
//                   value={editingClient.address}
//                   onChange={(e) =>
//                     setEditingClient({
//                       ...editingClient,
//                       address: e.target.value,
//                     })
//                   }
//                   className="w-full p-2 border dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="bg-green-500 text-white px-4 py-2 rounded"
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   onClick={closeEditPopup}
//                   className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Duplicate Entries Modal */}
//       {showDuplicateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4">
//           <div
//             className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[75vh] overflow-auto
//       dark:border-strokedark dark:bg-boxdark"
//           >
//             {/* Header */}
//             <div className="flex justify-between items-center border-b mb-4 pb-2 dark:border-strokedark">
//               <h2 className="text-xl font-bold dark:text-white">
//                 Duplicate Entries Found
//               </h2>
//               <button
//                 onClick={handleDuplicateModalClose}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Message */}
//             <p className="text-red-600 dark:text-red-400 font-semibold mb-4">
//               {duplicateEntries.length} duplicate entries found in your import
//               file. Please review the duplicates:
//             </p>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
//                 <thead>
//                   <tr className="bg-gray-200 dark:bg-gray-700 text-sm">
//                     <th className="border px-3 py-2">Row</th>
//                     <th className="border px-3 py-2">Name</th>
//                     <th className="border px-3 py-2">Email</th>
//                     <th className="border px-3 py-2">Contact</th>
//                     <th className="border px-3 py-2">Issue</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {duplicateEntries.map((entry, index) => (
//                     <tr
//                       key={index}
//                       className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
//                     >
//                       <td className="border px-3 py-2">
//                         {entry.row || index + 1}
//                       </td>
//                       <td className="border px-3 py-2">
//                         {entry.name || 'N/A'}
//                       </td>
//                       <td className="border px-3 py-2">
//                         {entry.email ? (
//                           <span className="text-red-600 font-semibold">
//                             {entry.email}
//                           </span>
//                         ) : (
//                           'N/A'
//                         )}
//                       </td>
//                       <td className="border px-3 py-2">
//                         {entry.number || entry.contact ? (
//                           <span className="text-red-600 font-semibold">
//                             {entry.number || entry.contact}
//                           </span>
//                         ) : (
//                           'N/A'
//                         )}
//                       </td>
//                       <td className="border px-3 py-2">
//                         {entry.email && entry.number ? (
//                           <span className="text-red-600 font-semibold">
//                             Email & Contact both exist
//                           </span>
//                         ) : entry.email ? (
//                           <span className="text-orange-600">Email exists</span>
//                         ) : (
//                           <span className="text-orange-600">
//                             Contact exists
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={handleCancelImport}
//                 className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//               >
//                 Cancel Import
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-full overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="py-4 px-4">
//                 <input
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={filteredClients
//                     .slice(
//                       (currentPage - 1) * entriesPerPage,
//                       currentPage * entriesPerPage,
//                     )
//                     .every((client) => selectedClients.includes(client.id))}
//                 />
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Master Id
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Category
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Reference Name
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Area
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Name
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Email
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Phone
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Address
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredClients
//               .slice(
//                 (currentPage - 1) * entriesPerPage,
//                 currentPage * entriesPerPage,
//               )
//               .map((client, index) => (
//                 <tr key={client.id} className="border-b">
//                   <td className="py-3 px-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedClients.includes(client.id)}
//                       onChange={() => handleSelect(client.id)}
//                     />
//                   </td>
//                   <td className="py-3 px-4">{client.master_id}</td>
//                   <td className="py-3 px-4">{client.cat_name}</td>
//                   <td className="py-3 px-4">{client.reference_name}</td>
//                   <td className="py-3 px-4">{client.area}</td>
//                   <td className="py-3 px-4">{client.name}</td>
//                   <td className="py-3 px-4">{client.email}</td>
//                   <td className="py-3 px-4">{client.number}</td>{' '}
//                   {/* Changed from contact to number */}
//                   <td className="py-3 px-4">{client.address}</td>
//                   <td className="border-[#eee] py-5 px-4 dark:border-strokedark text-center flex justify-center gap-2">
//                     <button
//                       className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-meta-3 hover:bg-opacity-75"
//                       onClick={() => handleEditClick(client)}
//                     >
//                       <FontAwesomeIcon icon={faEdit} />
//                     </button>
//                     <button
//                       className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-red-600 hover:bg-red-700"
//                       onClick={() => handleSingleDelete(client.id)}
//                     >
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>

//         <div className="flex justify-end p-4">
//           {[...Array(totalPages)].map((_, index) => (
//             <button
//               key={index}
//               onClick={() => paginate(index + 1)}
//               className={`mx-1 px-3 py-1 border rounded-md ${
//                 currentPage === index + 1
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-white'
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Add Single Data Popup - Now using the separate component */}
//       <InsertDataModal
//         showAddPopup={showAddPopup}
//         setShowAddPopup={setShowAddPopup}
//         singleFormData={singleFormData}
//         setSingleFormData={setSingleFormData}
//         categories={categories}
//         references={references}
//         area={area}
//         fetchRawData={fetchRawData}
//         setError={setError}
//         setDuplicateEntries={setDuplicateEntries}
//         setShowDuplicateModal={setShowDuplicateModal}
//       />

//     </div>
//   );
// };

// export default RawData;

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faDownload,
  faPlus,
  faFileImport,
  faPhone,
  faLocation,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';
import axios from 'axios';
import InsertDataModal from '../Rawdata/InsertDataModal';
import UpdateRawData from '../Rawdata/UpdateRawData';

const RawData = () => {
  type Data = {
    id: number;
    master_id: number;
    name: string;
    number: string;
    email: string;
    address: string;
    area: string;
    area_id: string;
    status: string;
    cat_name: string;
    cat_id: number;
    reference_name: string;
  };

  type Client = {
    id: number;
    master_id: number;
    name: string;
    number: string;
    email: string;
    address: string;
    area: string;
    area_id: string;
    status: string;
    cat_name: string;
    cat_id: number;
    reference_name: string;
  };

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
    reference_id: number;
  }

  type User = {
    id: number;
    name: string;
    contact: string;
    email: string;
    address: string;
    role: string;
    status: string;
    category: string;
  };

  interface Props {
    assignData: { assignedTo: string };
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}api/users`);
  //       setUsers(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch users:', error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/users`);

        console.log('📌 Raw Users from backend:', response.data);

        const formattedUsers = response.data.map((u: any) => ({
          id: Number(u.user_id), // map correct ID
          name: u.name,
          role: u.role,
        }));

        console.log('🎯 Mapped Users:', formattedUsers);

        setUsers(formattedUsers);
      } catch (error) {
        console.error('❌ Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    cat_id: '',
    reference: '',
    // area_id: '',
    source_id: '',
  });
  const [rawData, setRawData] = useState<Data[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClients, setSelectedClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableOptions, setAvailableOptions] = useState<
    { cat_id: number; area_id: number }[]
  >([]);
  const [errorDetails, setErrorDetails] = useState<any[]>([]);
  const [sources, setSources] = useState<Source[]>([]);

  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateEntries, setDuplicateEntries] = useState<any[]>([]);
  const [filteredSources, setFilteredSources] = useState<Source[]>([]);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [singleFormData, setSingleFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    cat_id: '',
    reference: '',
    area_id: '',
  });

  const handleChangeSource = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    console.log('📌 handleChangeSource Triggered:', name, value);

    // Update state always
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'reference') {
      const referenceId = Number(value); // convert to number
      console.log('➡ Filtering for referenceId:', referenceId);

      console.log('🔍 Sources available:', sources);

      const filtered = sources.filter((src) => {
        console.log(
          `Checking source: ${src.source_id} | reference_id: ${src.reference_id}`,
        );
        return Number(src.reference_id) === referenceId; // important fix
      });

      console.log('🎯 Filtered Sources:', filtered);

      setFilteredSources(filtered);

      // Reset source dropdown
      setFormData((prev) => ({
        ...prev,
        source_id: '',
      }));
    }
  };

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const results = rawData.filter((client) => {
      const name = client.name?.toLowerCase() || '';
      const number = client.number?.toString() || '';
      const email = client.email?.toLowerCase() || '';
      const address = client.address?.toLowerCase() || '';
      const areaName = client.area?.toLowerCase() || '';
      const catName = client.cat_name?.toLowerCase() || '';
      const masterIdStr = client.master_id?.toString() || '';

      return (
        name.includes(lowerSearch) ||
        number.includes(lowerSearch) ||
        email.includes(lowerSearch) ||
        address.includes(lowerSearch) ||
        areaName.includes(lowerSearch) ||
        catName.includes(lowerSearch) ||
        masterIdStr.includes(lowerSearch)
      );
    });

    setFilteredClients(results);
  }, [searchTerm, rawData]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/clients`);
      setFilteredClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const currentEntries = filteredClients.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage,
    );
    const currentIds = currentEntries.map((client) => client.id);

    if (isChecked) {
      setSelectedClients((prev) => {
        const combined = [...prev, ...currentIds];

        return combined.filter((id, index) => combined.indexOf(id) === index);
      });
    } else {
      setSelectedClients((prev) =>
        prev.filter((id) => !currentIds.includes(id)),
      );
    }
  };

  const handleSelect = (clientId: number) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setShowEditPopup(true);
  };

  const closeEditPopup = () => {
    setEditingClient(null);
    setShowEditPopup(false);
  };

  const [assignData, setAssignData] = useState({
    assignType: '',
    mode: '',
    assignedTo: 0,
    // assignDate: today,
    // targetDate: today,
    remark: '',
    // leadCount: '',
  });

  const entriesPerPage = 20;
  const totalPages = Math.ceil(filteredClients.length / entriesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >,
  // ) => {
  //   const { name, value } = e.target;

  //   const numericFields = ['cat_id', 'area_id', 'leadCount'];
  //   const parsedValue = numericFields.includes(name) ? Number(value) : value;

  //   setFormData({ ...formData, [name]: parsedValue });
  //   setAssignData({ ...assignData, [name]: parsedValue });

  //   console.log('assigned lead :', name, parsedValue);
  // };

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (!file) {
  //     console.error('No file selected');
  //     return;
  //   }

  //   const formData1 = new FormData();
  //   formData1.append('file', file);
  //   formData1.append('cat_id', formData.cat_id);
  //   formData1.append('reference', formData.reference);
  //   formData1.append('area_id', formData.area_id);
  //   formData1.append('source_id', formData.source_id);

  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}api/master-data/import`,
  //       formData1,
  //       {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //         withCredentials: true,
  //       },
  //     );

  //     if (response.status === 200) {
  //       alert('Data imported successfully.');
  //       setError('');
  //       setErrorDetails([]);
  //       setFile(null);
  //       setFormData({ cat_id: '', reference: '', area_id: '', source_id: '' });
  //       setShowImportPopup(false);
  //       fetchRawData(); // Refresh the data after successful import
  //     }
  //   } catch (err: any) {
  //     const backendMessage =
  //       err.response?.data?.message || 'Failed to import file.';
  //     const duplicates = err.response?.data?.duplicates || [];

  //     // If duplicates found → show duplicate modal only
  //     if (duplicates.length > 0) {
  //       setShowImportPopup(false); // CLOSE MAIN IMPORT POPUP
  //       setDuplicateEntries(duplicates); // STORE DUPLICATES
  //       setShowDuplicateModal(true); // OPEN DUPLICATE MODAL
  //       setError(''); // DO NOT SHOW RED ERROR BOX
  //       return; // EXIT
  //     }

  //     // Other errors (if no duplicates exist)
  //     setError(backendMessage);
  //     setErrorDetails([]);
  //   }
  // };

  // Function to handle duplicate modal close

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    const numberFields = ['cat_id', 'area_id', 'leadCount', 'assignedTo'];

    let parsedValue: any = value;
    if (numberFields.includes(name)) {
      parsedValue = value === '' ? '' : Number(value);
    }

    const assignFields = [
      'assignType',
      'mode',
      'assignedTo',
      'assignDate',
      'targetDate',
      'remark',
      'leadCount',
    ];

    if (assignFields.includes(name)) {
      setAssignData((prev) => ({ ...prev, [name]: parsedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    }

    console.log('🟢 AssignData:', { ...assignData, [name]: parsedValue });
    console.log('🔵 FormData:', { ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData1 = new FormData();
    formData1.append('file', file);
    formData1.append('cat_id', formData.cat_id);
    formData1.append('reference', formData.reference);
    // formData1.append('area_id', formData.area_id);
    formData1.append('source_id', formData.source_id);

    // Assign fields bhi backend ko bhejne padege
    formData1.append('assignType', assignData.assignType);
    formData1.append('mode', assignData.mode);
    formData1.append('assignedTo', String(assignData.assignedTo));
    // formData1.append('assignDate', assignData.assignDate);
    // formData1.append('targetDate', assignData.targetDate);
    formData1.append('remark', assignData.remark);
    // formData1.append('leadCount', assignData.leadCount);

    try {
      const response = await axios.post(
        `${BASE_URL}api/master-data/import`,
        formData1,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        alert(
          response.data.totalAssigned
            ? `Imported & Assigned (${response.data.totalAssigned}) leads successfully!`
            : 'Data imported successfully!',
        );

        setError('');
        setErrorDetails([]);
        setFile(null);

        setFormData({
          cat_id: '',
          reference: '',
          // area_id: '',
          source_id: '',
        });

        setAssignData({
          assignType: '',
          mode: '',
          assignedTo: 0,
          // assignDate: '',
          // targetDate: '',
          // leadCount: '',
          remark: '',
        });

        setShowImportPopup(false);
        fetchRawData();
      }
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Import failed';

      const duplicates = err.response?.data?.duplicates || [];

      if (duplicates.length > 0) {
        setShowImportPopup(false);
        setDuplicateEntries(duplicates);
        setShowDuplicateModal(true);
        setError('');
        return;
      }

      setError(backendMessage);
    }
  };

  const handleDuplicateModalClose = () => {
    setShowDuplicateModal(false);
    setDuplicateEntries([]);
    setError('');
  };

  // Function to proceed with import despite duplicates (if your backend supports it)
  const handleForceImport = async () => {
    if (!file) return;

    const formData1 = new FormData();
    formData1.append('file', file);
    formData1.append('cat_id', formData.cat_id);
    formData1.append('reference', formData.reference);
    // formData1.append('area_id', formData.area_id);
    formData1.append('force_import', 'true'); // Add flag to force import

    try {
      const response = await axios.post(
        `${BASE_URL}api/master-data/import`,
        formData1,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        alert('Data imported successfully (duplicates skipped).');
        setShowDuplicateModal(false);
        setDuplicateEntries([]);
        setError('');
        setFile(null);
        setFormData({ cat_id: '', reference: '', source_id: '' });
        // setFormData({ cat_id: '', reference: '', area_id: '', source_id: '' });
        setShowImportPopup(false);
        fetchRawData(); // Refresh the data
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to import file.';
      setError(errorMessage);
    }
  };

  // Function to cancel and close everything
  const handleCancelImport = () => {
    setShowDuplicateModal(false);
    setDuplicateEntries([]);
    setShowImportPopup(false);
    setFile(null);
    setFormData({ cat_id: '', reference: '', source_id: '' });
    // setFormData({ cat_id: '', reference: '', area_id: '', source_id: '' });
    setError('');
  };

  // Add function to proceed with import despite duplicates
  const handleProceedWithImport = async () => {
    setShowDuplicateModal(false);
    setDuplicateEntries([]);
    setShowImportPopup(false);

    // Optionally clear the form
    setFile(null);
    setFormData({ cat_id: '', reference: '', source_id: '' });
    // setFormData({ cat_id: '', reference: '', area_id: '', source_id: '' });

    alert(
      'Please review the duplicate entries and try again with corrected data.',
    );
  };

  //fetch master data

  const fetchRawData = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/master-data`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      // Map the API response to your frontend structure with ALL fields
      const formattedData = data.map((item: any) => ({
        id: item.master_id,
        master_id: item.master_id,
        name: item.name,
        number: item.number,
        email: item.email,
        address: item.address,
        area: item.area_name,
        area_id: item.area_id,
        status: item.status,
        cat_name: item.cat_name,
        cat_id: item.cat_id,
        reference_name: item.reference_name || 'N/A',
        reference_id: item.reference_id,
        source_name: item.source_name || 'N/A',
        source_id: item.source_id,
        created_by_user: item.created_by_user,
        created_by_username: item.created_by_username || 'System',
        created_at: item.created_at,

        // Additional fields
        city: item.city || '',
        location_link: item.location_link || '',
        room_dimension: item.room_dimension || '',
        p_type: item.p_type || '',
        budget_range: item.budget_range || '',
        current_stage: item.current_stage || '',
        room_ready: item.room_ready || '',
        time_to_complete: item.time_to_complete || '',
        site_visit_date: item.site_visit_date || '',
        demo_date: item.demo_date || '',
        ar_number: item.ar_number || '',
        ca_number: item.ca_number || '',
        e_number: item.e_number || '',
        sm_number: item.sm_number || '',
        pop_number: item.pop_number || '',
        other_number: item.other_number || '',
        lead_stage: item.lead_stage || '',
        quick_remark: item.quick_remark || '',
        detailed_remark: item.detailed_remark || '',
      }));

      setRawData(formattedData);
      setFilteredClients(formattedData);
    } catch (error) {
      console.error('Error fetching Master Data:', error);
    }
  };

  // Call this in useEffect
  useEffect(() => {
    fetchRawData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/category`);
        setCategories(response.data);
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  //import reference
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/reference`);
        setReferences(response.data);
      } catch (err) {
        setError('Failed to load references.');
      }
    };
    fetchReferences();
  }, []);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/source`);
        setSources(response.data);
      } catch (err) {
        console.error('Failed to fetch sources', err);
      }
    };
    fetchSources();
  }, []);

  // import  Fetch Area
  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/area`);
        setArea(response.data);
      } catch (error) {
        console.error('Error fetching Area:', error);
      }
    };
    fetchArea();
  }, []);

  //ASSIGN
  const handleAssignSubmit = async (e) => {
    e.preventDefault();

    console.log('📤 Sending assignment data to backend:', assignData);

    try {
      const response = await fetch(`${BASE_URL}api/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(assignData), // cat_id / area_id removed from assignData
      });

      const result = await response.json();

      console.log('📩 Backend response:', result);

      if (response.ok) {
        alert('✅ Leads assigned successfully!');
        fetchRawData();

        // Reset data (without cat_id and area_id)
        setAssignData({
          mode: '',
          assignedTo: 0,
          // assignDate: '',
          // targetDate: '',
          remark: '',
          // leadCount: '',
          assignType: 'manual',
        });

        setShowAssignPopup(false);
      } else {
        console.error('🚨 Error:', result.error || result);
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('Something went wrong while submitting the assignment.');
    }
  };

  //bulk delete function
  const handleBulkDelete = async () => {
    if (window.confirm('Are you sure you want to delete selected clients?')) {
      try {
        await axios.post(`${BASE_URL}api/master-data/delete-multiple`, {
          ids: selectedClients,
        });
        setSelectedClients([]);
        alert('Selected Entry deleted successfully.');
        fetchClients();
      } catch (error) {
        console.error(error);
        alert('Failed to delete selected entry.');
      }
    }
  };

  //Single delete function
  const handleSingleDelete = async (Id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`${BASE_URL}api/master-data/${Id}`);
        alert('Entry deleted successfully.');
        setSelectedClients([]); // clear selected checkboxes
        fetchClients();
      } catch (error) {
        console.error(error);
        alert('Failed to delete entry.');
      }
    }
  };

  const handleSingleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSingleFormData({ ...singleFormData, [name]: value });
  };

  useEffect(() => {
    const fetchAvailableOptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/available-cat-area`);
        setAvailableOptions(response.data);
      } catch (error) {
        console.error('Error fetching available category/area:', error);
      }
    };
    fetchAvailableOptions();
  }, []);

  return (
    <div>
      <Breadcrumb pageName="Master Data" />

      {/* Text search input */}
      <div className="w-full sm:w-1/3">
        <label className="block text-sm font-medium mb-1">Search</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-4 my-4">
        {selectedClients.length > 0 && (
          <div className="">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </button>
          </div>
        )}
        <button
          onClick={() => setShowAddPopup(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add
        </button>

        <button
          onClick={() => setShowImportPopup(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Import
        </button>
        {/* <button
          onClick={() => setShowAssignPopup(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Assign
        </button> */}
      </div>
      {/* import data complete code */}

      {showImportPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/2 dark:border-strokedark dark:bg-boxdark">
            <div className="flex text-center border-b-2 mb-3 dark:border-strokedark">
              <h2 className="text-2xl font-bold flex dark:text-white">
                Import Bulk Data
              </h2>
            </div>

            {error && !showDuplicateModal && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* ... your existing import form content ... */}
              <div className="flex justify-end">
                <button className="border px-1 rounded mb-0 px-1 h-10 bg-blue-500 ">
                  <a
                    href="/documents/data_import_format.xlsx"
                    download
                    className="text-blue-600 flex items-center text-white gap-2 text-sm "
                  >
                    <FontAwesomeIcon icon={faDownload} /> Download Sample File
                  </a>
                </button>
              </div>

              {/* Assign Options */}
              <div className="flex gap-3 mb-3">
                {/* Assign Type */}
                <select
                  name="assignType"
                  value={assignData.assignType}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="">Assign Type</option>
                  <option value="manual">Manual</option>
                  <option value="auto">Auto</option>
                </select>

                {/* Mode */}
                <select
                  name="mode"
                  value={assignData.mode}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="">Mode</option>
                  <option value="call">Call</option>
                  <option value="visit">Visit</option>
                </select>

                {/* Assign To */}
                <select
                  name="assignedTo"
                  value={assignData.assignedTo}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selectedUser = users.find((u) => u.id === selectedId);

                    console.log('🆔 User ID:', selectedId);
                    console.log('👤 User Name:', selectedUser?.name);
                    console.log('🎧 User Role:', selectedUser?.role);

                    setAssignData((prev) => ({
                      ...prev,
                      assignedTo: selectedId, // Only ID required for backend
                    }));
                  }}
                  required={assignData.assignType === 'manual'}
                  disabled={assignData.assignType === 'auto'}
                  className={`w-full p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white
                  ${
                    assignData.assignType === 'auto'
                      ? 'bg-gray-300 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <option value="">Assign To</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>

                {/* Lead Count */}
                {/* <input
                  type="number"
                  name="leadCount"
                  placeholder="Lead Count"
                  value={assignData.leadCount}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                /> */}
              </div>

              {/* Dates Row */}
              {/* <div className="flex gap-3 mb-3">
                <div className="w-full">
                  <label className="text-sm dark:text-white">Assign Date</label>
                  <input
                    type="date"
                    name="assignDate"
                    value={assignData.assignDate}
                    onChange={handleChange}
                    className="w-full p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>

                <div className="w-full">
                  <label className="text-sm dark:text-white">Target Date</label>
                  <input
                    type="date"
                    name="targetDate"
                    value={assignData.targetDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
              </div> */}

              {/* Import Mapping Fields → Same UI as Before */}
              <div className="flex">
                <select
                  name="cat_id"
                  value={formData.cat_id}
                  onChange={handleChange}
                  required
                  className="w-full m-3 ml-0 p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.cat_id} value={category.cat_id}>
                      {category.cat_name}
                    </option>
                  ))}
                </select>

                <select
                  name="reference"
                  value={formData.reference}
                  onChange={handleChangeSource}
                  required
                  className="w-full m-3 p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="">Select reference</option>
                  {references.map((ref) => (
                    <option key={ref.reference_id} value={ref.reference_id}>
                      {ref.reference_name}
                    </option>
                  ))}
                </select>

                <select
                  name="source_id"
                  value={formData.source_id}
                  onChange={handleChangeSource}
                  required
                  disabled={!formData.reference}
                  className={`w-full m-3 p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white 
      ${!formData.reference ? 'bg-gray-300 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select Source</option>
                  {filteredSources.map((src) => (
                    <option key={src.source_id} value={src.source_id}>
                      {src.source_name}
                    </option>
                  ))}
                </select>

                {/* <select
                  name="area_id"
                  value={formData.area_id}
                  onChange={handleChange}
                  required
                  className="w-full m-3 p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="">Select area</option>
                  {area.map((a) => (
                    <option key={a.area_id} value={a.area_id}>
                      {a.area_name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="mb-3">
                <label className="text-sm dark:text-white">Remark</label>
                <textarea
                  name="remark"
                  placeholder="Remark"
                  value={assignData.remark}
                  onChange={handleChange}
                  className="w-full p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  rows={3}
                />
              </div>
              <input
                type="file"
                accept=".xlsx, .csv"
                onChange={handleFileChange}
                required
                className="mb-4 "
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportPopup(false)}
                  className="ml-4 text-white bg-red-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Data Modal Component */}

   <UpdateRawData
        showEditPopup={showEditPopup}
        editingClient={editingClient}
        setEditingClient={setEditingClient}
        closeEditPopup={closeEditPopup}
        fetchRawData={fetchRawData}
        categories={categories}
        references={references}
        area={area}
      />

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

      <div className="max-w-full overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={filteredClients
                    .slice(
                      (currentPage - 1) * entriesPerPage,
                      currentPage * entriesPerPage,
                    )
                    .every((client) => selectedClients.includes(client.id))}
                />
              </th>
              {/* <th className="py-4 px-4 font-medium text-black dark:text-white">
                Master Id
              </th> */}
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Phone
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Course
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Reference Name
              </th>
              {/* <th className="py-4 px-4 font-medium text-black dark:text-white">
                Address
              </th> */}

              {/* <th className="py-4 px-4 font-medium text-black dark:text-white">
                City
              </th>*/}
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Source
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Created by
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Created At
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients
              .slice(
                (currentPage - 1) * entriesPerPage,
                currentPage * entriesPerPage,
              )
              .map((client, index) => (
                <tr key={client.id} className="border-b">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleSelect(client.id)}
                    />
                  </td>
                  {/* <td className="py-3 px-4">{client.master_id}</td> */}
                  <td className="py-3 px-4">{client.name}</td>
                  <td className="py-3 px-4">{client.number}</td>{' '}
                  <td className="py-3 px-4">{client.email}</td>
                  <td className="py-3 px-4">{client.cat_name}</td>
                  <td className="py-3 px-4">{client.reference_name}</td>
                  <td className="py-3 px-4">{client.source_name}</td>
                  <td className="py-3 px-4">{client.created_by_username}</td>
                  <td className="py-3 px-4">{client.created_at}</td>
                  {/* <td className="py-3 px-4">{client.area}</td> */}
                  {/* Changed from contact to number */}
                  {/* <td className="py-3 px-4">{client.address}</td> */}
                  <td className="border-[#eee] py-5 px-4 dark:border-strokedark text-center flex justify-center gap-2">
                    <button
                      className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-meta-3 hover:bg-opacity-75"
                      onClick={() => handleEditClick(client)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-red-600 hover:bg-red-700"
                      onClick={() => handleSingleDelete(client.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* <div className="flex justify-end p-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 border rounded-md ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div> */}
        {/* ==================== Updated Pagination ==================== */}
        <div className="flex justify-between items-center p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Showing {(currentPage - 1) * entriesPerPage + 1} -
            {Math.min(currentPage * entriesPerPage, filteredClients.length)} of{' '}
            {filteredClients.length}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:bg-boxdark dark:text-white'
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:bg-boxdark dark:text-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 3 || page === currentPage + 3) {
                return <span key={page}>...</span>;
              } else return null;
            })}

            <button
              onClick={() =>
                currentPage < totalPages && paginate(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:bg-boxdark dark:text-white'
              }`}
            >
              Next
            </button>
          </div>
        </div>
        {/* ======================================================================== */}
      </div>

      {/* Add Single Data Popup - Now using the separate component */}
      <InsertDataModal
  showAddPopup={showAddPopup}
  setShowAddPopup={setShowAddPopup}
  singleFormData={singleFormData}
  setSingleFormData={setSingleFormData}
  categories={categories}
  references={references}
  area={area}
  fetchRawData={fetchRawData}
  setError={setError}
  setDuplicateEntries={setDuplicateEntries}
  setShowDuplicateModal={setShowDuplicateModal}
  showDuplicateModal={showDuplicateModal}     
  duplicateEntries={duplicateEntries}         
/>
    </div>
  );
};

export default RawData;
