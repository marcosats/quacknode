const { google } = require('googleapis');
const DiskStorage = require('../providers/disk.storage');
const apiKeys = require('../../mimicsGoogleDrive.json');
const fs = require('fs');
const path = require('path');
const knex = require('../database');

class ImageController {
  async upload(req, res) {
    try {
      const imageFile = req.file; // Assuming the image is passed as req.file
      const diskStorage = new DiskStorage();

      // Save the image file to disk
      const filename = await diskStorage.saveFile(imageFile.filename);

      // Google Drive API authentication
      const auth = new google.auth.JWT(
        apiKeys.client_email,
        null,
        apiKeys.private_key,
        ['https://www.googleapis.com/auth/drive']
      );
      await auth.authorize();

      // Google Drive service
      const drive = google.drive({ version: 'v3', auth });

      // File metadata for Google Drive
      const fileMetadata = {
        name: filename,
        parents: [process.env.GOOGLE_API_FOLDER_ID], // Assuming GOOGLE_API_FOLDER_ID is defined in your environment
      };

      // File upload
      const media = {
        mimeType: imageFile.mimetype, // Assuming mimetype is accessible from req.file
        body: fs.createReadStream(path.join(__dirname, `../../tmp/uploads/${filename}`)),
      };

      // Upload file to Google Drive
      const uploadedFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });

      // Delete the temporary file from local storage
      //await diskStorage.deleteFile(filename); // Deleting the file after successful upload
      // Send response with the Google Drive URL of the uploaded image
      res.json({
        message: 'Image uploaded successfully',
        file: filename,
        image_url: `https://drive.google.com/uc?id=${uploadedFile.data.id}`,
        file_id: uploadedFile.data.id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const fileId = req.params.id; // Assuming fileId is passed as a parameter
      const imageExistsInNote = await knex('notes').where('id_image', fileId);
      if (imageExistsInNote) {
        await knex('notes')
          .update({ id_image: null, image_url: null })
          .where('id_image', fileId);
      }
      const auth = new google.auth.JWT(
        apiKeys.client_email,
        null,
        apiKeys.private_key,
        ['https://www.googleapis.com/auth/drive']
      );
      await auth.authorize();

      const drive = google.drive({ version: 'v3', auth });

      // Make API request to delete the file
      await drive.files.delete({ fileId: fileId });

      res.json({ message: 'Image deleted successfully from Google Drive' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  async update(req, res) {
    try {
      const imageFile = req.file; // Assuming the image is passed as req.file
      const { id } = req.params;
      const diskStorage = new DiskStorage();

      // Save the image file to disk
      const filename = await diskStorage.saveFile(imageFile.filename);

      // Google Drive API authentication
      const auth = new google.auth.JWT(
        apiKeys.client_email,
        null,
        apiKeys.private_key,
        ['https://www.googleapis.com/auth/drive']
      );
      await auth.authorize();

      // Google Drive service
      const drive = google.drive({ version: 'v3', auth });

      // File metadata for Google Drive
      const fileMetadata = {
        name: filename,
        parents: [process.env.GOOGLE_API_FOLDER_ID], // Assuming GOOGLE_API_FOLDER_ID is defined in your environment
      };

      // File upload
      const media = {
        mimeType: imageFile.mimetype, // Assuming mimetype is accessible from req.file
        body: fs.createReadStream(path.join(__dirname, `../../tmp/uploads/${filename}`)),
      };

      // Upload file to Google Drive
      const uploadedFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });

      // Delete the temporary file from local storage
      await diskStorage.deleteFile(filename); // Deleting the file after successful upload
      const image_url = `https://drive.google.com/uc?id=${uploadedFile.data.id}`
      await knex('notes')
        .update({ id_image: uploadedFile.data.id, image_url })
        .where({ id });

      // Send response with the Google Drive URL of the uploaded image
      res.json({
        message: 'Image uploaded successfully',
        file: filename,
        image_url,
        file_id: uploadedFile.data.id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new ImageController();
