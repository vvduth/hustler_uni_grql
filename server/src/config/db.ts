import mongoose, { ConnectOptions } from "mongoose";

const URL = process.env.MONGO_URL as string; 
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(URL , {
            useUnifiedTopology: true, 
            useNewUrlParser: true,
            useCreateIndex: true
        } as  ConnectOptions)

        console.log(`Mongo Db connected: ${conn.connection.host}`)
    }
    catch(e) {
        console.log(e)
    }
}