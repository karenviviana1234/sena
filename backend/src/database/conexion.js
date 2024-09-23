import { createPool } from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config({path:'./src/env/.env'})

export const pool = createPool({
    host:process.env.DB_HOST, 
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    database:process.env.DB_DATABASE
})
//Validar conexión a la base de datos
pool.getConnection().then(connect => {
    console.log("Conexión a base de datos exitosa.");
    connect.release();
})
    .catch(error => {
        console.error("Conexion a base de datos fallida. " + error);
}) 