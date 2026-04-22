const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middleware/auth");


requestRouter.post("/sendrequest",userAuth,async(req,res)=>{
  try{
  const userinfo=req.user;
  const {lastName}=userinfo;
  res.send(lastName +" is sent you a request!");
  }
  catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});

module.exports={requestRouter};
