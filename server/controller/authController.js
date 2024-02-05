const userModel = require("../integration/userRepository");

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findUser(username, password);

  if (user) {
    const userInfo = {
      person_id: user.person_id,
      name: user.name,
      username: user.username,
    };

    res.json({ success: true, message: "Login successful", user: userInfo });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

module.exports = { login };
