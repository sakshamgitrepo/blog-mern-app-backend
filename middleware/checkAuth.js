const jwt = require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try {
       const {token} = req.cookies;
       jwt.verify(token, process.env.JWT_SECRET, {}, (err,info) => {;
        res.json(info);
      })
      next();
    } catch (error) {
        res.json({error:'invalid token'})
    }
}
