const userDAO = require("../integration/userDAO");

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userDAO.findUser(username, password);

  if (user) {
    req.session.user = {
      person_id: user.getPerson_id,
      name: user.getName,
      username: user.getUserName,
    };

    console.log(`Session ID: ${req.sessionID}`);
    res.json({ success: true, message: "Login successful", user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

module.exports = { login };
