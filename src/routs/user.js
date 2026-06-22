const express = require("express");
const userRouter = express.Router();
const {userAuth}=require("../middleware/auth");
const {ConnectionRequest}=require("../models/connectionRequest");
const User=require("../models/user");


const userSafeData=["firstName","lastName","age","gender","skills","photoUrl","about"];

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
   try{
      const user=req.user;
      const requests=await ConnectionRequest.find({
        toUserId:user._id,
        status:"interested"
      }).populate("fromUserId",userSafeData);
      if(!requests){
        return res.status(404).json({meassage:"there are no requests"});
      }
      res.json({message:"see your all requests below",data:requests});
   }
     catch(err){
      res.status(400).send("ERROR:" + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {

  try {

    const user = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" }
      ]
    })
    .populate("fromUserId", userSafeData)
    .populate("toUserId", userSafeData);

    const safeConnections = connectionRequests.filter(
      (row) => row.fromUserId && row.toUserId
    );
  

 
    const data = safeConnections.map((row) => {

      if(row.fromUserId._id.toString() === user._id.toString()){

        return row.toUserId;

      }

      return row.fromUserId;

    });
   
    res.json({ data });

  }

  catch(err){

    res.status(400).send("ERROR: " + err.message);

  }

});

userRouter.get("/feed",userAuth,async(req,res)=>{
  try{
    const user=req.user;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    let limit = Math.max(parseInt(req.query.limit) || 10, 1);
    limit=limit>50?50:limit;
     const skip=(page-1)*limit;

    
    const connectionRequests=await ConnectionRequest.find({
      $or:[{fromUserId:user._id},{toUserId:user._id}]
    }).select("fromUserId toUserId");

    const hideUsers=new Set();

    connectionRequests.forEach((req)=>{
      hideUsers.add(req.fromUserId.toString());
      hideUsers.add(req.toUserId.toString());
    });
      hideUsers.add(user._id.toString());
    const users=await User.find({
      _id:{$nin: Array.from(hideUsers)}
    }).select(userSafeData).skip(skip).limit(limit);
   res.send(users);
  }
  catch(err){
    res.status(400).send("ERROR:" + err.message);
  }

});
module.exports={userRouter};