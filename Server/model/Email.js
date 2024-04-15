import mongoose from "mongoose";


const EmailSchema = mongoose.Schema({
    email:{
        type: String, 
        required: true, 
        unique: true
    }
})


const Email = mongoose.model('Email', EmailSchema)
export {Email}