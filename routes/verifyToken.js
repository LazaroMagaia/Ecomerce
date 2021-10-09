const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token;
    if(authHeader)
    {
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.SECRET_JWT,(err,user)=>{
            if(err){res.status(403).json("O token é invalido ou já expirou")}
            req.user = user;
            next();
        });
    }
    else
    {
        return res.status(401).json("Você não está autenticado!");
    }
} 

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.admin)
        {
            next();
        }else
        {
            return res.status(403).json("Você não tem permissão para fazer essa ação");
        }
    })
}
const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.admin)
        {
            next();
        }else
        {
            return res.status(403).json("Você não tem permissão para fazer essa ação");
        }
    })
}


module.exports = { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin};