const mongoose = require("mongoose");

const blogScema = new mongoose.Schema({
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
  content:{
    type:String
  },
  type: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const blogPost = new mongoose.model("blogs", blogScema);
module.exports = blogPost;
