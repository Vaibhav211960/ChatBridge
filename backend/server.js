import express from 'express';
import dotenv from 'dotenv';
import conn from './lib/db.js';
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();
conn();

const app = express();

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 8000;
app.get("/", (req, res) =>{
    res.send("hello there ..")
})
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT, ()=>{
    console.log(`server is running .. on port ${PORT}`);
})