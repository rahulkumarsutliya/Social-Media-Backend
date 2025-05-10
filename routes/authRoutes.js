const express = require('express');
const router = express.Router();
const { register,login} = require('../controllers/authControllers');
const upload = require('../middleware/uploadMiddleware');



router.post('/register',upload.single('profilePic'),register);
router.post('/login', login);


module.exports = router;
