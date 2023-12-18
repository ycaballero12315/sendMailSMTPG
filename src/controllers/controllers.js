//controllers
const indexCtrl = {
  trabajador : '',
};
const express = require('express')
const dbEmail = require('../model/dbEmail');
const { render } = require('pug');
const dbUtils = require('../Utils/dbUtils')
const app = express();
app.use(express.json());
//Aquí se colocan las funciones que realizan en cada peticion
indexCtrl.renderIndex = (req, res) => {
  res.render("index", {
    title: "Empresa de bicicletas",
    url: "",
    contenido: "Bienvenido a nuestra empresa de bicicletas",
  });
};

indexCtrl.renderForm = (req, res) => {
  indexCtrl.trabajador = (req.path.toLowerCase() === "/secretaria")? "de la Secretaria" : (req.path.toLowerCase()==="/mecanico")?"del Mecánico":"";
  
  res.render("sendEmail", {
    title: "Enviar correo",
    trabajador: indexCtrl.trabajador
  });
};

indexCtrl.renderGuardado = async (req, res) => {
  const { name, email, asunto, text } = req.body;
  let guardado = false;
  if (!name || !email || ! text) {
    const returnUrl = req.path.toLowerCase();
    return res.render('sendEmail',{
      title: 'Enviar correo',
      trabajador: indexCtrl.trabajador,
      h4: 'Los datos proporcionados no son correctos!',
      // Pasa los datos del formulario para conservarlos en el renderizado
      name,
      email,
      asunto,
      text,
      // returnUrl,
    });
  }
  dbUtils.saveToDB(req.body,res,indexCtrl.trabajador);
};
//Exportar
module.exports = indexCtrl;
