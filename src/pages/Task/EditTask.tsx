// import React from 'react';

// interface Task {
//   id: number;
//   taskName: string;
//   startDate: string;
//   endDate: string;
//   priority: string;
//   status: string;
//   comments: string;
//   assignedUsers: string;
// }

// interface EditTaskProps {
//   task: Task;
//   onSave: (updatedTask: Task) => void;
//   onCancel: () => void;
//   onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   readOnly?: boolean;
// }

// const EditTask: React.FC<EditTaskProps> = ({ task, onSave, onCancel, onInputChange , readOnly }) => {
//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center mt-10">
//       <div className="bg-white p-6 rounded shadow-lg w-96">
//         <h2 className="text-xl font-semibold mb-4">Edit Part</h2>

//         {/* Part Name */}
//         <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
//           Part Name
//         </label>
//         <input
//           type="text"
//           name="taskName"
//           id="taskName"
//           value={task.taskName}
//           onChange={onInputChange}
//           className="p-2 border border-gray-300 rounded mb-4 w-full"
//           placeholder="Part Name"
//           disabled={readOnly}
//         />

//         {/* Assigned Users */}
//         <label htmlFor="assignedUsers" className="block text-sm font-medium text-gray-700 mb-1">
//           Assigned Users
//         </label>
//         <input
//           type="text"
//           name="assignedUsers"
//           id="assignedUsers"
//           value={task.assignedUsers}
//           onChange={onInputChange}
//           className="p-2 border border-gray-300 rounded mb-4 w-full"
//           placeholder="Assigned Users"
//           disabled={readOnly}
//         />

//         {/* Start Date and End Date - in one line */}
//         <div className="flex gap-4 mb-4">
//           <div className="flex-1">
//             <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
//               Start Date
//             </label>
//             <input
//               type="date"
//               name="startDate"
//               id="startDate"
//               value={task.startDate}
//               onChange={onInputChange}
//               className="p-2 border border-gray-300 rounded w-full"
//               disabled={readOnly}
//             />
//           </div>

//           <div className="flex-1">
//             <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
//               End Date
//             </label>
//             <input
//               type="date"
//               name="endDate"
//               id="endDate"
//               value={task.endDate}
//               onChange={onInputChange}
//               className="p-2 border border-gray-300 rounded w-full"
//               disabled={readOnly}
//             />
//           </div>
//         </div>

//         {/* Priority */}
//         <div className="flex gap-4 mb-4">
//         <div className="flex-1">
//         <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1" >
//           Priority
//         </label>
//         <select
//           name="priority"
//           id="priority"
//           value={task.priority}
//           onChange={onInputChange}
//           className="p-2 border border-gray-300 rounded mb-4 w-full"
//           disabled={readOnly}
//         >
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </select>
//         </div>

//         <div className="flex-1">
//           <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//             Status
//           </label>
//           <select
//             name="status"
//             id="status"
//             value={task.status}
//             onChange={onInputChange}
//             className="p-2 border border-gray-300 rounded mb-4 w-full"
//             disabled={readOnly}
//           >
//             <option value="pending">Pending</option>
//             <option value="in progress">In Progress</option>
//             <option value="on hold">On Hold</option>
//             <option value="completed">Completed</option>
//             <option value="under review">Under Review</option>
//           </select>
//         </div>


//         </div>


//         {/* Comments */}
//         <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
//           Comments
//         </label>
//         <input
//           type="text"
//           name="comments"
//           id="comments"
//           value={task.comments}
//           onChange={onInputChange}
//           className="p-2 border border-gray-300 rounded mb-4 w-full"
//           placeholder="Comments"
//           disabled={readOnly}
//         />

//         <div className="flex justify-end gap-2">
//           { !readOnly && (
//             <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onSave(task)}>
//               Update
//             </button>
//           )}
//           <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onCancel}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditTask;






























import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';

interface Task {
  id: number;
  taskName: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  comments: string;
  assignedUsers: string;
}

interface EditTaskProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  readOnly?: boolean;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onSave, onCancel, onInputChange, readOnly }) => {
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${BASE_URL}auth/get-name`, { withCredentials: true });
        const role = response.data.role;
        console.log('Role :', role);
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);

  const isDesigner = userRole === 'designer';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center mt-10">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Part</h2>

        {!isDesigner && (
          <>
            <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
              Part Name
            </label>
            <input
              type="text"
              name="taskName"
              id="taskName"
              value={task.taskName}
              onChange={onInputChange}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
              placeholder="Part Name"
              disabled={readOnly}
            />

            {/* <label htmlFor="assignedUsers" className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Users
            </label>
            <input
              type="text"
              name="assignedUsers"
              id="assignedUsers"
              value={task.assignedUsers}
              onChange={onInputChange}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
              placeholder="Assigned Users"
              disabled={readOnly}
            /> */}

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={task.startDate}
                  onChange={onInputChange}
                  className="p-2 border border-gray-300 rounded w-full"
                  disabled={readOnly}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={task.endDate}
                  onChange={onInputChange}
                  className="p-2 border border-gray-300 rounded w-full"
                  disabled={readOnly}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              id="priority"
              value={task.priority}
              onChange={onInputChange}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
              disabled={readOnly}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={task.status}
              onChange={onInputChange}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
              disabled={readOnly}
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="on hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="under review">Under Review</option>
            </select>
          </div>
        </div>

        {/* {!isDesigner && ( */}
          <>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <input
              type="text"
              name="comments"
              id="comments"
              value={task.comments}
              onChange={onInputChange}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
              placeholder="Comments"
              disabled={readOnly}
            />
          </>
        {/* )} */}

        <div className="flex justify-end gap-2">
          {!readOnly && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onSave(task)}>
              Update
            </button>
          )}
          <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
