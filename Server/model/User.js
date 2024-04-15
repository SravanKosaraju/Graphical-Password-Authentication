import mongoose, { mongo } from "mongoose";

const Userschema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type: String, 
        required: true, 
        unique: true 
    },
    password:{
        type: String, 
        required: true, 
        minlength: 8 
    },
    pattern:{ 
        type: [String], 
        required: true 
    },
    sequence:{ 
        type: Boolean, 
        required: true 
    },
    sets:{
        type: [[Object]], 
        required: true
    }
})


const User=mongoose.model('User',Userschema)
export { User } 
