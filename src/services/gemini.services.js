require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const path = require('path');
const DiskStorage = require('../providers/disk.storage');
const fs = require('fs');

class GeminiService {
  async generate({ content, fileName }) {
    const diskStorage = new DiskStorage();

    const uploadsPath = path.join(__dirname, '../../tmp/uploads'); // Join path components

    try {
      let modelType = "gemini-pro"; // Default model type
      let image = null;

      if (fileName) {
        const filePath = path.join(uploadsPath, fileName); // Combine directory and filename
        const imageData = await fs.promises.readFile(filePath);

        image = {
          inlineData: {
            data: Buffer.from(imageData).toString("base64"),
            mimeType: "image/png", // Assuming PNG, adjust based on actual image type
          },
        };

        modelType = "gemini-pro-vision";
      }

      const model = genAI.getGenerativeModel({ model: modelType });

      const prompt = `Faça um curto resumo sobre o assunto que direi a seguir, limite a 1800 caracteres, enfatize questões importantes do assunto. Não envie o título novamente.\n\n${content}\n\n LIMITE A 1000 CARACTERES`;

      const result = await model.generateContent([prompt, image].filter(Boolean)); // Filter out undefined/null
      const text = result.response.text();
      console.log(text);

      if (fileName) {
        await diskStorage.deleteFile(fileName); // Deleting the file after successful upload
      }

      return text;
    } catch (error) {
      console.log("Error generating content:", error);
      throw error; // Re-throw for handling in main function
    }
  }
}

module.exports = new GeminiService();
