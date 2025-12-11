import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import { FaEye, FaHistory } from 'react-icons/fa';

const ITEMS_PER_PAGE = 25;

const LoseLeads = () => {
  const [loseLeads, setLoseLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedLead, setSelectedLead] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetchLoseLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/getallloserawdata`, {
        withCredentials: true,
      });
      setLoseLeads(res.data);
    } catch (err) {
      console.error('Error fetching lose leads:', err);
    }
  };

  useEffect(() => {
    fetchLoseLeads();
  }, []);

  // ---------------- SEARCH ----------------
  const filteredData = loseLeads.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(search) ||
      item.cat_name?.toLowerCase().includes(search) ||
      item.source_name?.toLowerCase().includes(search) ||
      item.assigned_to?.toLowerCase().includes(search)
    );
  });

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-5">
      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-4">Lose Leads</h2>

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
              <tr key={lead.master_id}>
                <td className="border-b py-3 px-4">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>

                <td className="border-b py-3 px-4">{lead.name}</td>
                <td className="border-b py-3 px-4">{lead.cat_name || 'N/A'}</td>
                <td className="border-b py-3 px-4">{lead.source_name}</td>
                <td className="border-b py-3 px-4">{lead.assigned_to}</td>
                <td className="border-b py-3 px-4">{lead.stage_name}</td>
                <td className="border-b py-3 px-4">
                  {lead.lead_sub_stage_name}
                </td>

                {/* Actions */}
                <td className="border-b py-3 px-4 flex gap-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setViewModalOpen(true);
                      }}
                      className="bg-green-500 py-1 px-3 rounded text-white"
                    >
                      <FaEye size={16} />
                    </button>

                    <button
                      onClick={() => console.log('Logs:', lead)}
                      className="bg-orange-500 py-1 px-3 rounded text-white"
                    >
                      <FaHistory size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No Lose Leads Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
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

export default LoseLeads;
