const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('New Connection connected')
    socket.emit('message',generateMessage('Welcome!'))
    socket.broadcast.emit('message',generateMessage('A new user has joined'))

    socket.on('sendmessage',(msg,callback)=>{
        const filter=new Filter()
        if(filter.isProfane(msg))
        {
            return callback('Bad Words not allowed')
        }
        io.emit('message',generateMessage(msg))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        const locationMsg="https://www.google.com/maps?q="+coords.lat+","+coords.long
        io.emit('locationmessage',generateLocationMessage(locationMsg))
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has left'))
    })
})

server.listen(port,()=>{
    console.log('The server is running')
})