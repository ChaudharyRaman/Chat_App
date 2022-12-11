require('dotenv').config();

const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/db');
const { chats } = require('./data/data');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

mongoose.set('strictQuery',false);

const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')

// console.log(process.env.PORT);
// console.log(process.env.MONGOURI);

const app = express();
connectDB();
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Api working')
})

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server working on port ${PORT}`);
})