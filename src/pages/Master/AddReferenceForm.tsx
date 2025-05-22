import React, { useState } from "react";
import { BASE_URL } from "../../../public/config.js";
import axios from "axios";

interface AddReferenceFormProps {
  onClose: () => void;
  onReferenceAdded: () => void;
}

const AddReferenceForm: React.FC<AddReferenceFormProps> = ({
  onClose,
  onReferenceAdded,
}) => {
  const [formData, setFormData] = useState({ reference_name: "" }); 
  const [feedback, setFeedback] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(BASE_URL + "api/reference", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setFeedback("Reference added successfully!");
      setTimeout(() => {
        setFeedback("");
        onClose();
        onReferenceAdded();
      }, 3000);
      setFormData({ reference_name: "" });
    } catch (error) {
      console.error("Error adding reference:", error);
      setFeedback("Error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-6 w-1/3 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Reference</h3>
        {feedback && <p className="text-green-500">{feedback}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-2">Reference From</label>
          <input
            type="text"
            name="reference_name"
            value={formData.reference_name}
            onChange={handleChange}
            placeholder="Enter reference name"
            className="border w-full p-2 rounded mb-4"
            required
          />
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

export default AddReferenceForm;
