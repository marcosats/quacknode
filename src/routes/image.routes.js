const { Router } = require('express');
const uploadConfig = require('../configs/upload');
const multer = require("multer");
const ImageController = require('../controllers/image.controller');
const upload = multer(uploadConfig.MULTER);

const imageRoutes = Router();

imageRoutes.post('/', upload.single("file"), ImageController.upload);
imageRoutes.post('/update/:id', upload.single("file"), ImageController.update);
imageRoutes.delete('/:id', ImageController.delete);

module.exports = imageRoutes;