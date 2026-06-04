const mongoose=require('mongoose');

const connectDB=async()=>{
    await mongoose.connect(
process.env.Mongo_Db_Url    );
};
module.exports=connectDB;