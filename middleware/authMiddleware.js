const jwt = require('jsonwebtoken');

const authenticate = async(req, resp, next) => {
  const authHeader = req.headers.authorization;

  try {

    if (!authHeader) {
      return resp.status(401).send({ message: "Authorization header is missing" });
    }

    if (!authHeader.startsWith('Bearer')) {
      return  resp.status(401).send({ message: "Invalid authorizaton format. Expected Bearer token" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return resp.status(401).send({ message: "Token is missing in header" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();

  } catch (err) {
    return resp.status(401).send({ message: err.message || "Inavlid or Expired token" });
  }


};

module.exports = authenticate;
