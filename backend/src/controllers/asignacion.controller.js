import { pool } from './../database/conexion.js'

export const listarasignaciones = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                p.id_asignacion, 
                p.fecha_inicio,
                p.fecha_fin,
                p.estado,
                u.instructor,
                a.id_productiva
            FROM 
                asignaciones AS p
            LEFT JOIN 
                vinculacion AS u ON p.instructor = u.instructor
            LEFT JOIN 
                productiva AS a ON p.productiva = a.id_productiva;
        `);


        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                status: 404,
                message: "No se encontraron asignaciones."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message || "Error interno del servidor."
        });
    }
};


export const registrarasignacion = async (req, res) => {
    try {
        const {
            fecha_inicio,
            fecha_fin,
            productiva,
            instructor,
            estado
        } = req.body;

        if (!estado) {
            return res.status(400).json({
                status: 400,
                message: "El campo 'estado' es obligatorio"
            });
        }

        const [instructorExist] = await pool.query(
            "SELECT * FROM vinculacion WHERE id_vinculacion = ?",
            [instructor]
        );
        if (instructorExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "El instructor no existe. Registre primero un Instructor."
            });
        }

        const [productivaExist] = await pool.query(
            "SELECT * FROM productiva WHERE id_productiva = ?",
            [productiva]
        );
        if (productivaExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No existe Productiva. Registre primero una Productiva."
            });
        }

        const [result] = await pool.query(
            "INSERT INTO asignaciones (fecha_inicio, fecha_fin, estado, productiva, instructor) VALUES (?,?,?,?,?)",
            [fecha_inicio, fecha_fin, estado, productiva, instructor]
        );

        if (result.affectedRows > 0) {
            // const [instructores] = await pool.query(
            //     "SELECT nombres FROM instructor WHERE id_instructor = ?",
            //     [instructor]
            // );
            // const [productivas] = await pool.query(
            //     "SELECT nombre FROM productiva WHERE id_productiva = ?",
            //     [productiva]
            // );

            // sendNotificationToEmployee(instructorExist[0].correo, `
            //     ¡Hola ${instructorExist[0].nombres}!
            //     ¡Buenas noticias! Se ha programado una nueva actividad para ti.
            //     Detalles de la actividad:
            //     - Fecha de inicio: ${fecha_inicio}
            //     - Fecha de finalización: ${fecha_fin}
            //     - Instructores: ${instructores[0].nombres}
            //     - Productiva: ${productivas[0].nombre}

            //     ¡Estamos seguros de que harás un trabajo excelente! ¡Sigue así!

            //     Para más información, ingresa a la App.
            // `);

            return res.status(200).json({
                status: 200,
                message: "Se registró con éxito."
            });
        } else {
            return res.status(403).json({
                status: 403,
                message: "No se pudo registrar la asignación."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message || "Error en el sistema"
        });
    }
};

export const actualizarasignacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin, productiva, instructor, estado } = req.body;

        // Verificar si el instructor existe
        const [instructorExist] = await pool.query(
            "SELECT * FROM vinculacion WHERE id_vinculacion = ?",
            [instructor]
        );
        if (instructorExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "El instructor no existe. Registre primero un Instructor."
            });
        }

        // Verificar si la productiva existe
        const [productivaExist] = await pool.query(
            "SELECT * FROM productiva WHERE id_productiva = ?",
            [productiva]
        );
        if (productivaExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No existe Productiva. Registre primero una Productiva."
            });
        }

        // Verificar si la asignación existe
        const [asignacionExist] = await pool.query(
            "SELECT * FROM asignaciones WHERE id_asignacion = ?",
            [id]
        );
        if (asignacionExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No se encontró la programación para actualizar."
            });
        }

        // Realizar la actualización
        const [result] = await pool.query(
            `UPDATE asignaciones 
             SET fecha_inicio = ?, fecha_fin = ?, productiva = ?, instructor = ?, estado = ? 
             WHERE id_asignacion = ?`,
            [fecha_inicio, fecha_fin, productiva, instructor, estado, id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 200,
                message: "Se actualizó con éxito."
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: "No se encontró la programación para actualizar o no está autorizado para realizar la actualización."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message || "Error interno del servidor"
        });
    }
};


export const buscarasignacion = async (req, res) => { 
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `SELECT 
                p.id_asignacion, 
                p.fecha_inicio AS asignacion_fecha_inicio,
                p.fecha_fin,
                p.estado,
                u.instructor,
                a.id_productiva
            FROM 
                asignaciones AS p
            LEFT JOIN 
                vinculacion AS u ON p.instructor = u.instructor
            LEFT JOIN 
                productiva AS a ON p.productiva = a.id_productiva
            WHERE 
                p.id_asignacion = ?`, // Elimina el punto y coma aquí
            [id]
        );

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: "No se encontraron resultados para la búsqueda",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message || "Error interno del servidor",
        });
    }
};