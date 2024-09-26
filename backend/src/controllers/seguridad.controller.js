import { pool } from "../database/conexion.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const validar = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Consulta parametrizada para evitar inyecciones SQL
        const [rows] = await pool.query('SELECT * FROM personas WHERE correo = ?', [correo]);

        if (rows.length > 0) {
            const user = rows[0];

            // Comparar la contraseña ingresada con la contraseña encriptada en la base de datos
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: "Credenciales incorrectas" });
            }

<<<<<<< HEAD
            // Incluir la identificación del usuario y el rol en el token JWT
            const token = Jwt.sign({ userId: user.id_persona, rol: user.rol, cargo: user.cargo, identificacion: user.identificacion }, process.env.AUT_SECRET, { expiresIn: process.env.AUT_EXPIRE });
            
            return res.status(200).json({ user: { id_persona: user.id_persona, nombres: user.nombres, correo: user.correo, cargo: user.cargo, rol: user.rol, cargo:user.cargo, identificacion: user.identificacion  }, token, message: 'Inicio de sesión exitoso' });
=======
            // Incluir identificación, rol y cargo en el token JWT
            const token = Jwt.sign(
                {
                    userId: user.id_persona,
                    identificacion: user.identificacion,  // Añadir identificación
                    rol: user.rol,                       // Añadir rol
                    cargo: user.cargo                    // Añadir cargo
                },
                process.env.AUT_SECRET, 
                { expiresIn: process.env.AUT_EXPIRE }
            );
            
            return res.status(200).json({
                user: {
                    id_persona: user.id_persona,
                    nombres: user.nombres,
                    correo: user.correo,
                    cargo: user.cargo,
                    rol: user.rol,
                    identificacion: user.identificacion
                },
                token,
                message: 'Inicio de sesión exitoso'
            });
>>>>>>> 76bd2fe29f0bee2650258bd0fcedd80847282bd6
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error del servidor: ' + error.message });
    }
};

// Verificar token
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
<<<<<<< HEAD
                    // Decodificar el token y establecer req.usuario
                    req.usuario = decoded; // Ahora incluye el rol
=======
                    // Decodificar y guardar toda la información del usuario en req.user
                    req.user = {
                        userId: decoded.userId,
                        identificacion: decoded.identificacion,
                        rol: decoded.rol,
                        cargo: decoded.cargo
                    };
>>>>>>> 76bd2fe29f0bee2650258bd0fcedd80847282bd6
                    next();
                }
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error del servidor: ' + error.message });
    }
};
