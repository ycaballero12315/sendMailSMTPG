const mongoose = require("mongoose");
const validator = require('validator');

const emailSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true,
        validate: (valor)=>{
            return validator.isAlpha(valor);
        }
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        validate: (valor)=>{
            return validator.isEmail(valor)
        }
    },
    asunto:{
        type: String,
        required: true
    },
    text:{
        type:String,
    },
    enviado: {type: Boolean, default: false},
    identificador:{
        type: String,
        unique: true,
        required: true,
        default: ()=>{
            return 'email-' + Date.now().toString(36) + Math.random().toString(36).substring(2,5);
        }
    }
});
const dbEmail = mongoose.model('dbEmail', emailSchema);
module.exports = dbEmail;