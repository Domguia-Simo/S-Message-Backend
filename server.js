const express = require('express')
const mongoose = require('mongoose')
const socket = require('socket.io')
const cors = require('cors')
const app = express()

app.use(cors())
const userModel = require('./Model/userModel')
const messageModel = require('./Model/messageModel')

const port = 5000

mongoose.connect('mongodb://127.0.0.1:27017/S-Message')
let db = mongoose.connection 
db.on('error',(error)=>{
    console.log("Connection Error with the DB",error)
})
db.once('open',()=>{
    console.log("Connecte with the db")
})

// let newUser = new userModel({
//     name:"Stella",
//     email:"stella@gmail.com",
//     password:"stella12345"
// })
// newUser.save()

//Getting a particular User
app.get('/getUser/:email',(req ,res)=>{
    let email = req.params.email
    userModel.find({email:email})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => console.log(err))
})

//Getting old messages with a particular user
app.get('/getOldMessages/:sender/:receiver',(req ,res)=>{
    let sender = req.params.sender
    let receiver = req.params.receiver
        // console.log(sender,receiver)
    messageModel.find({$or:[{senderEmail:sender,receiverEmail:receiver},{senderEmail:receiver,receiverEmail:sender}]})
    .then(result =>{
        // console.log(result)

        res.status(200).json(result)
    })
    .catch(err => console.log(err))
})

//Getting All Users
app.get('/getAllUsers',(req ,res)=>{
    userModel.find()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => console.log(err))
})


app.get('/',(req ,res)=>{
    console.log("S Message Backend")
})

app.get('*',(req ,res)=>{
    console.log("Nothing Found Here !!!")
})

let server = app.listen(port,()=>{
    console.log("Server Running on port "+port)
})

let io = socket(server,{
    cors:{
        origin:'*'
    }
})

io.on('connection',async(socket)=>{
    // console.log("Connected")
let r
    socket.on('msg',async({message,nsender,nreceiver,time})=>{
        console.log(nsender+" --> "+nreceiver)
        console.log("The message is :",message)
                     r = nreceiver;
        let newMessage = new messageModel({
            message:message,
            senderEmail:nsender,
            receiverEmail:nreceiver,
            date:time
        })
        await newMessage.save()
        .then(res => console.log(res))
        .catch(err => console.log(err))
            messageModel.find({$or:[{senderEmail:nsender,receiverEmail:nreceiver},{senderEmail:nreceiver,receiverEmail:nsender}]})
            .then( async (result) => {

               await userModel.updateOne({email:nreceiver},{$set:{notification:"true"}})
                .then(result => console.log(result))
                .catch(err => console.log(err))

                socket.emit('recieved-msg',result)
            })
            .catch(err => console.log(err))



    })
    // let isTyping = false
    socket.on('sender-typing',(receiver)=>{
        console.log("typing to ",receiver)
        // isTyping = true
    })
    
    socket.emit('typing')
})