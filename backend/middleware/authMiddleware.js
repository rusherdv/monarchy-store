import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const checkAdmin = (req,res,next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]

        if(!token){
            res.json({msg:"Token invalido"})
        }
    
        const decodedToken = jwt.decode(token);
        if(!(decodedToken.email === process.env.ADMIN_EMAIL || decodedToken.email === process.env.ADMIN_EMAIL2)){
            return res.json({msg: "Autenticacion invalida"})
        }
        next();
    } catch (error) {
      console.error('Error al decodificar el token:', error.message);
      return res.status(500).json({ error: 'Error de token' });
    }

};

export default checkAdmin