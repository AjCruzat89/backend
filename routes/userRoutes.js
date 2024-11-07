//<!--===============================================================================================-->
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//<!--===============================================================================================-->
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/admin-auth', userController.adminAuth);
router.post('/staff-auth', userController.staffAuth);
router.post('/logout', userController.logout);
router.post('/redirect', userController.redirect);
//<!--===============================================================================================-->
module.exports = router
//<!--===============================================================================================-->