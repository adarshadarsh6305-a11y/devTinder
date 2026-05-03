const express = require("express");
const userRouter = express.Router();
const {userAuth}=require("../middleware/auth");
const {ConnectionRequest}=require("../models/connectionRequest");

const userSafeData=["firstName","lastName","age","gender","skills","photoUrl"];

userRouter.get("/user/request/received",userAuth,async(req,res)=>{
   try{
      const user=req.user;
      const requests=await ConnectionRequest.find({
        toUserId:user._id,
        status:"interested"
      }).populate("fromUserId",userSafeData);
      if(!requests){
        return res.status(404).json({meassage:"there are no requests"});
      }
      res.json({message:"see your all requests below",requests});
   }
     catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try{
    const user=req.user;
    const connectionRequests=await ConnectionRequest.find({
      $or:[{fromUserId:user._id,status:"accepted"},
        {toUserId:user._id,status:"accepted"}]
    }).populate("fromUserId",userSafeData).populate("toUserId",userSafeData);
    
    const data=connectionRequests.map((row)=>{
      if(row.fromUserId._id.toString()===user._id.toString()){
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({data:data});

  }
  catch(err){
    res.status(400).send("ERROR:" + err.message);
  }

})
module.exports={userRouter};