const express = require("express");
const router = express.Router();
const { recommendSpots } = require("../Services/CbfService");

// POST endpoint to get recommendations
router.post("/recommendations", async (req, res) => {
  try {
    const userPreferences = req.body; // Example: { type: ["Beach", "Historical"] }
    const recommendations = await recommendSpots(userPreferences);
    res.status(200).json({
      status: 200,
      message: "Recommendations retrieved successfully",
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve recommendations",
      error: error.message
    });
  }
});

module.exports = router;