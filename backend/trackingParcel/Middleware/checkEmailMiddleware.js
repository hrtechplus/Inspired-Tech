// checkEmailMiddleware.js

const UserModel = require("../models/userSchema");

const checkEmailMiddleware = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(200).json({ message: "Email is already registered" });
    } else {
      next(); // Proceed to the next middleware/route handler
    }
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkEmailMiddleware;
