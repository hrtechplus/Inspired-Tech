const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userSchema"); // Assuming the user model is exported from userSchema.js
const app = express();
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/parcel/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // only for the admin
    if (user.role == "admin") {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // If the credentials are correct, generate a JWT token
      const accessToken = jwt.sign(
        { username: user.username, role: user.role },
        "Hasindu",
        { expiresIn: "1h" }
      );

      // If the credentials are correct, redirect to the dashboard or send a success message

      res.status(200).json({ message: "Login successful", accessToken });
    } else {
      return res
        .status(401)
        .json({ error: "Your credentials are not allow here" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
