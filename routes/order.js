const router = require('express').Router();
const Order = require('../models/Order');
const { verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin  } = require('./verifyToken');

// CREATE ORDER
router.post("/",verifyToken, async (req, res)=>{
    const newOrder = new Order(req.body);
    
    try{
        const saveorder = await newOrder.save();
        res.status(200).json(saveorder);
    }
    catch(res){
        res.status(500).json(err)
    }
});

//UPDATE ORDER
router.put('/:id', verifyTokenAndAdmin, async (req,res)=>{
    try {
        const updateorder  = await  Order.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new:true});
        res.status(200).json(updateorder);    
    }catch(err){
        res.status(500).json(err)
    }
});

//DELETE  ORDER
router.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try
    {
        const Order = await Order.findByIdAndDelete(req.params.id);
        if(Order)
        {
            return res.status(200).json("Pedido removido com sucesso");
        }else
        {
            return res.status(500).json("Opps... Não conseguimos remover o pedido");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});

//GET  ORDER
router.get("/find/:userId",verifyTokenAndAuthorization,async (req,res)=>{
    try
    {
        const order = await Order.find({userId:req.params.userId});
        if(order)
        {
            return res.status(200).json(order);  
        }else
        {
            return res.status(500).json("Opps... Não conseguimos localizar os pedidos");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});
//GET  ALL ORDER 
router.get("/",verifyTokenAndAdmin, async (req,res)=>{
    try
    {
        const orders = await Orders.find();
        res.status(200).json(orders);
    }
    catch(err)
    {res.status(500).json(err)}
});

//GET MONTHLY ORDER STATS
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;