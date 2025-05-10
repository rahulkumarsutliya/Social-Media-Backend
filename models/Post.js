const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  caption: String,
  image: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  createdAt: {type: Date, default: Date.now()}
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
