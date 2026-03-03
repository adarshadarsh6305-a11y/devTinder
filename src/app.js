const express=require("express");
const app=express();


app.get("/user",[(req,res,next)=>{
    console.log("1st handler");
    //res.send("responce 1");
    next();
}],(req,res,next)=>{
    console.log("2nd handler");
    //res.send("responce 2");
    next();
},(req,res,next)=>{
    console.log("3rd handler");
    res.send("responce 3");
});

app.listen(535,()=>{
    console.log("server is listening at 535");
}
);