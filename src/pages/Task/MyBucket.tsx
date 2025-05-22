import React, { useState, useEffect } from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
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

const MyBucket: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/tasks/pending`, { withCredentials: true });
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
  const filteredTasks = tasks.filter((task) =>
    [
      task.taskName,
      task.projectName,
      task.comments,
      task.assignedUsers,
      task.assignedRoles,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open the task file
  const openFile = async (projectName: string, taskName: string) => {
    try {
      await axios.get(`${BASE_URL}api/open-file/${encodeURIComponent(projectName)}/${encodeURIComponent(taskName)}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="My Bucket" />
      <input
        type="text"
        placeholder="Search Tasks"
        className="p-2 border border-gray-300 rounded w-half mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Part Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Project Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Start Date
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                End Date
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Priority
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No Parts found
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {task.taskName}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {task.projectName}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(task.startDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(task.endDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p className="text-black dark:text-white">{task.priority}</p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        task.status === "pending"
                          ? "bg-gray-300 text-gray-600"
                          : task.status === "in progress"
                          ? "bg-blue-300 text-blue-600"
                          : "bg-green-300 text-green-600"
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                    <button
                      className="bg-yellow-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      onClick={() => openFile(task.projectName, task.taskName)}
                    >
                      <FontAwesomeIcon icon={faFile} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBucket;