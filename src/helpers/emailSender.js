require('dotenv').config();
const environment = process.env;
const gTransporter = require('../config/email.js');
const dbEmail = require('../model/dbEmail.js');

// Desagregado
const emailSend = async (nombre, email, asunto, texto) => {
  try {
    await gTransporter.verify();
    //verificar si se han enviado mas de 9 000
    const emailsRecientes = await dbEmail.countDocuments({from: environment.GMAIL_USER_NAME, fecha: {$gte: new Date(Date.now()- 24 * 60 * 1000)}});
    if (emailsRecientes>= 9000) {
      console.log(`No se puede enviar el correo desde ${environment.GMAIL_USER_NAME} porque ya se han enviado más de 9,000 correos en las últimas 24 horas`);
      return;
    }

    const mailOptions = {
      from: environment.GMAIL_USER_NAME,
      to: email,
      subject: asunto,
      text: "Este correo fue enviado por: " + nombre,
      html: "<h1>EL MENSAJE ES:</h1><br><p>" + texto + "</p>"
    };

    const enviarCorreo = async (options, intentos = 0) => {
      try {
        const info = await gTransporter.sendMail(options);
        console.log(`Correo enviado a ${options.to}`);
        //Atualizar la fecha en base de datos
        await dbEmail.updateOne({email:email},{fecha: new Date()});
      } catch (error) {
        console.error(`Error al enviar el correo a ${options.to}:`, error);
        if (intentos < 5) { // Limita el número de intentos a 5
          await enviarCorreo(options, intentos + 1); // Llamada recursiva
        } else {
          console.error(`No se pudo enviar el correo a ${options.to} después de ${intentos} intentos`);
        }
      }
    };
    await enviarCorreo(mailOptions);
  } catch (error) {
    console.log(`No se pudo ejecutar el envío: ${error}`);
  }
};

module.exports = emailSend;