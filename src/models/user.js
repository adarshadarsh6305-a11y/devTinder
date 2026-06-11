const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:1,
        maxLength:50,
       
    },
    lastName:{
        type:String,
        required:true,
        // minLength:3,
       validate(value){
        if(value.length<3){
            throw new Error("Name size should be greater than 3");
        }
    },
    },
    emailId:{
       type:String,
       required:true,
       unique:true,
       lowercase:true,
       trim:true,
        validate(value){
        if(!validator.isEmail(value)){
            throw new Error("invalaid email address");
        }
    },
    },
    password:{
        type:String,
        required:true,
        // maxLength:10,
        // minLength:8,
         validate(value){
        if(value.length<8 ){
            throw new Error("password must be atleast 8 characters");
        }
        if(value.length>30 ){
            throw new Error("password is too long");
        }
    },
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("password is too weak");
        }
    },
    },
age:{
    type:Number,

   validate(value){

    if(value == null || value === "") return true;

    if(value < 18 || value > 120){
        throw new Error("Invalid age");
    }
},
},
    gender:{
        type:String,
        validate(value){

    if(value == null || value === "") return true;

    if(value < 18 || value > 120){
        throw new Error("Invalid age");
    }
},
    },
    photoUrl:{
      type:String,
      default:"https://www.shutterstock.com/image-photo/silhouette-young-man-avatar-blue-260nw-2549867317.jpg",
      validate(value){
        if(!validator.isURL(value)){
            throw new Error("invalid url");
        }
    },
    },
    about:{
        type:String,
        default:"this is the about section",
    },
    skills:{
        type:[String]

    },
    isPremium:{
   type:Boolean,
   default:false
}

},{
    timestamps:true,
});

userSchema.methods.getJwt=async function(){
   const user=this;
    const token=await jwt.sign({_id:user._id},process.env.Jwt_Password,{expiresIn:"7d"});
    return token;

}

userSchema.methods.validatePassword= async function(passwordByUser){
    const user=this;
    const passwordHash=user.password;
    const isValidPassword=await bcrypt.compare(passwordByUser,passwordHash);
    return isValidPassword;
}
module.exports=mongoose.model("User",userSchema);