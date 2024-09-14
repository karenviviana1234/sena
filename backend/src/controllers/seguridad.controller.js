import { pool } from "../database/conexion.js";
import  Jwt  from "jsonwebtoken";
/* import bcrypt from "bcrypt"; */

export const validar = async (req, res) => {
    try {
        let { correo, password } = req.body;
        let sql = `SELECT * FROM personas WHERE correo='${correo}'`;

        const [rows] = await pool.query(sql);

        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await /* bcrypt.compare */(password, user.password);

            if (!validPassword) {
                return res.status(404).json({ "message": "Usuario no autorizado" });
            }

            // Incluir la identificación del usuario en el token JWT
            let token = Jwt.sign({ user: user.identificacion }, process.env.AUT_SECRET, { expiresIn: process.env.AUT_EXPIRE });
            return res.status(200).json({ 'user': user, 'token': token, message: 'Token generado con éxito' });
        } else {
            return res.status(404).json({ "message": "Usuario no autorizado" });
        }

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error del servidor: ' + error });
    }
}

//verificar
export const validarToken = async (req, res, next) => {
    try {
        let tokenClient = req.headers['token'];

        if (!tokenClient) {
            return res.status(403).json({ message: 'Token es requerido' });
        } else {
            Jwt.verify(tokenClient, process.env.AUT_SECRET, (error, decoded) => {
                if (error) {
                    return res.status(403).json({ message: 'Token es inválido o ha expirado' });
                } else {
                    // Decodificar el token y establecer req.usuario
                    req.usuario = decoded.user;
                    next();
                }
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error del servidor: ' + error.message });
    }
};
