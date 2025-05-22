import mysql from 'mysql2';
import db from '../database/db.js';

// Insert task into the tasks table
const insertTask = async (taskName, projectId, filePath, startDate, endDate, priority, status, comments) => {
  try {
    console.log('Inserting task:', { taskName, projectId, filePath, startDate, endDate, priority, status, comments });

    const sqlTask = `
      INSERT INTO tasks (task_name, project_id, doc_upload, start_date, end_date, priority, status, comments, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    console.log('Executing SQL for insertTask:', sqlTask);
    console.log('With parameters:', [taskName, projectId, JSON.stringify({ filePath }), startDate, endDate, priority, status, comments]);
    
    // Execute query and get result directly
    const [result] = await db.query(sqlTask, [taskName, projectId, JSON.stringify({ filePath }), startDate, endDate, priority, status, comments]);

    const taskId = result.insertId;  
    console.log('Inserted Task ID:', taskId); 
    return taskId; 
  } catch (error) {
    throw new Error(`Failed to insert task: ${error.message}`);
  }
};




const insertTaskAssignment = async (taskId, userId) => {
  // Check if the assignment already exists
  const [existingAssignment] = await db.query(
    'SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?',
    [taskId, userId]
  );

  if (existingAssignment.length > 0) {
    console.log(`User ${userId} is already assigned to task ${taskId}`);
    return; // Skip inserting if already assigned
  }

  // Proceed with the insert if no existing assignment is found
  await db.query(
    'INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)',
    [taskId, userId]
  );
  console.log('User assigned:', userId);
};  


// Get all projects (for task dropdown)
const getProjects = (callback) => {
  const sql = 'SELECT * FROM projects';
  db.query(sql, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};















// const updateTask = async (taskId, taskName, projectId, filePath, startDate, endDate, priority, status, comments) => {
//   try {
//     console.log('Updating task:', { taskId, taskName, projectId, filePath, startDate, endDate, priority, status, comments });

//     const sqlTask = `
//       UPDATE tasks
//       SET 
//         task_name = ?, 
//         project_id = ?, 
//         doc_upload = ?, 
//         start_date = ?, 
//         end_date = ?, 
//         priority = ?, 
//         status = ?, 
//         comments = ?, 
//         updated_at = NOW()
//       WHERE task_id = ?
//     `;

//     console.log('Executing SQL for updateTask:', sqlTask);
//     console.log('With parameters:', [taskName, projectId, JSON.stringify({ filePath }), startDate, endDate, priority, status, comments, taskId]);

//     // Execute query and get result directly
//     const [result] = await db.query(sqlTask, [taskName, projectId, JSON.stringify({ filePath }), startDate, endDate, priority, status, comments, taskId]);

//     if (result.affectedRows === 0) {
//       throw new Error('Task not found or no changes made');
//     }

//     console.log('Updated Task ID:', taskId); // Log the Task ID
//     return taskId;  // Return the task ID
//   } catch (error) {
//     throw new Error(`Failed to update task: ${error.message}`);
//   }
// };






const updateTask = async (taskId, taskName, projectId, filePath, startDate, endDate, priority, newStatus, comments, userId) => {
  try {
    // Fetch the previous status of the task
    const [task] = await db.query('SELECT status FROM tasks WHERE task_id = ?', [taskId]);
    if (!task.length) {
      throw new Error('Task not found');
    }

    const previousStatus = task[0].status;

    // Update the task
    const sqlTask = `
      UPDATE tasks
      SET 
        task_name = ?, 
        project_id = ?, 
        doc_upload = ?, 
        start_date = ?, 
        end_date = ?, 
        priority = ?, 
        status = ?, 
        comments = ?, 
        updated_at = NOW()
      WHERE task_id = ?
    `;
    const [result] = await db.query(sqlTask, [taskName, projectId, JSON.stringify({ filePath }), startDate, endDate, priority, newStatus, comments, taskId]);

    if (result.affectedRows === 0) {
      throw new Error('Task not found or no changes made');
    }

    // Log the status change in task_status_activity
    const sqlLog = `
      INSERT INTO task_status_activity (task_id, user_id, previous_status, updated_status, timestamp)
      VALUES (?, ?, ?, ?, NOW())
    `;
    await db.query(sqlLog, [taskId, userId, previousStatus, newStatus]);

    return taskId;
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
};



















const fetchPendingTasks = async (loggedInUserRole, loggedInUserId) => {
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
    WHERE tasks.status = 'pending'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY tasks.task_id;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};



const fetchInProgressTasks = async (loggedInUserRole, loggedInUserId) => {
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
    WHERE tasks.status = 'in progress'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY tasks.task_id;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};


const fetchOnHoldTasks = async (loggedInUserRole, loggedInUserId) => {
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
    WHERE tasks.status = 'on hold'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY tasks.task_id;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};



const fetchCompletedTasks = async (loggedInUserRole, loggedInUserId) => {
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
    WHERE tasks.status = 'completed'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY tasks.task_id;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};


// const fetchUnderReviewTasks = async () => {
//   const query = `
//     SELECT
//       tasks.task_id AS id,
//       tasks.task_name AS taskName,
//       projects.project_name AS projectName,
//       tasks.doc_upload AS filePath,
//       tasks.start_date AS startDate,
//       tasks.end_date AS endDate,
//       tasks.priority AS priority,
//       tasks.status AS status,
//       tasks.comments AS comments,
//       tasks.created_at AS createdAt,
//       tasks.updated_at AS updatedAt,
//       GROUP_CONCAT(users.name) AS assignedUsers,
//       GROUP_CONCAT(users.role) AS assignedRoles
//     FROM tasks
//     INNER JOIN projects ON tasks.project_id = projects.project_id
//     LEFT JOIN task_assignments ON tasks.task_id = task_assignments.task_id
//     LEFT JOIN users ON task_assignments.user_id = users.id
//     WHERE tasks.status = 'under review'
//     GROUP BY tasks.task_id;
//   `;
//   try {
//     const [results] = await db.query(query);
//     return results;
//   } catch (err) {
//     console.error('Database error:', err);
//     throw err;
//   }
// };



const fetchUnderReviewTasks = async (loggedInUserRole, loggedInUserId) => {
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
    WHERE tasks.status = 'under review'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY tasks.task_id;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};



const getPendingTaskCount = async (userRole, userId) => {
  try {
    const query = `
      SELECT COUNT(*) AS pendingTaskCount 
      FROM tasks 
      JOIN task_assignments ON tasks.task_id = task_assignments.task_id
      WHERE task_assignments.user_id = ? AND tasks.status = 'pending';
    `;

    const [rows] = await db.execute(query, [userId]);
    return rows[0]?.pendingTaskCount || 0; // Return the count or 0 if no pending tasks
  } catch (error) {
    console.error('Error in fetchPendingTasks model:', error);
    throw error; // Re-throw the error to handle it in the controller
  }
};



const fetchTaskStatusActivity = async (taskId) => {
  const query = `
    SELECT
      tsa.tsa_id AS activityId,
      tsa.previous_status AS previousStatus,
      tsa.updated_status AS updatedStatus,
      tsa.timestamp AS timestamp,
      u.name AS userName,
      u.role AS role
    FROM task_status_activity tsa
    INNER JOIN users u ON tsa.user_id = u.id
    WHERE tsa.task_id = ?
    ORDER BY tsa.timestamp DESC;
  `;

  try {
    const [results] = await db.query(query, [taskId]);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};




export default { insertTask, getProjects, insertTaskAssignment, updateTask, fetchPendingTasks, 
  fetchInProgressTasks, fetchOnHoldTasks, fetchCompletedTasks, fetchUnderReviewTasks, getPendingTaskCount, fetchTaskStatusActivity};
