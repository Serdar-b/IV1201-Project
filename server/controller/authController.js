const jwt = require('jsonwebtoken');
const userDAO = require('../integration/userDAO');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userDAO.findUser(username, password);

  if (user) {
    const payload = {
      person_id: user.getPerson_id,
      name: user.getName,
      username: user.getUserName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1 minute' });

    res.json({ success: true, message: "Login successful", token: token, user: payload });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  
    // Check if the user already exists
    const existingUser = await userDAO.findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userCreationResult = await userDAO.createUser({
      username,
      email,
      password: hashedPassword,
    });

    if (userCreationResult.success) {
      res.json({ success: true, message: "Registration successful" });
    } else {
      res.status(500).json({ success: false, message: "Could not register user" });
    }

};


module.exports = { login, register };
