import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { BASE_URL } from '../../../public/config.js';
import AssignLeadPopup from './AssignLeadPopup';
import { UserPlus, XCircle } from 'lucide-react';

interface MetaLead {
  meta_id: number;
  name: string | null;
  number: string | null;
  email: string | null;
  address: string | null;
  area_id: string | null;
  qualification: string | null;
  passout_year: string | null;
  fb_lead_id: string | null;
  form_id: string | null;
  page_id: string | null;
  cat_id: string | null;
  reference_id: number;
  source_id: number | null;
  status: string;
  lead_status: string;
  assign_id: number | null;
  created_by_user: number;
  created_at: string;
  lead_activity: number;
  lead_stage_id: number | null;
  lead_sub_stage_id: number | null;
  call_duration: string | null;
  call_remark: string | null;
  stage_name: string | null;
  lead_sub_stage_name: string | null;
  source_name: string | null;
}

const NewLeads: React.FC = () => {
  const [leads, setLeads] = useState<MetaLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [selectedLeadStage, setSelectedLeadStage] = useState('');
  const [leadStages, setLeadStages] = useState<string[]>([]);
  const [selectedSubStage, setSelectedSubStage] = useState('');
  const [subStages, setSubStages] = useState<string[]>([]);

  // ✅ applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    selectedSource: '',
    selectedLeadStage: '',
    selectedSubStage: '',
    fromDate: '',
    toDate: '',
  });

  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);

  const entriesPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  /** 🔹 Fetch Leads */
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/meta-data`);

      const apiData = Array.isArray(res.data) ? res.data : res.data.data || [];

      setLeads(apiData);

      const uniqueSources = Array.from(
        new Set(apiData.map((l) => l.source_name).filter(Boolean)),
      );

      const uniqueStages = Array.from(
        new Set(apiData.map((l) => l.stage_name).filter(Boolean)),
      );

      const uniqueSubStages = Array.from(
        new Set(apiData.map((l) => l.lead_sub_stage_name).filter(Boolean)),
      );

      setSubStages(uniqueSubStages.map(String));

      setLeadStages(uniqueStages.map(String));
      setSources(uniqueSources.map(String));
    } catch (error) {
      console.error('Error fetching leads', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /** 🔹 Filters */
  const filteredLeads = leads.filter((lead) => {
    const term = appliedFilters.searchTerm.toLowerCase();

    const matchesSearch =
      (lead.name || '').toLowerCase().includes(term) ||
      (lead.number || '').toLowerCase().includes(term) ||
      (lead.email || '').toLowerCase().includes(term);

    const matchesSource = appliedFilters.selectedSource
      ? lead.source_name === appliedFilters.selectedSource
      : true;

    const matchesStage = appliedFilters.selectedLeadStage
      ? lead.stage_name === appliedFilters.selectedLeadStage
      : true;

    const matchesSubStage = appliedFilters.selectedSubStage
      ? lead.lead_sub_stage_name === appliedFilters.selectedSubStage
      : true;

    let matchesDate = true;
    if (appliedFilters.fromDate && appliedFilters.toDate && lead.created_at) {
      const createdAt = new Date(lead.created_at);
      const from = new Date(appliedFilters.fromDate);
      const to = new Date(appliedFilters.toDate);
      to.setHours(23, 59, 59, 999);

      matchesDate = createdAt >= from && createdAt <= to;
    }

    return (
      matchesSearch &&
      matchesSource &&
      matchesStage &&
      matchesSubStage &&
      matchesDate
    );
  });

  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;

  const paginatedLeads = filteredLeads.slice(
    startIndex,
    startIndex + entriesPerPage,
  );

  const paginate = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /** 🔹 Selection */
  const toggleLeadSelection = (id: number) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // const toggleSelectAll = () => {
  //   if (selectedLeadIds.length === paginatedLeads.length) {
  //     setSelectedLeadIds([]);
  //   } else {
  //     setSelectedLeadIds(paginatedLeads.map((l) => l.meta_id));
  //   }
  // };

  const toggleSelectAll = () => {
    const pageIds = paginatedLeads.map((l) => l.meta_id);

    const allSelectedOnPage = pageIds.every((id) =>
      selectedLeadIds.includes(id),
    );

    if (allSelectedOnPage) {
      // ❌ unselect only current page
      setSelectedLeadIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      // ✅ add current page ids (without duplicates)
      setSelectedLeadIds((prev) => [
        ...prev,
        ...pageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      searchTerm,
      selectedSource,
      selectedLeadStage,
      selectedSubStage,
      fromDate,
      toDate,
    });
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedSource('');
    setSelectedLeadStage('');
    setSelectedSubStage('');
    setFromDate('');
    setToDate('');

    setAppliedFilters({
      searchTerm: '',
      selectedSource: '',
      selectedLeadStage: '',
      selectedSubStage: '',
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

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb pageName="New Leads" />

        {/* RIGHT SIDE COUNTS */}
        <div className="flex items-center gap-3">
          {selectedLeadIds.length > 0 && (
            <div className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
              Selected: {selectedLeadIds.length}
            </div>
          )}

          <div className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full">
            Total: {leads.length} | Showing: {filteredLeads.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Search by Student name, number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="">All Sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Stage ✅ */}
        <div>
          <label className="block text-sm font-medium mb-1">Lead Stage</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedLeadStage}
            onChange={(e) => setSelectedLeadStage(e.target.value)}
          >
            <option value="">All Lead Stages</option>
            {leadStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* EMPTY (alignment ke liye) */}
        {/* Sub Stage */}
        <div>
          <label className="block text-sm font-medium mb-1">Sub Stage</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedSubStage}
            onChange={(e) => setSelectedSubStage(e.target.value)}
          >
            <option value="">All Sub Stages</option>
            {subStages.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-3 sm:ml-auto">
          {/* APPLY */}
          <button
            onClick={handleApplyFilters}
            className="h-[40px] px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply Filters
          </button>

          {/* CLEAR */}
          <button
            onClick={handleClearAll}
            className="h-[40px] px-4 bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear All
          </button>

          {/* ASSIGN */}
          <button
            disabled={selectedLeadIds.length === 0}
            onClick={() => setShowAssignPopup(true)}
            className={`h-[40px] px-4 rounded flex items-center gap-2 transition
        ${
          selectedLeadIds.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
          >
            <UserPlus size={18} />
            Assign Leads
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-12 py-3 px-3 text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={
                    paginatedLeads.length > 0 &&
                    paginatedLeads.every((l) =>
                      selectedLeadIds.includes(l.meta_id),
                    )
                  }
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="w-48 py-3 px-3 text-black dark:text-white">
                Name
              </th>
              <th className="w-36 py-3 px-3 text-black dark:text-white">
                Contact
              </th>
              <th className="py-3 px-4 text-black dark:text-white">Source</th>
              <th className="py-3 px-4 text-black dark:text-white">Assigned</th>
              <th className="py-3 px-4 text-black dark:text-white">
                Lead Stage
              </th>
              <th className="py-3 px-4 text-black dark:text-white">
                Sub Stage
              </th>
              {/* <th className="w-36 py-3 px-3 text-black dark:text-white">
          Lead Status
        </th> */}

              <th className="py-3 px-4 text-black dark:text-white">Date</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLeads.map((lead) => (
              <tr
                key={lead.meta_id}
                className="hover:bg-gray-100 dark:hover:bg-meta-4"
              >
                <td className="border-b py-2 px-3 dark:border-strokedark">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(lead.meta_id)}
                    onChange={() => toggleLeadSelection(lead.meta_id)}
                  />
                </td>

                <td className="border-b py-2 px-3 dark:border-strokedark truncate">
                  {lead.name || 'NA'}
                </td>

                <td className="border-b py-2 px-3 dark:border-strokedark whitespace-nowrap">
                  {lead.number
                    ? lead.number.replace(/[`-]/g, '').replace(/^91/, '')
                    : 'NA'}
                </td>

                <td className="border-b py-2 px-4 dark:border-strokedark">
                  {lead.source_name ? ` ${lead.source_name}` : 'NA'}
                </td>

                <td className="border-b py-2 px-4 dark:border-strokedark">
                  {lead.assign_id ? 'Assigned' : 'Not Assigned'}
                </td>

                <td className="border-b py-2 px-4 dark:border-strokedark">
                  {lead.stage_name || 'NA'}
                </td>

                <td className="border-b py-2 px-4 dark:border-strokedark">
                  {lead.lead_sub_stage_name || 'NA'}
                </td>
                {/* 
          <td className="border-b py-2 px-3 dark:border-strokedark">
            {lead.lead_status}
          </td> */}
                <td className="border-b py-2 px-4 dark:border-strokedark whitespace-nowrap">
                  {formatDate(lead.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔄 Assign Popup */}
      {showAssignPopup && (
        <AssignLeadPopup
          selectedLeadIds={selectedLeadIds}
          onClose={() => setShowAssignPopup(false)}
          onSuccess={() => {
            setSelectedLeadIds([]);
            fetchLeads();
          }}
        />
      )}

      {/* 📄 Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm">
          Showing {startIndex + 1} to{' '}
          {Math.min(currentPage * entriesPerPage, totalItems)} of {totalItems}
        </div>

        <div className="flex gap-2">
          <button onClick={() => paginate(1)} disabled={currentPage === 1}>
            «
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => paginate(p)}
              className={`px-3 py-1 rounded ${
                currentPage === p ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewLeads;
