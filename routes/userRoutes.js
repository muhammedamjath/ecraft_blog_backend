const express = require('express')
const userRouter = express.Router()

const userController = require('../controller/userController')
const multer = require('../middleware/multer')
const jwtAuthentication = require('../middleware/jwtAuthentication')

userRouter.post('/blogPost',jwtAuthentication,userController.blogPost)



module.exports  = userRouter