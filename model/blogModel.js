const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  tags: {
    type: [String],
  },
  content: {
    type: String,
  },
  type: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  likedBy: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const blogPost = new mongoose.model("blogs", blogSchema);
module.exports = blogPost;
