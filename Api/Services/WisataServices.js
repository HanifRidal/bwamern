const tujuanWisataModel = require("../Model/WisataModel");

async function getAllDestinations() {
  return await tujuanWisataModel.getAll();
}

async function getDestinationById(id) {
  return await tujuanWisataModel.getById(id);
}

async function getTypeWisata() {
  return await tujuanWisataModel.getTypeWisata();
}

async function getLimitedWisataByTypes(types, limitPerType) {
  const allWisata = await tujuanWisataModel.getAll();
  let result = [];
  types.forEach(type => {
    const filtered = allWisata.filter(item => item.type === type).slice(0, limitPerType);
    result = result.concat(filtered);
  });
  return result;
}

async function createDestination(destinationData, imageData) {
  // Validate required fields
  if (!destinationData.id || !destinationData.nama || !destinationData.kota || !destinationData.type) {
    throw new Error("Required fields missing: id, nama, kota, and type are required");
  }
  
  // Prepare data for TujuanWisata
  const tujuanWisata = {
    id: destinationData.id,
    nama: destinationData.nama,
    kota: destinationData.kota,
    keterangan: destinationData.keterangan,
    type: destinationData.type,
    imgUrl: destinationData.imgUrl,
    popularity: destinationData.popularity || 0
  };
  
  // Prepare data for ImageUrls
  const imageUrls = {
    imageId: imageData.imageId,
    url1: imageData.url1,
    url2: imageData.url2
  };
  
  return await tujuanWisataModel.create(tujuanWisata, imageUrls);
}

async function updateDestination(id, destinationData, imageData) {
  // Check if destination exists
  const existing = await tujuanWisataModel.getById(id);
  if (!existing) {
    throw new Error("Destination not found");
  }
  
  // Prepare data for TujuanWisata
  const tujuanWisata = {
    nama: destinationData.nama,
    kota: destinationData.kota,
    keterangan: destinationData.keterangan,
    type: destinationData.type,
    imgUrl: destinationData.imgUrl,
    popularity: destinationData.popularity
  };
  
  // Prepare data for ImageUrls if provided
  const imageUrls = imageData ? {
    imageId: imageData.imageId,
    url1: imageData.url1,
    url2: imageData.url2
  } : null;
  
  return await tujuanWisataModel.update(id, tujuanWisata, imageUrls);
}

async function deleteDestination(id) {
  // Check if destination exists
  const existing = await tujuanWisataModel.getById(id);
  if (!existing) {
    throw new Error("Destination not found");
  }
  
  return await tujuanWisataModel.remove(id);
}

module.exports = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  getLimitedWisataByTypes,
  getTypeWisata
};