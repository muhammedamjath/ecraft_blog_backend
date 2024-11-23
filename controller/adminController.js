const registerCollection = require("../model/registerModel");
const blogCollection = require("../model/blogModel");

exports.getUsersList = async (req, res) => {
    
  try {
    const userData = await registerCollection.find({roll:'user'});
    const totalUsers = await registerCollection.countDocuments({roll:'user'});
    
    if (userData && totalUsers) {        
      res.status(200).json({userData:userData , totalUsers:totalUsers});
    } else {
      res.status(500).json({ message: "err while collecting user data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all posted blogs
exports.getAllPostedBlogs = async (req, res) => {
  try {
    const getPostedBlogs = await blogCollection.aggregate([
      { $match: { type: "posted" } },
      {
        $lookup: {
          from: "registers",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);

    const totalPostedBlogsCount = await blogCollection.countDocuments({
      type: "posted",
    });

    if (getPostedBlogs && totalPostedBlogsCount) {
        
      res
        .status(200)
        .json({ blogs: getPostedBlogs, total: totalPostedBlogsCount });
    } else {
      res.status(500).json({ message: "Error while collecting posted blogs" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all drafts
exports.getAlldrafts = async (req, res) => {
  try {
    const getPostedDrafts = await blogCollection.aggregate([
      { $match: { type: "draft" } },
      {
        $lookup: {
          from: "registers",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);

    const totalPostedDraftCount = await blogCollection.countDocuments({
      type: "draft",
    });

    if (getPostedDrafts && totalPostedDraftCount !== null) {
      res
        .status(200)
        .json({ drafts: getPostedDrafts, total: totalPostedDraftCount });
    } else {
      res.status(500).json({ message: "Error while collecting drafted blogs" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const getPosts = await blogCollection.aggregate([
      {
        $lookup: {
          from: "registers",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);

    const totalPostsCount = await blogCollection.countDocuments();

    if (getPosts && totalPostsCount !== null) {
      res.status(200).json({ posts: getPosts, total: totalPostsCount });
    } else {
      res.status(500).json({ message: "Error while collecting blogs" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// all documents count
exports.getAllCount = async (req, res) => {
    try {
        const counts = await Promise.all([
            blogCollection.countDocuments({ type: "draft" }), 
            blogCollection.countDocuments({ type: "posted" }), 
            blogCollection.countDocuments(), 
            registerCollection.countDocuments({roll : 'user'})
        ]);

        const response = {
            totalDraftBlogs: counts[0],
            totalPostedBlogs: counts[1],
            totalBlogs: counts[2],
            totalUsers: counts[3]
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error while calculating counts" });
    }
};
