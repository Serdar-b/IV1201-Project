const bcrypt = require('bcrypt');

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
  const query =
    "SELECT * FROM public.person WHERE username = $1 OR email = $2";
  const values = [username, email];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      console.log("User found:", res.rows);
      return new User(res.rows[0]);
    }
    return null;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return null;
  }
};

const createUser = async (userData) => {
  const query =
    "INSERT INTO public.person (name, surname, pnr, email, password, username) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
  const values = [userData.name, userData.surname, userData.pnr, userData.email, userData.password, userData.username];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      return { success: true, user: res.rows[0] };
    } else {
      return { success: false, message: "User could not be created" };
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
    return { success: false, error: err.message };
  }
}





module.exports = { findUserByUsername, findUserByUsernameOrEmail, createUser };
