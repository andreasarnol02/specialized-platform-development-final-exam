const jwt = require("jsonwebtoken");

/**
 * Protection middleware: verifies the JWT from the Authorization Bearer header.
 * The payload uses { sub, role }, still compatible with legacy tokens using { sub, type }.
 */
const protect = (req, res, next) => {
  let token;

  // Grab the token from the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token present
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak. Token tidak ditemukan.",
      data: null,
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = decoded.sub || decoded.id;
    const role = decoded.role || decoded.type;

    if (!id || !["student", "admin"].includes(role)) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid.",
        data: null,
      });
    }

    // Normalize req.user — always the shape { id, sub, role }.
    req.user = { id, sub: id, role };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid.",
      data: null,
    });
  }
};

/**
 * requireAdmin middleware: only the 'admin' role may continue.
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Hanya admin yang dapat mengakses",
      data: null,
    });
  }

  next();
};

module.exports = { protect, requireAdmin };
