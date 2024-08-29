import { Router } from "express";
import { listarPrograma,registrarPrograma,activarPrograma,inactivarPrograma,actualizarPrograma } from "../controllers/programas.controller.js";
import { validarToken } from "../controllers/seguridad.controller.js";

const rutaPrograma = Router();

rutaPrograma.get("/listar", /* validarToken, */ listarPrograma);
rutaPrograma.post("/registrar", validarToken, registrarPrograma);
rutaPrograma.put("/actualizar/:id", validarToken, actualizarPrograma);
rutaPrograma.put("/inactivar/:id", validarToken, inactivarPrograma);
rutaPrograma.put("/activar/:id", validarToken, activarPrograma);

export default rutaPrograma;