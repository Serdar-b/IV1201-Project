// const jwt = require("jsonwebtoken");
// const userDAO = require("../integration/userDAO");
// const bcrypt = require("bcrypt");

// const login = async (req, res) => {
//   const { username, password } = req.body;
//   const userAgent = req.headers['user-agent'];
//   const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   if (!username || !password) {
//     return res.status(400).json({ success: false, message: "Username and password are required." });
//   }

//   if (username.length < 3) {
//     return res.status(400).json({ success: false, message: "Username must be at least 3 characters long" });
//   }

//   if (password.length < 6) {
//     return res.status(400).json({ success: false, message: "password must be at least 6 characters long" });
//   }

//   try {
//     const user = await userDAO.findUserByUsername(username);

//     if (!user) {
//       await userDAO.logFailedAttempt(null, null, null, "User not found", userAgent, ipAddress);
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       await userDAO.logFailedAttempt(null, null, username, "Entered wrong password", userAgent, ipAddress);
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const payload = {
//       person_id: user.person_id,
//       name: user.name,
//       username: user.username,
//       role: user.getRoleId,
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "30 minutes",
//     });

//     res.cookie("token", token, { httpOnly: true });
//     res.json({ success: true, message: "Login successful", user: payload });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ success: false, message: "An error occurred during login." });
//   }
// };

// const register = async (req, res) => {
//   const { name, surname, pnr, password, email, username } = req.body;
//   const userAgent = req.headers['user-agent'];

//   try {
//     if (!username || username.length < 3) {
//       return res.status(400).send({ success: false, message: "Username must be at least 3 characters long." });
//     }

//     if (!password || password.length < 6) {
//       return res.status(400).send({ success: false, message: "Password must be at least 6 characters long." });
//     }

//     if (isNaN(pnr) || pnr.includes(".")) {
//       return res.status(400).send({ success: false, message: "PNR must be a number." });
//     }

//     if (!email.includes("@") || !email.includes(".")) {
//       return res.status(400).send({ success: false, message: "Please enter a valid email address." });
//     }

//     const existingUser = await userDAO.findUserByUsernameOrEmail(username, email);

//     if (existingUser) {
//       return res.status(409).json({ success: false, message: "User already exists" });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const userCreationResult = await userDAO.createUser({
//       name,
//       surname,
//       pnr,
//       email,
//       password: hashedPassword,
//       username,
//     });

//     if (userCreationResult.success) {
//       res.json({ success: true, message: "Registration successful" });
//     } else {
//       const logMessage = "Could not register user";
//       await userDAO.logFailedAttempt(null, email, username, logMessage, userAgent, ipAddress);
//       res.status(500).json({ success: false, message: logMessage });
//     }

//   } catch (error) {
//     console.error('Registration error:', error);
//     await userDAO.logFailedAttempt(null, email, username, error.message, userAgent, ipAddress);
//     res.status(500).json({ success: false, message: "An error occurred during registration." });
//   }
// };

// module.exports = { login, register };



const pool = require("../db");
const jwt = require("jsonwebtoken");
const userDAO = require("../integration/userDAO");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { username, password } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  if (username.length < 3) {
    return res.status(400).json({ success: false, message: "Username must be at least 3 characters long" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "password must be at least 6 characters long" });
  }

  const client = await pool.connect();

  try {
    // You may begin a transaction if you need to perform a log on failed attempt
    await client.query('BEGIN');
    
    const user = await userDAO.findUserByUsername(username);

    if (!user) {
      await userDAO.logFailedAttempt(client, null, null, null, "User not found", userAgent, ipAddress);
      await client.query('ROLLBACK');
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await userDAO.logFailedAttempt(client, null, null, username, "Entered wrong password", userAgent, ipAddress);
      await client.query('ROLLBACK');
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

      const payload = {
      person_id: user.person_id,
      name: user.name,
      username: user.username,
      role: user.getRoleId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30 minutes",
    });

    
    //res.cookie("token", token, { httpOnly: true, secure: true });
    //res.json({ success: true, message: "Login successful", user: payload });
   
res.json({ success: true, message: "Login successful", user: payload, token: token });


    // Commit if all goes well
    await client.query('COMMIT');
  } catch (error) {
    // Rollback in case of any error
    await client.query('ROLLBACK');
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: "An error occurred during login." });
  } finally {
    // Release the client in the end
    client.release();
  }
};


const register = async (req, res) => {
    const { name, surname, pnr, password, email, username } = req.body;
  const userAgent = req.headers['user-agent'];

    if (!username || username.length < 3) {
      return res.status(400).send({ success: false, message: "Username must be at least 3 characters long." });
    }

    if (!password || password.length < 6) {
      return res.status(400).send({ success: false, message: "Password must be at least 6 characters long." });
    }

    if (isNaN(pnr) || pnr.includes(".")) {
      return res.status(400).send({ success: false, message: "PNR must be a number." });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).send({ success: false, message: "Please enter a valid email address." });
    }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existingUser = await userDAO.findUserByUsernameOrEmail(username, email);

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const userCreationResult = await userDAO.createUser(client, {
      name,
      surname,
      pnr,
      email,
      password: hashedPassword,
      username,
    });

    if (userCreationResult.success) {
      await client.query('COMMIT');
      res.json({ success: true, message: "Registration successful" });
    } else {
      // Log failed attempt if user creation was not successful
      const logMessage = "Could not register user";
      await userDAO.logFailedAttempt(client, null, email, username, logMessage, userAgent, ipAddress);
      await client.query('ROLLBACK');
      res.status(500).json({ success: false, message: logMessage });
    }
  } catch (error) {
    // Rollback in case of any error
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    await userDAO.logFailedAttempt(client, null, email, username, error.message, userAgent, ipAddress);
    res.status(500).json({ success: false, message: "An error occurred during registration." });
  } finally {
    // Release the client in the end
    client.release();
  }
};

module.exports = { login, register };