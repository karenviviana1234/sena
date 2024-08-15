import { Router } from "express";
import { listarProductiva, registrarProductiva, actualizarProductiva, renunciarProductiva, terminarProductiva, productivaFiles } from "../controllers/productiva.controller.js";
import { validarToken } from "../controllers/seguridad.controller.js";

const rutaProductiva = Router();

rutaProductiva.get("/listar", validarToken, listarProductiva);
rutaProductiva.post("/registrar", validarToken, productivaFiles, registrarProductiva);
rutaProductiva.put("/actualizar/:id", validarToken, productivaFiles, actualizarProductiva);
rutaProductiva.put("/renunciar/:id", validarToken, renunciarProductiva);
rutaProductiva.put("/terminar/:id", validarToken, terminarProductiva);

export default rutaProductiva;