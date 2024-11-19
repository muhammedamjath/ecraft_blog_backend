const express = require('express')
const clientRouter = express.Router()

const userController = require('../controller/userController')
const multer = require('../middleware/multer')
const jwtAuthentication = require('../middleware/jwtAuthentication')




module.exports  = clientRouter