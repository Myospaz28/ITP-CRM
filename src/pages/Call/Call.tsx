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
//   const itemsPerPage = 10;

//   const fetchTaleCallerData = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/combined-rawdata`, {
//         withCredentials: true,
//       });
//       // console.log('response call', response.data);

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

//   useEffect(() => {
//     const lowerSearch = searchTerm.toLowerCase();

//     const formatToLocalDate = (date) => {
//       const d = new Date(date);
//       const offset = d.getTimezoneOffset();
//       d.setMinutes(d.getMinutes() - offset);
//       return d.toISOString().split('T')[0];
//     };

//     const filtered = clients.filter((client) => {
//       const clientName = client.name?.toLowerCase() || '';
//       const categoryName = client.category?.toLowerCase() || '';
//       const assignIdStr = client.assign_id?.toString() || '';
//       const masterIdStr = client.master_id?.toString() || '';

//       const matchesText =
//         clientName.includes(lowerSearch) ||
//         categoryName.includes(lowerSearch) ||
//         assignIdStr.includes(lowerSearch) ||
//         masterIdStr.includes(lowerSearch);

//       return matchesText;
//     });

//     setFilteredClients(filtered);
//   }, [searchTerm, clients]);

//   const handleEdit = (client) => {
//     // console.log("Selected client:", client);
//     // console.log('click');
//     setSelectedClient({
//       ...client,
//       master_id: client.master_id,
//       cat_id: client.cat_id,
//     });
//     // console.log('selected cleint ', selectedClient);
//     // console.log('client : ', client);
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

//   const totalItems = filteredClients.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedClients = filteredClients.slice(
//     startIndex,
//     startIndex + itemsPerPage,
//   );

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Call List" />

//       {successMessage && (
//         <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
//           {successMessage}
//         </div>
//       )}

//       <div className="mb-4">
//         <div className="flex flex-wrap gap-4 items-end">
//           <div className="w-full sm:w-1/3">
//             <label className="block text-sm font-medium mb-1">Search</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Search by client or category name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="py-4 px-4 text-black dark:text-white">Sr No</th>
//               <th className="py-4 px-4 text-black dark:text-white">Name</th>
//               <th className="py-4 px-4 text-black dark:text-white">Category</th>
//               <th className="py-4 px-4 text-black dark:text-white">Source</th>
//               <th className="py-4 px-4 text-black dark:text-white">
//                 {' '}
//                 Assigned To{' '}
//               </th>
//               <th className="py-4 px-4 text-black dark:text-white">Status</th>
//               <th className="py-4 px-4 text-black dark:text-white">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedClients.map((client, index) => (
//               <tr key={index}>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {index + 1}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.name}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.cat_name}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.source_name}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.assigned_to}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.status}
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

//       {/* Pagination Section */}
//       <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
//         {/* Mobile */}
//         <div className="flex flex-1 justify-between sm:hidden">
//           <button
//             onClick={handlePrevious}
//             disabled={currentPage === 1}
//             className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-30"
//           >
//             Previous
//           </button>

//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-30"
//           >
//             Next
//           </button>
//         </div>

//         <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm text-gray-300">
//               Showing
//               <span className="font-medium ml-1">{startIndex + 1}</span>
//               to
//               <span className="font-medium ml-1">
//                 {Math.min(startIndex + itemsPerPage, totalItems)}
//               </span>
//               of
//               <span className="font-medium ml-1">{totalItems}</span>
//               results
//             </p>
//           </div>

//           <div>
//             <nav
//               aria-label="Pagination"
//               className="isolate inline-flex -space-x-px rounded-md"
//             >
//               <button
//                 onClick={handlePrevious}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-white/5 disabled:opacity-30"
//               >
//                 <span className="sr-only">Previous</span>
//                 <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
//                   />
//                 </svg>
//               </button>

//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
//               ${
//                 currentPage === i + 1
//                   ? 'z-10 bg-indigo-500 text-white'
//                   : 'text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5'
//               }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}

//               <button
//                 onClick={handleNext}
//                 disabled={currentPage === totalPages}
//                 className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-white/5 disabled:opacity-30"
//               >
//                 <span className="sr-only">Next</span>
//                 <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
//                   />
//                 </svg>
//               </button>
//             </nav>
//           </div>
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
import { faEdit, faPhone } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import axios from 'axios';
import EditTeleCallerForm from './EditCall.js';
import UpdateRawData from '../Rawdata/UpdateRawData.js';

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
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 🔥 UPDATED: Show 25 rows per page
  const itemsPerPage = 25;

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

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = clients.filter((client) => {
      const clientName = client.name?.toLowerCase() || '';
      const categoryName = client.category?.toLowerCase() || '';
      const assignIdStr = client.assign_id?.toString() || '';
      const masterIdStr = client.master_id?.toString() || '';

      return (
        clientName.includes(lowerSearch) ||
        categoryName.includes(lowerSearch) ||
        assignIdStr.includes(lowerSearch) ||
        masterIdStr.includes(lowerSearch)
      );
    });

    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [searchTerm, clients]);

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

  const totalItems = filteredClients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Call List" />

      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Search by client or category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 text-black dark:text-white">Sr No</th>
              <th className="py-4 px-4 text-black dark:text-white">Name</th>
              <th className="py-4 px-4 text-black dark:text-white">Category</th>
              <th className="py-4 px-4 text-black dark:text-white">Source</th>
              <th className="py-4 px-4 text-black dark:text-white">
                Assigned To
              </th>
              <th className="py-4 px-4 text-black dark:text-white">Status</th>
              <th className="py-4 px-4 text-black dark:text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedClients.map((client, index) => (
              <tr key={index}>
                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {/* 🔥 UPDATED: SR No calculation */}
                  {startIndex + index + 1}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {client.name}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {client.cat_name}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {client.source_name}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {client.assigned_to}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {client.status}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark flex gap-2">
                  <button
                    onClick={() =>
                      handleEdit({
                        ...client,
                        master_id: client.master_id,
                        cat_id: client.cat_id,
                      })
                    }
                    className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
                  >
                    <FontAwesomeIcon icon={faPhone} />
                  </button>

                  <button
                    onClick={() => openRawDataEditPopup(client)}
                    className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section (unchanged UI, logic updated) */}
      <div className="w-full border-t border-white/10 px-4 py-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          {/* Results Info */}
          <p className="text-sm text-gray-300">
            Showing
            <span className="font-semibold mx-1">{startIndex + 1}</span>
            to
            <span className="font-semibold mx-1">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>
            of
            <span className="font-semibold mx-1">{totalItems}</span>
            results
          </p>

          {/* Pagination Controls */}
          <nav
            aria-label="Pagination"
            className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg"
          >
            {/* Prev */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                />
              </svg>
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
            ${
              currentPage === i + 1
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-gray-300 hover:bg-white/10'
            }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                />
              </svg>
            </button>
          </nav>
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
    </div>
  );
};

export default CallList;
