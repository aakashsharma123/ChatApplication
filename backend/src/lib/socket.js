import {Server} from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server , {
  cors : {
    origin : ["http://localhost:5173"]
  }
});

const userOnline = {};

console.log(userOnline)

export const getReceiverId = (userid) => {
    return userOnline[userid]
}

io.on("connection" , (socket) => {
    console.log("user is connected" , socket.id)
    const userid = socket.handshake.query.userid
    
    if (userid) userOnline[userid] = socket.id;
    io.emit("onlineusers" , Object.keys(userOnline))
    socket.on ("disconnect" , ()=> {
        console.log("A user is disconnected" , socket.id)
        delete userOnline[userid]
        io.emit("onlineusers" , Object.keys(userOnline))
    })
})

export {app , server , io}
