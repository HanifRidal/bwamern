const express = require("express");
const router = express.Router();
const userService = require("../Services/UserServices");
const { authenticateToken, requireRole } = require("../Middleware/AuthUser");
const jwt = require('jsonwebtoken'); // Add this line


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        message: "Username and password are required",
      });
    }
    
    // Validate user credentials
    const user = await userService.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid username or password",
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role_user },
      process.env.JWT_SECRET || 'qwee123dasp1319284OQIUEWO',
      { expiresIn: '24h' }
    );
    
    // Set token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,           // JavaScript cannot access it
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',       // Protection against CSRF
      maxAge: 24 * 60 * 60 * 1000 ,// 24 hours
    });
    
    res.status(200).json({
      status: 200,
      message: "Login successful",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_user
        // Note: No token in response body
      }
    });
    console.log("User logged in:", user.username);
    console.log("Token generated:", token); // Log the generated token for debugging
    console.log("Token set in cookie");
    console.log("Response sent to client");
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Login failed",
      error: error.message,
    });
  }
});

// Add this route to your UserController.js
router.post("/logout", async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('token');

    const token = req.cookies.token; // Get the token from cookies

    console.log("User logged out successfully");

    
    res.status(200).json({
      status: 200,
      message: "Logout successful",
      data: {
        message: "You have been logged out successfully",
        pesan: "token telah dihapus = " + token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Logout failed",
      error: error.message
    });
  }
});


router.get("/me", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const data = await userService.getUserById(id);
    
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    
    res.status(200).json({
      status: 200,
      message: "User retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
});

// Get all users
router.get("/list", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const data = await userService.getAllUsers();
    res.status(200).json({
      status: 200,
      message: "Users retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
});

// Get user by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await userService.getUserById(id);
    
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    
    res.status(200).json({
      status: 200,
      message: "User retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
});

// Create a new user
router.post("/register",  async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({
        status: 400,
        message: "Username, password, and email are required",
      });
    }
    
    await userService.createUser(username, password, email);
    
    res.status(201).json({
      status: 201,
      message: "User created successfully",
    });
  } catch (error) {
    if (error.message === "Username already exists") {
      return res.status(409).json({
        status: 409,
        message: "Username already exists",
      });
    }
    
    res.status(500).json({
      status: 500,
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// Update a user
router.put("/edit/", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id; // Get the user ID from the token
    const {username, email } = req.body;

    console.log("Token user ID:", req.user.id, "Type:", typeof req.user.id);
    console.log("Request body ID:", id, "Type:", typeof id);
    console.log("User role:", req.user.role);
    
     if (req.user.id != id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 403,
        message: "Access denied. You can only update your own profile."
      });
    }
    
    if (!username || !email) {
      return res.status(400).json({
        status: 400,
        message: "Username and email are required",
      });
    }
    
    await userService.updateUser(id, username, email);
    
    res.status(200).json({
      status: 200,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    
    if (error.message === "Username already taken") {
      return res.status(409).json({
        status: 409,
        message: "Username already taken by another user",
      });
    }
    
    res.status(500).json({
      status: 500,
      message: "Failed to update user",
      error: error.message,
    });
  }
});

// Update user's password
router.patch("/:id/password", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.id != id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 403,
        message: "Access denied. You can only update your own password."
      });
    }

    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 400,
        message: "Current password and new password are required",
      });
    }
    
    await userService.updatePassword(id, currentPassword, newPassword);
    
    res.status(200).json({
      status: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    
    if (error.message === "Current password is incorrect") {
      return res.status(401).json({
        status: 401,
        message: "Current password is incorrect",
      });
    }
    
    res.status(500).json({
      status: 500,
      message: "Failed to update password",
      error: error.message,
    });
  }
});

// Delete a user
router.delete("/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const id = req.params.id;
    
    await userService.deleteUser(id);
    
    res.status(200).json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    
    res.status(500).json({
      status: 500,
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

module.exports = router;