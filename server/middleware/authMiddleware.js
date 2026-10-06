const jwt = require("jsonwebtoken");

// =====================================
// Authentication
// =====================================

const protect = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required"
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token"
    });
  }
};

// =====================================
// Admin Only
// =====================================

const adminOnly = (
  req,
  res,
  next
) => {
  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Admin access required"
    });
  }

  next();
};

// =====================================
// Customer Only
// =====================================

const customerOnly = (
  req,
  res,
  next
) => {
  if (
    !req.user ||
    req.user.role !== "customer"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Customer access required"
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
  customerOnly
};