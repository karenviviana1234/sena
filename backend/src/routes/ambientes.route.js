import { Router } from "express";
import { listarAmbientes, registrarAmbientes, actualizarAmbientes, activarAmbiente, inactivarAmbiente } from "../controllers/ambientes.controller.js";
import { validarToken } from "../controllers/seguridad.controller.js";

const rutaAmbientes = Router();

rutaAmbientes.get("/listar", validarToken, listarAmbientes);
rutaAmbientes.post("/registrar", validarToken, registrarAmbientes);
rutaAmbientes.put("/actualizar/:id", validarToken, actualizarAmbientes);
rutaAmbientes.put("/activar/:id", validarToken, activarAmbiente);
rutaAmbientes.put("/inactivar/:id", validarToken, inactivarAmbiente);

export default rutaAmbientes;