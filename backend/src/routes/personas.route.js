import Router from 'express'
import { registrarAprendiz, actualizarPersona, eliminarPersona, listarPersonas, buscarPersonas, listarAprendices, listarInstructores, registrarInstructor, listarMunicipios, desactivarPersona } from '../controllers/personas.controller.js'
import { validarToken } from '../controllers/seguridad.controller.js'

const rutaPersona = Router()

rutaPersona.get('/listar',  validarToken, listarPersonas)
rutaPersona.get('/listarM', validarToken, listarMunicipios)
rutaPersona.get('/listarA', validarToken, listarAprendices)
rutaPersona.get('/listarI', validarToken, listarInstructores)
rutaPersona.get('/buscar/:id_persona', validarToken, buscarPersonas)
rutaPersona.post('/registrarA', registrarAprendiz)
rutaPersona.post('/registrarI', registrarInstructor)
rutaPersona.put('/actualizar/:id_persona', validarToken, actualizarPersona)
rutaPersona.delete('/eliminar/:id_persona', validarToken, eliminarPersona)
rutaPersona.post('/desactivar/:id_persona', validarToken, desactivarPersona)
export default rutaPersona