import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from '../../../public/config.js'; // Ensure BASE_URL is set correctly

interface AddProductFormProps {
  onClose: () => void;
  onProductAdded: () => void;
}

interface Category {
  cat_id: number;
  cat_name: string;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  onClose,
  onProductAdded,
}) => {
  const [formData, setFormData] = useState({ product_name: "", cat_id: "" });
  const [feedback, setFeedback] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories from the backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(BASE_URL + "api/category");
        setCategories(response.data); // Assuming response.data is [{cat_id, cat_name}]
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // If there is an error, reset categories to an empty array
      }
    };
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cat_id || !formData.product_name) {
      setFeedback("Please fill in all fields.");
      return;
    }

    try {
      // Send the form data to the backend
      const response = await axios.post(BASE_URL + "api/product", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setFeedback("Product added successfully!");
      setTimeout(() => {
        setFeedback("");
        onClose(); // Close the modal
        onProductAdded(); // Trigger action to refresh the product list or parent view
      }, 3000);

      // Reset the form
      setFormData({ product_name: "", cat_id: "" });
    } catch (error) {
      console.error("Error adding product:", error);
      setFeedback("Error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-6 w-1/3 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        {feedback && <p className="text-green-500">{feedback}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="border w-full p-2 rounded mb-4"
            required
          />
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="cat_id"
            value={formData.cat_id}
            onChange={handleChange}
            className="border w-full p-2 rounded mb-4"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.cat_id} value={category.cat_id}>
                {category.cat_name}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;










// import React, { useState } from "react";
// import { BASE_URL } from "../../../public/config.js";
// import axios from "axios";

// interface AddProductFormProps {
//   onClose: () => void;
//   onProductAdded: () => void;
// }

// const AddProductForm: React.FC<AddProductFormProps> = ({
//   onClose,
//   onProductAdded,
// }) => {
//   const [formData, setFormData] = useState({ product_name: "" });
//   const [feedback, setFeedback] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.post(BASE_URL + "api/product", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       setFeedback("Product added successfully!");
//       setTimeout(() => {
//         setFeedback("");
//         onClose();
//         onProductAdded();
//       }, 3000);
//       setFormData({ product_name: "" });
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setFeedback("Error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-md p-6 w-1/3 shadow-lg">
//         <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
//         {feedback && <p className="text-green-500">{feedback}</p>}
//         <form onSubmit={handleSubmit}>
//           <label className="block text-sm font-medium mb-2">Product Name</label>
//           <input
//             type="text"
//             name="product_name"
//             value={formData.product_name}
//             onChange={handleChange}
//             placeholder="Enter product name"
//             className="border w-full p-2 rounded mb-4"
//             required
//           />
//            {filteredData.length > 0 ? (
//             filteredData.map((category) => (
//             <select name="selectCategory" id="">
//                 <option> {category.cat_name}</option>
//             </select>
//             ))
//             ) : (
//             <select>
//                 <option value="No categories found">No categories found</option> 
//             </select>
//             )}
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductForm;
