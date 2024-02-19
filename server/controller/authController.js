const jwt = require('jsonwebtoken');
const userDAO = require('../integration/userDAO');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userDAO.findUserByUsername(username);

  if (user) {
    // Now compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const payload = {
        person_id: user.person_id,
        name: user.name,
        username: user.username,
        role: user.getRoleId,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30 minutes' });
      res.json({ success: true, message: "Login successful", token: token, user: payload });
    } else {
      // Password does not match
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else {
    // User not found with the username or email
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

const register = async (req, res) => {
  const { name, surname, pnr, password, email, username } = req.body;

  // Check if the user already exists
  const existingUser = await userDAO.findUserByUsernameOrEmail(username, email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: "User already exists" });
  }

  // Hash the password
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
    res.status(500).json({ success: false, message: "Could not register user" });
  }

};


module.exports = { login, register };
