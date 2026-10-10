const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Correct way to read header
  const authHeader = req.headers["authorization"] || req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Support both "Bearer <token>" and raw "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "process.env.JWT_SECRET");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid", error: error.message });
  }
};

module.exports = authMiddleware;
