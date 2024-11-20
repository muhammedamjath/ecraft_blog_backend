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
        type: submitType === "draft" ? "draft" : "post", 
      });
  
      await createBlog.save();
      res.status(200).json({ message: "Blog created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while creating the blog" });
    }
  };