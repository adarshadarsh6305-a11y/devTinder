const express=require("express");
const app=express();

app.get("/user",(req,res)=>{

   throw new error;
});
app.use("/",(err,req,res,next)=>{
    res.status(404).send("something went wrong");
})



app.listen(535,()=>{
    console.log("server is listening at 535");
}
);