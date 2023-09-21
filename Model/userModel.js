const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
    name:{type:"string"},
    email:{type:"string"},
    password:{type:"string"},
    notification:{type:"string",default:"false"}
})

let userModel = mongoose.model('user',user)

module.exports = userModel