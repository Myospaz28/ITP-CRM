// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFolderOpen, faEdit, faEye, faClipboardList } from '@fortawesome/free-solid-svg-icons';
// import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import EditProject from './EditProject ';
// import { BASE_URL } from '../../../public/config.js';

// interface Project {
//   project_id: number;
//   project_name: string;
//   vendor_name: string;
//   start_date: string;
//   end_date: string;
//   status: string;
//   comment: string;
//   doc_upload: string[];
// }

// interface ActivityLog {
//   id: number;
//   project_id: number;
//   design_upload: string;
//   timestamp: string;
// }

// const ShowProject: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
//   const [isReadOnly, setIsReadOnly] = useState(false);
//   const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
//   const [showLogs, setShowLogs] = useState(false);

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get(BASE_URL + 'api/projects');
//       const sortedData = response.data.sort((a: Project, b: Project) => b.project_id - a.project_id);
//       setProjects(sortedData);
//       setFilteredProjects(sortedData);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     }
//   };

//   const fetchActivityLogs = async (projectId: number) => {
//     try {
//       const response = await axios.get(BASE_URL + `api/project/project-logs/${projectId}`);
//       setActivityLogs(response.data.logs);
//       setShowLogs(true);
//     } catch (error) {
//       console.error("Error fetching project activity logs:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const openFolder = async (projectName: string) => {
//     try {
//       await axios.get(BASE_URL + `api/open-folder/${encodeURIComponent(projectName)}`);
//     } catch (error) {
//       console.error('Error opening file:', error);
//     }
//   };


//   const handleOpenFile = async (fileName: string, projectName: string | undefined) => {
//         console.log("File Name:", fileName);
//     console.log("Project Name:", projectName);
//     if (!fileName || !projectName) {
//       console.error("File name or project name is missing");
//       return;
//     }
  
//     try {
//       await axios.get(BASE_URL + `api/open-file/${encodeURIComponent(projectName)}/${encodeURIComponent(fileName)}`);
//     } catch (error) {
//       console.error("Error opening file:", error);
//     }
//   };
  

//   const handleSearch = () => {
//     const results = projects.filter(
//       (project) =>
//         project.project_id.toString().includes(searchTerm) ||
//         project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         project.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         project.start_date.includes(searchTerm) ||
//         project.end_date.includes(searchTerm) ||
//         project.comment.includes(searchTerm.toLowerCase())
//     );
//     setFilteredProjects(results);
//   };

//   const handleEdit = (project: Project) => {
//     setSelectedProject(project);
//     setIsReadOnly(false);
//   };

//   const handleView = (project: Project) => {
//     setSelectedProject(project);
//     setIsReadOnly(true);
//   };

//   const handleUpdate = () => {
//     fetchProjects();
//     setSelectedProject(null);
//   };

//   const handleCancelEdit = () => {
//     setSelectedProject(null);
//   };



//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Product List" />
//       <div className="flex mb-4">
//         <input
//           type="text"
//           placeholder="Search"
//           className="p-2 border border-gray-300 rounded w-half mr-2"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={handleSearch}
//         >
//           Search
//         </button>
//       </div>

//       <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Product Name</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Vendor Name</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">End Date</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProjects.map((project) => (
//               <tr key={project.project_id}>
//                 <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
//                   <h5 className="font-medium text-black dark:text-white">{project.project_name}</h5>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white">{project.vendor_name}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white">{new Date(project.start_date).toLocaleDateString()}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white">{new Date(project.end_date).toLocaleDateString()}</p>
//                 </td>
//                 {/* <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${project.status === "active" ? "bg-success text-success" : "bg-danger text-danger"}`}>
//                     {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
//                   </p>
//                 </td> */}

// <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//   <p
//     className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
//       project.status === "not started"
//         ? "bg-gray-500 text-gray-500"
//         : project.status === "active"
//         ? "bg-blue-300 text-blue-600"
//         : project.status === "hold"
//         ? "bg-yellow-300 text-yellow-600"
//         : project.status === "Client Review"
//         ? "bg-orange-300 text-orange-600"
//         : project.status === "completed"
//         ? "bg-green-300 text-green-600"
//         : "bg-danger text-danger"
//     }`}
//   >
//     {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
//   </p>
// </td>



//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <div className="flex items-center gap-2">
//                     <button
//                       className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => openFolder(project.project_name)}
//                     >
//                       <FontAwesomeIcon icon={faFolderOpen} className="text-white" />
//                     </button>
//                     <button
//                       className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => handleEdit(project)}
//                     >
//                       <FontAwesomeIcon icon={faEdit} className="text-white" />
//                     </button>
//                     <button
//                       className="bg-gray-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => handleView(project)}
//                     >
//                       <FontAwesomeIcon icon={faEye} className="text-white" />
//                     </button>

//                     <button
//                       className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => fetchActivityLogs(project.project_id)}
//                     >
//                       <FontAwesomeIcon icon={faClipboardList} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal Popup for Edit or View Form */}
//       {selectedProject && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto mt-10">
//           <div className="bg-white p-6 rounded shadow-lg w-1/2 mt-10 relative max-h-[90vh] overflow-y-auto">
//             <button onClick={handleCancelEdit} className="absolute top-2 right-2 text-gray-600 text-2xl">
//               &times;
//             </button>
//             <EditProject 
//               project={selectedProject} 
//               onUpdate={handleUpdate} 
//               onCancel={handleCancelEdit} 
//               readOnly={isReadOnly} 
//             />
//           </div>
//         </div>
//       )}



// {showLogs && (
//   <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
//     <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
//       <button 
//         onClick={() => setShowLogs(false)} 
//         className="absolute top-2 right-2 text-gray-600 text-2xl"
//       >
//         &times;
//       </button>
//       <h2 className="text-3xl font-semibold text-gray-800 mb-2 mt-8 text-center">Project Activity Logs</h2>
//       <div className="overflow-auto max-h-96"> 
//         <table className="min-w-fill bg-white border border-gray-200 rounded-lg shadow-md">
//           <thead>
//             <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
//               <th className="py-3 px-4 border-b text-left">Design Upload</th>
//               <th className="py-3 px-4 border-b text-left">Timestamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activityLogs.map((log) => (
//               <tr key={log.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="py-3 px-4 border-b">{log.design_upload}</td>
//                 <td className="py-3 px-4 border-b">{new Date(log.timestamp).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="flex justify-end mt-6">
//         <button 
//           className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200" 
//           onClick={() => setShowLogs(false)}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )} 

//     </div>
//   );
// };

// export default ShowProject;























import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faEdit, faEye, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import EditProject from './EditProject ';
import { BASE_URL } from '../../../public/config.js';

interface Project {
  project_id: number;
  project_name: string;
  vendor_name: string;
  start_date: string;
  end_date: string;
  status: string;
  comment: string;
  doc_upload: string[];
}

interface ActivityLog {
  id: number;
  project_id: number;
  design_upload: string;
  timestamp: string;
}

const ShowProject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/projects');
      const sortedData = response.data.sort((a: Project, b: Project) => b.project_id - a.project_id);
      setProjects(sortedData);
      setFilteredProjects(sortedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchActivityLogs = async (projectId: number) => {
    try {
      const response = await axios.get(BASE_URL + `api/project/project-logs/${projectId}`);
      if (response.data && response.data.logs.length === 0) {
        setActivityLogs([]);
        setShowLogs(true);
      } else {
        setActivityLogs(response.data.logs);
        setShowLogs(true);
      }
    } catch (error) {
      console.error("Error fetching project activity logs:", error);
      setActivityLogs([]); // Ensure activity logs are empty on error
      setShowLogs(true);
    }
  };
  

  useEffect(() => {
    fetchProjects();
  }, []);

  const openFolder = async (projectName: string) => {
    try {
      await axios.get(BASE_URL + `api/open-folder/${encodeURIComponent(projectName)}`);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };


  const handleOpenFile = async (fileName: string, projectName: string | undefined) => {
        console.log("File Name:", fileName);
    console.log("Project Name:", projectName);
    if (!fileName || !projectName) {
      console.error("File name or project name is missing");
      return;
    }
  
    try {
      await axios.get(BASE_URL + `api/open-file/${encodeURIComponent(projectName)}/${encodeURIComponent(fileName)}`);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };
  

  const handleSearch = () => {
    const results = projects.filter(
      (project) =>
        project.project_id.toString().includes(searchTerm) ||
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.start_date.includes(searchTerm) ||
        project.end_date.includes(searchTerm) ||
        project.comment.includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(results);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsReadOnly(false);
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setIsReadOnly(true);
  };

  const handleUpdate = () => {
    fetchProjects();
    setSelectedProject(null);
  };

  const handleCancelEdit = () => {
    setSelectedProject(null);
  };



  return (
    <div className="p-4">
      <Breadcrumb pageName="Product List" />
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search"
          className="p-2 border border-gray-300 rounded w-half mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Product Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Vendor Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">End Date</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.project_id}>
                <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{project.project_name}</h5>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">{project.vendor_name}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">{new Date(project.start_date).toLocaleDateString()}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">{new Date(project.end_date).toLocaleDateString()}</p>
                </td>
                {/* <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${project.status === "active" ? "bg-success text-success" : "bg-danger text-danger"}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </p>
                </td> */}

<td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
  <p
    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
      project.status === "not started"
        ? "bg-gray-500 text-gray-500"
        : project.status === "active"
        ? "bg-blue-300 text-blue-600"
        : project.status === "hold"
        ? "bg-yellow-300 text-yellow-600"
        : project.status === "Client Review"
        ? "bg-orange-300 text-orange-600"
        : project.status === "completed"
        ? "bg-green-300 text-green-600"
        : "bg-danger text-danger"
    }`}
  >
    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
  </p>
</td>



                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => openFolder(project.project_name)}
                    >
                      <FontAwesomeIcon icon={faFolderOpen} className="text-white" />
                    </button>
                    <button
                      className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleEdit(project)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-white" />
                    </button>
                    <button
                      className="bg-gray-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleView(project)}
                    >
                      <FontAwesomeIcon icon={faEye} className="text-white" />
                    </button>

                    <button
                      className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => fetchActivityLogs(project.project_id)}
                    >
                      <FontAwesomeIcon icon={faClipboardList} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup for Edit or View Form */}
      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto mt-10">
          <div className="bg-white p-6 rounded shadow-lg w-1/2 mt-10 relative max-h-[90vh] overflow-y-auto">
            <button onClick={handleCancelEdit} className="absolute top-2 right-2 text-gray-600 text-2xl">
              &times;
            </button>
            <EditProject 
              project={selectedProject} 
              onUpdate={handleUpdate} 
              onCancel={handleCancelEdit} 
              readOnly={isReadOnly} 
            />
          </div>
        </div>
      )}



{showLogs && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
      <button 
        onClick={() => setShowLogs(false)} 
        className="absolute top-2 right-2 text-gray-600 text-2xl"
      >
        &times;
      </button>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Project Activity Logs</h2>
      
      {activityLogs.length === 0 ? (
        <p className="text-center text-gray-600">No activity yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
                {/* <th className="py-2 px-4 border">ID</th> */}
                <th className="py-3 px-4 border-b text-left">Design Upload</th>
                <th className="py-3 px-4 border-b text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  {/* <td className="py-2 px-4 border">{log.id}</td> */}
                  <td className="py-3 px-4 border-b">{log.design_upload}</td>
                  <td className="py-3 px-4 border-b">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button 
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200" 
          onClick={() => setShowLogs(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ShowProject;


