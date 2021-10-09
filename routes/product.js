const router = require('express').Router();
const Product = require('../models/Product');
const { verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin  } = require('./verifyToken');

// CREATE PRODUCT
router.post("/",verifyTokenAndAdmin, async (req, res)=>{
    const newproduct = new Product(req.body);
    
    try{
        const saveproduct = await newproduct.save();
        res.status(200).json(saveproduct);
    }
    catch(res){
        res.status(500).json(err)
    }
});
//UPDATE PRODUCT
router.put('/:id', verifyTokenAndAdmin, async (req,res)=>{
    try {
        const updateProduct  = await  User.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new:true});
        res.status(200).json(updateProduct);    
    }catch(err){
        res.status(500).json(err)
    }
});

//DELETE  PRODUCT
router.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try
    {
        const Product = await Product.findByIdAndDelete(req.params.id);
        if(Product)
        {
            return res.status(200).json("Produto removido com sucesso");
        }else
        {
            return res.status(500).json("Opps... Não conseguimos remover o produto");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});

//GET  PRODUCT
router.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
    try
    {
        const user = await User.findById(req.params.id);
        if(user)
        {
            const {password,...others} = user._doc;
            return res.status(200).json(others);  
        }else
        {
            return res.status(500).json("Opps... Não conseguimos localizar o usuario");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});

//GET  PRODUCT
router.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
    try
    {
        const Product = await Product.findById(req.params.id);
        if(user)
        {
            return res.status(200).json(Product);  
        }else
        {
            return res.status(500).json("Opps... Não conseguimos localizar o produto");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});

//GET  ALL PRODUCT 
router.get("/", async (req,res)=>{
    const query = req.query.new;
    const querycategorie = req.query.category;
    try
    {
        let product;
        if(query)
        {
            product = await Product.find().sort({createdAt: -1}).limit(5);
        }else if(querycategorie)
        {
            product = await Product.find({categories:{$in:[querycategorie]}});
        }else
        {
            product = await Product.find();
        }
        res.status(200).json(product);
    }catch(err)
    {
        res.status(500).json(err)
    }
});

module.exports = router;