const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middleware/auth");




profileRouter.get("/profile",userAuth,async(req,res)=>{
  try{
  userinfo=req.user;
  res.send(userinfo);
  }
  catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});

module.exports={profileRouter};
