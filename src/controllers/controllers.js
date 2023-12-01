//controllers
const indexCtrl = {};
const express = require('express')
const dbEmail = require('../model/dbEmail');
const { render } = require('pug');
const app = express();
app.use(express.json());
indexCtrl.trabajador = '';
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
  const { name, email, asunto, text, returnUrl } = req.body;
  let guardado = false;
  if (!name || !email || !asunto || ! text) {
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
      returnUrl,
    });
    // return res.status(400).json({message: 'Lo siento faltan campos obligatorios! '});
  }
  console.log('Datos recibidos:', req.body)
  try {
    const emailNameInclude = await dbEmail.findOne({$or:[{email},{name}]});

    if (emailNameInclude) {
      const datosDuplicados = new dbEmail({
        name: name,
        email: email,
        asunto: asunto,
        text: text
      });
      await datosDuplicados.save().catch((err)=>{
        console.log('Datos no se guardaron: ',err);
        return res.status(500).json({message: 'Lo sentimos mucho su documento no se guardó! '})
      });
    } else {
      const datosNuevos = new dbEmail({
        name: name,
        email: email,
        asunto: asunto,
        text: text
      })
      await datosNuevos.save().catch(err=>{
        console.error('Error al guardar el documento', err);
        return res.status(500).json({message: 'Lo sentimos mucho su documento no se guardó! '});
      });
      guardado = true;
  }
  } catch (error) {
    console.error(`Error al guardar los datos ${email}`, error);
    res.status(500).json({message:'Error al guardar los datos.'});
  }
  if(guardado){
    res.render('enviado', {
      title: "Correo guardado",
      titulo: "Gracias por usar nuestro servicio!",
      guardado: guardado
    });
    return;
  }
};
//Exportar
module.exports = indexCtrl;
