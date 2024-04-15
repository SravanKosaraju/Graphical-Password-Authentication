import mongoose from "mongoose";

const Contactschema = mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    email:{
        type: String, 
        required: true
    },
    message:{
        type: String, 
        required: true
    }
})


const Contact = mongoose.model('Message', Contactschema)
export {Contact}