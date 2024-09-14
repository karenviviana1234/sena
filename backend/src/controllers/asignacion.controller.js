import { pool } from './../database/conexion.js'

export const listarasignaciones = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                p.id_asignacion, 
                a.id_productiva AS productiva, 
                act.id_actividad AS actividad,
                persA.nombres AS nombre_aprendiz,
                persI.nombres AS nombre_instructor,
                emp.razon_social AS nombre_empresa
            FROM 
                asignaciones AS p
            LEFT JOIN 
                productivas AS a ON p.productiva = a.id_productiva
            LEFT JOIN 
                actividades AS act ON p.actividad = act.id_actividad
            LEFT JOIN 
                matriculas AS mat ON a.aprendiz = mat.aprendiz
            LEFT JOIN 
                personas AS persA ON mat.aprendiz = persA.id_persona
            LEFT JOIN 
                personas AS persI ON act.instructor = persI.id_persona
            LEFT JOIN 
                empresas AS emp ON a.empresa = emp.id_empresa;
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
        const { productiva, actividad } = req.body;

        if (!actividad || !productiva) {
            return res.status(400).json({
                status: 400,
                message: "Datos incompletos. Por favor, envíe actividad y productiva."
            });
        }

        console.log('Valores recibidos:', { productiva, actividad });

        const [actividadExist] = await pool.query(
            "SELECT * FROM actividades WHERE id_actividad = ? AND estado = 'Activo'",
            [actividad]
        );

        if (actividadExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "La actividad no existe o no está activa."
            });
        }

        const [productivaExist] = await pool.query(
            "SELECT * FROM productivas WHERE id_productiva = ?",
            [productiva]
        );

        if (productivaExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No existe Productiva. Registre primero una Productiva."
            });
        }

        const [result] = await pool.query(
            "INSERT INTO asignaciones (productiva, actividad) VALUES (?, ?)",
            [productiva, actividad]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 200,
                message: "Asignación registrada con éxito."
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
        const { productiva, actividad } = req.body;

        // Verificar si el instructor existe
        const [actividadExist] = await pool.query(
            "SELECT * FROM actividades WHERE id_actividad = ?",
            [actividad]
        );
        if (actividadExist.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "La actividad no existe. Registre primero una actividad."
            });
        }

        // Verificar si la productiva existe
        const [productivaExist] = await pool.query(
            "SELECT * FROM productivas WHERE id_productiva = ?", 
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
             SET productiva = ?, actividad = ?
             WHERE id_asignacion = ?`,
            [productiva, actividad, id]
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
                a.id_productiva AS productiva, 
                act.id_actividad AS actividad
            FROM 
                asignaciones AS p
            LEFT JOIN 
                productiva AS a ON p.productiva = a.id_productiva
            LEFT JOIN 
                actividades AS act ON p.actividad = act.id_actividad
            WHERE 
                p.id_asignacion = ?`,
            [id]
        );

        if (result.length > 0) {
            res.status(200).json(result[0]); // Devuelve solo el primer resultado
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
