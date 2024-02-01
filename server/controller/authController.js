
const userModel = require('../model/userModel');

const login = (req, res) => {
  const { username, password } = req.body;
  const user = userModel.findUserByUsername(username);
  
  if (user && user.password === password) { // Password should be hashed and checked with a library like bcrypt in a real application
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

module.exports = { login };
