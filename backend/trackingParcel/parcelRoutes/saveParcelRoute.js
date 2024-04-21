const express = require("express");
const router = express.Router();
const ParcelModel = require("../models/parcelSchema"); // Update import to match the new schema filename
const UserModel = require("../models/userSchema"); // Import User model

// GET route to retrieve a specific parcel by tracking number
router.get("/parcels/:trackingNumber", async (req, res) => {
  try {
    const trackingNumber = req.params.trackingNumber;

    // Find the parcel with the given tracking number
    const parcel = await ParcelModel.findOne({ trackingNumber });

    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    // Retrieve user details using user object ID
    const user = await UserModel.findById(parcel.user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user details to the parcel object
    parcel.user = user;
    console.log("Parcel:", parcel.user.address);
    const responseFinalData = { user, parcel };
    res.status(200).json(responseFinalData);
  } catch (error) {
    console.error("Error retrieving parcel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
