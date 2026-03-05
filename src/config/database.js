const mongoose=require('mongoose');

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://adarshadarsh6305_db_user:adarshadarsh630@project1.hwcckxv.mongodb.net/devTinder"
    );
};
module.exports=connectDB;