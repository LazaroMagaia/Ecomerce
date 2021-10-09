const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken")
//REGISTER
router.post('/register', async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASS).toString(), 
    });
    try{
        let savedUser = await newUser.save();
        const {password,...another} = savedUser._doc;
        res.status(201).json(another)
    }catch(err){
        res.status(500).json(err);
    }

});
router.post("/login", async (req,res)=>{
    try {
        const user = await User.findOne({email: req.body.email});
        !user && res.status(401).json("Credenciais incorrectas")
        const hashedpassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASS);
        const DBpassword = hashedpassword.toString(CryptoJS.enc.Utf8);
        DBpassword !== req.body.password && res.status(401).json("Credenciais incorrectas");

        const accessToken = jwt.sign({
            id: user._id, 
            admin:user.Admin,
        },process.env.SECRET_JWT,
        {expiresIn:"2d"});
        const {password,...others} = user._doc;
        res.status(200).json({...others, accessToken});
    }catch(err){res.status(500).json(err);}

})

module.exports = router;