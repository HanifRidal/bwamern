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

async function update(id, tujuanWisata, imageUrls) {
  // Begin transaction
  const connection = await executeQuery("BEGIN TRANSACTION", [], [], true);
  
  try {
    // First, update the ImageUrls table if we have imageId
    if (imageUrls && imageUrls.imageId) {
      const updateImageQuery = `
        UPDATE ImageUrls 
        SET Url_1 = @url1, Url_2 = @url2
        WHERE Id_Image = @imageId;
      `;
      
      await executeQuery(
        updateImageQuery,
        [imageUrls.url1, imageUrls.url2, imageUrls.imageId],
        ["url1", "url2", "imageId"],
        false,
        connection
      );
    }
    
    // Then, update the TujuanWisata table
    const updateTujuanQuery = `
      UPDATE TujuanWisata 
      SET NamaTempat = @nama, 
          Kota = @kota, 
          Keterangan = @keterangan, 
          type = @type, 
          ImgUrl = @imgUrl, 
          Popularity = @popularity
          ${imageUrls && imageUrls.imageId ? ', ImageID = @imageId' : ''}
      WHERE TujuanID = @id;
    `;
    
    const params = [
      tujuanWisata.nama,
      tujuanWisata.kota,
      tujuanWisata.keterangan || null,
      tujuanWisata.type,
      tujuanWisata.imgUrl,
      tujuanWisata.popularity || 0,
      id
    ];
    
    const paramNames = ["nama", "kota", "keterangan", "type", "imgUrl", "popularity", "id"];
    
    // Add imageId to params if we're updating it
    if (imageUrls && imageUrls.imageId) {
      params.push(imageUrls.imageId);
      paramNames.push("imageId");
    }
    
    await executeQuery(
      updateTujuanQuery,
      params,
      paramNames,
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

async function remove(id) {
  // Get the ImageID associated with this TujuanWisata
  const getTujuanQuery = "SELECT ImageID FROM TujuanWisata WHERE TujuanID = @id";
  const tujuanResult = await executeQuery(getTujuanQuery, [id], ["id"], false);
  const imageId = tujuanResult.recordset[0]?.ImageID;

  // Begin transaction
  const connection = await executeQuery("BEGIN TRANSACTION", [], [], true);
  
  try {
    // First, delete from TujuanWisata
    const deleteTujuanQuery = "DELETE FROM TujuanWisata WHERE TujuanID = @id";
    await executeQuery(deleteTujuanQuery, [id], ["id"], false, connection);
    
    // Then, delete from ImageUrls if there was an associated image
    if (imageId) {
      const deleteImageQuery = "DELETE FROM ImageUrls WHERE Id_Image = @imageId";
      await executeQuery(deleteImageQuery, [imageId], ["imageId"], false, connection);
    }
    
    // Commit transaction
    await executeQuery("COMMIT", [], [], false, connection);
    
    return { success: true };
  } catch (error) {
    // Rollback transaction in case of error
    await executeQuery("ROLLBACK", [], [], false, connection);
    throw error;
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};