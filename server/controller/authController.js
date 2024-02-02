const userModel = require("../model/userModel");

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findUserByUsername(username, password);

  if (user && user.password === password) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

module.exports = { login };
