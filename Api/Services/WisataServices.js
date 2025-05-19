const WisataModel = require("../Model/WisataModel");

async function getAllWisata() {
  return await WisataModel.getAllWisata();
}
async function getTypeWisata() {
  return await WisataModel.getTypeWisata();
}

module.exports = {
  getAllWisata,
getTypeWisata,
};