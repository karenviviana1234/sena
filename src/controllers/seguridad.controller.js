import { pool } from './../database/conexion.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const validar = async (req, res) => {
    try {
      const { correo, password } = req.body;
      let sql = `SELECT * FROM personas WHERE correo = '${correo}'`;
      const [rows] = await pool.query(sql);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Correo incorrecto" });
      }
      const user = rows[0];
      console.log(user);
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(404).json({ message: "Contraseña incorrecta", validPassword});
      }
      const token = jwt.sign({ rows }, process.env.AUT_SECRET, {
        expiresIn: process.env.AUT_EXPIRE,
      });
      res.status(200).json({ 'user': user, 'token': token });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" + error });
    }
  };

export const validarToken = async (req, res, next) => {

    try {
        
        let tokenClient = req.headers['token']

        if(!tokenClient){
            return res.status(403).json({'message': 'Token es requerido'})
        }else{
            const token = jwt.verify(tokenClient, process.env.AUT_SECRET, (error, decoded) => {
                if(error){
                    return res.status(403).json({message: 'Token es obligatorio'})
                }else{
                    next()
                }
            })
        }

    } catch (error) {
        return res.status(500).json({status: 500, message: 'Error del servidor' + error})
    }
    
}