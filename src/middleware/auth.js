const adminAuth=(req,res,next)=>{
    const token="xyz";
    if(token==="xyz"){
        next();
    }
    else{
        res.status(401);
        res.send("unuthorized user");
    }
}
const userAuth=(req,res,next)=>{
    const token="xyz";
    if(token==="xyz"){
        next();
    }
    else{
        res.status(401);
        res.send("unauthrized request");
    }
}
module.exports={adminAuth,userAuth};