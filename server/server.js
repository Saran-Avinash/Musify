const express = require('express')
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    serveClient: false,
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

//middleware
app.use(cors())
io.on('connection', (socket)=> {
    console.log(`A user connected with socket ${socket.id}`)

    socket.on('disconnect', ()=> {
        console.log('user disconnected')
    })
   
        io.emit('msg', 'hi ')
    
})


server.listen(8080, ()=> {
    console.log(`Server running on port 8080`)
})