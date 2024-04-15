import mongoose from "mongoose";


const userAttemptsSchema = mongoose.Schema({
    username:{
        type: String, 
        required: true, 
        unique: true 
    },
    email:{ 
        type: String, 
        required: true, 
        unique: true 
    },
    attempts:{
        type: Number, 
        required: true
    },
    token:{
        type: String
    }
})


const UserAttempts = mongoose.model('UserAttempts', userAttemptsSchema)
export {UserAttempts}