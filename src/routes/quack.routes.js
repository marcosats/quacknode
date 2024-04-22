const { Router } = require('express');
const uploadConfig = require('../configs/upload');
const multer = require("multer");
const upload = multer(uploadConfig.MULTER);
const QuackController = require('../controllers/quack.controller');
const ensureAuthenticated = require('../middlewares/ensire.authenticated');

const quackRoutes = Router();

const quackController = new QuackController();

quackRoutes.post('/', ensureAuthenticated, quackController.index);
quackRoutes.delete('/:notionId',ensureAuthenticated, quackController.deletePost);
quackRoutes.post('/audio', ensureAuthenticated, upload.single("file"), quackController.audio);

module.exports = quackRoutes;