const pool = require("../db");
const User = require("../model/User");

//here we use sql to check if the user is in our database
const findUser = async (username, password) => {
  const query =
    "SELECT * FROM public.person WHERE username = $1 AND password = $2";
  const values = [username, password];

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

module.exports = { findUser };
