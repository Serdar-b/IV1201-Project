const users = [
    { username: 'admin', password: 'password123' }, 
  ];
  
  const findUserByUsername = (username) => {
    return users.find((user) => user.username === username);
  };
  
  module.exports = { findUserByUsername };
  
  
// const pool = require('../integration/db');

// const findUserByUsername = async (username, password) => {
//   // Hardcoded values for testing
//   username = 'JoelleWilkinson'; // Use single quotes for string literals
//   password = 'LiZ98qvL8Lw'; // Use single quotes for string literals

//   //const query = "SELECT * FROM public.person WHERE username = $1 AND password = $2";
//   const query = "select * from public.person limit 10";
//   const values = [username, password];

//   try {
//     const res = await pool.query(query, values);
//     if (res.rows.length > 0) {
//       return res.rows[0];
//     } else {
//       return null;
//     }
//   } catch (err) {
//     console.error('Error executing query', err.stack);
//     return null;
//   }
// };

// module.exports = { findUserByUsername };
