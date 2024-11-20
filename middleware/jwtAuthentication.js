const jwt = require ('jsonwebtoken')

const jwtAuthentication  = (req,res,next)=>{
  
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({message : 'Unauthorized'});
    }
    const token = authHeader.split(' ')[1]

    try {      
        const decoded = jwt.verify(token, process.env.JWT_TOCKEN_SECERT);        
        req.user = decoded;
        next();
      } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
      }
    };
    
module.exports = jwtAuthentication