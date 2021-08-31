const express = require('express')
const route = express.Router()
const userRouter = require('./users')
const messageRouter = require('./message')
route
  .use('/users', userRouter)
  .use('/messages', messageRouter)

module.exports = route