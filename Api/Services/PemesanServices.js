const pemesanModel = require("../Model/PemesanModel");

async function getAllPemesan() {
  return await pemesanModel.getAll();
}

async function createPemesan(id, name) {
  return await pemesanModel.create(id, name);
}


module.exports = {
  getAllPemesan,
  createPemesan,
};