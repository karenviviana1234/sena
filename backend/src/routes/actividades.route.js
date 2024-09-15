import { Router } from "express";
import { registrarActividad, actualizarActividad, desactivarActividad, listarActividades, activarActividad } from "../controllers/actividades.controller.js";
import {validarToken} from './../controllers/seguridad.controller.js'
/* import { cargarImage } from "../controllers/actividades.controller.js"; */

const rutaActividades = Router()

rutaActividades.get('/listar/:id_persona', /* validarToken,  */listarActividades)
rutaActividades.post('/registrar', validarToken, registrarActividad)
rutaActividades.put('/actualizar/:id', validarToken, actualizarActividad)
rutaActividades.put('/desactivar/:id', validarToken, desactivarActividad)
rutaActividades.put('/activar/:id', validarToken, activarActividad)

export default rutaActividades;