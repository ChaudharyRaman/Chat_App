const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGOURI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            // useFindAndModify:true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.log(error.message);
        process.exit();
    }
}

module.exports= connectDB;