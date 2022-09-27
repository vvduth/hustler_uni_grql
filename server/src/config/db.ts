import mongoose, { ConnectOptions } from "mongoose";

const URL = 'mongodb+srv://admin:tgp-k6Mzh9Xj2FM@cluster0.qj4e7sn.mongodb.net/?retryWrites=true&w=majority'; 
const connectDB = async () => {
    console.log("url :" ,URL)
    try {
        const conn = await mongoose.connect(URL , {
            useUnifiedTopology: true, 
            useNewUrlParser: true,
            
        } as  ConnectOptions)

        console.log(`Mongo Db connected: ${conn.connection.host}`)
    }
    catch(e) {
        console.log(e)
    }
}

export default connectDB 