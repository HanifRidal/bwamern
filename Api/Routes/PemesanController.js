const express = require("express");
const router = express.Router();
const pemesanService = require("../Services/PemesanServices");

// Get all pemesan
router.get("/", async (req, res) => {
  try {
    const data = await pemesanService.getAllPemesan();
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

router.get("/wisata", async (req, res) => {
  try {
    const data = await pemesanService.getAllWisata();
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

// Add a new pemesan
router.post("/", async (req, res) => {
  try {
    const { id, name } = req.body;
    await pemesanService.createPemesan(id, name);
    res.status(201).json({
      status: 201,
      message: "Pemesan created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to create pemesan",
      error: error.message,
    });
  }
});

module.exports = router;