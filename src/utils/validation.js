const validator =require("validator");

const validateSignUp=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("name is required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("please enter strong password");
    }
};
module.exports={
   validateSignUp
}
