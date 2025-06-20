const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalid or expired" });
  }
};

module.exports = { requireAuth };
