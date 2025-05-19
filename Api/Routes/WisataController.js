const express = require("express");
const router = express.Router();
const WisataServices = require("../Services/WisataServices");

router.get("/Wisata", async (req, res) => {
  try {
    const data = await WisataServices.getAllWisata();
    res.status(200).json({
      status: 200,
      message: "Data retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve data",
      error: error.message,
    });
  }
});

router.get("/TypeWisata", async (req, res) => {
  try {
    const data = await WisataServices.getTypeWisata();
    res.status(200).json({
      status: 200,
      message: "Data retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve data",
      error: error.message,
    });
  }
});

module.exports = router;