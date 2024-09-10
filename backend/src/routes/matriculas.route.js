import Router from 'express'
import { listarMatriculas, registrarMatriculas, actualizarMatriculas, formacionMatricula, condicionadaMatricula, canceladaMatricula, retiroMatricula, porCertificarMatricula, certificadaMatricula, listarAprendices } from '../controllers/matriculas.controller.js'
import { validarToken } from '../controllers/seguridad.controller.js'

const rutaMatriculas = Router()

rutaMatriculas.get('/listar/:codigo', validarToken, listarMatriculas)
rutaMatriculas.get('/listarA', validarToken, listarAprendices)
rutaMatriculas.post('/registrar', validarToken, registrarMatriculas)
rutaMatriculas.put('/actualizar/:id', validarToken, actualizarMatriculas)
rutaMatriculas.put('/formacion/:id', validarToken, formacionMatricula)
rutaMatriculas.put('/condicionada/:id', validarToken, condicionadaMatricula)
rutaMatriculas.put('/cancelada/:id', validarToken, canceladaMatricula)
rutaMatriculas.put('/retiro/:id', validarToken, retiroMatricula)
rutaMatriculas.put('/porCertificar/:id', validarToken, porCertificarMatricula)
rutaMatriculas.put('/certificada/:id', validarToken, certificadaMatricula)

export default rutaMatriculas