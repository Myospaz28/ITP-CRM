import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BASE_URL } from "../../../public/config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import AddCategoryForm from './AddCategoryForm';
import EditCategoryForm from "./EditCategoryForm";

const Category = () => {
  const [categories, setcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchcategories = async () => {
      try {
        const response = await axios.get(BASE_URL + "api/category");
        setcategories(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchcategories();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}api/category/${id}`);
      const updatedcategories = categories.filter((cat) => cat.cat_id !== id);
      setcategories(updatedcategories);
      setFilteredData(updatedcategories);
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  // Handle search
  const handleSearch = () => {
    const filtered = categories.filter((category) =>
      Object.values(category).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <Breadcrumb pageName="Manage Categories" />
      <div className="flex justify-content-between">
        {/* Add Category Button */}
        <div className="mb-4 mr-5">
          <button
            onClick={() => setShowPopup(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex mb-5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 mr-2"
            placeholder="Search categories..."
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <AddCategoryForm
          onClose={() => setShowPopup(false)}
          onCategoryAdded={() => {
            // Refetch categories
            axios.get(BASE_URL + "api/category").then((response) => {
              setcategories(response.data);
              setFilteredData(response.data);
            });
          }}
        />
      )}

      {/* Category List */}
      <div className="max-w-full mt-2 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Serial No.
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Category Name
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
               Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Handle edit popup */}
            {showEditPopup && editCategory && (
              <EditCategoryForm
                category={editCategory}
                onClose={() => setShowEditPopup(false)}
                onCategoryUpdated={() => {
                  axios.get(BASE_URL + "api/category").then((res) => {
                    setcategories(res.data);
                    setFilteredData(res.data);
                  });
                }}
              />
            )}

            {filteredData.length > 0 ? (
              filteredData.map((category, index) => (
                <tr key={category.cat_id}>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {index + 1} {/* Serial number starts from 1 */}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {category.cat_name}
                    </h5>
                  </td>

                
               <td className="border-b border-[#eee] py-3 px-0  dark:border-strokedark xl:pl-11">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        category.status === "active"
                          ? "bg-success text-success"
                          : "bg-danger text-danger"
                      }`}
                    >
                      {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                    </p>
                  </td>
                  
                  <td className="border-b border-[#eee] py-3 px-5 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-green-600"
                        onClick={() => {
                          setEditCategory(category);
                          setShowEditPopup(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-white" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
                        onClick={() => handleDelete(category.cat_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-5">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;







