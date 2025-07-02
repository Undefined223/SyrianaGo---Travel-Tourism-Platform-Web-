const jwt = require("jsonwebtoken");

// Generate access token (short-lived)
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }  // Access tokens are short-lived
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};


module.exports = { generateAccessToken, generateRefreshToken };
