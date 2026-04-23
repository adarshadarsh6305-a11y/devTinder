const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middleware/auth");
const {ValidateProfileData}=require("../utils/validation");
const user = require("../models/user");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  try{
  const userinfo=req.user;
  res.send(userinfo);
  }
  catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
   try{
      const isValidProfileData=ValidateProfileData(req);
      if(!isValidProfileData){
        throw new Error("Edit data is invalid!!");
      }
      const user=req.user;
      Object.keys(req.body).every((key)=>user[key]=req.body[key]);
      res.send(user.lastName + ", Your profile edited successfully!!" );
       await user.save();
  }
  catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});


module.exports={profileRouter};
