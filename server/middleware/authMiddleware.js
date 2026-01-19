const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: Please log in.' });
};

const isFaculty = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'faculty') {
    return next();
  }
  res.status(403).json({ message: 'Access Denied: Faculty only.' });
};

module.exports = { isAuthenticated, isFaculty };