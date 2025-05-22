
import React, { useState, useEffect } from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faFile, faUsers } from '@fortawesome/free-solid-svg-icons';
import EditTask from './EditTask';
import { BASE_URL } from '../../../public/config.js';

interface Task {
  id: number;
  taskName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  comments: string;
  assignedUsers: string;
  assignedRoles: string;
}

const OnholdTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUsersPopupOpen, setUsersPopupOpen] = useState(false);
  const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<string[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Fetch tasks from the API
  // const fetchTasks = async () => {
  //   try {
  //     const response = await fetch(BASE_URL + "api/tasks/onHold");
  //     const json = await response.json();
  
  //     if (json.success && Array.isArray(json.data)) {
  //       setTasks(json.data);
  //     } else {
  //       console.error("Data is not an array:", json);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch tasks:", error);
  //   }
  // };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/tasks/onHold`, { withCredentials: true });
      const { data } = response;
      if (data.success && Array.isArray(data.data)) {
        setTasks(data.data);
      } else {
        console.error("Invalid data structure received:", data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on the search term
  const filteredTasks = tasks.filter(
    (task) =>
      (task.taskName && task.taskName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.projectName && task.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.comments && task.comments.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.assignedUsers && task.assignedUsers.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.assignedRoles && task.assignedRoles.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open the task file
  const openFile = async (projectName: string, taskName: string) => {
    try {
      await axios.get(BASE_URL + `api/open-file/${encodeURIComponent(projectName)}/${encodeURIComponent(taskName)}`);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  // Edit a task
  const handleEdit = (task: Task) => {
    const formattedStartDate = task.startDate ? task.startDate.slice(0, 10) : '';
    const formattedEndDate = task.endDate ? task.endDate.slice(0, 10) : '';
    setSelectedTask({  
      ...task,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    setEditPopupOpen(true);
    setIsReadOnly(false);
  };

  // Update the task
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await axios.put(BASE_URL + `api/tasks/${updatedTask.id}`, updatedTask);
      await axios.patch(BASE_URL + `api/tasks/status`, {
        id: updatedTask.id,
        status: updatedTask.status,
      });
      setEditPopupOpen(false);
      fetchTasks();  // Refresh the task list
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle the input change in the edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (selectedTask) {
      setSelectedTask({
        ...selectedTask,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle the click event on the assigned users button
  const handleAssignedUsersClick = (assignedUsers: string) => {
    setSelectedAssignedUsers(assignedUsers.split(','));
    setUsersPopupOpen(true);
  };

  // Handle the view action for a task
  const handleView = (task: Task) => {
    const formattedStartDate = task.startDate ? task.startDate.slice(0, 10) : '';
    const formattedEndDate = task.endDate ? task.endDate.slice(0, 10) : '';
    setSelectedTask({  
      ...task,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    setEditPopupOpen(true);
    setIsReadOnly(true);
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="On Hold Part List" />
      <input
        type="text"
        placeholder="Search Parts"
        className="p-2 border border-gray-300 rounded w-half mr-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Part Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Project Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">End Date</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Priority</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">No Parts found</td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{task.taskName}</h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">{task.projectName}</p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">{new Date(task.startDate).toLocaleDateString()}</p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">{new Date(task.endDate).toLocaleDateString()}</p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">{task.priority}</p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${task.status === 'pending' ? 'bg-gray-300 text-gray-600' : task.status === 'in progress' ? 'bg-blue-300 text-blue-600' : task.status === 'completed' ? 'bg-green-300 text-green-600' : 'bg-gray-500 text-gray-800'}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      {/* <button className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600" onClick={() => handleView(task)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button> */}
                      {/* <button className="bg-green-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600" onClick={() => handleEdit(task)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button> */}
                      <button className="bg-yellow-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600" onClick={() => openFile(task.projectName, task.taskName)}>
                        <FontAwesomeIcon icon={faFile} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Task Popup */}
      {/* {isEditPopupOpen && selectedTask && (
        <EditTask
          task={selectedTask}
          onUpdate={handleUpdateTask}
          onClose={() => setEditPopupOpen(false)}
          onInputChange={handleInputChange}
          isReadOnly={isReadOnly}
        />
      )} */}
    </div>
  );
};

export default OnholdTask;
