const { Router } = require('express');
const uploadConfig = require('../configs/upload');
const multer = require("multer");
const NotesController = require('../controllers/notes.controller');
const ensureAuthenticated = require('../middlewares/ensire.authenticated');
const upload = multer(uploadConfig.MULTER);

const notesRoutes = Router();

notesRoutes.get('/:order', ensureAuthenticated, NotesController.get);
notesRoutes.get('/:order/:search', ensureAuthenticated, NotesController.search);
notesRoutes.post('/update/:id', ensureAuthenticated, NotesController.update);
notesRoutes.put('/update/:id', ensureAuthenticated, NotesController.updateColor);
notesRoutes.put('/favorite/:id', ensureAuthenticated, NotesController.favorite);

module.exports = notesRoutes;