const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        },
        required:true
    }
},{timestamps:true});

connectionRequestSchema.pre("save",function(){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("self connection is not possible");
    }
});

// connectionRequestSchema.index({fromUserId:1,toUserId:1});

const ConnectionRequest=new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports={ConnectionRequest};