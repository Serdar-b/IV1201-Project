const bcrypt = require("bcrypt");
const pool = require("../db");
const User = require("../model/User");

/**
 * Finds a user by username.
 * @param {string} username - The username of the user.
 * @throws Will throw an error if the username starts with a number or is too short.
 * @returns {User|null} The found user as a User object or null if not found.
 */
const findUserByUsername = async (username) => {

  if (!isNaN(username.charAt(0))) {
    throw new Error("authorization_validation.username_numeric_start");
  }
  
  if (!username || username.length < 3) {
    throw new Error("authorization_validation.username_short");
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

/**
 * Finds a user by either username or email.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @throws Will throw an error if the username starts with a number, the email format is incorrect, or the username is too short.
 * @returns {User|null} The found user as a User object or null if not found.
 */
const findUserByUsernameOrEmail = async (username, email) => {

  if (!isNaN(username.charAt(0))) {
    throw new Error("authorization_validation.username_numeric_start");
  }
  
  if (!email.includes("@") || !email.includes(".")) {
    throw new Error("authorization_validation.email_invalid");
  }

  if (username && username.length < 3) {
    throw new Error("authorization_validation.username_short");
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

/**
 * Creates a new user in the database.
 * @param {Object} client - The database client.
 * @param {Object} userData - The user data including name, surname, personal identification number (pnr), email, password, and username.
 * @throws Will throw an error if any validation fails or if a database error occurs.
 * @returns {Object} An object containing the operation success status and the created user.
 */
const createUser = async (client, userData) => {
  
  if (!userData.username || userData.username.length < 3) {
    throw new Error("authorization_validation.username_short");
  }
  
  if (userData.pswLength < 6) {
    throw new Error("authorization_validation.password_short");
  }
  if (isNaN(userData.pnr) || userData.pnr.includes(".")) {
    throw new Error("authorization_validation.pnr_numeric");
  }
  if (!userData.email.includes("@") || !userData.email.includes(".")) {
    throw new Error("authorization_validation.email_invalid");
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

/**
 * Logs a failed attempt for user actions such as login or registration.
 * @param {Object} client - The database client.
 * @param {number|null} personId - The person ID associated with the log.
 * @param {string|null} email - The email associated with the log.
 * @param {string|null} username - The username associated with the log.
 * @param {string} reason - The reason for logging the attempt.
 * @param {string} userAgent - The user agent of the client making the request.
 * @param {string} ipAddress - The IP address of the client making the request.
 * @throws Will throw an error if a database error occurs during the logging.
 */
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
