import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { FaEdit, FaEye, FaHistory } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPhone } from '@fortawesome/free-solid-svg-icons';
import UpdateActiveLeads from './UpdateActiveLeads.js';
import LeadDetailsPage from './LeadDetailsPage.js';

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

const ActiveLeads = () => {
  const [activeLeads, setActiveLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [subStageList, setSubStageList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [productList, setProductList] = useState<Product[]>([]);
  const [statusMap, setStatusMap] = useState<any>({});
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [refreshTrigger, setRefeshTrigger] = useState(0);

  const itemsPerPage = 25;

  const fetchActiveLeads = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/rawdata/active`, {
        withCredentials: true,
      });

      const filtered = response.data.filter(
        (item) => item.lead_status === 'Active',
      );

      setActiveLeads(filtered);
    } catch (error) {
      console.error('Error fetching Active Leads:', error);
    }
  };

  useEffect(() => {
    fetchActiveLeads();
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
    const fetchSources = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/sources`, {
          withCredentials: true,
        });
        setSources(response.data.data || []);
      } catch (error) {
        console.error('Error fetching sources:', error);
      }
    };
    fetchSources();
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

  const fetchProducts = async (catId: string | number) => {
    try {
      const res = await axios.get(`${BASE_URL}api/products/${catId}`);
      setProductList(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const filteredData = activeLeads.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.cat_name?.toLowerCase().includes(term) ||
      item.source_name?.toLowerCase().includes(term) ||
      item.assigned_user_name?.toLowerCase().includes(term) ||
      item.stage_name?.toLowerCase().includes(term) ||
      item.lead_sub_stage_name?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleOpenPopup = (masterId) => {
    setSelectedLeadId(masterId);
    setShowPopup(true);
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Active Leads" />
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Search</label>
        <input
          type="text"
          className="w-90 p-2 border border-gray-300 rounded"
          placeholder="Search by name, category, stage..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 text-black dark:text-white">Sr no</th>
              <th className="py-4 px-4 text-black dark:text-white">Name</th>
              <th className="py-4 px-4 text-black dark:text-white">Category</th>
              <th className="py-4 px-4 text-black dark:text-white">Source</th>
              <th className="py-4 px-4 text-black dark:text-white">Assign</th>
              <th className="py-4 px-4 text-black dark:text-white">
                Lead Stage
              </th>
              <th className="py-4 px-4 text-black dark:text-white">
                Sub Stage
              </th>

              <th className="py-4 px-4 text-black dark:text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((lead, index) => (
              <tr key={index}>
                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {lead.name}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {lead.cat_name || 'N/A'}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {lead.source_name}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {lead.assigned_to}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {lead.stage_name}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark">
                  {lead.lead_sub_stage_name}
                </td>

                <td className="border-b py-3 px-4 dark:border-strokedark flex gap-2">
                  <div className="flex gap-3 h-8 justify-center">
                    <button
                      onClick={() => {
                        setEditData(lead);
                        setEditModalOpen(true);
                      }}
                      className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
                    >
                      <FaEdit size={16} />
                    </button>

                    {/* LOGS */}
                    <button
                      onClick={() => {
                        setSelectedLeadId(lead.master_id);
                        setShowLogs(true);
                      }}
                      className="bg-orange-500 py-1 px-3 rounded text-white hover:bg-opacity-75"
                    >
                      <FaHistory size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-4 text-gray-500 dark:text-gray-300"
                >
                  No Active Leads Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {viewModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white w-[500px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-5">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
              onClick={() => setViewModalOpen(false)}
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4">Lead Details</h2>

            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedLead.name}
              </p>
              <p>
                <strong>Number:</strong> {selectedLead.number}
              </p>
              <p>
                <strong>Email:</strong> {selectedLead.email}
              </p>
              <p>
                <strong>Address:</strong> {selectedLead.address}
              </p>
              <p>
                <strong>Area:</strong> {selectedLead.area_name}
              </p>
              <p>
                <strong>Category:</strong> {selectedLead.cat_name}
              </p>
              <p>
                <strong>Reference:</strong> {selectedLead.reference_name}
              </p>
              <p>
                <strong>Source:</strong> {selectedLead.source_name}
              </p>
              <p>
                <strong>Lead Stage:</strong> {selectedLead.stage_name}
              </p>
              <p>
                <strong>Lead Sub Stage:</strong>{' '}
                {selectedLead.lead_sub_stage_name}
              </p>
              <p>
                <strong>Assigned To:</strong> {selectedLead.assigned_to}
              </p>
              <p>
                <strong>Products:</strong> {selectedLead.products}
              </p>
            </div>
          </div>
        </div>
      )}

      {showLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-999 overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto dark:border-strokedark dark:bg-boxdark ml-20">
            {/* CLOSE BUTTON */}
            {/* <button
        className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-3 py-1 hover:bg-red-600"
        onClick={() => setShowLogs(false)}
      >
        ✖
      </button> */}

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

      <div className="w-full border-t border-white/10 px-4 py-6 flex items-center justify-center mt-6">
        <div className="flex flex-col items-center space-y-3">
          {/* Result Info */}
          <p className="text-sm text-gray-300">
            Showing
            <span className="font-semibold mx-1">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>
            to
            <span className="font-semibold mx-1">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>
            of
            <span className="font-semibold mx-1">{filteredData.length}</span>
            results
          </p>

          {/* Pagination Controls */}
          <nav
            aria-label="Pagination"
            className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg"
          >
            {/* Prev */}
            <button
              onClick={() => goToPage(currentPage - 1)}
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
                onClick={() => goToPage(i + 1)}
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
              onClick={() => goToPage(currentPage + 1)}
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

export default ActiveLeads;
