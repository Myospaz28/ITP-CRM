// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
// import { BASE_URL } from '../../../public/config.js';
// import ViewMeetingPopup from './MeetingPopup.js';

// const MeetingScheduleTable = () => {
//   const [schedules, setSchedules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editData, setEditData] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedMeetingId, setSelectedMeetingId] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [filterDate, setFilterDate] = useState('');
//   const [filterName, setFilterName] = useState('');
//   const [filterContact, setFilterContact] = useState('');
//   const [fromFollowupDate, setFromFollowupDate] = useState('');
//   const [toFollowupDate, setToFollowupDate] = useState('');
//   const [filteredFollowups, setFilteredFollowups] = useState([]);
//   const [followups, setFollowups] = useState([]);

//   const [filterDateFrom, setFilterDateFrom] = useState('');
//   const [filterDateTo, setFilterDateTo] = useState('');
//   const [filteredResults, setFilteredResults] = useState([]);
//   const [dropdownOptions, setDropdownOptions] = useState([]);
//   const [filterDropdown, setFilterDropdown] = useState('');

//   const formatDateLocal = (dateStr) => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     const offset = date.getTimezoneOffset();
//     const localDate = new Date(date.getTime() - offset * 60 * 1000);
//     return localDate.toISOString().split('T')[0];
//   };

//   useEffect(() => {
//     const filtered = schedules.filter((item) => {
//       const nameMatch = item.clientName
//         ? item.clientName.toLowerCase().includes(filterName.toLowerCase())
//         : false;

//       const meetingDate = new Date(item.meetingDate);
//       meetingDate.setHours(0, 0, 0, 0);

//       const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
//       if (fromDate) fromDate.setHours(0, 0, 0, 0);

//       const toDate = filterDateTo ? new Date(filterDateTo) : null;
//       if (toDate) toDate.setHours(0, 0, 0, 0);

//       const fromMatch = fromDate ? meetingDate >= fromDate : true;
//       const toMatch = toDate ? meetingDate <= toDate : true;

//       const dropdownMatch = filterDropdown
//         ? item.meetingType === filterDropdown
//         : true;

//       return nameMatch && fromMatch && toMatch && dropdownMatch;
//     });

//     setFilteredResults(filtered);
//   }, [filterName, filterDateFrom, filterDateTo, filterDropdown, schedules]);

//   // useEffect(() => {
//   //   const fetchSchedules = async () => {
//   //     try {
//   //       const response = await axios.get(`${BASE_URL}api/meeting/schedule`, {
//   //         withCredentials: true,
//   //       });
//   //       console.log('meeting schedule', response);
//   //       setSchedules(response.data.data || []);
//   //     } catch (err) {
//   //       console.error(err);
//   //       setError('Failed to fetch meeting schedules');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchSchedules();
//   // }, []);

//   useEffect(() => {
//     const fetchSchedules = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/meeting/schedule`, {
//           withCredentials: true,
//         });

//         const data = response.data.data || [];
//         setSchedules(data);

//         const uniqueTypes = Array.from(
//           new Set(data.map((item) => item.meetingType).filter(Boolean)),
//         );

//         setDropdownOptions(uniqueTypes);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch meeting schedules');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchedules();
//   }, []);

//   const openEditPopup = (data) => {
//     setEditData(data);
//     setShowEditModal(true);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(` ${BASE_URL}api/meeting/update_schedule`, editData, {
//         withCredentials: true,
//       });
//       setShowEditModal(false);
//       window.location.reload();
//     } catch (err) {
//       alert('Update failed');
//     }
//   };

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   const openViewPopup = (meetingId) => {
//     setSelectedMeetingId(meetingId);
//     setShowViewModal(true);
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Meeting Schedules</h2>
//       <div className="mb-4">
//         <div className="flex flex-wrap gap-4 items-end">
//           {/* Search by Client Name */}
//           <div className="w-full sm:w-1/4">
//             <label className="block text-sm font-medium mb-1">Search</label>
//             <input
//               type="text"
//               placeholder="Filter by Client Name"
//               className="w-full p-2 border border-gray-300 rounded"
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//             />
//           </div>

//           {/* Date Filter */}
//           <div className="w-full sm:w-1/4">
//             <label className="block text-sm font-medium mb-1">
//               Meeting Date
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="date"
//                 className="w-1/2 p-2 border border-gray-300 rounded"
//                 value={filterDateFrom}
//                 onChange={(e) => setFilterDateFrom(e.target.value)}
//                 placeholder="From"
//               />
//               <input
//                 type="date"
//                 className="w-1/2 p-2 border border-gray-300 rounded"
//                 value={filterDateTo}
//                 onChange={(e) => setFilterDateTo(e.target.value)}
//                 placeholder="To"
//               />
//             </div>
//           </div>

//           {/* Dropdown Filter */}
//           <div className="w-full sm:w-1/4">
//             <label className="block text-sm font-medium mb-1">
//               Filter by Type
//             </label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={filterDropdown}
//               onChange={(e) => setFilterDropdown(e.target.value)}
//             >
//               <option value="">All</option>
//               {dropdownOptions.map((type, idx) => (
//                 <option key={idx} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-auto">
//         <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr className="bg-gray-200 text-left dark:bg-meta-4">
//               <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
//                 Meeting ID
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
//                 Client Name
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
//                 Client Contact
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
//                 Meeting Date
//               </th>
//               {/* <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">Next Meeting Date</th> */}
//               <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
//                 Remark
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
//                 Status
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white whitespace-nowrap">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {schedules
//               .filter(
//                 (schedule) =>
//                   (!filterName ||
//                     schedule.client_name
//                       .toLowerCase()
//                       .includes(filterName.toLowerCase())) &&
//                   (!filterContact ||
//                     schedule.client_contact
//                       .toLowerCase()
//                       .includes(filterContact.toLowerCase())) &&
//                   (!filterDate ||
//                     formatDateLocal(schedule.meeting_date) === filterDate),
//               )
//               .map((schedule) => (
//                 <tr
//                   key={schedule.meeting_id}
//                   className="border-t hover:bg-gray-50"
//                 >
//                   <td className="border-b py-3 px-4 dark:border-strokedark">
//                     {schedule.meeting_id}
//                   </td>
//                   <td className="border-b py-3 px-4 dark:border-strokedark">
//                     {schedule.client_name}
//                   </td>
//                   <td className="border-b py-3 px-4 dark:border-strokedark">
//                     {schedule.client_contact}
//                   </td>
//                   <td className="border-b py-3 px-4 dark:border-strokedark">
//                     {schedule.meeting_date
//                       ? new Date(schedule.next_meeting_date).toLocaleDateString(
//                           'en-GB',
//                         )
//                       : '-'}
//                   </td>

//                   <td className="border-b py-3 px-4 dark:border-strokedark">
//                     {schedule.meeting_remark}
//                   </td>
//                   <td className="border-b py-3 px-4 dark:border-strokedark">
//                     <p
//                       className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
//                         schedule.meeting_status === 'Meeting Scheduled'
//                           ? 'bg-gray-500 text-gray-500'
//                           : schedule.meeting_status === 'next follow up'
//                           ? 'bg-purple-300 text-purple-600'
//                           : schedule.meeting_status === 'lead converted'
//                           ? 'bg-green-300 text-green-600'
//                           : schedule.meeting_status === 'lead cancelled'
//                           ? 'bg-red-300 text-red-600'
//                           : 'bg-green-100 text-green-800'
//                       }`}
//                     >
//                       {schedule.meeting_status}
//                     </p>
//                   </td>

//                   <td className="border-b py-3 px-4 dark:border-strokedark flex gap-2">
//                     <button
//                       onClick={() => openEditPopup(schedule)}
//                       className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-meta-3 hover:bg-opacity-75"
//                       title="Edit"
//                     >
//                       <FontAwesomeIcon icon={faEdit} />
//                     </button>
//                     <button
//                       onClick={() => openViewPopup(schedule.meeting_id)}
//                       className="inline-flex items-center justify-center rounded-md py-1 px-3 text-white bg-blue-600 hover:bg-blue-700"
//                       title="View Details"
//                     >
//                       <FontAwesomeIcon icon={faEye} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//         {showViewModal && selectedMeetingId && (
//           <ViewMeetingPopup
//             meetingId={selectedMeetingId}
//             onClose={() => setShowViewModal(false)}
//           />
//         )}
//       </div>

//       {showEditModal && editData && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
//             <h3 className="text-lg font-bold mb-4">Edit Meeting Schedule</h3>
//             <form onSubmit={handleUpdate}>
//               <label className="mb-2.5 block text-black dark:text-white">
//                 Client Name
//                 <input
//                   type="text"
//                   className="w-full border p-2 mb-2"
//                   placeholder="Client Name"
//                   value={editData.client_name}
//                   onChange={(e) =>
//                     setEditData({ ...editData, client_name: e.target.value })
//                   }
//                 />
//               </label>

//               <label className="mb-2.5 block text-black dark:text-white">
//                 Client Contact
//                 <input
//                   type="text"
//                   className="w-full border p-2 mb-2"
//                   placeholder="Client Contact"
//                   value={editData.client_contact}
//                   onChange={(e) =>
//                     setEditData({ ...editData, client_contact: e.target.value })
//                   }
//                 />
//               </label>

//               <label className="mb-2.5 block text-black dark:text-white">
//                 Meeting Date
//                 <input
//                   type="date"
//                   className="w-full border p-2 mb-2"
//                   value={formatDateLocal(editData.meeting_date)}
//                   onChange={(e) =>
//                     setEditData({ ...editData, meeting_date: e.target.value })
//                   }
//                 />
//               </label>

//               <label className="mb-2.5 block text-black dark:text-white">
//                 Next Meeting Date
//                 <input
//                   type="date"
//                   className="w-full border p-2 mb-2"
//                   value={formatDateLocal(editData.next_meeting_date)}
//                   onChange={(e) =>
//                     setEditData({
//                       ...editData,
//                       next_meeting_date: e.target.value,
//                     })
//                   }
//                 />
//               </label>

//               <label className="mb-2.5 block text-black dark:text-white">
//                 Remark
//                 <textarea
//                   className="w-full border p-2 mb-2"
//                   placeholder="Remark"
//                   value={editData.meeting_remark}
//                   onChange={(e) =>
//                     setEditData({ ...editData, meeting_remark: e.target.value })
//                   }
//                 />
//               </label>

//               <label className="mb-2.5 block text-black dark:text-white">
//                 Status
//                 <select
//                   className="w-full border p-2 mb-2"
//                   value={editData.meeting_status}
//                   onChange={(e) =>
//                     setEditData({ ...editData, meeting_status: e.target.value })
//                   }
//                 >
//                   <option value="Meeting Scheduled">Meeting Scheduled</option>
//                   <option value="next follow up">Next Follow Up</option>
//                   <option value="lead converted">Lead Converted</option>
//                   <option value="lead cancelled">Lead Cancelled</option>
//                 </select>
//               </label>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="px-4 py-2 bg-gray-300 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MeetingScheduleTable;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../../public/config.js';
import ViewMeetingPopup from './MeetingPopup.js';

const MeetingScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterContact, setFilterContact] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  const formatDateLocal = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const result = schedules.filter((schedule) => {
      const clientMatch =
        !filterName ||
        schedule.client_name.toLowerCase().includes(filterName.toLowerCase());

      const contactMatch =
        !filterContact ||
        schedule.client_contact
          .toLowerCase()
          .includes(filterContact.toLowerCase());

      const exactDateMatch =
        !filterDate || formatDateLocal(schedule.meeting_date) === filterDate;

      const meetingDate = formatDateLocal(schedule.meeting_date);
      const dateFromMatch = !filterDateFrom || meetingDate >= filterDateFrom;
      const dateToMatch = !filterDateTo || meetingDate <= filterDateTo;

      const statusMatch =
        !filterStatus || schedule.meeting_status === filterStatus;

      return (
        clientMatch &&
        contactMatch &&
        exactDateMatch &&
        dateFromMatch &&
        dateToMatch &&
        statusMatch
      );
    });

    setFilteredSchedules(result);
  }, [
    schedules,
    filterName,
    filterContact,
    filterDate,
    filterDateFrom,
    filterDateTo,
    filterStatus,
  ]);

  // useEffect(() => {
  //   const fetchSchedules = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}api/meeting/schedule`, {
  //         withCredentials: true,
  //       });
  //       console.log("meeting schedule",response)
  //       setSchedules(response.data.data || []);
  //     } catch (err) {
  //       console.error(err);
  //       setError('Failed to fetch meeting schedules');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSchedules();
  // }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/meeting/schedule`, {
          withCredentials: true,
        });
        const data = response.data.data || [];
        setSchedules(data);

        // Extract unique statuses for dropdown
        const statuses = [...new Set(data.map((item) => item.meeting_status))];
        setUniqueStatuses(statuses);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch meeting schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const openEditPopup = (data) => {
    setEditData(data);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(` ${BASE_URL}api/meeting/update_schedule`, editData, {
        withCredentials: true,
      });
      setShowEditModal(false);
      window.location.reload();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const openViewPopup = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setShowViewModal(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Meeting Schedules</h2>
      <div className="mb-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className='w-full sm:w-1/4"'>
              <label className="block text-sm font-medium mb-1">
                client name
              </label>
              <input
                type="text"
                placeholder="Client Name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="w-full sm:w-1/4">
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-1/4">
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-1/4">
            <label className="block text-sm font-medium mb-1">
              Meeting Status
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              {uniqueStatuses.map((status, idx) => (
                <option key={idx} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="overflow-auto p-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                'Meeting ID',
                'Client Name',
                'Client Contact',
                'Meeting Date',
                'Next Meeting Date',
                'Remark',
                'Status',
                'Action',
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-left font-semibold text-black dark:text-white whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr
                key={schedule.meeting_id}
                className="border-t hover:bg-gray-50 transition duration-200"
              >
                <td className="py-3 px-4">{schedule.meeting_id}</td>
                <td className="py-3 px-4">{schedule.client_name}</td>
                <td className="py-3 px-4">{schedule.client_contact}</td>
                <td className="py-3 px-4">
                  {schedule.meeting_date
                    ? new Date(schedule.meeting_date).toLocaleDateString(
                        'en-GB',
                      )
                    : '-'}
                </td>
                <td className="py-3 px-4">
                  {schedule.next_meeting_date
                    ? new Date(schedule.next_meeting_date).toLocaleDateString(
                        'en-GB',
                      )
                    : '-'}
                </td>
                <td className="py-3 px-4">{schedule.meeting_remark}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      schedule.meeting_status === 'Meeting Scheduled'
                        ? 'bg-gray-300 text-gray-700'
                        : schedule.meeting_status === 'next follow up'
                        ? 'bg-purple-200 text-purple-700'
                        : schedule.meeting_status === 'lead converted'
                        ? 'bg-green-200 text-green-700'
                        : schedule.meeting_status === 'lead cancelled'
                        ? 'bg-red-200 text-red-700'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {schedule.meeting_status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditPopup(schedule)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-white bg-meta-3 hover:bg-opacity-75"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => openViewPopup(schedule.meeting_id)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-white bg-blue-600 hover:bg-blue-700"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                  {showViewModal && selectedMeetingId && (
                    <ViewMeetingPopup
                      meetingId={selectedMeetingId}
                      onClose={() => setShowViewModal(false)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    {/* edit model */}
      {showEditModal && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
            <h3 className="text-lg font-bold mb-4">Edit Meeting Schedule</h3>
            <form onSubmit={handleUpdate}>
              <label className="mb-2.5 block text-black dark:text-white">
                Client Name
                <input
                  type="text"
                  className="w-full border p-2 mb-2"
                  placeholder="Client Name"
                  value={editData.client_name}
                  onChange={(e) =>
                    setEditData({ ...editData, client_name: e.target.value })
                  }
                />
              </label>

              <label className="mb-2.5 block text-black dark:text-white">
                Client Contact
                <input
                  type="text"
                  className="w-full border p-2 mb-2"
                  placeholder="Client Contact"
                  value={editData.client_contact}
                  onChange={(e) =>
                    setEditData({ ...editData, client_contact: e.target.value })
                  }
                />
              </label>

              <label className="mb-2.5 block text-black dark:text-white">
                Meeting Date
                <input
                  type="date"
                  className="w-full border p-2 mb-2"
                  value={formatDateLocal(editData.meeting_date)}
                  onChange={(e) =>
                    setEditData({ ...editData, meeting_date: e.target.value })
                  }
                />
              </label>

              <label className="mb-2.5 block text-black dark:text-white">
                Next Meeting Date
                <input
                  type="date"
                  className="w-full border p-2 mb-2"
                  value={formatDateLocal(editData.next_meeting_date)}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      next_meeting_date: e.target.value,
                    })
                  }
                />
              </label>

              <label className="mb-2.5 block text-black dark:text-white">
                Remark
                <textarea
                  className="w-full border p-2 mb-2"
                  placeholder="Remark"
                  value={editData.meeting_remark}
                  onChange={(e) =>
                    setEditData({ ...editData, meeting_remark: e.target.value })
                  }
                />
              </label>

              <label className="mb-2.5 block text-black dark:text-white">
                Status
                <select
                  className="w-full border p-2 mb-2"
                  value={editData.meeting_status}
                  onChange={(e) =>
                    setEditData({ ...editData, meeting_status: e.target.value })
                  }
                >
                  <option value="Meeting Scheduled">Meeting Scheduled</option>
                  <option value="next follow up">Next Follow Up</option>
                  <option value="lead converted">Lead Converted</option>
                  <option value="lead cancelled">Lead Cancelled</option>
                </select>
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduleTable;
