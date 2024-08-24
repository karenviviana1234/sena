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



export const listarInstructores = async (req, res) => {
  try {
    // Asegúrate de tener la tabla 'personas' con la columna 'rol'
    const sql = `SELECT * FROM personas WHERE rol = 'Instructor'`;
    const [results] = await pool.query(sql);

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({
        message: 'No hay instructores registrados',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error del servidor: ${error.message}`,
    });
  }
};


export const listarAprendices = async (req, res) => {
  try {
    // Consulta SQL con JOIN para obtener el nombre del municipio
    const sql = `
      SELECT p.*, m.nombre_mpio
      FROM personas p
      LEFT JOIN municipios m ON p.municipio = m.id_municipio
      WHERE p.rol = 'Aprendiz'
    `;
    const [results] = await pool.query(sql);

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({
        message: 'No hay personas con el rol de aprendiz'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error del servidor: ' + error.message
    });
  }
};

export const listarMunicipios = async(req, res) => {
  try {
      let sql = `SELECT * FROM municipios`
      const [results] = await pool.query(sql)

      if(results.length>0){
          res.status(200).json(results)
      }else{
          res.status(404).json({
              message: 'No hay municipios registrados'
          })
      }
  } catch (error) {
      res.status(500).json({
          message: 'Error del servidor' + error
      })
  }
}



/* Registrar Aprendices */
export const registrarAprendiz = async (req, res) => {
  try {
    const { identificacion, nombres, correo, telefono, password, municipio } = req.body;

    if (!municipio) {
      return res.status(400).json({
        status: 400,
        message: 'El campo municipio es obligatorio para el rol de aprendiz.'
      });
    }

    const bcryptPassword = bcrypt.hashSync(password, 12);

   /* rol y cargo como 'Aprendiz' */
    const query = `INSERT INTO personas (identificacion, nombres, correo, telefono, password, rol, cargo, municipio) VALUES (?, ?, ?, ?, ?, 'Aprendiz', 'Aprendiz', ?)`;
    const params = [identificacion, nombres, correo, telefono, bcryptPassword, municipio];

    const [result] = await pool.query(query, params);

    if (result.affectedRows > 0) {
      res.status(200).json({
        status: 200,
        message: 'Se registró con éxito el aprendiz ' + nombres
      });
    } else {
      res.status(403).json({
        status: 403,
        message: 'No se registró el aprendiz'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error del servidor: ' + error.message
    });
  }
};

/* Registrar Instructores */
// personas.controller.js
export const registrarInstructor = async (req, res) => {
  try {
      const { identificacion, nombres, correo, telefono, password, rol, cargo, municipio } = req.body;
      
      // Verifica si los campos necesarios están presentes
      if (!identificacion || !nombres || !correo || !telefono || !password || !rol || !cargo || !municipio) {
          return res.status(400).json({ message: 'Todos los campos son necesarios' });
      }

      // Inserción en la base de datos (ejemplo con pseudo-código)
      const nuevoInstructor = await db.query(
          'INSERT INTO personas (identificacion, nombres, correo, telefono, password, rol, cargo, municipio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [identificacion, nombres, correo, telefono, password, rol, cargo, municipio]
      );

      res.status(201).json({ message: 'Instructor registrado exitosamente', data: nuevoInstructor });
  } catch (error) {
      console.error('Error al registrar instructor:', error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
};


/* Actualizar Personas */
export const actualizarPersona = async (req, res) => {
    try {
      const { id_persona } = req.params;
      const { identificacion, nombres, correo, telefono, password, rol, cargo, municipio } = req.body;
  
      if (!identificacion && !nombres && !correo && !telefono && !password && !rol && !cargo && !municipio) {
        return res.status(400).json({
          message: 'Al menos uno de los campos (identificacion, nombres, correo, telefono, password, rol, cargo, municipio) debe estar presente en la solicitud para realizar la actualización.'
        });
      }
  
      const [oldPersona] = await pool.query("SELECT * FROM personas WHERE id_persona = ?", [id_persona]);
      const bcryptPassword = bcrypt.hashSync(password, 12);
  
      if (oldPersona.length === 0) {
        return res.status(404).json({
          status: 404,
          message: 'Usuario no encontrado',
        });
      }
  
      const updatedUsuario = {
        identificacion: identificacion || oldPersona[0].identificacion,
        nombres: nombres || oldPersona[0].nombres,
        correo: correo || oldPersona[0].correo,
        telefono: telefono || oldPersona[0].telefono,
        password: bcryptPassword,
        rol: rol || oldPersona[0].rol,
        cargo: cargo || oldPersona[0].cargo,
        municipio: municipio || oldPersona[0].municipio,
      };
  
      const [result] = await pool.query(
        `UPDATE personas SET 
          identificacion = ?, 
          nombres = ?, 
          correo = ?, 
          telefono = ?, 
          password = ?, 
          rol = ?, 
          cargo = ?, 
          municipio = ? 
         WHERE id_persona = ?`,
        [
          updatedUsuario.identificacion, 
          updatedUsuario.nombres, 
          updatedUsuario.correo, 
          updatedUsuario.telefono, 
          updatedUsuario.password, 
          updatedUsuario.rol, 
          updatedUsuario.cargo, 
          updatedUsuario.municipio, 
          id_persona
        ]
      );
  
      if (result.affectedRows > 0) {
        res.status(200).json({
          status: 200,
          message: "El usuario ha sido actualizado.",
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "No se pudo actualizar el usuario, inténtalo de nuevo.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error en el sistema: " + error.message,
      });
    }
  };

/* Buscar Personas */
export const buscarPersonas = async (req, res) => {
    try {
      const { id_persona } = req.params;
  
      const [result] = await pool.query("SELECT * FROM personas WHERE id_persona=?", [id_persona]);
  
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          status: 404,
          message: "No se encontró el Usuario"
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Error en el sistema: ' + error
      });
    }
  };
  

/* Eliminar Persona */
export const eliminarPersona = async(req, res) => {
    try {

        const {id_persona} = req.params

        let sql = `DELETE from personas WHERE id_persona = ?`

        const [rows] = await pool.query(sql, [id_persona])

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