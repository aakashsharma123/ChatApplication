import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import authroutes from '../src/routes/auth.route.js'
import authMessageRoutes from '../src/routes/auth.message.js';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'


const app = express();
const port = process.env.PORT


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


app.listen(port, () => {
  connectDB();
  console.log(`server is running on port ${port}`)
})