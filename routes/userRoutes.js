const express = require('express')
const userRouter = express.Router()

const userController = require('../controller/userController')
const multer = require('../middleware/multer')
const jwtAuthentication = require('../middleware/jwtAuthentication')

userRouter.post('/blogPost',jwtAuthentication,userController.blogPost)
userRouter.post('/getAllblogs',jwtAuthentication,userController.getBlogs)
userRouter.post('/getBlogs',jwtAuthentication,userController.getAllBlogs)
userRouter.post('/getDrafts',jwtAuthentication,userController.getDraftedBlogs)
userRouter.get('/getSingleBlog/:id',jwtAuthentication,userController.getsingleBlog)
userRouter.get('/userData',jwtAuthentication,userController.getUserData)
userRouter.delete('/delete/:id',jwtAuthentication,userController.deleteBlog)
userRouter.patch('/blogPost',jwtAuthentication,userController.updateType)
userRouter.put('/updateBlog',jwtAuthentication,userController.updateBlog)





module.exports  = userRouter