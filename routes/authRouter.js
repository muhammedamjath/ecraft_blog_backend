const express =require('express')
const authRouter = express.Router()

const multer = require('../middleware/multer')
const authController = require('../controller/authController')
const jwtAuthentication = require('../middleware/jwtAuthentication')


authRouter.post('/register',authController.regsiter)
authRouter.post('/login',authController.loginPost)
authRouter.put('/register',jwtAuthentication,multer.upload,authController.updateProfile)




module.exports = authRouter