// import React, { useEffect, useState } from 'react';
// import { BASE_URL } from '../../../public/config.js';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from '@fortawesome/free-solid-svg-icons';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
// import axios from 'axios';
// import EditTeleCallerForm from './EditCall.js';

// const CallList = () => {
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [filterFromDate, setFilterFromDate] = useState('');

//   const fetchTaleCallerData = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/combined-rawdata`, {
//         withCredentials: true,
//       });
//       console.log('response call', response.data);

//       const uniqueClientsMap = new Map();
//       response.data.forEach((client) => {
//         if (!uniqueClientsMap.has(client.master_id)) {
//           uniqueClientsMap.set(client.master_id, client);
//         }
//       });
//       const uniqueClients = Array.from(uniqueClientsMap.values());

//       setClients(uniqueClients);
//       setFilteredClients(uniqueClients);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchTaleCallerData();
//   }, []);

 
//   useEffect(() => {
//   const lowerSearch = searchTerm.toLowerCase();

//   const filtered = clients.filter((client) => {
//     const clientName = client.client_name?.toLowerCase() || '';
//     const categoryName = client.category?.toLowerCase() || '';
//     const assignIdStr = client.assign_id?.toString() || '';
//     const masterIdStr = client.master_id?.toString() || '';

//     const matchesText =
//       clientName.includes(lowerSearch) ||
//       categoryName.includes(lowerSearch) ||
//       assignIdStr.includes(lowerSearch) ||
//       masterIdStr.includes(lowerSearch);

   
//     return matchesText ;
//   });

//   setFilteredClients(filtered);
// }, [searchTerm, fromDate, toDate, clients]);



//   const handleEdit = (client) => {
//     // console.log("Selected client:", client);
//     console.log('click');
//     setSelectedClient({
//       ...client,
//       master_id: client.master_id,
//       cat_id: client.cat_id,
//     });
//     console.log('selected cleint ', selectedClient);
//     console.log('client : ', client);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = (refresh = false) => {
//     setIsModalOpen(false);
//     setSelectedClient(null);
//     if (refresh) {
//       fetchTaleCallerData();
//     }
//   };

//   const fetchDataAgain = async () => {
//     await fetchTaleCallerData();
//   };

//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Call List" />

//       {successMessage && (
//         <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
//           {successMessage}
//         </div>
//       )}

//       <div className="mb-4">
//         <div className="flex flex-wrap gap-4 items-end">
//           <div className="w-full sm:w-1/3">
//             <label className="block text-sm font-medium mb-1">Search</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Search by client or category name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* <div>
//             <label className="block text-sm font-medium mb-1">From Date</label>
//             <input
//               type="date"
//               className="p-2 border border-gray-300 rounded"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </div> */}

//           {/* <div>
//             <label className="block text-sm font-medium mb-1">To Date</label>
//             <input
//               type="date"
//               className="p-2 border border-gray-300 rounded"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </div> */}
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="py-4 px-4 text-black dark:text-white">
//                 Master Id
//               </th>
//               <th className="py-4 px-4 text-black dark:text-white">
//                 Assign Id
//               </th>
//               <th className="py-4 px-4 text-black dark:text-white">
//                 Client Name
//               </th>
//               <th className="py-4 px-4 text-black dark:text-white">Category</th>
//               {/* <th className="py-4 px-4 text-black dark:text-white">
//                 Assign Date
//               </th> */}
//               {/* <th className="py-4 px-4 text-black dark:text-white">
//                 Target Date
//               </th> */}
//               <th className="py-4 px-4 text-black dark:text-white">
//                 Call Status
//               </th>
//               <th className="py-4 px-4 text-black dark:text-white">
//                 Call Remark
//               </th>

//               <th className="py-4 px-4 text-black dark:text-white">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredClients.map((client, index) => (
//               <tr key={index}>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.master_id}
//                 </td>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.assign_id}
//                 </td>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.client_name}
//                 </td>
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.category}
//                 </td>
//                 {/* <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {new Date(client.assign_date).toLocaleDateString('en-GB')}
//                 </td> */}
//                 {/* <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {new Date(client.target_date).toLocaleDateString('en-GB')}
//                 </td> */}
//                 {/* <td className="border-b py-3 px-4 dark:border-strokedark ">  
//                   {client.call_status}
//                 </td> */}
//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   <span
//                     className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
//                       client.call_status === 'Meeting Scheduled'
//                         ? 'bg-purple-500 text-purple-500'
//                         : client.call_status === 'Interested'
//                         ? 'bg-blue-300 text-blue-600'
//                         : client.call_status === 'Not Interested'
//                         ? 'bg-red-300 text-red-600'
//                         : client.call_status === 'Follow-Up'
//                         ? 'bg-green-300 text-green-600'
//                         : client.call_status === 'Assigned'
//                         ? 'bg-blue-300 text-blue-600'
//                         : 'bg-red-300 text-red-600'
//                     }`}
//                   >
//                     {client.call_status}
//                   </span>
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   {client.call_remark}
//                 </td>

//                 <td className="border-b py-3 px-4 dark:border-strokedark">
//                   <button
//                     onClick={() =>
//                       handleEdit({
//                         ...client,
//                         master_id: client.master_id,
//                         cat_id: client.cat_id,
//                       })
//                     }
//                     className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
//                   >
//                     <FontAwesomeIcon icon={faEdit} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* {isModalOpen && selectedClient && (
//       <EditTeleCallerForm data={selectedClient} onClose={handleModalClose} onUpdate={fetchDataAgain} />
//     )} */}

//       {isModalOpen && selectedClient && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
//             <EditTeleCallerForm
//               data={selectedClient}
//               onClose={handleModalClose}
//               onUpdate={fetchDataAgain}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CallList;



import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPhone } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import axios from 'axios';
import EditTeleCallerForm from './EditCall.js';
import UpdateRawData from '../Rawdata/UpdateRawData.js';

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

const CallList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [error, setError] = useState('');

  const fetchTaleCallerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/combined-rawdata`, {
        withCredentials: true,
      });
      // console.log('response call', response.data);

      const uniqueClientsMap = new Map();
      response.data.forEach((client) => {
        if (!uniqueClientsMap.has(client.master_id)) {
          uniqueClientsMap.set(client.master_id, client);
        }
      });
      const uniqueClients = Array.from(uniqueClientsMap.values());

      setClients(uniqueClients);
      setFilteredClients(uniqueClients);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTaleCallerData();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

 

    const filtered = clients.filter((client) => {
      const clientName = client.name?.toLowerCase() || '';
      const categoryName = client.category?.toLowerCase() || '';
      const assignIdStr = client.assign_id?.toString() || '';
      const masterIdStr = client.master_id?.toString() || '';

    
      const matchesText =
        clientName.includes(lowerSearch) ||
        categoryName.includes(lowerSearch) ||
        assignIdStr.includes(lowerSearch) ||
        masterIdStr.includes(lowerSearch);


      return matchesText ;
    });

    setFilteredClients(filtered);
  }, [searchTerm, fromDate, toDate, clients]);

  const handleEdit = (client) => {
    // console.log("Selected client:", client);
    console.log('click');
    setSelectedClient({
      ...client,
      master_id: client.master_id,
      cat_id: client.cat_id,
    });
    console.log('selected cleint ', selectedClient);
    console.log('client : ', client);
    setIsModalOpen(true);
  };

  const handleModalClose = (refresh = false) => {
    setIsModalOpen(false);
    setSelectedClient(null);
    if (refresh) {
      fetchTaleCallerData();
    }
  };

  const fetchDataAgain = async () => {
    await fetchTaleCallerData();
  };

  const openRawDataEditPopup = (client) => {
    setEditingClient(client);
    setShowEditPopup(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditingClient(null);
  };

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

  //import reference
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

  // import  Fetch Area
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

  return (
    <div className="p-4">
      <Breadcrumb pageName="Call List" />

      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Search by client or category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

     <div className="overflow-x-auto rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark">
  <table className="w-full table-auto">
 <thead>
  <tr className="bg-gray-2 text-left dark:bg-meta-4">
    <th className="py-4 px-4 text-black dark:text-white">Sr No</th>
    <th className="py-4 px-4 text-black dark:text-white">Name</th>
    <th className="py-4 px-4 text-black dark:text-white">Category</th>
    <th className="py-4 px-4 text-black dark:text-white">Source</th>
    <th className="py-4 px-4 text-black dark:text-white">Assigned To</th>
    <th className="py-4 px-4 text-black dark:text-white">Lead Stage</th>
    <th className="py-4 px-4 text-black dark:text-white">Lead Sub Stage</th>
    <th className="py-4 px-4 text-black dark:text-white">Actions</th>
  </tr>
</thead>


 <tbody>
  {filteredClients.map((client, index) => (
    <tr key={index}>

      {/* SR NO */}
      <td className="border-b py-3 px-4 dark:border-strokedark">
        {index + 1}
      </td>

      {/* NAME */}
      <td className="border-b py-3 px-4 dark:border-strokedark">
        {client.name}
      </td>

      {/* CATEGORY */}
      <td className="border-b py-3 px-4 dark:border-strokedark">
        {client.cat_name}
      </td>

      {/* SOURCE */}
      <td className="border-b py-3 px-4 dark:border-strokedark">
        {client.source_name}
      </td>

      {/* ASSIGNED TO USER */}
      <td className="border-b py-3 px-4 dark:border-strokedark">
        {client.assigned_user_name}
      </td>

      {/* LEAD STAGE */}
      <td className="border-b py-3 px-4 dark:border-strokedark">
        {client.stage_name}
      </td>

      {/* LEAD SUB STAGE */}
      <td className="border-b py-3 px-4 dark:border-strokedark">
        {client.lead_sub_stage_name}
      </td>

      {/* ACTIONS */}
      <td className="border-b py-3 px-4 dark:border-strokedark flex gap-2">
        <button
          onClick={() =>
            handleEdit({
              ...client,
              master_id: client.master_id,
              cat_id: client.cat_id,
            })
          }
          className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
        >
          <FontAwesomeIcon icon={faPhone} />
        </button>

        <button
          onClick={() => openRawDataEditPopup(client)}
          className="bg-meta-3 py-1 px-3 rounded text-white hover:bg-opacity-75"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

  </table>
</div>


      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <EditTeleCallerForm
              data={selectedClient}
              onClose={handleModalClose}
              onUpdate={fetchDataAgain}
            />
          </div>
        </div>
      )}

      {showEditPopup && editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <UpdateRawData
              showEditPopup={showEditPopup}
              editingClient={editingClient}
              setEditingClient={setEditingClient}
              closeEditPopup={closeEditPopup}
              fetchRawData={fetchDataAgain}
              categories={categories}
              references={references}
              area={area} sources={[]}            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CallList;