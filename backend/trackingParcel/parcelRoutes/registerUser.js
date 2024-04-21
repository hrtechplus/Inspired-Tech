const UserModel = require("../models/userSchema"); // Update import to match the schema filename
const express = require("express");
const bcrypt = require("bcrypt");

const app = express.Router(); // Fixed router initialization

// User registration
app.post("/api/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if email is already registered
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user with hashed password
  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword, // Save hashed password to the database
    role,
  });

  // Save the user to the database
  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});
module.exports = app; // Exporting the router
