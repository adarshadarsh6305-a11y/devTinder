const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middleware/auth");
const {ValidateProfileData}=require("../utils/validation");
const user = require("../models/user");
const validator =require("validator");
const bcrypt=require('bcrypt');



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
profileRouter.patch("/profile/changePassword",userAuth,async(req,res)=>{
  try{
     const user=req.user;
     const {password,newPassword}=req.body;

     if (password === newPassword) {
   throw new Error("new password cannot be same as old password");
}
       const isPassword = await user.validatePassword(password);
       if(!isPassword){
        throw new Error("current password is incorrect!");
       }
       if(!validator.isStrongPassword(newPassword)){
               throw new Error("please enter strong password");
           }
       const passwordHash=await bcrypt.hash(newPassword,10);
       user.password=passwordHash;
        await user.save(); 
       res.send("password changed successfully!");
      
          }
           catch(err){
      res.status(400).send("ERROR:" + err.message);
    }

});


module.exports={profileRouter};
