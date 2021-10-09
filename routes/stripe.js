const router = require('express').Router();
const stripe = require("stripe")(process.env.SECRET_STRIPE)


router.post("/payment",(req,res)=>{
    stripe.changes.create({
        source: req.body.tokenId,
        amount:req.body.amount,
        currency:"usd",
    },(stripeErr,stripeRes)=>{
        if(stripeErr)
        {
            res.status(500).json(stripeErr)
        }else 
        {
            res.status(200).json(stripeRes)
        }
    })
})
module.exports = router;