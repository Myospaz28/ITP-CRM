//database/db.js

import mysql from 'mysql2/promise'; 

// Create a connection pool

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'db_mms',
});


// const db = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'dzmbjxtk_pdm_new',
//   password: 'dzmbjxtk_pdm_new',
//   database: 'dzmbjxtk_pdm_new',
// });

// Connect to the database
const connectToDatabase = async () => {
  try {
    await db.getConnection();
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Error connecting to MySQL database:', err);
  }
};

connectToDatabase();

export default db; 








// import mysql from 'mysql2';

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'pdm_database'
// });

// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to the MySQL database:', err);
//     return;
//   }
//   console.log('Connected to the MySQL database successfully.');
// });

// export default db;






// // server/database/db.js
// import mysql from 'mysql2';

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'pdm_database',
// });
// db.connect(err => {
//     if (err) {
//       console.error('Error connecting to the MySQL database:', err);
//       return;
//     }
//     console.log('Connected to the MySQL database successfully.');
//   });
// export default db;
