const { Router } = require('express');
const routes = Router();

const quackRoutes = require('./quack.routes');
const notesRoutes = require('./notes.routes');
const imageRoutes = require('./image.routes');
const authRoutes = require('./auth.routes');

routes.use("/quack", quackRoutes);
routes.use("/notes", notesRoutes);
routes.use("/image", imageRoutes);
routes.use("/auth", authRoutes);


module.exports = routes;