const bcrypt = require("bcrypt");

const pool = require("../db");
const User = require("../model/User");

const findUserByUsername = async (username) => {
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

const findUserByUsernameOrEmail = async (username, email) => {
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


const createUser = async (userData) => {
  // Begin transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // start transaction block

    // Insert user details into the person table
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
    await client.query("COMMIT"); // commit changes
    return { success: true, user: userResult.rows[0] };
  } catch (err) {
    await client.query("ROLLBACK"); // rollback changes on error
    console.error("Transaction failed. Error:", err.stack);
    return { success: false, error: err.message };
  } finally {
    client.release(); // release the client back to the pool
  }
};

module.exports = { findUserByUsername, findUserByUsernameOrEmail, createUser };
