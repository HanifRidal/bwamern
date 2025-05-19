const { executeQuery } = require("../db");

async function getAllDestinations() {
  const query = "SELECT * FROM TujuanWisata";
  const result = await executeQuery(query, [], [], false);
  return result.recordset;
}

module.exports = { getAllDestinations };