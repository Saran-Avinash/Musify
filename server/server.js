const express = require('express')
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    serveClient: false,
    cors: {
        origin: 'https://musify-client-mu.vercel.app',
        methods: ['GET', 'POST']
    }
})

let info = {}
 
//middleware
app.use(cors())
io.on('connection', (socket)=> {
    console.log(`A user connected with socket ${socket.id}`)

    socket.on('disconnect', ()=> {
        console.log('user disconnected')
    })

    socket.on('makeRoom', (data)=> {
        console.log(`${data.user} is a host: ${data.host} and with the id of ${socket.id} and the join room is ${data.room }`)
        info[data.user] = {
            "host" : data.host, 
        }
        room = data.room
        socket.join(data.room)
        socket.to(data.room).emit('user-joined', `${data.user} joined the room.`);
        console.log(info)
    })

    socket.on('joinRoom', (data) => {
        // Ensure `data.room` and `data.user` are defined
        // console.log(data)
        if (data?.room && data?.user) {
            socket.join(data.room);
            // Notify others in the room about the new user
        } else {
            console.error("Missing 'room' or 'user' in 'join-room' event data.");
        }
    });

    socket.on('send-message', ({ room, message, user }) => {
        // console.log(room, message, user)
        socket.to(room).emit('receive-message', {msg : message, userName : user});
    });

    socket.on('setVideoId', ({video, title, room, user})=> {
        socket.to(room).emit('receive-message', { msg: `${title} is playing`, userName: user})
        socket.to(room).emit('videoId-fromHost', video)
    })

    socket.on('playerStarted-host', ({user, room})=> {
        socket.to(room).emit('receive-message', {msg: `started playing`, userName : user})
        socket.to(room).emit('playVideo')
    })

    socket.on('playerPaused-host', ({user, room}) => {
        socket.to(room).emit('receive-message', {msg: 'paused playing', userName: user})
        socket.to(room).emit('pauseVideo')
    })
   
    socket.on('seekTime-host', ({time, user, room})=> {
        // console.log(time)
        socket.to(room).emit('receive-message', {msg: `seeked time to ${time}`, userName:user})
        socket.to(room).emit('seekTo', (time))
    })
        
    
})

const port = 8080 || process.env.PORT
server.listen(port, ()=> {
    console.log(`Server running on port 8080`)
})