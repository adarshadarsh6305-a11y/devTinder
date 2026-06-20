const cron = require('node-cron');
const {ConnectionRequest} = require("../models/connectionRequest");
const {subDays,startOfDay,endOfDay} = require("date-fns");
const sendEmail=require("./sendEmail");

cron.schedule('28 11 * * *', async () => {
  try{
    const yesterday=subDays(new Date(),0);
    const yesterdayStart=startOfDay(yesterday);
    const yesterdayEnd=endOfDay(yesterday);

    const pendingRequests=await ConnectionRequest.find({
      status:"interested",
      createdAt:{
        $gte:yesterdayStart,
        $lt:yesterdayEnd
      }
    }
    ).populate("fromUserId toUserId");

    const listOfMails= [... new Set(pendingRequests.map((req)=>req.toUserId.emailId))];
     for(email of listOfMails){
        try{
        const res= await sendEmail.run(
            "new connection requests for your account "+ email,
            "please login to devtinder whether accepting or rejecting requests" 
        )
        }
        catch(err){
            console.log(err);
        }
     }
  }
  catch(err){
    console.log(err);
  }
});