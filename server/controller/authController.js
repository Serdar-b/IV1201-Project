
const userModel = require('../model/userModel');

const login = (req, res) => {
  const { username, password } = req.body;
  const user = userModel.findUserByUsername(username);
  
  if (user && user.password === password) { 
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

module.exports = { login };
