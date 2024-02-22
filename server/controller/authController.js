// const jwt = require("jsonwebtoken");
// const userDAO = require("../integration/userDAO");
// const bcrypt = require("bcrypt");

// const login = async (req, res) => {
//   const { username, password } = req.body;
//   const userAgent = req.headers['user-agent'];
//   const user = await userDAO.findUserByUsername(username);

//   if (user) {
//     // Compare the provided password with the hashed password stored in the database
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       const payload = {
//         person_id: user.person_id,
//         name: user.name,
//         username: user.username,
//         role: user.getRoleId,
//       };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: "30 minutes",
//       });

//       res.cookie("token", token, { httpOnly: true });
//       res.json({ success: true, message: "Login successful", user: payload });
//     } else {
//       // Password does not match
//       const logMessage = "Entered wrong password";
//       await userDAO.logFailedAttempt(null, null, username, logMessage, userAgent);
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } else {
//     // User not found with the username or email
//     const logMessage = "User not found";
//     await userDAO.logFailedAttempt(null, null, null, logMessage, userAgent);
//     res.status(401).json({ success: false, message: "Invalid credentials" });
//   }
// };

// const register = async (req, res) => {
//   const { name, surname, pnr, password, email, username } = req.body;
//   const userAgent = req.headers['user-agent'];

//   //this two added for server side validation as it requires in number 25
//   if (!username || username.length < 3) {
//     return res
//       .status(400)
//       .send({
//         success: false,
//         message: "Username must be at least 3 characters long.",
//       });
//   }
//   if (!password || password.length < 6) {
//     return res
//       .status(400)
//       .send({
//         success: false,
//         message: "Password must be at least 6 characters long.",
//       });
//   }

//   if (isNaN(pnr) || pnr.includes(".")) {
//     return res
//       .status(400)
//       .send({
//         success: false,
//         message: "PNR must be a number.",
//       });
//   }

//   if (!email.includes("@") || !email.includes(".")) {
//     return res
//       .status(400)
//       .send({
//         success: false,
//         message: "Please enter a valid email address.",
//       });
//   }

//   // Check if the user already exists
//   const existingUser = await userDAO.findUserByUsernameOrEmail(username, email);
//   if (existingUser) {
//     return res
//       .status(409)
//       .json({ success: false, message: "User already exists" });
//   }

//   // Hash the password
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(password, saltRounds);

//   const userCreationResult = await userDAO.createUser({
//     name,
//     surname,
//     pnr,
//     email,
//     password: hashedPassword,
//     username,
//   });

//   if (userCreationResult.success) {
//     res.json({ success: true, message: "Registration successful" });
//   } else {
//     const logMessage = "Could not register user";
//     try {
//       await userDAO.logFailedAttempt(null, email, username, logMessage, userAgent);
//     } catch (error) {
//       console.error('Failed to log failed attempt:', error);
//     }
//     res
//       .status(500)
//       .json({ success: false, message: logMessage });
//   }
// };


// module.exports = { login, register };



const jwt = require("jsonwebtoken");
const userDAO = require("../integration/userDAO");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { username, password } = req.body;
  const userAgent = req.headers['user-agent'];

  try {
    const user = await userDAO.findUserByUsername(username);

    if (!user) {
      await userDAO.logFailedAttempt(null, null, null, "User not found", userAgent);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await userDAO.logFailedAttempt(null, null, username, "Entered wrong password", userAgent);
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

    res.cookie("token", token, { httpOnly: true });
    res.json({ success: true, message: "Login successful", user: payload });

  } catch (error) {
    console.error('Login error:', error);
    // You could also use the logFailedAttempt function here if it makes sense for your application
    res.status(500).json({ success: false, message: "An error occurred during login." });
  }
};

const register = async (req, res) => {
  const { name, surname, pnr, password, email, username } = req.body;
  const userAgent = req.headers['user-agent'];

  try {
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

    const existingUser = await userDAO.findUserByUsernameOrEmail(username, email);

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userCreationResult = await userDAO.createUser({
      name,
      surname,
      pnr,
      email,
      password: hashedPassword,
      username,
    });

    if (userCreationResult.success) {
      res.json({ success: true, message: "Registration successful" });
    } else {
      const logMessage = "Could not register user";
      await userDAO.logFailedAttempt(null, email, username, logMessage, userAgent);
      res.status(500).json({ success: false, message: logMessage });
    }

  } catch (error) {
    console.error('Registration error:', error);
    await userDAO.logFailedAttempt(null, email, username, error.message, userAgent);
    res.status(500).json({ success: false, message: "An error occurred during registration." });
  }
};

module.exports = { login, register };
