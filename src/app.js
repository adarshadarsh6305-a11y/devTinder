const express=require("express");
const app=express();

const {adminAuth,userAuth}=require("./middleware/auth");

app.use("/admin",adminAuth);

app.get("/user/login",(re,res)=>{
    res.send("logged successfully!");
});

app.get("/user/data",userAuth,(re,res,next)=>{
    res.send("user information");
});

app.get("/admin/getalldata",(req,res,next)=>{
    res.send("all data fetched");
});
app.get("/admin/delete",(re,res,next)=>{
    res.send("deleted user");
});


app.listen(535,()=>{
    console.log("server is listening at 535");
}
);