const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { verifyAccess } = require('../middlewares/auth')

router
  .post('/register', userController.register)
  .post('/login', userController.login)
  .get('/', verifyAccess, userController.getAllUser)

module.exports = router