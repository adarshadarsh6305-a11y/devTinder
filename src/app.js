const express=require("express");
const app=express();
app.use("/home",(req,res)=>{
    res.send("hello from home");
});
app.use("/title",(req,res)=>{
    res.send("devTinder project");
});
app.use((req,res)=>{
    res.send("hello from server adarsh");
});
app.listen(535,()=>{
    console.log("server is listening at 535");
}
)