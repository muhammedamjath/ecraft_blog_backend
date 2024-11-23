const express =require('express')
const adminRoutert = express.Router()

const jwtAuthentication = require('../middleware/jwtAuthentication')
const adminController = require('../controller/adminController')

adminRoutert.get('/getUsers',jwtAuthentication,adminController.getUsersList)
adminRoutert.get('/getallblogs',jwtAuthentication,adminController.getAllPosts)
adminRoutert.get('/getpostedblogs',jwtAuthentication,adminController.getAllPostedBlogs)
adminRoutert.get('/getdraftedblogs',jwtAuthentication,adminController.getAlldrafts)
adminRoutert.get('/getallcount',jwtAuthentication,adminController.getAllCount)

module.exports = adminRoutert