import mongoose, { ConnectOptions } from "mongoose";
import dotenv from 'dotenv'

dotenv.config() 


const URL_DEPLOY = process.env.MONGO_URI as string; 
const connectDB = async () => {
    console.log("url :" ,URL_DEPLOY)
    try {
        const conn = await mongoose.connect(URL_DEPLOY , {
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