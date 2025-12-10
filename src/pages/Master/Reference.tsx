// import { useState, useEffect } from "react";
// import axios from "axios";
// import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import { BASE_URL } from "../../../public/config.js";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import AddReferenceForm from './AddReferenceForm'
// import EditReference from './EditReference';


// const Reference = () => {
//   const [reference, setReference] = useState([]);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedReference, setSelectedReference] = useState(null);


//   // Fetch reference
//   useEffect(() => {
//     const fetchreference = async () => {
//       try {
//         const response = await axios.get(BASE_URL + "api/reference");
//         setReference(response.data);
//         setFilteredData(response.data);
//       } catch (error) {
//         console.error("Error fetching reference:", error);
//       }
//     };
//     fetchreference();
//   }, []);


//   // Handle delete
//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this reference?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${BASE_URL}api/reference/${id}`);
//       const updatedreference = reference.filter((reference) => reference.reference_id !== id);
//       setReference(updatedreference);
//       setFilteredData(updatedreference);
//       alert("Reference deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting reference:", error);
//       alert("Failed to delete reference.");
//     }
//   };

//   // Handle search
//   const handleSearch = () => {
//     const filtered = reference.filter((reference) =>
//       Object.values(reference).some((value) =>
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     setFilteredData(filtered);
//   };

//   return (
//     <div>
//       <Breadcrumb pageName="Manage References" />
//       <div className=" flex justify-content-between">
//         {/* Add Reference Button */}
//         <div className="mb-4 mr-5">
//             <button
//               onClick={() => setShowPopup(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Add Reference
//             </button>
//           </div>

//           {/* Search Bar */}
//           <div className="flex mb-5">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border rounded px-4 py-2 mr-2"
//               placeholder="Search References..."
//             />
//             <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
//               Search
//             </button>
//           </div>  
//       </div>
          
//           {/* Popup Form */}
// {showPopup && selectedReference === null && (
//   <AddReferenceForm
//           onClose={() => setShowPopup(false)}
//           onReferenceAdded={() => {
//             axios.get(BASE_URL + "api/reference").then((response) => {
//               setReference(response.data);
//               setFilteredData(response.data);
//               //  setSelectedReference(null);
//               //  setShowPopup(true);
//               setSuccessMessage("Reference added successfully!");
//               setTimeout(() => setSuccessMessage(""), 2000);
//             });
//           } } referenceToEdit={undefined}  />
// )}

// {showPopup && selectedReference !== null && (
//   <EditReference
//     referenceToEdit={selectedReference}
//     onClose={() => {
//       setShowPopup(false);
//       setSelectedReference(null);
//     }}
//     onReferenceUpdated={() => {
//       axios.get(BASE_URL + "api/reference").then((response) => {
//         setReference(response.data);
//         setFilteredData(response.data);
//         setSuccessMessage("Reference updated successfully!");
//         setTimeout(() => setSuccessMessage(""), 2000);
//       });
//     }}
//   />
// )}


//       {/* Reference List */}
//       <div className="max-w-full mt-2 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
//         {/* {successMessage && (
//           <div className="mb-4 text-green-600 text-sm text-center">
//             {successMessage}
//           </div>
//         )} */}
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 text-left dark:bg-meta-4">
//             <th className=" py-4 w-50 px-4 font-medium text-black dark:text-white xl:pl-11">
//                  Reference ID
//               </th>
//               <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
//                  Reference From
//               </th>
//               <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
//                  Status
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((reference) => (
//                 <tr key={reference.reference_id}>
//                   <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark xl:pl-11 ">
//                     <h5 className="font-medium text-black dark:text-white">
//                       {reference.reference_id}
//                     </h5>
//                   </td>
//                   <td className="border-b border-[#eee] py-3 px-0  dark:border-strokedark xl:pl-11">
//                     <h5 className="font-medium text-black dark:text-white">
//                       {reference.reference_name}
//                     </h5>
//                   </td>
//                    <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark xl:pl-11">
//                     <p
//                       className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
//                         reference.status === "active"
//                           ? "bg-success text-success"
//                           : "bg-danger text-danger"
//                       }`}
//                     >
//                       {reference.status.charAt(0).toUpperCase() + reference.status.slice(1)}
//                     </p>
//                   </td>
//                   <td className="border-b border-[#eee] py-3 px-5 dark:border-strokedark">
//                     <div className="flex items-center gap-2">
//                       <button
//                         className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-green-600"
//                         onClick={() => {
//                           setSelectedReference(reference);
//                           setShowPopup(true);
//                         }}
//                       >
//                         <FontAwesomeIcon icon={faEdit} className="text-white" />
//                       </button>
//                       <button
//                         className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
//                         onClick={() => handleDelete(reference.reference_id)}
//                       >
//                         <FontAwesomeIcon icon={faTrash} className="text-white" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="text-center py-5">
//                   No reference found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
    
//     </div>
//   );
// };

// export default Reference;





















// import { useState,useEffect } from 'react';
// import axios from "axios";
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// // import { BASE_URL } from '../../../public/config.js';
// import {BASE_URL} from '../../../public/config.js'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash  } from '@fortawesome/free-solid-svg-icons';

// const Reference = () => {
//   // State to hold form data
//   const [formData, setFormData] = useState({
//     cat_name: '',

//   });

  
//   // Handle input changes
//   const handleChange = (e: { target: { name: any; value: any; }; }) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };



//   // Handle form submission
//   const [feedback, setFeedback] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(BASE_URL + 'api/reference', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await response.json();
//       setFeedback('Reference added successfully!');
//       setTimeout(() => setFeedback(''), 3000); 
  
//       setFormData({
//         cat_name: '',
//       });
  
//     } catch (error) {
//       setFeedback('Error occurred. Please try again.');
//     }
//   };


//   type References = {
//     reference_id: number;
//     cat_name: string;
//   };
//   const [reference, setreference] = useState<References[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredData, setFilteredData] = useState<References[]>([]);

//   // Fetch reference from the backend
//   useEffect(() => {
//     const fetchreference = async () => {
//       try {
//         const response = await fetch(BASE_URL + "api/reference");
//         if (!response.ok) throw new Error("Network response was not ok");

//         const data = await response.json();
//         const formattedData = data.map((reference: any) => ({
//           reference_id: reference.reference_id,
//           cat_name: reference.cat_name,
//         }));

//         setreference(formattedData);
//         setFilteredData(formattedData);
//       } catch (error) {
//         console.error("Error fetching reference:", error);
//       }
//     };

//     fetchreference();
//   }, []);

//   // Handle search functionality
//   const handleSearch = () => {
//     const filtered = reference.filter((reference) =>
//       Object.values(reference).some((value) =>
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     setFilteredData(filtered);
//   };

//   const handleDelete = async (id: number) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this reference?");
//     if (!confirmDelete) return;
  
//     try {
//       // Use Axios to send the DELETE request
//       const response = await axios.delete(`${BASE_URL}api/reference/${id}`);
  
//       // Check response status and update the frontend
//       if (response.status === 200) {
//         // Filter out the deleted reference from the state
//         const updatedreference = reference.filter((reference) => reference.reference_id !== id);
//         setreference(updatedreference);
//         setFilteredData(updatedreference);
  
//         alert("Reference deleted successfully!");
//       } else {
//         throw new Error("Failed to delete reference");
//       }
//     } catch (error) {
//       console.error("Error deleting reference:", error);
//       alert(error.response?.data?.error || "Failed to delete reference");
//     }
//   };












  
//   return (
//     <div>
//       <Breadcrumb pageName="Manage References" />
//       <div className="grid grid-cols-1 sm:grid-cols-1 m-5">
//         <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//           <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
//             <h3 className="font-medium text-black dark:text-white">
//               Add new References
//             </h3>
//             <h4>{feedback && <p className="text-center text-green-500">{feedback}</p>}
//             </h4>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="p-6.5">
//               {/* Name */}
//               <div className="mb-4.5">
//                 <label className="mb-2.5 block text-black dark:text-white">
//                   New reference
//                 </label>
//                 <input
//                   type="text"
//                   name="cat_name"
//                   value={formData.cat_name}
//                   onChange={handleChange}
//                   placeholder="Enter new Reference"
//                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                   required
//                 />
//               </div>

              
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
//                 // onSubmit={handleSubmit}
//               >
//                 Save Reference
//               </button>
//             </div>
//           </form>
//         </div>






// {/* ---------------------- reference list ----------------------------  */}






//       {/* Search Bar Section */}
//       <div className="flex items-center mb-5 mt-8">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border rounded px-10 py-2 mr-2"
//           placeholder="Search reference..."
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Search
//         </button>
//       </div>

      // <div className="max-w-full mt-2 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
      //   <table className="w-full table-auto">
      //     <thead>
      //       <tr className="bg-gray-200 text-left dark:bg-meta-4">
      //       <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
      //            Reference ID
      //         </th>
      //         <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
      //            Reference Name
      //         </th>
      //         <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
      //       </tr>
      //     </thead>
      //     <tbody>
      //       {filteredData.length > 0 ? (
      //         filteredData.map((reference) => (
      //           <tr key={reference.reference_id}>
      //               <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
      //               <h5 className="font-medium text-black dark:text-white">
      //                 {reference.reference_id}
      //               </h5>


      //             </td>
      //             <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
      //               <h5 className="font-medium text-black dark:text-white">
      //                 {reference.cat_name}
      //               </h5>


      //             </td>
      //             <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
      //               <div className="flex items-center gap-2">

      //                 <button
      //                   className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
      //                   onClick={() => handleDelete(reference.reference_id)}
      //                 >
      //                   <FontAwesomeIcon icon={faTrash} className="text-white" />
      //                 </button>
      //               </div>
      //             </td>
      //           </tr>
      //         ))
      //       ) : (
      //         <tr>
      //           <td colSpan={6} className="text-center py-5">
      //             No reference found
      //           </td>
      //         </tr>
      //       )}
      //     </tbody>
      //   </table>
      // </div>









//       </div>
//     </div>
//   );
// };

// export default Reference;





















import { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faAdd } from '@fortawesome/free-solid-svg-icons';
import AddReferenceForm from './AddReferenceForm';
import EditReference from './EditReference';

const Reference = () => {
  const [reference, setReference] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddSourcePopup, setShowAddSourcePopup] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);
  const [sourceName, setSourceName] = useState('');
  const [sourceFeedback, setSourceFeedback] = useState('');
  const [sourceList, setSourceList] = useState([]);

  // Fetch reference list
  const loadReference = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/reference');
      setReference(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching reference:', error);
    }
  };

  useEffect(() => {
    loadReference();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this reference?',
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}api/reference/${id}`);
      const updated = reference.filter((item) => item.reference_id !== id);
      setReference(updated);
      setFilteredData(updated);
      alert('Reference deleted successfully!');
    } catch (error) {
      console.error('Error deleting reference:', error);
      alert('Failed to delete reference.');
    }
  };

  // Search filter
  const handleSearch = () => {
    const filtered = reference.filter((ref) =>
      Object.values(ref).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setFilteredData(filtered);
  };

  // Add Source Submit Handler
  const handleAddSource = async (e) => {
    e.preventDefault();

    const data = {
      source_name: sourceName,
      reference_id: selectedReference.reference_id,
    };

    try {
      await axios.post(`${BASE_URL}api/addsource`, data, {
        withCredentials: true,
      });

      setSourceFeedback('Source added successfully!');

      setTimeout(() => {
        setSourceFeedback('');
        setSourceName('');
        setShowAddSourcePopup(false);
        loadReference();
      }, 1200);
    } catch (error) {
      console.error('Error adding source:', error);
      setSourceFeedback('Failed to add source');
    }
  };

  useEffect(() => {
    if (selectedReference && showAddSourcePopup) {
      fetchSources(selectedReference.reference_id);
    }
  }, [selectedReference, showAddSourcePopup]);

  const fetchSources = async (referenceId) => {
    try {
      const response = await axios.get(`${BASE_URL}api/source/${referenceId}`, {
        withCredentials: true,
      });

      setSourceList(response.data.sources || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Manage References" />

      <div className="flex justify-between">
        <div className="mb-4 mr-5">
          <button
            onClick={() => {
              setSelectedReference(null);
              setShowPopup(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Reference
          </button>
        </div>

        <div className="flex mb-5">
          <input
            type="text"
            className="border rounded px-4 py-2 mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* Add / Edit Reference Popup */}
      {showPopup && selectedReference === null && (
        <AddReferenceForm
          onClose={() => setShowPopup(false)}
          onReferenceAdded={loadReference}
        />
      )}

      {showPopup && selectedReference !== null && (
        <EditReference
          referenceToEdit={selectedReference}
          onClose={() => {
            setShowPopup(false);
            setSelectedReference(null);
          }}
          onReferenceUpdated={loadReference}
        />
      )}

      {showAddSourcePopup && selectedReference && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              Add Source for:
              <span className="text-green-700">
                {' '}
                {selectedReference.reference_name}
              </span>
            </h2>

            {/* -------- Existing Sources -------- */}
            <div className="mb-4 border rounded p-3 bg-gray-50 max-h-48 overflow-y-auto">
              <h3 className="font-medium mb-2">Existing Sources:</h3>

              {sourceList.length > 0 ? (
                <ul className="space-y-1">
                  {sourceList.map((src) => (
                    <li
                      key={src.source_id}
                      className="px-3 py-1 bg-gray-200 rounded text-sm"
                    >
                      {src.source_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No sources yet.</p>
              )}
            </div>

            {/* -------- Add New Source -------- */}
            <form onSubmit={handleAddSource}>
              <label className="block mb-2 font-medium">Source Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-3"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="Enter source name"
                required
              />

              {sourceFeedback && (
                <p className="text-green-600 mb-2">{sourceFeedback}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => {
                    setShowAddSourcePopup(false);
                    setSelectedReference(null);
                    setSourceName('');
                    setSourceList([]);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="max-w-full mt-2 overflow-hidden rounded border bg-white shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4">Reference ID</th>
              <th className="py-4 px-4">Reference From</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.reference_id}>
                  <td className="border-b py-3 px-4">{item.reference_id}</td>
                  <td className="border-b py-3 px-4">{item.reference_name}</td>
                  <td className="border-b py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        item.status === 'active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="border-b py-3 px-4">
                    <div className="flex items-center gap-2">
                      {/* ADD SOURCE */}
                      <button
                        className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => {
                          setSelectedReference(item);
                          setShowAddSourcePopup(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faAdd} />
                      </button>

                      {/* EDIT */}
                      <button
                        className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => {
                          setSelectedReference(item);
                          setShowPopup(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      {/* DELETE */}
                      <button
                        className="py-1 px-3 bg-black text-white rounded hover:bg-gray-800"
                        onClick={() => handleDelete(item.reference_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-5">
                  No reference found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reference;