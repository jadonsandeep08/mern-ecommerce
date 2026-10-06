const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// =====================================
// Generate JWT
// =====================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

// =====================================
// Customer Registration
// =====================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters"
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // IMPORTANT:
    // Public registration can only create customers.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "customer"
    });

    const token =
      generateToken(user);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to register user"
    });
  }
};

// =====================================
// Customer Login
// =====================================

const customerLogin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }

    const user =
      await User.findOne({
        email:
          email.toLowerCase().trim()
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message:
          "Please use the admin login"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is disabled"
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    const token =
      generateToken(user);

    return res.status(200).json({
      success: true,
      message:
        "Customer login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(
      "Customer Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login"
    });
  }
};

// =====================================
// Admin Login
// =====================================

const adminLogin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }

    const user =
      await User.findOne({
        email:
          email.toLowerCase().trim()
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin credentials"
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin access required"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Admin account is disabled"
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin credentials"
      });
    }

    const token =
      generateToken(user);

    return res.status(200).json({
      success: true,
      message:
        "Admin login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(
      "Admin Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login"
    });
  }
};

// =====================================
// Current Logged-In User
// =====================================

const getMe = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(
      "Get User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get user"
    });
  }
};

module.exports = {
  register,
  customerLogin,
  adminLogin,
  getMe
};