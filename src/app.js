const express=require("express");
const app=express();


app.get("/user",(req,res)=>{
    res.send({firstname:"M",lastname:"Adarsh"});
})
app.post("/user",(req,res)=>{
    //save changes to db
    res.send("DB changed successfully");
})
app.delete("/user",(req,res)=>{
    res.send("deleted successfully");
});
app.use("/user",(req,res)=>{
    res.send("hello from home");
});




app.listen(535,()=>{
    console.log("server is listening at 535");
}
)