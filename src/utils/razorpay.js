const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.Test_API_Key,
  key_secret: process.env.Test_Key_Secret 
});

module.exports=instance;