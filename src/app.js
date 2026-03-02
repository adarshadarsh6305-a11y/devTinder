const express=require("express");
const app=express();


app.get("/user/:userid/:name",(req,res)=>{
    console.log(req.params);
    res.send({firstname:"M",lastname:"Adarsh"});
});

app.listen(535,()=>{
    console.log("server is listening at 535");
}
);