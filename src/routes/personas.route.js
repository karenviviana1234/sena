import Router from 'express'
import { registrarPersona, actualizarPersona, eliminarPersona, listarPersonas } from '../controllers/personas.controller.js'
import { validarToken } from '../controllers/seguridad.controller.js'

const rutaPersona = Router()

rutaPersona.get('/listar', validarToken, listarPersonas)
rutaPersona.post('/registrar', registrarPersona)
rutaPersona.put('/actualizar/:id', validarToken, actualizarPersona)
rutaPersona.delete('/eliminar/:id', validarToken, eliminarPersona)

export default rutaPersona