// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaEye, FaEdit, FaHistory } from 'react-icons/fa';
// import { BASE_URL } from '../../../public/config.js';
// import LeadDetailsPage from './LeadDetailsPage.js';
// import UpdateActiveLeads from './UpdateActiveLeads.js';

// const ITEMS_PER_PAGE = 25;

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

// const InvalidLeads = () => {
//   const [invalidLeads, setInvalidLeads] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
//   const [showLogs, setShowLogs] = useState(false);

//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [references, setReferences] = useState<Reference[]>([]);
//   const [area, setArea] = useState<Area[]>([]);
//   const [sources, setSources] = useState<Source[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [subStageList, setSubStageList] = useState([]);
//   const [stageList, setStageList] = useState([]);
//   const [statusMap, setStatusMap] = useState<any>({});
//   const [error, setError] = useState('');
//   const [editData, setEditData] = useState(null);
//   const [refreshTrigger, setRefeshTrigger] = useState(0);

//   // Fetch API
//   const fetchInvalidLeads = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/getallinvalidrawdata`, {
//         withCredentials: true,
//       });
//       setInvalidLeads(res.data);
//     } catch (err) {
//       console.error('Error fetching invalid leads:', err);
//     }
//   };

//   useEffect(() => {
//     fetchInvalidLeads();
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

//   // SEARCH FILTER
//   const filteredData = invalidLeads.filter((item) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       item.name?.toLowerCase().includes(term) ||
//       item.cat_name?.toLowerCase().includes(term) ||
//       item.source_name?.toLowerCase().includes(term) ||
//       item.assigned_to?.toLowerCase().includes(term) ||
//       item.stage_name?.toLowerCase().includes(term) ||
//       item.lead_sub_stage_name?.toLowerCase().includes(term)
//     );
//   });

//   // PAGINATION
//   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const totalItems = filteredData.length;
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

//   return (
//     <div className="p-5">
//       {/* HEADER */}
//       <h2 className="text-xl font-semibold mb-4">Invalid Leads</h2>

//       {/* SEARCH */}
//       <input
//         type="text"
//         placeholder="Search by name, category, source, assigned to..."
//         className="border p-2 rounded mb-4 w-72"
//         value={searchTerm}
//         onChange={(e) => {
//           setSearchTerm(e.target.value);
//           setCurrentPage(1);
//         }}
//       />

//       {/* TABLE */}
//       <div className="overflow-x-auto rounded border border-stroke bg-white shadow">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left">
//               <th className="py-4 px-4">Sr No</th>
//               <th className="py-4 px-4">Name</th>
//               <th className="py-4 px-4">Contact</th>
//               <th className="py-4 px-4">Source</th>
//               <th className="py-4 px-4">Assigned To</th>
//               <th className="py-4 px-4">Lead Stage</th>
//               <th className="py-4 px-4">Lead Sub Stage</th>
//               <th className="py-4 px-4">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedData.length > 0 ? (
//               paginatedData.map((lead, index) => (
//                 <tr key={index}>
//                   <td className="border-b py-3 px-4">
//                     {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
//                   </td>

//                   <td className="border-b py-3 px-4">{lead.name}</td>
//                   <td className="border-b py-3 px-4">
//                     {lead.number
//                       ? lead.number
//                           .replace(/[`-]/g, '') // ` aur - remove
//                           .replace(/^91/, '') // starting 91 remove
//                       : 'NA'}
//                   </td>
//                   <td className="border-b py-3 px-4">{lead.source_name}</td>
//                   <td className="border-b py-3 px-4">{lead.assigned_to}</td>
//                   <td className="border-b py-3 px-4">{lead.stage_name}</td>
//                   <td className="border-b py-3 px-4">
//                     {lead.lead_sub_stage_name}
//                   </td>

//                   <td className="border-b py-3 px-4 flex gap-2">
//                     <div className="flex gap-3">
//                       {/* VIEW */}
//                       <button
//                         onClick={() => {
//                           setEditData(lead);
//                           setEditModalOpen(true);
//                         }}
//                         className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
//                       >
//                         <FaEdit size={16} />
//                       </button>

//                       {/* LOGS */}
//                       <button
//                         onClick={() => {
//                           setSelectedLeadId(lead.master_id);
//                           setShowLogs(true);
//                         }}
//                         className="bg-orange-500 py-1 px-3 rounded text-white"
//                       >
//                         <FaHistory size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={8}
//                   className="text-center py-4 text-gray-500 border"
//                 >
//                   No Invalid Leads Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showLogs && selectedLeadId && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-999 overflow-y-auto">
//           <div className=" p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto relative">
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

//       {/* PAGINATION */}
//       <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-strokedark mt-6">
//         {/* Left info */}
//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           Showing{' '}
//           <span className="font-medium">
//             {totalItems === 0 ? 0 : startIndex + 1}
//           </span>{' '}
//           to{' '}
//           <span className="font-medium">
//             {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
//           </span>{' '}
//           of <span className="font-medium">{totalItems}</span> results
//         </div>

//         {/* Pagination controls */}
//         <div className="flex items-center gap-2">
//           {/* First */}
//           <button
//             onClick={() => setCurrentPage(1)}
//             disabled={currentPage === 1}
//             className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//           >
//             «
//           </button>

//           {/* Prev */}
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//           >
//             ‹
//           </button>

//           {(() => {
//             const pages: (number | string)[] = [];

//             if (totalPages <= 7) {
//               for (let i = 1; i <= totalPages; i++) pages.push(i);
//             } else {
//               const left = Math.max(1, currentPage - 1);
//               const right = Math.min(totalPages, currentPage + 1);

//               pages.push(1);

//               if (left > 2) pages.push('...');

//               for (let i = left; i <= right; i++) {
//                 if (i !== 1 && i !== totalPages) pages.push(i);
//               }

//               if (right < totalPages - 1) pages.push('...');

//               pages.push(totalPages);
//             }

//             const uniquePages = pages.filter(
//               (item, index) => pages.indexOf(item) === index,
//             );

//             return uniquePages.map((page, idx) =>
//               page === '...' ? (
//                 <span key={`dots-${idx}`} className="px-2 text-gray-400">
//                   ...
//                 </span>
//               ) : (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(Number(page))}
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
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
//           >
//             ›
//           </button>

//           {/* Last */}
//           <button
//             onClick={() => setCurrentPage(totalPages)}
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

// export default InvalidLeads;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaEdit, FaHistory } from 'react-icons/fa';
// import { BASE_URL } from '../../../public/config.js';
// import LeadDetailsPage from './LeadDetailsPage.js';
// import UpdateActiveLeads from './UpdateActiveLeads.js';

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

// const InvalidLeads = () => {
//   const [invalidLeads, setInvalidLeads] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   // 🔥 FILTER STATES
//   const [selectedTelecaller, setSelectedTelecaller] = useState('');
//   const [selectedSource, setSelectedSource] = useState('');
//   const [selectedLeadStage, setSelectedLeadStage] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editData, setEditData] = useState<any>(null);
//   const [showLogs, setShowLogs] = useState(false);
//   const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
//   const [refreshTrigger, setRefeshTrigger] = useState(0);

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [references, setReferences] = useState<Reference[]>([]);
//   const [area, setArea] = useState<Area[]>([]);
//   // const [sources, setSources] = useState<Source[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [subStageList, setSubStageList] = useState([]);
//   const [stageList, setStageList] = useState([]);
//   const [error, setError] = useState('');
//   const [statusMap, setStatusMap] = useState<any>({});

//   // ---------------- FETCH DATA ----------------
//   const fetchInvalidLeads = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/getallinvalidrawdata`, {
//         withCredentials: true,
//       });
//       setInvalidLeads(res.data || []);
//     } catch (err) {
//       console.error('Error fetching invalid leads:', err);
//     }
//   };

//   useEffect(() => {
//     fetchInvalidLeads();
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

//   // ---------------- FILTER OPTIONS ----------------
//   const telecallers = invalidLeads
//     .map((l) => l.assigned_to)
//     .filter((v, i, self) => v && self.indexOf(v) === i);

//   const sources = invalidLeads
//     .map((l) => l.source_name)
//     .filter((v, i, self) => v && self.indexOf(v) === i);

//   const leadStages = invalidLeads
//     .map((l) => l.stage_name)
//     .filter((v, i, self) => v && self.indexOf(v) === i);

//   // ---------------- FILTER LOGIC ----------------
//   const filteredData = invalidLeads.filter((item) => {
//     const term = searchTerm.toLowerCase();

//     const matchesSearch =
//       item.name?.toLowerCase().includes(term) ||
//       item.source_name?.toLowerCase().includes(term) ||
//       item.assigned_to?.toLowerCase().includes(term) ||
//       item.stage_name?.toLowerCase().includes(term) ||
//       item.lead_sub_stage_name?.toLowerCase().includes(term);

//     const matchesTelecaller = selectedTelecaller
//       ? item.assigned_to === selectedTelecaller
//       : true;

//     const matchesSource = selectedSource
//       ? item.source_name === selectedSource
//       : true;

//     const matchesLeadStage = selectedLeadStage
//       ? item.stage_name === selectedLeadStage
//       : true;

//     let matchesDate = true;
//     if (fromDate && toDate && item.created_at) {
//       const createdAt = new Date(item.created_at);
//       const from = new Date(fromDate);
//       const to = new Date(toDate);
//       to.setHours(23, 59, 59, 999);
//       matchesDate = createdAt >= from && createdAt <= to;
//     }

//     return (
//       matchesSearch &&
//       matchesTelecaller &&
//       matchesSource &&
//       matchesLeadStage &&
//       matchesDate
//     );
//   });

//   // ---------------- PAGINATION ----------------
//   const totalItems = filteredData.length;
//   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

//   const paginatedData = filteredData.slice(
//     startIndex,
//     startIndex + ITEMS_PER_PAGE,
//   );

//   // ---------------- UI ----------------
//   return (
//     <div className="p-5">
//       <h2 className="text-xl font-semibold mb-4">Invalid Leads</h2>

//       {/* 🔍 FILTERS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
//         <div>
//           <label className="block text-sm font-medium mb-1">Search</label>
//           <input
//             type="text"
//             placeholder="Search by Student name..."
//             className="w-full p-2 border rounded"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Filter by Telecaller
//           </label>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedTelecaller}
//             onChange={(e) => {
//               setSelectedTelecaller(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="">All Telecallers</option>
//             {telecallers.map((t, i) => (
//               <option key={i} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Filter by Source
//           </label>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedSource}
//             onChange={(e) => {
//               setSelectedSource(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="">All Sources</option>
//             {sources.map((s, i) => (
//               <option key={i} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Filter by Lead Stage
//           </label>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedLeadStage}
//             onChange={(e) => {
//               setSelectedLeadStage(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="">All Lead Stages</option>
//             {leadStages.map((s, i) => (
//               <option key={i} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* 📅 DATE FILTER */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-end">
//         <div>
//           <label className="block text-sm font-medium mb-1">From Date</label>
//           <input
//             type="date"
//             className="w-full p-2 border rounded"
//             value={fromDate}
//             onChange={(e) => {
//               setFromDate(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">To Date</label>
//           <input
//             type="date"
//             className="w-full p-2 border rounded"
//             value={toDate}
//             onChange={(e) => {
//               setToDate(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//         <button
//           className="mt-6 w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//           onClick={() => {
//             setFromDate('');
//             setToDate('');
//             setCurrentPage(1);
//           }}
//         >
//           Clear Dates
//         </button>
//       </div>

//       {/* 🧾 TABLE */}
//       <div className="overflow-x-auto rounded border bg-white shadow">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left">
//               <th className="py-4 px-4">#</th>
//               <th className="py-4 px-4">Name</th>
//               <th className="py-4 px-4">Contact</th>
//               <th className="py-4 px-4">Source</th>
//               <th className="py-4 px-4">Assigned</th>
//               <th className="py-4 px-4">Stage</th>
//               <th className="py-4 px-4">Sub Stage</th>
//               <th className="py-4 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.length ? (
//               paginatedData.map((lead, index) => (
//                 <tr key={lead.master_id}>
//                   <td className="border-b py-3 px-4">
//                     {startIndex + index + 1}
//                   </td>
//                   <td className="border-b py-3 px-4">{lead.name}</td>
//                   <td className="border-b py-3 px-4">
//                     {lead.number?.replace(/[`-]/g, '').replace(/^91/, '') ||
//                       'NA'}
//                   </td>
//                   <td className="border-b py-3 px-4">{lead.source_name}</td>
//                   <td className="border-b py-3 px-4">{lead.assigned_to}</td>
//                   <td className="border-b py-3 px-4">{lead.stage_name}</td>
//                   <td className="border-b py-3 px-4">
//                     {lead.lead_sub_stage_name}
//                   </td>
//                   <td className="border-b py-3 px-4 flex gap-2">
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
//                 <td colSpan={8} className="text-center py-6 text-gray-500">
//                   No Invalid Leads Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 🔢 PAGINATION */}
//       <div className="flex items-center justify-between px-6 py-4 border-t mt-6">
//         <div className="text-sm text-gray-600">
//           Showing{' '}
//           <span className="font-medium">
//             {totalItems === 0 ? 0 : startIndex + 1}
//           </span>{' '}
//           to{' '}
//           <span className="font-medium">
//             {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
//           </span>{' '}
//           of <span className="font-medium">{totalItems}</span> results
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setCurrentPage(1)}
//             disabled={currentPage === 1}
//             className="p-2 border rounded disabled:opacity-50"
//           >
//             «
//           </button>
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className="p-2 border rounded disabled:opacity-50"
//           >
//             ‹
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .slice(
//               Math.max(0, currentPage - 3),
//               Math.min(totalPages, currentPage + 2),
//             )
//             .map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`px-3 py-1.5 border rounded ${
//                   currentPage === page
//                     ? 'bg-blue-600 text-white'
//                     : 'hover:bg-gray-100'
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//           <button
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded disabled:opacity-50"
//           >
//             ›
//           </button>
//           <button
//             onClick={() => setCurrentPage(totalPages)}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded disabled:opacity-50"
//           >
//             »
//           </button>
//         </div>
//       </div>

//       {showLogs && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-999 overflow-y-auto">
//           <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto dark:border-strokedark dark:bg-boxdark ml-20">
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
//     </div>
//   );
// };

// export default InvalidLeads;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaHistory } from 'react-icons/fa';
import { BASE_URL } from '../../../public/config.js';
import LeadDetailsPage from './LeadDetailsPage.js';
import UpdateActiveLeads from './UpdateActiveLeads.js';
import { useRef } from 'react';

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

const InvalidLeads = () => {
  const [invalidLeads, setInvalidLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 🔥 FILTER STATES
  const [selectedTelecallers, setSelectedTelecallers] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedLeadStages, setSelectedLeadStages] = useState<string[]>([]);

  const [openTelecallerDropdown, setOpenTelecallerDropdown] = useState(false);
  const [openSourceDropdown, setOpenSourceDropdown] = useState(false);
  const [openStageDropdown, setOpenStageDropdown] = useState(false);

  const telecallerRef = useRef<HTMLDivElement | null>(null);
  const sourceRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    selectedTelecallers: [] as string[],
    selectedSources: [] as string[],
    selectedLeadStages: [] as string[],
    fromDate: '',
    toDate: '',
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [refreshTrigger, setRefeshTrigger] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  // const [sources, setSources] = useState<Source[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subStageList, setSubStageList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [error, setError] = useState('');
  const [statusMap, setStatusMap] = useState<any>({});
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    axios
      .get(`${BASE_URL}auth/get-role`, { withCredentials: true })
      .then((res) => setUserRole(res.data.role));
  }, []);

  // ---------------- FETCH DATA ----------------

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;

      if (telecallerRef.current && !telecallerRef.current.contains(t))
        setOpenTelecallerDropdown(false);

      if (sourceRef.current && !sourceRef.current.contains(t))
        setOpenSourceDropdown(false);

      if (stageRef.current && !stageRef.current.contains(t))
        setOpenStageDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchInvalidLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/getallinvalidrawdata`, {
        withCredentials: true,
      });
      setInvalidLeads(res.data || []);
    } catch (err) {
      console.error('Error fetching invalid leads:', err);
    }
  };

  useEffect(() => {
    fetchInvalidLeads();
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

  // ---------------- FILTER OPTIONS ----------------
  const telecallers = invalidLeads
    .map((l) => l.assigned_to)
    .filter((v, i, self) => v && self.indexOf(v) === i);

  const sources = invalidLeads
    .map((l) => l.source_name)
    .filter((v, i, self) => v && self.indexOf(v) === i);

  const leadStages = invalidLeads
    .map((l) => l.stage_name)
    .filter((v, i, self) => v && self.indexOf(v) === i);

  // ---------------- FILTER LOGIC ----------------

  const normalizeNumber = (value: string = '') =>
    value.replace(/[^0-9]/g, '').replace(/^91/, '');

  const filteredData = invalidLeads.filter((item) => {
    const term = appliedFilters.searchTerm.toLowerCase();
    const numberTerm = normalizeNumber(appliedFilters.searchTerm);

    const matchesSearch =
      item.name?.toLowerCase().includes(term) ||
      item.source_name?.toLowerCase().includes(term) ||
      (item.number && normalizeNumber(item.number).includes(numberTerm)) ||
      item.assigned_to?.toLowerCase().includes(term) ||
      item.stage_name?.toLowerCase().includes(term) ||
      item.lead_sub_stage_name?.toLowerCase().includes(term);

    const matchesTelecaller =
      appliedFilters.selectedTelecallers.length === 0 ||
      appliedFilters.selectedTelecallers.includes(item.assigned_to);

    const matchesSource =
      appliedFilters.selectedSources.length === 0 ||
      appliedFilters.selectedSources.includes(item.source_name);

    const matchesStage =
      appliedFilters.selectedLeadStages.length === 0 ||
      appliedFilters.selectedLeadStages.includes(item.stage_name);

    let matchesDate = true;
    if (appliedFilters.fromDate && appliedFilters.toDate && item.created_at) {
      const createdAt = new Date(item.created_at);
      const from = new Date(appliedFilters.fromDate);
      const to = new Date(appliedFilters.toDate);
      to.setHours(23, 59, 59, 999);
      matchesDate = createdAt >= from && createdAt <= to;
    }

    return (
      matchesSearch &&
      matchesTelecaller &&
      matchesSource &&
      matchesStage &&
      matchesDate
    );
  });

  // ---------------- PAGINATION ----------------
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleApplyFilters = () => {
    setAppliedFilters({
      searchTerm,
      selectedTelecallers,
      selectedSources,
      selectedLeadStages,
      fromDate,
      toDate,
    });
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedTelecallers([]);
    setSelectedSources([]);
    setSelectedLeadStages([]);
    setFromDate('');
    setToDate('');

    setAppliedFilters({
      searchTerm: '',
      selectedTelecallers: [],
      selectedSources: [],
      selectedLeadStages: [],
      fromDate: '',
      toDate: '',
    });

    setCurrentPage(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'NA';

    const d = new Date(dateString);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  // ---------------- UI ----------------
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Invalid Leads</h2>

        {/* RIGHT SIDE COUNT */}
        <div className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full">
          Total: {invalidLeads.length} | Showing: {filteredData.length}
        </div>
      </div>

      {/* 🔍 FILTERS */}
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
          <div className="relative" ref={telecallerRef}>
            <label className="block text-sm font-medium mb-1">
              Filter by Telecaller
            </label>

            <div
              onClick={() => setOpenTelecallerDropdown((p) => !p)}
              className="w-full p-2 border border-gray-300 rounded bg-white cursor-pointer flex justify-between items-center"
            >
              <span className="text-sm">
                {selectedTelecallers.length === 0
                  ? 'All Telecallers'
                  : `${selectedTelecallers.length} Selected`}
              </span>
              <span className="text-gray-500">▼</span>
            </div>

            {openTelecallerDropdown && (
              <div className="absolute z-30 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                <label className="flex items-center gap-2 px-3 py-2 border-b cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTelecallers.length === 0}
                    onChange={() => {
                      setSelectedTelecallers([]);
                      setCurrentPage(1);
                    }}
                  />
                  <span className="font-semibold text-sm">All Telecallers</span>
                </label>

                {telecallers.map((t, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTelecallers.includes(t)}
                      onChange={() => {
                        setSelectedTelecallers((prev) =>
                          prev.includes(t)
                            ? prev.filter((x) => x !== t)
                            : [...prev, t],
                        );
                        setCurrentPage(1);
                      }}
                    />
                    <span className="text-sm">{t}</span>
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
              {selectedLeadStages.length === 0
                ? 'All Lead Stages'
                : `${selectedLeadStages.length} Selected`}
            </span>
            <span className="text-gray-500">▼</span>
          </div>

          {openStageDropdown && (
            <div className="absolute z-30 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
              <label className="flex items-center gap-2 px-3 py-2 border-b cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLeadStages.length === 0}
                  onChange={() => {
                    setSelectedLeadStages([]);
                    setCurrentPage(1);
                  }}
                />
                <span className="font-semibold text-sm">All Lead Stages</span>
              </label>

              {leadStages.map((s, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedLeadStages.includes(s)}
                    onChange={() => {
                      setSelectedLeadStages((prev) =>
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

      {/* 📅 DATE FILTER */}
      <div className="mt-4 mb-6 flex flex-wrap items-end gap-4">
        {/* FROM DATE */}
        <div className="w-full sm:w-[180px]">
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* TO DATE */}
        <div className="w-full sm:w-[180px]">
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 sm:ml-auto">
          <button
            onClick={handleApplyFilters}
            className="h-[40px] px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply Filters
          </button>

          <button
            onClick={handleClearAll}
            className="h-[40px] px-4 bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* 🧾 TABLE */}
      <div className="overflow-x-auto rounded border bg-white shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="py-4 px-4">#</th>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Contact</th>
              <th className="py-4 px-4">Source</th>
              <th className="py-4 px-4">Assigned</th>
              <th className="py-4 px-4">Stage</th>
              <th className="py-4 px-4">Sub Stage</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length ? (
              paginatedData.map((lead, index) => (
                <tr key={lead.master_id}>
                  <td className="border-b py-3 px-4">
                    {startIndex + index + 1}
                  </td>
                  <td className="border-b py-3 px-4">{lead.name}</td>
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

                  <td className="border-b py-3 px-4">{lead.source_name}</td>
                  <td className="border-b py-3 px-4">{lead.assigned_to}</td>
                  <td className="border-b py-3 px-4">{lead.stage_name}</td>
                  <td className="border-b py-3 px-4">
                    {lead.lead_sub_stage_name}
                  </td>
                  <td className="border-b py-3 px-4">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="border-b py-3 px-4 flex gap-2">
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
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLeadId(lead.master_id);
                        setShowLogs(true);
                      }}
                      className="bg-orange-500 py-1 px-3 rounded text-white"
                    >
                      <FaHistory />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No Invalid Leads Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 border-t mt-6">
        <div className="text-sm text-gray-600">
          Showing{' '}
          <span className="font-medium">
            {totalItems === 0 ? 0 : startIndex + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
          </span>{' '}
          of <span className="font-medium">{totalItems}</span> results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 border rounded disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded disabled:opacity-50"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2),
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border rounded disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>

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
        users={users}
        stageList={stageList}
        subStageList={subStageList}
        setRefeshTrigger={setRefeshTrigger}
      />
    </div>
  );
};

export default InvalidLeads;
