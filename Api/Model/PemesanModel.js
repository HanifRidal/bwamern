const { executeQuery } = require("../db");

async function getAllPemesan() {
  const query = "SELECT * FROM Pemesan";
  const result = await executeQuery(query, [], [], false);
  return result.recordset;
}

async function create(id, name) {
  const query = "INSERT INTO Pemesan (id_pemesan, nama_pemesan) VALUES (@id, @name)";
  const values = [id, name];
  const paramNames = ["id", "name"];
  await executeQuery(query, values, paramNames, false);
}

module.exports = {
  getAllPemesan,
  create,
};