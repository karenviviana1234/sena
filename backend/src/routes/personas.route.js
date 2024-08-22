import Router from 'express'
import { registrarPersona, actualizarPersona, eliminarPersona, listarPersonas, registrarAdmin, buscarPersonas, listarAprendices, listarInstructores } from '../controllers/personas.controller.js'
import { validarToken } from '../controllers/seguridad.controller.js'

const rutaPersona = Router()

rutaPersona.get('/listar', /* validarToken, */ listarPersonas)
rutaPersona.get('/listarA', /* validarToken, */ listarAprendices)
rutaPersona.get('/listarI', /* validarToken, */ listarInstructores)
rutaPersona.get('/buscar/:id_persona', validarToken, buscarPersonas)
rutaPersona.post('/registrar', registrarPersona)
rutaPersona.post('/registrarAdmins', registrarAdmin)
rutaPersona.put('/actualizar/:id_persona', validarToken, actualizarPersona)
rutaPersona.delete('/eliminar/:id_persona', validarToken, eliminarPersona)

export default rutaPersona