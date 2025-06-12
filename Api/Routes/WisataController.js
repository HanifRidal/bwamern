const express = require("express");
const router = express.Router();
const tujuanWisataService = require("../Services/WisataServices");
const { authenticateToken, requireRole } = require("../Middleware/AuthUser");
const multer = require("multer");

const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    console.log("Filename:", file.originalname);
    console.log("MIME Type:", file.mimetype);
    console.log("Extension match:", extname);
    console.log("MIME Type match:", mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

router.get("/TypeWisata", async (req, res) => {
  try {
    const data = await tujuanWisataService.getTypeWisata();
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

router.get("/Type", async (req, res) => {
  try {
    const types = ["Beach", "Historical"];
    const limitPerType = 6;
    const data = await tujuanWisataService.getLimitedWisataByTypes(types, limitPerType);
    res.json({ status: 200, data });
  } catch (error) {
    console.error(error); // <-- Add this
    res.status(500).json({ status: 500, message: error.message });
  }
});

// Get all destinations
router.get("/", authenticateToken, async (req, res) => {
  try {
    const data = await tujuanWisataService.getAllDestinations();
    res.status(200).json({
      status: 200,
      message: "Destinations retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve destinations",
      error: error.message,
    });
  }
});

// Get destination by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await tujuanWisataService.getDestinationById(id);
    
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: "Destination not found",
      });
    }
    
    res.status(200).json({
      status: 200,
      message: "Destination retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve destination",
      error: error.message,
    });
  }
});

// Create a new destination
router.post("/", authenticateToken, requireRole(["admin"]), upload.array("images", 3), async (req, res) => {
  try {
    const { nama, kota, keterangan, type, popularity } = req.body;
    
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);
    
    // Validate required fields
    if (!nama || !kota || !type) {
      return res.status(400).json({
        status: 400,
        message: "Required fields missing: nama, kota, and type are required"
      });
    }
    
    // Ensure we have at least one image
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({
        status: 400,
        message: "At least one image is required",
      });
    }
    
    // Get uploaded file paths
    const mainImageUrl = `/images/${req.files[0].filename}`;
    let url1 = null;
    let url2 = null;
    
    // If we have more images, assign them to url1 and url2
    if (req.files.length > 1) {
      url1 = `/images/${req.files[1].filename}`;
    }
    
    if (req.files.length > 2) {
      url2 = `/images/${req.files[2].filename}`;
    }
    
    // Create a unique ImageID for the ImageUrls table
    const imageId = Date.now();
    
    // Prepare data for service - Remove id as it should be auto-generated
    const destinationData = {
      nama: nama.trim(),
      kota: kota.trim(),
      keterangan: keterangan || "",
      type: type.trim(),
      imgUrl: mainImageUrl,
      popularity: parseInt(popularity) || 0,
    };
    
    const imageData = {
      imageId,
      url1,
      url2
    };
    
    // Call the service function with proper data
    await tujuanWisataService.createDestination(destinationData, imageData);
    
    res.status(201).json({
      status: 201,
      message: "Destination created successfully",
    });
  } catch (error) {
     console.error("Error in POST /wisata:", error);
    // If there's an error, delete any uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    
    res.status(500).json({
      status: 500,
      message: "Failed to create destination",
      error: error.message,
    });
  }
});

// Update a destination
router.put("/:id", authenticateToken, requireRole(["admin"]), upload.array("images", 3), async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      nama, 
      kota, 
      keterangan, 
      type, 
      popularity, 
      imageId, 
      updateImg1, 
      updateImg2, 
      updateImg3 
    } = req.body;
    
    // Get the existing destination to find current images
    const existingDestination = await tujuanWisataService.getDestinationById(id);
    
    if (!existingDestination) {
      return res.status(404).json({
        status: 404,
        message: "Destination not found",
      });
    }
    
    // Prepare data for update
    const destinationData = {
      nama,
      kota,
      keterangan,
      type,
      popularity: parseInt(popularity) || existingDestination.Popularity,
      imgUrl: existingDestination.ImgUrl 
    };
    
    // Handle image updates if new images are uploaded
    let imageData = {
      imageId: existingDestination.ImageID || imageId,
      url1: existingDestination.Url_1,
      url2: existingDestination.Url_2
    };
    
    // Use flags from frontend to know which images to update
    if (req.files && req.files.length > 0) {
      let fileIndex = 0;
      
      // Update main image if requested
      if (updateImg1 === 'true' && fileIndex < req.files.length) {
        destinationData.imgUrl = `/images/${req.files[fileIndex].filename}`;
        fileIndex++;
      }
      
      // Update url1 if requested
      if (updateImg2 === 'true' && fileIndex < req.files.length) {
        imageData.url1 = `/images/${req.files[fileIndex].filename}`;
        fileIndex++;
      }
      
      // Update url2 if requested
      if (updateImg3 === 'true' && fileIndex < req.files.length) {
        imageData.url2 = `/images/${req.files[fileIndex].filename}`;
      }
    }

    console.log("Update request details:");
    console.log("- Files:", req.files ? req.files.length : 0);
    console.log("- Update flags:", { updateImg1, updateImg2, updateImg3 });
    console.log("- destinationData:", destinationData);
    console.log("- imageData:", imageData);
    
    
    await tujuanWisataService.updateDestination(id, destinationData, imageData);
    
    res.status(200).json({
      status: 200,
      message: "Destination updated successfully",
    });
    } catch (error) {
      // If there's an error, delete any uploaded files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      
      res.status(500).json({
        status: 500,
        message: "Failed to update destination",
        error: error.message,
      });
    }
  });

// Delete a destination
router.delete("/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const id = req.params.id;
    
    // Get the existing destination to find images to delete
    const existingDestination = await tujuanWisataService.getDestinationById(id);
    
    if (!existingDestination) {
      return res.status(404).json({
        status: 404,
        message: "Destination not found",
      });
    }
    
    // Delete the destination from the database
    await tujuanWisataService.deleteDestination(id);
    
    // Delete image files from the server
    const imagesToDelete = [
      existingDestination.ImgUrl,
      existingDestination.Url_1,
      existingDestination.Url_2
    ].filter(img => img); // Filter out null/undefined values
    
    // Delete each image file
    imagesToDelete.forEach(img => {
      const filePath = path.join(__dirname, "../public", img);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    
    res.status(200).json({
      status: 200,
      message: "Destination deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to delete destination",
      error: error.message,
    });
  }
});

module.exports = router;