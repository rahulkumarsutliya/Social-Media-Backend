const Post = require('../models/Post');
const jwt = require('jsonwebtoken');


// Create a new post (authenticated)
exports.createPost = async (req, resp) => {
    try {
        const { caption } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const userId = req.user.id;

        const post = new Post({
            caption,
            image,
            userId,
        });

        await post.save();
        resp.status(201).json({ message: 'Post created', post });
    } catch (err) {
        resp.status(500).json({ message: 'Failed to create post', error: err.message });
    }
};

// Get all posts

exports.getAllPosts = async (req, resp) => {
    try {
        const page = parseInt(req.query.page) || 1;     
        const limit = parseInt(req.query.limit) || 5;   
        const skip = (page - 1) * limit;
    
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username');
  
      resp.status(200).json({
        currentPage: page,
        totalPages,
        totalPosts,
        results: posts.length,
        posts
      });
    } catch (err) {
        resp.status(500).json({ message: 'Failed to fetch posts', error: err.message });
    }
};

// Get a single post

exports.getPostById = async (req, resp) => {
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'username profilePic');
        if (!post) return resp.status(404).json({ message: 'Post not found' });

        resp.status(200).json(post);
    } catch (err) {
        resp.status(500).json({ message: 'Error fetching post', error: err.message });
    }
};

// Like or Unlike a post
exports.likeOrUnlikePost = async (req, resp) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return resp.status(404).json({ message: 'Post not found' });

        const userId = req.user.id;
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        resp.status(200).json({ message: alreadyLiked ? 'Unliked' : 'Liked', post });
    } catch (err) {
        resp.status(500).json({ message: 'Failed to like/unlike post', error: err.message });
    }
};

// Comment on a post
exports.commentOnPost = async (req, resp) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return resp.status(404).json({ message: 'Post not found' });

        const comment = {
            userId: req.user.id,
            text,
        };

        post.comments.push(comment);
        await post.save();

        resp.status(201).json({ message: 'Comment added', post });
    } catch (err) {
        resp.status(500).json({ message: 'Failed to comment', error: err.message });
    }
};

// Get all posts of a particular user
exports.getPostsByUser = async (req, resp) => {
    try {
        const posts = await Post.find({ userId: req.params.id }).sort({ createdAt: -1 });
        resp.status(200).json(posts);
    } catch (err) {
        resp.status(500).json({ message: 'Error fetching user posts', error: err.message });
    }
}; 
