const express =require('express')
const authRouter = express.Router()

const authController = require('../controller/authController')

authRouter.post('/register',authController.regsiter)
authRouter.post('/login',authController.loginPost)




module.exports = authRouter