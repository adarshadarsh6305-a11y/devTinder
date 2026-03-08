const mongoose=require("mongoose");
const validator=require("validator");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
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
        // min:18,
        // max:120,
         validate(value){
        if(value.length<18 || value.length>120){
            throw new error("invalid age");
        }
    }
    },
    gender:{
        type:String,
        validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error("gender is not valid");
        }
    }
    },
    photoUrl:{
      type:String,
      default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fvectors%2Fdefault-avatar.html&psig=AOvVaw0lAUgeIz2UWYKJ9eC2Dnbm&ust=1772954687790000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNjQuZShjZMDFQAAAAAdAAAAABAK",
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

    }

},{
    timestamps:true,
});
module.exports=mongoose.model("User",userSchema);