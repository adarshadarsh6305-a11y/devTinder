const express=require("express");
const app=express();
const connectDB=require("./config/database");
const User=require("./models/user");

app.use(express.json());
app.get("/user", async(req,res)=>{
   const userEmail=req.body.emailId;
    try{
      const users=await User.findOne({emailId:userEmail});
      if(users.length===0){
        res.status(404).send("user not found");
      }
      else{
      res.send(users);
      }
    }
    catch(err){
      res.status(400).send("something went wrong");
    }
});

app.post("/signup", async(req,res)=>{
    const user=new User(req.body);
    try{
      await user.save();
      res.send("user added successfully!");
    }
    catch(err){
      res.status(400).send("error occured while saving"+err.message);
    }
});

app.delete("/user",async(req,res)=>{
  const userId=req.body.userId;

  try{
  await User.findByIdAndDelete(userId);
  res.send("user deleted successfully");
  }
  catch(err){
    res.status(404).send("something went wrong");
  }

})

app.patch("/user/:userId",async(req,res)=>{
  const userId=req.params?.userId;
  const data = req.body;
  try{
      
   const availableUpdates=["age","about","photoUrl","skills","gender"];
   const isUpdate=Object.keys(data).every((k)=>
    availableUpdates.includes(k)
   );
   if(!isUpdate){
    throw new Error("cant able to update the user");
   }
   if(data?.skills.length>10){
    throw new Error("skills cannot be more than 10");
   }
  const user=await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"after",runValidators:true});
  res.send("user updated successfully");
  }
  catch(err){
    res.status(404).send("unable to update the user");
  }

})

connectDB()
.then(()=>{
  console.log("database connected successfully");
  app.listen(7777,()=>{
    console.log("server is listening at 7777");
});
})

.catch((err)=>{
    console.log("database connection failed");
});


