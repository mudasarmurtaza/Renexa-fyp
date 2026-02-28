const adminRoleMiddleware = (req, res, next) => {
  // Assuming user role is available in req.user after authMiddleware
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = adminRoleMiddleware;
