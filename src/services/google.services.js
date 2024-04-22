const { google } = require('googleapis');
const apiKeys = require('../../mimicsGoogleDrive.json'); // Assuming separate file

class GoogleService {
  async deleteImageFromDrive(imageId) {
    try {
      const auth = new google.auth.JWT(
        apiKeys.client_email,
        null,
        apiKeys.private_key,
        ['https://www.googleapis.com/auth/drive']
      );
      const drive = google.drive({ version: 'v3', auth });
      await drive.files.delete({ fileId: imageId });
    } catch (error) {
      console.log("Error deleting image from Google Drive:", error);
      throw error; // Re-throw for handling in main function
    }
  }
}

module.exports = new GoogleService();
