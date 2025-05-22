import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import db from '../database/db.js';
import taskModel from '../models/taskModel.js';
import moment from 'moment';
const { insertTask, getProjects, insertTaskAssignment, updateTask } = taskModel;



// Function to get project by ID
const getProjectById = async (projectId) => {
  const query = 'SELECT * FROM projects WHERE project_id = ?';
  // console.log('Executing SQL:', query, 'With parameters:', [projectId]);

  try {
    const [results] = await db.query(query, [projectId]);
    // console.log('Query results:', results);
    
    return results[0];
    
  } catch (err) {
    console.error('Database error:', err);
    throw err; 
  }
};





const createTask = async (req, res) => {
  console.log('Received request to create task:', req.body);

  const {
    taskName, projectId, assignedUser , startDate, endDate,
    priority = 'Medium', status = 'pending', comments
  } = req.body;
  const file = req.file;

  if (!taskName || !projectId || !file) {
    console.error('Validation failed:', { taskName, projectId, assignedUser , file });
    return res.status(400).json({ message: 'Task name, project, file, and description are required.' });
  }

  // Ensure projectId is a number
  const projectIdNumber = parseInt(projectId, 10);
  if (isNaN(projectIdNumber)) {
    console.error('Invalid projectId:', projectId);
    return res.status(400).json({ message: 'Invalid project ID.' });
  }

  const formattedStartDate = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
  const formattedEndDate = moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD');

  console.log('Formatted Start Date:', formattedStartDate);
  console.log('Formatted End Date:', formattedEndDate);

  // Parse assignedUser  string into an array
  let users;
  try {
    if (typeof assignedUser  === 'string') {
      users = JSON.parse(assignedUser ).map(user => ({
        userId: parseInt(user.userId, 10)
      })).filter(user => !isNaN(user.userId));
    } else if (Array.isArray(assignedUser )) {
      users = assignedUser .map(user => ({
        userId: parseInt(user.userId, 10)
      })).filter(user => !isNaN(user.userId));
    } else {
      console.error('Invalid format for assigned users:', assignedUser );
      return res.status(400).json({ message: 'Invalid format for assigned users.' });
    }
  } catch (parseError) {
    console.error('Error parsing assigned users:', parseError);
    return res.status(400).json({ message: 'Invalid format for assigned users.' });
  }

  console.log('Parsed Users:', users);

  try {
    // Fetch the project using the project ID
    const project = await getProjectByIdAsync(projectIdNumber);
    
    if (!project) {
      console.error('Project not found for ID:', projectIdNumber);
      return res.status(400).json({ message: 'Project not found.' });
    }

    const projectFolder = path.join('D:\\Product_Management', project.project_name);
    if (!fs.existsSync(projectFolder)) {
      console.error('Selected project folder does not exist:', projectFolder);
      return res.status(400).json({ message: 'Selected project folder does not exist.' });
    }

    const taskFolder = path.join(projectFolder, taskName);
    if (!fs.existsSync(taskFolder)) fs.mkdirSync(taskFolder, { recursive: true });

    const filePath = path.join(taskFolder, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const copyFilePath = path.join(taskFolder, `copy_of_${file.originalname}`);
    fs.copyFileSync(filePath, copyFilePath);

    const taskId = await insertTask(taskName, projectIdNumber, filePath, formattedStartDate, formattedEndDate, priority, status, comments);

    for (const { userId } of users) {
      await insertTaskAssignment(taskId, userId);
    }

    return res.status(200).json({ message: `Task "${taskName}" created successfully and assigned to users!` });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'An error occurred while creating the task.' });
  }
};




const getProjectByIdAsync = async (projectId) => {
  // console.log('Getting project by ID:', projectId);
  try {
    const project = await getProjectById(projectId);
    // console.log('Project fetched:', project);
    return project; 
  } catch (err) {
    console.error('Error fetching project:', err);
    throw err; 
  }
};





// Helper function to simulate inserting task asynchronously
const insertTaskAsync = (taskName, projectId, userId, filePath, description, status) => {
  return new Promise((resolve, reject) => {
    insertTask(taskName, projectId, userId, filePath, description, status, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};







const fetchProjects = (req, res) => {
  getProjects((err, projects) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching projects.' });
    }
    res.status(200).json(projects);
  });
};










const fetchTasks = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Extract the logged-in user's ID and role from the session
    const { id: loggedInUserId, username: loggedInUserName, role: loggedInUserRole } = req.session.user;

    console.log(`Fetching tasks for user: ${loggedInUserName} with role: ${loggedInUserRole}`);

    // Determine the SQL query based on the user's role
    let query = `
      SELECT
        tasks.task_id AS id,
        tasks.task_name AS taskName,
        projects.project_name AS projectName,
        tasks.doc_upload AS filePath,
        tasks.start_date AS startDate,
        tasks.end_date AS endDate,
        tasks.priority AS priority,
        tasks.status AS status,
        tasks.comments AS comments,
        tasks.created_at AS createdAt,
        tasks.updated_at AS updatedAt,
        GROUP_CONCAT(users.name) AS assignedUsers,
        GROUP_CONCAT(users.role) AS assignedRoles
      FROM tasks
      INNER JOIN projects ON tasks.project_id = projects.project_id
      LEFT JOIN task_assignments ON tasks.task_id = task_assignments.task_id
      LEFT JOIN users ON task_assignments.user_id = users.id
    `;

    // Add a WHERE clause if the user is not an admin
    const queryParams = [];
    if (loggedInUserRole !== 'admin') {
      query += ` WHERE users.id = ? `;
      queryParams.push(loggedInUserId);
    }

    // Add grouping for proper results
    query += ` GROUP BY tasks.task_id;`;

    // Execute the query
    const [results] = await db.query(query, queryParams);

    // console.log('Tasks fetched from database:', results); 
    res.status(200).json(results);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Error fetching tasks.' });
  }
};

















const openFile = (req, res) => {
  const { projectName, taskName } = req.params;

  // Define the path to the folder containing the file
  const taskFolder = path.join('D:', 'Product_Management', projectName, taskName);

  // Get the list of files in the task folder
  fs.readdir(taskFolder, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ message: 'Error reading task folder' });
    }

    // Identify the versioned files and the newest one
    const versionPattern = new RegExp(`_v(\\d+)\\.`); 
    let newestVersionFile = null;
    let highestVersion = 0;

    files.forEach(file => {
      const match = file.match(versionPattern);
      if (match) {
        const version = parseInt(match[1], 10);
        if (version > highestVersion) {
          highestVersion = version;
          newestVersionFile = file;
        }
      }
    });

    // Fallback to 'copy_of_' file if no versioned file is found
    const copyFile = files.find(file => file.startsWith('copy_of_'));
    const fileToOpen = newestVersionFile || copyFile;

    if (!fileToOpen) {
      return res.status(404).json({ message: 'No file found to open' });
    }

    // Define the full path of the file to open
    const filePath = path.join(taskFolder, fileToOpen);

    // Use exec to open the file in the default application
    exec(`start "" "${filePath}"`, (err) => {
      if (err) {
        console.error('Error opening file:', err);
        return res.status(500).json({ message: 'Error opening file' });
      }
      res.status(204).send(); 
    });
  });
};











const fetchUsers = (req, res) => {
  const query = 'SELECT id, fullname, role FROM users';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching users.' });
    }
    res.status(200).json(results);
  });
};





const updateTaskStatus = async (req, res) => {
  const { id, status } = req.body;

  // Validate input
  if (!id || !status) {
    return res.status(400).json({ message: 'Task ID and status are required.' });
  }

  // Wrap the database query in a Promise for async/await
  const query = 'UPDATE tasks SET status = ?, updated_at = NOW() WHERE task_id = ?';

  try {
    const [results] = await db.query(query, [status, id]);  

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json({ message: 'Task status updated successfully.' });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ message: 'Database error.' });
  }
};



const getUserById = (userId, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, null); // No user found
    }

    return callback(null, results[0]); // Return the first user result
  });
};




// const addUserToTask = async (req, res) => {
//   const { taskId } = req.params;
//   const { userId } = req.body;

//   if (!taskId || !userId) {
//     return res.status(400).json({ message: 'Task ID and User ID are required.' });
//   }

//   const insertQuery = 'INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)';
//   try {
//     const [results] = await db.query(insertQuery, [taskId, userId]);

//     const getTaskQuery = 'SELECT task_name, project_id, doc_upload FROM tasks WHERE task_id = ?';
//     const [task] = await db.query(getTaskQuery, [taskId]);

//     if (!task || task.length === 0) {
//       return res.status(404).json({ message: 'Task not found.' });
//     }

//     const { task_name, project_id, doc_upload } = task[0];

//     let parsedDocUpload;
//     if (typeof doc_upload === 'string') {
//       try {
//         parsedDocUpload = JSON.parse(doc_upload);
//       } catch (error) {
//         console.error('Error parsing doc_upload:', error);
//         return res.status(500).json({ message: 'Invalid document data format.' });
//       }
//     } else {
//       parsedDocUpload = doc_upload;
//     }

//     const firstFilePath = parsedDocUpload.filePath;

//     if (!fs.existsSync(firstFilePath)) {
//       return res.status(404).json({ message: 'The source file does not exist.' });
//     }

//     const project = await getProjectByIdAsync(project_id);
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found.' });
//     }

//     const projectFolder = path.join('D:\\Product_Management', project.project_name);
//     const taskFolder = path.join(projectFolder, task_name);

//     if (!fs.existsSync(taskFolder)) {
//       fs.mkdirSync(taskFolder, { recursive: true });
//     }

//     const fileBaseName = path.basename(firstFilePath, path.extname(firstFilePath));
//     const fileExtension = path.extname(firstFilePath);
//     const versionPattern = new RegExp(`${fileBaseName}_v(\\d+)${fileExtension}`);
//     const existingFiles = fs.readdirSync(taskFolder);

//     const versionNumbers = existingFiles
//       .map(file => {
//         const match = file.match(versionPattern);
//         return match ? parseInt(match[1], 10) : null;
//       })
//       .filter(version => version !== null);

//     const nextVersion = versionNumbers.length > 0 ? Math.max(...versionNumbers) + 1 : 1;
//     const newFileName = `${fileBaseName}_v${nextVersion}${fileExtension}`;
//     const newFilePath = path.join(taskFolder, newFileName);

//     try {
//       fs.copyFileSync(firstFilePath, newFilePath);
//     } catch (copyError) {
//       console.error('Error copying file:', copyError);
//       return res.status(500).json({ message: 'Error copying file.' });
//     }

//     // Insert into task_activity_logs table
//     const activityLogQuery = 'INSERT INTO task_activity_logs (user_id, task_id, action, timestamp) VALUES (?, ?, ?, NOW())';
//     const action = 'add';
//     // const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
//     await db.query(activityLogQuery, [userId, taskId, action]);

//     res.status(201).json({
//       message: 'User added to task successfully.',
//       newFile: newFileName,
//     });
//   } catch (err) {
//     if (err.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({ message: 'User is already assigned to this task.' });
//     }
//     console.error('Error adding user to task:', err);
//     res.status(500).json({ message: 'Error adding user to task.' });
//   }
// };












// const removeUserFromTask = async (req, res) => {
//   const { taskId, userId } = req.params;

//   // Validate input
//   if (!taskId || !userId) {
//     return res.status(400).json({ message: 'Task ID and User ID are required.' });
//   }

//   // Prepare the query to remove the user from the task
//   const deleteQuery = 'DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?';

//   try {
//     const [results] = await db.query(deleteQuery, [taskId, userId]); // Use promise-based query execution

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found in this task.' });
//     }

//     res.status(200).json({ message: 'User removed from task successfully.' });
//   } catch (err) {
//     console.error('Error removing user assignment:', err);
//     res.status(500).json({ message: 'Error removing user assignment.' });
//   }
// };








const addUserToTask = async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  if (!taskId || !userId) {
    return res.status(400).json({ message: 'Task ID and User ID are required.' });
  }

  const insertQuery = 'INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)';
  try {
    const [results] = await db.query(insertQuery, [taskId, userId]);

    const getTaskQuery = 'SELECT task_name, project_id, doc_upload FROM tasks WHERE task_id = ?';
    const [task] = await db.query(getTaskQuery, [taskId]);

    if (!task || task.length === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const { task_name, project_id, doc_upload } = task[0];

    let parsedDocUpload;
    if (typeof doc_upload === 'string') {
      try {
        parsedDocUpload = JSON.parse(doc_upload);
      } catch (error) {
        console.error('Error parsing doc_upload:', error);
        return res.status(500).json({ message: 'Invalid document data format.' });
      }
    } else {
      parsedDocUpload = doc_upload;
    }

    const firstFilePath = parsedDocUpload.filePath;

    if (!fs.existsSync(firstFilePath)) {
      return res.status(404).json({ message: 'The source file does not exist.' });
    }

    const project = await getProjectByIdAsync(project_id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const projectFolder = path.join('D:\\Product_Management', project.project_name);
    const taskFolder = path.join(projectFolder, task_name);

    if (!fs.existsSync(taskFolder)) {
      fs.mkdirSync(taskFolder, { recursive: true });
    }

    // Get the most recent version of the file
    const fileBaseName = path.basename(firstFilePath, path.extname(firstFilePath));
    const fileExtension = path.extname(firstFilePath);
    const versionPattern = new RegExp(`${fileBaseName}_v(\\d+)${fileExtension}`);
    const existingFiles = fs.readdirSync(taskFolder);

    // Find the latest version file
    const versionNumbers = existingFiles
      .map(file => {
        const match = file.match(versionPattern);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(version => version !== null);

    const latestVersion = versionNumbers.length > 0 ? Math.max(...versionNumbers) : 0;

    // Construct the file name for the new version
    const newVersion = latestVersion + 1;
    const newFileName = `${fileBaseName}_v${newVersion}${fileExtension}`;
    const newFilePath = path.join(taskFolder, newFileName);

    // Copy the last updated file (most recent version)
    const latestFile = `${fileBaseName}_v${latestVersion}${fileExtension}`;
    const lastUpdatedFilePath = path.join(taskFolder, latestFile);

    try {
      if (fs.existsSync(lastUpdatedFilePath)) {
        fs.copyFileSync(lastUpdatedFilePath, newFilePath);
      } else {
        fs.copyFileSync(firstFilePath, newFilePath); // Fallback if no updated version found
      }
    } catch (copyError) {
      console.error('Error copying file:', copyError);
      return res.status(500).json({ message: 'Error copying file.' });
    }

    // Insert into task_activity_logs table
    const activityLogQuery = 'INSERT INTO task_activity_logs (user_id, task_id, action, timestamp) VALUES (?, ?, ?, NOW())';
    const action = 'add';
    await db.query(activityLogQuery, [userId, taskId, action]);

    res.status(201).json({
      message: 'User added to task successfully.',
      newFile: newFileName,
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'User is already assigned to this task.' });
    }
    console.error('Error adding user to task:', err);
    res.status(500).json({ message: 'Error adding user to task.' });
  }
};











const removeUserFromTask = async (req, res) => {
  const { taskId, userId } = req.params;

  if (!taskId || !userId) {
    return res.status(400).json({ message: 'Task ID and User ID are required.' });
  }

  const deleteQuery = 'DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?';

  try {
    const [results] = await db.query(deleteQuery, [taskId, userId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found in this task.' });
    }

    // Insert into task_activity_logs table
    const activityLogQuery = 'INSERT INTO task_activity_logs (user_id, task_id, action, timestamp) VALUES (?, ?, ?, NOW())';
    const action = 'remove';
    // const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    await db.query(activityLogQuery, [userId, taskId, action]);

    res.status(200).json({ message: 'User removed from task successfully.' });
  } catch (err) {
    console.error('Error removing user assignment:', err);
    res.status(500).json({ message: 'Error removing user assignment.' });
  }
};







const updateTaskUsers = async (req, res) => {
  const { taskId } = req.params;
  const { addUsers, removeUsers } = req.body;

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  const queries = [];

  // Add users to task
  if (addUsers && addUsers.length > 0) {
    const addQuery = 'INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)';
    addUsers.forEach(userId => {
      queries.push(db.query(addQuery, [taskId, userId])); // Use promise-based query directly
    });
  }

  // Remove users from task
  if (removeUsers && removeUsers.length > 0) {
    const removeQuery = 'DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?';
    removeUsers.forEach(userId => {
      queries.push(db.query(removeQuery, [taskId, userId])); // Use promise-based query directly
    });
  }

  try {
    await Promise.all(queries); // Await all queries to complete
    res.status(200).json({ message: 'Task users updated successfully.' });
  } catch (err) {
    console.error('Error updating task users:', err);
    res.status(500).json({ message: 'Error updating task users.' });
  }
};




// Helper function to copy file for new user
const copyFileForNewUser = (taskId, assignedUserId, callback) => {
  getUserById(assignedUserId, (err, user) => {
    if (err || !user) {
      console.error('Error fetching user details:', err);
      return callback(new Error('Error fetching user details.'));
    }

    const username = user.fullname;

    getTaskById(taskId, (err, task) => {
      if (err || !task) {
        console.error('Error fetching task details:', err);
        return callback(new Error('Error fetching task details.'));
      }

      const taskFolder = path.dirname(task.file_path); // Task folder path
      const originalFile = path.basename(task.file_path); // Original file name
      const newFileName = `${path.parse(originalFile).name}_${username}${path.extname(originalFile)}`; // New file name with user
      const newFilePath = path.join(taskFolder, newFileName); // New file path

      // Copy the original file to the new location with the username appended
      fs.copyFile(task.file_path, newFilePath, (err) => {
        if (err) {
          console.error('Error copying file:', err);
          return callback(new Error('Error copying file.'));
        }

        console.log(`File copied for new user: ${newFilePath}`);
        callback(null);
      });
    });
  });
};




const logUserAssignmentHistory = (taskId, previousUserId, newUserId, callback) => {
  const query = 'INSERT INTO task_user_history (task_id, previous_user_id, new_user_id) VALUES (?, ?, ?)';
  db.query(query, [taskId, previousUserId, newUserId], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};




const fetchTaskUserHistory = (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  const query = `
    SELECT 
      tuh.id, 
      tuh.task_id, 
      u1.fullname AS previousUser, 
      u2.fullname AS newUser, 
      tuh.updated_at 
    FROM task_user_history tuh
    INNER JOIN users u1 ON tuh.previous_user_id = u1.id
    INNER JOIN users u2 ON tuh.new_user_id = u2.id
    WHERE tuh.task_id = ?
    ORDER BY tuh.updated_at DESC
  `;

  db.query(query, [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user assignment history.' });
    }

    res.status(200).json(results);
  });
};


// Open folder endpoint
const openFolder = (req, res) => {
  const { projectName } = req.params; 
  const folderPath = path.join('D:', 'Product_Management', projectName); 

  if (!fs.existsSync(folderPath)) {
    return res.status(404).send(); 
  }

  // Use exec to open the folder in the default file explorer
  exec(`explorer "${folderPath}"`, (err) => {
    if (err) {
      console.error('Error opening folder:', err);
      return res.status(500).send(); 
    }
    res.status(204).send(); 
  });
};























// const updateTaskDetails = async (req, res) => {
//   const { task_id } = req.params; // Get task_id from req.params
//   const { taskName, assignedUserIds, description, startDate, endDate, priority, status, comments } = req.body;

//   // Validate task_id
//   if (!task_id) {
//     return res.status(400).json({ message: 'Task ID is required.' });
//   }

//   // Ensure assignedUserIds is an array
//   const safeAssignedUserIds = Array.isArray(assignedUserIds) ? assignedUserIds : [];

//   try {
//     // Fetch task by ID
//     const task = await getTaskById(task_id);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found.' });
//     }

//     const updateQueries = [];
//     const params = [];

//     if (taskName !== undefined) {
//       updateQueries.push('task_name = ?');
//       params.push(taskName);
//     }

//     if (description !== undefined) {
//       updateQueries.push('description = ?');
//       params.push(description);
//     }

//     // Update task start date if provided
//     if (startDate) {
//       updateQueries.push('start_date = ?');
//       params.push(moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
//     }

//     // Update task end date if provided
//     if (endDate) {
//       updateQueries.push('end_date = ?');
//       params.push(moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
//     }

//     // Update task priority if provided
//     if (priority) {
//       updateQueries.push('priority = ?');
//       params.push(priority);
//     }

//     // Update task status if provided
//     if (status) {
//       updateQueries.push('status = ?');
//       params.push(status);
//     }

//     // Update task comments if provided
//     if (comments) {
//       updateQueries.push('comments = ?');
//       params.push(comments);
//     }

//     // Prepare the query to update the task
//     let updateQuery = 'UPDATE tasks SET ' + updateQueries.join(', ') + ' WHERE task_id = ?';
//     params.push(task_id);

//     // Execute the task update query
//     const [updateResult] = await db.query(updateQuery, params);

//     if (updateResult.affectedRows === 0) {
//       return res.status(404).json({ message: 'Task not found.' });
//     }

//     // Fetch current user assignments for the task
//     const [currentAssignments] = await db.query('SELECT user_id FROM task_assignments WHERE task_id = ?', [task_id]);
//     const currentAssignedUserIds = currentAssignments.map(row => row.user_id);

//     // Find user to replace
//     const userToReplace = currentAssignedUserIds.find(userId => safeAssignedUserIds.includes(userId));

//     // Remove the user that is being replaced if found
//     if (userToReplace) {
//       const deleteQuery = 'DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?';
//       await db.query(deleteQuery, [task_id, userToReplace]);
//     }

//     // Add new users (excluding already assigned users)
//     const usersToAdd = safeAssignedUserIds.filter(userId => !currentAssignedUserIds.includes(userId));

//     if (usersToAdd.length > 0) {
//       const insertValues = usersToAdd.map(userId => [task_id, userId]);
//       const insertQuery = 'INSERT INTO task_assignments (task_id, user_id) VALUES ?';
//       await db.query(insertQuery, [insertValues]);
//     }

//     // Final response
//     return res.status(200).json({ message: 'Task details updated successfully with correct user assignments.' });
//   } catch (err) {
//     console.error('Error updating task details:', err);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// };








































const updateTaskDetails = async (req, res) => {
  const { task_id } = req.params; // Get task_id from req.params
  const { taskName, assignedUserIds, description, startDate, endDate, priority, status, comments } = req.body;

  // Ensure user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  // Validate task_id
  if (!task_id) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  // Ensure assignedUserIds is an array
  const safeAssignedUserIds = Array.isArray(assignedUserIds) ? assignedUserIds : [];

  try {
    const task = await getTaskById(task_id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const updateQueries = [];
    const params = [];

    let previousStatus = task.status;

    if (taskName !== undefined) {
      updateQueries.push('task_name = ?');
      params.push(taskName);
    }

    if (description !== undefined) {
      updateQueries.push('description = ?');
      params.push(description);
    }

    if (startDate) {
      updateQueries.push('start_date = ?');
      params.push(moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    }

    if (endDate) {
      updateQueries.push('end_date = ?');
      params.push(moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    }

    if (priority !== undefined) {
      updateQueries.push('priority = ?');
      params.push(priority);
    }

    if (status !== undefined) {
      updateQueries.push('status = ?');
      params.push(status);
    }

    if (comments !== undefined) {
      updateQueries.push('comments = ?');
      params.push(comments);
    }

    const updateTaskQuery = `UPDATE tasks SET ${updateQueries.join(', ')} WHERE task_id = ?`;
    params.push(task_id);

    const [result] = await db.query(updateTaskQuery, params);
    
    if (result.affectedRows > 0) {
      await db.query(`
        INSERT INTO task_status_activity (task_id, user_id, previous_status, updated_status, timestamp)
        VALUES (?, ?, ?, ?, NOW())
      `, [task_id, req.session.user.id, previousStatus, status || task.status]); 
    }

    res.json({ success: true, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};




























const getTaskById = async (task_id) => {
  const [rows] = await db.query('SELECT * FROM tasks WHERE task_id = ?', [task_id]);
  return rows.length > 0 ? rows[0] : null; 
};





const fetchPendingTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchPendingTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending tasks' });
  }
};





const fetchInProgressTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchInProgressTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};




const fetchOnHoldTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchOnHoldTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};



const fetchCompletedTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchCompletedTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};



const fetchUnderReviewTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchUnderReviewTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};


const getTaskActivityLogs = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  // SQL query to fetch logs along with the user name
  const query = `
    SELECT tal.user_id, u.name, tal.task_id, tal.action, tal.timestamp
    FROM task_activity_logs tal
    JOIN users u ON tal.user_id = u.id
    WHERE tal.task_id = ?
    ORDER BY tal.timestamp DESC
  `;
  
  try {
    const [logs] = await db.query(query, [taskId]);

    if (logs.length === 0) {
      return res.status(404).json({ message: 'No activity logs found for this task.' });
    }

    res.status(200).json({
      message: 'Task activity logs retrieved successfully.',
      logs,
    });
  } catch (err) {
    console.error('Error fetching task activity logs:', err);
    res.status(500).json({ message: 'Error fetching task activity logs.' });
  }
};


export const getPendingTaskCount = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const pendingTaskCount = await taskModel.getPendingTaskCount(loggedInUserRole, loggedInUserId);

    res.json({ success: true, data: { pendingTaskCount } });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending tasks' });
  }
};


const fetchTaskStatusActivity = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { taskId } = req.params; 

    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required.' });
    }

    // Fetch the task status activity using the model
    const activity = await taskModel.fetchTaskStatusActivity(taskId);
    if (!activity || activity.length === 0) {
      return res.status(404).json({ message: 'No activity found for this task.' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching task status activity:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task status activity' });
  }
};





export default { createTask, fetchProjects, fetchTasks, openFile, openFolder, fetchUsers,
   updateTaskStatus, updateTaskDetails, fetchTaskUserHistory, 
   removeUserFromTask, fetchPendingTasks, fetchInProgressTasks, fetchOnHoldTasks,
   fetchCompletedTasks, fetchUnderReviewTasks, addUserToTask, updateTaskUsers,
    getTaskActivityLogs, getPendingTaskCount, fetchTaskStatusActivity};