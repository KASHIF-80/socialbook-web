const express = require("express")
const mongoose = require("mongoose")
const http = require("http")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

mongoose.connect("mongodb://127.0.0.1/socialDB")

app.use(express.json())
app.use(express.static("public"))

let posts = []

app.post("/post",(req,res)=>{
    const post = {
        id:Date.now(),
        user:req.body.user,
        text:req.body.text,
        likes:0
    }
    posts.unshift(post)

    io.emit("newPost",post)
    res.send(post)
})

app.get("/posts",(req,res)=>{
    res.send(posts)
})

app.post("/like",(req,res)=>{
    const p = posts.find(x=>x.id==req.body.id)
    p.likes++
    io.emit("refreshLikes",p)
    res.send("liked")
})

io.on("connection",()=>console.log("User Connected"))

server.listen(3000,()=>console.log("Server Running"))