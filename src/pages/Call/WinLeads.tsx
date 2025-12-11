// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaEdit, FaEye, FaHistory } from "react-icons/fa";
// import { BASE_URL } from "../../../public/config.js";

// const ITEMS_PER_PAGE = 10;

// const WinLeads = () => {
//   const [leadData, setLeadData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modals
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);

//   const [editData, setEditData] = useState(null);
//   const [selectedLead, setSelectedLead] = useState(null);

//   // Fetch data
//   const fetchWinLeads = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/getAllWinRawData`, {
//         withCredentials: true,
//       });

//       setLeadData(response.data);
//     } catch (error) {
//       console.error("Error fetching win leads:", error);
//     }
//   };

//   useEffect(() => {
//     fetchWinLeads();
//   }, []);

//   // FILTERING
//   const filteredData = leadData.filter((item) => {
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

//   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   return (
//     <div className="p-5">

//       {/* HEADER */}
//       <h2 className="text-xl font-semibold mb-4">Win Leads</h2>

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
//               <th className="py-4 px-4">Category</th>
//               <th className="py-4 px-4">Source</th>
//               <th className="py-4 px-4">Assigned To</th>
//               <th className="py-4 px-4">Lead Stage</th>
//               <th className="py-4 px-4">Lead Sub Stage</th>
//               <th className="py-4 px-4">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedData.map((lead, index) => (
//               <tr key={index}>
//                 <td className="border-b py-3 px-4">
//                   {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
//                 </td>

//                 <td className="border-b py-3 px-4">{lead.name}</td>
//                 <td className="border-b py-3 px-4">{lead.cat_name || "N/A"}</td>
//                 <td className="border-b py-3 px-4">{lead.source_name}</td>
//                 <td className="border-b py-3 px-4">{lead.assigned_to}</td>
//                 <td className="border-b py-3 px-4">{lead.stage_name}</td>
//                 <td className="border-b py-3 px-4">{lead.lead_sub_stage_name}</td>

//                 <td className="border-b py-3 px-4 flex gap-2">
//                   <div className="flex gap-3">

//                     {/* <button
//                       onClick={() => {
//                         setEditData(lead);
//                         setEditModalOpen(true);
//                       }}
//                       className="bg-meta-3 py-1 px-3 rounded text-white"
//                     >
//                       <FaEdit size={16} />
//                     </button> */}

//                     <button
//                       onClick={() => {
//                         setSelectedLead(lead);
//                         setViewModalOpen(true);
//                       }}
//                       className="bg-green-500 py-1 px-3 rounded text-white"
//                     >
//                       <FaEye size={16} />
//                     </button>

//                     {/* <button
//                       onClick={() => console.log("Logs:", lead)}
//                       className="bg-orange-500 py-1 px-3 rounded text-white"
//                     >
//                       <FaHistory size={16} />
//                     </button> */}

//                   </div>
//                 </td>
//               </tr>
//             ))}

//             {paginatedData.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="text-center py-4 text-gray-500">
//                   No Win Leads Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION – NEW STYLISH VERSION */}
//       <div className="flex items-center justify-between border-t px-4 py-3 mt-4">
//         <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">

//           <p className="text-sm text-gray-700">
//             Showing{" "}
//             <span className="font-medium">
//               {filteredData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
//             </span>{" "}
//             to{" "}
//             <span className="font-medium">
//               {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
//             </span>{" "}
//             of{" "}
//             <span className="font-medium">{filteredData.length}</span>{" "}
//             results
//           </p>

//           <nav className="isolate inline-flex -space-x-px rounded-md">

//             {/* Prev */}
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               className="px-2 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md"
//             >
//               ‹
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => goToPage(i + 1)}
//                 className={`px-4 py-2 text-sm font-semibold ${
//                   currentPage === i + 1
//                     ? "bg-indigo-500 text-white"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               onClick={() => goToPage(currentPage + 1)}
//               className="px-2 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
//             >
//               ›
//             </button>

//           </nav>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default WinLeads;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaHistory } from 'react-icons/fa';
import { BASE_URL } from '../../../public/config.js';
import LeadDetailsPage from './LeadDetailsPage.js'


const ITEMS_PER_PAGE = 25; // 🔥 Updated from 10 → 25

const WinLeads = () => {
  const [leadData, setLeadData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLeadPopup, setShowLeadPopup] = useState(false);
const [selectedMasterId, setSelectedMasterId] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Fetch data
  const fetchWinLeads = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/getAllWinRawData`, {
        withCredentials: true,
      });

      setLeadData(response.data);
    } catch (error) {
      console.error('Error fetching win leads:', error);
    }
  };

  useEffect(() => {
    fetchWinLeads();
  }, []);

  // SEARCH FILTER
  const filteredData = leadData.filter((item) => {
    const term = searchTerm.toLowerCase();

    return (
      item.name?.toLowerCase().includes(term) ||
      item.cat_name?.toLowerCase().includes(term) ||
      item.source_name?.toLowerCase().includes(term) ||
      item.assigned_to?.toLowerCase().includes(term) ||
      item.stage_name?.toLowerCase().includes(term) ||
      item.lead_sub_stage_name?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Win Leads</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name, category, source, assigned to..."
        className="border p-2 rounded mb-4 w-72"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* TABLE */}
      <div className="overflow-x-auto rounded border border-stroke bg-white shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="py-4 px-4">Sr No</th>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Source</th>
              <th className="py-4 px-4">Assigned To</th>
              <th className="py-4 px-4">Lead Stage</th>
              <th className="py-4 px-4">Lead Sub Stage</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((lead, index) => (
              <tr key={index}>
                <td className="border-b py-3 px-4">{startIndex + index + 1}</td>

                <td className="border-b py-3 px-4">{lead.name}</td>
                <td className="border-b py-3 px-4">{lead.cat_name || 'N/A'}</td>
                <td className="border-b py-3 px-4">{lead.source_name}</td>
                <td className="border-b py-3 px-4">{lead.assigned_to}</td>
                <td className="border-b py-3 px-4">{lead.stage_name}</td>
                <td className="border-b py-3 px-4">
                  {lead.lead_sub_stage_name}
                </td>

                <td className="border-b py-3 px-4">
                 <button
  onClick={() => {
    setSelectedMasterId(lead.master_id);
    setShowLeadPopup(true);
  }}
  className="bg-orange-500 py-1 px-3 rounded text-white"
>
  <FaHistory size={16} />
</button>
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No Win Leads Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

{showLeadPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-999 overflow-y-auto">
    <div className=" p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto relative">
      {/* CHILD COMPONENT */}
      <LeadDetailsPage
        masterId={selectedMasterId}
        onBack={() => setShowLeadPopup(false)}
      />
    </div>
  </div>
)}

      {/* ⭐ PREMIUM PAGINATION (center aligned) */}
      <div className="w-full border-t border-white/10 px-4 py-6 flex items-center justify-center mt-6">
        <div className="flex flex-col items-center space-y-3">
          {/* Result Info */}
          <p className="text-sm text-gray-300">
            Showing
            <span className="font-semibold mx-1">
              {filteredData.length === 0
                ? 0
                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>
            to
            <span className="font-semibold mx-1">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
            </span>
            of
            <span className="font-semibold mx-1">{filteredData.length}</span>
            results
          </p>

          {/* Pagination */}
          <nav
            aria-label="Pagination"
            className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg"
          >
            {/* Prev */}
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
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
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
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
    </div>
  );
};

export default WinLeads;
