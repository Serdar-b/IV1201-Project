const userDAO = require("../integration/userDAO");

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userDAO.findUser(username, password);

  if (user) {
    const userInfo = {
      person_id: user.getPerson_id,
      name: user.getName,
      username: user.getUserName,
    };

    res.json({ success: true, message: "Login successful", user: userInfo });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

module.exports = { login };
