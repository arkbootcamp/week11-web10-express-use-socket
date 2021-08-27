const express = require('express')
const socket = require('socket.io')
const http = require("http")
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const httpServer = http.createServer(app)

// use middle
app.use(cors())
app.use(morgan('dev'))

app.get('/', (req, res)=>{
  res.json({message: 'success'})
})

// config socket
const io = socket(httpServer, {
  cors: {
    origin: '*'
  }
})

// use socket
io.on('connection', (socket)=>{
  console.log('ada client yg terhubung', socket.id);
  socket.on('disconnect', ()=>{
    console.log('ada perangkat yang terputus ', socket.id);
  })
})


httpServer.listen(4000, ()=>{
  console.log('server is runnig port' + 4000);
})
// const app = express()
