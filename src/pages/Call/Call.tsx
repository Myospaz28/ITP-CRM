// import React, { useEffect, useState } from 'react';
// import { BASE_URL } from '../../../public/config.js';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faPhone } from '@fortawesome/free-solid-svg-icons';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
// import axios from 'axios';
// import EditTeleCallerForm from './EditCall.js';
// import UpdateRawData from '../Rawdata/UpdateRawData.js';

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

// const CallList = () => {
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [filterFromDate, setFilterFromDate] = useState('');
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [editingClient, setEditingClient] = useState(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [references, setReferences] = useState<Reference[]>([]);
//   const [area, setArea] = useState<Area[]>([]);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedTelecaller, setSelectedTelecaller] = useState('');
//   const [selectedSource, setSelectedSource] = useState('');
//   const [selectedLeadStage, setSelectedLeadStage] = useState('');

//   const fetchTaleCallerData = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/combined-rawdata`, {
//         withCredentials: true,
//       });

//       const uniqueClientsMap = new Map();
//       response.data.forEach((client) => {
//         if (!uniqueClientsMap.has(client.master_id)) {
//           uniqueClientsMap.set(client.master_id, client);
//         }
//       });
//       const uniqueClients = Array.from(uniqueClientsMap.values());

//       setClients(uniqueClients);
//       setFilteredClients(uniqueClients);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchTaleCallerData();
//   }, []);

//   // useEffect(() => {
//   //   if (!isValidDateRange()) {
//   //     setFilteredClients([]);
//   //     return;
//   //   }

//   //   const lowerSearch = searchTerm.toLowerCase();

//   //   const filtered = clients.filter((client) => {
//   //     // 🔍 Search filter
//   //     const clientName = client.name?.toLowerCase() || '';
//   //     const categoryName = client.category?.toLowerCase() || '';
//   //     const assignIdStr = client.assign_id?.toString() || '';
//   //     const masterIdStr = client.master_id?.toString() || '';

//   //     const matchesSearch =
//   //       clientName.includes(lowerSearch) ||
//   //       categoryName.includes(lowerSearch) ||
//   //       assignIdStr.includes(lowerSearch) ||
//   //       masterIdStr.includes(lowerSearch);

//   //     // 👤 Telecaller filter
//   //     const matchesTelecaller = selectedTelecaller
//   //       ? client.assigned_to === selectedTelecaller
//   //       : true;

//   //     const matchesSource = selectedSource
//   //       ? client.source_name === selectedSource
//   //       : true;

//   //     const matchesLeadStage = selectedLeadStage
//   //       ? client.stage_name === selectedLeadStage
//   //       : true;

//   //     // 📅 Date filter (created_at)
//   //     let matchesDate = true;
//   //     if (fromDate && toDate && client.created_at) {
//   //       const createdAt = new Date(client.created_at);
//   //       const from = new Date(fromDate);
//   //       const to = new Date(toDate);

//   //       // include full "to date"
//   //       to.setHours(23, 59, 59, 999);

//   //       matchesDate = createdAt >= from && createdAt <= to;
//   //     }

//   //     return (
//   //       matchesSearch &&
//   //       matchesTelecaller &&
//   //       matchesSource &&
//   //       matchesLeadStage &&
//   //       matchesDate
//   //     );
//   //   });

//   //   setFilteredClients(filtered);
//   //   setCurrentPage(1);
//   // }, [searchTerm, selectedTelecaller, fromDate, toDate, clients]);

//   useEffect(() => {
//     if (!isValidDateRange()) {
//       setFilteredClients([]);
//       return;
//     }

//     const lowerSearch = searchTerm.toLowerCase();

//     const filtered = clients.filter((client) => {
//       // 🔍 Search
//       const clientName = client.name?.toLowerCase() || '';
//       const categoryName = client.category?.toLowerCase() || '';
//       const assignIdStr = client.assign_id?.toString() || '';
//       const masterIdStr = client.master_id?.toString() || '';

//       const matchesSearch =
//         clientName.includes(lowerSearch) ||
//         categoryName.includes(lowerSearch) ||
//         assignIdStr.includes(lowerSearch) ||
//         masterIdStr.includes(lowerSearch);

//       // 👤 Telecaller
//       const matchesTelecaller = selectedTelecaller
//         ? client.assigned_to === selectedTelecaller
//         : true;

//       // 📌 Source
//       const matchesSource = selectedSource
//         ? client.source_name === selectedSource
//         : true;

//       // 🚦 Lead Stage
//       const matchesLeadStage = selectedLeadStage
//         ? client.stage_name === selectedLeadStage
//         : true;

//       // 📅 Date
//       let matchesDate = true;
//       if (fromDate && toDate && client.created_at) {
//         const createdAt = new Date(client.created_at);
//         const from = new Date(fromDate);
//         const to = new Date(toDate);
//         to.setHours(23, 59, 59, 999);

//         matchesDate = createdAt >= from && createdAt <= to;
//       }

//       return (
//         matchesSearch &&
//         matchesTelecaller &&
//         matchesSource &&
//         matchesLeadStage &&
//         matchesDate
//       );
//     });

//     setFilteredClients(filtered);
//     setCurrentPage(1);
//   }, [
//     searchTerm,
//     selectedTelecaller,
//     selectedSource, // ✅ MISSING THA
//     selectedLeadStage, // ✅ MISSING THA
//     fromDate,
//     toDate,
//     clients,
//   ]);

//   const handleEdit = (client) => {
//     setSelectedClient({
//       ...client,
//       master_id: client.master_id,
//       cat_id: client.cat_id,
//     });
//     setIsModalOpen(true);
//   };

//   const handleModalClose = (refresh = false) => {
//     setIsModalOpen(false);
//     setSelectedClient(null);
//     if (refresh) {
//       fetchTaleCallerData();
//     }
//   };

//   const fetchDataAgain = async () => {
//     await fetchTaleCallerData();
//   };

//   const openRawDataEditPopup = (client) => {
//     setEditingClient(client);
//     setShowEditPopup(true);
//   };

//   const closeEditPopup = () => {
//     setShowEditPopup(false);
//     setEditingClient(null);
//   };

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

//   const isValidDateRange = () => {
//     if (fromDate && toDate) {
//       return new Date(fromDate) <= new Date(toDate);
//     }
//     return true;
//   };

//   const telecallers = clients
//     .map((c) => c.assigned_to)
//     .filter((value, index, self) => value && self.indexOf(value) === index);
//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const sources = clients
//     .map((c) => c.source_name)
//     .filter((v, i, s) => v && s.indexOf(v) === i);

//   const leadStages = clients
//     .map((c) => c.stage_name)
//     .filter((v, i, s) => v && s.indexOf(v) === i);

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const entriesPerPage = 50;
//   const totalItems = filteredClients.length;
//   const totalPages = Math.ceil(totalItems / entriesPerPage);

//   const startIndex = (currentPage - 1) * entriesPerPage;

//   const paginatedClients = filteredClients.slice(
//     startIndex,
//     startIndex + entriesPerPage,
//   );
//   const paginate = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filteredClients]);

//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Assigned Call List" />

//       {successMessage && (
//         <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
//           {successMessage}
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
//         {/* Search */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Search</label>
//           <input
//             type="text"
//             className="w-full p-2 border border-gray-300 rounded"
//             placeholder="Search by Student name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Telecaller */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Filter by Telecaller
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded"
//             value={selectedTelecaller}
//             onChange={(e) => setSelectedTelecaller(e.target.value)}
//           >
//             <option value="">All Telecallers</option>
//             {telecallers.map((name, idx) => (
//               <option key={idx} value={name}>
//                 {name}
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
//             onChange={(e) => setSelectedSource(e.target.value)}
//           >
//             <option value="">All Sources</option>
//             {sources.map((s, i) => (
//               <option key={i} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Lead Stage */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Filter by Lead Stage
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded"
//             value={selectedLeadStage}
//             onChange={(e) => setSelectedLeadStage(e.target.value)}
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
//       <div className="mt-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
//         {/* From Date */}
//         <div>
//           <label className="block text-sm font-medium mb-1">From Date</label>
//           <input
//             type="date"
//             className="w-full p-2 border border-gray-300 rounded"
//             value={fromDate}
//             max={toDate || undefined}
//             onChange={(e) => setFromDate(e.target.value)}
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
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>

//         {/* Clear */}
//         <div>
//           <button
//             onClick={() => {
//               setFromDate('');
//               setToDate('');
//             }}
//             className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             Clear Dates
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="py-4 px-4 text-black dark:text-white">Sr No</th>
//               <th className="py-4 px-4 text-black dark:text-white">Name</th>
//               <th className="py-4 px-4 text-black dark:text-white">Contact</th>
//               {/* <th className="py-4 px-4 text-black dark:text-white">Category</th> */}
//               <th className="py-4 px-4 text-black dark:text-white">Source</th>
//               <th className="py-4 px-4 text-black dark:text-white">Assigned</th>
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
//             {paginatedClients.map((client, index) => (
//               <tr key={index}>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {/* 🔥 UPDATED: SR No calculation */}
//                   {startIndex + index + 1}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.name}
//                 </td>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.number
//                     ? client.number
//                         .replace(/[`-]/g, '') // ` aur - remove
//                         .replace(/^91/, '') // starting 91 remove
//                     : 'NA'}
//                 </td>

//                 {/* <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.cat_name}
//                 </td> */}

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.source_name}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.assigned_to}
//                 </td>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.stage_name || 'NA'}
//                 </td>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.lead_sub_stage_name || 'NA'}
//                 </td>
//                 <td className="border-b py-3 px-4 dark:border-strokedark flex gap-2">
//                   <button
//                     onClick={() =>
//                       handleEdit({
//                         ...client,
//                         master_id: client.master_id,
//                         cat_id: client.cat_id,
//                       })
//                     }
//                     className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
//                   >
//                     <FontAwesomeIcon icon={faPhone} />
//                   </button>

//                   <button
//                     onClick={() => openRawDataEditPopup(client)}
//                     className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
//                   >
//                     <FontAwesomeIcon icon={faEdit} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Section (unchanged UI, logic updated) */}
//       <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-strokedark">
//         {/* Left side info */}
//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           Showing{' '}
//           <span className="font-medium">
//             {totalItems === 0 ? 0 : startIndex + 1}
//           </span>{' '}
//           to{' '}
//           <span className="font-medium">
//             {Math.min(currentPage * entriesPerPage, totalItems)}
//           </span>{' '}
//           of <span className="font-medium">{totalItems}</span> results
//         </div>

//         {/* Pagination */}
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

//           {(() => {
//             const pages: (number | string)[] = [];

//             if (totalPages <= 7) {
//               for (let i = 1; i <= totalPages; i++) {
//                 pages.push(i);
//               }
//             } else {
//               const left = Math.max(1, currentPage - 1);
//               const right = Math.min(totalPages, currentPage + 1);

//               // First page
//               pages.push(1);

//               // Left dots
//               if (left > 2) pages.push('...');

//               // Middle pages
//               for (let i = left; i <= right; i++) {
//                 if (i !== 1 && i !== totalPages) {
//                   pages.push(i);
//                 }
//               }

//               // Right dots
//               if (right < totalPages - 1) pages.push('...');

//               // Last page
//               pages.push(totalPages);
//             }

//             // ✅ REMOVE DUPLICATES
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

//       {isModalOpen && selectedClient && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
//             <EditTeleCallerForm
//               data={selectedClient}
//               onClose={handleModalClose}
//               onUpdate={fetchDataAgain}
//             />
//           </div>
//         </div>
//       )}

//       {showEditPopup && editingClient && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
//             <UpdateRawData
//               showEditPopup={showEditPopup}
//               editingClient={editingClient}
//               setEditingClient={setEditingClient}
//               closeEditPopup={closeEditPopup}
//               fetchRawData={fetchDataAgain}
//               categories={categories}
//               references={references}
//               area={area}
//               sources={[]}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CallList;

import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaPhone, FaEdit } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import axios from 'axios';
import EditTeleCallerForm from './EditCall.js';
import UpdateRawData from '../Rawdata/UpdateRawData.js';
import { XCircle, ArrowRightLeft } from 'lucide-react';
import TransferLeadsPopup from './TransferLeadsPopup.js';

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

const CallList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClientsF, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  // APPLIED FILTERS
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    selectedTelecaller: '',
    selectedSource: '',
    selectedLeadStage: '',
    fromDate: '',
    toDate: '',
  });

  const [filterFromDate, setFilterFromDate] = useState('');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTelecaller, setSelectedTelecaller] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedLeadStage, setSelectedLeadStage] = useState('');
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    axios
      .get(`${BASE_URL}auth/get-role`, { withCredentials: true })
      .then((res) => setUserRole(res.data.role));
  }, []);

  const fetchTaleCallerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/combined-rawdata`, {
        withCredentials: true,
      });

      const uniqueClientsMap = new Map();
      response.data.forEach((client) => {
        if (!uniqueClientsMap.has(client.master_id)) {
          uniqueClientsMap.set(client.master_id, client);
        }
      });
      const uniqueClients = Array.from(uniqueClientsMap.values());

      setClients(uniqueClients);
      setFilteredClients(uniqueClients);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTaleCallerData();
  }, []);

  const handleEdit = (client) => {
    setSelectedClient({
      ...client,
      master_id: client.master_id,
      cat_id: client.cat_id,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = (refresh = false) => {
    setIsModalOpen(false);
    setSelectedClient(null);
    if (refresh) {
      fetchTaleCallerData();
    }
  };

  const fetchDataAgain = async () => {
    await fetchTaleCallerData();
  };

  const openRawDataEditPopup = (client) => {
    setEditingClient(client);
    setShowEditPopup(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditingClient(null);
  };

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

  const isValidDateRange = () => {
    if (fromDate && toDate) {
      return new Date(fromDate) <= new Date(toDate);
    }
    return true;
  };

  const telecallers = clients
    .map((c) => c.assigned_to)
    .filter((value, index, self) => value && self.indexOf(value) === index);
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const sources = clients
    .map((c) => c.source_name)
    .filter((v, i, s) => v && s.indexOf(v) === i);

  const leadStages = clients
    .map((c) => c.stage_name)
    .filter((v, i, s) => v && s.indexOf(v) === i);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const entriesPerPage = 50;
  const totalItems = filteredClientsF.length;
  const totalPages = Math.ceil(totalItems / entriesPerPage);

  const startIndex = (currentPage - 1) * entriesPerPage;

  const paginatedClients = filteredClientsF.slice(
    startIndex,
    startIndex + entriesPerPage,
  );
  const paginate = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredClientsF]);

  const toggleLead = (id: number) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedClients.map((c) => c.master_id);

    const allSelectedOnPage = pageIds.every((id) =>
      selectedLeadIds.includes(id),
    );

    if (allSelectedOnPage) {
      // ❌ unselect only current page
      setSelectedLeadIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      // ✅ select current page (without duplicates)
      setSelectedLeadIds((prev) => [
        ...prev,
        ...pageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const normalizeNumber = (num: string = '') =>
    num.replace(/[^0-9]/g, '').replace(/^91/, '');

  const handleApplyFilters = () => {
    const filtered = clients.filter((client) => {
      const textTerm = searchTerm.toLowerCase();
      const numberTerm = normalizeNumber(searchTerm);

      const matchesSearch =
        // 🔤 NAME SEARCH
        (client.name && client.name.toLowerCase().includes(textTerm)) ||
        // 📞 NUMBER SEARCH
        (client.number &&
          normalizeNumber(client.number).includes(numberTerm)) ||
        // 🆔 ID SEARCH (optional)
        client.master_id?.toString().includes(textTerm);

      const matchesTelecaller = selectedTelecaller
        ? client.assigned_to === selectedTelecaller
        : true;

      const matchesSource = selectedSource
        ? client.source_name === selectedSource
        : true;

      const matchesLeadStage = selectedLeadStage
        ? client.stage_name === selectedLeadStage
        : true;

      let matchesDate = true;
      if (fromDate && toDate && client.created_at) {
        const createdAt = new Date(client.created_at);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        matchesDate = createdAt >= from && createdAt <= to;
      }

      return (
        matchesSearch &&
        matchesTelecaller &&
        matchesSource &&
        matchesLeadStage &&
        matchesDate
      );
    });

    setFilteredClients(filtered);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedTelecaller('');
    setSelectedSource('');
    setSelectedLeadStage('');
    setFromDate('');
    setToDate('');

    setFilteredClients(clients); // ✅ RESET LIST
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

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb pageName="Assigned Call List" />

        <div className="flex items-center gap-3">
          {/* Selected Count */}
          {selectedLeadIds.length > 0 && (
            <div className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
              Selected: {selectedLeadIds.length}
            </div>
          )}

          {/* Total / Showing */}
          <div className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full">
            Total: {clients.length} | Showing: {filteredClientsF.length}
          </div>
        </div>
      </div>
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Search by Student name, number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Telecaller */}
        {userRole !== 'tele-caller' && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Filter by Telecaller
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedTelecaller}
              onChange={(e) => setSelectedTelecaller(e.target.value)}
            >
              <option value="">All Telecallers</option>
              {telecallers.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Source */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Filter by Source
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="">All Sources</option>
            {sources.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Stage */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Filter by Lead Stage
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedLeadStage}
            onChange={(e) => setSelectedLeadStage(e.target.value)}
          >
            <option value="">All Lead Stages</option>
            {leadStages.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 mb-6 flex flex-wrap items-end gap-4">
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
        <div className="flex flex-wrap gap-3 sm:ml-auto">
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

          {userRole !== 'tele-caller' && (
            <button
              onClick={() => setShowAssignPopup(true)}
              disabled={selectedLeadIds.length === 0}
              className={`h-[40px] px-4 rounded flex items-center gap-2 transition
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
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-10 py-3 px-2 text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={
                    paginatedClients.length > 0 &&
                    paginatedClients.every((c) =>
                      selectedLeadIds.includes(c.master_id),
                    )
                  }
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="w-40 py-3 px-2 text-black dark:text-white">
                Name
              </th>
              <th className="w-32 py-3 px-2 text-black dark:text-white">
                Contact
              </th>
              <th className="py-3 px-2 text-black dark:text-white">Source</th>
              <th className="py-3 px-2 text-black dark:text-white">Assigned</th>
              <th className="py-3 px-2 text-black dark:text-white">
                Lead Stage
              </th>
              <th className="py-3 px-2 text-black dark:text-white">
                Sub Stage
              </th>
              <th className="py-3 px-2 text-black dark:text-white">Date</th>
              <th className="w-28 py-3 px-2 text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedClients.map((client, index) => (
              <tr key={index} className="align-middle">
                <td className="border-b py-2 px-2 dark:border-strokedark">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(client.master_id)}
                    onChange={() => toggleLead(client.master_id)}
                  />
                </td>

                <td className="border-b py-2 px-2 dark:border-strokedark truncate">
                  {client.name}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {client.number
                    ? (() => {
                        let digits = client.number.replace(/[^0-9]/g, '');

                        if (digits.length === 12 && digits.startsWith('91')) {
                          digits = digits.slice(2);
                        }

                        return digits;
                      })()
                    : 'NA'}
                </td>

                <td className="border-b py-2 px-2 dark:border-strokedark">
                  {client.source_name}
                </td>

                <td className="border-b py-2 px-2 dark:border-strokedark">
                  {client.assigned_to}
                </td>

                <td className="border-b py-2 px-2 dark:border-strokedark">
                  {client.stage_name || 'NA'}
                </td>

                <td className="border-b py-2 px-2 dark:border-strokedark">
                  {client.lead_sub_stage_name || 'NA'}
                </td>
                <td className="border-b py-2 px-2 dark:border-strokedark">
                  {formatDate(client.created_at) || 'NA'}
                </td>

                <td className="border-b py-2 px-2 dark:border-strokedark flex gap-2">
                  <button
                    onClick={() =>
                      handleEdit({
                        ...client,
                        master_id: client.master_id,
                        cat_id: client.cat_id,
                      })
                    }
                    className="bg-green-500 flex items-center justify-center h-8 w-8 rounded text-white hover:bg-opacity-75"
                  >
                    <FaPhone size={16} />
                  </button>

                  <button
                    onClick={() => openRawDataEditPopup(client)}
                    className="bg-meta-3 flex items-center justify-center h-8 w-8 rounded text-white hover:bg-opacity-75"
                  >
                    <FaEdit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section (unchanged UI, logic updated) */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-strokedark">
        {/* Left side info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing{' '}
          <span className="font-medium">
            {totalItems === 0 ? 0 : startIndex + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(currentPage * entriesPerPage, totalItems)}
          </span>{' '}
          of <span className="font-medium">{totalItems}</span> results
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          {/* First */}
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            «
          </button>

          {/* Prev */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ‹
          </button>

          {(() => {
            const pages: (number | string)[] = [];

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              const left = Math.max(1, currentPage - 1);
              const right = Math.min(totalPages, currentPage + 1);

              // First page
              pages.push(1);

              // Left dots
              if (left > 2) pages.push('...');

              // Middle pages
              for (let i = left; i <= right; i++) {
                if (i !== 1 && i !== totalPages) {
                  pages.push(i);
                }
              }

              // Right dots
              if (right < totalPages - 1) pages.push('...');

              // Last page
              pages.push(totalPages);
            }

            // ✅ REMOVE DUPLICATES
            const uniquePages = pages.filter(
              (item, index) => pages.indexOf(item) === index,
            );

            return uniquePages.map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => paginate(Number(page))}
                  className={`px-3 py-1.5 border rounded-md text-sm transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ),
            );
          })()}

          {/* Next */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ›
          </button>

          {/* Last */}
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>

      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <EditTeleCallerForm
              data={selectedClient}
              onClose={handleModalClose}
              onUpdate={fetchDataAgain}
            />
          </div>
        </div>
      )}

      {showEditPopup && editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <UpdateRawData
              showEditPopup={showEditPopup}
              editingClient={editingClient}
              setEditingClient={setEditingClient}
              closeEditPopup={closeEditPopup}
              fetchRawData={fetchDataAgain}
              categories={categories}
              references={references}
              area={area}
              sources={[]}
            />
          </div>
        </div>
      )}

      <TransferLeadsPopup
        show={showAssignPopup}
        onClose={() => setShowAssignPopup(false)}
        selectedLeadIds={selectedLeadIds}
        onSuccess={() => {
          fetchTaleCallerData();
          setSelectedLeadIds([]);
        }}
      />
    </div>
  );
};

export default CallList;
