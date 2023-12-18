const dbEmail = require('../model/dbEmail');
const conectDB = require('../data/db')
// dbUtils.js

async function saveToDB({name, email, asunto, text}, res, trabajador) {

  try {
    const datosDuplicados = new dbEmail({
      name: name,
      email: email,
      asunto: asunto,
      text: text
      });

      await datosDuplicados.save();
      console.log(name, email, asunto, text);
      guardado = true;
    
  } catch (error) {
    console.error(`Error al guardar los datos ${email}`, error);

    // Verifica si el error es de conexión
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    // Puedes tomar acciones específicas aquí, como intentar reconectar
      console.log('Intentando reconectar a la base de datos...');
    // Puedes llamar a la función que realiza la conexión nuevamente
      await conectDB.connect();
      return res.render('sendEmail',{
        title: 'Enviar correo',
        trabajador: trabajador,
        h4: 'No se pudo guardar en base de datos los elementos',
      });
  }
    guardado = false;
  }

  if (guardado) {
    return res.render('enviado', {
      title: "Correo guardado",
      titulo: "Gracias por usar nuestro servicio!",
      guardado: guardado
    });
  }
}

module.exports = { saveToDB };
