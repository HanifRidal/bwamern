const { executeQuery } = require("../db");

async function getAll() {
  const query = `
    SELECT t.*, i.Id_Image, i.Url_1, i.Url_2 
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

async function getById(id) {
  const query = `
    SELECT t.*, i.Id_Image, i.Url_1, i.Url_2 
    FROM TujuanWisata t
    LEFT JOIN ImageUrls i ON t.ImageID = i.Id_Image
    WHERE t.TujuanID = @id
  `;
  const values = [id];
  const paramNames = ["id"];
  const result = await executeQuery(query, values, paramNames, false);
  return result.recordset[0];
}

async function create(tujuanWisata, imageUrls) {
  // Begin transaction
  const connection = await executeQuery("BEGIN TRANSACTION", [], [], true);
  
  try {
    // First, insert into ImageUrls table
    const insertImageQuery = `
      INSERT INTO ImageUrls (Id_Image, Url_1, Url_2)
      VALUES (@imageId, @url1, @url2);
    `;
    
    await executeQuery(
      insertImageQuery, 
      [imageUrls.imageId, imageUrls.url1, imageUrls.url2],
      ["imageId", "url1", "url2"],
      false,
      connection
    );
    
    // Then, insert into TujuanWisata table
    const insertTujuanQuery = `
      INSERT INTO TujuanWisata (TujuanID, NamaTempat, Kota, Keterangan, type, ImgUrl, Popularity, ImageID)
      VALUES (@id, @nama, @kota, @keterangan, @type, @imgUrl, @popularity, @imageId);
    `;
    
    await executeQuery(
      insertTujuanQuery,
      [
        tujuanWisata.id,
        tujuanWisata.nama,
        tujuanWisata.kota,
        tujuanWisata.keterangan || null,
        tujuanWisata.type,
        tujuanWisata.imgUrl,
        tujuanWisata.popularity || 0,
        imageUrls.imageId  // Reference to the ImageID we just inserted
      ],
      ["id", "nama", "kota", "keterangan", "type", "imgUrl", "popularity", "imageId"],
      false,
      connection
    );
    
    // Commit transaction
    await executeQuery("COMMIT", [], [], false, connection);
    
    return { success: true };
  } catch (error) {
    // Rollback transaction in case of error
    await executeQuery("ROLLBACK", [], [], false, connection);
    throw error;
  }
}

// In your WisataModel.js, update these functions:

async function update(id, tujuanWisata, imageUrls) {
  // Create a pool for our transaction
  const sql = require('mssql');
  const pool = await sql.connect(require('../db').config);
  
  // Start a transaction properly
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  
  try {
    // First, update the ImageUrls table if we have imageId
    if (imageUrls && imageUrls.imageId) {
      const updateImageRequest = transaction.request();
      updateImageRequest.input('url1', sql.NVarChar, imageUrls.url1);
      updateImageRequest.input('url2', sql.NVarChar, imageUrls.url2);
      updateImageRequest.input('imageId', sql.Int, imageUrls.imageId);
      
      await updateImageRequest.query(`
        UPDATE ImageUrls 
        SET Url_1 = @url1, Url_2 = @url2
        WHERE Id_Image = @imageId;
      `);
    }
    
    // Then, update the TujuanWisata table
    const updateTujuanRequest = transaction.request();
    updateTujuanRequest.input('id', sql.Int, id);
    updateTujuanRequest.input('nama', sql.NVarChar, tujuanWisata.nama);
    updateTujuanRequest.input('kota', sql.NVarChar, tujuanWisata.kota);
    updateTujuanRequest.input('keterangan', sql.NVarChar, tujuanWisata.keterangan || null);
    updateTujuanRequest.input('type', sql.NVarChar, tujuanWisata.type);
    updateTujuanRequest.input('imgUrl', sql.NVarChar, tujuanWisata.imgUrl);
    updateTujuanRequest.input('popularity', sql.Int, tujuanWisata.popularity || 0);
    
    // Only include ImageID in update if it exists
    let updateQuery = `
      UPDATE TujuanWisata 
      SET NamaTempat = @nama, 
          Kota = @kota, 
          Keterangan = @keterangan, 
          type = @type, 
          ImgUrl = @imgUrl, 
          Popularity = @popularity
    `;
    
    if (imageUrls && imageUrls.imageId) {
      updateQuery += `, ImageID = @imageId`;
      updateTujuanRequest.input('imageId', sql.Int, imageUrls.imageId);
    }
    
    updateQuery += ` WHERE TujuanID = @id`;
    
    await updateTujuanRequest.query(updateQuery);
    
    // Commit the transaction
    await transaction.commit();
    
    return { success: true };
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    throw error;
  } finally {
    pool.close();
  }
}

async function remove(id) {
  // Create a pool for our transaction
  const sql = require('mssql');
  const pool = await sql.connect(require('../db').config);
  
  // Get the ImageID associated with this TujuanWisata
  const getTujuanRequest = pool.request();
  getTujuanRequest.input('id', sql.Int, id);
  const tujuanResult = await getTujuanRequest.query("SELECT ImageID FROM TujuanWisata WHERE TujuanID = @id");
  const imageId = tujuanResult.recordset[0]?.ImageID;
  
  // Start a transaction properly
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  
  try {
    // First, delete from TujuanWisata
    const deleteTujuanRequest = transaction.request();
    deleteTujuanRequest.input('id', sql.Int, id);
    await deleteTujuanRequest.query("DELETE FROM TujuanWisata WHERE TujuanID = @id");
    
    // Then, delete from ImageUrls if there was an associated image
    if (imageId) {
      const deleteImageRequest = transaction.request();
      deleteImageRequest.input('imageId', sql.Int, imageId);
      await deleteImageRequest.query("DELETE FROM ImageUrls WHERE Id_Image = @imageId");
    }
    
    // Commit transaction
    await transaction.commit();
    
    return { success: true };
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    throw error;
  } finally {
    pool.close();
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getTypeWisata
};