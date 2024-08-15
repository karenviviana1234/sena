import express from 'express'
import body_parser from 'body-parser'
import cors from 'cors'
import rutaPersona from './src/routes/personas.route.js'
import rutaActividades from './src/routes/actividades.route.js'
import rutaSeguimiento from './src/routes/seguimiento.route.js'
import rutaBitacoras from './src/routes/bitacoras.route.js'
import rutaFichas from './src/routes/fichas.route.js'
import rutaMatriculas from './src/routes/matriculas.route.js'
import rutaVinculaciones from './src/routes/vinculaciones.route.js'
import rutaProductiva from './src/routes/productiva.route.js'
import rutaEmpresas from './src/routes/empresas.route.js'
import rutaAmbientes from './src/routes/ambientes.route.js'
import rutaSeguridad from './src/routes/seguridad.route.js'

const servidor = express()

servidor.use(cors())

servidor.use(body_parser.json())
servidor.use(body_parser.urlencoded({ extended: false }))

/* Hola muchachones */

servidor.use('/', rutaSeguridad)
servidor.use('/personas', rutaPersona)
servidor.use('/actividades', rutaActividades)
servidor.use('/seguimientos', rutaSeguimiento)
servidor.use('/bitacoras', rutaBitacoras)
servidor.use('/fichas', rutaFichas)
servidor.use('/matriculas', rutaMatriculas)
servidor.use('/vinculacion', rutaVinculaciones)
servidor.use('/productiva', rutaProductiva)
servidor.use('/empresas', rutaEmpresas)
servidor.use('/ambientes', rutaAmbientes)

servidor.use(express.static('./public'))

servidor.listen(3000, () => {
    console.log('Servidor funcionando en el puerto 3000');
})