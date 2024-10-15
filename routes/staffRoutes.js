//<!--===============================================================================================-->
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
//<!--===============================================================================================-->
router.get('/current-window', staffController.ensureStaff, staffController.currentWindow);
router.get('/get-window-names', staffController.ensureStaff, staffController.getWindowNames);
router.post('/update-queue', staffController.ensureStaff, staffController.updateQueue);
router.post('/transfer-window', staffController.ensureStaff, staffController.transferWindow);
router.post('/finish-queue', staffController.ensureStaff, staffController.finishQueue);
router.get('/get-pending', staffController.ensureStaff, staffController.getPending);
//<!--===============================================================================================-->
module.exports = router
//<!--===============================================================================================-->