import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';

const TaskForm = () => {
  const [taskId, setTaskId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [vendor, setVendor] = useState('');
  const [project, setProject] = useState('');
  const [originalDocument, setOriginalDocument] = useState<File | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minEndDate, setMinEndDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('pending');
  const [comments, setComments] = useState('');
  const [assignedUser, setAssignedUser] = useState([{ userId: '' }]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchVendorsAndProjects = async () => {
      try {
        const response = await axios.get(BASE_URL + 'api/project/projectsByVendor');
        setVendors(response.data || []);
      } catch (error) {
        console.error('Error fetching vendors and projects:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(BASE_URL + 'api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchVendorsAndProjects();
    fetchUsers();
  }, []);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    setMinEndDate(selectedStartDate); 
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVendor = e.target.value;
    setVendor(selectedVendor);
    const selectedVendorData = vendors.find((v) => v.vendor_name === selectedVendor);
    setFilteredProjects(selectedVendorData ? selectedVendorData.projects : []);
    setProject('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setOriginalDocument(file);
  };

  const handleRemoveUser = (index: number) => {
    const updatedUsers = assignedUser.filter((_, i) => i !== index);
    setAssignedUser(updatedUsers);
  };

  const handleUserChange = (index: number, value: string) => {
    const updatedUsers = assignedUser.map((user, i) =>
      i === index ? { userId: value } : user
    );
    setAssignedUser(updatedUsers);
  };

  const handleAddUser = () => {
    setAssignedUser([...assignedUser, { userId: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

    const taskFormData = new FormData();
    taskFormData.append('taskName', taskName);
    taskFormData.append('projectId', project);
    if (originalDocument) {
      taskFormData.append('file', originalDocument);
    }
    taskFormData.append('startDate', formattedStartDate);
    taskFormData.append('endDate', formattedEndDate);
    taskFormData.append('priority', priority);
    taskFormData.append('status', status);
    taskFormData.append('comments', comments);

    if (Array.isArray(assignedUser) && assignedUser.every(user => user.userId)) {
      const assignedUserJSON = JSON.stringify(assignedUser);
      taskFormData.append('assignedUser', assignedUserJSON);
      console.log("Assigned Users JSON:", assignedUserJSON);
    } else {
      console.error("Invalid format for assigned users:", assignedUser);
      return;
    }

    try {
      await axios.post(BASE_URL + 'api/create-task', taskFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowSuccessPopup(true);
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const resetForm = () => {
    setTaskId('');
    setTaskName('');
    setVendor('');
    setProject('');
    setOriginalDocument(null);
    setStartDate('');
    setEndDate('');
    setPriority('Medium');
    setStatus('pending');
    setComments('');
    setAssignedUser([{ userId: '' }]);
  };

  return (
    <>
      <Breadcrumb pageName="Create Part" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 m-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Create Part Form</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-5">
              {/* Part Name */}
              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Part Name</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Enter Part Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Vendor Selection */}
              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Select Vendor</label>
                <select
                  value={vendor}
                  onChange={handleVendorChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select Client</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.vendor_name} value={vendor.vendor_name}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Selection */}
              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Select Product</label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select Product</option>
                  {filteredProjects.map((proj) => (
                    <option key={proj.project_id} value={proj.project_id}>
                      {proj.project_name}
                    </option>
                  ))}
                </select>
              </div>

        

                      <div className="mb-4">
                        <label className="mb-2 block text-black dark:text-white">Assign Users:</label>
                        {assignedUser.map((user, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <select
                              value={user.userId}
                              onChange={(e) => handleUserChange(index, e.target.value)}
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            >
                              <option value="">Select a user</option>
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name} ({user.role})
                                </option>
                              ))}
                            </select>
                            {assignedUser.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveUser(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddUser}
                          className="mt-2 text-blue-500 hover:text-blue-700"
                        >
                          + Add Another User
                        </button>
                      </div>

               {/* Original Document Upload */}
               <div className="mb-4">
                 <label className="mb-2 block text-black dark:text-white">Original Document Upload</label>
                 <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Task Dates, Priority, Status */}
              <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-black dark:text-white">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    // onChange={(e) => setStartDate(e.target.value)}
                    onChange={handleStartDateChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-black dark:text-white">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    // onChange={(e) => setEndDate(e.target.value)}
                    onChange={handleEndDateChange}
                    min={minEndDate}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>


              <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-black dark:text-white">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-black dark:text-white">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="on hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="under review">Under Review</option>
                  </select>
                </div>
              </div>

              {/* Comments */}
              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  placeholder="Add any comments here..."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>


              {/* Form Submit Button */}
                   <div className=" flex mb-4 justify-end">
                 <button
                  type="submit"
                  className=" rounded bg-primary py-2 px-4 text-white transition hover:bg-primary/80"
                >
                  Create Part
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
