import { pool } from "../database/conexion.js";
import bcrypt from 'bcrypt'

export const listarPersonas = async(req, res) => {
    try {
        let sql = `SELECT * FROM personas`
        const [results] = await pool.query(sql)

        if(results.length>0){
            res.status(200).json(results)
        }else{
            res.status(404).json({
                message: 'No hay personas registradas'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const registrarPersona = async(req, res) => {
    try {
        const {identificacion, nombres, correo, telefono, password, rol, cargo, municipio} = req.body

        let sql = `INSERT INTO personas (identificacion, nombres, correo, telefono, password, rol, cargo, municipio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

        const bcryptPassword = bcrypt.hashSync(password, 12)

        const [rows] = await pool.query(sql, [identificacion, nombres, correo, telefono, bcryptPassword, rol, cargo, municipio])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Usuario registrado con éxito'
            })
        }else{
            res.status(403).json({
                message: 'Error al registrar el usuario'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const actualizarPersona = async(req, res) => {
    try {

        const {id} = req.params
        const {identificacion, nombres, correo, telefono, password, rol, cargo, municipio} = req.body

        let sql = `UPDATE personas SET 
                identificacion = ?,
                nombres =?,
                correo =?,
                telefono =?,
                password =?,
                rol =?,
                cargo =?,
                municipio =?
                
                WHERE id_persona = ?`

        const bcryptPassword = bcrypt.hashSync(password, 12)

        const [rows] = await pool.query(sql, [identificacion, nombres, correo, telefono, bcryptPassword, rol, cargo, municipio, id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Usuario actualizado con éxito'
            })
        }else{
            res.status(403).json({
                message: 'Error al actualizar el usuario'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const eliminarPersona = async(req, res) => {
    try {

        const {id} = req.params

        let sql = `DELETE from personas WHERE id_persona = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Usuario eliminado con éxito'
            })
        }else{
            res.status(403).json({
                message: 'Error al eliminar el usuario'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}
/* Buscar Persona */
export const buscarPersonaPorId = async (req, res) => {
    try {
        const { id_persona } = req.params;
        let sql = `SELECT * FROM personas WHERE id_persona = ?`;
        const [results] = await pool.query(sql, [id_persona]);

        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({
                message: 'Persona no encontrada'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};

