const express=require("express");
const app=express();
const connectDB=require("./config/database");
const User=require("./models/user");
const cookieParser=require("cookie-parser");
const {socketHandle}=require("./utils/socketHandle");

const http=require("http");

require('dotenv').config();
require("./utils/cron");

const {authRouter}=require("./routs/auth");
const {profileRouter}=require("./routs/profile");
const {requestRouter}=require("./routs/request");
const {userRouter}=require("./routs/user");
const {paymentRouter}=require("./routs/payments");
const { chatRouter } = require("./routs/chat");

const cors = require('cors');


app.use(cors({
  origin:process.env.Front_End_Location,
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter);
app.use("/",chatRouter);


const server = http.createServer(app);
socketHandle(server);

connectDB()
.then(()=>{
  console.log("database connected successfully");
  server.listen(7777,()=>{
    console.log("server is listening at 7777");
});
})

.catch((err)=>{
    console.log("database connection failed");
});


