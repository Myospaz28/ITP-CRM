// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config.js';

// // Types
// interface LeadLog {
//   leadlog_id: number;
//   previous_leads: string;
//   previous_sub_leads: string;
//   new_leads: string;
//   new_sub_leads: string;
//   remark: string | null;
//   updated_at: string; // ISO string
// }

// interface Assignment {
//   assign_id: number;
//   assigned_to: string;
//   assigned_to_user_id: number;
//   assign_date: string | null;
//   target_date: string | null;
//   mode: string;
//   cat_id: number;
//   assign_remark: string | null;
// }

// interface LeadDetailsData {
//   lead: any; // define properly if needed
//   logs: LeadLog[];
//   assignment: Assignment | null;
// }

// interface LeadDetailsPageProps {
//   masterId: number;
//   onBack: () => void;
// }

// const LeadDetailsPage: React.FC<LeadDetailsPageProps> = ({ masterId, onBack }) => {
//   const [data, setData] = useState<LeadDetailsData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchLeadDetails = async () => {
//     try {
//       const res = await axios.get<LeadDetailsData>(`${BASE_URL}api/lead-details/${masterId}`, {
//         withCredentials: true,
//       });
//       setData(res.data);
//     } catch (err) {
//       console.error('Error fetching details:', err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchLeadDetails();
//   }, [masterId]);

//   if (loading)
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//         <div className="bg-white p-5 rounded-lg shadow">Loading...</div>
//       </div>
//     );

//   if (!data)
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//         <div className="bg-white p-5 rounded-lg shadow">No Data Found</div>
//       </div>
//     );

//   const { logs, assignment } = data;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 pt-10">
//       {/* MODAL BOX */}
//       <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-xl relative">
//         {/* TOP BUTTONS */}
//         <div className="flex justify-between items-center mb-4">
//           <button
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//             onClick={onBack}
//           >
//             ⬅ Back
//           </button>
//           <button
//             className="text-xl font-bold bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
//             onClick={onBack}
//           >
//             ✖
//           </button>
//         </div>

//         <h2 className="text-xl font-bold mb-4">Stage Logs</h2>

//         <div className="bg-white shadow rounded-lg p-3 border">
//           {logs.length === 0 ? (
//             <p className="text-gray-500">No logs available</p>
//           ) : (
//             <table className="w-full text-sm border table-auto">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Assigned To</th>
//                   <th className="p-2 border">Stage</th>
//                   <th className="p-2 border">Sub Stage</th>
//                   <th className="p-2 border">Remark</th>
//                   <th className="p-2 border">Date & Time</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {[...logs]
//                   .sort(
//                     (a, b) =>
//                       new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
//                   )
//                   .map((log) => (
//                     <tr key={log.leadlog_id} className="border-b">
//                       <td className="p-2 font-semibold text-indigo-600">
//                         {assignment?.assigned_to || 'N/A'}
//                       </td>
//                       <td className="p-2">{log.new_leads}</td>
//                       <td className="p-2">{log.new_sub_leads}</td>
//                       <td className="p-2">{log.remark || 'No remark'}</td>
//                      <td className="p-2">
//                         {new Date(log.updated_at).toLocaleString('en-GB', {
//                           day: '2-digit',
//                           month: '2-digit',
//                           year: 'numeric',
//                           hour: '2-digit',
//                           minute: '2-digit',
//                           hour12: true,
//                         })}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadDetailsPage;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config.js';

// /* ---------------- TYPES ---------------- */

// interface LeadLog {
//   leadlog_id: number;
//   previous_leads: string;
//   previous_sub_leads: string;
//   new_leads: string;
//   new_sub_leads: string;
//   remark: string | null;
//   updated_at: string;
//   previous_assigned_user_id: number | null;
//   previous_assigned_user_name: string | null;
// }

// interface Assignment {
//   assign_id: number;
//   assigned_to: string;
//   assigned_to_user_id: number;
//   assign_date: string | null;
//   target_date: string | null;
//   mode: string | null;
//   cat_id: number;
//   assign_remark: string | null;
// }

// interface LeadDetailsData {
//   lead: any;
//   logs: LeadLog[];
//   assignment: Assignment | null;
// }

// interface LeadDetailsPageProps {
//   masterId: number;
//   onBack: () => void;
// }

// /* ---------------- COMPONENT ---------------- */

// const LeadDetailsPage: React.FC<LeadDetailsPageProps> = ({
//   masterId,
//   onBack,
// }) => {
//   const [data, setData] = useState<LeadDetailsData | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchLeadDetails = async () => {
//     try {
//       const res = await axios.get<LeadDetailsData>(
//         `${BASE_URL}api/lead-details/${masterId}`,
//         { withCredentials: true },
//       );
//       setData(res.data);
//     } catch (err) {
//       console.error('Error fetching details:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeadDetails();
//   }, [masterId]);

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//         <div className="bg-white p-5 rounded-lg shadow">Loading...</div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//         <div className="bg-white p-5 rounded-lg shadow">No Data Found</div>
//       </div>
//     );
//   }

//   const { logs, assignment } = data;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 pt-10">
//       <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-xl">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-4">
//           <button
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//             onClick={onBack}
//           >
//             ⬅ Back
//           </button>
//           <button
//             className="text-xl font-bold bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
//             onClick={onBack}
//           >
//             ✖
//           </button>
//         </div>

//         <h2 className="text-xl font-bold mb-4">Stage Logs</h2>

//         {/* TABLE */}
//         <div className="bg-white shadow rounded-lg p-3 border">
//           {logs.length === 0 ? (
//             <p className="text-gray-500">No logs available</p>
//           ) : (
//             <table className="w-full text-sm border table-auto">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Assigned To</th>
//                   <th className="p-2 border">Stage</th>
//                   <th className="p-2 border">Sub Stage</th>
//                   <th className="p-2 border">Remark</th>
//                   <th className="p-2 border">Date & Time</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {[...logs]
//                   .sort(
//                     (a, b) =>
//                       new Date(a.updated_at).getTime() -
//                       new Date(b.updated_at).getTime(),
//                   )
//                   .map((log) => {
//                     const assignedUser =
//                       log.previous_assigned_user_name ||
//                       assignment?.assigned_to ||
//                       'N/A';

//                     return (
//                       <tr key={log.leadlog_id} className="border-b">
//                         <td className="p-2 font-semibold text-indigo-600">
//                           {assignedUser}
//                         </td>
//                         <td className="p-2">{log.new_leads}</td>
//                         <td className="p-2">{log.new_sub_leads}</td>
//                         <td className="p-2">{log.remark || 'No remark'}</td>
//                         <td className="p-2">
//                           {new Date(log.updated_at).toLocaleString('en-GB', {
//                             day: '2-digit',
//                             month: '2-digit',
//                             year: 'numeric',
//                             hour: '2-digit',
//                             minute: '2-digit',
//                             hour12: true,
//                           })}
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadDetailsPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';

interface LeadLog {
  leadlog_id: number;
  previous_leads: string;
  previous_sub_leads: string;
  new_leads: string;
  new_sub_leads: string;
  remark: string | null;
  updated_at: string;
  previous_assigned_user_id: number | null;
  previous_assigned_user_name: string | null;
}

interface Assignment {
  assign_id: number;
  assigned_to: string;
  assigned_to_user_id: number;
  assign_date: string | null;
  target_date: string | null;
  mode: string | null;
  cat_id: number;
  assign_remark: string | null;
}

interface LeadDetailsData {
  lead: any;
  logs: LeadLog[];
  assignment: Assignment | null;
}
interface LeadDetailsPageProps {
  masterId: number;
  onBack: () => void;
}

const LeadDetailsPage: React.FC<LeadDetailsPageProps> = ({
  masterId,
  onBack,
}) => {
  const [data, setData] = useState<LeadDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeadDetails = async () => {
    try {
      const res = await axios.get<LeadDetailsData>(
        `${BASE_URL}api/lead-details/${masterId}`,
        { withCredentials: true },
      );
      setData(res.data);
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [masterId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded-lg shadow">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded-lg shadow">No Data Found</div>
      </div>
    );
  }

  const { logs, assignment } = data;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-xl">
        {/* HEADER */}
        <div className="flex justify-end mb-4">
          <button
            className="text-xl font-bold bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
            onClick={onBack}
          >
            ✖
          </button>
        </div>

        {/* <h2 className="text-xl font-bold mb-4 text-center">Stage Logs</h2> */}

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg p-3 border">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center">No logs available</p>
          ) : (
            <table className="w-full text-sm border table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Assigned To</th>
                  <th className="p-2 border">Stage</th>
                  <th className="p-2 border">Sub Stage</th>
                  <th className="p-2 border">Remark</th>
                  <th className="p-2 border">Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {[...logs]
                  .sort(
                    (a, b) =>
                      new Date(a.updated_at).getTime() -
                      new Date(b.updated_at).getTime(),
                  )
                  .map((log) => {
                    const assignedUser =
                      log.previous_assigned_user_name ||
                      assignment?.assigned_to ||
                      'N/A';

                    return (
                      <tr key={log.leadlog_id} className="border-b">
                        <td className="p-2 font-semibold text-indigo-600">
                          {assignedUser}
                        </td>
                        <td className="p-2">{log.new_leads}</td>
                        <td className="p-2">{log.new_sub_leads}</td>
                        <td className="p-2">{log.remark || 'No remark'}</td>
                        <td className="p-2">
                          {new Date(log.updated_at).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
