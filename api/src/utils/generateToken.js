const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ sub: id.toString(), role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

module.exports = generateToken;
