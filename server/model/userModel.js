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
      return res.rows[0]; // User found
    }
    return null; // User not found
  } catch (err) {
    console.error('Error executing query', err.stack);
    return null;
  }
};

 


// async function testLogin() {
//   const username = 'ArmandTodd'; 
//   const password = 'LbH38urF4Kn'; 

//   try {
//     const user = await findUserByUsername(username, password);
//     if (user) {
//       console.log('User found:', user);
//     } else {
//       console.log('User not found or incorrect password.');
//     }
//   } catch (error) {
//     console.error('Error during login test:', error);
//   }
// }

// testLogin();

module.exports = { findUserByUsername };