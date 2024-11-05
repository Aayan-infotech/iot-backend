const express = require('express');
const router = express.Router();
const syncController = require('../controllers/dataSyncController');

// Route for syncing data
router.post('/sync', syncController.syncData);

module.exports = router;
