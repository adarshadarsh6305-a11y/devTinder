const express=require("express");
const chatRouter=express.Router();
const {userAuth}=require("../middleware/auth");
const { chatMessages } = require("../models/chat");



chatRouter.get("/chat/:toUserId",userAuth,async(req,res)=>{
   try{
    const user=req.user;
    const toUserId=req.params.toUserId;
    
    let chat=await chatMessages.findOne({
        participants:{
            $all:[user._id,toUserId]
        }
    }).populate({
     path:"messages.fromUserId",
     select:"firstName lastName"}
    );
    if(!chat){
        chat=new chatMessages({
            participants:{
                $all:[user._id,toUserId]
            },
            messages:[]
        });
        await chat.save();

    }
   res.json({
    chat
   });

   }
   catch(err){
    res.status(400).send("ERROR:" + err.message);
   }

});

module.exports={chatRouter};