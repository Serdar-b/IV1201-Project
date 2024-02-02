// const pool = require('../integration/db');
// const users = [
//     { username: 'admin', password: 'password123' }, 
//   ];
  
//   const findUserByUsername = (username) => {
//     return users.find((user) => user.username === username);
//   };
  
//   module.exports = { findUserByUsername };
  
  

const pool = require('../integration/db');

const findUserByUsername = async (username, password) => {
  const query = "SELECT * FROM public.person WHERE username = $1 AND password = $2";
  const values = [username, password];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      console.log('User found:', res.rows);
      return res.rows[0]; // User found
    }
    return null; // User not found
  } catch (err) {
    console.error('Error executing query', err.stack);
    return null;
  }
};

module.exports = { findUserByUsername };