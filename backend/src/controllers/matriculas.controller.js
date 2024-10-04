import { pool } from './../database/conexion.js'



export const listarAprendices = async (req, res) => {
    try {
        // Consulta SQL con LEFT JOIN para obtener los aprendices sin matrícula
        const sql = `
        SELECT p.*, m.nombre_mpio
        FROM personas p
        LEFT JOIN municipios m ON p.municipio = m.id_municipio
        LEFT JOIN matriculas ma ON p.id_persona = ma.aprendiz
        WHERE p.rol = 'Aprendiz' AND ma.id_matricula IS NULL
      `;
        const [results] = await pool.query(sql);

        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({
                message: 'No hay aprendices sin matrícula'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};

export const contarMatriculasPorEstado = async (req, res) => {
    try {
        // Consulta SQL para contar la cantidad de matrículas por estado
        const sql = `
            SELECT 
                estado, 
                COUNT(*) AS total
            FROM 
                matriculas
            GROUP BY 
                estado
        `;

        const [results] = await pool.query(sql);

        // Mapeo de los resultados a un formato más legible
        const conteoPorEstado = {
            Induccion: 0,
            Formacion: 0,
            Condicionado: 0,
            Cancelado: 0,
            RetiroVoluntario: 0,
            PorCertificar: 0,
            Certificado: 0
        };

        // Asignar los resultados de la consulta al conteo correspondiente
        results.forEach(row => {
            switch (row.estado) {
                case 'Inducción':
                    conteoPorEstado.Induccion = row.total;
                    break;
                case 'Formación':
                    conteoPorEstado.Formacion = row.total;
                    break;
                case 'Condicionado':
                    conteoPorEstado.Condicionado = row.total;
                    break;
                case 'Cancelado':
                    conteoPorEstado.Cancelado = row.total;
                    break;
                case 'Retiro Voluntario':
                    conteoPorEstado.RetiroVoluntario = row.total;
                    break;
                case 'Por Certificar':
                    conteoPorEstado.PorCertificar = row.total;
                    break;
                case 'Certificado':
                    conteoPorEstado.Certificado = row.total;
                    break;
                default:
                    break;
            }
        });

        res.status(200).json(conteoPorEstado);
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};


export const listarMatriculas = async (req, res) => {
    const { codigo } = req.params; // Obtener el parámetro id_ficha de la URL

    try {
        // Realizar un JOIN entre matriculas y personas para obtener el nombre del aprendiz,
        // y filtrar por id_ficha recibido en la ruta
        let sql = `
            SELECT m.id_matricula, p.nombres AS nombre_aprendiz, m.ficha, m.estado, 
                   m.pendiente_tecnicos, m.pendiente_transversales, m.pendiente_ingles
            FROM matriculas m
            JOIN personas p ON m.aprendiz = p.id_persona
            WHERE m.ficha = ?
            ORDER BY m.ficha
        `;

        const [results] = await pool.query(sql, [codigo]);

        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({
                message: 'No hay matrículas registradas para la ficha especificada',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error,
        });
    }
};



export const registrarMatriculas = async (req, res) => {
    try {
        const { ficha, aprendiz, pendientes_tecnicos, pendientes_transversales, pendiente_ingles, estado } = req.body;

        // Verificar si la matrícula ya existe
        const [existing] = await pool.query('SELECT * FROM matriculas WHERE ficha = ? AND aprendiz = ?', [ficha, aprendiz]);
        if (existing.length > 0) {
            return res.status(409).json({
                message: 'La matrícula ya existe'
            });
        }

        // Asignar 0 a los campos pendientes si son nulos
        const tecnicos = pendientes_tecnicos ?? 0;
        const transversales = pendientes_transversales ?? 0;
        const ingles = pendiente_ingles ?? 0;

        // Asegúrate de que el valor de estado sea una cadena y esté en el formato esperado
        /*  const estadoValido = ['Inducción', 'Formación', 'Condicionado', 'Cancelado', 'Retiro Voluntario', 'Por Certificar', 'Certificado'];
         if (!estadoValido.includes(estado)) {
             return res.status(400).json({
                 message: 'Estado no válido'
             });
         }
  */
        // Inserción en la base de datos
        const sql = ` INSERT INTO matriculas (ficha, aprendiz, estado, pendiente_tecnicos, pendiente_transversales, pendiente_ingles) VALUES (?, ?, ?, ?, ?, ?)`;

        const [rows] = await pool.query(sql, [ficha, aprendiz, estado, tecnicos, transversales, ingles]);

        if (rows.affectedRows > 0) {
            res.status(201).json({
                message: 'Matrícula registrada correctamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al registrar la matrícula'
            });
        }

    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};


export const actualizarMatriculas = async (req, res) => {
    try {
        const { id } = req.params;
        const { ficha, estado, pendientes_tecnicos, pendientes_transversales, pendiente_ingles } = req.body;

        // Asegúrate de que el valor de estado sea una cadena y esté en el formato esperado
        /*  const estadoValido = ['Inducción', 'Formación', 'Condicionado', 'Cancelado', 'Retiro Voluntario', 'Por Certificar', 'Certificado'];
         if (estado && !estadoValido.includes(estado)) {
             return res.status(400).json({
                 message: 'Estado no válido'
             });
         } */

        let sql = `UPDATE matriculas SET
                    ficha = ?,
                    estado = ?,
                    pendiente_tecnicos = ?,
                    pendiente_transversales = ?,
                    pendiente_ingles = ?
                    WHERE id_matricula = ?`;

        const [rows] = await pool.query(sql, [ficha, estado, pendientes_tecnicos, pendientes_transversales, pendiente_ingles, id]);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Matrícula actualizada correctamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al actualizar la matrícula'
            });
        }

    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};


export const formacionMatricula = async (req, res) => {
    try {
        const { id } = req.params

        let sql = ` UPDATE matriculas SET estado = 2 WHERE id_matricula = ?`;

        const [rows] = await pool.query(sql, [id])

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'La formación se ha solicitado correctamente'
            })
        } else {
            res.status(403).json({
                message: 'Error al solicitar la formación'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const condicionadaMatricula = async (req, res) => {
    try {
        const { id } = req.params

        let sql = `UPDATE matriculas SET estado = 3 WHERE id_matricula = ?`;

        const [rows] = await pool.query(sql, [id])

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Matricula condicionada exitosamente'
            })
        } else {
            res.status(403).json({
                message: 'Error al condicionar la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const canceladaMatricula = async (req, res) => {
    try {
        const { id_matricula } = req.params;

        // Desactivar la comprobación de claves foráneas
        await pool.query(`SET FOREIGN_KEY_CHECKS = 0`);

        // Eliminar los registros relacionados en la tabla bitacoras
        let deleteBitacorasSql = `
            DELETE b FROM bitacoras b
            JOIN seguimientos s ON b.seguimiento = s.id_seguimiento
            JOIN productivas p ON s.productiva = p.id_productiva
            WHERE p.matricula = ?
        `;
        await pool.query(deleteBitacorasSql, [id_matricula]);

        // Eliminar los registros relacionados en la tabla seguimientos
        let deleteSeguimientosSql = `
            DELETE s FROM seguimientos s
            JOIN productivas p ON s.productiva = p.id_productiva
            WHERE p.matricula = ?
        `;
        await pool.query(deleteSeguimientosSql, [id_matricula]);

        // Eliminar los registros relacionados en la tabla productivas
        let deleteProductivasSql = `DELETE FROM productivas WHERE matricula = ?`;
        await pool.query(deleteProductivasSql, [id_matricula]);

        // Eliminar la matrícula
        let deleteMatriculaSql = `DELETE FROM matriculas WHERE id_matricula = ?`;
        const [rows] = await pool.query(deleteMatriculaSql, [id_matricula]);

        // Reactivar la comprobación de claves foráneas
        await pool.query(`SET FOREIGN_KEY_CHECKS = 1`);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Matrícula y registros relacionados eliminados exitosamente'
            });
        } else {
            res.status(404).json({
                message: 'Matrícula no encontrada'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};



export const retiroMatricula = async (req, res) => {
    try {
        const { id } = req.params

        let sql = `UPDATE matriculas SET estado = 5 WHERE id_matricula = ?`;

        const [rows] = await pool.query(sql, [id])

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Matricula retirada exitosamente'
            })
        } else {
            res.status(403).json({
                message: 'Error al retirar la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const porCertificarMatricula = async (req, res) => {
    try {
        const { id } = req.params

        let sql = `UPDATE matriculas SET estado = 6 WHERE id_matricula = ?`;

        const [rows] = await pool.query(sql, [id])

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Matricula por certificar exitosamente'
            })
        } else {
            res.status(403).json({
                message: 'Error al cambiar estado de la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const certificadaMatricula = async (req, res) => {
    try {
        const { id } = req.params

        let sql = `UPDATE matriculas SET estado = 7 WHERE id_matricula = ?`;

        const [rows] = await pool.query(sql, [id])

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Matricula certificada exitosamente'
            })
        } else {
            res.status(403).json({
                message: 'Error al certificar la matricula'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}


















export const listarSeguimientoAprendices = async (req, res) => {
    const { identificacion, rol } = req.user; // Obtiene la información del usuario
    try {
        let sql;
        let params = [];

        if (rol === 'Coordinador' || rol === 'Seguimiento') {
            // Si es Coordinador o Seguimiento, obtiene todos los seguimientos
            sql = `
                SELECT
                    p.identificacion AS identificacion,
                    p.nombres AS nombres,
                    p.correo AS correo,  -- Agrega el correo del aprendiz
                    f.codigo AS codigo,
                    prg.sigla AS sigla,
                    e.razon_social AS razon_social,
                    s.id_seguimiento AS id_seguimiento,
                    s.seguimiento AS seguimiento,
                    s.fecha AS fecha,
                    s.estado AS estado,
                    COUNT(b.id_bitacora) AS total_bitacoras,
                    SUM(CASE WHEN b.pdf IS NOT NULL THEN 1 ELSE 0 END) AS bitacoras_con_pdf,
                    (SUM(CASE WHEN b.pdf IS NOT NULL THEN 1 ELSE 0 END) / 12) * 100 AS porcentaje,
                    instr.identificacion AS instructor_identificacion
                FROM
                    seguimientos s
                    LEFT JOIN productivas pr ON s.productiva = pr.id_productiva
                    LEFT JOIN matriculas m ON pr.matricula = m.id_matricula
                    LEFT JOIN personas p ON m.aprendiz = p.id_persona
                    LEFT JOIN empresas e ON pr.empresa = e.id_empresa
                    LEFT JOIN fichas f ON m.ficha = f.codigo
                    LEFT JOIN programas prg ON f.programa = prg.id_programa
                    LEFT JOIN bitacoras b ON b.seguimiento = s.id_seguimiento
                    LEFT JOIN asignaciones asg ON asg.productiva = pr.id_productiva
                    LEFT JOIN actividades a ON asg.actividad = a.id_actividad
                    LEFT JOIN personas instr ON a.instructor = instr.id_persona
                GROUP BY
                    s.id_seguimiento, p.identificacion, p.correo, s.seguimiento, s.fecha, f.codigo, prg.sigla, e.razon_social, s.estado, instr.identificacion
                ORDER BY
                    p.identificacion, s.seguimiento;
            `;
        } else if (rol === 'Instructor') {
            // Si es instructor, filtrar los seguimientos donde es el instructor asignado
            sql = `
                SELECT
                    p.identificacion AS identificacion,
                    p.nombres AS nombres,
                    p.correo AS correo,  -- Agrega el correo del aprendiz
                    f.codigo AS codigo,
                    prg.sigla AS sigla,
                    e.razon_social AS razon_social,
                    s.id_seguimiento AS id_seguimiento,
                    s.seguimiento AS seguimiento,
                    s.fecha AS fecha,
                    s.estado AS estado,
                    COUNT(b.id_bitacora) AS total_bitacoras,
                    SUM(CASE WHEN b.pdf IS NOT NULL THEN 1 ELSE 0 END) AS bitacoras_con_pdf,
                    (SUM(CASE WHEN b.pdf IS NOT NULL THEN 1 ELSE 0 END) / 12) * 100 AS porcentaje,
                    instr.identificacion AS instructor_identificacion
                FROM
                    seguimientos s
                    LEFT JOIN productivas pr ON s.productiva = pr.id_productiva
                    LEFT JOIN matriculas m ON pr.matricula = m.id_matricula
                    LEFT JOIN personas p ON m.aprendiz = p.id_persona
                    LEFT JOIN empresas e ON pr.empresa = e.id_empresa
                    LEFT JOIN fichas f ON m.ficha = f.codigo
                    LEFT JOIN programas prg ON f.programa = prg.id_programa
                    LEFT JOIN bitacoras b ON b.seguimiento = s.id_seguimiento
                    LEFT JOIN asignaciones asg ON asg.productiva = pr.id_productiva
                    LEFT JOIN actividades a ON asg.actividad = a.id_actividad
                    LEFT JOIN personas instr ON a.instructor = instr.id_persona
                WHERE
                    instr.identificacion = ?  -- Filtrar por la identificación del instructor
                GROUP BY
                    s.id_seguimiento, p.identificacion, p.correo, s.seguimiento, s.fecha, f.codigo, prg.sigla, e.razon_social, s.estado, instr.identificacion
                ORDER BY
                    p.identificacion, s.seguimiento;
            `;
            params.push(identificacion);  // Asignar la identificación del instructor
        } else if (rol === 'Aprendiz') {
            // Si es aprendiz, filtrar los seguimientos por la identificación del aprendiz
            sql = `
                SELECT
                    p.identificacion AS identificacion,
                    p.nombres AS nombres,
                    p.correo AS correo,  -- Agrega el correo del aprendiz
                    f.codigo AS codigo,
                    prg.sigla AS sigla,
                    e.razon_social AS razon_social,
                    s.id_seguimiento AS id_seguimiento,
                    s.seguimiento AS seguimiento,
                    s.fecha AS fecha,
                    s.estado AS estado,
                    COUNT(b.id_bitacora) AS total_bitacoras,
                    SUM(CASE WHEN b.pdf IS NOT NULL THEN 1 ELSE 0 END) AS bitacoras_con_pdf,
                    (SUM(CASE WHEN b.pdf IS NOT NULL THEN 1 ELSE 0 END) / 12) * 100 AS porcentaje,
                    instr.identificacion AS instructor_identificacion
                FROM
                    seguimientos s
                    LEFT JOIN productivas pr ON s.productiva = pr.id_productiva
                    LEFT JOIN matriculas m ON pr.matricula = m.id_matricula
                    LEFT JOIN personas p ON m.aprendiz = p.id_persona
                    LEFT JOIN empresas e ON pr.empresa = e.id_empresa
                    LEFT JOIN fichas f ON m.ficha = f.codigo
                    LEFT JOIN programas prg ON f.programa = prg.id_programa
                    LEFT JOIN bitacoras b ON b.seguimiento = s.id_seguimiento
                    LEFT JOIN asignaciones asg ON asg.productiva = pr.id_productiva
                    LEFT JOIN actividades a ON asg.actividad = a.id_actividad
                    LEFT JOIN personas instr ON a.instructor = instr.id_persona
                WHERE
                    p.identificacion = ?  -- Filtrar por la identificación del aprendiz
                GROUP BY
                    s.id_seguimiento, p.identificacion, p.correo, s.seguimiento, s.fecha, f.codigo, prg.sigla, e.razon_social, s.estado, instr.identificacion
                ORDER BY
                    p.identificacion, s.seguimiento;
            `;
            params.push(identificacion);  // Asignar la identificación del aprendiz
        }

        const [result] = await pool.query(sql, params); // Ejecutar la consulta con los parámetros correspondientes

        if (result.length > 0) {
            const personasMap = {};

            result.forEach(row => {
                if (!personasMap[row.identificacion]) {
                    personasMap[row.identificacion] = {
                        identificacion: row.identificacion,
                        nombres: row.nombres,
                        correo: row.correo,  // Agrega el correo al objeto
                        codigo: row.codigo,
                        sigla: row.sigla,
                        razon_social: row.razon_social,
                        id_seguimiento1: null,
                        id_seguimiento2: null,
                        id_seguimiento3: null,
                        seguimiento1: null,
                        seguimiento2: null,
                        seguimiento3: null,
                        estado1: null,
                        estado2: null,
                        estado3: null,
                        porcentaje: 0,
                        instructor_identificacion: row.instructor_identificacion
                    };
                }

                // Asignar seguimiento basado en el número de seguimiento
                if (row.seguimiento === '1') {
                    personasMap[row.identificacion].id_seguimiento1 = row.id_seguimiento;
                    personasMap[row.identificacion].seguimiento1 = row.fecha;
                    personasMap[row.identificacion].estado1 = row.estado;
                } else if (row.seguimiento === '2') {
                    personasMap[row.identificacion].id_seguimiento2 = row.id_seguimiento;
                    personasMap[row.identificacion].seguimiento2 = row.fecha;
                    personasMap[row.identificacion].estado2 = row.estado;
                } else if (row.seguimiento === '3') {
                    personasMap[row.identificacion].id_seguimiento3 = row.id_seguimiento;
                    personasMap[row.identificacion].seguimiento3 = row.fecha;
                    personasMap[row.identificacion].estado3 = row.estado;
                }

                personasMap[row.identificacion].porcentaje += (row.bitacoras_con_pdf / 12) * 100;
            });

            Object.values(personasMap).forEach(aprendiz => {
                aprendiz.porcentaje = Math.round(aprendiz.porcentaje);
            });

            return res.status(200).json(Object.values(personasMap));
        } else {
            return res.status(404).json({ message: 'No se encontraron datos.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor.' });
    }
};