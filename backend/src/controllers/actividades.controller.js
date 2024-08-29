import { pool } from './../database/conexion.js'

export const registrarActividad = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, instructor, horario, productiva, tipo, solicitud } = req.body;

        let sql = `INSERT INTO actividades (estado, fecha_inicio, fecha_fin, instructor, horario, productiva, tipo, solicitud) VALUES (1, ?, ?, ?, ?, ?, ?, ?)`;

        const [rows] = await pool.query(sql, [ fecha_inicio, fecha_fin, instructor, horario, productiva, tipo, solicitud]);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Actividad registrada exitosamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al registrar la actividad'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};


export const listarActividades = async (req, res) => {
    try {
        let sql = `SELECT * FROM actividades`;

        const [results] = await pool.query(sql);
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({
                message: 'No hay actividades registradas'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};

export const actualizarActividad = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, fecha_inicio, fecha_fin, instructor, horario, productiva, tipo, solicitud } = req.body;

        const [anterior] = await pool.query(`SELECT * FROM actividades WHERE id_actividad = ?`, [id]);

        let sql = `UPDATE actividades SET
                    estado = ?,
                    fecha_inicio = ?,
                    fecha_fin = ?,
                    instructor = ?,
                    horario = ?,
                    productiva = ?,
                    tipo = ?,
                    solicitud = ?
                    WHERE id_actividad = ?`;

        const params = [
            estado || anterior[0].estado,
            fecha_inicio || anterior[0].fecha_inicio,
            fecha_fin || anterior[0].fecha_fin,
            instructor || anterior[0].instructor,
            horario || anterior[0].horario,
            productiva || anterior[0].productiva,
            tipo || anterior[0].tipo,
            solicitud || anterior[0].solicitud,
            id
        ];

        const [rows] = await pool.query(sql, params);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Actividad actualizada exitosamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al actualizar la actividad'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};

export const eliminarActividad = async (req, res) => {
    try {
        const { id } = req.params;

        let sql = `DELETE FROM actividades WHERE id_actividad = ?`;

        const [rows] = await pool.query(sql, [id]);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Actividad eliminada exitosamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al eliminar la actividad'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};
