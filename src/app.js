const express=require("express");
const app=express();
const connectDB=require("./config/database");
const User=require("./models/user");

app.use(express.json());
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


