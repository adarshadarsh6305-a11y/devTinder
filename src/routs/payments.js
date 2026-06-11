const express=require("express");
const paymentRouter=express.Router();
const {userAuth}=require("../middleware/auth");
const instance=require("../utils/razorpay");
const Payment = require("../models/payments");
const {membershipAmount} = require("../utils/constants");
const crypto = require("crypto");

paymentRouter.post("/payment/user",userAuth,async(req,res)=>{
   try{
    const {membershipType}=req.body;
    const{firstName,lastName,emailId}=req.user;
    const order= await instance.orders.create({
  "amount": membershipAmount[membershipType]*100,
  "currency": "INR",
  "receipt": "receipt#1",
  "notes": {
    "firstName":firstName ,
    "lastName": lastName,
    "emailId":emailId,
    "membershipType":membershipType,
  }
});
 
const newPayment = new Payment({
  userId: req.user._id,

 orderId: order.id,

  amount: order.amount,

  currency: order.currency,

  status: order.status,

  notes: order.notes,
});

await newPayment.save();

res.json({
   ...newPayment.toJSON(),
   keyId: process.env.Test_API_Key 
});


   }
   catch(err){
    res.status(400).send("ERROR: " + err.message);
   }
});


const verifyPremiumPayment = async (req,res)=>{

    try{

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.Test_Key_Secret 
            )
            .update(
                razorpay_order_id +
                "|" +
                razorpay_payment_id
            )
            .digest("hex");

           

        if(
            generatedSignature ===
            razorpay_signature
        ){

            req.user.isPremium = true;

            await req.user.save();

           const payment = await Payment.findOne({
   orderId: razorpay_order_id
});

      if(payment){
          payment.status = "success";
            await payment.save();
         }


            return res.json({
                success:true,
                message:"Payment Verified"
            });
        }
      

        return res.status(400).json({
            success:false,
            message:"Invalid Signature"
        });

    }
    catch(err){
        res.status(500).send(err.message);
    }
}
paymentRouter.post("/payment/verify",userAuth,
  verifyPremiumPayment
);

module.exports ={paymentRouter};