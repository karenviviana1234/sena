import { Router } from "express";
import { registrarActividad, actualizarActividad, desactivarActividad, listarActividades, activarActividad } from "../controllers/actividades.controller.js";
import {validarToken} from './../controllers/seguridad.controller.js'
/* import { cargarImage } from "../controllers/actividades.controller.js"; */

const rutaActividades = Router()

<<<<<<< HEAD
rutaActividades.get('/listar/:id_persona', validarToken, listarActividades)
rutaActividades.post('/registrar', validarToken, registrarActividad)
rutaActividades.put('/actualizar/:id', validarToken, actualizarActividad)
rutaActividades.put('/desactivar/:id', validarToken, desactivarActividad)
=======
rutaActividades.get('/listar/:id_persona', /* validarToken,  */listarActividades)
rutaActividades.post('/registrar', validarToken, registrarActividad)
rutaActividades.put('/actualizar/:id', validarToken, actualizarActividad)
rutaActividades.put('/desactivar/:id',/*  validarToken, */ desactivarActividad)
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
rutaActividades.put('/activar/:id', validarToken, activarActividad)

export default rutaActividades;