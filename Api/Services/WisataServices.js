const mssql = require('mssql');
const { executeQuery } = require("../db");

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

const createDestination = async (destinationData, imageData) => {
  // Validate required fields
  if (!destinationData.nama || !destinationData.kota || !destinationData.type) {
    throw new Error("Required fields missing: nama, kota, and type are required");
  }

  const pool = await mssql.connect(require('../db').config);
  if (!pool) {
    throw new Error("Database connection failed");
  }
  
  try {
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();

    try {
      // First, insert into ImageUrls table if we have additional images
      let imageId = null;
      if (imageData.url1 || imageData.url2) {
        const imageResult = await transaction.request()
          .input('url1', mssql.NVarChar, imageData.url1 || null)
          .input('url2', mssql.NVarChar, imageData.url2 || null)
          .query(`
            INSERT INTO ImageUrls (Url_1, Url_2) 
            VALUES (@url1, @url2);
            SELECT SCOPE_IDENTITY() AS id;
          `);

         if (imageResult.recordset && imageResult.recordset.length > 0) {
            imageId = imageResult.recordset[0].id;
            console.log("Image ID captured:", imageId);
          } else {
            console.error("Failed to capture image ID from insert operation");
          }
      }

      console.log("Using imageId for TujuanWisata:", imageId);


      // Now insert into TujuanWisata table with the ImageID reference
      const destinationResult = await transaction.request()
        .input('nama', mssql.NVarChar, destinationData.nama)
        .input('kota', mssql.NVarChar, destinationData.kota)
        .input('keterangan', mssql.NVarChar, destinationData.keterangan || '')
        .input('imgUrl', mssql.NVarChar, destinationData.imgUrl)
        .input('type', mssql.NVarChar, destinationData.type)
        .input('popularity', mssql.Int, destinationData.popularity || 0)
        .input('imageId', mssql.Int, imageId)  // Add the imageId parameter
        .query(`
          INSERT INTO TujuanWisata 
          (NamaTempat, Kota, Keterangan, ImgUrl, type, Popularity, ImageID) 
          VALUES 
          (@nama, @kota, @keterangan, @imgUrl, @type, @popularity, @imageId);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      
      const destinationId = destinationResult.recordset[0].id;
      
      // Commit the transaction if everything was successful
      await transaction.commit();
      return destinationId;
      
    } catch (error) {
      // If there was an error, roll back the transaction
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    throw error;
  } finally {
    pool.close();
  }
};

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