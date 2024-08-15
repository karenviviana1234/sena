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

/* Registrar Instructores y Aprendices */
export const registrarPersona = async (req, res) => {
  try {
    const { identificacion, nombres, correo, telefono, password, rol, cargo, municipio } = req.body;

    /* Poner el campo de municipio obligatorio para el rol Aprendiz */
    if (rol === 'Aprendiz' && !municipio) {
      return res.status(400).json({
        status: 400,
        message: 'El campo municipio es obligatorio para el rol de aprendiz.'
      });
    }

    /* Enviar el campo de municipio "null" cuando el rol sea "Instructor" */
    const municipioValue = rol === 'Instructor' ? null : municipio;

    /* Encriptar la contraseña */
    const bcryptPassword = bcrypt.hashSync(password, 12);

    const query = `INSERT INTO personas (identificacion, nombres, correo, telefono, password, rol, cargo, municipio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [identificacion, nombres, correo, telefono, bcryptPassword, rol, cargo, municipioValue];

    const [result] = await pool.query(query, params);

    if (result.affectedRows > 0) {
      res.status(200).json({
        status: 200,
        message: 'Se registró con éxito el usuario ' + nombres
      });
    } else {
      res.status(403).json({
        status: 403,
        message: 'No se registró el usuario'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error del servidor: ' + error.message
    });
  }
};

/* registrar coordinador y administrativos */
export const registrarAdmin = async (req, res) => {
    try {
      const { identificacion, nombres, correo, telefono, password, rol, cargo } = req.body;
  
      const id_persona = req.usuario;
      
  
      // Determinar el rol a asignar y las restricciones de registro
      let userRole = rol;
  
      if (rol === 'Coordinador') {
        // Verificar si ya existe un coordinador en la base de datos
        const [coordinadorCheck] = await pool.query('SELECT COUNT(*) AS coordinadorCount FROM personas WHERE rol = "coordinador"');
        if (coordinadorCheck[0].coordinadorCount > 0) {
          return res.status(400).json({
            status: 400,
            message: 'Ya existe un coordinador registrado.'
          });
        }
      } else if (rol === 'Seguimiento') {
        // Verificar si ya existen dos personas con el rol de seguimiento en la base de datos
        const [seguimientoCheck] = await pool.query('SELECT COUNT(*) AS seguimientoCount FROM personas WHERE rol = "seguimiento"');
        if (seguimientoCheck[0].seguimientoCount >= 2) {
          return res.status(400).json({
            status: 400,
            message: 'Ya se han registrado dos personas con el rol de seguimiento.'
          });
        }
      }
  
      const estado = 'activo';
      const bcryptPassword = bcrypt.hashSync(password, 12);
  
      const query = `
        INSERT INTO personas (identificacion, nombres, correo, telefono, password, rol, cargo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
  
      const values = [identificacion, nombres, correo, telefono, bcryptPassword, rol, cargo];
  
      const [result] = await pool.query(query, values);
  
      return res.status(200).json({
        status: 200,
        message: 'Usuario registrado exitosamente',
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return res.status(500).json({ status: 500, message: 'Error del servidor', error: error.message });
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