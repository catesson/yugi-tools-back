const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    //PERMET DE RECUPERER UNIQUEMENT LE TOKEN EN SUPPRIMANT LE MOT BEARS
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};