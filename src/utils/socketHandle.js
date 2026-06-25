const socket=require("socket.io");
const {chatMessages}=require("../models/chat");
const {ConnectionRequest} = require("../models/connectionRequest");

const socketHandle=(server)=>{
   const io=socket(server,{
    cors:{
        origin:process.env.Front_End_Location,
    },
   });

   

const onlineUsersInRooms = new Map();
   
   io.on("connection",(socket)=>{

   socket.on("joinChat", ({ userId, toUserId }) => {
  const roomId = [userId, toUserId].sort().join("_");

  socket.join(roomId);

  socket.userId = userId;
  socket.roomId = roomId;

  if (!onlineUsersInRooms.has(roomId)) {
    onlineUsersInRooms.set(roomId, new Set());
  }
  onlineUsersInRooms.get(roomId).add(userId);

  io.to(roomId).emit("onlineUsersInChat", Array.from(onlineUsersInRooms.get(roomId)));
});



  socket.on("sendMessage",async ({userId,toUserId,firstName,lastName,text})=>{
       try{
        const isConnectionRequest=await ConnectionRequest.findOne({
            $or:[{toUserId:userId,fromUserId:toUserId},{toUserId:toUserId,fromUserId:userId}],
            status:"accepted"
        });

        if(!isConnectionRequest){
            console.log("connection not found")
        }

        let chat = await chatMessages.findOne({
            participants:{$all:[userId,toUserId]}
        });
        if(!chat){
            chat=new chatMessages({
                participants:[userId,toUserId],
                messages:[]
            });

        }
        chat.messages.push({
            fromUserId:userId,
            text
        });
        
await chat.save();

 const roomId=[userId,toUserId].sort().join("_");
io.to(roomId).emit("recievedMessage",{userId,firstName,lastName,text});

    }
    catch(err){
        console.log(err);
    }
    });



socket.on("disconnect", () => {

    const { userId, roomId } = socket;
    if (!userId || !roomId) return;
     const roomUsers = onlineUsersInRooms.get(roomId);

  if (!roomUsers) return;

  roomUsers.delete(userId);
  if (roomUsers.size === 0) {
    onlineUsersInRooms.delete(roomId);
  } 
  else {
    io.to(roomId).emit("onlineUsersInChat", Array.from(roomUsers));
  }

});

   });
}
module.exports={socketHandle};