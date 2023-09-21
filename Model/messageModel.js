const mongoose = require('mongoose')
const Schema = mongoose.Schema

const message = new Schema({
    message:{type:"string"},
    senderEmail:{type:"string"},
    receiverEmail:{type:"string"},
    date:{type:"string"}
})

let messageModel = mongoose.model('message',message)

module.exports = messageModel