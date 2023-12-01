//Configuración de las rutas
const express = require("express");

const router = express.Router();

//importar controllers
const { renderIndex, renderForm, renderGuardado} = require("../controllers/controllers.js");

router.get("/", renderIndex );
// router.get("/enviar", renderForm);
router.get('/secretaria', renderForm);
router.get('/mecanico', renderForm); 
router.post("/enviado", renderGuardado)

module.exports = router;
