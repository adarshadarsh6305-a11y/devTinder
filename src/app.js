const express=require("express");
const app=express();
const connectDB=require("./config/database");
const User=require("./models/user");
const cookieParser=require("cookie-parser");

require('dotenv').config();
require("./utils/cron");

const {authRouter}=require("./routs/auth");
const {profileRouter}=require("./routs/profile");
const {requestRouter}=require("./routs/request");
const {userRouter}=require("./routs/user");
const {paymentRouter}=require("./routs/payments");

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

connectDB()
.then(()=>{
  console.log("database connected successfully");
  app.listen(7777,()=>{
    console.log("server is listening at 7777");
});
})

.catch((err)=>{
    console.log("database connection failed");
});


