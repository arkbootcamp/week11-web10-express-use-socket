require('dotenv').config()
const express = require('express')
const socket = require('socket.io')
const http = require("http")
const cors = require('cors')
const morgan = require('morgan')
const moment = require('moment')
moment.locale('id')
const app = express()
const httpServer = http.createServer(app)
const route = require('./src/routes/index')
const jwt = require('jsonwebtoken')
const modelMessage = require('./src/models/message')

// use middle
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res)=>{
  res.json({message: 'success'})
})
app.use('/v1', route)
app.use('*', (req, res, next) => {
  const error = new createError.NotFound()
  next(error)
  // res.status(404).json({
  //   message: 'url not found'
  // })
})



app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'internal server Error'
  })
})

// config socket
const io = socket(httpServer, {
  cors: {
    origin: '*'
  }
})

io.use((socket, next)=>{
  const token = socket.handshake.query.token

  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const error = new Error('token expired')
        error.status = 401
        return next(error)
      } else if (err.name === 'JsonWebTokenError') {
        const error = new Error('token invalid')
        error.status = 401
        return next(error)
      } else {
        const error = new Error('token not active')
        error.status = 401
        return next(error)
      }

    }
      socket.userId = decoded.id
      socket.join(decoded.id)
      next()
   
  });
})

// use socket
io.on('connection', (socket)=>{
  console.log('user id saya adalah ', socket.userId);
  // socket.on('sendMessage', ({idReceiver, message})=>{
  //   socket.broadcash.to('12345').emit('msgfrmbackend', { 
  //     idReceiver: idReceiver, 
  //     message: message,
  //     idSender: socket.userId})
  // })
  socket.on('sendMessage', ({ idReceiver, messageBody}, callback)=>{
    const dataMessage = {
      sender_id: socket.userId,
      receiver_id: idReceiver,
      message: messageBody,
      created_at: new Date()
    }
    callback({
      ...dataMessage,
      created_at: moment(dataMessage.created_at).format('LT')
    })
    // simpan ke db
    modelMessage.insertMessage(dataMessage)
      .then(() => {
        console.log('success');
        socket.broadcast.to(idReceiver).emit('msgFromBackend', {
          ...dataMessage,
          created_at: moment(dataMessage.created_at).format('LT')
        })
      })
  })

  socket.on('disconnect', ()=>{
    console.log('ada perangkat yang terputus ', socket.id);
  })
  
})


httpServer.listen(4000, ()=>{
  console.log('server is runnig port' + 4000);
})
// const app = express()
