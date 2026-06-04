const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middleware/auth");
const User=require("../models/user");
const {ConnectionRequest}=require("../models/connectionRequest");
const sendEmail=require("../utils/sendEmail");



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

const emailRes = await sendEmail.run(
  `New Connection Request on DevTinder`,
  `Hi ${toUser.firstName},

${fromUser.firstName} is interested in connecting with you on DevTinder.

Login to your account to review the request.`
);

  res.status(201).json({
  success: true,
  message: fromUser.firstName +" interested "+"in " +toUser.firstName,
  data: data
 
});
  }
  catch(err){
   console.log("FULL ERROR:");
   console.log(err);
   res.status(400).send("ERROR:" + err.message);
}
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  
  try{

    const user=req.user;

    const allowedStatus=["accepted","rejected"];

    const {status,requestId} = req.params;

    const isAllowedStatus = allowedStatus.includes(status);

    if(!isAllowedStatus){

      throw new Error("invalid status");

    } 

    const requestExist = await ConnectionRequest.findOne({

      _id:requestId,

      toUserId:user._id,

      status:"interested"

    }).populate("fromUserId","lastName");

    
    // NULL SAFETY CHECK
    if(!requestExist || !requestExist.fromUserId){

      return res.status(404).json({
        message:"connection request not found"
      });

    }

    requestExist.status = status;

    await requestExist.save();

    res.json({

      message:
      `${user.firstName} ${status} the connection request of ${requestExist.fromUserId.lastName}`,

      data: requestExist

    });

  }

  catch(err){

    res.status(400).send("ERROR:" + err.message);

  }

});

module.exports={requestRouter};
