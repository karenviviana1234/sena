import { Router } from "express";
import { registrarActividad, actualizarActividad, eliminarActividad, listarActividades } from "../controllers/actividades.controller.js";
import {validarToken} from './../controllers/seguridad.controller.js'
import { cargarImage } from "../controllers/actividades.controller.js";

const rutaActividades = Router()

rutaActividades.get('/listar', validarToken, listarActividades)
rutaActividades.post('/registrar', validarToken, cargarImage, registrarActividad)
rutaActividades.put('/actualizar/:id', validarToken, cargarImage, actualizarActividad)
rutaActividades.delete('/eliminar/:id', validarToken, eliminarActividad)

export default rutaActividades;