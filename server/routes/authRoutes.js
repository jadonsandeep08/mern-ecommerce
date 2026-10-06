const express = require("express");

const {
  register,
  customerLogin,
  adminLogin,
  getMe
} = require(
  "../controllers/authController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// Customer registration
router.post(
  "/register",
  register
);

// Customer login
router.post(
  "/login",
  customerLogin
);

// Separate admin login
router.post(
  "/admin/login",
  adminLogin
);

// Current user
router.get(
  "/me",
  protect,
  getMe
);

module.exports = router;