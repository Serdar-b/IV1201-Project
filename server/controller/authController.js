const jwt = require('jsonwebtoken');
const userDAO = require('../integration/userDAO');

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userDAO.findUser(username, password);

  if (user) {
    const payload = {
      person_id: user.getPerson_id,
      name: user.getName,
      username: user.getUserName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET,  { expiresIn: '1 hour' } );

    res.json({ success: true, message: "Login successful", token: token, user: payload });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

module.exports = { login };


