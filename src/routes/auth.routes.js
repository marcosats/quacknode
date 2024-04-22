const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const userServices = require('../services/user.services');
const ensureAuthenticated = require('../middlewares/ensire.authenticated');

const authRoutes = Router();

authRoutes.post('/', authController.login);
authRoutes.post('/password', userServices.updatePasswordAndGenerateToken);
authRoutes.post('/login', userServices.login);
authRoutes.put('/', ensureAuthenticated, userServices.updateName);

module.exports = authRoutes;