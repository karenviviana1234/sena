import { Router } from "express";
import { listarEmpresas, registrarEmpresas, actualizarEmpresas, inactivarEmpresa, activarEmpresa } from "../controllers/empresas.controller.js";
import { validarToken } from "../controllers/seguridad.controller.js";

const rutaEmpresas = Router();

rutaEmpresas.get("/listar", validarToken, listarEmpresas);
rutaEmpresas.post("/registrar", validarToken, registrarEmpresas);
rutaEmpresas.put("/actualizar/:id", validarToken, actualizarEmpresas);
rutaEmpresas.put("/inactivar/:id", validarToken, inactivarEmpresa);
rutaEmpresas.put("/activar/:id", validarToken, activarEmpresa);

export default rutaEmpresas;