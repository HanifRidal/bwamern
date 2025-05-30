const userModel = require("../Model/UserModel");
const bcrypt = require("bcrypt"); // For password hashing

async function getAllUsers() {
  return await userModel.getAll();
}

async function getUserById(id) {
  return await userModel.getById(id);
}

async function createUser(username, password, email) {
  // Check if username already exists
  const existingUser = await userModel.getByUsername(username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  return await userModel.create(username, hashedPassword, email);
}

async function updateUser(id, username, email) {
  // Check if user exists
  const user = await userModel.getById(id);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if username is already taken by another user
  if (username !== user.username) {
    const existingUser = await userModel.getByUsername(username);
    if (existingUser && existingUser.id !== id) {
      throw new Error("Username already taken");
    }
  }

  return await userModel.updateUser(id, username, email);
}

async function updatePassword(id, currentPassword, newPassword) {
  // Check if user exists
  const user = await userModel.getById(id);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return await userModel.updatePassword(id, hashedPassword);
}

async function deleteUser(id) {
  // Check if user exists
  const user = await userModel.getById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return await userModel.deleteUser(id);
}

async function validateUser(username, password) {
  // Get user by username
  const user = await userModel.getByUsername(username);
  if (!user) {
    return null;
  }
  
  // Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return null;
  }
  
  return user;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
  validateUser
};