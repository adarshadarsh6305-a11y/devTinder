const User=require("../models/user");
const express=require("express");
const authRouter=express.Router();
const {validateSignUp}=require("../utils/validation");
const cookieParser=require("cookie-parser");
const bcrypt=require('bcrypt');




authRouter.post("/signup", async(req,res)=>{
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

authRouter.post("/login",async(req,res)=>{
try{
    const {emailId,password}=req.body;

  const user = await User.findOne({emailId:emailId});
  if(!user){
    throw new Error("invalid credentials");
  }
  const isPassword = await user.validatePassword(password);
  if(isPassword){
    const token=await user.getJwt();
    res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
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

authRouter.post("/logout",async (req,res)=>{
  res.cookie("token",null,
    {expires:new Date(Date.now())}
  );
  res.send("log out successfull");
    
});

module.exports={authRouter};
