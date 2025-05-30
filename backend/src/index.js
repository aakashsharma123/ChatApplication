import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import authroutes from '../src/routes/auth.route.js'
import authMessageRoutes from '../src/routes/auth.message.js';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';


const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" , authroutes)
app.use("/api/auth/message", authMessageRoutes);


app.listen(port, () => {
  connectDB();
  console.log(`server is running on port ${port}`)
})