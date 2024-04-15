import mongoose from "mongoose";
// import dotenv from 'dotenv'
// dotenv.config()

mongoose.set('strictQuery', true)
const connecttomongo=async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Mongo")
    } catch (error) {
        console.log(error)
    }
}

export {connecttomongo}