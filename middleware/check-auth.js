const jwt = require('jsonwebtoken');
const privatekey = 'hitlerwithoutmostache9988';
module.exports  = async (req,res,next)=>{
    try{
        const decoded = await jwt.verify(req.body.token,privatekey);
        req.userData = decoded;
        next();
    }catch(error){
        return res.status(401).json({
            message:'Auth Failed'
        });

    }
    
    next();
};