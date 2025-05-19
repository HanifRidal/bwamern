const { executeQuery } = require("../db");
const { get } = require("../Routes/PemesanController");

async function getAllWisata() {
  const query = `
    SELECT 
      t.*, 
      i.Url_1, 
      i.Url_2
    FROM TujuanWisata t
    LEFT JOIN ImageUrls i ON t.ImageID = i.Id_Image
  `;
  const result = await executeQuery(query, [], [], false);
  return result.recordset;
}

async function getTypeWisata() {
  const query = "SELECT DISTINCT type FROM TujuanWisata";
  const result = await executeQuery(query, [], [], false);
  return result.recordset;
}

module.exports = {
  getAllWisata,
  getTypeWisata,
};