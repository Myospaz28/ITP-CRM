import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import InsertDataModal from '../Rawdata/InsertDataModal';

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

const RawData = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);

  const [error, setError] = useState('');

  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateEntries, setDuplicateEntries] = useState<any[]>([]);

  const [singleFormData, setSingleFormData] = useState({
    name: '',
    number: '',
    email: '',
    address: '',
    qualification: '',
    passout_year: '',
    cat_id: '',
    reference_id: '',
    source_id: '',
    area_id: '',
    user_id: '', // 🔥 AUTO ASSIGN
  });

  /* ===============================
     FETCH LOGGED-IN USER (SESSION)
  =============================== */
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}auth/get-role`, {
          withCredentials: true,
        });

        const { id, username, role } = res.data;

        console.log('==============================');
        console.log('✅ LOGGED IN USER DETAILS');
        console.log('User ID   :', id);
        console.log('Username  :', username);
        console.log('Role      :', role);
        console.log('==============================');

        // 🔥 AUTO ASSIGN USER ID
        setSingleFormData((prev) => ({
          ...prev,
          user_id: String(id),
        }));
      } catch (err) {
        console.error('❌ Failed to fetch logged-in user', err);
      }
    };

    fetchLoggedInUser();
  }, []);

  /* ===============================
     FETCH MASTER DATA
  =============================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/category`);
        console.log('📂 Categories:', res.data);
        setCategories(res.data || []);
      } catch (err) {
        console.error('❌ Category fetch error', err);
        setCategories([]);
      }
    };

    const fetchReferences = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/reference`);
        console.log('🔗 References:', res.data);
        setReferences(res.data || []);
      } catch (err) {
        console.error('❌ Reference fetch error', err);
        setReferences([]);
      }
    };

    const fetchArea = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/area`);
        console.log('📍 Areas:', res.data);
        setArea(res.data || []);
      } catch (err) {
        console.error('❌ Area fetch error', err);
        setArea([]);
      }
    };

    fetchCategories();
    fetchReferences();
    fetchArea();
  }, []);

  /* ===============================
     AFTER SUCCESS (OPTIONAL)
  =============================== */
  const fetchRawData = () => {
    console.log('✅ Lead added successfully (refresh if needed)');
  };

  return (
    <div>
      <Breadcrumb pageName="Add New Lead" />

      {/* ADD BUTTON */}
      <div className="flex justify-end my-4">
        <button
          onClick={() => setShowAddPopup(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          + Add Lead
        </button>
      </div>

      {/* INSERT SINGLE DATA MODAL */}
      <InsertDataModal
        showAddPopup={showAddPopup}
        setShowAddPopup={setShowAddPopup}
        singleFormData={singleFormData}
        setSingleFormData={setSingleFormData}
        categories={categories}
        references={references}
        area={area}
        fetchRawData={fetchRawData}
        setError={setError}
        setDuplicateEntries={setDuplicateEntries}
        setShowDuplicateModal={setShowDuplicateModal}
        showDuplicateModal={showDuplicateModal}
        duplicateEntries={duplicateEntries}
      />

      {/* ERROR DISPLAY */}
      {error && (
        <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}
    </div>
  );
};

export default RawData;
