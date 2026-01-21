// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config.js';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
// import { FaEdit, FaEye, FaHistory } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faPhone } from '@fortawesome/free-solid-svg-icons';
// import UpdateActiveLeads from './UpdateActiveLeads.js';
// import LeadDetailsPage from './LeadDetailsPage.js';

// interface Category {
//   cat_id: number;
//   cat_name: string;
// }

// interface Reference {
//   reference_id: number;
//   reference_name: string;
// }

// interface Area {
//   area_id: number;
//   area_name: string;
// }

// interface Product {
//   product_id: number;
//   product_name: string;
// }

// interface Source {
//   source_id: number;
//   source_name: string;
// }

// interface User {
//   user_id: number;
//   name: string;
// }

// const ActiveLeads = () => {
//   const [activeLeads, setActiveLeads] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [subStageList, setSubStageList] = useState([]);
//   const [stageList, setStageList] = useState([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [references, setReferences] = useState<Reference[]>([]);
//   const [area, setArea] = useState<Area[]>([]);
//   const [sources, setSources] = useState<Source[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [error, setError] = useState('');
//   const [productList, setProductList] = useState<Product[]>([]);
//   const [statusMap, setStatusMap] = useState<any>({});
//   const [selectedLeadId, setSelectedLeadId] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showLogs, setShowLogs] = useState(false);
//   const [refreshTrigger, setRefeshTrigger] = useState(0);

//   const fetchActiveLeads = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/rawdata/active`, {
//         withCredentials: true,
//       });

//       const filtered = response.data.filter(
//         (item) => item.lead_status === 'Active',
//       );

//       setActiveLeads(filtered);
//     } catch (error) {
//       console.error('Error fetching Active Leads:', error);
//     }
//   };

//   useEffect(() => {
//     fetchActiveLeads();
//   }, [refreshTrigger]);

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

//   useEffect(() => {
//     const fetchSources = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/sources`, {
//           withCredentials: true,
//         });
//         setSources(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching sources:', error);
//       }
//     };
//     fetchSources();
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}api/users`);

//         // console.log('Users response:', res.data);

//         setUsers(res.data || []);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const loadStages = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/leadstages`, {
//         withCredentials: true,
//       });

//       const stages = Array.isArray(res.data.data) ? res.data.data : [];

//       setStageList(stages);

//       const map: any = {};
//       stages.forEach((stage: any) => {
//         if (stage?.stage_id && stage?.stage_name) {
//           map[stage.stage_id] = stage.stage_name;
//         }
//       });
//       setStatusMap(map);
//     } catch (error) {
//       console.error('Error fetching stages:', error);
//     }
//   };

//   useEffect(() => {
//     loadStages();
//   }, []);

//   const fetchSubStagesByStage = async (stageId: string | number) => {
//     if (!stageId) {
//       setSubStageList([]);
//       return;
//     }

//     try {
//       const res = await axios.get(`${BASE_URL}api/lead-sub-stages/${stageId}`, {
//         withCredentials: true,
//       });
//       setSubStageList(res.data.sub_stages || []);
//     } catch (err) {
//       console.error('Error fetching sub-stages:', err);
//     }
//   };

//   const fetchProducts = async (catId: string | number) => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/products/${catId}`);
//       setProductList(res.data);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//     }
//   };

//   const filteredData = activeLeads.filter((item) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       item.name?.toLowerCase().includes(term) ||
//       item.cat_name?.toLowerCase().includes(term) ||
//       item.source_name?.toLowerCase().includes(term) ||
//       item.assigned_user_name?.toLowerCase().includes(term) ||
//       item.stage_name?.toLowerCase().includes(term) ||
//       item.lead_sub_stage_name?.toLowerCase().includes(term)
//     );
//   });

//   const itemsPerPage = 25;

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const startIndex = (currentPage - 1) * itemsPerPage;

//   const paginatedData = filteredData.slice(
//     startIndex,
//     startIndex + itemsPerPage,
//   );

//   const paginate = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handleOpenPopup = (masterId) => {
//     setSelectedLeadId(masterId);
//     setShowPopup(true);
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   const entriesPerPage = 50;
//   const totalItems = filteredData.length;

//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Active Leads" />
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-1">Search</label>
//         <input
//           type="text"
//           className="w-90 p-2 border border-gray-300 rounded"
//           placeholder="Search by name, category, stage..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//       </div>
//       <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="py-4 px-4 text-black dark:text-white">Sr no</th>
//               <th className="py-4 px-4 text-black dark:text-white">Name</th>
//               <th className="py-4 px-4 text-black dark:text-white">Contact</th>
//               <th className="py-4 px-4 text-black dark:text-white">Source</th>
//               <th className="py-4 px-4 text-black dark:text-white">Assign</th>
//               <th className="py-4 px-4 text-black dark:text-white">
//                 Lead Stage
//               </th>
//               <th className="py-4 px-4 text-black dark:text-white">
//                 Sub Stage
//               </th>

//               <th className="py-4 px-4 text-black dark:text-white">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedData.map((lead, index) => (
//               <tr key={index}>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {(currentPage - 1) * itemsPerPage + index + 1}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {lead.name}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {lead.number
//                     ? lead.number
//                         .replace(/[`-]/g, '') // ` aur - remove
//                         .replace(/^91/, '') // starting 91 remove
//                     : 'NA'}
//                 </td>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {lead.source_name}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {lead.assigned_to}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {lead.stage_name}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {lead.lead_sub_stage_name}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark flex gap-2">
//                   <div className="flex gap-3 h-8 justify-center">
//                     <button
//                       onClick={() => {
//                         setEditData(lead);
//                         setEditModalOpen(true);
//                       }}
//                       className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
//                     >
//                       <FaEdit size={16} />
//                     </button>

//                     {/* LOGS */}
//                     <button
//                       onClick={() => {
//                         setSelectedLeadId(lead.master_id);
//                         setShowLogs(true);
//                       }}
//                       className="bg-orange-500 py-1 px-3 rounded text-white hover:bg-opacity-75"
//                     >
//                       <FaHistory size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}

//             {paginatedData.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={8}
//                   className="text-center py-4 text-gray-500 dark:text-gray-300"
//                 >
//                   No Active Leads Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {viewModalOpen && selectedLead && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="relative bg-white w-[500px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-5">
//             <button
//               className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
//               onClick={() => setViewModalOpen(false)}
//             >
//               ✖
//             </button>

//             <h2 className="text-xl font-semibold mb-4">Lead Details</h2>

//             <div className="space-y-2">
//               <p>
//                 <strong>Name:</strong> {selectedLead.name}
//               </p>
//               <p>
//                 <strong>Number:</strong> {selectedLead.number}
//               </p>
//               <p>
//                 <strong>Email:</strong> {selectedLead.email}
//               </p>
//               <p>
//                 <strong>Address:</strong> {selectedLead.address}
//               </p>
//               <p>
//                 <strong>Area:</strong> {selectedLead.area_name}
//               </p>
//               <p>
//                 <strong>Category:</strong> {selectedLead.cat_name}
//               </p>
//               <p>
//                 <strong>Reference:</strong> {selectedLead.reference_name}
//               </p>
//               <p>
//                 <strong>Source:</strong> {selectedLead.source_name}
//               </p>
//               <p>
//                 <strong>Lead Stage:</strong> {selectedLead.stage_name}
//               </p>
//               <p>
//                 <strong>Lead Sub Stage:</strong>{' '}
//                 {selectedLead.lead_sub_stage_name}
//               </p>
//               <p>
//                 <strong>Assigned To:</strong> {selectedLead.assigned_to}
//               </p>
//               <p>
//                 <strong>Products:</strong> {selectedLead.products}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {showLogs && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-999 overflow-y-auto">
//           <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto dark:border-strokedark dark:bg-boxdark ml-20">
//             {/* CLOSE BUTTON */}
//             {/* <button
//         className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-3 py-1 hover:bg-red-600"
//         onClick={() => setShowLogs(false)}
//       >
//         ✖
//       </button> */}

//             {/* CHILD COMPONENT */}
//             <LeadDetailsPage
//               masterId={selectedLeadId}
//               onBack={() => setShowLogs(false)}
//             />
//           </div>
//         </div>
//       )}

//       {/* UpdateActiveLeads modal */}
//       <UpdateActiveLeads
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         leadData={editData}
//         categories={categories}
//         references={references}
//         areaList={area}
//         sources={sources}
//         users={users}
//         stageList={stageList}
//         subStageList={subStageList}
//         setRefeshTrigger={setRefeshTrigger}
//       />

//       {/* Pagination */}
//       {/* Pagination Footer */}
//       <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-strokedark">
//         {/* LEFT SIDE INFO */}
//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           Showing{' '}
//           <span className="font-medium">
//             {totalItems === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1}
//           </span>{' '}
//           to{' '}
//           <span className="font-medium">
//             {Math.min(currentPage * entriesPerPage, totalItems)}
//           </span>{' '}
//           of <span className="font-medium">{totalItems}</span> results
//         </div>

//         {/* RIGHT SIDE PAGINATION */}
//         <div className="flex items-center gap-2">
//           {/* First */}
//           <button
//             onClick={() => paginate(1)}
//             disabled={currentPage === 1}
//             className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//           >
//             «
//           </button>

//           {/* Prev */}
//           <button
//             onClick={() => paginate(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//           >
//             ‹
//           </button>

//           {/* Page Numbers */}
//           {(() => {
//             const pages: (number | string)[] = [];

//             if (totalPages <= 7) {
//               for (let i = 1; i <= totalPages; i++) pages.push(i);
//             } else {
//               pages.push(1);

//               if (currentPage > 4) pages.push('...');

//               const start = Math.max(2, currentPage - 1);
//               const end = Math.min(totalPages - 1, currentPage + 1);

//               for (let i = start; i <= end; i++) pages.push(i);

//               if (currentPage < totalPages - 3) pages.push('...');

//               pages.push(totalPages);
//             }

//             return pages.map((page, idx) =>
//               page === '...' ? (
//                 <span key={`dots-${idx}`} className="px-2 text-gray-400">
//                   ...
//                 </span>
//               ) : (
//                 <button
//                   key={page}
//                   onClick={() => paginate(Number(page))}
//                   className={`px-3 py-1.5 border rounded-md text-sm transition-all ${
//                     currentPage === page
//                       ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
//                       : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ),
//             );
//           })()}

//           {/* Next */}
//           <button
//             onClick={() => paginate(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//           >
//             ›
//           </button>

//           {/* Last */}
//           <button
//             onClick={() => paginate(totalPages)}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//           >
//             »
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActiveLeads;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config.js';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
// import { FaEdit, FaHistory } from 'react-icons/fa';
// import UpdateActiveLeads from './UpdateActiveLeads.js';
// import LeadDetailsPage from './LeadDetailsPage.js';

// interface Category {
//   cat_id: number;
//   cat_name: string;
// }

// interface Reference {
//   reference_id: number;
//   reference_name: string;
// }

// interface Area {
//   area_id: number;
//   area_name: string;
// }

// interface Product {
//   product_id: number;
//   product_name: string;
// }

// interface Source {
//   source_id: number;
//   source_name: string;
// }

// interface User {
//   user_id: number;
//   name: string;
// }

// const ITEMS_PER_PAGE = 25;

// const ActiveLeads = () => {
//   const [leads, setLeads] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editData, setEditData] = useState<any>(null);
//   const [showLogs, setShowLogs] = useState(false);
//   const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

//   // FILTERS
//   const [selectedUser, setSelectedUser] = useState('');
//   const [selectedSource, setSelectedSource] = useState('');
//   const [selectedStage, setSelectedStage] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [references, setReferences] = useState<Reference[]>([]);
//   const [area, setArea] = useState<Area[]>([]);
//   // const [sources, setSources] = useState<Source[]>([]);
//   const [userslist, setUsers] = useState<User[]>([]);
//   const [subStageList, setSubStageList] = useState([]);
//   const [stageList, setStageList] = useState([]);
//   const [refreshTrigger, setRefeshTrigger] = useState(0);

//   const [error, setError] = useState('');
//   const [statusMap, setStatusMap] = useState<any>({});

//   // UNIQUE FILTER LISTS
//   const users = Array.from(
//     new Set(leads.map((l) => l.assigned_to).filter(Boolean)),
//   );
//   const sources = Array.from(
//     new Set(leads.map((l) => l.source_name).filter(Boolean)),
//   );
//   const stages = Array.from(
//     new Set(leads.map((l) => l.stage_name).filter(Boolean)),
//   );

//   // FETCH DATA
//   const fetchLeads = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/rawdata/active`, {
//         withCredentials: true,
//       });
//       setLeads(res.data.filter((l: any) => l.lead_status === 'Active') || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, [refreshTrigger]);

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

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}api/users`);

//         // console.log('Users response:', res.data);

//         setUsers(res.data || []);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const loadStages = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/leadstages`, {
//         withCredentials: true,
//       });

//       const stages = Array.isArray(res.data.data) ? res.data.data : [];

//       setStageList(stages);

//       const map: any = {};
//       stages.forEach((stage: any) => {
//         if (stage?.stage_id && stage?.stage_name) {
//           map[stage.stage_id] = stage.stage_name;
//         }
//       });
//       setStatusMap(map);
//     } catch (error) {
//       console.error('Error fetching stages:', error);
//     }
//   };

//   useEffect(() => {
//     loadStages();
//   }, []);

//   const fetchSubStagesByStage = async (stageId: string | number) => {
//     if (!stageId) {
//       setSubStageList([]);
//       return;
//     }

//     try {
//       const res = await axios.get(`${BASE_URL}api/lead-sub-stages/${stageId}`, {
//         withCredentials: true,
//       });
//       setSubStageList(res.data.sub_stages || []);
//     } catch (err) {
//       console.error('Error fetching sub-stages:', err);
//     }
//   };

//   // FILTER LOGIC
//   const filteredData = leads.filter((lead) => {
//     const term = searchTerm.toLowerCase();
//     const createdDate = lead.created_at
//       ? new Date(lead.created_at).toISOString().split('T')[0]
//       : null;

//     return (
//       (lead.name?.toLowerCase().includes(term) ||
//         lead.assigned_to?.toLowerCase().includes(term) ||
//         lead.source_name?.toLowerCase().includes(term) ||
//         lead.stage_name?.toLowerCase().includes(term)) &&
//       (!selectedUser || lead.assigned_to === selectedUser) &&
//       (!selectedSource || lead.source_name === selectedSource) &&
//       (!selectedStage || lead.stage_name === selectedStage) &&
//       (!fromDate || (createdDate && createdDate >= fromDate)) &&
//       (!toDate || (createdDate && createdDate <= toDate))
//     );
//   });

//   // PAGINATION
//   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedData = filteredData.slice(
//     startIndex,
//     startIndex + ITEMS_PER_PAGE,
//   );

//   const paginate = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [
//     searchTerm,
//     selectedUser,
//     selectedSource,
//     selectedStage,
//     fromDate,
//     toDate,
//   ]);

//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Active Leads" />

//       {/* SEARCH */}
//       {/* ================= FILTERS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
//         {/* Search */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Search</label>
//           <input
//             type="text"
//             placeholder="Search by name..."
//             className="w-full p-2 border border-gray-300 rounded"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>

//         {/* User / Telecaller */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Filter by Telecaller
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded"
//             value={selectedUser}
//             onChange={(e) => {
//               setSelectedUser(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="">All Telecallers</option>
//             {users.map((u, idx) => (
//               <option key={idx} value={u}>
//                 {u}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Source */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Filter by Source
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded"
//             value={selectedSource}
//             onChange={(e) => {
//               setSelectedSource(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="">All Sources</option>
//             {sources.map((s, idx) => (
//               <option key={idx} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Stage */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Filter by Lead Stage
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded"
//             value={selectedStage}
//             onChange={(e) => {
//               setSelectedStage(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="">All Lead Stages</option>
//             {stages.map((s, idx) => (
//               <option key={idx} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* ================= DATE + CLEAR ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-end">
//         {/* From Date */}
//         <div>
//           <label className="block text-sm font-medium mb-1">From Date</label>
//           <input
//             type="date"
//             className="w-full p-2 border border-gray-300 rounded"
//             value={fromDate}
//             max={toDate || undefined}
//             onChange={(e) => {
//               setFromDate(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>

//         {/* To Date */}
//         <div>
//           <label className="block text-sm font-medium mb-1">To Date</label>
//           <input
//             type="date"
//             className="w-full p-2 border border-gray-300 rounded"
//             value={toDate}
//             min={fromDate || undefined}
//             onChange={(e) => {
//               setToDate(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>

//         {/* Clear All */}
//         <button
//           onClick={() => {
//             setSearchTerm('');
//             setSelectedUser('');
//             setSelectedSource('');
//             setSelectedStage('');
//             setFromDate('');
//             setToDate('');
//             setCurrentPage(1);
//           }}
//           className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto rounded border bg-white shadow">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="py-3 px-4">#</th>
//               <th className="py-3 px-4">Name</th>
//               <th className="py-3 px-4">Contact</th>
//               <th className="py-3 px-4">Source</th>
//               <th className="py-3 px-4">Assign</th>
//               <th className="py-3 px-4">Stage</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.length ? (
//               paginatedData.map((lead, idx) => (
//                 <tr key={lead.master_id}>
//                   <td className="border-b px-4 py-2">{startIndex + idx + 1}</td>
//                   <td className="border-b px-4 py-2">{lead.name}</td>
//                   <td className="border-b px-4 py-2">
//                     {lead.number?.replace(/[`-]/g, '').replace(/^91/, '') ||
//                       'NA'}
//                   </td>
//                   <td className="border-b px-4 py-2">{lead.source_name}</td>
//                   <td className="border-b px-4 py-2">{lead.assigned_to}</td>
//                   <td className="border-b px-4 py-2">{lead.stage_name}</td>
//                   <td className="border-b px-4 py-2 flex gap-2">
//                     <button
//                       onClick={() => {
//                         setEditData(lead);
//                         setEditModalOpen(true);
//                       }}
//                       className="bg-meta-3 py-1 px-3 rounded text-white"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSelectedLeadId(lead.master_id);
//                         setShowLogs(true);
//                       }}
//                       className="bg-orange-500 py-1 px-3 rounded text-white"
//                     >
//                       <FaHistory />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="text-center py-4 text-gray-500">
//                   No Active Leads Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <div className="flex items-center justify-between px-6 py-4 border-t mt-6">
//         <div className="text-sm text-gray-600">
//           Showing {filteredData.length === 0 ? 0 : startIndex + 1} to{' '}
//           {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{' '}
//           {filteredData.length} results
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => paginate(1)}
//             disabled={currentPage === 1}
//             className="p-2 border rounded disabled:opacity-50"
//           >
//             «
//           </button>
//           <button
//             onClick={() => paginate(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="p-2 border rounded disabled:opacity-50"
//           >
//             ‹
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => paginate(page)}
//               className={`px-3 py-1.5 border rounded ${
//                 currentPage === page
//                   ? 'bg-blue-600 text-white'
//                   : 'hover:bg-gray-100'
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//           <button
//             onClick={() => paginate(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded disabled:opacity-50"
//           >
//             ›
//           </button>
//           <button
//             onClick={() => paginate(totalPages)}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded disabled:opacity-50"
//           >
//             »
//           </button>
//         </div>
//       </div>

//       {/* MODALS */}
//       {showLogs && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-999 overflow-y-auto">
//           <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto dark:border-strokedark dark:bg-boxdark ml-20">
//             {/* CHILD COMPONENT */}
//             <LeadDetailsPage
//               masterId={selectedLeadId}
//               onBack={() => setShowLogs(false)}
//             />
//           </div>
//         </div>
//       )}
//       {/* UpdateActiveLeads modal */}
//       <UpdateActiveLeads
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         leadData={editData}
//         categories={categories}
//         references={references}
//         areaList={area}
//         sources={sources}
//         users={userslist}
//         stageList={stageList}
//         subStageList={subStageList}
//         setRefeshTrigger={setRefeshTrigger}
//       />
//     </div>
//   );
// };

// export default ActiveLeads;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { FaEdit, FaHistory } from 'react-icons/fa';
import UpdateActiveLeads from './UpdateActiveLeads.js';
import LeadDetailsPage from './LeadDetailsPage.js';
import { XCircle, ArrowRightLeft } from 'lucide-react';
import TransferLeadsPopup from './TransferLeadsPopup.js';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

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

interface Product {
  product_id: number;
  product_name: string;
}

interface Source {
  source_id: number;
  source_name: string;
}

interface User {
  user_id: number;
  name: string;
}

const ITEMS_PER_PAGE = 25;

const ActiveLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  // FILTERS
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [openSourceDropdown, setOpenSourceDropdown] = useState(false);
  const [openStageDropdown, setOpenStageDropdown] = useState(false);

  const userRef = useRef<HTMLDivElement | null>(null);
  const sourceRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [modifiedDate, setModifiedDate] = useState('');
  // APPLIED FILTERS (NEW)
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    selectedUser: selectedUsers,
    selectedSource: selectedSources,
    selectedStage: selectedStages,
    fromDate: '',
    toDate: '',
    modifiedDate: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  // const [sources, setSources] = useState<Source[]>([]);
  const [userslist, setUsers] = useState<User[]>([]);
  const [subStageList, setSubStageList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [refreshTrigger, setRefeshTrigger] = useState(0);
  const [error, setError] = useState('');
  const [statusMap, setStatusMap] = useState<any>({});
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);
  const [showAssignPopup, setShowAssignPopup] = useState(false);

  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;

      if (userRef.current && !userRef.current.contains(t))
        setOpenUserDropdown(false);

      if (sourceRef.current && !sourceRef.current.contains(t))
        setOpenSourceDropdown(false);

      if (stageRef.current && !stageRef.current.contains(t))
        setOpenStageDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}auth/get-role`, { withCredentials: true })
      .then((res) => setUserRole(res.data.role));
  }, []);

  // UNIQUE FILTER LISTS
  const users = Array.from(
    new Set(leads.map((l) => l.assigned_to).filter(Boolean)),
  );
  const sources = Array.from(
    new Set(leads.map((l) => l.source_name).filter(Boolean)),
  );
  const stages = Array.from(
    new Set(leads.map((l) => l.stage_name).filter(Boolean)),
  );

  // FETCH DATA
  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/rawdata/active`, {
        withCredentials: true,
      });
      setLeads(res.data.filter((l: any) => l.lead_status === 'Active') || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshTrigger]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/users`);

        // console.log('Users response:', res.data);

        setUsers(res.data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const loadStages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/leadstages`, {
        withCredentials: true,
      });

      const stages = Array.isArray(res.data.data) ? res.data.data : [];

      setStageList(stages);

      const map: any = {};
      stages.forEach((stage: any) => {
        if (stage?.stage_id && stage?.stage_name) {
          map[stage.stage_id] = stage.stage_name;
        }
      });
      setStatusMap(map);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  useEffect(() => {
    loadStages();
  }, []);

  const fetchSubStagesByStage = async (stageId: string | number) => {
    if (!stageId) {
      setSubStageList([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}api/lead-sub-stages/${stageId}`, {
        withCredentials: true,
      });
      setSubStageList(res.data.sub_stages || []);
    } catch (err) {
      console.error('Error fetching sub-stages:', err);
    }
  };

  const normalizeNumber = (value: string = '') =>
    value.replace(/[^0-9]/g, '').replace(/^91/, '');

  const handleApplyFilters = () => {
    setAppliedFilters({
      searchTerm,
      selectedUser: selectedUsers,
      selectedSource: selectedSources,
      selectedStage: selectedStages,
      fromDate,
      toDate,
      modifiedDate,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedUsers([]);
    setSelectedSources([]);
    setSelectedStages([]);
    setFromDate('');
    setToDate('');
    setModifiedDate('');

    setAppliedFilters({
      searchTerm: '',
      selectedUser: [],
      selectedSource: [],
      selectedStage: [],
      fromDate: '',
      toDate: '',
      modifiedDate: '',
    });

    setCurrentPage(1);
  };

  const filteredData = leads.filter((lead) => {
    const term = appliedFilters.searchTerm.toLowerCase();
    const numberTerm = normalizeNumber(appliedFilters.searchTerm);

    const createdDate = lead.created_at
      ? new Date(lead.created_at).toISOString().split('T')[0]
      : null;

    const modified = lead.last_modified_date
      ? lead.last_modified_date.split('T')[0]
      : null;

    return (
      (lead.name?.toLowerCase().includes(term) ||
        (lead.number && normalizeNumber(lead.number).includes(numberTerm)) ||
        lead.assigned_to?.toLowerCase().includes(term) ||
        lead.source_name?.toLowerCase().includes(term) ||
        lead.stage_name?.toLowerCase().includes(term)) &&
      (!appliedFilters.selectedUser.length ||
        appliedFilters.selectedUser.includes(lead.assigned_to)) &&
      (!appliedFilters.selectedSource.length ||
        appliedFilters.selectedSource.includes(lead.source_name)) &&
      (!appliedFilters.selectedStage.length ||
        appliedFilters.selectedStage.includes(lead.stage_name)) &&
      (!appliedFilters.fromDate ||
        (createdDate && createdDate >= appliedFilters.fromDate)) &&
      (!appliedFilters.toDate ||
        (createdDate && createdDate <= appliedFilters.toDate)) &&
      (!appliedFilters.modifiedDate || modified === appliedFilters.modifiedDate)
    );
  });

  const PAGE_WINDOW = 5;

  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
    let end = start + PAGE_WINDOW - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - PAGE_WINDOW + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const paginate = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const toggleLead = (id: number) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedData.map((l) => Number(l.master_id));

    const allSelectedOnPage = pageIds.every((id) =>
      selectedLeadIds.includes(id),
    );

    if (allSelectedOnPage) {
      // ❌ unselect only current page
      setSelectedLeadIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      // ✅ select current page (keep previous selections)
      setSelectedLeadIds((prev) => [
        ...prev,
        ...pageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'NA';

    const d = new Date(dateString);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatToIST = (utcDate) => {
    if (!utcDate) return 'NA';

    return new Date(utcDate).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb pageName="Active Leads" />

        <div className="flex items-center gap-3">
          {/* Selected Count */}
          {selectedLeadIds.length > 0 && (
            <div className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
              Selected: {selectedLeadIds.length}
            </div>
          )}

          {/* Total / Showing */}
          <div className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full">
            Total: {leads.length} | Showing: {filteredData.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 items-end">
        {/* SEARCH */}
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by Student name, number..."
            className="w-full p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* TELECALLER */}
        {userRole !== 'tele-caller' && (
          <div className="relative" ref={userRef}>
            <label className="block text-sm font-medium mb-1">
              Filter by Telecaller
            </label>

            <div
              onClick={() => setOpenUserDropdown((p) => !p)}
              className="w-full p-2 border border-gray-300 rounded bg-white cursor-pointer flex justify-between items-center"
            >
              <span className="text-sm">
                {selectedUsers.length === 0
                  ? 'All Telecallers'
                  : `${selectedUsers.length} Selected`}
              </span>
              <span className="text-gray-500">▼</span>
            </div>

            {openUserDropdown && (
              <div className="absolute z-30 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                <label className="flex items-center gap-2 px-3 py-2 border-b cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === 0}
                    onChange={() => {
                      setSelectedUsers([]);
                      setCurrentPage(1);
                    }}
                  />
                  <span className="font-semibold text-sm">All Telecallers</span>
                </label>

                {users.map((u, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u)}
                      onChange={() => {
                        setSelectedUsers((prev) =>
                          prev.includes(u)
                            ? prev.filter((x) => x !== u)
                            : [...prev, u],
                        );
                        setCurrentPage(1);
                      }}
                    />
                    <span className="text-sm">{u}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SOURCE */}
        <div className="relative" ref={sourceRef}>
          <label className="block text-sm font-medium mb-1">
            Filter by Source
          </label>

          <div
            onClick={() => setOpenSourceDropdown((p) => !p)}
            className="w-full p-2 border border-gray-300 rounded bg-white cursor-pointer flex justify-between items-center"
          >
            <span className="text-sm">
              {selectedSources.length === 0
                ? 'All Sources'
                : `${selectedSources.length} Selected`}
            </span>
            <span className="text-gray-500">▼</span>
          </div>

          {openSourceDropdown && (
            <div className="absolute z-30 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
              <label className="flex items-center gap-2 px-3 py-2 border-b cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSources.length === 0}
                  onChange={() => {
                    setSelectedSources([]);
                    setCurrentPage(1);
                  }}
                />
                <span className="font-semibold text-sm">All Sources</span>
              </label>

              {sources.map((s, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(s)}
                    onChange={() => {
                      setSelectedSources((prev) =>
                        prev.includes(s)
                          ? prev.filter((x) => x !== s)
                          : [...prev, s],
                      );
                      setCurrentPage(1);
                    }}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* STAGE */}
        <div className="relative" ref={stageRef}>
          <label className="block text-sm font-medium mb-1">
            Filter by Lead Stage
          </label>

          <div
            onClick={() => setOpenStageDropdown((p) => !p)}
            className="w-full p-2 border border-gray-300 rounded bg-white cursor-pointer flex justify-between items-center"
          >
            <span className="text-sm">
              {selectedStages.length === 0
                ? 'All Lead Stages'
                : `${selectedStages.length} Selected`}
            </span>
            <span className="text-gray-500">▼</span>
          </div>

          {openStageDropdown && (
            <div className="absolute z-30 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
              <label className="flex items-center gap-2 px-3 py-2 border-b cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStages.length === 0}
                  onChange={() => {
                    setSelectedStages([]);
                    setCurrentPage(1);
                  }}
                />
                <span className="font-semibold text-sm">All Lead Stages</span>
              </label>

              {stages.map((s, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStages.includes(s)}
                    onChange={() => {
                      setSelectedStages((prev) =>
                        prev.includes(s)
                          ? prev.filter((x) => x !== s)
                          : [...prev, s],
                      );
                      setCurrentPage(1);
                    }}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* FROM DATE */}
        <div className="w-full sm:w-[180px]">
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* TO DATE */}
        <div className="w-full sm:w-[180px]">
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 sm:ml-auto flex-wrap">
          {userRole !== 'tele-caller' && (
            <button
              onClick={() => setShowAssignPopup(true)}
              disabled={selectedLeadIds.length === 0}
              className={`px-4 py-2 rounded flex items-center gap-2 transition
        ${
          selectedLeadIds.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
            >
              <ArrowRightLeft size={18} />
              Transfer Leads
            </button>
          )}
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply Filters
          </button>

          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {/* Select All */}
              <th className="py-4 px-4 text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((l) =>
                      selectedLeadIds.includes(Number(l.master_id)),
                    )
                  }
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="py-4 px-4 text-black dark:text-white">Name</th>
              <th className="py-4 px-4 text-black dark:text-white">Contact</th>
              <th className="py-4 px-4 text-black dark:text-white">Source</th>
              <th className="py-4 px-4 text-black dark:text-white">Assigned</th>
              <th className="py-4 px-4 text-black dark:text-white">Stage</th>
              <th className="py-4 px-4 text-black dark:text-white">
                Sub Stage
              </th>
              <th className="py-4 px-4 text-black dark:text-white">Date</th>
              <th className="py-4 px-4 text-black dark:text-white">
                Last Modified
              </th>
              <th className="py-4 px-4 text-black dark:text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length ? (
              paginatedData.map((lead) => (
                <tr key={lead.master_id}>
                  {/* Row Checkbox */}
                  <td className="border-b py-3 px-4 dark:border-strokedark">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(Number(lead.master_id))}
                      onChange={() => toggleLead(Number(lead.master_id))}
                    />
                  </td>

                  <td className="border-b py-3 px-4 dark:border-strokedark">
                    <Link
                      to={`/leads/${lead.master_id}`}
                      className="text-blue-600 hover:underline font-medium"
                      target="_blank"
                    >
                      {lead.name}
                    </Link>
                  </td>

                  <td className="border-b py-3 px-4 dark:border-strokedark">
                    {lead.number
                      ? (() => {
                          let digits = lead.number.replace(/[^0-9]/g, '');

                          if (digits.length === 12 && digits.startsWith('91')) {
                            digits = digits.slice(2);
                          }

                          return digits;
                        })()
                      : 'NA'}
                  </td>

                  <td className="border-b py-3 px-4 dark:border-strokedark">
                    {lead.source_name}
                  </td>

                  <td className="border-b py-3 px-4 dark:border-strokedark">
                    {lead.assigned_to || 'NA'}
                  </td>

                  <td className="border-b py-3 px-4 dark:border-strokedark">
                    {lead.stage_name || 'NA'}
                  </td>
                  <td className="border-b py-3 px-4 dark:border-strokedark">
                    {lead.lead_sub_stage_name || 'NA'}
                  </td>

                  <td className="border-b py-3 px-4 dark:border-strokedark whitespace-nowrap">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="border-b py-3 px-4 dark:border-strokedark text-sm whitespace-nowrap">
                    {formatToIST(lead.last_modified_date)}
                  </td>
                  <td className="border-b py-3 px-4 dark:border-strokedark flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await axios.get(
                            `${BASE_URL}api/lead/${lead.master_id}`,
                            { withCredentials: true },
                          );

                          console.log('FULL LEAD FOR EDIT:', res.data);

                          setEditData(res.data); // ✅ FULL DB DATA
                          setEditModalOpen(true); // ✅ open modal
                        } catch (err) {
                          console.error('Edit load failed', err);
                        }
                      }}
                      className="bg-meta-3 px-3 py-1 rounded text-white"
                    >
                      <FaEdit />
                    </button>{' '}
                    <button
                      onClick={() => {
                        setSelectedLeadId(lead.master_id);
                        setShowLogs(true);
                      }}
                      className="bg-orange-500 py-1 px-3 rounded text-white hover:bg-opacity-75"
                    >
                      <FaHistory />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No Active Leads Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t mt-6">
        {/* INFO */}
        <div className="text-sm text-gray-600">
          Showing {filteredData.length === 0 ? 0 : startIndex + 1} to{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{' '}
          {filteredData.length} results
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-end">
          {/* FIRST */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border rounded disabled:opacity-40"
          >
            «
          </button>

          {/* PREV */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border rounded disabled:opacity-40"
          >
            ‹
          </button>

          {/* PAGE NUMBERS (WINDOWED) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2),
            )
            .map((page, index, arr) => {
              const prev = arr[index - 1];

              return (
                <React.Fragment key={page}>
                  {/* DOTS */}
                  {prev && page - prev > 1 && (
                    <span className="px-2 text-gray-400">…</span>
                  )}

                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded text-sm transition
                ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'hover:bg-gray-100'
                }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          {/* NEXT */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border rounded disabled:opacity-40"
          >
            ›
          </button>

          {/* LAST */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border rounded disabled:opacity-40"
          >
            »
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-999 overflow-y-auto">
          <div className=" p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto dark:border-strokedark dark:bg-boxdark ml-20">
            {/* CHILD COMPONENT */}
            <LeadDetailsPage
              masterId={selectedLeadId}
              onBack={() => setShowLogs(false)}
            />
          </div>
        </div>
      )}

      {/* UpdateActiveLeads modal */}
      <UpdateActiveLeads
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        leadData={editData}
        categories={categories}
        references={references}
        areaList={area}
        sources={sources}
        users={userslist}
        stageList={stageList}
        subStageList={subStageList}
        setRefeshTrigger={setRefeshTrigger}
      />

      <TransferLeadsPopup
        show={showAssignPopup}
        onClose={() => setShowAssignPopup(false)}
        selectedLeadIds={selectedLeadIds}
        onSuccess={() => {
          fetchLeads();
          setSelectedLeadIds([]);
        }}
      />
    </div>
  );
};

export default ActiveLeads;
