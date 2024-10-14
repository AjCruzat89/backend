//<!--===============================================================================================-->
const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
//<!--===============================================================================================-->
router.get('/get-processes', queueController.getProcesses);
router.get('/get-process/:process_type', queueController.getProcess);
router.get('/get-last-number', queueController.getLastNumber);
router.post('/create-queue-number', queueController.createQueueNumber);
router.get('/get-pending', queueController.getPending);
router.get('/get-queues', queueController.getQueues);
//<!--===============================================================================================-->
module.exports = router
//<!--===============================================================================================-->