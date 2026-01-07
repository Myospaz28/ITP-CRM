import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaHistory } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config';
import LeadDetailsPage from './LeadDetailsPage';
import UpdateActiveLeads from './UpdateActiveLeads';
import { ArrowRightLeft } from 'lucide-react';
import TransferLeadsPopup from './TransferLeadsPopup';

/* ================= INTERFACES ================= */

interface FollowUpLead {
  master_id: number;
  name: string | null;
  number: string | null;
  source_name: string | null;
  assigned_to: string | null;
  stage_name: string | null;
  lead_sub_stage_name: string | null;
  follow_up_date: string | null;
  follow_up_time?: string | null;
  follow_up_status?: 'today' | 'overdue' | 'upcoming';
  created_at?: string | null;
  last_modified_date?: string | null;
}

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

const FollowUpLeads: React.FC = () => {
  const [leads, setLeads] = useState<FollowUpLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  /* 🔥 FILTER STATES */
  const [selectedTelecaller, setSelectedTelecaller] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedLeadStage, setSelectedLeadStage] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    'today' | 'overdue' | 'upcoming' | ''
  >('');

  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [modifiedDate, setModifiedDate] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    selectedTelecaller: '',
    selectedSource: '',
    selectedLeadStage: '',
    fromDate: '',
    toDate: '',
    modifiedDate: '',
  });

  /* 🔁 REFRESH */
  const [refreshTrigger, setRefeshTrigger] = useState(0);

  /* 🪟 MODALS */
  const [showLogs, setShowLogs] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  /* 📦 MASTER DATA (REQUIRED FOR UpdateActiveLeads) */
  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stageList, setStageList] = useState<any[]>([]);
  const [subStageList, setSubStageList] = useState<any[]>([]);

  /* ================= FETCH FOLLOWUPS ================= */
  useEffect(() => {
    axios
      .get(`${BASE_URL}auth/get-role`, { withCredentials: true })
      .then((res) => setUserRole(res.data.role));
  }, []);

  const fetchFollowUps = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/followup-leads`, {
        withCredentials: true,
      });
      setLeads(res.data || []);
    } catch (err) {
      console.error('❌ Error fetching follow-ups', err);
      setLeads([]);
    }
  };

  useEffect(() => {
    fetchFollowUps();
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

  /* ================= FILTER OPTIONS ================= */
  const telecallers = Array.from(
    new Set(leads.map((l) => l.assigned_to).filter(Boolean)),
  ) as string[];

  const sourcesList = Array.from(
    new Set(leads.map((l) => l.source_name).filter(Boolean)),
  ) as string[];

  const leadStages = Array.from(
    new Set(leads.map((l) => l.stage_name).filter(Boolean)),
  ) as string[];

  /* ================= FILTER LOGIC ================= */

  const filteredData = leads.filter((lead) => {
    const term = appliedFilters.searchTerm.toLowerCase();
    const followDate = lead.follow_up_date?.split('T')[0] || null;
    const modified = lead.last_modified_date
      ? lead.last_modified_date.split('T')[0] // ✅ IMPORTANT
      : null;

    return (
      (lead.name?.toLowerCase().includes(term) ||
        lead.number?.includes(term) ||
        lead.assigned_to?.toLowerCase().includes(term)) &&
      (!appliedFilters.selectedTelecaller ||
        lead.assigned_to === appliedFilters.selectedTelecaller) &&
      (!appliedFilters.selectedSource ||
        lead.source_name === appliedFilters.selectedSource) &&
      (!appliedFilters.selectedLeadStage ||
        lead.stage_name === appliedFilters.selectedLeadStage) &&
      (!appliedFilters.fromDate ||
        (followDate && followDate >= appliedFilters.fromDate)) &&
      (!appliedFilters.toDate ||
        (followDate && followDate <= appliedFilters.toDate)) &&
      (!appliedFilters.modifiedDate ||
        modified === appliedFilters.modifiedDate) &&
      (!selectedStatus || lead.follow_up_status === selectedStatus)
    );
  });

  /* ================= PAGINATION ================= */

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  /* ================= HANDLERS ================= */

  const handleApplyFilters = () => {
    setAppliedFilters({
      searchTerm,
      selectedTelecaller,
      selectedSource,
      selectedLeadStage,
      fromDate,
      toDate,
      modifiedDate,
    });
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedTelecaller('');
    setSelectedSource('');
    setSelectedLeadStage('');
    setFromDate('');
    setToDate('');
    setModifiedDate('');
    setAppliedFilters({
      searchTerm: '',
      selectedTelecaller: '',
      selectedSource: '',
      selectedLeadStage: '',
      fromDate: '',
      toDate: '',
      modifiedDate: '',
    });
    setCurrentPage(1);
  };

  const formatDate = (d: string | null) => (d ? d.split('T')[0] : 'NA');

  // const formatDateTime = (date: string | null, time?: string | null) => {
  //   if (!date) return 'NA';
  //   const d = date.split('T')[0];
  //   if (!time) return d;
  //   return `${d} ${time}`;
  // };

  const formatDateTime = (date: string | null, time?: string | null) => {
    if (!date) return 'NA';

    // 🔥 Convert UTC → IST (+05:30)
    const utcDate = new Date(date);
    const istTime = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, '0');
    const day = String(istTime.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    if (!time) return formattedDate;

    return `${formattedDate} ${time}`;
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
      setSelectedLeadIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedLeadIds((prev) => [
        ...prev,
        ...pageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb pageName="Follow-up Leads" />
        <div className="text-sm bg-gray-100 px-4 py-1.5 rounded-full">
          Total: {leads.length} | Showing: {filteredData.length}
        </div>
      </div>

      {/* FILTERS */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          className="p-2 border rounded"
          placeholder="Search by Student name, number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          value={selectedTelecaller}
          onChange={(e) => setSelectedTelecaller(e.target.value)}
        >
          <option value="">All Telecallers</option>
          {telecallers.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          <option value="">All Sources</option>
          {sourcesList.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
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
      </div> */}

      <div className="mb-6 flex flex-wrap lg:flex-nowrap gap-4 items-center">
        {/* 🔍 SEARCH */}
        <input
          className="h-10 px-3 border rounded flex-1 min-w-[220px]"
          placeholder="Search by Student name, number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 👤 TELECALLER */}
        <select
          className="h-10 px-3 border rounded min-w-[170px]"
          value={selectedTelecaller}
          onChange={(e) => setSelectedTelecaller(e.target.value)}
        >
          <option value="">All Telecallers</option>
          {telecallers.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* 🔗 SOURCE */}
        <select
          className="h-10 px-3 border rounded min-w-[150px]"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          <option value="">All Sources</option>
          {sourcesList.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* 🏷️ LEAD STAGE */}
        <select
          className="h-10 px-3 border rounded min-w-[160px]"
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

        {/* 📅 LAST MODIFIED */}
        <div className="flex items-center gap-2 min-w-[220px]">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Last Modified:
          </span>
          <input
            type="date"
            className="h-10 px-3 border rounded"
            value={modifiedDate}
            onChange={(e) => setModifiedDate(e.target.value)}
          />
        </div>
      </div>

      {/* DATE + STATUS FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-start lg:items-end">
        {/* DATE FILTER */}
        <div className="flex gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              className="p-2 border rounded"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              className="p-2 border rounded"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* STATUS FILTER */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
        ${
          selectedStatus === ''
            ? 'bg-gray-900 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
          >
            All
          </button>

          <button
            onClick={() => setSelectedStatus('today')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
        ${
          selectedStatus === 'today'
            ? 'bg-green-600 text-white'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
          >
            Today
          </button>

          <button
            onClick={() => setSelectedStatus('overdue')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
        ${
          selectedStatus === 'overdue'
            ? 'bg-red-600 text-white'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}
          >
            Overdue
          </button>

          <button
            onClick={() => setSelectedStatus('upcoming')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
        ${
          selectedStatus === 'upcoming'
            ? 'bg-blue-600 text-white'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}
          >
            Upcoming
          </button>
        </div>

        {/* APPLY / CLEAR */}
        <div className="ml-auto flex gap-3">
          <button
            onClick={handleApplyFilters}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Apply
          </button>

          <button
            onClick={() => {
              handleClearAll();
              setSelectedStatus('');
            }}
            className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
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

      {/* TABLE */}
      <div className="overflow-x-auto border rounded bg-white shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
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
              <th className="py-4 px-4">#</th>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Contact</th>
              <th className="py-4 px-4">Source</th>
              <th className="py-4 px-4">Assigned</th>
              <th className="py-4 px-4">Stage</th>
              <th className="py-4 px-4">Sub Stage</th>
              <th className="py-4 px-4">FollowUp Date</th>
              <th className="py-4 px-4">Last Modified</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((lead, i) => (
              <tr key={lead.master_id}>
                <td className="border-b py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(Number(lead.master_id))}
                    onChange={() => toggleLead(Number(lead.master_id))}
                  />
                </td>
                <td className="border-b py-3 px-4">{startIndex + i + 1}</td>
                <td className="border-b py-3 px-4">{lead.name || 'NA'}</td>
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

                <td className="border-b py-3 px-4">
                  {lead.source_name || 'NA'}
                </td>
                <td className="border-b py-3 px-4">
                  {lead.assigned_to || 'NA'}
                </td>
                <td className="border-b py-3 px-4">
                  {lead.stage_name || 'NA'}
                </td>
                <td className="border-b py-3 px-4">
                  {lead.lead_sub_stage_name || 'NA'}
                </td>
                <td className="border-b py-3 px-4 text-blue-800 text-sm">
                  {formatDateTime(lead.follow_up_date, lead.follow_up_time)}
                </td>
                <td className="border-b py-3 px-4 text-gray-700 text-sm">
                  {lead.last_modified_date
                    ? lead.last_modified_date.replace('T', ' ').slice(0, 16)
                    : 'NA'}
                </td>
                <td className="border-b py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
      ${
        lead.follow_up_status === 'today'
          ? 'bg-green-100 text-green-700'
          : lead.follow_up_status === 'overdue'
          ? 'bg-red-100 text-red-700'
          : 'bg-blue-100 text-blue-700'
      }
    `}
                  >
                    {lead.follow_up_status?.toUpperCase()}
                  </span>
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
                    className="bg-orange-500 px-3 py-1 rounded text-white"
                  >
                    <FaHistory />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        users={users}
        stageList={stageList}
        subStageList={subStageList}
        setRefeshTrigger={setRefeshTrigger}
      />

      <TransferLeadsPopup
        show={showAssignPopup}
        onClose={() => setShowAssignPopup(false)}
        selectedLeadIds={selectedLeadIds}
        onSuccess={() => {
          fetchFollowUps();
          setSelectedLeadIds([]);
        }}
      />
    </div>
  );
};

export default FollowUpLeads;
