const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, likeOrUnlikePost, commentOnPost, getPostsByUser } = require('../controllers/postControllers');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');



router.post('/',authenticate,upload.single('image'), createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id/like',authenticate, likeOrUnlikePost);
router.post('/:id/comment', authenticate,commentOnPost);
router.get('/users/:id', getPostsByUser);

module.exports = router;
