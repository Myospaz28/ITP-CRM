import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BASE_URL } from "../../../public/config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AddProductForm from "./AddProductForm";

const Product = () => {
  const [products, setProducts] = useState([]); // Holds the list of products
  const [searchTerm, setSearchTerm] = useState(""); // For filtering products
  const [filteredData, setFilteredData] = useState([]); // Holds filtered products based on search
  const [showPopup, setShowPopup] = useState(false); // To control the popup for adding a product

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(BASE_URL + "api/product");
        setProducts(response.data); // Set products data
        setFilteredData(response.data); // Initially show all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}api/product/${id}`);
      const updatedProducts = products.filter((product) => product.product_id !== id);
      setProducts(updatedProducts); // Update state to reflect deletion
      setFilteredData(updatedProducts); // Update filtered data
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // Handle search functionality
  const handleSearch = () => {
    const filtered = products.filter((product) =>
      Object.values(product).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <Breadcrumb pageName="Manage Products" />
      <div className="flex justify-content-between">
        {/* Add Product Button */}
        <div className="mb-4 mr-5">
          <button
            onClick={() => setShowPopup(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex mb-5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 mr-2"
            placeholder="Search products..."
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>
      </div>

      {/* Popup Form for Adding Product */}
      {showPopup && (
        <AddProductForm
          onClose={() => setShowPopup(false)}
          onProductAdded={() => {
            // Refetch products after adding a new product
            axios.get(BASE_URL + "api/product").then((response) => {
              setProducts(response.data);
              setFilteredData(response.data);
            });
          }}
        />
      )}

      {/* Product List Table */}
      <div className="max-w-full mt-2 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              <th className=" py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Product ID</th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Product Name</th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Category Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((product) => (
                <tr key={product.product_id}>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{product.product_id}</h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{product.product_name}</h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{product.cat_name}</h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-5 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-5">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
























// import { useState, useEffect } from "react";
// import axios from "axios";
// import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import { BASE_URL } from "../../../public/config.js";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import AddProductForm from "./AddProductForm";


// const Product = () => {
//   const [categories, setcategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);


//   // Fetch categories
//   useEffect(() => {
//     const fetchcategories = async () => {
//       try {
//         const response = await axios.get(BASE_URL + "api/product");
//         setcategories(response.data);
//         setFilteredData(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchcategories();
//   }, []);


//   // Handle delete
//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this product?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${BASE_URL}api/product/${id}`);
//       const updatedcategories = categories.filter((cat) => cat.cat_id !== id);
//       setcategories(updatedcategories);
//       setFilteredData(updatedcategories);
//       alert("Category deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       alert("Failed to delete product.");
//     }
//   };

//   // Handle search
//   const handleSearch = () => {
//     const filtered = categories.filter((product) =>
//       Object.values(product).some((value) =>
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     setFilteredData(filtered);
//   };

//   return (
//     <div>
//       <Breadcrumb pageName="Manage Products" />
//       <div className=" flex justify-content-between">
//         {/* Add Category Button */}
//         <div className="mb-4 mr-5">
//             <button
//               onClick={() => setShowPopup(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Add Products
//             </button>
//           </div>

//           {/* Search Bar */}
//           <div className="flex mb-5">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border rounded px-4 py-2 mr-2"
//               placeholder="Search products..."
//             />
//             <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
//               Search
//             </button>
//           </div>  
//       </div>
          
//           {/* Popup Form */}
//           {showPopup && (
//             <AddProductForm
//               onClose={() => setShowPopup(false)}
//               onProductAdded={() => {
//                 // Refetch categories
//                 axios.get(BASE_URL + "api/product").then((response) => {
//                   setcategories(response.data);
//                   setFilteredData(response.data);
//                 });
//               }}
//             />
//           )}
      

//       {/* Category List */}
//       <div className="max-w-full mt-2 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 text-left dark:bg-meta-4">
//               <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
//                  Product ID
//               </th>
//               <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
//                  Product Name
//               </th>
//               <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
//                  Category Name
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((product) => (
//                 <tr key={product.product_id}>
//                     <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
//                       <h5 className="font-medium text-black dark:text-white">
//                         {product.product_id}
//                       </h5>
//                     </td>
//                     <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
//                       <h5 className="font-medium text-black dark:text-white">
//                         {product.product_name}
//                       </h5>
//                     </td>

//                     <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
//                       <h5 className="font-medium text-black dark:text-white">
//                         {product.cat_name}
//                       </h5>
//                     </td>
//                     <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                       <div className="flex items-center gap-2">

//                         <button
//                           className="inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 bg-black"
//                           onClick={() => handleDelete(product.product_id)}
//                         >
//                           <FontAwesomeIcon icon={faTrash} className="text-white" />
//                         </button>
//                       </div>
//                     </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="text-center py-5">
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
    
//     </div>
//   );
// };

// export default Product;










