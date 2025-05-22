import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BASE_URL } from "../../../public/config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AddCategoryForm from './AddCategoryForm'


const Category = () => {
  const [categories, setcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);


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
      <div className=" flex justify-content-between">
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
            <th className=" py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                 Category ID
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                 Category Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((category) => (
                <tr key={category.cat_id}>
                    <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {category.cat_id}
                    </h5>


                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {category.cat_name}
                    </h5>


                  </td>
                  <td className="border-b border-[#eee] py-3 px-5 dark:border-strokedark">
                    <div className="flex items-center gap-2">

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
                <td colSpan={6} className="text-center py-5">
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





















// import { useState,useEffect } from 'react';
// import axios from "axios";
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// // import { BASE_URL } from '../../../public/config.js';
// import {BASE_URL} from '../../../public/config.js'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash  } from '@fortawesome/free-solid-svg-icons';

// const Category = () => {
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
//       const response = await fetch(BASE_URL + 'api/category', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await response.json();
//       setFeedback('Category added successfully!');
//       setTimeout(() => setFeedback(''), 3000); 
  
//       setFormData({
//         cat_name: '',
//       });
  
//     } catch (error) {
//       setFeedback('Error occurred. Please try again.');
//     }
//   };


//   type Categories = {
//     cat_id: number;
//     cat_name: string;
//   };
//   const [categories, setcategories] = useState<Categories[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredData, setFilteredData] = useState<Categories[]>([]);

//   // Fetch categories from the backend
//   useEffect(() => {
//     const fetchcategories = async () => {
//       try {
//         const response = await fetch(BASE_URL + "api/category");
//         if (!response.ok) throw new Error("Network response was not ok");

//         const data = await response.json();
//         const formattedData = data.map((category: any) => ({
//           cat_id: category.cat_id,
//           cat_name: category.cat_name,
//         }));

//         setcategories(formattedData);
//         setFilteredData(formattedData);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchcategories();
//   }, []);

//   // Handle search functionality
//   const handleSearch = () => {
//     const filtered = categories.filter((category) =>
//       Object.values(category).some((value) =>
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     setFilteredData(filtered);
//   };

//   const handleDelete = async (id: number) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this category?");
//     if (!confirmDelete) return;
  
//     try {
//       // Use Axios to send the DELETE request
//       const response = await axios.delete(`${BASE_URL}api/category/${id}`);
  
//       // Check response status and update the frontend
//       if (response.status === 200) {
//         // Filter out the deleted category from the state
//         const updatedcategories = categories.filter((category) => category.cat_id !== id);
//         setcategories(updatedcategories);
//         setFilteredData(updatedcategories);
  
//         alert("Category deleted successfully!");
//       } else {
//         throw new Error("Failed to delete category");
//       }
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       alert(error.response?.data?.error || "Failed to delete category");
//     }
//   };












  
//   return (
//     <div>
//       <Breadcrumb pageName="Manage Categories" />
//       <div className="grid grid-cols-1 sm:grid-cols-1 m-5">
//         <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//           <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
//             <h3 className="font-medium text-black dark:text-white">
//               Add new Categories
//             </h3>
//             <h4>{feedback && <p className="text-center text-green-500">{feedback}</p>}
//             </h4>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="p-6.5">
//               {/* Name */}
//               <div className="mb-4.5">
//                 <label className="mb-2.5 block text-black dark:text-white">
//                   New category
//                 </label>
//                 <input
//                   type="text"
//                   name="cat_name"
//                   value={formData.cat_name}
//                   onChange={handleChange}
//                   placeholder="Enter new Category"
//                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                   required
//                 />
//               </div>

              
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
//                 // onSubmit={handleSubmit}
//               >
//                 Save Category
//               </button>
//             </div>
//           </form>
//         </div>






// {/* ---------------------- category list ----------------------------  */}






//       {/* Search Bar Section */}
//       <div className="flex items-center mb-5 mt-8">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border rounded px-10 py-2 mr-2"
//           placeholder="Search categories..."
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
      //            Category ID
      //         </th>
      //         <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
      //            Category Name
      //         </th>
      //         <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
      //       </tr>
      //     </thead>
      //     <tbody>
      //       {filteredData.length > 0 ? (
      //         filteredData.map((category) => (
      //           <tr key={category.cat_id}>
      //               <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
      //               <h5 className="font-medium text-black dark:text-white">
      //                 {category.cat_id}
      //               </h5>


      //             </td>
      //             <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
      //               <h5 className="font-medium text-black dark:text-white">
      //                 {category.cat_name}
      //               </h5>


      //             </td>
      //             <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
      //               <div className="flex items-center gap-2">

      //                 <button
      //                   className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
      //                   onClick={() => handleDelete(category.cat_id)}
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
      //             No categories found
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

// export default Category;
