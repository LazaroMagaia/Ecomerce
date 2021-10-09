const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin  } = require('./verifyToken');

// CREATE CART
router.post("/",verifyToken, async (req, res)=>{
    const newcart = new Cart(req.body);
    
    try{
        const savecart = await newcart.save();
        res.status(200).json(savecart);
    }
    catch(res){
        res.status(500).json(err)
    }
});

//UPDATE CART
router.put('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    try {
        const updateCart  = await  Cart.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new:true});
        res.status(200).json(updateCart);    
    }catch(err){
        res.status(500).json(err)
    }
});

//DELETE  CART
router.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try
    {
        const Cart = await Cart.findByIdAndDelete(req.params.id);
        if(Cart)
        {
            return res.status(200).json("Carrinho limpado com sucesso");
        }else
        {
            return res.status(500).json("Opps... Não conseguimos limpar o carrinho");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});

//GET  CART
router.get("/find/:userId",verifyTokenAndAuthorization,async (req,res)=>{
    try
    {
        const cart = await Cart.findOne({userId:req.params.userId});
        if(cart)
        {
            return res.status(200).json(cart);  
        }else
        {
            return res.status(500).json("Opps... Não conseguimos localizar o carinho");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});
//GET  ALL CART 
router.get("/",verifyTokenAndAdmin, async (req,res)=>{
    try
    {
        const carts = await Cart.find();
        res.status(200).json(carts);
    }
    catch(err)
    {res.status(500).json(err)}
});
module.exports = router;