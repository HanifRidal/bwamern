const pemesanModel = require("../Model/PemesanModel");

async function getAllPemesan() {
  return await pemesanModel.getAll();
}

async function createPemesan(id, name) {
  return await pemesanModel.create(id, name);
}

async function getAllWisata() {
  return await pemesanModel.getAllWisata();
}

module.exports = {
  getAllPemesan,
  createPemesan,
  getAllWisata,
};