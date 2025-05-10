const jwt = require('jsonwebtoken');

const authenticate = (req, resp, next) => {
  const authHeader = req.headers.authorization;
  

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      next();
    } catch (err) {
      return resp.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return resp.status(401).json({ message: 'No token provided' });
  }
};

module.exports = authenticate;
