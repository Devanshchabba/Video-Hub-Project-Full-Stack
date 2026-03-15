import DB_NAME from '../constants.js'
import mongoose from 'mongoose'

const dbConnection  = async () => {
    console.log("🔍 Full Mongo URI:", `${process.env.DB_URI}/${DB_NAME}`);
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
};
export default dbConnection;