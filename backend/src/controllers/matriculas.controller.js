import { pool } from './../database/conexion.js'

export const listarMatriculas = async (req, res) => {
    try {
        let sql = `SELECT * FROM matriculas`

        const [results] = await pool.query(sql)

        if(results.length>0){
            res.status(200).json(results)
        }else{
            res.status(404).json({
                message: 'No hay matriculas registradas'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const registrarMatriculas = async (req, res) => {
    try {
        const { ficha, aprendiz, pendientes_tecnicos, pendientes_transversales, pendiente_ingles } = req.body

        let sql = `INSERT INTO matriculas (ficha, aprendiz, estado, pendiente_tecnicos, pendiente_transversales, pendiente_ingles) VALUES (?, ?, 1, ?, ?, ?)`

        const [rows] = await pool.query(sql, [ficha, aprendiz, pendientes_tecnicos, pendientes_transversales, pendiente_ingles])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Matricula registrada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al registrar la matricula'
            })
        }

    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const actualizarMatriculas = async (req, res) => {
    try {
        const {id} = req.params

        const { ficha, aprendiz, pendientes_tecnicos, pendientes_transversales, pendiente_ingles } = req.body

        let sql = `UPDATE matriculas SET
                    ficha = ?,
                    aprendiz =?,
                    pendiente_tecnicos =?,
                    pendiente_transversales =?,
                    pendiente_ingles =?
                    
                    WHERE id_matricula = ?`

        const [rows] = await pool.query(sql, [ficha, aprendiz, pendientes_tecnicos, pendientes_transversales, pendiente_ingles, id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Matricula actualizada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al actualizar la matricula'
            })
        }

    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const formacionMatricula = async (req, res) => {
    try {
        const {id} = req.params

        let sql = `UPDATE matriculas SET estado = 2 WHERE id_matricula = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'La formación se ha solicitado correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al solicitar la formación'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor'+ error
        })
    }
}

export const condicionadaMatricula = async (req, res) => {
    try {
        const {id} = req.params

        let sql = `UPDATE matriculas SET estado = 3 WHERE id_matricula = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Matricula condicionada exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al condicionar la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor'+ error
        })
    }
}

export const canceladaMatricula = async (req, res) => {
    try {
        const {id} = req.params

        let sql = `UPDATE matriculas SET estado = 4 WHERE id_matricula = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Matricula cancelada exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al cancelar la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor'+ error
        })
    }
}

export const retiroMatricula = async (req, res) => {
    try {
        const {id} = req.params

        let sql = `UPDATE matriculas SET estado = 5 WHERE id_matricula = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Matricula retirada exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al retirar la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor'+ error
        })
    }
}

export const porCertificarMatricula = async (req, res) => {
    try {
        const {id} = req.params

        let sql = `UPDATE matriculas SET estado = 6 WHERE id_matricula = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Matricula por certificar exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al cambiar estado de la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor'+ error
        })
    }
}

export const certificadaMatricula = async (req, res) => {
    try {
        const {id} = req.params

        let sql = `UPDATE matriculas SET estado = 7 WHERE id_matricula = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Matricula certificada exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al certificar la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor'+ error
        })
    }
}