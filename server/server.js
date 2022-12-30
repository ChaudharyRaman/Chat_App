require('dotenv').config();

const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/db');
const { chats } = require('./data/data');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path')

mongoose.set('strictQuery', false);

const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')

// console.log(process.env.PORT);
// console.log(process.env.MONGOURI);

const app = express();
connectDB();
app.use(express.json());




app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// ----------------------------DEPLOYMENT--------------------------------------

const __dirname1 = path.resolve();
// console.log(__dirname1, '../client/build');
if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname1, '../client/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1,'..', "client", "build", "index.html"))
    })

} else {

    app.get('/', (req, res) => {
        res.send('Api working')
    })
}

// ----------------------------DEPLOYMENT--------------------------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server working on port ${PORT}`);
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})
io.on('connection', (socket) => {
    // console.log('connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected")
    });

    socket.on('join chat', (room) => {
        // console.log('HII');
        socket.join(room);
        // console.log('user Joined Room  ' + room);
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) {
            console.log('Chat.users not found');
        }

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived)
        })

    })

})