const express = require('express')
const socket = require('socket.io')
const http = require("http")
const cors = require('cors')
const morgan = require('morgan')
const moment = require('moment')
moment.locale('id')
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

io.use((socket, next)=>{
  const token = socket.handshake.query.token
  console.log('token adalah', token);
  // verify token -> username, userid
  const usermame = 'risano@gmail.com'
  socket.name = usermame
  console.log('id socket di auth '+socket.id);
  // save ke database mysql;
  // table user -> idSocket = socket.id
  next()
})

// use socket
io.on('connection', (socket)=>{
  console.log('ada client yg terhubung', socket.id);
  console.log('saya panggil ketika connect = ' + socket.name);

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

  socket.on('sendMessage', (data, callback) => {
    const resultData = data
    const timeNow= new Date()
    resultData.time = moment(timeNow).format('LT');
    // saya panggil controller dan model untuk simpan ke db
    
    // simpan ke databse
    callback(resultData)
    socket.broadcast.to(`group:${resultData.group}`).emit('sendMsgFromBackend', resultData)
  })
  
  socket.on('exampleCallback', (data1, myCallback)=>{
    console.log('data 1 = '+data1);
    // console.log('data 2 = ' + data2);
    myCallback('my name is risano')
  })
  
  
  socket.on('disconnect', ()=>{
    console.log('ada perangkat yang terputus ', socket.id);
    // query 
    io.emit('sendMsgFromBackend', { email: 'admin', message: `ada user yg keluar dari aplikasi` })
  })
})


httpServer.listen(4000, ()=>{
  console.log('server is runnig port' + 4000);
})
// const app = express()
