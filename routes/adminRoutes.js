//<!--===============================================================================================-->
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
//<!--===============================================================================================-->
router.get('/stats', adminController.ensureAdmin, adminController.adminStats);
router.post('/create-window', adminController.ensureAdmin, adminController.createWindow);
router.post('/edit-window', adminController.ensureAdmin, adminController.editWindow);
router.post('/delete-window', adminController.ensureAdmin, adminController.deleteWindow);
router.get('/get-windows', adminController.ensureAdmin, adminController.getWindows);
router.get('/get-window-names', adminController.ensureAdmin, adminController.getWindowNames);
router.post('/create-process-type', adminController.ensureAdmin, adminController.createProcessType);
router.post('/edit-process-type', adminController.ensureAdmin, adminController.editProcessType);
router.post('/delete-process-type', adminController.ensureAdmin, adminController.deleteProcessType);
router.get('/get-process-types/:window', adminController.ensureAdmin, adminController.getProcessTypes);
router.get('/get-users', adminController.ensureAdmin, adminController.getUsers);
router.post('/edit-user', adminController.ensureAdmin, adminController.editUser);
router.post('/delete-user', adminController.ensureAdmin, adminController.deleteUser);
router.post('/create-user', adminController.ensureAdmin, adminController.createUser);
//<!--===============================================================================================-->
module.exports = router
//<!--===============================================================================================-->