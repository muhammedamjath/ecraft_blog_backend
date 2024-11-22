const { default: mongoose } = require("mongoose");
const registerCollection = require("../model/registerModel");
const blogCollection = require("../model/blogModel");

// blog post
exports.blogPost = async (req, res) => {
  console.log(req.body);

  const { title, category, tags, content, submitType } = req.body;

  const userId = req.user.id;

  try {
    const createBlog = new blogCollection({
      title,
      category,
      tags,
      content,
      userId,
      type: submitType === "draft" ? "draft" : "posted",
    });

    await createBlog.save();
    res.status(200).json({ message: "Blog created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the blog" });
  }
};

// Blogs that are posted
exports.getBlogs = (req, res) => {
  const query = { type: "posted" };
  getBlogsByQuery(req, res, query);
};

// Full blogs created by the user
exports.getAllBlogs = (req, res) => {
  const reqUserId = req.user.id;
  const query = { userId: reqUserId };
  getBlogsByQuery(req, res, query);
};

// get only drafted blogs
exports.getDraftedBlogs = async (req, res) => {  
  const reqUserId = req.user.id;
  const query = { userId: reqUserId, type: "draft" };
  getBlogsByQuery(req, res, query);
};

// get single blog
exports.getsingleBlog = async (req, res) => {  
  const blogId = req.params.id

  const blog = await blogCollection.findOne({ _id: blogId });
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(401).json({ message: "requst again" });
  }
};

// delete blog
exports.deleteBlog = async (req, res) => {
  
  const id = req.params.id;
  const reqUserId = req.user.id;
  const findBlog = await blogCollection.findOne({_id:id , userId:reqUserId})
  try {
    if (findBlog) {
      const deleteBlog = await blogCollection.findOneAndDelete({ _id: id });
      if (deleteBlog) {
        res.status(200).json("deleted");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).json();
  }
};

// get userData
exports.getUserData = async (req,res)=>{
  const reqUserId = req.user.id;
  const userData = await registerCollection.findOne({_id:reqUserId})
  if(userData){
    res.status(200).json(userData)
  }else{
  res.status(400).json({
    status: false,
        errorMessage: "Invalid user",
  })
  }
}

// update type of blog to posted 
exports.updateType = async (req,res)=>{  
  const id = req.body.id
  if(id){
    const updateBlogType = await blogCollection.findOneAndUpdate(
      {_id:id},
      {
        $set: { 
          type: "posted",
         },
      })

      if(updateBlogType){
        res.status(200).json({
          status: true,
          message: "type updated to posted",
        })
      }
  }
}

// update blog
exports.updateBlog = async (req, res) => {
  const { title, category, tags, content, submitType, id } = req.body;

  const userId = req.user.id;

  try {
    if (id) {
      const updatedBlog = await blogCollection.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId( id) }, 
        {
          $set: {
            title,
            category,
            tags,
            content,
            type: submitType === "draft" ? "draft" : "posted",
          },
        },
        { new: true } 
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found or unauthorized" });
      }

      return res.status(200).json({ message: "Blog updated successfully" });
    } 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred while processing the blog" });
  }
};












// reusable function for getting blogs with diffrent query
const getBlogsByQuery = async (req, res, query) => {
  try {
    const { searchIndex, pageNumber, pageSize } = req.body;
    const reqUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(reqUserId)) {
      return res.status(400).json({
        status: false,
        errorMessage: "Invalid user ID format in token",
      });
    }

    const user = await registerCollection.findOne({ _id: reqUserId });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, errorMessage: "Unauthorized access" });
    }

    if (searchIndex) {
      query.$or = [
        { title: { $regex: searchIndex, $options: "i" } },
        { category: { $regex: searchIndex, $options: "i" } },
        { tags: { $regex: searchIndex, $options: "i" } },
      ];
    }

    const page = parseInt(pageNumber, 10) || 1;
    const limit = parseInt(pageSize, 10) || 10;
    const skip = (page - 1) * limit;

    const blogs = await blogCollection.find(query).skip(skip).limit(limit);
    const totalBlogs = await blogCollection.countDocuments(query);

    res.status(200).json({
      status: true,
      blogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: page,
      totalBlogs,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res
      .status(500)
      .json({ status: false, errorMessage: "Internal server error" });
  }
};
