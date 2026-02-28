// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/jwtConfig");

const authMiddleware = (req, res, next) => {
 const authHeader = req.headers["authorization"];
if (!authHeader) return res.status(401).json({ authenticated: false });
const token = authHeader.split(" ")[1];
if (!token) return res.status(401).json({ authenticated: false });
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
} catch {
  return res.status(401).json({ authenticated: false });
}

};

module.exports = authMiddleware;
