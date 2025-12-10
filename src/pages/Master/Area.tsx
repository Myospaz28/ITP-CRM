import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BASE_URL } from "../../../public/config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddAreaForm from './AddAreaForm'
import EditArea from "./EditArea";


const Area = () => {
  const [area, setArea] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);


  // Fetch Area
  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await axios.get(BASE_URL + "api/area");
        setArea(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching Area:", error);
      }
    };
    fetchArea();
  }, []);


  // Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Area?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}api/area/${id}`,
      {
        withCredentials:true
      });
      const updatedArea = area.filter((area) => area.area_id !== id);
      setArea(updatedArea);
      setFilteredData(updatedArea);
      alert("Area deleted successfully!");
    } catch (error) {
      console.error("Error deleting Area:", error);
      alert("Failed to delete Area.");
    }
  };

  // Handle search
  const handleSearch = () => {
    const filtered = area.filter((area) =>
      Object.values(area).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <Breadcrumb pageName="Manage Areas" />
      <div className=" flex justify-content-between">
        {/* Add Area Button */}
        <div className="mb-4 mr-5">
            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Area
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex mb-5">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-4 py-2 mr-2"
              placeholder="Search Areas..."
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>  
      </div>
          
          {/* Popup Form */}
{showPopup && selectedArea === null && (
  <AddAreaForm
          onClose={() => setShowPopup(false)}
          onAreaAdded={() => {
            axios.get(BASE_URL + "api/area").then((response) => {
              setArea(response.data);
              setFilteredData(response.data);
              //  setSelectedArea(null);
              //  setShowPopup(true);
              setSuccessMessage("Area added successfully!");
              setTimeout(() => setSuccessMessage(""), 2000);
            });
          } } AreaToEdit={undefined}  />
)}

{showPopup && selectedArea !== null && (
  <EditArea
    AreaToEdit={selectedArea}
    onClose={() => {
      setShowPopup(false);
      setSelectedArea(null);
    }}
    onAreaUpdated={() => {
      axios.get(BASE_URL + "api/area").then((response) => {
        setArea(response.data);
        setFilteredData(response.data);
        setSuccessMessage("Area updated successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      });
    }}
  />
)}


      {/* Area List */}
      <div className="max-w-full mt-2 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        {/* {successMessage && (
          <div className="mb-4 text-green-600 text-sm text-center">
            {successMessage}
          </div>
        )} */}
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
            <th className=" py-4 w-50 px-4 font-medium text-black dark:text-white xl:pl-11">
                 Area ID
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                 Area 
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((area) => (
                <tr key={area.area_id}>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark xl:pl-11 ">
                    <h5 className="font-medium text-black dark:text-white">
                      {area.area_id}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0  dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {area.area_name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-5 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-green-600"
                        onClick={() => {
                          setSelectedArea(area);
                          setShowPopup(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-white" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
                        onClick={() => handleDelete(area.area_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-5">
                  No Area found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    
    </div>
  );
};

export default Area;

