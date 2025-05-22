
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faDownload, faFileImport, faPhone, faLocation } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BASE_URL } from "../../../public/config.js";
import axios from "axios";
import ClientForm from "../Client/EditClient.js";

const RawData = () => {
  type Data = {
    id: number;
    name: string;
    contact: string;
    email: string;
    address: string;
    category: string;
    reference: string;
    userid: number;
  };

  type Client = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    assignedTo:string
  };

  interface Category {
    cat_id: number;
    cat_name: string;
  }

  interface Reference {
    reference_id: number;
    reference_name: string;
  }


 type User = {
  id: number;
  name: string;
  contact: string;
  email: string;
  address: string;
  role: string;
  status: string;
};

interface Props {
  assignData: { assignedTo: string };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  fetchUsers();
}, []);


  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({ cat_id: "", reference: "" });
  const [rawData, setRawData] = useState<Data[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [showAssignPopup, setShowAssignPopup] = useState(false);

  // const [searchTerm, setSearchTerm] = useState("");
  // const [filteredData, setFilteredData] = useState<Data[]>([]);
  // const [importedData, setImportedData] = useState<Data[]>([]);
  //  const [userfilteredData, setuserFilteredData] = useState<User[]>([]);
  // const [clients, setclients] = useState<Client[]>([]);  
  // const [feedback, setFeedback] = useState("");
  // const [data, setData] = useState("");
  // const [selectedClients, setSelectedClients] = useState<number[]>([]);

const [assignData, setAssignData] = useState({
  mode: '',
  assignedTo: '',
  assignDate: today,
  targetDate: today,
  remark: '',
  leadCount: '', 
});


  const entriesPerPage = 50;
  const totalPages = Math.ceil(filteredClients.length / entriesPerPage);



  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setAssignData({ ...assignData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    const formData1 = new FormData();
    formData1.append("file", file);
    formData1.append("cat_id", formData.cat_id);
    formData1.append("reference", formData.reference);
    try {
      const response = await axios.post(`${BASE_URL}api/rawdata/import`, formData1, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (response.status === 200) {
        alert("Success: " + response.data.message);
        setFile(null);
        setFormData({ cat_id: "", reference: "" });
        setShowImportPopup(false);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to import file.";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const fetchRawData = async () => {
      try {
        const response = await fetch(`${BASE_URL}api/raw-data`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          id: item.master_id,
          name: item.name,
          phone: item.number,
          email: item.email,
          address: item.address,
          status: item.status, 
        }));
        setRawData(formattedData);
        setFilteredClients(formattedData);
      } catch (error) {
        console.error("Error fetching Raw Data:", error);
      }
    };
    fetchRawData();
  }, []);

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
        setError("Failed to load references.");
      }
    };
    fetchReferences();
  }, []);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleModalClose = (updatedClient?: Client) => {
    setIsModalOpen(false);
    setSelectedClient(null);
    if (updatedClient) {
      setFilteredClients((prevClients) =>
        prevClients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
      );
      setSuccessMessage("Client details updated successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };
  

const handleAssignSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { mode, assignedTo, assignDate, targetDate, remark, leadCount } = assignData;

  if (!mode || !assignedTo || !leadCount) {
    alert("Please fill all required fields.");
    return;
  }

  const selectedLeads = filteredClients
  .filter((lead) => lead?.status?.toLowerCase?.() === "not assigned")
  .slice(0, Number(leadCount));

  if (selectedLeads.length === 0) {
    alert("No unassigned leads available.");
    return;
  }

  const leadIds = selectedLeads.map((lead) => lead.id);

      try {
        const response = await axios.post(`${BASE_URL}api/assign`, {
      mode,
      assignedTo,
      assignDate,
      targetDate,
      remark,
      leadIds,
      leadCount: leadIds.length,
    }, {
      withCredentials: true
    });


    if (response.status === 200) {
      alert("Leads assigned successfully.");
      setFilteredClients((prev) =>
        prev.map((client) =>
          leadIds.includes(client.id) ? { ...client, status: "Assigned" } : client
        )
      );
      setShowAssignPopup(false);
    }
  } catch (error) {
    console.error("Error assigning leads:", error);
    alert("Failed to assign leads.");
  }
};




  return (
    <div>
      <Breadcrumb pageName="Raw Data" />

      <div className="flex justify-end gap-4 my-4">
        <button onClick={() => setShowImportPopup(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Import</button>
        <button onClick={() => setShowAssignPopup(true)} className="bg-green-600 text-white px-4 py-2 rounded">Assign</button>
      </div>

      {showImportPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/2 dark:border-strokedark dark:bg-boxdark">
            <div className="flex text-center border-b-2 mb-3 dark:border-strokedark">
              <h2 className="text-2xl font-bold  flex dark:text-white">Import Bulk Data</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              
              <div className="flex justify-end">
                <button className="border px-1 rounded mb-0 px-1 h-10 bg-blue-500 ">
                   <a href="/documents/data_import_format.xlsx"
                     download
                     className="text-blue-600 flex items-center text-white gap-2 text-sm "
                   >
                     <FontAwesomeIcon icon={faDownload} /> Download Sample File
                   </a>
                </button>
              </div>
              
              
              <div className="flex">
                  <select name="cat_id" value={formData.cat_id} onChange={handleChange} required className="w-full m-3 ml-0 p-3 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.cat_id} value={category.cat_id}>{category.cat_name}</option>
                      ))}
                  </select>
                  <select name="reference" value={formData.reference} onChange={handleChange} required className="w-full  m-3 p-3 mr-0 border-2 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                        <option value="">Select reference</option>
                        {references.map((reference) => (
                          <option key={reference.reference_id} value={reference.reference_id}>{reference.reference_name}</option>
                        ))}
                  </select>
              </div>


              <input type="file"  accept=".xlsx, .csv" onChange={handleFileChange} required className="mb-4 " />  

              <div className="flex justify-end">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                <button type="button" onClick={() => setShowImportPopup(false)} className="ml-4 text-white bg-red-500 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center ">
          <div className="bg-white p-6 rounded shadow-md w-1/2 dark:border-strokedark dark:bg-boxdark">
           <div className="flex text-center border-b-2 mb-3 dark:border-strokedark">
              <h2 className="text-2xl font-bold  flex dark:text-white">Assign Task</h2>
            </div>
             <form onSubmit={handleAssignSubmit}>
              <div className="flex gap-2">
                  <select name="mode" value={assignData.mode} onChange={handleChange} required className=" border-2 p-2 m-1 w-full mb-2 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <option value="">Select Mode</option>
                    <option value="call">Call</option>
                    <option value="visit">Visit</option>
                  </select>
                <select
                  name="assignedTo"
                  value={assignData.assignedTo}
                  onChange={handleChange}
                  required
                  className="border-2 p-2 m-1 w-full mb-2 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Assign To</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>


                  {/* Lead Count Dropdown */}
                <select
                  name="leadCount"
                  value={assignData.leadCount}
                  onChange={handleChange}
                  required
                  className="border-2 p-2 m-1 w-full mb-2 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select No. of Leads</option>
                  {[...Array(10)].map((_, index) => {
                    const count = (index + 1) * 50;
                    return (
                      <option key={count} value={count}>
                        {count} Leads
                      </option>
                    );
                  })}
                </select>
              </div>
           
           
              <div className="flex gap-3 w-full">
                    <div className="w-full">
                      <label htmlFor="remark" className="block mb-1 font-medium dark:text-white ">Assigned Date</label>
                      <input type="date" name="assignDate" value={assignData.assignDate} onChange={handleChange} className="w-full mb-2 border px-2 py-1 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"  />
                    </div>
                    <div className="w-full">
                      <label htmlFor="remark" className="block mb-1 font-medium dark:text-white ">Target Date</label>
                      <input type="date" name="targetDate" value={assignData.targetDate} onChange={handleChange} className="w-full mb-2 border px-2 py-1 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required/>
                    </div>
              </div>

              <label htmlFor="remark" className="block mb-1 font-medium dark:text-white">Remark</label>
              <textarea id="remark"   name="remark" value={assignData.remark} onChange={handleChange} placeholder="Remark" className="w-full mb-2 border px-2 py-1 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
            
              <div className="flex justify-end">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                  <button type="button" onClick={() => setShowAssignPopup(false)} className="ml-4 text-white bg-red-500 px-4 py-2 rounded">Cancel</button>
              </div>
            
            </form>
          </div>
        </div>
      )}

      {successMessage && <div className="p-2 bg-green-500 text-white text-center">{successMessage}</div>}



{/**************************************** Data Table ****************************************************/}

      <div className="max-w-full overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
  <table className="w-full table-auto">
    <thead>
      <tr className="bg-gray-2 text-left dark:bg-meta-4">
        <th className="py-4 px-4 font-medium text-black dark:text-white">Sr. No.</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white">Client Name</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white">Client Email</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white">Client Phone</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white">Client Address</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredClients
        .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
        .map((client, index) => (
          <tr key={client.id} className="border-b">
            <td className="py-3 px-4">{(currentPage - 1) * entriesPerPage + index + 1}</td>
            <td className="py-3 px-4">{client.name}</td>
            <td className="py-3 px-4">{client.email}</td>
            <td className="py-3 px-4">{client.phone}</td>
            <td className="py-3 px-4">{client.address}</td>
            <td className="py-3 px-4">{client.status}</td>

            <td className="py-3 px-4">
              <button
                onClick={() => handleEdit(client)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </td>
          </tr>
        ))}
    </tbody>
  </table>

  <div className="flex justify-end p-4">
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => paginate(index + 1)}
        className={`mx-1 px-3 py-1 border rounded-md ${
          currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
</div>

{/**************************************** Data Table End ****************************************************/}

      {isModalOpen && selectedClient && <ClientForm client={selectedClient} onClose={handleModalClose} />}
    </div>
  );
};

export default RawData;












//////////////////////////////////////// HANDLE SELECT ALL CODE  //////////////////////////////////////////////////////// 
  // const handleSelectAll = (e) => {
  //   if (e.target.checked) {
  //     const currentEntries = filteredClients.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  //     const currentIds = currentEntries.map(client => client.id);
  //     setSelectedClients((prev) => [...new Set([...prev, ...currentIds])]);
  //   } else {
  //     const currentEntries = filteredClients.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  //     const currentIds = currentEntries.map(client => client.id);
  //     setSelectedClients((prev) => prev.filter(id => !currentIds.includes(id)));
  //   }
  // };

  // const handleSelect = (clientId) => {
  //   setSelectedClients((prev) =>
  //     prev.includes(clientId)
  //       ? prev.filter(id => id !== clientId)
  //       : [...prev, clientId]
  //   );
  // };





















// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash, faDownload, faFileImport, faPhone, faLocation } from "@fortawesome/free-solid-svg-icons";
// import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import { BASE_URL } from "../../../public/config.js";
// import axios from "axios";
// import ClientForm from "../Client/ClientForm";

// const RawData = () => {
//   type Data = {
//     id: number;
//     name: string;
//     contact: string;
//     email: string;
//     address: string;
//     category: string;
//     reference: string;
//     userid: number;
//   };

//   type Client = {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
//     address: string;
//   };

//   interface Category {
//     cat_id: number;
//     cat_name: string;
//   }

//   interface Reference {
//     reference_id: number;
//     reference_name: string;
//   }

//   const [formData, setFormData] = useState({
//     cat_id: "",
//     reference: "",
//   });
//   const [rawData, setRawData] = useState<Data[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredData, setFilteredData] = useState<Data[]>([]);
//   const [importedData, setImportedData] = useState<Data[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [references, setReferences] = useState<Reference[]>([]);
//   const [error, setError] = useState("");
//   const [file, setFile] = useState<File | null>(null); // State to hold the selected file
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filteredClients, setFilteredClients] = useState<Client[]>([]);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [clients, setclients] = useState<Client[]>([]);  
//   const [feedback, setFeedback] = useState("");
//   const [data, setData] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedClients, setSelectedClients] = useState([]);

//   //
//   //
//   //
//   //pagination code starts
//   //
//   //
//   //
  
//   const entriesPerPage = 50;

//   const totalPages = Math.ceil(filteredClients.length / entriesPerPage);

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const currentEntries = filteredClients.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
//       const currentIds = currentEntries.map(client => client.id);
//       setSelectedClients((prev) => [...new Set([...prev, ...currentIds])]);
//     } else {
//       const currentEntries = filteredClients.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
//       const currentIds = currentEntries.map(client => client.id);
//       setSelectedClients((prev) => prev.filter(id => !currentIds.includes(id)));
//     }
//   };

//   const handleSelect = (clientId) => {
//     setSelectedClients((prev) =>
//       prev.includes(clientId)
//         ? prev.filter(id => id !== clientId)
//         : [...prev, clientId]
//     );
//   };

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   //
//   //
//   //
// //pagination code ends

// //
// //
// //


//   // Handle search functionality
//   const handleSearch = () => {
//     const filtered = rawData.filter((data) =>
//       Object.values(data).some((value) =>
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     setFilteredData(filtered);
//   };

//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Function to handle file selection
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile); // Store the selected file in state
//     }
//   };








// const fetchData = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}api/rawdata`);
//     setData(response.data); // Assuming setData is your state update function
//     console.log("Data updated successfully.");
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };



// // Function to handle form submission
// const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault();
//   console.log("Form submitted.");

//   if (!file) {
//     setError("Please select a file before submitting.");
//     console.log("Error: No file selected.");
//     return;
//   }

//   const formData1 = new FormData();
//   formData1.append("file", file);
//   formData1.append("cat_id", formData.cat_id);
//   formData1.append("reference", formData.reference);
//   console.log("FormData prepared:", formData1);

//   try {
//     console.log("Sending API request to:", `${BASE_URL}api/rawdata/import`);

//     const response = await axios.post(`${BASE_URL}api/rawdata/import`, formData1, {
//       headers: { "Content-Type": "multipart/form-data" },
//       withCredentials: true,
//     });

//     console.log("API response received:", response);

//     if (response.status === 200) {
//       console.log("Response status is 200, import successful.");
//       alert("Success: " + response.data.message);
      
//       setFile(null);
//       console.log("File state reset.");
      
//       setFormData({ cat_id: "", reference: "" });
//       console.log("Form data reset.");
      
//       // Fetch updated raw data immediately
//       console.log("Fetching updated raw data...");
//       await fetchData(); // Call your data fetching function
//       alert("Client details updated successfully.");
//     }
//   } catch (err) {
//     console.error("Error during file import:", err);
//     const errorMessage = err.response?.data?.message || "Failed to import file. Please try again.";
//     setError(errorMessage);
//     alert("Error: " + errorMessage);
//   }
// };







//   const fetchRawData = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}api/raw-data`);
  
//       if (!response.ok) throw new Error("Network response was not ok");
  
//       const data = await response.json();
//       const formattedData = data.map((item: any) => ({
//         id: item.master_id,
//         name: item.name,
//         phone: item.number,
//         email: item.email,
//         address: item.address,
//       }));
  
//       setRawData(formattedData);
//       setFilteredClients(formattedData);
//     } catch (error) {
//       console.error("Error fetching Raw Data:", error);
//     }
//   };
  
//   // Call `fetchRawData()` inside `useEffect`
//   useEffect(() => {
//     fetchRawData();
//   }, []);

  


// useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/category`);
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setCategories([]);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch references
//   useEffect(() => {
//     const fetchReferences = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}api/reference`);
//         setReferences(response.data);
//       } catch (err) {
//         console.error("Error fetching references:", err);
//         setError("Failed to load references. Please try again.");
//       }
//     };
//     fetchReferences();
//   }, []);


//   // Handle Edit Client
//   const handleEdit = (client: Client) => {
//     setSelectedClient(client);
//     setIsModalOpen(true);
//   };

//   // Handle Modal Close
//   const handleModalClose = (updatedClient?: Client) => {
//     setIsModalOpen(false);
//     setSelectedClient(null);

//     if (updatedClient) {
//       setFilteredClients((prevClients) =>
//         prevClients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
//       );
//       setSuccessMessage("Client details updated successfully.");

//       setTimeout(() => setSuccessMessage(""), 3000);
//     }
//   };
//  // Fetch raw data
//  useEffect(() => {
//   const fetchRawData = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}api/raw-data`);

//       if (!response.ok) throw new Error("Network response was not ok");

//       const data = await response.json();
//       const formattedData = data.map((item: any) => ({
//         id: item.master_id,
//         name: item.name,
//         phone: item.number,
//         email: item.email,
//         address: item.address,
//       }));

//       setRawData(formattedData);
//       setFilteredClients(formattedData);
//     } catch (error) {
//       console.error("Error fetching Raw Data:", error);
//     }
//   };

//   fetchRawData();
// }, []);

//   return (
//     <div>
//       <Breadcrumb pageName="Raw Data" />

//       <div className="flex justify-between items-center mb-5 mt-8">
// {/**************************** 1 st card  ******************************/}
//         <div>
//           {/* Import Data Card */}
//           <div className="bg-gray-100 rounded-lg shadow-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//             <h3 className="font-bold text-lg p-3 mb-3 rounded flex justify-center w-full bg-black text-white">
//               Import Bulk Data
//             </h3>

//             <form onSubmit={handleSubmit}>
//               <div className="flex gap-10 px-4">
//                 <button className="border w-full px-1 rounded mb-3 h-13 bg-blue-500">
//                   <a
//                     href="/documents/data_import_format.xlsx"
//                     download
//                     className="text-blue-600 flex items-center text-white gap-2 "
//                   >
//                     <FontAwesomeIcon icon={faDownload} /> Download Sample File
//                   </a>
//                 </button>

//                 {/* Category Dropdown */}
//                 <select
//                   name="cat_id"
//                   value={formData.cat_id}
//                   onChange={handleChange}
//                   className="border w-full px-2 py-2 rounded mb-3 h-13 dark:bg-meta-4"
//                   required
//                 >
//                   <option value="">Select category</option>
//                   {categories.map((category) => (
//                     <option key={category.cat_id} value={category.cat_id}>
//                       {category.cat_name}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Reference Dropdown */}
//                 <select
//                   name="reference"
//                   value={formData.reference}
//                   onChange={handleChange}
//                   className="border w-full px-2 py-2 rounded mb-3 h-13 dark:bg-meta-4"
//                   required
//                 >
//                   <option value="">Select Reference</option>
//                   {references.map((reference) => (
//                     <option key={reference.reference_id} value={reference.reference_id}>
//                       {reference.reference_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Import Excel Button */}
//               <div className="w-full flex justify-between">
//                 <input
//                   type="file"
//                   accept=".xlsx, .csv"
//                   className="mb-2 mt-2 flex justify-center py-2 rounded  mx-4 my-4"
//                   onChange={handleFileChange} // Use the new file change handler
//                   required
//                 />
//                 <button
//                   className="bg-green-500 text-white py-2 rounded px-4 mx-4 my-4"
//                   type="submit" >
//                   <FontAwesomeIcon icon={faFileImport} /> Import Excel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
// {/**************************** 1 st card  ******************************/}


// {/************************************** 2nd card  ******************/}
//         <div>
//           {/* Search Bar */}
//           <div className="flex items-center">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border rounded px-4 py-2 mr-2 dark:bg-meta-4"
//               placeholder="Search data..."
//             />
//             <button
//               onClick={handleSearch}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Search
//             </button>
//           </div>

//           <div className="flex gap-3 mt-3">
//             <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
//               <FontAwesomeIcon icon={faPhone} /> Call
//             </button>
//             <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
//               <FontAwesomeIcon icon={faLocation} /> Visit
//             </button>
//           </div>  
//         </div>

//  {/************************************** 2nd card  ******************/}
//       </div>

//       <div>
//       {successMessage && (
//         <div className="p-2 bg-green-500 text-white text-center">{successMessage}</div>
//       )}
//         {/* client Table */}
//         <div className="max-w-full overflow-auto max-h-96 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">






// <table className="w-full table-auto">
//         <thead>
//           <tr className="bg-gray-2 text-left dark:bg-meta-4">
//             <th className="py-4 px-4 font-medium text-black dark:text-white">
//               <input
//                 type="checkbox"
//                 onChange={handleSelectAll}
//                 checked={filteredClients.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).every(client => selectedClients.includes(client.id))}
//              /> Select All
//             </th>
//             <th className="py-4 px-4 font-medium text-black dark:text-white">Client Name</th>
//             <th className="py-4 px-4 font-medium text-black dark:text-white">Client Email</th>
//             <th className="py-4 px-4 font-medium text-black dark:text-white">Client Phone</th>
//             <th className="py-4 px-4 font-medium text-black dark:text-white">Client Address</th>
//             <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredClients.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((client) => (
//             <tr key={client.id} className="border-b">
//               <td className="py-3 px-4">
//                 <input
//                   type="checkbox"
//                   checked={selectedClients.includes(client.id)}
//                   onChange={() => handleSelect(client.id)}
//                 />
//               </td>
//               <td className="py-3 px-4">{client.name}</td>
//               <td className="py-3 px-4">{client.email}</td>
//               <td className="py-3 px-4">{client.phone}</td>
//               <td className="py-3 px-4">{client.address}</td>
//               <td className="py-3 px-4">
//                 <button
//                   className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//                   onClick={() => handleEdit(client)}
//                 >
//                   <FontAwesomeIcon icon={faEdit} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       <div className="flex justify-end p-4">
//         {[...Array(totalPages)].map((_, index) => (
//           <button
//             key={index}
//             onClick={() => paginate(index + 1)}
//             className={`mx-1 px-3 py-1 border rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>  
//       </div>



//       {/* Client Form Modal */}
//       {isModalOpen && selectedClient && <ClientForm client={selectedClient} onClose={handleModalClose} />}
//       </div>
//     </div>
//   );
// };

// export default RawData;










