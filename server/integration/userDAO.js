// const bcrypt = require("bcrypt");

// const pool = require("../db");
// const User = require("../model/User");

// const findUserByUsername = async (username) => {
//   const query = "SELECT * FROM public.person WHERE username = $1";
//   const values = [username];

//   try {
//     const res = await pool.query(query, values);
//     if (res.rows.length > 0) {
//       return new User(res.rows[0]);
//     }
//     return null;
//   } catch (err) {
//     console.error("Error executing query", err.stack);
//     return null;
//   }
// };

// const findUserByUsernameOrEmail = async (username, email) => {
//   const query = "SELECT * FROM public.person WHERE username = $1 OR email = $2";
//   const values = [username, email];

//   try {
//     const res = await pool.query(query, values);
//     if (res.rows.length > 0) {
//       return new User(res.rows[0]);
//     }
//     return null;
//   } catch (err) {
//     console.error("Error executing query", err.stack);
//     return null;
//   }
// };


// const createUser = async (userData) => {
//   // Begin transaction
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN"); // start transaction block

//     // Insert user details into the person table
//     const insertUserText = `
//       INSERT INTO public.person (name, surname, pnr, email, password, role_id, username)
//       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
//     `;
//     const roleId = 2;
//     const insertUserValues = [
//       userData.name,
//       userData.surname,
//       userData.pnr,
//       userData.email,
//       userData.password,
//       roleId,
//       userData.username,
//     ];

//     const userResult = await client.query(insertUserText, insertUserValues);
//     await client.query("COMMIT"); // commit changes
//     return { success: true, user: userResult.rows[0] };
//   } catch (err) {
//     await client.query("ROLLBACK"); // rollback changes on error
//     console.error("Transaction failed. Error:", err.stack);
//     return { success: false, error: err.message };
//   } finally {
//     client.release(); // release the client back to the pool
//   }
// };

// const logFailedAttempt = async (personId, email, username, reason, userAgent, ipAddress) => {
//   const client = await pool.connect();

//   try {
//     await client.query('BEGIN'); 
//     const insertText = `
//       INSERT INTO logs (person_id, email, username, reason, user_agent, ip_address)
//       VALUES ($1, $2, $3, $4, $5, $6)
//     `;
//     const insertValues = [personId, email, username, reason, userAgent, ipAddress];
    
//     await client.query(insertText, insertValues);

//     await client.query('COMMIT'); 
//     console.log('Logging success.');
//   } catch (err) {
//     await client.query('ROLLBACK'); 
//     console.error('Error creating log: ', err);
//   } finally {
//     client.release(); 
//   }
// };

// module.exports = { findUserByUsername, findUserByUsernameOrEmail, createUser, logFailedAttempt };


const bcrypt = require("bcrypt");

const pool = require("../db");
const User = require("../model/User");

// Finds a user by username
const findUserByUsername = async (username) => {

  if (!isNaN(username.charAt(0))) {
    return { success: false, message: "Username must not start with a number." };
  }

  if (!username || username.length < 3) {
    return { success: false, message: "Username must be at least 3 characters long." };
  }
  const query = "SELECT * FROM public.person WHERE username = $1";
  const values = [username];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      return new User(res.rows[0]);
    }
    return null;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return null;
  }
};

// Finds a user by username or email
const findUserByUsernameOrEmail = async (username, email) => {

  if (!isNaN(username.charAt(0))) {
    return { success: false, message: "Username must not start with a number." };
  }
  if (!email.includes("@") || !email.includes(".")) {
    return { success: false, message: "Email must have @ or ." };
  }
  const query = "SELECT * FROM public.person WHERE username = $1 OR email = $2";
  const values = [username, email];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      return new User(res.rows[0]);
    }
    return null;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return null;
  }
};


const createUser = async (client, userData) => {
  if (!userData.username || userData.username.length < 3) {
    return { success: false, message: "Username must be at least 3 characters long." };
  }
  if (!userData.password || userData.password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long." };
  }
  if (isNaN(userData.pnr) || userData.pnr.includes(".")) {
    return { success: false, message: "PNR must be a number." };
  }
  if (!userData.email.includes("@") || !userData.email.includes(".")) {
    return { success: false, message: "Please enter a valid email address." };
  }
  const insertUserText = `
    INSERT INTO public.person (name, surname, pnr, email, password, role_id, username)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;
  const roleId = 2; 
  const insertUserValues = [
    userData.name,
    userData.surname,
    userData.pnr,
    userData.email,
    userData.password,
    roleId,
    userData.username,
  ];

  const userResult = await client.query(insertUserText, insertUserValues);
  return { success: true, user: userResult.rows[0] };
};

// Logs a failed attempt in the database
const logFailedAttempt = async (client, personId, email, username, reason, userAgent, ipAddress) => {
  
  const insertText = `
    INSERT INTO logs (person_id, email, username, reason, user_agent, ip_address)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const insertValues = [personId, email, username, reason, userAgent, ipAddress];
  
  await client.query(insertText, insertValues);
};

module.exports = {
  findUserByUsername,
  findUserByUsernameOrEmail,
  createUser,
  logFailedAttempt
};
