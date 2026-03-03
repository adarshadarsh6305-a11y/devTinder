const express=require("express");
const app=express();

app.get("/user",(req,res)=>{
try{
   throw new Error("sjknj");
   res.send("error occured");
}
catch(err){
    res.status(404).send("error occured");
}
});
app.use("/",(err,req,res,next)=>{
    if(err){
    res.status(404).send("something went wrong");
    }
})



app.listen(535,()=>{
    console.log("server is listening at 535");
}
);