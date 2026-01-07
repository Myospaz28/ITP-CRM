import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { FaEdit, FaHistory } from 'react-icons/fa';
import UpdateActiveLeads from './UpdateActiveLeads.js';
import LeadDetailsPage from './LeadDetailsPage.js';
import { ArrowRightLeft } from 'lucide-react';
import TransferLeadsPopup from './TransferLeadsPopup.js';

/* ================= INTERFACES ================= */

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

interface User {
  user_id: number;
  name: string;
}

const ITEMS_PER_PAGE = 25;

/* ================= COMPONENT ================= */

const AllLeads: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  /* FILTERS */
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [modifiedDate, setModifiedDate] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    selectedUser: '',
    selectedSource: '',
    selectedStage: '',
    fromDate: '',
    toDate: '',
    modifiedDate: '',
  });

  /* MASTER DATA */
  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [userslist, setUsers] = useState<User[]>([]);
  const [stageList, setStageList] = useState<any[]>([]);
  const [subStageList, setSubStageList] = useState<any[]>([]);

  const [refreshTrigger, setRefeshTrigger] = useState(0);

  /* TRANSFER */
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);
  const [showAssignPopup, setShowAssignPopup] = useState(false);

  const [userRole, setUserRole] = useState<string>('');

  /* ================= ROLE ================= */

  useEffect(() => {
    axios
      .get(`${BASE_URL}auth/get-role`, { withCredentials: true })
      .then((res) => setUserRole(res.data.role));
  }, []);

  /* ================= FILTER OPTIONS ================= */

  const users = Array.from(
    new Set(leads.map((l) => l.assigned_to).filter(Boolean)),
  );

  const sources = Array.from(
    new Set(leads.map((l) => l.source_name).filter(Boolean)),
  );

  const stages = Array.from(
    new Set(leads.map((l) => l.stage_name).filter(Boolean)),
  );

  /* ================= FETCH ALL LEADS ================= */

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/rawdata/all`, {
        withCredentials: true,
      });
      setLeads(res.data || []);
    } catch (err) {
      console.error('Failed to fetch all leads', err);
      setLeads([]);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshTrigger]);

  /* ================= MASTER FETCH ================= */

  useEffect(() => {
    axios
      .get(`${BASE_URL}api/category`)
      .then((res) => setCategories(res.data || []));
    axios
      .get(`${BASE_URL}api/reference`)
      .then((res) => setReferences(res.data || []));
    axios.get(`${BASE_URL}api/area`).then((res) => setArea(res.data || []));
    axios.get(`${BASE_URL}api/users`).then((res) => setUsers(res.data || []));
    axios
      .get(`${BASE_URL}api/leadstages`, { withCredentials: true })
      .then((res) => setStageList(res.data.data || []));
  }, []);

  /* ================= HELPERS ================= */
  const normalizeNumber = (v?: string | null) => {
    if (!v) return '';

    let digits = String(v).replace(/[^0-9]/g, '');

    // remove 91 only if it's country code (91 + 10 digit number)
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.slice(2);
    }

    return digits;
  };

  const getStatusBadgeClass = (status?: string) => {
    const s = status?.toLowerCase();

    switch (s) {
      case 'active':
        return 'bg-green-100 text-green-700 border border-green-300';

      case 'inactive':
        return 'bg-red-100 text-red-700 border border-red-300';

      case 'win':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300';

      case 'invalid':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';

      case 'lose':
      case 'lost':
        return 'bg-gray-200 text-gray-700 border border-gray-300';

      default:
        return 'bg-slate-100 text-slate-700 border border-slate-300';
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      searchTerm,
      selectedUser,
      selectedSource,
      selectedStage,
      fromDate,
      toDate,
      modifiedDate,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedUser('');
    setSelectedSource('');
    setSelectedStage('');
    setFromDate('');
    setToDate('');
    setModifiedDate('');

    setAppliedFilters({
      searchTerm: '',
      selectedUser: '',
      selectedSource: '',
      selectedStage: '',
      fromDate: '',
      toDate: '',
      modifiedDate: '',
    });
    setCurrentPage(1);
  };

  const toggleLead = (id: number) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = () => {
    const pageIds = paginatedData.map((l) => Number(l.master_id));

    const allSelected = pageIds.every((id) => selectedLeadIds.includes(id));

    if (allSelected) {
      // ❌ unselect current page
      setSelectedLeadIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      // ✅ select current page
      setSelectedLeadIds((prev) => [
        ...prev,
        ...pageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  /* ================= FILTER LOGIC ================= */

  const filteredData = leads.filter((lead) => {
    const term = appliedFilters.searchTerm.toLowerCase();
    const numberTerm = normalizeNumber(appliedFilters.searchTerm);
    const leadNumber = normalizeNumber(lead.number);

    const createdDate = lead.created_at
      ? new Date(lead.created_at).toISOString().split('T')[0]
      : null;
    const modified = lead.last_modified_date
      ? lead.last_modified_date.split('T')[0]
      : null;
    return (
      (lead.name?.toLowerCase().includes(term) ||
        lead.assigned_to?.toLowerCase().includes(term) ||
        lead.source_name?.toLowerCase().includes(term) ||
        lead.stage_name?.toLowerCase().includes(term) ||
        (numberTerm && leadNumber.includes(numberTerm))) && // ✅ FIX
      (!appliedFilters.selectedUser ||
        lead.assigned_to === appliedFilters.selectedUser) &&
      (!appliedFilters.selectedSource ||
        lead.source_name === appliedFilters.selectedSource) &&
      (!appliedFilters.selectedStage ||
        lead.stage_name === appliedFilters.selectedStage) &&
      (!appliedFilters.fromDate ||
        (createdDate && createdDate >= appliedFilters.fromDate)) &&
      (!appliedFilters.toDate ||
        (createdDate && createdDate <= appliedFilters.toDate)) &&
      (!appliedFilters.modifiedDate || modified === appliedFilters.modifiedDate)
    );
  });

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'NA';

    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

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

  const formatDateTimeIST = (date: string | null) => {
    if (!date) return 'NA';

    const utcDate = new Date(date);
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const day = String(istDate.getDate()).padStart(2, '0');
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  /* ================= UI ================= */

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb pageName="All Leads" />

        <div className="flex items-center gap-3">
          {selectedLeadIds.length > 0 && (
            <div className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
              Selected: {selectedLeadIds.length}
            </div>
          )}

          <div className="text-sm font-medium bg-gray-100 px-4 py-1.5 rounded-full">
            Total: {leads.length} | Showing: {filteredData.length}
          </div>
        </div>
      </div>

      {/* ================= FILTER UI (RESTORED) ================= */}

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
          <div>
            <label className="block text-sm font-medium mb-1">
              Filter by Telecaller
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Telecallers</option>
              {users.map((u, idx) => (
                <option key={idx} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* SOURCE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Filter by Source
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Sources</option>
            {sources.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* STAGE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Filter by Lead Stage
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedStage}
            onChange={(e) => {
              setSelectedStage(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Lead Stages</option>
            {stages.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* LAST MODIFIED */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Last Modified Date
          </label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
            value={modifiedDate}
            onChange={(e) => setModifiedDate(e.target.value)}
          />
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

        {/* BUTTONS – RIGHT ALIGNED */}
        <div className="flex gap-3 sm:ml-auto flex-wrap">
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
        </div>
      </div>

      <div className="overflow-x-auto rounded border bg-white shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-4">
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
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Contact</th>
              <th className="py-4 px-4">Source</th>
              <th className="py-4 px-4">Assigned</th>
              <th className="py-4 px-4">Stage</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Last Modified</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length ? (
              paginatedData.map((lead) => (
                <tr key={lead.master_id}>
                  <td className="border-b py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(Number(lead.master_id))}
                      onChange={() => toggleLead(Number(lead.master_id))}
                    />
                  </td>

                  <td className="border-b py-3 px-4">{lead.name}</td>
                  <td className="border-b py-3 px-4">
                    {lead.number ? normalizeNumber(lead.number) : 'NA'}
                  </td>
                  <td className="border-b py-3 px-4">{lead.source_name}</td>
                  <td className="border-b py-3 px-4">
                    {lead.assigned_to || 'NA'}
                  </td>
                  <td className="border-b py-3 px-4">
                    {lead.stage_name || 'NA'}
                  </td>

                  <td className="border-b py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
      ${getStatusBadgeClass(lead.lead_status)}`}
                    >
                      {lead.lead_status || 'NA'}
                    </span>
                  </td>

                  <td className="border-b py-3 px-4">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="border-b py-3 px-4 text-gray-700 text-sm">
                    {formatDateTimeIST(lead.last_modified_date)}
                  </td>

                  <td className="border-b py-3 px-4 flex gap-2">
                    <button
                      onClick={async () => {
                        const res = await axios.get(
                          `${BASE_URL}api/lead/${lead.master_id}`,
                          { withCredentials: true },
                        );
                        setEditData(res.data);
                        setEditModalOpen(true);
                      }}
                      className="bg-green-600 px-3 py-1 rounded text-white"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedLeadId(lead.master_id);
                        setShowLogs(true);
                      }}
                      className="bg-orange-500 px-3 py-1 rounded text-white"
                    >
                      <FaHistory />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No Leads Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {/* ================= PAGINATION ================= */}
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
      {showLogs && selectedLeadId && (
        <LeadDetailsPage
          masterId={selectedLeadId}
          onBack={() => setShowLogs(false)}
        />
      )}

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

export default AllLeads;
