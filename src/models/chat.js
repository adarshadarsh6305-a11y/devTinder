const mongoose=require("mongoose");
const messagesSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true,
    }

},{timestamps:true});
const chatSchema = new mongoose.Schema({
  participants:[
    {type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
    }
  ],
  messages:[messagesSchema],
},{timestamps:true});

const chatMessages=new mongoose.model("chatMessages",chatSchema);
module.exports={chatMessages};

