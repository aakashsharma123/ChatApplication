import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import authroutes from '../src/routes/auth.route.js'
import authMessageRoutes from '../src/routes/auth.message.js';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path';
import {app , server} from '../src/lib/socket.js'


const port = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);


app.use("/api/auth", authroutes)
app.use("/api/message", authMessageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname , "../frontend/dist")))

  app.use("*" , (req , res)  => {
      res.sendFile(path.join(__dirname , "../frontend" , "dist" , "index.html"))
  })
}

server.listen(port, () => {
  connectDB();
  console.log(`server is running on port ${port}`)
})