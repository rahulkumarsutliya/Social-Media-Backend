const express = require('express');
const router = express.Router();
const toggleFollow = require('../controllers/userControllers');
const authenticate = require('../middleware/authMiddleware');

router.put('/follow/:id',authenticate,toggleFollow);

module.exports = router;