const router = require('express').Router();
const User = require('../models/User');
const { verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin  } = require('./verifyToken');

//UPDATE USER
router.put('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    if( req.body.password)
    {
        eq.body.password = 
        CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASS).toString();
    }
    try {
        const updateUser  = await  User.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new:true});
        const {password,...others} = updateUser._doc;
        res.status(200).json(others);    
    }catch(err){
        res.status(500).json(err)
    }
});

//DELETE  USER
router.delete("/:id",async (req,res)=>{
    try
    {
        const user = await User.findByIdAndDelete(req.params.id);
        if(user)
        {
            return res.status(200).json("Usuario removido com sucesso");
        }else
        {
            return res.status(500).json("Opps... Não conseguimos remover o usuario");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});

//GET  USER
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
//GET  ALL USERS 
router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    const query = req.query.new;
    try
    {
        const users = query ? await User.find().sort({_id:-1}).limit(5): await User.find();
        if(users)
        {
            return res.status(200).json(users);  
        }else
        {
            return res.status(500).json("Opps... Não conseguimos localizar os usuarios");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
})

//GET  USER
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

//GET  ALL USERS  STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;