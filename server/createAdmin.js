const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

dotenv.config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB Connected");

    const email =
      process.env.ADMIN_EMAIL;

    const password =
      process.env.ADMIN_PASSWORD;

    const name =
      process.env.ADMIN_NAME ||
      "Administrator";

    if (!email || !password) {
      console.log(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );

      process.exit(1);
    }

    const existingUser =
      await User.findOne({
        email: email.toLowerCase().trim()
      });

    if (existingUser) {
      console.log(
        "A user with this email already exists."
      );

      process.exit(1);
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    const admin =
      await User.create({
        name,
        email:
          email.toLowerCase().trim(),
        password: hashedPassword,
        role: "admin"
      });

    console.log(
      "Admin created successfully"
    );

    console.log(
      `Admin email: ${admin.email}`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Create Admin Error:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();