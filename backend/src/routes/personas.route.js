import Router from 'express'
<<<<<<< HEAD
import { registrarAprendiz, actualizarPersona, eliminarPersona, listarPersonas, buscarPersonas, listarAprendices, listarInstructores, registrarInstructor, listarMunicipios, desactivarPersona, registrarUsuarios, cambiarInstructor, listarInstructoresLider, perfil, actualizarPerfil } from '../controllers/personas.controller.js'
=======
import { registrarAprendiz, actualizarPersona, eliminarPersona, listarPersonas, buscarPersonas, listarAprendices, listarInstructores, registrarInstructor, listarMunicipios, desactivarPersona, registrarUsuarios, cambiarInstructor } from '../controllers/personas.controller.js'
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
import { validarToken } from '../controllers/seguridad.controller.js'

const rutaPersona = Router()

<<<<<<< HEAD
rutaPersona.get('/listar',  validarToken, listarPersonas)
rutaPersona.get('/listarM', validarToken, listarMunicipios)
rutaPersona.get('/listarA', /* validarToken, */ listarAprendices)
rutaPersona.get('/listarI', validarToken, listarInstructores)
rutaPersona.get('/listarL', validarToken, listarInstructoresLider)
=======
rutaPersona.get('/listar',  /* validarToken, */ listarPersonas)
rutaPersona.get('/listarM', validarToken, listarMunicipios)
rutaPersona.get('/listarA', validarToken, listarAprendices)
rutaPersona.get('/listarI', /* validarToken,  */listarInstructores)
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
rutaPersona.get('/buscar/:id_persona', validarToken, buscarPersonas)
rutaPersona.post('/registrarA', registrarAprendiz)
rutaPersona.post('/registrarI', registrarInstructor)
rutaPersona.post('/registrares', registrarUsuarios);

<<<<<<< HEAD
/* Perfil */
rutaPersona.get('/perfil/:id_persona', perfil);
rutaPersona.put('/perfilActualizar/:id_persona', actualizarPerfil);


=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
rutaPersona.put('/actualizar/:id_persona', validarToken, actualizarPersona)
rutaPersona.delete('/eliminar/:id_persona', validarToken, eliminarPersona)
rutaPersona.post('/desactivar/:id_persona', validarToken, desactivarPersona)

//cambiar instructor
rutaPersona.put('/cambiarInstructor/:id_persona', validarToken, cambiarInstructor);

export default rutaPersona