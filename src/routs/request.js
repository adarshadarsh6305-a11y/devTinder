const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middleware/auth");
const User=require("../models/user");
const {ConnectionRequest}=require("../models/connectionRequest");


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
  try{
  const fromUser=req.user;
  const fromUserId=fromUser._id;
  const toUserId=req.params.toUserId;
  const toUser=await User.findById(toUserId);
  const status=req.params.status;
  if(!toUser){
    throw new Error("user is not found");
  }
  
  const allowedStatus=["ignored","interested"];
  const isAllowedStatus=allowedStatus.includes(status);
  if(!isAllowedStatus){
    throw new Error("status is not valid");
  }
  const requestExist=await ConnectionRequest.findOne({
    $or:[{toUserId,fromUserId},
      {toUserId:fromUserId,fromUserId:toUserId}]
  });

  if(requestExist){
    throw new Error("connection already exist");
  }
  const newRequest=new ConnectionRequest({
    fromUserId,
    toUserId,
    status
  });
  const data=await newRequest.save();
  res.status(201).json({
  success: true,
  message: fromUser.firstName +" interested "+"in " +toUser.firstName,
  data: data
 
});
  }
  catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const user=req.user;
    const allowedStatus=["accepted","rejected"];
    const {status,requestId} =req.params;
    const isAllowedStatus=allowedStatus.includes(status);
    if(!isAllowedStatus){
      throw new Error("invalid status");
    } 
         const requestExist= await ConnectionRequest.findOne({
          _id:requestId,
          toUserId:user._id,
          status:"interested"
         });
         
         if(!requestExist){
          return res.status(404).json({messgae:"connection request not found"});
         }

         requestExist.status=status;
         const data=await requestExist.save();
         res.json({message: user.firstName+" "+status +" connection request",data});

    }
     catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
  });

module.exports={requestRouter};
