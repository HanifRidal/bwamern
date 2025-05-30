const { executeQuery } = require("../db");

async function getAll() {
  const query = "SELECT * FROM [user]";
  const result = await executeQuery(query, [], [], false);
  return result.recordset;
}

async function getById(id) {
  const query = "SELECT * FROM [user] WHERE id = @id";
  const values = [id];
  const paramNames = ["id"];
  const result = await executeQuery(query, values, paramNames, false);
  return result.recordset[0];
}

async function getByUsername(username) {
  const query = "SELECT * FROM [user] WHERE username = @username";
  const values = [username];
  const paramNames = ["username"];
  const result = await executeQuery(query, values, paramNames, false);
  return result.recordset[0];
}

async function create(username, password, email) {
  // Default role is "konsumen"
  const role_user = "konsumen";
  const query = "INSERT INTO [user] (username, password, email, role_user) VALUES (@username, @password, @email, @role_user)";
  const values = [username, password, email, role_user];
  const paramNames = ["username", "password", "email", "role_user"];
  await executeQuery(query, values, paramNames, false);
}

async function updateUser(id, username, email) {
  const query = "UPDATE [user] SET username = @username, email = @email WHERE id = @id";
  const values = [username, email, id];
  const paramNames = ["username", "email", "id"];
  await executeQuery(query, values, paramNames, false);
}

async function updatePassword(id, password) {
  const query = "UPDATE [user] SET password = @password WHERE id = @id";
  const values = [password, id];
  const paramNames = ["password", "id"];
  await executeQuery(query, values, paramNames, false);
}

async function deleteUser(id) {
  const query = "DELETE FROM [user] WHERE id = @id";
  const values = [id];
  const paramNames = ["id"];
  await executeQuery(query, values, paramNames, false);
}

module.exports = {
  getAll,
  getById,
  getByUsername,
  create,
  updateUser,
  updatePassword,
  deleteUser,
};