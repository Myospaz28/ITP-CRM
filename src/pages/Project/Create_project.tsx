import { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';

interface Project {
  projectName: string;
  vendorName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  status: string;
  comment: string;
  documentUpload?: File[] | null;
  designUpload?: File[] | null;
}

interface Vendor {
  id: number;
  name: string;
}

interface ProjectFormProps {
  projectData?: Project;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectData, onClose }) => {
  const [formData, setFormData] = useState<Project>({
    projectName: '',
    vendorName: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    status: 'not started',
    comment: '',
    documentUpload: null,
    designUpload: null,
  });
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (projectData) {
      setFormData(projectData);
    }
  }, [projectData]);

  // Fetch vendor list from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(BASE_URL + 'api/vendor-list');
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    fetchVendors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'design') => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({
      ...prev,
      [type === 'document' ? 'documentUpload' : 'designUpload']: prev[type === 'document' ? 'documentUpload' : 'designUpload']
        ? [...prev[type === 'document' ? 'documentUpload' : 'designUpload'], ...files]
        : files,
    }));
  };

  // const handleFileRemove = (fileName: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     documentUpload: prev.documentUpload?.filter((file) => file.name !== fileName) || [],
  //   }));
  // };

  const handleFileRemove = (fileName: string, type: 'document' | 'design') => {
    setFormData((prev) => ({
      ...prev,
      [type === 'document' ? 'documentUpload' : 'designUpload']: prev[type === 'document' ? 'documentUpload' : 'designUpload']?.filter((file) => file.name !== fileName) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || new Date(formData.startDate) > new Date(formData.endDate)) {
      setSuccessMessage('Start Date and End Date are required, and the Start Date must not be after the End Date.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('project_name', formData.projectName);
    formDataToSend.append('vendor_name', formData.vendorName);
    formDataToSend.append('project_description', formData.projectDescription);
    formDataToSend.append('start_date', formData.startDate);
    formDataToSend.append('end_date', formData.endDate);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('comment', formData.comment);

    if (formData.documentUpload && formData.documentUpload.length > 0) {
      formData.documentUpload.forEach((file) => {
        formDataToSend.append('doc_upload', file);
      });
    }

    if (formData.designUpload && formData.designUpload.length > 0) {
      formData.designUpload.forEach((file) => {
        formDataToSend.append('design_upload', file);
      });
    }

    try {
      const response = await axios.post(BASE_URL + 'api/create-project', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Project created:', response.data);
      alert(response.data.message);
      if (response.status === 200) {
        setSuccessMessage('Product created successfully!');
        resetFormData();
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 3000);
      } else {
        setSuccessMessage('Failed to create product.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setSuccessMessage('An error occurred while creating the product.');
    }
  };

  const resetFormData = () => {
    setFormData({
      projectName: '',
      vendorName: '',
      projectDescription: '',
      startDate: '',
      endDate: '',
      status: 'not started',
      comment: '',
      documentUpload: null,
      designUpload: null,
    });
  };

  return (
    <>
      <Breadcrumb pageName="Create Product" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 m-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Product Form
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-5">
              <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-black dark:text-white">Product Name</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="Enter Project Name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Vendor Name Select */}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-black dark:text-white">Vendor Name</label>
                  <select
                    name="vendorName"
                    value={formData.vendorName}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select Client</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Product Description</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter Project Description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Document Upload</label>
                <input
                  type="file"
                  name="doc_upload"
                  multiple
                  // onChange={handleFileChange}
                  onChange={(e) => handleFileChange(e, 'document')}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <div className="mt-4">
                  {formData.documentUpload && formData.documentUpload.length > 0 && (
                    <ul className="space-y-2">
                      {formData.documentUpload.map((file, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{file.name}</span>
                          <button
                            type="button"
                            className="text-red-500"
                            // onClick={() => handleFileRemove(file.name)}
                            onClick={() => handleFileRemove(file.name, 'document')}
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Design Upload</label>
                <input
                  type="file"
                  name="design_upload"
                  multiple
                  onChange={(e) => handleFileChange(e, 'design')}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <div className="mt-4">
                  {formData.designUpload && formData.designUpload.length > 0 && (
                    <ul className="space-y-2">
                      {formData.designUpload.map((file, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{file.name}</span>
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => handleFileRemove(file.name, 'design')}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-black dark:text-white">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-black dark:text-white">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="not started">Not Started</option>
                  <option value="active">Active</option>
                  <option value="hold">On Hold</option>
                  <option value="Client Review">Client Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Comment</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter Comment"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              {successMessage && <p className="text-green-500">{successMessage}</p>}
              
              <div className=" flex mb-4 justify-end">
              <button
                type="submit"
                className="mt-4  rounded bg-primary py-2 px-4 text-white transition hover:bg-opacity-90"
              >
                Create Project
              </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;