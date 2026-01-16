// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config';
// import UpdateActiveLeads from './UpdateActiveLeads';

// const LeadViewPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [leadData, setLeadData] = useState<any>(null);

//   const [categories, setCategories] = useState<any[]>([]);
//   const [references, setReferences] = useState<any[]>([]);
//   const [area, setArea] = useState<any[]>([]);
//   const [sources, setSources] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [stageList, setStageList] = useState<any[]>([]);
//   const [subStageList, setSubStageList] = useState<any[]>([]);

//   const [refreshTrigger, setRefeshTrigger] = useState(0);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH ALL REQUIRED DATA ================= */

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const [leadRes, catRes, refRes, areaRes, userRes, stageRes] =
//           await Promise.all([
//             axios.get(`${BASE_URL}api/lead/${id}`, { withCredentials: true }),
//             axios.get(`${BASE_URL}api/category`),
//             axios.get(`${BASE_URL}api/reference`),
//             axios.get(`${BASE_URL}api/area`),
//             axios.get(`${BASE_URL}api/users`),
//             axios.get(`${BASE_URL}api/leadstages`, { withCredentials: true }),
//           ]);

//         const lead = leadRes.data;

//         setLeadData(lead);
//         setCategories(catRes.data || []);
//         setReferences(refRes.data || []);
//         setArea(areaRes.data || []);
//         setUsers(userRes.data || []);
//         setStageList(stageRes.data.data || []);

//         // 🔥 Fetch sources based on reference_id
//         if (lead?.reference_id) {
//           const sourceRes = await axios.get(
//             `${BASE_URL}api/source/${lead.reference_id}`,
//             { withCredentials: true },
//           );
//           setSources(sourceRes.data.sources || []);
//         }
//       } catch (error) {
//         console.error('Failed to load lead view page', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [id]);

//   /* ================= LOADING / ERROR ================= */

//   if (loading) {
//     return <div className="p-6 text-center">Loading Lead...</div>;
//   }

//   if (!leadData) {
//     return <div className="p-6 text-center">Lead not found</div>;
//   }

//   /* ================= RENDER UPDATE MODAL AS PAGE ================= */

//   return (
//     <UpdateActiveLeads
//       open={true} // 👈 always open
//       onClose={() => navigate(-1)} // 👈 back button behaviour
//       leadData={leadData}
//       categories={categories}
//       references={references}
//       areaList={area}
//       sources={sources}
//       users={users}
//       stageList={stageList}
//       subStageList={subStageList}
//       setRefeshTrigger={setRefeshTrigger}
//     />
//   );
// };

// export default LeadViewPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../public/config';
import UpdateActiveLeads from './UpdateActiveLeads';

const LeadViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leadData, setLeadData] = useState<any>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [area, setArea] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stageList, setStageList] = useState<any[]>([]);
  const [subStageList, setSubStageList] = useState<any[]>([]);

  const [refreshTrigger, setRefeshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ALL REQUIRED DATA ================= */

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [leadRes, catRes, refRes, areaRes, userRes, stageRes] =
          await Promise.all([
            axios.get(`${BASE_URL}api/lead/${id}`, { withCredentials: true }),
            axios.get(`${BASE_URL}api/category`),
            axios.get(`${BASE_URL}api/reference`),
            axios.get(`${BASE_URL}api/area`),
            axios.get(`${BASE_URL}api/users`),
            axios.get(`${BASE_URL}api/leadstages`, { withCredentials: true }),
          ]);

        const lead = leadRes.data;

        setLeadData(lead);
        setCategories(catRes.data || []);
        setReferences(refRes.data || []);
        setArea(areaRes.data || []);
        setUsers(userRes.data || []);
        setStageList(stageRes.data.data || []);

        // 🔥 fetch sources based on reference
        if (lead?.reference_id) {
          const sourceRes = await axios.get(
            `${BASE_URL}api/source/${lead.reference_id}`,
            { withCredentials: true },
          );
          setSources(sourceRes.data.sources || []);
        }
      } catch (error) {
        console.error('Failed to load lead view page', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, refreshTrigger]);

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg font-semibold text-gray-600">
        Loading Lead Details...
      </div>
    );
  }

  if (!leadData) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg font-semibold text-red-600">
        Lead not found
      </div>
    );
  }

  /* ================= PAGE UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-3 sm:px-6 py-6">
      {/* CONTENT CARD */}
      <div className="max-w-6xl mx-auto -mt-6 sm:-mt-10">
        <div
          className="
    bg-gray-50 dark:bg-boxdark
    rounded-xl
    shadow-xl
    border border-gray-200 dark:border-strokedark
    overflow-hidden
  "
        >
          {/* IMPORTANT:
              We reuse UpdateActiveLeads but
              overlay is already removed from page context */}
          <UpdateActiveLeads
            open={true}
            onClose={() => navigate(-1)}
            leadData={leadData}
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
      </div>
    </div>
  );
};

export default LeadViewPage;
