const express=require("express");
const app=express();
const connectDB=require("./config/database");
const User=require("./models/user");
const bcrypt=require('bcrypt');
const {validateSignUp}=require("./utils/validation");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const {userAuth}=require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async(req,res)=>{
      try{
        validateSignUp(req);
  const {firstName,lastName,emailId,password}=req.body;
    const passwordHash=await bcrypt.hash(password,10);
    
    const user=new User({
      firstName,
      lastName,
      emailId,
      password:passwordHash,
    });

      await user.save();
      res.send("user added successfully!");
    }
    catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});

app.post("/login",async(req,res)=>{
try{
    const {emailId,password}=req.body;

  const user = await User.findOne({emailId:emailId});
  if(!user){
    throw new Error("invalid credentials");
  }
  const isPassword = await bcrypt.compare(password,user.password);
  if(isPassword){
    const cookie=await jwt.sign({_id:user._id},"devTinder@123");
    res.cookie("token",cookie);
    res.send("login successful");
  }
  else{
    throw new Error("invalid credentials");
  }
}
 catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});

app.get("/profile",userAuth,async(req,res)=>{
  try{
  userinfo=req.user;
  res.send(userinfo);
  }
  catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});


app.post("/sendrequest",userAuth,async(req,res)=>{
  try{
  const userinfo=req.user;
  const lastName=userinfo;
  res.send(lastName +" is sent you a request!");
  }
  catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});



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


