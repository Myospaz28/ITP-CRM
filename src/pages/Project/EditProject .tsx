import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';

interface EditProjectProps {
  project: {
    project_id: number;
    project_name: string;
    vendor_name: string;
    start_date: string;
    end_date: string;
    status: string;
    comment: string;
    doc_upload: string[];
  };
  onUpdate: () => void;
  onCancel: () => void;
  readOnly: boolean;
}

const EditProject: React.FC<EditProjectProps> = ({ project, onUpdate, onCancel, readOnly  }) => {
  const [formData, setFormData] = useState({
    project_name: '',
    vendor_name: '',
    start_date: '',
    end_date: '',
    status: 'not started',
    comment: '',
    doc_upload: project.doc_upload || [],
    design_upload: null 
  });
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [designFile, setDesignFile] = useState<File | null>(null); 

  useEffect(() => {
    // Pre-fill form data with project data
    const formattedStartDate = project.start_date ? project.start_date.slice(0, 10) : '';
    const formattedEndDate = project.end_date ? project.end_date.slice(0, 10) : '';

    setFormData({
      project_name: project.project_name,
      vendor_name: project.vendor_name,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      status: project.status,
      comment: project.comment,
      doc_upload: Array.isArray(project.doc_upload) ? project.doc_upload : [project.doc_upload],
      design_upload: null 
    });
  }, [project]);

  useEffect(() => {
    // Fetch vendor list from API
    const fetchVendors = async () => {
      try {
        const response = await axios.get(BASE_URL + 'api/vendor-list');
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching Client list:', error);
      }
    };

    fetchVendors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => file.name);
      setFormData((prev) => ({
        ...prev,
        doc_upload: [...prev.doc_upload, ...newFiles]
      }));
    }
  };

  const handleDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDesignFile(file); 
  };

  const handleRemoveFile = (filename: string) => {
    setFormData((prev) => ({
      ...prev,
      doc_upload: prev.doc_upload.filter((file) => file !== filename)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formDataToSubmit.append(key, item));
      } else {
        formDataToSubmit.append(key, value);
      }
    });

    // Append design file if it exists
    if (designFile) {
      formDataToSubmit.append('design_upload', designFile);
    }

    try {
      await axios.put(BASE_URL + `api/project/${project.project_id}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onUpdate();
      onCancel();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-semibold">Edit Project</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2">Project Name:</label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
            disabled={readOnly}
          />
        </div>
        <div>
          <label className="block mb-2">Client:</label>
          <select
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
            disabled={readOnly}
          >
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.name}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
            disabled={readOnly}
          />
        </div>
        <div>
          <label className="block mb-2">End Date:</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
            disabled={readOnly}
          />
        </div>
        <div>
          <label className="block mb-2">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
            disabled={readOnly}
          >
                  <option value="not started">Not Started</option>
                  <option value="active">Active</option>
                  <option value="hold">On Hold</option>
                  <option value="Client Review">Client Review</option>
                  <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Comment:</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            disabled={readOnly}
          ></textarea>
        </div>

        {/* Display uploaded files */}
        <div className="mt-4">
          <h4 className="font-semibold">Uploaded Documents:</h4>
          {Array.isArray(formData.doc_upload) && formData.doc_upload.length > 0 ? (
            <ul>
              {formData.doc_upload.map((filename, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{filename}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(filename)}
                    className="text-red-500 ml-2"
                    disabled={readOnly}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded.</p>
          )}
          {/* File upload input for documents */}
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            className="mt-2"
            disabled={readOnly}
          />
        </div>

        {/* Design upload input */}
        <div className="mt-4">
          <label className="block mb-2">Upload Design File:</label>
          <input
            type="file"
            onChange={handleDesignFileChange}
            className="mt-2"
            disabled={readOnly}
          />
        </div>

        <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Update
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;