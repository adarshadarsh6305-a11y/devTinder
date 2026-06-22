const socket=require("socket.io");

const socketHandle=(server)=>{
   const io=socket(server,{
    cors:{
        origin:process.env.Front_End_Location,
    },
   });

   io.on("connection",(socket)=>{

    socket.on("joinChat",({userId,toUserId})=>{
        const roomId=[userId,toUserId].sort().join("_");
        socket.join(roomId);
        
       
    });

     socket.on("sendMessage",({userId,toUserId,firstName,text})=>{
        const roomId=[userId,toUserId].sort().join("_");
        io.to(roomId).emit("recievedMessage",{firstName,text});

    });

     socket.on("disconnect",()=>{

    });

   });
}
module.exports={socketHandle};