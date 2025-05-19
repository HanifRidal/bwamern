const WisataModel = require("../Model/WisataModel");

async function getAllWisata() {
  return await WisataModel.getAllWisata();
}

async function getLimitedWisataByTypes(types, limitPerType) {
  const allWisata = await WisataModel.getAllWisata();
  let result = [];
  types.forEach(type => {
    const filtered = allWisata.filter(item => item.type === type).slice(0, limitPerType);
    result = result.concat(filtered);
  });
  return result;
}

async function getTypeWisata() {
  return await WisataModel.getTypeWisata();
}

module.exports = {
    getAllWisata,
    getTypeWisata,
    getLimitedWisataByTypes,
};