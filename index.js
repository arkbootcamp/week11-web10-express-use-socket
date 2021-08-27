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
  // socket.on('sendMsgToBack', (data)=>{
  //   console.log(data);
  //   // kirim ke diri sendiri
  //   // socket.emit('sendMsgToFront', 'hallo world')

  //   // io.emit
  //   // kirim kesemua user yg terkoneksi
  //   io.emit('sendMsgToFront', 'hallo world')

  //   // socket.broadcas.emit
  //   // kirim kesemua user yg terkoneksi kecuali user yg itu sendiri
  //   socket.broadcast.emit('sendMsgToFront', 'hallo world')


  //   // socket.on -> listen /mendengar event
  // })

  socket.on('initialGroup', ({group, email})=>{
    console.log('ada user yg join group '+ group);
    socket.join(`group:${group}`)
    socket.broadcast.to(`group:${group}`).emit('sendMsgFromBackend', { email: 'admin', message: `user ${email} join group`, group: group} )
  })

  socket.on('sendMessage', (data) => {
    console.log(data);
    // saya panggil controller dan model untuk simpan ke db
    
    io.to(`group:${data.group}`).emit('sendMsgFromBackend', data)

  })
  
  
  
  
  socket.on('disconnect', ()=>{
    console.log('ada perangkat yang terputus ', socket.id);
    io.emit('sendMsgFromBackend', { email: 'admin', message: `ada user yg keluar dari aplikasi` })
  })
})


httpServer.listen(4000, ()=>{
  console.log('server is runnig port' + 4000);
})
// const app = express()
