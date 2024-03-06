const pool = require("../db");
const jwt = require("jsonwebtoken");
const userDAO = require("../integration/userDAO");
const bcrypt = require("bcrypt");

/**
 * Handles user login, including authentication and token generation.
 * Logs the login attempt, including user details and IP address, for security auditing.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: req.t("authorization_validation.login.required_fields") });
  }

  if (username.length < 3) {
    return res.status(400).json({ success: false, message: req.t("authorization_validation.username_short") });
  }

  if (!isNaN(username.charAt(0))) {
    return res.status(400).json({ success: false, message: req.t("authorization_validation.username_numeric_start") });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: req.t("authorization_validation.password_short") });
  }

  const client = await pool.connect();

  try {
    
    await client.query('BEGIN');
    
    const user = await userDAO.findUserByUsername(username);

    if (!user) {
      await userDAO.logFailedAttempt(client, null, null, null, "User not found", userAgent, ipAddress);
      await client.query('ROLLBACK');
      return res.status(401).json({ success: false, message: req.t("authorization_validation.invalid_credentials") });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await userDAO.logFailedAttempt(client, null, null, username, "Entered wrong password", userAgent, ipAddress);
      await client.query('ROLLBACK');
      return res.status(401).json({ success: false, message: req.t("authorization_validation.invalid_credentials") });
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

res.json({ success: true, message: req.t("authorization_validation.login_successful"), user: payload, token: token });


    // Commit if all goes well
    await client.query('COMMIT');
  } catch (error) {
    // Rollback in case of any error
    await client.query('ROLLBACK');

    if (error.message === req.t("authorization_validation.username_numeric_start") || error.message === req.t("authorization_validation.username_short")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: req.t("authorization_validation.login_error") });
  } finally {
    // Release the client in the end
    client.release();
  }
};

/**
 * Handles new user registration, including input validation and user creation.
 * Logs the registration attempt, including user details and IP address, for security auditing.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const register = async (req, res) => {
  
  const { name, surname, pnr, password, email, username } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!username || username.length < 3) {
      return res.status(400).send({ success: false, message: req.t("authorization_validation.username_short") });
    }

    if (!password || password.length < 6) {
      return res.status(400).send({ success: false, message: req.t("authorization_validation.password_short") });
    }

    if (isNaN(pnr) || pnr.includes(".")) {
      return res.status(400).send({ success: false, message: req.t("authorization_validation.pnr_numeric") });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).send({ success: false, message: req.t("authorization_validation.email_invalid") });
    }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existingUser = await userDAO.findUserByUsernameOrEmail(username, email);

    if (existingUser) {
      return res.status(409).json({ success: false, message: req.t("authorization_validation.user_already_exists") });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const userCreationResult = await userDAO.createUser(client, {
      name,
      surname,
      pnr,
      email,
      password: hashedPassword,
      username,
    });

    if (userCreationResult.success) {
      await client.query('COMMIT');
      res.json({ success: true, message: req.t("authorization_validation.registration_successful") });
    } else {
      
      const logMessage = "Could not register user";
      await userDAO.logFailedAttempt(client, null, email, username, logMessage, userAgent, ipAddress);
      await client.query('ROLLBACK');
      res.status(500).json({ success: false, message: logMessage });
    }
  } catch (error) {
   
    if (client) {
      await client.query('ROLLBACK');
    }

    if (error.message === req.t("authorization_validation.username_short") || 
    error.message === req.t("authorization_validation.password_short")) {
      return res.status(400).json({ success: false, message: error.message });
    } else if (error.message === req.t("authorization_validation.pnr_numeric")) {
      return res.status(400).json({ success: false, message: error.message });
    } else if (error.message === req.t("authorization_validation.email_invalid")) {
      return res.status(400).json({ success: false, message: error.message });
    } else if (error.message === req.t("authorization_validation.user_already_exists")) {
      return res.status(409).json({ success: false, message: error.message });
    }
    else{
      console.error('Registration error:', error);
      await userDAO.logFailedAttempt(client, null, email, username, error.message, userAgent, ipAddress);
      res.status(500).json({ success: false, message: req.t("authorization_validation.registration_error") });
    }
  } finally {
    client.release();
  }
};

module.exports = { login, register };