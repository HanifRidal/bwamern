const { executeQuery } = require("../db");

async function getAll() {
  const query = "SELECT * FROM TujuanWisata";
  const result = await executeQuery(query, [], [], false);
  return result.recordset;
}

async function getAllWisata() {
  const query = "SELECT * FROM TujuanWisata";
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
  getAll,
  create,
  getAllWisata,
};