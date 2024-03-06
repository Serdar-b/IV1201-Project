const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate token.
 * This function checks if the request has a valid JWT token in the Authorization header.
 * If the token is not present or invalid, it sends an unauthorized or forbidden response.
 * If the token is valid, it attaches the decoded user information to the request object and calls the next middleware.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Token is invalid or has expired" });
    } 
    req.user = user;
    next(); 
  });
};

module.exports = authenticateToken;
